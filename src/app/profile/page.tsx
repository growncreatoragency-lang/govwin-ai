'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AppSidebar from '@/components/AppSidebar';
import { supabase } from '@/lib/supabase';

const CERT_OPTIONS = ['Small Business', 'SDVOSB', 'VOSB', 'WOSB', 'EDWOSB', '8(a)', 'HUBZone'];

const CONTRACT_SIZES = [
  { value: 'micro', label: 'Micro (<$10K)' },
  { value: 'small', label: 'Small ($10K–$250K)' },
  { value: 'medium', label: 'Medium ($250K–$2M)' },
  { value: 'large', label: 'Large ($2M+)' },
];

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');

  const [form, setForm] = useState({
    business_name: '',
    location: '',
    naics: '',
    services: '',
    certifications: [] as string[],
    contract_size: 'small',
  });

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push('/auth/login'); return; }
        setUserId(user.id);
        setEmail(user.email || '');

        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          setForm({
            business_name: data.business_name || '',
            location: data.location || '',
            naics: data.naics || '',
            services: data.services || '',
            certifications: data.certifications || [],
            contract_size: data.contract_size || 'small',
          });
        }
      } catch { /* Supabase not configured */ }
      setLoading(false);
    }
    load();
  }, [router]);

  const toggleCert = (cert: string) => {
    setForm(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert],
    }));
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setError('');
    try {
      const { error: err } = await supabase.from('profiles').upsert({ id: userId, ...form });
      if (err) { setError(err.message); } else { setSaved(true); setTimeout(() => setSaved(false), 2500); }
    } catch (e) {
      setError('Failed to save. Please try again.');
    }
    setSaving(false);
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    background: '#141414', border: '1px solid rgba(255,255,255,0.09)',
    color: '#f5f5f5', fontSize: 13, outline: 'none',
    transition: 'border-color 0.15s',
    fontFamily: 'Inter, sans-serif',
  };

  const labelStyle = {
    fontSize: 11, fontWeight: 700, color: '#525252',
    textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 8, display: 'block',
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
        <AppSidebar />
        <main style={{ marginLeft: 220, flex: 1, padding: '40px 48px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 540 }}>
            {[1, 2, 3, 4].map(i => <div key={i} style={{ height: 48, borderRadius: 10, background: '#141414' }} />)}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      <AppSidebar />
      <main style={{ marginLeft: 220, flex: 1, padding: '40px 48px', maxWidth: 860 }}>

        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f5f5f5', letterSpacing: '-0.03em', marginBottom: 6 }}>
            Business Profile
          </h1>
          <p style={{ fontSize: 14, color: '#525252' }}>
            This information is used to match you with contracts and generate proposals.
          </p>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>

            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

              {/* Account info */}
              <div style={{ padding: '20px', borderRadius: 14, background: '#141414', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Account</div>
                <div style={{ fontSize: 13, color: '#525252' }}>{email || 'Not signed in'}</div>
              </div>

              <div>
                <label style={labelStyle}>Business Name</label>
                <input
                  value={form.business_name}
                  onChange={e => setForm(p => ({ ...p, business_name: e.target.value }))}
                  placeholder="Acme IT Solutions LLC"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; }}
                />
              </div>

              <div>
                <label style={labelStyle}>Location</label>
                <input
                  value={form.location}
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  placeholder="Washington, DC"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; }}
                />
              </div>

              <div>
                <label style={labelStyle}>Primary NAICS Code</label>
                <input
                  value={form.naics}
                  onChange={e => setForm(p => ({ ...p, naics: e.target.value }))}
                  placeholder="541512"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; }}
                />
              </div>

              <div>
                <label style={labelStyle}>Contract Size</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {CONTRACT_SIZES.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setForm(p => ({ ...p, contract_size: s.value }))}
                      style={{
                        padding: '10px 14px', borderRadius: 9, fontSize: 13, textAlign: 'left',
                        border: '1px solid',
                        borderColor: form.contract_size === s.value ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)',
                        background: form.contract_size === s.value ? 'rgba(255,255,255,0.06)' : 'transparent',
                        color: form.contract_size === s.value ? '#f5f5f5' : '#525252',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <div>
                <label style={labelStyle}>Services & Capabilities</label>
                <textarea
                  value={form.services}
                  onChange={e => setForm(p => ({ ...p, services: e.target.value }))}
                  placeholder="Describe what your business does — IT support, cybersecurity, staffing, construction, etc. This is used to generate proposals."
                  rows={7}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; }}
                />
              </div>

              <div>
                <label style={labelStyle}>Certifications</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {CERT_OPTIONS.map(cert => {
                    const active = form.certifications.includes(cert);
                    return (
                      <button
                        key={cert}
                        onClick={() => toggleCert(cert)}
                        style={{
                          padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                          border: '1px solid',
                          borderColor: active ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.07)',
                          background: active ? 'rgba(255,255,255,0.09)' : 'transparent',
                          color: active ? '#f5f5f5' : '#525252',
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}
                      >
                        {cert}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save */}
              <div style={{ marginTop: 'auto', paddingTop: 16 }}>
                {error && (
                  <p style={{ fontSize: 12, color: '#f87171', marginBottom: 12 }}>{error}</p>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    width: '100%', padding: '13px', borderRadius: 10, border: 'none',
                    background: saved ? 'rgba(255,255,255,0.07)' : '#f5f5f5',
                    color: saved ? '#525252' : '#0a0a0a',
                    fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {saving ? 'Saving...' : saved ? 'Profile saved ✓' : 'Save Profile'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
