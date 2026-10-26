'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Reads `prefers-reduced-motion` as an external store.
 *
 * The media query is browser-only state, so it is exposed through
 * `useSyncExternalStore`: the server snapshot is always `false` (no motion
 * preference known), and the client snapshot reflects the real preference.
 * This keeps the first render deterministic for hydration and lets the value
 * update live when the user changes the OS setting — without calling
 * `setState` from inside an effect.
 */
function subscribe(onStoreChange: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {};
  }
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onStoreChange);
  return () => mql.removeEventListener('change', onStoreChange);
}

function getSnapshot(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
