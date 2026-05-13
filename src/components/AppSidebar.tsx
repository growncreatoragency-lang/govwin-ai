'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { mockUser } from '@/lib/mockData';
import { supabase } from '@/lib/supabase';

const nav = [
  { label: 'Dashboard', href: '/dashboard', icon: '▦' },
  { label: 'Contracts', href: '/contracts', icon: '◈' },
  { label: 'Proposals', href: '/proposals', icon: '◉' },
  { label: 'Profile', href: '/profile', icon: '◎' },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [displayName, setDisplayName] = useState(mockUser.name);
  const [displayBusiness, setDisplayBusiness] = useState(mockUser.businessName);
  const [initial, setInitial] = useState(mockUser.name.charAt(0));
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase.from('profiles').select('business_name, subscription_status').eq('id', user.id).single();
        if (data?.subscription_status === 'active') setIsSubscribed(true);
        if (data?.business_name) {
          setDisplayBusiness(data.business_name);
          setDisplayName(data.business_name);
          setInitial(data.business_name.charAt(0).toUpperCase());
        } else {
          // Use email initial
          const emailName = user.email?.split('@')[0] || 'User';
          setDisplayName(emailName);
          setDisplayBusiness(user.email || '');
          setInitial(emailName.charAt(0).toUpperCase());
        }
      } catch { /* Supabase not configured */ }
    }
    loadUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch { /* ignore */ }
    router.push('/');
  };

  return (
    <aside
      style={{
        width: 220,
        minHeight: '100vh',
        background: '#0a0a0a',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 12px',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <Link
        href="/dashboard"
        style={{
          fontSize: 15,
          fontWeight: 800,
          color: '#f5f5f5',
          letterSpacing: '-0.03em',
          marginBottom: 32,
          paddingLeft: 10,
          textDecoration: 'none',
          display: 'block',
        }}
      >
        GovWin AI
      </Link>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link${active ? ' active' : ''}`}
            >
              <span style={{ fontSize: 12, opacity: active ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade CTA */}
      {!isSubscribed && (
        <Link
          href="/pricing"
          style={{
            display: 'block', marginBottom: 12,
            padding: '11px 14px', borderRadius: 10,
            background: '#f5f5f5', color: '#0a0a0a',
            fontSize: 12, fontWeight: 700, textDecoration: 'none',
            textAlign: 'center', transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
        >
          Upgrade — $49/mo
        </Link>
      )}

      {/* User */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div
          style={{
            padding: '12px 12px', borderRadius: 10,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7, flexShrink: 0,
              background: '#f5f5f5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#0a0a0a',
            }}>
              {initial}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#f5f5f5', marginBottom: 1 }}>
                {displayName}
              </div>
              <div style={{ fontSize: 11, color: '#525252', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayBusiness}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          style={{
            padding: '7px 10px', borderRadius: 8, border: 'none',
            background: 'transparent', color: '#3a3a3a',
            fontSize: 11, fontWeight: 500, cursor: 'pointer',
            textAlign: 'left', transition: 'color 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#737373'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#3a3a3a'; }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
