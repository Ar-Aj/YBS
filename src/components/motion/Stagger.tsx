'use client';

import type { CSSProperties, ElementType, ReactNode } from 'react';
import { settleTime } from './motion-tokens';
import { useReveal } from './useReveal';

type Props = {
  children: ReactNode;
  as?: ElementType;
  /** Milliseconds added before the first child starts. */
  delay?: number;
  trigger?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Parent-owned stagger. One observer watches the parent; its direct children
 * rise in order, 120 ms apart, capped at six steps so long lists never cascade
 * for seconds. Children are never hidden independently of the parent state.
 */
export function Stagger({
  children,
  as = 'div',
  delay = 0,
  trigger,
  className = '',
  style,
}: Props) {
  const Tag = as as 'div';
  const ref = useReveal<HTMLDivElement>({
    trigger,
    settle: settleTime({ delay, staggered: true }),
  });

  return (
    <Tag
      ref={ref}
      className={`m-stagger ${className}`.trim()}
      style={{ ...style, '--m-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
