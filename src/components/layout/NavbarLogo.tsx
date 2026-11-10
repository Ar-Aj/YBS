'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import styles from './Header.module.css';

/** A single, non-blocking introduction in the existing logo footprint. */
export function NavbarLogo() {
  const markRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mark = markRef.current;
    const video = videoRef.current;
    if (!mark || !video) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      mark.dataset.logoState = 'static';
      video.pause();
      window.clearTimeout(timeout);
    };
    const show = () => {
      if (!finished) mark.dataset.logoState = 'playing';
    };
    const onPreference = () => {
      if (preference.matches) finish();
    };
    // Always fall back to the already-visible image if playback is unavailable.
    const timeout = window.setTimeout(finish, 8000);
    video.addEventListener('playing', show);
    video.addEventListener('ended', finish);
    video.addEventListener('error', finish);
    preference.addEventListener('change', onPreference);
    // Defer until paint so a development StrictMode remount cannot start a
    // discarded playback and interrupt the live instance's play promise.
    const frame = window.requestAnimationFrame(() => {
      if (finished) return;
      video.src = '/logo/ybs-navbar-intro.mp4';
      video.play().catch(finish);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      finish();
      video.removeEventListener('playing', show);
      video.removeEventListener('ended', finish);
      video.removeEventListener('error', finish);
      preference.removeEventListener('change', onPreference);
      video.removeAttribute('src');
      video.load();
    };
  }, []);

  return (
    <span ref={markRef} className={styles.logoMark} data-logo-state="static" aria-hidden="true">
      <Image src="/Logo.png" alt="" fill sizes="137px" priority className={styles.logoImage} />
      <video
        ref={videoRef}
        className={styles.logoVideo}
        muted
        playsInline
        preload="none"
        disablePictureInPicture
        tabIndex={-1}
      />
    </span>
  );
}
