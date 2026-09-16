"use client";

import { useEffect, useRef } from 'react';
import styles from './CinematicHero.module.css';

type Props = {
  src: string;
  posterSrc: string;
  objectPositionDesktop?: string;
};

export function HeroVideo({ src, posterSrc, objectPositionDesktop = 'center center' }: Props) {
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
  );
}
