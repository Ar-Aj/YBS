'use client';

import { useLayoutEffect } from 'react';

/**
 * Keeps the `js` marker class on `<html>`.
 *
 * The class is added by an inline script in the root layout so the
 * reveal-on-scroll hidden states apply from the very first paint. React's
 * dev-mode StrictMode remount resets `<html>` to the attributes it manages
 * from JSX, which would drop the class — so we re-apply it in a layout
 * effect, before paint. This is a no-op in production.
 */
export function JsClassBootstrap() {
  useLayoutEffect(() => {
    document.documentElement.classList.add('js');
  }, []);

  return null;
}
