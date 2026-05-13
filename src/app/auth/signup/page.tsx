'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: signupError } = await supabase.auth.signUp({ email, password });
    if (signupError) { setError(signupError.message); setLoading(false); return; }
    router.push('/onboarding');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex' }}>

      {/* Left panel — branding */}
      <div style={{
        width: 440, flexShrink: 0, padding: '48px 52px',
        background: '#0d0d0d',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}
        className="hidden lg:flex"
      >
        <Link href="/" style={{ fontSize: 17, fontWeight: 800, color: '#f5f5f5', letterSpacing: '-0.03em', textDecoration: 'none' }}>
          GovWin AI
        </Link>

        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#f5f5f5', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 16 }}>
            $160 billion reserved for small businesses every year.
          </div>
          <p style={{ fontSize: 15, color: '#525252', lineHeight: 1.7 }}>
            Most never apply. We find the contracts, break them down in plain English, and help you write a winning proposal.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 48 }}>
            {[
              { stat: '97%', label: 'of users find a match in their first search' },
              { stat: '$92K', label: 'average first contract won by our users' },
              { stat: '60s', label: 'to generate a full proposal draft' },
            ].map(item => (
              <div key={item.stat} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#f5f5f5', letterSpacing: '-0.03em', width: 56, flexShrink: 0 }}>
                  {item.stat}
                </div>
                <div style={{ fontSize: 13, color: '#525252', lineHeight: 1.5 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: '#2a2a2a' }}>
          © 2026 GovWin AI
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 32px' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: 380 }}
        >
          {/* Mobile logo */}
          <Link href="/" style={{ fontSize: 16, fontWeight: 800, color: '#f5f5f5', letterSpacing: '-0.03em', textDecoration: 'none', display: 'block', marginBottom: 48 }}
            className="lg:hidden"
          >
            GovWin AI
          </Link>

          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f5f5f5', letterSpacing: '-0.03em', marginBottom: 6 }}>
              Create your account
            </h1>
            <p style={{ fontSize: 14, color: '#525252' }}>
              Start finding government contracts today. Free for 14 days.
            </p>
          </div>

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.22)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.22)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 8,
                background: 'rgba(248,113,113,0.07)',
                border: '1px solid rgba(248,113,113,0.18)',
                fontSize: 13, color: '#f87171',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 6, padding: '13px', borderRadius: 10,
                fontSize: 14, fontWeight: 700,
                background: loading ? 'rgba(255,255,255,0.06)' : '#f5f5f5',
                color: loading ? '#3a3a3a' : '#0a0a0a',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Creating account...' : 'Create account →'}
            </button>
          </form>

          <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 13, color: '#525252', textAlign: 'center' }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: '#f5f5f5', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, color: '#737373',
  display: 'block', marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: 10,
  background: '#111111', border: '1px solid rgba(255,255,255,0.1)',
  color: '#f5f5f5', fontSize: 14,
  fontFamily: 'Inter, -apple-system, sans-serif',
  outline: 'none', transition: 'border-color 0.15s ease',
};
