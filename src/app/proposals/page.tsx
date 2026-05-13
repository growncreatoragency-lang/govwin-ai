'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AppSidebar from '@/components/AppSidebar';

interface SavedProposal {
  contractId: string;
  contractTitle: string;
  agency: string;
  value: string;
  savedAt: string;
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<SavedProposal[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('saved_proposals');
      if (saved) setProposals(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const handleDelete = (contractId: string) => {
    const updated = proposals.filter(p => p.contractId !== contractId);
    setProposals(updated);
    localStorage.setItem('saved_proposals', JSON.stringify(updated));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      <AppSidebar />
      <main style={{ marginLeft: 220, flex: 1, padding: '40px 48px', maxWidth: 900 }}>

        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f5f5f5', letterSpacing: '-0.03em', marginBottom: 6 }}>
            Proposals
          </h1>
          <p style={{ fontSize: 14, color: '#525252' }}>
            {proposals.length > 0 ? `${proposals.length} saved draft${proposals.length !== 1 ? 's' : ''}` : 'Your proposal drafts will appear here'}
          </p>
        </div>

        {proposals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center', padding: '80px 40px',
              borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)',
              background: '#141414',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 16 }}>◉</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f5f5f5', marginBottom: 10 }}>
              No proposals yet
            </h2>
            <p style={{ fontSize: 14, color: '#525252', marginBottom: 28, lineHeight: 1.6, maxWidth: 380, margin: '0 auto 28px' }}>
              Browse contracts and click &ldquo;Write Proposal&rdquo; to generate an AI-powered bid. Your drafts will be saved here.
            </p>
            <Link
              href="/contracts"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 10,
                background: '#f5f5f5', color: '#0a0a0a',
                fontWeight: 700, fontSize: 14, textDecoration: 'none',
              }}
            >
              Browse Contracts →
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            {proposals.map((p) => (
              <motion.div
                key={p.contractId}
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 20,
                  padding: '20px 24px', borderRadius: 14,
                  background: '#141414', border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f5', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.contractTitle}
                  </div>
                  <div style={{ fontSize: 12, color: '#525252', display: 'flex', gap: 14 }}>
                    <span>{p.agency}</span>
                    <span>{p.value}</span>
                    <span>Saved {new Date(p.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <Link
                    href={`/proposal/${p.contractId}`}
                    style={{
                      padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                      background: '#f5f5f5', color: '#0a0a0a', textDecoration: 'none',
                    }}
                  >
                    Open Draft
                  </Link>
                  <button
                    onClick={() => handleDelete(p.contractId)}
                    style={{
                      padding: '8px 14px', borderRadius: 8, fontSize: 12,
                      background: 'transparent', color: '#3a3a3a',
                      border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#3a3a3a'; }}
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
