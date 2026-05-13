import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { searchContractsByParams, type Contract } from '@/lib/sam-api';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Common NAICS codes for federal contracting
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
};

function guessNaics(query: string): string {
  const lower = query.toLowerCase();
  for (const [key, naics] of Object.entries(NAICS_MAP)) {
    if (lower.includes(key)) return naics;
  }
  return '';
}

export async function POST(req: NextRequest) {
  try {
    const { query, userProfile } = await req.json();
    if (!query) return NextResponse.json({ error: 'Missing query' }, { status: 400 });

    // Step 1: Claude parses the query to extract NAICS + explanation
    const systemPrompt = `You are a federal contracting search assistant. Parse the user's natural language query into SAM.gov search parameters.

Return ONLY valid JSON:
{
  "naicsCode": "best matching 6-digit NAICS code — always provide one if possible",
  "keywords": "2-4 core keywords from the query",
  "setAside": "SBA | 8A | HZC | WOSB | SDVOSB | empty string",
  "explanation": "one sentence: what you're searching for and why this NAICS code fits"
}

NAICS reference (use these exact codes):
541512=IT/Computer Services, 541511=Software Dev, 541519=Cybersecurity/Network,
561320=Staffing, 561720=Janitorial, 236220=Construction, 541611=Management Consulting,
722310=Food/Catering, 561730=Landscaping, 611430=Training, 541330=Engineering,
621111=Medical/Healthcare, 541211=Accounting, 488510=Logistics/Transportation,
561110=Facilities Management, 334111=Computer Hardware, 511210=Software Publishing

User profile: ${userProfile ? `NAICS ${userProfile.naics || 'unknown'}, ${userProfile.business_name || ''}` : 'not provided'}`;

    let naicsCode = '';
    let keywords = query;
    let setAside = '';
    let explanation = `Searching for: ${query}`;

    try {
      const message = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 250,
        messages: [{ role: 'user', content: query }],
        system: systemPrompt,
      });

      const text = (message.content[0] as { text: string }).text;
      const cleaned = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      naicsCode = parsed.naicsCode || '';
      keywords = parsed.keywords || query;
      setAside = parsed.setAside || '';
      explanation = parsed.explanation || explanation;
    } catch { /* use local fallback */ }

    // Fallback: guess NAICS from query locally if Claude didn't provide one
    if (!naicsCode) naicsCode = guessNaics(query);

    // Step 2: Search SAM.gov with all extracted params
    let contracts: Contract[] = [];
    let usedNaics = naicsCode;

    try {
      contracts = await searchContractsByParams({ keywords, naicsCode, setAside, limit: 40 });
    } catch {
      // Broaden NAICS to 4-digit prefix and retry
      if (naicsCode) {
        usedNaics = naicsCode.slice(0, 4) + '00';
        try {
          contracts = await searchContractsByParams({ keywords, naicsCode: usedNaics, setAside, limit: 40 });
        } catch { /* no results */ }
      }
    }

    // Limit to 20 results
    contracts = contracts.slice(0, 20);

    return NextResponse.json({
      contracts,
      explanation: naicsCode
        ? `${explanation} (NAICS ${usedNaics})`
        : `${explanation} — no matching NAICS code found, try being more specific.`,
      searchedFor: { keywords, naics: usedNaics, setAside },
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Search error:', msg);
    return NextResponse.json({ error: 'Search failed', detail: msg }, { status: 500 });
  }
}
