'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AppSidebar from '@/components/AppSidebar';
import { supabase } from '@/lib/supabase';
import type { Contract } from '@/lib/sam-api';

// Map NAICS codes to relevant search suggestions
const NAICS_SUGGESTIONS: Record<string, string[]> = {
  '541512': ['IT help desk support contracts', 'Desktop support services for federal agencies', 'Tier 1 IT support small business', 'Government IT service desk'],
  '541511': ['Software development for federal agencies', 'Web application development contracts', 'Custom software government contracts'],
  '541519': ['Cybersecurity services for DOD', 'Network security assessment contracts', 'Cloud security and compliance monitoring'],
  '561320': ['Staffing support for federal agencies', 'Administrative staffing contracts', 'Temporary workforce services government'],
  '561310': ['Recruiting services for federal contractors', 'Talent acquisition support contracts'],
  '561720': ['Janitorial services federal facilities', 'Custodial and cleaning contracts', 'Building housekeeping VA medical center'],
  '236220': ['Construction and renovation contracts', 'Federal building renovation services', 'Government facility construction'],
  '541611': ['Management consulting federal agencies', 'Program management support contracts', 'Advisory services for government'],
  '722310': ['Food service contractor federal facilities', 'Cafeteria and catering contracts', 'Dining services military base'],
  '561730': ['Landscaping and grounds maintenance contracts', 'Federal facility grounds services'],
  '611430': ['Training and education services government', 'Federal workforce training contracts'],
  '541330': ['Engineering services federal agencies', 'Civil engineering government contracts'],
  '621111': ['Medical staffing federal health agencies', 'Healthcare services government contracts'],
  '541211': ['Accounting and financial services contracts', 'Audit support federal agencies'],
  '488510': ['Logistics and transportation contracts', 'Supply chain management government'],
  '561110': ['Facilities management federal buildings', 'Operations and maintenance contracts'],
  '561612': ['Security guard services federal facilities', 'Physical security contracts government'],
};

// Generic fallbacks if no NAICS match
const DEFAULT_SUGGESTIONS = [
  'IT support services for federal agencies',
  'Small business janitorial contracts',
  'Staffing and HR support government',
  'Management consulting federal agencies',
  'Construction and renovation contracts',
];

function getSuggestions(profile: Record<string, string> | null): string[] {
  if (!profile) return DEFAULT_SUGGESTIONS;

  const naics = profile.naics || '';
  const services = (profile.services || '').toLowerCase();
  const businessName = profile.business_name || '';

  // Try exact NAICS match
  if (naics && NAICS_SUGGESTIONS[naics]) {
    return NAICS_SUGGESTIONS[naics];
  }

  // Try 4-digit prefix match
  if (naics) {
    const prefix = naics.slice(0, 4);
    const match = Object.entries(NAICS_SUGGESTIONS).find(([code]) => code.startsWith(prefix));
    if (match) return match[1];
  }

  // Try keyword match from services field
  if (services) {
    for (const [, suggestions] of Object.entries(NAICS_SUGGESTIONS)) {
      if (suggestions.some(s => services.split(' ').some(w => w.length > 3 && s.toLowerCase().includes(w)))) {
        return suggestions;
      }
    }
  }

  // Build one custom suggestion from profile if possible
  if (businessName || services) {
    const custom = services
      ? `${services.split(' ').slice(0, 3).join(' ')} federal contracts`
      : `contracts for ${businessName}`;
    return [custom, ...DEFAULT_SUGGESTIONS.slice(0, 4)];
  }

  return DEFAULT_SUGGESTIONS;
}

interface SearchMessage {
  role: 'user' | 'ai';
  text: string;
}

function MatchBadge({ score }: { score: number }) {
  const bg = score >= 90 ? '#f5f5f5' : 'rgba(255,255,255,0.07)';
  const color = score >= 90 ? '#0a0a0a' : '#737373';
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: bg, color }}>
      {score}%
    </span>
  );
}

function SkeletonRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 22px', borderRadius: 12, background: '#141414', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ height: 13, width: '55%', borderRadius: 6, background: 'rgba(255,255,255,0.05)', marginBottom: 8 }} />
        <div style={{ height: 10, width: '35%', borderRadius: 6, background: 'rgba(255,255,255,0.03)' }} />
      </div>
      <div style={{ height: 13, width: 56, borderRadius: 6, background: 'rgba(255,255,255,0.04)' }} />
    </div>
  );
}

