'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import AnimatedCounter from '@/components/AnimatedCounter';

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } },
  item: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as any } },
  },
};

const mockContracts = [
  { title: 'IT Support Services — GSA Region 4', agency: 'GSA', value: '$180K', match: 97, deadline: '6d' },
  { title: 'Janitorial Services — VA Medical Center', agency: 'VA', value: '$94K', match: 91, deadline: '12d' },
  { title: 'Network Security Consulting — DHS', agency: 'DHS', value: '$320K', match: 85, deadline: '18d' },
];

const features = [
  {
    label: 'Find',
    title: 'Daily contract matching',
    desc: 'We scan 3,000+ SAM.gov postings every morning and surface only the ones that fit your NAICS code, certifications, and size range.',
    wide: true,
  },
  {
    label: 'Understand',
    title: 'Plain-English AI breakdowns',
    desc: '40 pages of government jargon turned into a clear summary you can act on in minutes.',
    wide: false,
  },
  {
    label: 'Win',
    title: 'Proposal co-pilot',
    desc: 'AI pre-fills your proposal using your profile and the contract requirements. Full draft in 60 seconds.',
    wide: false,
  },
  {
    label: 'Qualify',
    title: 'Set-aside detection',
    desc: 'Automatically flags veteran, woman-owned, minority, and HUBZone set-asides you qualify for — less competition, higher win rates.',
    wide: true,
  },
];

const pricing = [
  {
    name: 'Starter',
    price: '$49',
    desc: 'Get your first match today',
    features: ['Daily matching alerts', 'AI contract breakdowns', '10 saved contracts', 'Email notifications'],
    hot: false,
  },
  {
    name: 'Pro',
    price: '$149',
    desc: 'For serious first-time bidders',
    features: ['Everything in Starter', 'AI proposal writing', 'Unlimited saves', 'Win/loss tracking', 'Priority support'],
    hot: true,
  },
];

