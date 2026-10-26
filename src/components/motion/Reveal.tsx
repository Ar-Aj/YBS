'use client';

import type { CSSProperties, ElementType, ReactNode } from 'react';
import { settleTime, type MotionDuration } from './motion-tokens';
import { useReveal } from './useReveal';

export type RevealVariant = 'rise' | 'fade' | 'clip' | 'wipe' | 'pop';

type Props = {
  children: ReactNode;
  as?: ElementType;
  variant?: RevealVariant;
  /** Milliseconds added before the animation starts. */
  delay?: number;
  duration?: MotionDuration;
  /** Fraction of viewport height where the element's top triggers it. */
  trigger?: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

/**
 * Single-element reveal for non-hero content. Server markup is fully visible;
 * the hidden state exists only after hydration and only for elements that
 * start below the viewport. See `useReveal` and `motion.css`.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  variant = 'rise',
  delay = 0,
  duration = 'standard',
  trigger,
  className = '',
  style,
  id,
}: Props) {
  const ref = useReveal<HTMLElement>({
    trigger,
    settle: settleTime({ delay, duration }),
  });

  const cls = [`m-${variant}`, duration === 'signature' ? 'm-signature' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      ref={ref}
      id={id}
      className={cls}
      style={{ ...style, '--m-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
