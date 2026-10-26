'use client';

import { useEffect, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

// useLayoutEffect on the client so the reset lands before paint (no flash of a
// mid-page position); a no-op alias during SSR.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Guarantees every route change (and first load) starts at the top of the page.
 * Disables the browser's own scroll restoration and jumps instantly, ignoring
 * the site's `scroll-behavior: smooth`. In-page anchors (#hash) are left alone.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useIsoLayoutEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
