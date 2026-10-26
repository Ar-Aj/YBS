"use client";

import { useEffect, useRef, useState } from 'react';
import styles from './CinematicHero.module.css';

type Props = {
  src: string;
  posterSrc: string;
  mobileSrc?: string;
  tabletSrc?: string;
};

type Tier = 'mobile' | 'tablet' | 'desktop';

function currentTier(): Tier {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Single-source responsive hero video. Only the active device tier mounts a
 * <video> element, so inactive variants are never downloaded. The tablet tier
 * falls back to the desktop source when no tablet cut exists; mobile falls
 * back to tablet, then desktop.
 */
export function HeroVideo({ src, posterSrc, mobileSrc, tabletSrc }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [tier, setTier] = useState<Tier>('desktop');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTier(currentTier());
    const onChange = () => setTier(currentTier());
    window.addEventListener('resize', onChange);
    window.addEventListener('orientationchange', onChange);
    return () => {
      window.removeEventListener('resize', onChange);
      window.removeEventListener('orientationchange', onChange);
    };
  }, []);

  const activeSrc =
    tier === 'mobile' ? (mobileSrc ?? tabletSrc ?? src)
    : tier === 'tablet' ? (tabletSrc ?? src)
    : src;

  useEffect(() => {
    if (!mounted) return;
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
      video.removeAttribute('autoplay');
      return;
    }

    let cancelled = false;
    const tryPlay = () => {
      if (cancelled || document.hidden) return;
      video.play().catch(() => {
        /* Autoplay refused — poster image remains visible. */
      });
    };

    // Let the media container adopt the true intrinsic ratio of the active
    // source, so tablet/mobile cuts are never cropped or mis-letterboxed.
    const adoptRatio = () => {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        const visual = video.closest('[data-hero-visual]') as HTMLElement | null;
        if (visual) {
          visual.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
        }
      }
    };
    if (video.readyState >= 1) adoptRatio();
    video.addEventListener('loadedmetadata', adoptRatio);

    tryPlay();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (cancelled) return;
        if (entry.isIntersecting) tryPlay();
        else video.pause();
      },
      { threshold: 0.2 }
    );
    observer.observe(video);

    const onVisibility = () => {
      if (cancelled) return;
      if (document.hidden) video.pause();
      else tryPlay();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      observer.disconnect();
      video.removeEventListener('loadedmetadata', adoptRatio);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [activeSrc, mounted]);

  // SSR / first paint: render nothing (poster <Image> covers it).
  if (!mounted) return null;

  return (
    <video
      ref={videoRef}
      key={activeSrc}
      src={activeSrc}
      poster={posterSrc}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
      className={styles.videoActive}
    />
  );
}
