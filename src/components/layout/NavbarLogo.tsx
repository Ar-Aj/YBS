'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import styles from './Header.module.css';

/** A single, non-blocking introduction in the existing logo footprint. */
export function NavbarLogo() {
  const debugRef = useRef<HTMLOutputElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mark = markRef.current;
    const video = videoRef.current;
    if (!mark || !video) return;

    // Client-approved exception: this one-shot logo plays regardless of reduced motion.
    const report = (status: string) => {
      if (!debugRef.current) return;
      debugRef.current.hidden = false;
      const messages: Record<string, string> = {
        initializing: 'Loading the logo animation…',
        'requesting playback': 'Waiting for the logo animation to start…',
        playing: 'Success: the logo animation is playing.',
        'animation completed': 'Success: the logo animation played completely.',
        'autoplay blocked; waiting for click, tap or key': 'Autoplay blocked by the browser. Click or tap anywhere to retry.',
        'playback interrupted': 'Playback was interrupted. Waiting to retry.',
        'network load failed; waiting for reload': 'The video could not load over the network. Waiting to retry.',
        'load interrupted; retrying once': 'The video download was interrupted. Retrying once…',
        'buffering; static logo visible': 'The animation is buffering. The still logo is shown while it loads.',
        'playback stopped': 'The animation has stopped.',
        'tab hidden': 'Animation paused because this browser tab is not visible.',
      };
      const mediaReasons: Record<number, string> = {
        1: 'The browser aborted the video download.',
        2: 'A network error prevented the video from loading.',
        3: 'The browser could not decode the video.',
        4: 'The video source is unavailable or unsupported by this browser.',
      };
      const failed = status.startsWith('media failed') || status.startsWith('playback failed');
      debugRef.current.textContent = messages[status] ?? (failed
        ? `Animation failed: ${mediaReasons[video.error?.code ?? 0] ?? (status.includes('NotSupportedError') ? 'This browser could not play the video source.' : 'The browser did not provide a specific reason.')} (${status})`
        : status);
      debugRef.current.dataset.result = status === 'playing' || status === 'animation completed' ? 'success' : failed ? 'error' : 'waiting';
      debugRef.current.title = `Logo v2 | ${status} | ready: ${video.readyState} | network: ${video.networkState} | media error: ${video.error?.code ?? 'none'}`;
    };
    report('initializing');

    let finished = false;
    let disposed = false;
    let pending = false;
    let blocked = false;
    let sourceAssigned = false;
    let abortRetries = 0;
    let loadRetries = 0;
    let retryTimer: number | undefined;
    let loadTimer: number | undefined;
    const isVisible = () => document.visibilityState === 'visible';
    const showLogo = () => {
      mark.dataset.logoState = 'static';
    };
    const finish = () => {
      if (finished || disposed) return;
      finished = true;
      report(video.ended ? 'animation completed' : 'playback stopped');
      window.clearTimeout(retryTimer);
      window.clearTimeout(loadTimer);
      showLogo();
      video.autoplay = false;
      video.pause();
    };
    const show = () => {
      if (disposed) return;
      if (finished || !isVisible()) {
        showLogo();
        video.pause();
        return;
      }
      blocked = false;
      abortRetries = 0;
      mark.dataset.logoState = 'playing';
      report('playing');
    };
    const attemptPlayback = () => {
      if (disposed || finished || pending || blocked || !sourceAssigned || !isVisible()) return;
      // Set both the default and live properties before every attempt. Some
      // browsers inspect these separately when deciding whether to autoplay.
      video.defaultMuted = true;
      video.muted = true;
      video.playsInline = true;
      pending = true;
      report('requesting playback');
      let interrupted = false;
      void video.play().catch((error: unknown) => {
        if (disposed || finished) return;
        showLogo();
        const name = error instanceof DOMException ? error.name : '';
        if (name === 'NotAllowedError') {
          blocked = true;
          report('autoplay blocked; waiting for click, tap or key');
        } else if (name === 'AbortError') {
          interrupted = true;
          report('playback interrupted');
        } else if (video.error?.code === 1 || video.error?.code === 2) {
          // The media error event owns the bounded network reload.
          report('network load failed; waiting for reload');
        } else {
          finish();
          report(`playback failed: ${name || 'unknown error'}`);
        }
        // AbortError can occur when the tab is hidden during a pending play.
        // Keep the introduction eligible for the next visibility/ready event.
      }).finally(() => {
        pending = false;
        // A visibility/ready event can arrive before an aborted play promise
        // settles. Retry once after settlement so that event is not lost.
        if (interrupted && !video.error && !disposed && !finished && isVisible() && abortRetries < 1) {
          abortRetries += 1;
          retryTimer = window.setTimeout(attemptPlayback, 0);
        }
      });
    };
    const onVisibility = () => {
      if (disposed || finished) return;
      video.autoplay = isVisible();
      if (!isVisible()) {
        showLogo();
        video.pause();
        report('tab hidden');
      } else {
        blocked = false;
        attemptPlayback();
      }
    };
    const onInteraction = () => {
      if (!video.paused || finished || disposed) return;
      blocked = false;
      attemptPlayback();
    };
    const onError = () => {
      if (disposed || finished) return;
      const code = video.error?.code;
      showLogo();
      // Retry a transient network/aborted load once, never loop on codec errors.
      if ((code === 1 || code === 2) && loadRetries < 1) {
        loadRetries += 1;
        report('load interrupted; retrying once');
        loadTimer = window.setTimeout(() => {
          if (disposed || finished) return;
          blocked = false;
          video.load();
          attemptPlayback();
        }, 1000);
      } else {
        finish();
        report(`media failed (code ${code ?? 'unknown'})`);
      }
    };
    const onWaiting = () => { showLogo(); report('buffering; static logo visible'); };
    const onOnline = () => { if (!finished) { blocked = false; attemptPlayback(); } };

    // Loading has no page-load deadline: the static logo remains visible until
    // the browser confirms playback, even on a slow connection.
    video.addEventListener('playing', show);
    video.addEventListener('canplay', attemptPlayback);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('pause', showLogo);
    video.addEventListener('ended', finish);
    video.addEventListener('error', onError);
    window.addEventListener('online', onOnline);
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('pointerdown', onInteraction, { passive: true });
    document.addEventListener('click', onInteraction, { passive: true });
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
      video.src = '/logo/ybs-navbar-intro.mp4?v=2';
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
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('pause', showLogo);
      video.removeEventListener('ended', finish);
      video.removeEventListener('error', onError);
      window.removeEventListener('online', onOnline);
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('pointerdown', onInteraction);
      document.removeEventListener('click', onInteraction);
      document.removeEventListener('keydown', onInteraction);
      video.removeAttribute('src');
      video.load();
    };
  }, []);

  return (
    <>
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
    <output ref={debugRef} className={styles.logoDebug} aria-live="polite" aria-atomic="true" data-result="waiting">
      Logo animation: waiting for the page to initialize...
    </output>
    </>
  );
}
