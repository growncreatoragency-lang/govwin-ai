import { NextRequest, NextResponse } from 'next/server';
import { generateProposal } from '@/lib/claude';
import { checkAndIncrementUsage } from '@/lib/usage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contract, userProfile, userId } = body;

    if (!contract || !userProfile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Rate limiting — only if userId provided (authenticated users)
    if (userId) {
      const { allowed, used, limit } = await checkAndIncrementUsage(userId, 'proposal');
      if (!allowed) {
        return NextResponse.json(
          { error: `Monthly limit reached (${used}/${limit} proposals). Upgrade for more.` },
          { status: 429 }
        );
      }
    }

    const proposal = await generateProposal(contract, userProfile);
    return NextResponse.json(proposal);
  } catch (err) {
    console.error('proposal route error:', err);
    return NextResponse.json({ error: 'Failed to generate proposal' }, { status: 500 });
  }
}
