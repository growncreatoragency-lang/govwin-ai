'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const industries = [
  { value: '541512', label: 'IT Support & Help Desk', desc: 'Desktop support, service desk, IT staffing' },
  { value: '541511', label: 'Software Development', desc: 'Web apps, mobile apps, custom software' },
  { value: '541519', label: 'Cybersecurity & IT Consulting', desc: 'Security assessments, network consulting, cloud' },
  { value: '561720', label: 'Janitorial & Custodial', desc: 'Cleaning, housekeeping, sanitation services' },
  { value: '561730', label: 'Landscaping & Grounds', desc: 'Lawn care, grounds maintenance, snow removal' },
  { value: '541330', label: 'Engineering Services', desc: 'Civil, mechanical, electrical engineering' },
  { value: '541611', label: 'Management Consulting', desc: 'Program management, strategy, advisory' },
  { value: '561320', label: 'Staffing & Recruiting', desc: 'Temp staffing, workforce solutions, HR support' },
  { value: '561410', label: 'Document & Admin Support', desc: 'Data entry, document management, admin services' },
  { value: '236220', label: 'Construction & Renovation', desc: 'Building construction, facility renovation' },
  { value: '722310', label: 'Food Service & Catering', desc: 'Cafeteria management, catering, food service' },
  { value: '621111', label: 'Healthcare & Medical', desc: 'Medical staffing, health services, clinical support' },
  { value: '484110', label: 'Trucking & Freight', desc: 'Ground transportation, logistics, delivery' },
  { value: '488510', label: 'Freight & Logistics', desc: 'Supply chain, warehousing, freight management' },
  { value: '561612', label: 'Security Guards', desc: 'Physical security, guard services, access control' },
  { value: '541211', label: 'Accounting & Finance', desc: 'Bookkeeping, auditing, financial consulting' },
  { value: '611430', label: 'Training & Education', desc: 'Corporate training, e-learning, curriculum development' },
  { value: '562910', label: 'Environmental Services', desc: 'Waste management, environmental remediation' },
  { value: '323111', label: 'Printing & Graphics', desc: 'Commercial printing, graphic design, publications' },
  { value: '561110', label: 'Facilities Management', desc: 'Building operations, maintenance, facility services' },
];

const certifications = [
  { value: 'small-business', label: 'Small Business' },
  { value: 'veteran-owned', label: 'Veteran-Owned (VOSB)' },
  { value: 'sdvosb', label: 'Service-Disabled Veteran (SDVOSB)' },
  { value: 'woman-owned', label: 'Woman-Owned (WOSB)' },
  { value: 'minority-owned', label: 'Minority-Owned (MBE)' },
  { value: 'hubzone', label: 'HUBZone Certified' },
  { value: '8a', label: '8(a) Program' },
];

