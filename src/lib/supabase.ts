import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type Profile = {
  id: string;
  business_name: string;
  location: string;
  naics: string;
  services: string;
  certifications: string[];
  contract_size: string;
  created_at: string;
};

// Lazy singleton — only created when actually used at runtime
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!rawUrl || !key) {
    // Return a dummy client that fails gracefully — app still works with mock data
    throw new Error('Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local');
  }
  // Strip any accidental path suffix (e.g. /rest/v1/) — client needs just the origin
  const url = rawUrl.replace(/\/(rest|auth|storage|realtime)(\/.*)?$/, '').replace(/\/$/, '');
  _client = createClient(url, key);
  return _client;
}

// Proxy object — method calls are forwarded to the real client, but only at runtime
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    try {
      const client = getClient();
      const value = (client as unknown as Record<string | symbol, unknown>)[prop];
      return typeof value === 'function' ? value.bind(client) : value;
    } catch {
      // Return no-op objects so callers don't crash
      if (prop === 'auth') {
        return {
          getUser: async () => ({ data: { user: null }, error: null }),
          signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
          signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
          signOut: async () => ({ error: null }),
        };
      }
      if (prop === 'from') {
        return () => ({
          select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
          upsert: async () => ({ error: null }),
          insert: async () => ({ error: null }),
        });
      }
      return undefined;
    }
  },
});
