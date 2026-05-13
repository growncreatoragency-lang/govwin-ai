'use client';

import Link from 'next/link';

interface GradientButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export default function GradientButton({
  children,
  href,
  onClick,
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
}: GradientButtonProps) {
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-sm', lg: 'px-8 py-4 text-base' };
  const classes = `btn-primary inline-flex items-center justify-center gap-2 ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  if (href) return <Link href={href} className={classes}>{children}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={classes}>{children}</button>;
}
