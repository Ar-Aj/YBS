'use client';

import { useLayoutEffect, useEffect, useRef, type RefObject } from 'react';
import { inView } from 'motion/react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { MOTION } from './motion-tokens';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type Options = {
  /** Fraction of the viewport height at which the element's top edge triggers. */
  trigger?: number;
  /** Milliseconds until the element is released to its natural styles. */
  settle: number;
};

/**
 * Drives `data-m` on one element: (none) -> pending -> in -> done.
 *
 * - The server renders the full content with no `data-m`, so it is visible
 *   without JavaScript and in the first paint.
 * - On the client, an element is only hidden when it starts entirely below the
 *   viewport. Anything already on screen, or already scrolled past (anchor
 *   jumps, restored scroll position), is never hidden, so nothing flashes.
 * - The reveal fires when the element's top crosses the trigger line, then
 *   the observer is released.
 * - With reduced motion the attribute is never set.
 */
export function useReveal<T extends HTMLElement>({
  trigger = MOTION.trigger,
  settle,
}: Options): RefObject<T | null> {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    if (el.getBoundingClientRect().top <= window.innerHeight) return;

    el.dataset.m = 'pending';
    let timer: ReturnType<typeof setTimeout> | undefined;
    const bottomMargin = Math.round((1 - trigger) * 100);

    const stop = inView(
      el,
      () => {
        el.dataset.m = 'in';
        timer = setTimeout(() => {
          el.dataset.m = 'done';
        }, settle);
      },
      {
        margin: `0px 0px -${bottomMargin}% 0px` as `${number}px ${number}px ${number}% ${number}px`,
        amount: 'some',
      },
    );

    return () => {
      stop();
      if (timer) clearTimeout(timer);
      delete el.dataset.m;
    };
  }, [reduced, trigger, settle]);

  return ref;
}
