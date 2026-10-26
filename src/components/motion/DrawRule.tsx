'use client';

import type { CSSProperties } from 'react';
import { settleTime } from './motion-tokens';
import { useReveal } from './useReveal';

type Props = {
  /** Horizontal hairline (default) or vertical spine. */
  orientation?: 'horizontal' | 'vertical';
  /** Centre a horizontal rule in its container. */
  center?: boolean;
  delay?: number;
  trigger?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * A fine gold rule that draws itself (scale on one axis) when it establishes
 * visual structure. Decorative: hidden from assistive technology.
 */
export function DrawRule({
  orientation = 'horizontal',
  center = false,
  delay = 0,
  trigger,
  className = '',
  style,
}: Props) {
  const ref = useReveal<HTMLSpanElement>({
    trigger,
    settle: settleTime({ delay, extra: 400 }),
  });

  const vertical = orientation === 'vertical';
  const cls = [
    vertical ? 'm-draw-y' : 'm-draw',
    'm-rule',
    vertical ? 'm-rule-v' : '',
    center ? 'm-rule-center' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cls}
      style={{ ...style, '--m-delay': `${delay}ms` } as CSSProperties}
    />
  );
}
