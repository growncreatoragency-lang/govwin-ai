import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'NOT SET';
  const anthropic = process.env.ANTHROPIC_API_KEY || 'NOT SET';

  // Log to server terminal so we can see what's actually there
  console.log('[DEBUG] ANTHROPIC_API_KEY exists:', !!process.env.ANTHROPIC_API_KEY);
  console.log('[DEBUG] All env keys with ANTH:', Object.keys(process.env).filter(k => k.includes('ANTH')));
  console.log('[DEBUG] All env keys count:', Object.keys(process.env).length);

  return NextResponse.json({
    supabaseUrl: url,
    supabaseKeyPrefix: key.slice(0, 10) + '...',
    anthropicKeyPrefix: anthropic.slice(0, 10) + '...',
    anthropicExists: !!process.env.ANTHROPIC_API_KEY,
    allAnthKeys: Object.keys(process.env).filter(k => k.includes('ANTH')),
  });
}
