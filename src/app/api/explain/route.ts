import { NextRequest, NextResponse } from 'next/server';
import { explainContract } from '@/lib/claude';
import { checkAndIncrementUsage } from '@/lib/usage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractTitle, contractDescription, userProfile, userId } = body;

    if (!contractTitle || !contractDescription || !userProfile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Rate limiting — only if userId provided (authenticated users)
    if (userId) {
      const { allowed, used, limit } = await checkAndIncrementUsage(userId, 'explain');
      if (!allowed) {
        return NextResponse.json(
          { error: `Monthly limit reached (${used}/${limit} contract analyses). Upgrade for more.` },
          { status: 429 }
        );
      }
    }

    const breakdown = await explainContract(contractTitle, contractDescription, userProfile);
    return NextResponse.json(breakdown);
  } catch (err) {
    console.error('explain route error:', err);
    return NextResponse.json({ error: 'Failed to analyze contract' }, { status: 500 });
  }
}
