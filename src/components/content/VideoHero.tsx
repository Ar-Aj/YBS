'use client';

import { useRef, useEffect } from 'react';
import styles from './VideoHero.module.css';

type Props = {
  poster: string;
  title?: string;
  ariaLabel?: string;
};

export function VideoHero({ poster, title, ariaLabel }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
      return;
    }

    // Pause when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.wrap}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        className={styles.video}
        aria-label={ariaLabel || 'Background video'}
      />
      <div className={styles.overlay}>
        {title && <h2 className={styles.title}>{title}</h2>}
      </div>
    </div>
  );
}
