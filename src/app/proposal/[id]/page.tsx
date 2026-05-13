'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AppSidebar from '@/components/AppSidebar';
import { mockContracts, mockUser } from '@/lib/mockData';
import { supabase } from '@/lib/supabase';
import type { Contract } from '@/lib/sam-api';
import type { ProposalDraft } from '@/lib/claude';

type AnyContract = typeof mockContracts[0] | Contract;
type Section = 'executiveSummary' | 'qualifications' | 'technicalApproach' | 'whyUs';

const sections: { key: Section; label: string }[] = [
  { key: 'executiveSummary', label: 'Executive Summary' },
  { key: 'qualifications', label: 'Company Qualifications' },
  { key: 'technicalApproach', label: 'Technical Approach' },
  { key: 'whyUs', label: 'Why Us' },
];

const PLACEHOLDER: Record<Section, string> = {
  executiveSummary: 'Generating executive summary...',
  qualifications: 'Generating qualifications section...',
  technicalApproach: 'Generating technical approach...',
  whyUs: 'Generating why us section...',
};

export default function ProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [contract, setContract] = useState<AnyContract | null>(null);
  const [content, setContent] = useState<Record<Section, string>>({
    executiveSummary: '', qualifications: '', technicalApproach: '', whyUs: '',
  });
  const [activeSection, setActiveSection] = useState<Section>('executiveSummary');
  const [saved, setSaved] = useState(false);
  const [generating, setGenerating] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const loadContract = (): AnyContract | null => {
    try {
      const cached = sessionStorage.getItem('contracts');
      if (cached) {
        const contracts: AnyContract[] = JSON.parse(cached);
        const found = contracts.find((c) => c.id === id);
        if (found) return found;
      }
    } catch { /* ignore */ }
    return mockContracts.find((c) => c.id === id) || null;
  };

  const generateProposal = async (c: AnyContract) => {
    setGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      let userProfile = {
        businessName: mockUser.businessName,
        location: mockUser.location,
        services: mockUser.services,
        certifications: [] as string[],
      };

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

      const res = await fetch('/api/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract: {
            title: c.title,
            agency: c.agency,
            agencyShort: c.agencyShort,
            description: c.description,
            naics: c.naics,
            setAside: c.setAside,
            solicitationNumber: c.solicitationNumber,
          },
          userProfile,
          userId,
        }),
      });

      if (res.ok) {
        const draft: ProposalDraft = await res.json();
        setContent({
          executiveSummary: draft.executiveSummary,
          qualifications: draft.qualifications,
          technicalApproach: draft.technicalApproach,
          whyUs: draft.whyUs,
        });
      } else {
        // Fallback to mock
        useMockProposal(c, userProfile.businessName, userProfile.location);
      }
    } catch {
      const userProfile = { businessName: mockUser.businessName, location: mockUser.location };
      useMockProposal(c, userProfile.businessName, userProfile.location);
    } finally {
      setGenerating(false);
      setRegenerating(false);
    }
  };

  const useMockProposal = (c: AnyContract, businessName: string, location: string) => {
    setContent({
      executiveSummary: `${businessName} is pleased to submit this proposal in response to Solicitation ${c.solicitationNumber} issued by ${c.agency}. We are a qualified business with proven experience delivering the services outlined in this solicitation.\n\nWe understand that ${c.agency} requires reliable, high-quality services delivered on time and within budget. Our team is prepared to meet and exceed all requirements specified in this solicitation, bringing deep expertise and a commitment to federal contract performance.`,
      qualifications: `${businessName} has been providing professional services to both government and commercial clients since our founding. Our key qualifications include:\n\n• Demonstrated experience in NAICS ${c.naics}\n• All required certifications and licenses\n• A dedicated team of qualified professionals based in ${location}\n• Past performance on similar contracts with strong CPARS ratings\n• Financial stability sufficient for this contract value`,
      technicalApproach: `Our technical approach prioritizes quality, reliability, and clear communication with the COR.\n\nPhase 1 — Transition (Days 1-30): Complete onboarding, obtain clearances, establish communication protocols.\n\nPhase 2 — Full Operations (Day 31+): Deliver all services per the Performance Work Statement, maintaining all performance standards.\n\nPhase 3 — Reporting: Monthly performance reports and quarterly review meetings with the COR.`,
      whyUs: `${businessName} brings three distinct advantages:\n\n1. Local presence: Our team in ${location} means faster response times and no travel costs.\n\n2. Dedicated team: We will assign a dedicated Project Manager as single point of contact for ${c.agencyShort}.\n\n3. Proven results: Our past performance demonstrates on-time, on-budget delivery to federal clients.`,
    });
  };

  useEffect(() => {
    const c = loadContract();
    if (!c) return;
    setContract(c);
    generateProposal(c);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSave = () => {
    if (contract) {
      try {
        const existing = JSON.parse(localStorage.getItem('saved_proposals') || '[]');
        const filtered = existing.filter((p: { contractId: string }) => p.contractId !== contract.id);
        filtered.unshift({
          contractId: contract.id,
          contractTitle: contract.title,
          agency: contract.agencyShort,
          value: contract.value,
          savedAt: new Date().toISOString(),
        });
        localStorage.setItem('saved_proposals', JSON.stringify(filtered.slice(0, 20)));
      } catch { /* ignore */ }
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRegenerate = () => {
    if (!contract || regenerating) return;
    setRegenerating(true);
    generateProposal(contract);
  };

  if (!contract) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
        <AppSidebar />
        <main style={{ marginLeft: 220, flex: 1, padding: '40px 48px' }}>
          <div style={{ fontSize: 14, color: '#525252' }}>Loading proposal...</div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      <AppSidebar />

      <main style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <div style={{
          padding: '20px 40px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#0a0a0a', position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div>
            <Link href={`/contract/${contract.id}`} style={{ fontSize: 12, color: '#525252', textDecoration: 'none', display: 'block', marginBottom: 4 }}>
              ← {contract.agencyShort} — {contract.title.slice(0, 50)}...
            </Link>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: '#f5f5f5', letterSpacing: '-0.01em' }}>
              Proposal Draft
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleSave}
              style={{
                padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: saved ? 'rgba(255,255,255,0.07)' : '#f5f5f5',
                color: saved ? '#525252' : '#0a0a0a',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {saved ? 'Saved' : 'Save Draft'}
            </button>
            <button
              style={{
                padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: 'transparent', color: '#525252',
                border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
              }}
            >
              Export PDF
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1 }}>

          {/* Section nav */}
          <div style={{ width: 200, flexShrink: 0, padding: '28px 16px', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ fontSize: 11, color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 12, paddingLeft: 10 }}>
              Sections
            </p>
            {sections.map((s, i) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                  padding: '9px 10px', borderRadius: 7, border: 'none',
                  background: activeSection === s.key ? 'rgba(255,255,255,0.07)' : 'transparent',
                  color: activeSection === s.key ? '#f5f5f5' : '#525252',
                  fontSize: 13, fontWeight: activeSection === s.key ? 600 : 400,
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', marginBottom: 2,
                }}
              >
                <span style={{ fontSize: 10, color: activeSection === s.key ? '#737373' : '#333', fontWeight: 700 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {s.label}
              </button>
            ))}

            <div style={{ marginTop: 24, padding: '16px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: 11, color: '#3a3a3a', marginBottom: 8 }}>Contract value</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#f5f5f5' }}>{contract.value}</p>
              <p style={{ fontSize: 11, color: '#3a3a3a', marginTop: 8, marginBottom: 4 }}>Deadline</p>
              <p style={{ fontSize: 13, color: contract.daysLeft <= 14 ? '#f87171' : '#737373' }}>
                {contract.daysLeft} days left
              </p>
            </div>
          </div>

          {/* Editor */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{ flex: 1, padding: '40px 48px', maxWidth: 760 }}
            >
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f5f5f5', letterSpacing: '-0.02em', marginBottom: 6 }}>
                  {sections.find(s => s.key === activeSection)?.label}
                </h2>
                <p style={{ fontSize: 12, color: '#3a3a3a' }}>
                  {generating ? 'Claude is writing your proposal...' : 'AI-generated based on your profile and this contract. Edit freely.'}
                </p>
              </div>

              {generating ? (
                <div style={{
                  width: '100%', minHeight: 420, padding: '20px',
                  borderRadius: 12, background: '#141414',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', flexDirection: 'column', gap: 16,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f5f5f5' }} />
                    <span style={{ fontSize: 13, color: '#525252' }}>Claude is writing your {sections.find(s => s.key === activeSection)?.label.toLowerCase()}...</span>
                  </div>
                  {[90, 75, 85, 60, 70].map((w, i) => (
                    <div key={i} style={{ height: 13, width: `${w}%`, borderRadius: 6, background: 'rgba(255,255,255,0.04)' }} />
                  ))}
                </div>
              ) : (
                <textarea
                  value={content[activeSection] || PLACEHOLDER[activeSection]}
                  onChange={e => setContent(prev => ({ ...prev, [activeSection]: e.target.value }))}
                  style={{
                    width: '100%', minHeight: 420, padding: '20px',
                    borderRadius: 12, background: '#141414',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#d4d4d4', fontSize: 14, lineHeight: 1.85,
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    resize: 'vertical', outline: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                />
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                <button
                  onClick={handleRegenerate}
                  disabled={regenerating || generating}
                  style={{
                    padding: '8px 16px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                    background: 'transparent',
                    color: regenerating ? '#3a3a3a' : '#525252',
                    border: '1px solid rgba(255,255,255,0.08)', cursor: regenerating ? 'not-allowed' : 'pointer',
                  }}
                >
                  {regenerating ? 'Regenerating...' : 'Regenerate with AI'}
                </button>
                <div style={{ display: 'flex', gap: 8 }}>
                  {sections.findIndex(s => s.key === activeSection) > 0 && (
                    <button
                      onClick={() => setActiveSection(sections[sections.findIndex(s => s.key === activeSection) - 1].key)}
                      style={{ padding: '8px 16px', borderRadius: 7, fontSize: 12, fontWeight: 600, background: 'transparent', color: '#525252', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
                    >
                      ← Previous
                    </button>
                  )}
                  {sections.findIndex(s => s.key === activeSection) < sections.length - 1 && (
                    <button
                      onClick={() => setActiveSection(sections[sections.findIndex(s => s.key === activeSection) + 1].key)}
                      style={{ padding: '8px 16px', borderRadius: 7, fontSize: 12, fontWeight: 600, background: '#f5f5f5', color: '#0a0a0a', border: 'none', cursor: 'pointer' }}
                    >
                      Next →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
