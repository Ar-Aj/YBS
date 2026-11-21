"use client";
import { useEffect } from 'react';

let teaser: HTMLVideoElement | undefined;
/** One media element survives client-side navigation, retaining its buffered data. */
export function getBrokerTeaser() {
  if (!teaser) {
    teaser = document.createElement('video');
    teaser.src = '/videos/Broker%20Teaser%20Version%202.mp4';
    teaser.preload = 'auto';
    teaser.playsInline = true;
    teaser.poster = '/videos/broker-teaser-poster.jpg';
    teaser.setAttribute('aria-label', 'YBS broker teaser');
    teaser.width = 1920; teaser.height = 1080;
    // Preload only. Never play audio or video on unrelated pages.
    teaser.load();
  }
  return teaser;
}
export function BrokerTeaserPreload() {
  useEffect(() => { getBrokerTeaser(); }, []);
  return null;
}
