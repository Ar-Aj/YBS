'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

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
  }, [threshold]);

  const variantClass = {
    up: 'reveal',
    left: 'reveal-left',
    right: 'reveal-right',
    scale: 'reveal-scale',
  }[variant];

  const baseClass = stagger ? 'stagger-children' : variantClass;

  return (
    <div
      ref={ref}
      className={`${baseClass} ${isVisible ? 'revealed' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
