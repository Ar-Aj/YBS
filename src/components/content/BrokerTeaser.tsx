"use client";
import { useEffect, useRef, useState } from 'react';
import { getBrokerTeaser } from './BrokerTeaserPreload';
import { faqCategories } from '@/data/faq';
import styles from './BrokerTeaser.module.css';

const time = (n: number) => `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, '0')}`;
function Icon({ name }: { name: 'play' | 'pause' | 'sound' | 'muted' | 'expand' }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">{name === 'play' ? <path d="m8 5 11 7-11 7Z" fill="currentColor" /> : name === 'pause' ? <path d="M8 5v14M16 5v14" strokeWidth="4" /> : name === 'expand' ? <path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6" /> : <><path d="M11 4 6 8H3v8h3l5 4Z" />{name === 'sound' ? <path d="M15 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14" /> : <path d="m16 9 6 6m0-6-6 6" />}</>}</svg>;
}
export function BrokerTeaser() {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState('loading');
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffer, setBuffer] = useState(0);
  const [script, setScript] = useState(false);
  const [full, setFull] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const v = getBrokerTeaser(); video.current = v;
    host.current?.appendChild(v);
    let active = true;
    const sync = () => {
      if (!active) return;
      setPlaying(!v.paused && !v.ended); setMuted(v.muted || v.volume === 0);
      setVolume(v.volume);
      setElapsed(v.currentTime); setDuration(Number.isFinite(v.duration) ? v.duration : 0);
      if (v.buffered.length && v.duration) setBuffer(v.buffered.end(v.buffered.length - 1) / v.duration * 100);
    };
    const ready = () => { sync(); setStatus('ready'); };
    const waiting = () => setStatus('loading');
    const failed = () => { sync(); setStatus('error'); };
    const events = { playing: ready, pause: ready, ended: ready, timeupdate: sync, loadedmetadata: sync, progress: sync, volumechange: sync, waiting, error: failed };
    for (const [event, fn] of Object.entries(events)) v.addEventListener(event, fn);
    const fullscreen = () => setFull(document.fullscreenElement === player.current);
    document.addEventListener('fullscreenchange', fullscreen);
    sync();
    async function start() {
      v.muted = false;
      try { await v.play(); } catch (error) {
        if (!active || (error instanceof DOMException && error.name === 'AbortError')) return;
        if (v.error) { failed(); return; }
        v.muted = true;
        try { await v.play(); } catch { if (active) setStatus(v.error ? 'error' : 'blocked'); }
      }
      if (active) sync();
    }
    void start();
    return () => {
      active = false;
      for (const [event, fn] of Object.entries(events)) v.removeEventListener(event, fn);
      document.removeEventListener('fullscreenchange', fullscreen);
      v.pause(); v.remove();
    };
  }, []);
  useEffect(() => {
    if (status !== 'loading') return;
    const timeout = window.setTimeout(() => setStatus('slow'), 18000);
    return () => clearTimeout(timeout);
  }, [status]);
  async function play() {
    const v = video.current; if (!v) return;
    if (v.error) v.load();
    setStatus('loading');
    try { await v.play(); } catch { setStatus(v.error ? 'error' : 'blocked'); }
  }
  function sound() {
    const v = video.current; if (!v) return;
    v.muted = !(v.muted || v.volume === 0); if (!v.muted && !v.volume) v.volume = 1;
    if (v.paused) void play();
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (player.current?.requestFullscreen) await player.current.requestFullscreen();
      else (video.current as HTMLVideoElement & { webkitEnterFullscreen?: () => void })?.webkitEnterFullscreen?.();
    } catch { setNotice('Fullscreen is unavailable in this browser.'); }
  }
  return <div className={styles.wrapper}>
    <div className={styles.player} ref={player}>
      <div className={styles.screen}>
        <div className={styles.videoHost} ref={host} />
        {status === 'loading' && <div className={styles.loading} role="status"><div className={styles.orbit}><span>YBS</span></div><span>Preparing your film</span><div className={styles.loadTrack}><i style={{ width: `${buffer}%` }} /></div></div>}
        {['error', 'blocked', 'slow'].includes(status) && <div className={styles.fallback} role="status"><p>{status === 'error' ? 'The film could not be loaded.' : status === 'slow' ? 'Taking a little longer to load.' : 'Your film is ready to play.'}</p><button onClick={play}>{status === 'error' ? 'Try again' : 'Play film'}</button></div>}
        {status === 'ready' && !playing && <button className={styles.centerPlay} onClick={play} aria-label="Play film"><Icon name="play" /></button>}
        {status === 'ready' && muted && <button className={styles.soundPrompt} onClick={sound}><Icon name="sound" />Enable sound</button>}
      </div>
      <div className={styles.controls}>
        <div className={styles.seek}><div style={{ width: `${buffer}%` }} /><input aria-label="Seek video" type="range" min="0" max={duration || 1} step="0.1" value={Math.min(elapsed, duration || 1)} disabled={!duration} onChange={e => { if (video.current) { video.current.currentTime = +e.target.value; setElapsed(+e.target.value); } }} /></div>
        <div className={styles.toolbar}>
          <button aria-label={playing ? 'Pause film' : 'Play film'} onClick={() => playing ? video.current?.pause() : void play()}><Icon name={playing ? 'pause' : 'play'} /></button>
          <span className={styles.time}>{time(elapsed)} <span>/ {time(duration)}</span></span>
          <span className={styles.filmLabel}>YACHT BROKER SERVICES</span>
          <button aria-label={muted ? 'Enable sound' : 'Mute sound'} onClick={sound}><Icon name={muted ? 'muted' : 'sound'} /></button>
          <input className={styles.volume} type="range" aria-label="Volume" min="0" max="1" step="0.05" value={muted ? 0 : volume} onChange={e => { const v = video.current; if (v) { v.volume = +e.target.value; v.muted = v.volume === 0; } }} />
          <button aria-label={full ? 'Exit fullscreen' : 'Enter fullscreen'} onClick={fullscreen}><Icon name="expand" /></button>
        </div>
      </div>
    </div>
    {notice && <p role="status">{notice}</p>}
    <button className={styles.scriptToggle} aria-expanded={script} aria-controls="broker-script" onClick={() => { if (!script) video.current?.pause(); setScript(!script); }}><span>Prefer to read?</span> {script ? 'Close the script' : 'Read the script'} <span aria-hidden="true">{script ? '−' : '+'}</span></button>
    <section id="broker-script" className={styles.script} hidden={!script} aria-label="YBS explainer script">
      <header><span>THE EXPLAINER · APPROVED SCRIPT</span><h2>The YBS membership program</h2></header>
      <div className={styles.readingLayout}>
        <nav aria-label="Script sections">{faqCategories.map((c, i) => <a href={`#script-${c.id}`} key={c.id}><span>0{i + 1}</span>{c.title}</a>)}</nav>
        <article>
          <p className={styles.intro}>Welcome to Yacht Broker Services. We have designed our Membership Program to provide you with the backing you need to create and operate your brokerage business, while maintaining full control of your sales activities and retaining the majority of your commissions. Using a Q&A style explainer, I am going to walk you through the highlights of the program and demonstrate how this platform empowers you to grow your own organization. We will also cover some of the mechanics of our Independent Broker Membership contract.</p>
          {faqCategories.map(c => <section key={c.id} id={`script-${c.id}`}><h3>{c.title}</h3>{c.items.map(q => <div className={styles.answer} key={q.question}><h4>{q.question}</h4><p>{q.answer}</p></div>)}</section>)}
          <p>If you have additional questions, or would like to see the Independent Broker Membership Agreement, please reach out directly to Yacht Broker Services. We look forward to providing foundational and marketing support so your business can thrive.</p>
          <a className={styles.contact} href="/contact">Speak with YBS <span aria-hidden="true">↗</span></a>
        </article>
      </div>
    </section>
  </div>;
}
