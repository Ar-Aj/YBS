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
    let disposed = false;
    let pending = false;
    let blocked = false;
    let sourceAssigned = false;
    const isVisible = () => document.visibilityState === 'visible';
    const showLogo = () => {
      mark.dataset.logoState = 'static';
    };
    const finish = () => {
      if (finished || disposed) return;
      finished = true;
      showLogo();
      video.autoplay = false;
      video.pause();
    };
    const show = () => {
      if (disposed) return;
      if (finished || preference.matches || !isVisible()) {
        showLogo();
        video.pause();
        return;
      }
      blocked = false;
      mark.dataset.logoState = 'playing';
    };
    const attemptPlayback = () => {
      if (disposed || finished || pending || blocked || !sourceAssigned || preference.matches || !isVisible()) return;
      // Set both the default and live properties before every attempt. Some
      // browsers inspect these separately when deciding whether to autoplay.
      video.defaultMuted = true;
      video.muted = true;
      video.playsInline = true;
      pending = true;
      void video.play().catch((error: unknown) => {
        if (disposed || finished) return;
        showLogo();
        const name = error instanceof DOMException ? error.name : '';
        if (name === 'NotAllowedError') {
          blocked = true;
        } else if (name !== 'AbortError') {
          finish();
        }
        // AbortError can occur when the tab is hidden during a pending play.
        // Keep the introduction eligible for the next visibility/ready event.
      }).finally(() => {
        pending = false;
      });
    };
    const onVisibility = () => {
      if (disposed || finished) return;
      video.autoplay = isVisible() && !preference.matches;
      if (!isVisible()) {
        showLogo();
        video.pause();
      } else {
        attemptPlayback();
      }
    };
    const onInteraction = () => {
      if (!video.paused || finished || disposed) return;
      blocked = false;
      attemptPlayback();
    };
    const onPreference = () => {
      if (preference.matches) finish();
    };
    // Loading has no page-load deadline: the static logo remains visible until
    // the browser confirms playback, even on a slow connection.
    video.addEventListener('playing', show);
    video.addEventListener('canplay', attemptPlayback);
    video.addEventListener('waiting', showLogo);
    video.addEventListener('pause', showLogo);
    video.addEventListener('ended', finish);
    video.addEventListener('error', finish);
    preference.addEventListener('change', onPreference);
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('pointerdown', onInteraction, { passive: true });
    document.addEventListener('keydown', onInteraction);
    // Defer until paint so a development StrictMode remount cannot start a
    // discarded playback and interrupt the live instance's play promise.
    const frame = window.requestAnimationFrame(() => {
      if (finished || disposed) return;
      video.defaultMuted = true;
      video.muted = true;
      video.setAttribute('muted', '');
      video.playsInline = true;
      video.autoplay = isVisible();
      video.src = '/logo/ybs-navbar-intro.mp4';
      sourceAssigned = true;
      video.load();
      attemptPlayback();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      finish();
      disposed = true;
      video.removeEventListener('playing', show);
      video.removeEventListener('canplay', attemptPlayback);
      video.removeEventListener('waiting', showLogo);
      video.removeEventListener('pause', showLogo);
      video.removeEventListener('ended', finish);
      video.removeEventListener('error', finish);
      preference.removeEventListener('change', onPreference);
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('pointerdown', onInteraction);
      document.removeEventListener('keydown', onInteraction);
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
        autoPlay
        playsInline
        preload="auto"
        disablePictureInPicture
        tabIndex={-1}
      />
    </span>
  );
}
