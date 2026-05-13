import { NextRequest, NextResponse } from 'next/server';
import { searchContracts } from '@/lib/sam-api';

export async function GET(req: NextRequest) {
  const naics = req.nextUrl.searchParams.get('naics');
  if (!naics) {
    return NextResponse.json({ error: 'naics param required' }, { status: 400 });
  }

  try {
    const contracts = await searchContracts(naics, 25);
    return NextResponse.json({ contracts });
  } catch (err) {
    console.error('contracts route error:', err);
    return NextResponse.json({ error: 'Failed to fetch contracts' }, { status: 500 });
  }
}
