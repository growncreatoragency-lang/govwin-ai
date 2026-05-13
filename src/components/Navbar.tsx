import Link from 'next/link';

export default function Navbar() {
  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(8,8,16,0.75)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between" style={{ height: 64 }}>
        <Link href="/" className="text-lg font-bold gradient-text" style={{ letterSpacing: '-0.02em' }}>
          GovWin AI
        </Link>
        <div className="flex items-center gap-2">
          <Link href="#pricing" className="btn-ghost px-4 py-2 text-sm hidden sm:inline-flex">Pricing</Link>
          <Link href="/onboarding" className="btn-primary px-5 py-2 text-sm inline-flex items-center gap-2">
            Get Started →
          </Link>
        </div>
      </div>
    </nav>
  );
}
