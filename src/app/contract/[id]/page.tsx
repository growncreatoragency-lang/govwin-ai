'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AppSidebar from '@/components/AppSidebar';
import { mockContracts, mockUser } from '@/lib/mockData';
import { supabase } from '@/lib/supabase';
import type { Contract } from '@/lib/sam-api';
import type { ContractBreakdown } from '@/lib/claude';

type AnyContract = typeof mockContracts[0] | Contract;

function AIBreakdown({ breakdown, loading }: { breakdown: ContractBreakdown | null; loading: boolean }) {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%', background: '#f5f5f5',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
          <span style={{ fontSize: 13, color: '#525252' }}>Claude is analyzing this contract...</span>
        </div>
        {[80, 60, 70, 55].map((w, i) => (
          <div key={i} style={{ height: 13, width: `${w}%`, borderRadius: 6, background: 'rgba(255,255,255,0.04)' }} />
        ))}
      </div>
    );
  }

  if (!breakdown) {
    return <p style={{ fontSize: 13, color: '#525252' }}>Analysis unavailable. Check API configuration.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#525252', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Summary
        </div>
        <p style={{ fontSize: 14, color: '#a3a3a3', lineHeight: 1.75 }}>{breakdown.summary}</p>
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#525252', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Who can apply
        </div>
        <p style={{ fontSize: 14, color: '#a3a3a3', lineHeight: 1.75 }}>{breakdown.whoCanApply}</p>
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#525252', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Key requirements
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {breakdown.keyRequirements.map((req, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#a3a3a3' }}>
              <span style={{ color: '#f5f5f5', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>+</span>
              {req}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ padding: '16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#525252', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Our take
        </div>
        <p style={{ fontSize: 13, color: '#a3a3a3', lineHeight: 1.7 }}>{breakdown.ourTake}</p>
      </div>
    </div>
  );
}

export default function ContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [contract, setContract] = useState<AnyContract | null>(null);
  const [breakdown, setBreakdown] = useState<ContractBreakdown | null>(null);
  const [loadingBreakdown, setLoadingBreakdown] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // 1. Try sessionStorage (from dashboard fetch)
    let found: AnyContract | null = null;
    try {
      const cached = sessionStorage.getItem('contracts');
      if (cached) {
        const contracts: AnyContract[] = JSON.parse(cached);
        found = contracts.find((c) => c.id === id) || null;
      }
    } catch { /* ignore */ }

    // 2. Fallback to mock data
    if (!found) {
      found = mockContracts.find((c) => c.id === id) || null;
    }

    if (!found) {
      setNotFound(true);
      return;
    }

    setContract(found);

    // 3. Fetch AI breakdown
    async function fetchBreakdown(c: AnyContract) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        let userProfile = { businessName: mockUser.businessName, location: mockUser.location, services: mockUser.services, certifications: [] as string[] };

        if (user) {
          const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
          if (data) {
            userProfile = {
              businessName: data.business_name,
              location: data.location,
              services: data.services,
              certifications: data.certifications || [],
            };
          }
        }

        const res = await fetch('/api/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contractTitle: c.title,
            contractDescription: c.description,
            userProfile,
            userId: user?.id,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setBreakdown(data);
        } else {
          // Fall back to mock breakdown if available
          const mock = mockContracts.find((m) => m.id === id);
          if (mock?.aiBreakdown?.summary) setBreakdown(mock.aiBreakdown);
        }
      } catch {
        const mock = mockContracts.find((m) => m.id === id);
        if (mock?.aiBreakdown?.summary) setBreakdown(mock.aiBreakdown);
      } finally {
        setLoadingBreakdown(false);
      }
    }

    fetchBreakdown(found);
  }, [id]);

  if (notFound) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
        <AppSidebar />
        <main style={{ marginLeft: 220, flex: 1, padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f5f5f5', marginBottom: 12 }}>Contract not found</h1>
            <Link href="/dashboard" style={{ fontSize: 14, color: '#525252', textDecoration: 'none' }}>← Back to Dashboard</Link>
          </div>
        </main>
      </div>
    );
  }

  if (!contract) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
        <AppSidebar />
        <main style={{ marginLeft: 220, flex: 1, padding: '40px 48px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 20, borderRadius: 8, background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  const deadline = new Date(contract.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      <AppSidebar />
      <main style={{ marginLeft: 220, flex: 1, padding: '40px 48px', maxWidth: 1100 }}>

        <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#525252', textDecoration: 'none', marginBottom: 32 }}>
          ← Back to Dashboard
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.07)', color: '#737373', letterSpacing: '0.04em' }}>
                  {contract.agencyShort}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6, background: '#f5f5f5', color: '#0a0a0a' }}>
                  {contract.match}% match
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: '#737373', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {contract.setAside}
                </span>
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f5f5f5', letterSpacing: '-0.02em', lineHeight: 1.2, maxWidth: 640 }}>
                {contract.title}
              </h1>
            </div>
            <Link
              href={`/proposal/${contract.id}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 22px', borderRadius: 10,
                background: '#f5f5f5', color: '#0a0a0a',
                fontWeight: 700, fontSize: 13, textDecoration: 'none',
                flexShrink: 0, whiteSpace: 'nowrap',
              }}
            >
              Write Proposal →
            </Link>
          </div>

          {/* Meta bar */}
          <div style={{
            display: 'flex', gap: 0, padding: '20px 0',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            marginBottom: 40, flexWrap: 'wrap',
          }}>
            {[
              { label: 'Value', value: contract.value },
              { label: 'Deadline', value: deadline },
              { label: 'Days left', value: `${contract.daysLeft}d`, warn: contract.daysLeft <= 14 },
              { label: 'Location', value: contract.location },
              { label: 'NAICS', value: contract.naics },
              { label: 'Solicitation #', value: contract.solicitationNumber },
            ].map((item, i) => (
              <div key={item.label} style={{ paddingRight: 36, marginBottom: 8, borderRight: i < 5 ? '1px solid rgba(255,255,255,0.06)' : 'none', marginRight: i < 5 ? 36 : 0 }}>
                <div style={{ fontSize: 10, color: '#3a3a3a', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: (item as { warn?: boolean }).warn ? '#f87171' : '#f5f5f5', letterSpacing: '-0.01em' }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div style={{ padding: '28px', borderRadius: 16, background: '#141414', border: '1px solid rgba(255,255,255,0.07)', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <h2 style={{ fontSize: 13, fontWeight: 700, color: '#f5f5f5', letterSpacing: '-0.01em' }}>AI Breakdown</h2>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.07)', color: '#525252', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Powered by Claude
                </span>
              </div>
              <AIBreakdown breakdown={breakdown} loading={loadingBreakdown} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <div style={{ padding: '28px', borderRadius: 16, background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', height: '100%' }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: '#f5f5f5', letterSpacing: '-0.01em', marginBottom: 20 }}>Official Description</h2>
              <p style={{ fontSize: 13, color: '#737373', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>
                {contract.description || 'See the official SAM.gov posting for the full description.'}
              </p>
              <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: 11, color: '#3a3a3a', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Posted</p>
                <p style={{ fontSize: 13, color: '#525252' }}>
                  {new Date(contract.postedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ marginTop: 32, padding: '24px 28px', borderRadius: 16, background: '#141414', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f5f5f5', marginBottom: 4 }}>Ready to bid on this contract?</div>
            <div style={{ fontSize: 13, color: '#525252' }}>AI will pre-fill your proposal using your business profile and this contract&apos;s requirements.</div>
          </div>
          <Link
            href={`/proposal/${contract.id}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, background: '#f5f5f5', color: '#0a0a0a', fontWeight: 700, fontSize: 14, textDecoration: 'none', flexShrink: 0 }}
          >
            Start Proposal
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
