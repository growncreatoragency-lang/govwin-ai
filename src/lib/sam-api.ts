// SAM.gov Opportunities API — https://api.sam.gov/opportunities/v2/search
// Free public access, no API key needed (10 req/min limit)
// Set SAM_GOV_API_KEY in .env.local for higher rate limits (free registration at sam.gov)

export interface Contract {
  id: string;
  title: string;
  agency: string;
  agencyShort: string;
  value: string;
  deadline: string;
  daysLeft: number;
  match: number;
  naics: string;
  location: string;
  setAside: string;
  description: string;
  solicitationNumber: string;
  postedDate: string;
  aiBreakdown: {
    summary: string;
    whoCanApply: string;
    keyRequirements: string[];
    ourTake: string;
  };
}

const BASE_URL = 'https://api.sam.gov/opportunities/v2/search';

function formatDate(d: Date): string {
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${m}/${day}/${d.getFullYear()}`;
}

function formatValue(amount?: number): string {
  if (!amount || amount === 0) return 'See posting';
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${Math.round(amount / 1000)}K`;
  return `$${amount.toLocaleString()}`;
}

function deriveAgencyShort(agency: string): string {
  const map: Record<string, string> = {
    'DEPARTMENT OF DEFENSE': 'DOD',
    'DEPARTMENT OF VETERANS AFFAIRS': 'VA',
    'GENERAL SERVICES ADMINISTRATION': 'GSA',
    'DEPARTMENT OF HOMELAND SECURITY': 'DHS',
    'DEPARTMENT OF STATE': 'DOS',
    'DEPARTMENT OF HEALTH AND HUMAN SERVICES': 'HHS',
    'DEPARTMENT OF TRANSPORTATION': 'DOT',
    'DEPARTMENT OF JUSTICE': 'DOJ',
    'DEPARTMENT OF ENERGY': 'DOE',
    'DEPARTMENT OF AGRICULTURE': 'USDA',
    'DEPARTMENT OF INTERIOR': 'DOI',
    'DEPARTMENT OF LABOR': 'DOL',
    'SMALL BUSINESS ADMINISTRATION': 'SBA',
    'SOCIAL SECURITY ADMINISTRATION': 'SSA',
    'DEPARTMENT OF EDUCATION': 'ED',
    'DEPARTMENT OF COMMERCE': 'DOC',
    'DEPARTMENT OF TREASURY': 'TREAS',
    'DEPARTMENT OF HOUSING': 'HUD',
  };
  const upper = agency.toUpperCase();
  for (const [key, val] of Object.entries(map)) {
    if (upper.includes(key)) return val;
  }
  // Fallback: first 3-4 chars of last word
  const words = agency.trim().split(/\s+/);
  return words[words.length - 1].slice(0, 4).toUpperCase();
}

function mapToContract(opp: Record<string, unknown>, naicsCode: string): Contract {
  const deadlineStr = (opp.responseDeadLine as string) || (opp.archiveDate as string);
  const deadline = deadlineStr ? new Date(deadlineStr) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const agency = (opp.fullParentPathName as string) ||
    ((opp.organizationHierarchy as Array<{ name: string }>)?.[0]?.name) ||
    'Federal Agency';

  const placeOfPerf = opp.placeOfPerformance as Record<string, { name?: string; code?: string }> | undefined;
  const city = placeOfPerf?.city?.name;
  const state = placeOfPerf?.state?.code;
  const location = city ? `${city}, ${state || ''}`.trim() : 'Various Locations';

  const award = opp.award as { amount?: number } | undefined;
  const baseValue = opp.baseAndAllOptionsValue as number | undefined;

  return {
    id: (opp.noticeId as string) || (opp.solicitationNumber as string) || Math.random().toString(36).slice(2),
    title: (opp.title as string) || 'Untitled Opportunity',
    agency,
    agencyShort: deriveAgencyShort(agency),
    value: formatValue(award?.amount || baseValue),
    deadline: deadline.toISOString(),
    daysLeft,
    match: Math.min(99, Math.floor(Math.random() * 18 + 78)), // TODO: real matching
    naics: (opp.naicsCode as string) || naicsCode,
    location,
    setAside: (opp.typeOfSetAsideDescription as string) || (opp.typeOfSetAside as string) || 'Full & Open',
    description: ((opp.description as string) || '').slice(0, 1200),
    solicitationNumber: (opp.solicitationNumber as string) || (opp.noticeId as string) || 'N/A',
    postedDate: (opp.postedDate as string) || new Date().toISOString(),
    aiBreakdown: { summary: '', whoCanApply: '', keyRequirements: [], ourTake: '' },
  };
}

export interface SearchParams {
  keywords?: string;
  naicsCode?: string;
  setAside?: string;
  limit?: number;
}

export async function searchContractsByParams(params: SearchParams): Promise<Contract[]> {
  const today = new Date();
  const ninetyDaysAgo = new Date(today);
  ninetyDaysAgo.setDate(today.getDate() - 90);

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (process.env.SAM_GOV_API_KEY) headers['X-API-Key'] = process.env.SAM_GOV_API_KEY;

  async function doSearch(overrideParams?: Partial<SearchParams>): Promise<Contract[]> {
    const p = { ...params, ...overrideParams };
    const query = new URLSearchParams({
      limit: String(p.limit || 20),
      postedFrom: formatDate(ninetyDaysAgo),
      postedTo: formatDate(today),
      active: 'true',
      ptype: 'o',
    });
    if (p.keywords) query.set('q', p.keywords);
    if (p.naicsCode) query.set('naicsCode', p.naicsCode);
    if (p.setAside) query.set('typeOfSetAside', p.setAside);

    const res = await fetch(`${BASE_URL}?${query}`, { headers });
    if (!res.ok) throw new Error(`SAM.gov API error: ${res.status}`);
    const data = await res.json();
    const opps: Record<string, unknown>[] = data.opportunitiesData || [];
    return opps.map((opp) => mapToContract(opp, p.naicsCode || ''));
  }

  // Try with keywords first
  try {
    return await doSearch();
  } catch {
    // If keyword search fails (e.g. 404), try without keywords (NAICS only)
    if (params.naicsCode) {
      try {
        return await doSearch({ keywords: undefined });
      } catch { /* fall through */ }
    }
    // Last resort: broad search with just keywords, no NAICS
    if (params.keywords) {
      try {
        return await doSearch({ naicsCode: undefined });
      } catch { /* fall through */ }
    }
    throw new Error('SAM.gov search failed — try a different query or NAICS code');
  }
}

export async function searchContracts(naicsCode: string, limit = 20): Promise<Contract[]> {
  const today = new Date();
  const sixtyDaysAgo = new Date(today);
  sixtyDaysAgo.setDate(today.getDate() - 180); // 180 days to catch more active opportunities

  const params = new URLSearchParams({
    naicsCode,
    limit: String(limit),
    postedFrom: formatDate(sixtyDaysAgo),
    postedTo: formatDate(today),
    active: 'true',
    ptype: 'o', // solicitation type: presolicitation + solicitation
  });

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (process.env.SAM_GOV_API_KEY) {
    headers['X-API-Key'] = process.env.SAM_GOV_API_KEY;
  }

  const res = await fetch(`${BASE_URL}?${params}`, { headers });

  if (!res.ok) {
    throw new Error(`SAM.gov API error: ${res.status}`);
  }

  const data = await res.json();
  const opps: Record<string, unknown>[] = data.opportunitiesData || [];
  return opps.map((opp) => mapToContract(opp, naicsCode));
}
