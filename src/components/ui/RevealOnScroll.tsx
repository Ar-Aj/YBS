'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type Props = {
  children: ReactNode;
  className?: string;
  variant?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
  stagger?: boolean;
  threshold?: number;
};

export function RevealOnScroll({
  children,
  className = '',
  variant = 'up',
  delay = 0,
  stagger = false,
  threshold = 0.15,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion) return; // revealed via derived state, no observer needed

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, reducedMotion]);

  const variantClass = {
    up: 'reveal',
    left: 'reveal-left',
    right: 'reveal-right',
    scale: 'reveal-scale',
  }[variant];

  const baseClass = stagger ? 'stagger-children' : variantClass;

  // Reduced motion must never hide content, so visibility is derived rather
  // than pushed through an effect.
  const revealed = reducedMotion || isVisible;

  return (
    <div
      ref={ref}
      className={`${baseClass} ${revealed ? 'revealed' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