const contractSizes = [
  { value: '10k-50k', label: '$10K – $50K', sub: 'Great for first contracts' },
  { value: '50k-250k', label: '$50K – $250K', sub: 'Mid-size contracts' },
  { value: '250k+', label: '$250K+', sub: 'Larger opportunities' },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [saving, setSaving] = useState(false);
  const [industrySearch, setIndustrySearch] = useState('');
  const [showManualNaics, setShowManualNaics] = useState(false);
  const [manualNaics, setManualNaics] = useState('');
  const [form, setForm] = useState({
    businessName: '',
    location: '',
    naics: '',
    services: '',
    certs: [] as string[],
    contractSize: '',
  });

  const steps = [
    { title: 'Tell us about your business', sub: 'We use this to match you with the right contracts.' },
    { title: 'Your services and certifications', sub: 'Certifications unlock set-aside contracts with less competition.' },
    { title: 'What contract size are you targeting?', sub: 'We will filter matches to your preferred range.' },
  ];

  const goNext = async () => {
    if (step < 2) { setDir(1); setStep(s => s + 1); return; }

    // Step 3 complete — save profile to Supabase
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          business_name: form.businessName,
          location: form.location,
          naics: form.naics,
          services: form.services,
          certifications: form.certs,
          contract_size: form.contractSize,
        });
      }
    } catch {
      // Supabase not configured yet — continue anyway
    }
    setSaving(false);
    router.push('/dashboard');
  };

  const goBack = () => { setDir(-1); setStep(s => s - 1); };

  const toggleCert = (val: string) => {
    setForm(f => ({
      ...f,
      certs: f.certs.includes(val) ? f.certs.filter(c => c !== val) : [...f.certs, val],
    }));
  };

  const canProceed = [
    form.businessName && form.location && form.naics,
    form.services,
    form.contractSize,
  ][step];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>

      {/* Logo */}
      <div style={{ fontSize: 16, fontWeight: 800, color: '#f5f5f5', letterSpacing: '-0.03em', marginBottom: 56 }}>
        GovWin AI
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 52, alignItems: 'center' }}>
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              height: 3, borderRadius: 3,
              width: i === step ? 40 : i < step ? 24 : 16,
              background: i <= step ? '#f5f5f5' : 'rgba(255,255,255,0.08)',
              transition: 'all 0.35s ease',
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 480, overflow: 'hidden' }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div style={{ marginBottom: 36 }}>
              <p style={{ fontSize: 11, color: '#3a3a3a', marginBottom: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Step {step + 1} of {steps.length}
              </p>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#f5f5f5', letterSpacing: '-0.03em', marginBottom: 8, lineHeight: 1.1 }}>
                {steps[step].title}
              </h2>
              <p style={{ fontSize: 14, color: '#525252', lineHeight: 1.65 }}>
                {steps[step].sub}
              </p>
            </div>

            {/* Step 1 */}
            {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#737373', display: 'block', marginBottom: 8 }}>
                    Business name
                  </label>
                  <input
                    value={form.businessName}
                    onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                    placeholder="Rivera Tech Solutions LLC"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#737373', display: 'block', marginBottom: 8 }}>
                    Primary location (City, State)
                  </label>
                  <input
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="Atlanta, GA"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#737373', display: 'block', marginBottom: 8 }}>
                    Primary industry / service type
                  </label>
                  <input
                    value={industrySearch}
                    onChange={e => setIndustrySearch(e.target.value)}
                    placeholder="Search your industry..."
                    style={{ ...inputStyle, marginBottom: 10 }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 260, overflowY: 'auto' }}>
                    {industries
                      .filter(ind =>
                        ind.label.toLowerCase().includes(industrySearch.toLowerCase()) ||
                        ind.desc.toLowerCase().includes(industrySearch.toLowerCase())
                      )
                      .map(ind => {
                        const active = form.naics === ind.value;
                        return (
                          <button
                            key={ind.value}
                            onClick={() => {
                              setForm(f => ({ ...f, naics: ind.value }));
                              setShowManualNaics(false);
                              setManualNaics('');
                            }}
                            style={{
                              padding: '10px 14px', borderRadius: 9, textAlign: 'left',
                              background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                              border: active ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.07)',
                              cursor: 'pointer', transition: 'all 0.15s',
                            }}
                          >
                            <div style={{ fontSize: 13, fontWeight: 600, color: active ? '#f5f5f5' : '#a3a3a3', marginBottom: 2 }}>
                              {ind.label}
                            </div>
                            <div style={{ fontSize: 11, color: active ? '#737373' : '#3a3a3a' }}>
                              {ind.desc}
                            </div>
                          </button>
                        );
                      })}
                    {industries.filter(ind =>
                      ind.label.toLowerCase().includes(industrySearch.toLowerCase()) ||
                      ind.desc.toLowerCase().includes(industrySearch.toLowerCase())
                    ).length === 0 && (
                      <p style={{ fontSize: 12, color: '#3a3a3a', padding: '8px 14px' }}>No industries match your search.</p>
                    )}
                  </div>
                  <div style={{ marginTop: 10 }}>
                    {!showManualNaics ? (
                      <button
                        onClick={() => { setShowManualNaics(true); setForm(f => ({ ...f, naics: '' })); }}
                        style={{ background: 'none', border: 'none', color: '#525252', fontSize: 12, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                      >
                        Don&apos;t see your industry? Enter NAICS code manually
                      </button>
                    ) : (
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#737373', display: 'block', marginBottom: 6 }}>
                          Enter NAICS code manually
                        </label>
                        <input
                          value={manualNaics}
                          onChange={e => {
                            setManualNaics(e.target.value);
                            setForm(f => ({ ...f, naics: e.target.value }));
                          }}
                          placeholder="e.g. 541690"
                          style={inputStyle}
                        />
                        <button
                          onClick={() => { setShowManualNaics(false); setManualNaics(''); setForm(f => ({ ...f, naics: '' })); }}
                          style={{ background: 'none', border: 'none', color: '#525252', fontSize: 11, cursor: 'pointer', padding: '4px 0 0', textDecoration: 'underline' }}
                        >
                          Back to list
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#737373', display: 'block', marginBottom: 8 }}>
                    Describe your services (in your own words)
                  </label>
                  <textarea
                    value={form.services}
                    onChange={e => setForm(f => ({ ...f, services: e.target.value }))}
                    placeholder="We provide IT help desk support, computer setup, software troubleshooting, and network support for small businesses and government offices..."
                    rows={4}
                    style={{ ...inputStyle, resize: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#737373', display: 'block', marginBottom: 10 }}>
                    Business certifications (select all that apply)
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {certifications.map(cert => {
                      const active = form.certs.includes(cert.value);
                      return (
                        <button
                          key={cert.value}
                          onClick={() => toggleCert(cert.value)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '10px 14px', borderRadius: 9, textAlign: 'left',
                            background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                            border: active ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.07)',
                            cursor: 'pointer', transition: 'all 0.15s',
                          }}
                        >
                          <div style={{
                            width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                            background: active ? '#f5f5f5' : 'transparent',
                            border: active ? 'none' : '1px solid rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {active && <span style={{ fontSize: 10, color: '#0a0a0a', fontWeight: 800 }}>✓</span>}
                          </div>
                          <span style={{ fontSize: 13, color: active ? '#f5f5f5' : '#737373', fontWeight: active ? 500 : 400 }}>
                            {cert.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {contractSizes.map(size => {
                  const active = form.contractSize === size.value;
                  return (
                    <button
                      key={size.value}
                      onClick={() => setForm(f => ({ ...f, contractSize: size.value }))}
                      style={{
                        padding: '20px 22px', borderRadius: 12, textAlign: 'left',
                        background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                        border: active ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.07)',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ fontSize: 16, fontWeight: 700, color: active ? '#f5f5f5' : '#737373', marginBottom: 4 }}>
                        {size.label}
                      </div>
                      <div style={{ fontSize: 12, color: active ? '#737373' : '#3a3a3a' }}>{size.sub}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: 40, width: '100%', maxWidth: 480 }}>
        {step > 0 && (
          <button
            onClick={goBack}
            style={{
              flex: 1, padding: '13px', borderRadius: 10, fontSize: 14, fontWeight: 600,
              background: 'transparent', color: '#525252',
              border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
            }}
          >
            Back
          </button>
        )}
        <button
          onClick={goNext}
          disabled={!canProceed}
          style={{
            flex: 2, padding: '13px', borderRadius: 10, fontSize: 14, fontWeight: 700,
            background: canProceed ? '#f5f5f5' : 'rgba(255,255,255,0.05)',
            color: canProceed ? '#0a0a0a' : '#3a3a3a',
            border: 'none', cursor: canProceed ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          {saving ? 'Saving...' : step === 2 ? 'See my contracts →' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 10,
  background: '#111111',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#f5f5f5',
  fontSize: 14,
  fontFamily: 'Inter, -apple-system, sans-serif',
  outline: 'none',
  transition: 'border-color 0.15s ease',
};
