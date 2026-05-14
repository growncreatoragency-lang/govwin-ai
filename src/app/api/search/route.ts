import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { searchContracts, type Contract } from '@/lib/sam-api';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Local NAICS fallback if Claude is unavailable
const NAICS_MAP: Record<string, string> = {
  'it': '541512', 'information technology': '541512', 'help desk': '541512', 'tech support': '541512',
  'software': '541511', 'web': '541511', 'app': '541511', 'development': '541511',
  'cybersecurity': '541519', 'security': '541519', 'network': '541519',
  'cloud': '541519', 'data': '541519', 'infrastructure': '541519',
  'staffing': '561320', 'recruiting': '561310', 'hr': '561312', 'human resources': '561320',
  'janitorial': '561720', 'cleaning': '561720', 'custodial': '561720',
  'construction': '236220', 'building': '236220', 'renovation': '236220',
  'consulting': '541611', 'management': '541611', 'advisory': '541611',
  'logistics': '488510', 'transportation': '488510', 'shipping': '488510',
  'training': '611430', 'education': '611430', 'learning': '611430',
  'catering': '722310', 'food': '722310', 'food service': '722310',
  'landscaping': '561730', 'grounds': '561730',
  'medical': '621111', 'healthcare': '621111', 'nursing': '621399',
  'accounting': '541211', 'finance': '541211', 'audit': '541211',
  'legal': '541110', 'attorney': '541110',
  'engineering': '541330', 'architect': '541310',
  'facilities': '561110', 'maintenance': '561110',
  'security guard': '561612', 'guard': '561612',
  'environmental': '562910', 'waste': '562111',
  'printing': '323111', 'hardware': '334111',
};

// Related NAICS codes to try when primary returns no results
const NAICS_SIBLINGS: Record<string, string[]> = {
  '722310': ['722320', '722330', '722514'],
  '541512': ['541511', '541519', '541513'],
  '541519': ['541512', '541511', '541513'],
  '561720': ['561710', '561730', '561790'],
  '236220': ['236210', '237110', '238910'],
  '561320': ['561310', '561330', '561110'],
  '541611': ['541612', '541613', '541618'],
  '488510': ['488190', '484110', '484121'],
  '621111': ['621112', '621399', '621210'],
};

function guessNaics(query: string): string {
  const lower = query.toLowerCase();
  for (const [key, naics] of Object.entries(NAICS_MAP)) {
    if (lower.includes(key)) return naics;
  }
  return '';
}

async function searchWithFallbacks(naicsCode: string): Promise<{ contracts: Contract[]; usedNaics: string }> {
  // Try primary NAICS
  try {
    const results = await searchContracts(naicsCode, 40);
    if (results.length > 0) return { contracts: results, usedNaics: naicsCode };
  } catch { /* try siblings */ }

  // Try sibling NAICS codes
  const siblings = NAICS_SIBLINGS[naicsCode] || [];
  for (const sibling of siblings) {
    try {
      const results = await searchContracts(sibling, 40);
      if (results.length > 0) return { contracts: results, usedNaics: sibling };
    } catch { /* try next */ }
  }

  // Broaden to 4-digit prefix
  const prefix = naicsCode.slice(0, 4);
  for (const suffix of ['00', '10', '11', '12', '20', '30', '40']) {
    const broad = prefix + suffix;
    if (broad === naicsCode) continue;
    try {
      const results = await searchContracts(broad, 40);
      if (results.length > 0) return { contracts: results, usedNaics: broad };
    } catch { /* try next */ }
  }

  return { contracts: [], usedNaics: naicsCode };
}

export async function POST(req: NextRequest) {
  try {
    const { query, userProfile } = await req.json();
    if (!query) return NextResponse.json({ error: 'Missing query' }, { status: 400 });

    // Step 1: Use Claude to extract NAICS code from natural language
    const systemPrompt = `You are a federal contracting search assistant. Parse the user's query into SAM.gov search parameters.

Return ONLY valid JSON (no markdown):
{
  "naicsCode": "best matching 6-digit NAICS code — always provide one",
  "keywords": "2-4 core keywords from the query",
  "explanation": "one sentence: what you're searching for and why this NAICS fits"
}

NAICS reference:
541512=IT/Help Desk, 541511=Software Dev, 541519=Cybersecurity/Cloud/Network,
561320=Staffing, 561720=Janitorial/Cleaning, 236220=Construction,
541611=Management Consulting, 722310=Food/Catering, 561730=Landscaping,
611430=Training, 541330=Engineering, 621111=Medical/Healthcare,
541211=Accounting/Finance, 488510=Logistics, 561110=Facilities Management,
334111=Computer Hardware, 561612=Security Guards, 562910=Environmental

User profile: ${userProfile ? `NAICS ${userProfile.naics || 'unknown'}, ${userProfile.business_name || ''}` : 'not provided'}`;

    let naicsCode = '';
    let keywords = query;
    let explanation = `Searching for: ${query}`;

    try {
      const message = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 200,
        messages: [{ role: 'user', content: query }],
        system: systemPrompt,
      });
      const text = (message.content[0] as { text: string }).text;
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
      naicsCode = parsed.naicsCode || '';
      keywords = parsed.keywords || query;
      explanation = parsed.explanation || explanation;
    } catch { /* fall through to local guess */ }

    if (!naicsCode) naicsCode = guessNaics(query);

    if (!naicsCode) {
      return NextResponse.json({
        contracts: [],
        explanation: `Couldn't identify a contract category for "${query}". Try: "IT help desk", "janitorial services", "construction", "staffing", "catering".`,
        searchedFor: { keywords, naics: '', setAside: '' },
      });
    }

    // Step 2: Search SAM.gov by NAICS only (keyword search requires paid API key)
    const { contracts: raw, usedNaics } = await searchWithFallbacks(naicsCode);

    // Step 3: Filter client-side by keywords
    let contracts = raw;
    if (contracts.length > 0 && keywords) {
      const kwds = keywords.toLowerCase().split(/\s+/).filter((k: string) => k.length > 2);
      const filtered = contracts.filter(c => {
        const text = `${c.title} ${c.agency} ${c.description}`.toLowerCase();
        return kwds.some((k: string) => text.includes(k));
      });
      if (filtered.length > 0) contracts = filtered;
    }

    contracts = contracts.slice(0, 20);

    return NextResponse.json({
      contracts,
      explanation: contracts.length > 0
        ? `${explanation} (NAICS ${usedNaics})`
        : `${explanation} (NAICS ${usedNaics}) — no active contracts right now. SAM.gov updates daily, check back tomorrow or try broader keywords.`,
      searchedFor: { keywords, naics: usedNaics, setAside: '' },
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Search error:', msg);
    return NextResponse.json({ error: 'Search failed', detail: msg }, { status: 500 });
  }
}
