'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { animate, inView } from 'motion/react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type Props = {
  /** The verified figure to count up to (for example 75 or 90). */
  value: number;
  suffix?: string;
  /** Milliseconds. */
  duration?: number;
  trigger?: number;
  className?: string;
};

/**
 * Counts up to a verified figure. The final number is in the server HTML and
 * in a screen-reader-only span; only the visual copy animates, and only when
 * it starts below the viewport. Reduced motion shows the final number.
 */
export function Counter({
  value,
  suffix = '%',
  duration = 1400,
  trigger = 0.8,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (el.getBoundingClientRect().top <= window.innerHeight) return;

    el.textContent = '0';
    let controls: { stop: () => void } | undefined;
    const bottom = Math.round((1 - trigger) * 100);

    const stop = inView(
      el,
      () => {
        controls = animate(0, value, {
          duration: duration / 1000,
          ease: [0.2, 0.7, 0.2, 1],
          onUpdate: (v) => {
            el.textContent = String(Math.round(v));
          },
          onComplete: () => {
            el.textContent = String(value);
          },
        });
      },
      {
        margin: `0px 0px -${bottom}% 0px` as `${number}px ${number}px ${number}% ${number}px`,
        amount: 'some',
      },
    );

    return () => {
      stop();
      controls?.stop();
      el.textContent = String(value);
    };
  }, [reduced, value, duration, trigger]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {value}
      </span>
      <span aria-hidden="true">{suffix}</span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  );
}
