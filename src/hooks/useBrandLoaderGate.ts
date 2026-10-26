'use client';

import { useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Client snapshot: the intro plays on EVERY full page load/refresh.
 * It only skips for in-app client-side route changes within the same session
 * (the loader component stays mounted, so no replay is triggered).
 * A `?noloader` query param forces a skip (e.g. for screenshots/CI).
 */
function getSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('noloader')) return false;
  } catch {
    /* ignore malformed query strings — play the intro */
  }
  return true;
}

/** Server snapshot: the intro is never rendered on the server. */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Exposes "should the brand intro play?" as an external store so the value
 * is read during render instead of being pushed in through an effect.
 */
export function useBrandLoaderGate(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** No-op retained for API compatibility (every-load playback needs no flag). */
export function markBrandLoaderSeen(): void {
  emit();
}

/** No-op retained for API compatibility (every-load playback needs no flag). */
export function resetBrandLoaderGate(): void {
  emit();
}
