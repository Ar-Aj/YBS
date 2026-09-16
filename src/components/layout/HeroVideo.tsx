"use client";

import { useEffect, useRef } from 'react';
import styles from './CinematicHero.module.css';

type Props = {
  src: string;
  posterSrc: string;
  objectPositionDesktop?: string;
  mobileSrc?: string;
  tabletSrc?: string;
};

export function HeroVideo({ src, posterSrc, objectPositionDesktop = 'center center', mobileSrc, tabletSrc }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setPlaybackRate = () => {
      video.playbackRate = 1.5;
    };

    // Set initial playback rate
    setPlaybackRate();

    // Reapply on events where browser might reset it
    video.addEventListener('loadedmetadata', setPlaybackRate);
    video.addEventListener('canplay', setPlaybackRate);
    video.addEventListener('play', setPlaybackRate);
    video.addEventListener('ended', setPlaybackRate);

    return () => {
      video.removeEventListener('loadedmetadata', setPlaybackRate);
      video.removeEventListener('canplay', setPlaybackRate);
      video.removeEventListener('play', setPlaybackRate);
      video.removeEventListener('ended', setPlaybackRate);
    };
  }, []);

  return (
    <>
      {/* Desktop video — ≥1024px */}
      <video
        ref={videoRef}
        src={src}
        poster={posterSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={styles.videoDesktop}
        style={{ objectPosition: objectPositionDesktop }}
      />
      {/* Tablet video — 768px–1023px */}
      {tabletSrc && (
        <video
          src={tabletSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className={styles.videoTablet}
        />
      )}
      {/* Mobile video — ≤767px */}
      {mobileSrc && (
        <video
          src={mobileSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className={styles.videoMobile}
        />
      )}
    </>
  );
}