export default function Home() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  return (
    <div style={{ background: '#080808', minHeight: '100vh', fontFamily: 'Inter, -apple-system, sans-serif' }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(8,8,8,0.9)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#f5f5f5', letterSpacing: '-0.03em' }}>
            GovWin AI
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="#pricing" style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#737373', textDecoration: 'none', transition: 'color 0.15s' }}>
              Pricing
            </Link>
            <Link href="/auth/login" style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#737373', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)' }}>
              Sign in
            </Link>
            <Link href="/auth/signup" style={{
              padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700,
              background: '#f5f5f5', color: '#0a0a0a', textDecoration: 'none',
            }}>
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 160, paddingBottom: 120, padding: '160px 32px 120px', textAlign: 'center' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 100,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: 12, fontWeight: 600, color: '#737373',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              marginBottom: 40,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f5f5f5', display: 'inline-block' }} />
            Monitoring SAM.gov daily
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] as any }}
            style={{
              fontSize: 'clamp(44px, 6.5vw, 84px)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.04,
              color: '#f5f5f5',
              marginBottom: 28,
            }}
          >
            Win government<br />contracts on autopilot
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            style={{ fontSize: 19, color: '#525252', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 44px' }}
          >
            $160B in contracts reserved for small businesses every year. We find them, explain them, and help you write the proposal to win.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.28 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
          >
            {joined ? (
              <div style={{ padding: '13px 28px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 14, color: '#737373' }}>
                You&apos;re on the list — check your inbox.
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8, width: '100%', maxWidth: 460 }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && email && setJoined(true)}
                  placeholder="your@email.com"
                  style={{
                    flex: 1, padding: '13px 18px', borderRadius: 10, fontSize: 14,
                    background: '#111', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#f5f5f5', outline: 'none',
                    fontFamily: 'Inter, -apple-system, sans-serif',
                  }}
                />
                <button
                  onClick={() => email && setJoined(true)}
                  style={{
                    padding: '13px 22px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                    background: '#f5f5f5', color: '#0a0a0a', border: 'none', cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Get early access
                </button>
              </div>
            )}
            <p style={{ fontSize: 12, color: '#3a3a3a' }}>Free 14-day trial — no credit card required</p>
          </motion.div>
        </div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as any }}
          style={{ maxWidth: 820, margin: '80px auto 0', textAlign: 'left' }}
        >
          <div style={{
            borderRadius: 16, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
            background: '#0f0f0f',
          }}>
            {/* Window bar */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 8, background: '#111' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2a2a2a' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2a2a2a' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2a2a2a' }} />
              <span style={{ marginLeft: 12, fontSize: 12, color: '#3a3a3a', fontWeight: 500 }}>GovWin AI — Dashboard</span>
            </div>
            {/* Content */}
            <div style={{ padding: '28px' }}>
              <div style={{ fontSize: 13, color: '#3a3a3a', marginBottom: 20 }}>
                Good morning.{' '}
                <span style={{ color: '#737373' }}>3 new contracts match your profile today.</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {mockContracts.map((c, i) => (
                  <motion.div
                    key={c.title}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 18px', borderRadius: 10,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)', gap: 16,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#525252', flexShrink: 0 }}>
                        {c.agency}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#f5f5f5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.title}
                        </div>
                        <div style={{ fontSize: 11, color: '#3a3a3a', marginTop: 2 }}>{c.deadline} left</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#f5f5f5' }}>{c.value}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6,
                        background: c.match >= 90 ? '#f5f5f5' : 'rgba(255,255,255,0.08)',
                        color: c.match >= 90 ? '#0a0a0a' : '#737373',
                      }}>
                        {c.match}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Social proof — contracts won */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '60px 32px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
          {[
            { value: '$47.2M', label: 'in contracts won by users' },
            { value: '1,847', label: 'proposals submitted' },
            { value: '312', label: 'contracts awarded' },
          ].map((s, i) => (
            <AnimatedSection key={s.value} delay={i * 0.1}>
              <div style={{
                textAlign: 'center',
                padding: '0 32px',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}>
                <div style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#f5f5f5', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: '#3a3a3a', marginTop: 8, fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '80px 32px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 48 }}>
          {[
            { value: '$700B', label: 'in US gov contracts per year' },
            { value: '$160B', label: 'reserved for small businesses' },
            { value: '99%', label: 'of eligible businesses never bid' },
            { value: '$50K+', label: 'average first contract value' },
          ].map((s, i) => (
            <AnimatedSection key={s.value} delay={i * 0.08}>
              <AnimatedCounter value={s.value} label={s.label} />
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '100px 32px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <AnimatedSection style={{ marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#3a3a3a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>What we do</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#f5f5f5', lineHeight: 1.1, maxWidth: 520 }}>
              Built for people who have never bid on a government contract
            </h2>
          </AnimatedSection>

          <motion.div
            variants={stagger.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={stagger.item}
                style={{
                  gridColumn: f.wide ? 'span 2' : 'span 1',
                  padding: '32px', borderRadius: 16,
                  background: '#0d0d0d',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: '#3a3a3a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
                  {f.label}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f5f5f5', marginBottom: 12, letterSpacing: '-0.01em' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: '#525252', lineHeight: 1.75 }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ROI */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '100px 32px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <AnimatedSection direction="left">
            <p style={{ fontSize: 12, fontWeight: 700, color: '#3a3a3a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>The math</p>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#f5f5f5', lineHeight: 1.15, marginBottom: 20 }}>
              One contract win pays for three years of subscription
            </h2>
            <p style={{ fontSize: 15, color: '#525252', lineHeight: 1.8, marginBottom: 36 }}>
              The average small business government contract is worth $50K–$500K. At $149/month, GovWin AI pays for itself the moment you sign your first deal.
            </p>
            <Link href="/auth/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 24px', borderRadius: 10,
              background: '#f5f5f5', color: '#0a0a0a',
              fontWeight: 700, fontSize: 14, textDecoration: 'none',
            }}>
              Start free trial
            </Link>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.12}>
            <div style={{ padding: '32px', borderRadius: 16, background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)' }}>
              {[
                { label: 'Monthly subscription', value: '−$149', muted: true },
                { label: 'Average first contract won', value: '+$92,000', muted: true },
                { label: 'Net in month 1', value: '$91,851', muted: false },
              ].map((row, i) => (
                <div
                  key={row.label}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '16px 0',
                    borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  }}
                >
                  <span style={{ fontSize: 14, color: row.muted ? '#525252' : '#f5f5f5', fontWeight: row.muted ? 400 : 700 }}>
                    {row.label}
                  </span>
                  <span style={{ fontSize: row.muted ? 15 : 28, fontWeight: 800, color: '#f5f5f5', letterSpacing: '-0.02em' }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '100px 32px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <AnimatedSection style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#f5f5f5', marginBottom: 12 }}>
              Start free. Win big.
            </h2>
            <p style={{ fontSize: 15, color: '#525252' }}>14-day trial on all plans. Cancel anytime.</p>
          </AnimatedSection>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {pricing.map((plan, i) => (
              <AnimatedSection key={plan.name} delay={i * 0.12} style={{
                  padding: '36px', borderRadius: 16,
                  background: plan.hot ? '#f5f5f5' : '#0d0d0d',
                  border: plan.hot ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', flexDirection: 'column',
                }}
              >
                {plan.hot && (
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: 20 }}>
                    Most popular
                  </div>
                )}
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: plan.hot ? 'rgba(0,0,0,0.4)' : '#3a3a3a', marginBottom: 6 }}>
                  {plan.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.04em', color: plan.hot ? '#0a0a0a' : '#f5f5f5' }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: 14, color: plan.hot ? 'rgba(0,0,0,0.4)' : '#3a3a3a' }}>/mo</span>
                </div>
                <p style={{ fontSize: 13, color: plan.hot ? 'rgba(0,0,0,0.45)' : '#525252', marginBottom: 28 }}>
                  {plan.desc}
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32, flex: 1 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: plan.hot ? 'rgba(0,0,0,0.65)' : '#737373' }}>
                      <span style={{ fontWeight: 800, color: plan.hot ? '#0a0a0a' : '#f5f5f5', fontSize: 12 }}>+</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  style={{
                    display: 'block', textAlign: 'center', padding: '13px', borderRadius: 10,
                    fontSize: 14, fontWeight: 700, textDecoration: 'none',
                    background: plan.hot ? '#0a0a0a' : '#f5f5f5',
                    color: plan.hot ? '#f5f5f5' : '#0a0a0a',
                  }}
                >
                  Start free trial
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '120px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <AnimatedSection>
            <h2 style={{ fontSize: 'clamp(36px, 5.5vw, 70px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#f5f5f5', lineHeight: 1.05, marginBottom: 24 }}>
              Your first contract<br />is waiting right now.
            </h2>
            <p style={{ fontSize: 17, color: '#525252', marginBottom: 44, lineHeight: 1.7 }}>
              Thousands of contracts were posted to SAM.gov this week. Most will close without a single small business bidding.
            </p>
            <Link
              href="/auth/signup"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '15px 32px', borderRadius: 12,
                background: '#f5f5f5', color: '#0a0a0a',
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
              }}
            >
              Find your first contract →
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1100, margin: '0 auto' }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#f5f5f5', letterSpacing: '-0.02em' }}>GovWin AI</span>
        <span style={{ fontSize: 13, color: '#2a2a2a' }}>© 2026 — Built for the underdogs.</span>
      </footer>
    </div>
  );
}
