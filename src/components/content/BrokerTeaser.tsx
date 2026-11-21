'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './BrokerTeaser.module.css';

export function BrokerTeaser() {
  const ref = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'blocked' | 'error'>('loading');
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let active = true;
    video.defaultMuted = true;
    video.muted = true;
    void video.play().catch(() => { if (active) setStatus(video.error ? 'error' : 'blocked'); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (status !== 'loading') return;
    const timer = window.setTimeout(() => setStatus('blocked'), 15000);
    return () => window.clearTimeout(timer);
  }, [status]);
  async function retry() {
    const video = ref.current;
    if (!video) return;
    setStatus('loading');
    if (video.error) video.load();
    try { await video.play(); } catch { setStatus(video.error ? 'error' : 'blocked'); }
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.player}>
        <video ref={ref} src="/videos/Broker%20Teaser%20Version%202.mp4"
          poster="/videos/broker-teaser-poster.jpg" width={1920} height={1080}
          autoPlay muted playsInline controls preload="auto" aria-label="YBS broker teaser"
          onPlaying={() => setStatus('ready')}
          onWaiting={() => setStatus('loading')} onError={() => setStatus('error')}
          onPause={() => setStatus((value) => value === 'loading' ? 'ready' : value)}
          onVolumeChange={() => setMuted(ref.current?.muted ?? true)}>
          Your browser does not support this video. Read the explainer script below.
        </video>
        {status === 'loading' && <div className={styles.loading} role="status"><span className={styles.spinner} aria-hidden="true" />Loading video…</div>}
      </div>
      <div className={styles.controls}>
        {status === 'error' || status === 'blocked' ? (
          <div role="status">
            <span>{status === 'error' ? 'Video could not load. ' : 'Video has not started. '}</span>
            <button type="button" onClick={retry}>{status === 'error' ? 'Retry video' : 'Play video'}</button>
          </div>
        ) : <button type="button" onClick={() => { if (ref.current) ref.current.muted = !ref.current.muted; }}>{muted ? 'Turn sound on' : 'Mute sound'}</button>}
        <a href="/documents/ybs-explainer-script.txt" target="_blank" rel="noopener noreferrer">Read the explainer script</a>
      </div>
    </div>
  );
}
