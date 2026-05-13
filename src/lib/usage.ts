import { createClient } from '@supabase/supabase-js';

// Server-side client using service role (bypasses RLS for usage writes)
// Falls back gracefully if env vars not set
function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Pro tier limits per month
const LIMITS = {
  explain: 100,
  proposal: 50,
};

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function checkAndIncrementUsage(
  userId: string,
  type: 'explain' | 'proposal'
): Promise<{ allowed: boolean; used: number; limit: number }> {
  const supabase = getServerClient();
  const limit = LIMITS[type];

  // If Supabase not configured, allow all (dev mode)
  if (!supabase) return { allowed: true, used: 0, limit };

  const month = currentMonth();
  const column = `${type}_count`;

  // Get or create usage row for this user+month
  const { data, error } = await supabase
    .from('api_usage')
    .select('explain_count, proposal_count')
    .eq('user_id', userId)
    .eq('month', month)
    .single();

  if (error && error.code !== 'PGRST116') {
    // Real error — allow through rather than block paying user
    console.error('Usage check error:', error);
    return { allowed: true, used: 0, limit };
  }

  const used = data ? (data as Record<string, number>)[column] : 0;

  if (used >= limit) {
    return { allowed: false, used, limit };
  }

  // Increment
  if (!data) {
    await supabase.from('api_usage').insert({
      user_id: userId,
      month,
      explain_count: type === 'explain' ? 1 : 0,
      proposal_count: type === 'proposal' ? 1 : 0,
    });
  } else {
    await supabase
      .from('api_usage')
      .update({ [column]: used + 1 })
      .eq('user_id', userId)
      .eq('month', month);
  }

  return { allowed: true, used: used + 1, limit };
}
