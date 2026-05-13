'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const features = [
  'Real SAM.gov contract feed',
  'AI contract analysis (100/mo)',
  'AI proposal generation (50/mo)',
  'Profile-based matching',
  'Contract browser with filters',
  'Proposal draft editor',
  'Export proposals to PDF',
];

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, userEmail: user.email }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Failed to start checkout. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>

      {/* Back */}
      <Link href="/dashboard" style={{ position: 'absolute', top: 28, left: 32, fontSize: 13, color: '#525252', textDecoration: 'none' }}>
        ← Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: 420, width: '100%' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#525252', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            GovWin AI
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#f5f5f5', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 12 }}>
            Start winning contracts
          </h1>
          <p style={{ fontSize: 15, color: '#525252', lineHeight: 1.6 }}>
            AI-powered federal contracting for small businesses.
          </p>
        </div>

        {/* Pricing card */}
        <div style={{ borderRadius: 20, background: '#f5f5f5', padding: '36px 32px', color: '#0a0a0a', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.04em' }}>$49</span>
            <span style={{ fontSize: 14, color: '#525252' }}>/month</span>
          </div>
          <p style={{ fontSize: 13, color: '#737373', marginBottom: 28 }}>Cancel anytime. No contracts.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {features.map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0a0a0a' }}>✓</span>
                <span style={{ fontSize: 13, color: '#3a3a3a' }}>{f}</span>
              </div>
            ))}
          </div>

          {error && <p style={{ fontSize: 12, color: '#ef4444', marginBottom: 12 }}>{error}</p>}

          <button
            onClick={handleSubscribe}
            disabled={loading}
            style={{
              width: '100%', padding: '15px', borderRadius: 12,
              background: '#0a0a0a', color: '#f5f5f5',
              fontSize: 15, fontWeight: 700, border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Redirecting to Stripe...' : 'Subscribe — $49/mo'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#3a3a3a', lineHeight: 1.6 }}>
          Secured by Stripe. Your payment info never touches our servers.
        </p>
      </motion.div>
    </div>
  );
}