function EmptyState({ onSuggest }: { onSuggest: (q: string) => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#f5f5f5', marginBottom: 8 }}>
        Search for federal contracts
      </div>
      <div style={{ fontSize: 13, color: '#525252', marginBottom: 24 }}>
        Type what you&apos;re looking for above — AI will find live opportunities from SAM.gov.
      </div>
      <button
        onClick={() => onSuggest('contracts matching my business')}
        style={{
          padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
          background: '#f5f5f5', color: '#0a0a0a', border: 'none', cursor: 'pointer',
        }}
      >
        Find contracts for my profile →
      </button>
    </div>
  );
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [baseContracts, setBaseContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<SearchMessage[]>([]);
  const [userProfile, setUserProfile] = useState<Record<string, string> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function init() {
      let profile: Record<string, string> | null = null;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
          if (data) {
            profile = data;
            setUserProfile(data);
          }
        }
      } catch { /* ignore */ }

      // Try session cache
      try {
        const cached = sessionStorage.getItem('contracts');
        if (cached) {
          const data = JSON.parse(cached);
          if (data.length > 0) {
            setContracts(data);
            setBaseContracts(data);
            setInitialLoading(false);
            return;
          }
        }
      } catch { /* ignore */ }

      // Fetch live contracts by profile NAICS
      const naics = profile?.naics;
      if (naics) {
        try {
          const res = await fetch(`/api/contracts?naics=${naics}`);
          if (res.ok) {
            const data = await res.json();
            if (data.contracts?.length > 0) {
              setContracts(data.contracts);
              setBaseContracts(data.contracts);
              sessionStorage.setItem('contracts', JSON.stringify(data.contracts));
              setInitialLoading(false);
              return;
            }
          }
        } catch { /* fall through */ }
      }

      // No mock data — just show empty state
      setContracts([]);
      setBaseContracts([]);
      setInitialLoading(false);
    }
    init();
  }, []);

  const handleSearch = async (searchQuery?: string) => {
    const q = (searchQuery || query).trim();
    if (!q || loading) return;

    setQuery('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: q }]);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, userProfile }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || 'Search failed');

      const aiMsg = data.contracts?.length > 0
        ? `${data.explanation} — found ${data.contracts.length} contract${data.contracts.length !== 1 ? 's' : ''}.`
        : `${data.explanation}`;

      setMessages(prev => [...prev, { role: 'ai', text: aiMsg }]);

      if (data.contracts?.length > 0) {
        setContracts(data.contracts);
        sessionStorage.setItem('contracts', JSON.stringify(data.contracts));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setMessages(prev => [...prev, { role: 'ai', text: `Search failed: ${msg}` }]);
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  const suggestions = getSuggestions(userProfile);
  const hasSearched = messages.length > 0;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      <AppSidebar />
      <main style={{ marginLeft: 220, flex: 1, padding: '40px 48px', maxWidth: 1060 }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f5f5f5', letterSpacing: '-0.03em', marginBottom: 6 }}>
            Contract Search
          </h1>
          <p style={{ fontSize: 14, color: '#525252' }}>
            Describe what you&apos;re looking for — AI finds live opportunities from SAM.gov.
          </p>
        </div>

        {/* Search box */}
        <div style={{ marginBottom: 32 }}>
          {/* Message thread */}
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}
              >
                {msg.role === 'ai' && (
                  <div style={{
                    width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                    background: '#f5f5f5', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 10, fontWeight: 800,
                    color: '#0a0a0a', marginRight: 10, marginTop: 2,
                  }}>AI</div>
                )}
                <div style={{
                  maxWidth: '72%', padding: '10px 16px', borderRadius: 12,
                  background: msg.role === 'user' ? '#f5f5f5' : '#141414',
                  border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  color: msg.role === 'user' ? '#0a0a0a' : '#a3a3a3',
                  fontSize: 13, lineHeight: 1.6,
                }}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading dots */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, paddingLeft: 34 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#525252', animation: 'skeleton-pulse 1.2s ease-in-out infinite', animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <span style={{ fontSize: 12, color: '#3a3a3a' }}>Searching SAM.gov...</span>
            </motion.div>
          )}

          {/* Input */}
          <div style={{ display: 'flex', gap: 0, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, overflow: 'hidden', background: '#141414', boxShadow: '0 0 0 4px rgba(255,255,255,0.02)' }}>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder={hasSearched ? 'Ask a follow-up...' : 'e.g. "IT support contracts in Texas for small businesses"'}
              style={{ flex: 1, padding: '16px 20px', background: 'transparent', border: 'none', color: '#f5f5f5', fontSize: 14, outline: 'none' }}
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              style={{
                padding: '16px 24px', background: query.trim() ? '#f5f5f5' : 'transparent',
                border: 'none', color: query.trim() ? '#0a0a0a' : '#3a3a3a',
                fontSize: 13, fontWeight: 700, cursor: query.trim() ? 'pointer' : 'default',
                transition: 'all 0.15s', flexShrink: 0,
              }}
            >
              Search →
            </button>
          </div>

          {/* Profile-matched suggestions */}
          {!hasSearched && (
            <div style={{ marginTop: 12 }}>
              {userProfile?.naics && (
                <div style={{ fontSize: 11, color: '#3a3a3a', marginBottom: 8, fontWeight: 500 }}>
                  Suggested for your profile (NAICS {userProfile.naics}):
                </div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => handleSearch(s)}
                    style={{
                      padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'transparent', color: '#525252',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLElement).style.color = '#a3a3a3';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = '#525252';
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {initialLoading ? 'Loading...' : contracts.length > 0 ? `${contracts.length} contracts` : ''}
            </span>
            {hasSearched && (
              <button
                onClick={() => { setMessages([]); setContracts(baseContracts); }}
                style={{ fontSize: 11, color: '#3a3a3a', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Clear search
              </button>
            )}
          </div>

          {initialLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1, 2, 3, 4].map(i => <SkeletonRow key={i} />)}
            </div>
          ) : contracts.length === 0 ? (
            <EmptyState onSuggest={handleSearch} />
          ) : (
            <motion.div
              key={contracts.length}
              initial="hidden" animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              {contracts.map((contract) => (
                <motion.div
                  key={contract.id}
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
                >
                  <Link
                    href={`/contract/${contract.id}`}
                    className="contract-row"
                    style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 22px', borderRadius: 12, background: '#141414', border: '1px solid rgba(255,255,255,0.07)', textDecoration: 'none' }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 7, flexShrink: 0, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#525252' }}>
                      {contract.agencyShort}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f5f5f5', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {contract.title}
                      </div>
                      <div style={{ fontSize: 11, color: '#525252', display: 'flex', gap: 14 }}>
                        <span>{contract.location}</span>
                        <span>{contract.setAside}</span>
                        <span style={{ color: contract.daysLeft <= 14 ? '#f87171' : '#525252' }}>{contract.daysLeft}d left</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#f5f5f5' }}>{contract.value}</span>
                      <MatchBadge score={contract.match} />
                      <span style={{ fontSize: 16, color: '#333' }}>›</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
