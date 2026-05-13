'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: string;
  label: string;
}

export default function AnimatedCounter({ value, label }: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayed, setDisplayed] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    const match = value.match(/^(\$?)(\d+(?:\.\d+)?)(.*)/);
    if (!match) { setDisplayed(value); return; }

    const [, prefix, num, suffix] = match;
    const end = parseFloat(num);
    const duration = 1500;
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * end);
      setDisplayed(`${prefix}${current}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <div
        className="text-4xl sm:text-5xl font-bold mb-2 tabular-nums"
        style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
      >
        {isInView ? displayed : '0'}
      </div>
      <div className="text-sm leading-snug max-w-[160px] mx-auto" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </div>
    </div>
  );
}
