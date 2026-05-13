'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AppSidebar from '@/components/AppSidebar';
import { mockContracts, mockUser } from '@/lib/mockData';
import { supabase, type Profile } from '@/lib/supabase';
import type { Contract } from '@/lib/sam-api';

type AnyContract = typeof mockContracts[0] | Contract;

function MatchBadge({ score }: { score: number }) {
  const bg = score >= 90 ? '#f5f5f5' : 'rgba(255,255,255,0.07)';
  const color = score >= 90 ? '#0a0a0a' : '#737373';
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: bg, color }}>
      {score}% match
    </span>
  );
}

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

function SkeletonRow() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 20,
      padding: '18px 22px', borderRadius: 12,
      background: '#141414', border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.04)' }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 14, width: '60%', borderRadius: 6, background: 'rgba(255,255,255,0.05)', marginBottom: 8 }} />
        <div style={{ height: 11, width: '40%', borderRadius: 6, background: 'rgba(255,255,255,0.03)' }} />
      </div>
      <div style={{ height: 14, width: 60, borderRadius: 6, background: 'rgba(255,255,255,0.04)' }} />
    </div>
  );
}

export default function Dashboard() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const [contracts, setContracts] = useState<AnyContract[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    async function load() {
      // 1. Get user profile from Supabase
      let userProfile: Profile | null = null;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
          userProfile = data as Profile | null;
          setProfile(userProfile);
        }
      } catch {
        // Supabase not configured — use mock
      }

      // 2. Fetch real contracts from SAM.gov if we have a NAICS code
      const naics = userProfile?.naics;
      if (naics) {
        try {
          const res = await fetch(`/api/contracts?naics=${naics}`);
          if (res.ok) {
            const data = await res.json();
            if (data.contracts?.length > 0) {
              setContracts(data.contracts);
              // Cache for contract detail pages
              sessionStorage.setItem('contracts', JSON.stringify(data.contracts));
              setLoading(false);
              return;
            }
          }
        } catch {
          // Fall through to mock
        }
      }

      // 3. Fallback: use mock data
      setContracts(mockContracts);
      setUsingMock(true);
      setLoading(false);
    }

    load();
  }, []);

  const displayName = profile?.business_name
    ? profile.business_name
    : mockUser.name.split(' ')[0];

  const firstName = profile
    ? profile.business_name?.split(' ')[0] || 'there'
    : mockUser.name.split(' ')[0];

  const topMatches = contracts.filter(c => c.match >= 85);
  const otherMatches = contracts.filter(c => c.match < 85);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      <AppSidebar />

      <main style={{ marginLeft: 220, flex: 1, padding: '40px 48px', maxWidth: 1100 }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 12, color: '#3a3a3a', marginBottom: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{today}</p>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#f5f5f5', letterSpacing: '-0.04em', marginBottom: 8, lineHeight: 1.1 }}>
            Good morning, {firstName}.
          </h1>
          <p style={{ fontSize: 15, color: '#525252', lineHeight: 1.5 }}>
            {loading ? 'Finding contracts that match your profile...' : (
              <>
                <span style={{ color: '#f5f5f5', fontWeight: 600 }}>{topMatches.length} strong matches</span>
                {' '}found today for {displayName}.
                {usingMock && <span style={{ color: '#3a3a3a' }}> (sample data)</span>}
              </>
            )}
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 48 }}>
          {[
            { label: "Today's matches", value: loading ? '—' : contracts.length, sub: 'New contracts found' },
            { label: 'Strong matches', value: loading ? '—' : topMatches.length, sub: '85%+ fit score' },
            { label: 'Days to deadline', value: loading || contracts.length === 0 ? '—' : contracts[0].daysLeft, sub: 'Earliest contract due', warn: !loading && contracts.length > 0 && contracts[0].daysLeft <= 14 },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{ padding: '22px 24px', borderRadius: 14, background: '#141414', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div style={{ fontSize: 36, fontWeight: 800, color: stat.warn ? '#f87171' : '#f5f5f5', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#a3a3a3', marginBottom: 2 }}>{stat.label}</div>
              <div style={{ fontSize: 11, color: '#3a3a3a' }}>{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3].map(i => <SkeletonRow key={i} />)}
          </div>
        )}

        {/* Strong matches */}
        {!loading && topMatches.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#3a3a3a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Strong matches
              </h2>
              <span style={{ fontSize: 11, color: '#3a3a3a' }}>{topMatches.length} contracts</span>
            </div>
            <motion.div
              variants={stagger.container}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              {topMatches.map((contract) => (
                <motion.div key={contract.id} variants={stagger.item}>
                  <Link
                    href={`/contract/${contract.id}`}
                    className="contract-row"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 20,
                      padding: '18px 22px', borderRadius: 12,
                      background: '#141414', border: '1px solid rgba(255,255,255,0.07)',
                      textDecoration: 'none',
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, color: '#737373', letterSpacing: '0.02em',
                    }}>
                      {contract.agencyShort}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f5', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {contract.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#525252', display: 'flex', gap: 16 }}>
                        <span>{contract.location}</span>
                        <span>{contract.setAside}</span>
                        <span style={{ color: contract.daysLeft <= 14 ? '#f87171' : '#525252' }}>
                          {contract.daysLeft}d left
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#f5f5f5' }}>{contract.value}</span>
                      <MatchBadge score={contract.match} />
                      <span style={{ fontSize: 18, color: '#333' }}>›</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Other matches */}
        {!loading && otherMatches.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#3a3a3a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Other matches
              </h2>
              <span style={{ fontSize: 11, color: '#3a3a3a' }}>{otherMatches.length} contracts</span>
            </div>
            <motion.div
              variants={stagger.container}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              {otherMatches.map((contract) => (
                <motion.div key={contract.id} variants={stagger.item}>
                  <Link
                    href={`/contract/${contract.id}`}
                    className="contract-row"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 20,
                      padding: '14px 22px', borderRadius: 12,
                      background: 'transparent', border: '1px solid rgba(255,255,255,0.05)',
                      textDecoration: 'none',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#a3a3a3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {contract.title}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                      <span style={{ fontSize: 13, color: '#525252' }}>{contract.value}</span>
                      <MatchBadge score={contract.match} />
                      <span style={{ fontSize: 16, color: '#333' }}>›</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
