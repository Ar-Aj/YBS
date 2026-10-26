"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  markBrandLoaderSeen,
  resetBrandLoaderGate,
  useBrandLoaderGate,
} from "@/hooks/useBrandLoaderGate";
import styles from "./BrandLoader.module.css";

const VIDEO_SRC = "/logo/ybs-logo-intro.mp4";
/** Fail-open: never trap the user behind the loader. Total two-pass time is
 *  D + D/1.25 (≈7.4s for the ~4s logo clip), so 14s covers slow start + both passes. */
const FAIL_OPEN_MS = 14000;
/** Short truthful hold once the intro finishes before revealing the page. */
const REVEAL_MS = 450;
/** Second-pass speed per the brief: first pass 1.0x, second pass 1.25x. */
const SECOND_PASS_RATE = 1.25;

export function BrandLoader() {
  const shouldPlay = useBrandLoaderGate();
  const reduced = usePrefersReducedMotion();
  const [dismissed, setDismissed] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fillRef = useRef<SVGCircleElement>(null);
  const markerGroupRef = useRef<SVGGElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const passRef = useRef<1 | 2>(1);
  const durationRef = useRef(0);
  const doneRef = useRef(false);
  const rafRef = useRef(0);
  const skipRef = useRef<HTMLButtonElement>(null);
  // Direct-DOM progress: the ring, marker and readout update via refs inside
  // the rAF loop, so React never re-renders 60×/s — no lag, no jitter.

  // The gate reads `true` on first client render for every page load, so the
  // overlay is present from the very first paint — the page is never seen
  // before the intro. Only the skip/reduced-motion/error paths dismiss it.

  // The gate is read during render, so the overlay mounts with it and no
  // `setState` is needed to switch it on.
  const visible = shouldPlay && !dismissed;

  const dismiss = useCallback((markSeen = true) => {
    if (doneRef.current) return;
    doneRef.current = true;
    cancelAnimationFrame(rafRef.current);
    setLeaving(true);
    window.setTimeout(() => {
      if (markSeen) {
        markBrandLoaderSeen();
      }
      setDismissed(true);
      setLeaving(false);
      document.body.style.overflow = "";
      document.body.classList.remove("ybs-loader-active");
    }, REVEAL_MS);
  }, []);

  // Dev-only reset: ?ybsLoader=reset clears the flag, window.__ybsLoaderReset replays.
  useEffect(() => {
    const reset = () => {
      resetBrandLoaderGate();
      doneRef.current = false;
      passRef.current = 1;
      setProgress(0);
      setLeaving(false);
      setDismissed(false);
    };
    (window as unknown as { __ybsLoaderReset?: () => void }).__ybsLoaderReset = reset;
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "l") {
        reset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock scroll + focus while the overlay is active.
  useEffect(() => {
    if (!visible) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("ybs-loader-active");
    const t = window.setTimeout(() => skipRef.current?.focus({ preventScroll: true }), 60);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove("ybs-loader-active");
    };
  }, [visible]);

  // Fail-open safety net.
  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(() => {
      setPreparing(true);
      dismiss(true);
    }, FAIL_OPEN_MS);
    return () => window.clearTimeout(t);
  }, [visible, dismiss]);

  // Two-pass playback sequencing: 1.0x then 1.25x, driven by `ended`.
  useEffect(() => {
    if (!visible) return;
    const video = videoRef.current;
    if (!video) return;

    if (reduced) {
      // Reduced motion: static first frame, brief hold, then reveal.
      // The progress readout is derived below, so no state update is needed.
      const t = window.setTimeout(() => dismiss(true), 900);
      return () => window.clearTimeout(t);
    }

    passRef.current = 1;
    let cancelled = false;
    let lastShown = -1;

    const R_RING = 123; // must match the SVG r below and the CSS orbit math
    const CIRC_TOTAL = 2 * Math.PI * R_RING;

    const totalDuration = () => {
      const d = durationRef.current || video.duration || 0;
      if (!d || !Number.isFinite(d)) return 0;
      return d + d / SECOND_PASS_RATE;
    };

    const paint = (pct: number) => {
      const p = Math.max(0, Math.min(100, pct));
      // Ring fill.
      fillRef.current?.setAttribute(
        "stroke-dashoffset",
        String(CIRC_TOTAL - (CIRC_TOTAL * p) / 100),
      );
      // Marker — parked exactly on the stroke head, in the ring's own SVG
      // coordinate space (cx/cy 130, radius R_RING). No CSS/px math involved.
      const ang = ((-90 + (p / 100) * 360) * Math.PI) / 180;
      const hx = 130 + Math.cos(ang) * R_RING;
      const hy = 130 + Math.sin(ang) * R_RING;
      const spin = -90 + (p / 100) * 360 + 90;
      markerGroupRef.current?.setAttribute(
        "transform",
        `translate(${hx} ${hy}) rotate(${spin})`,
      );
      // Readout — only touch the DOM on integer change.
      const whole = Math.round(p);
      if (whole !== lastShown) {
        lastShown = whole;
        if (percentRef.current) percentRef.current.textContent = `${whole}%`;
        const bar = document.querySelector('[role="progressbar"]');
        bar?.setAttribute("aria-valuenow", String(whole));
        bar?.setAttribute("aria-valuetext", `${whole} percent`);
      }
    };

    const tick = () => {
      if (cancelled || doneRef.current) return;
      const d = durationRef.current || video.duration;
      if (d && Number.isFinite(d) && d > 0) {
        const total = d + d / SECOND_PASS_RATE;
        // Pass 1 covers [0, D); pass 2 covers [D, D + D/1.25) — progress is
        // monotonic and completes pass 1 at D/total ≈ 55.56%.
        const elapsed =
          passRef.current === 1
            ? Math.min(video.currentTime, d)
            : d + Math.min(video.currentTime, d) / SECOND_PASS_RATE;
        const pct = Math.max(0, Math.min(100, (elapsed / total) * 100));
        paint(pct);
        // Keep one React state in sync at ~10Hz so nothing else re-renders.
        setProgress((prev) => (Math.abs(pct - prev) < 1 ? prev : pct));
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const onLoaded = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
      }
      video.playbackRate = 1.0;
      video.play().catch(() => {
        // Autoplay blocked — show truthful hold, then fail open.
        setPreparing(true);
        window.setTimeout(() => dismiss(true), 1200);
      });
    };

    const onEnded = () => {
      if (cancelled || doneRef.current) return;
      if (passRef.current === 1) {
        // Second complete pass at 1.25x. Guard against double `ended` in StrictMode.
        passRef.current = 2;
        try {
          video.currentTime = 0;
        } catch {
          /* seek failed — finish gracefully */
          finishIntro();
          return;
        }
        video.playbackRate = SECOND_PASS_RATE;
        video.play().catch(() => {
          setPreparing(true);
          window.setTimeout(() => dismiss(true), 800);
        });
      } else {
        finishIntro();
      }
    };

    const finishIntro = () => {
      const total = totalDuration();
      if (total > 0) {
        paint(100);
        setProgress(100);
      }
      // If the page shell is not ready yet the hold reads truthfully.
      setPreparing(true);
      window.setTimeout(() => {
        setPreparing(false);
        paint(100);
        setProgress(100);
        dismiss(true);
      }, 350);
    };

    const onError = () => {
      setPreparing(true);
      window.setTimeout(() => dismiss(true), 900);
    };

    // Pause ticking when the tab is hidden so we never restart playback on return.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
        video.pause();
      } else if (!doneRef.current && !reduced) {
        video.play().catch(() => {});
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);
    document.addEventListener("visibilitychange", onVisibility);
    rafRef.current = requestAnimationFrame(tick);

    // If metadata is already available (cached), kick off immediately.
    if (video.readyState >= 1) onLoaded();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [visible, reduced, dismiss]);

  if (!visible) return null;

  // In reduced-motion mode the intro holds on a static first frame, so the
  // ring reads as complete for the whole hold.
  const R = 123; // SVG units — ring sits OUTSIDE the disc so the marker is never buried
  const CIRC = 2 * Math.PI * R;
  const clamped = reduced ? 100 : Math.max(0, Math.min(100, progress));
  const offset = CIRC - (CIRC * clamped) / 100;
  // Yacht marker: starts at top (-90°) and completes one clockwise circuit.
  const angleDeg = -90 + (clamped / 100) * 360;
  const angleRad = (angleDeg * Math.PI) / 180;
  const orbitR = 123; // identical to R — marker welded to the ring stroke
  const mx = Math.cos(angleRad) * orbitR;
  const my = Math.sin(angleRad) * orbitR;

  return (
    <div
      className={`${styles.overlay} ${leaving ? styles.leaving : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Loading Yacht Broker Services"
    >
      <div className={styles.card}>
        <div
          className={styles.stage}
          role="progressbar"
          aria-label="Brand introduction progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(clamped)}
          aria-valuetext={`${Math.round(clamped)} percent`}
        >
          <svg className={styles.ring} viewBox="0 0 260 260" aria-hidden="true">
            <circle cx="130" cy="130" r={R} className={styles.track} />
            <circle
              cx="130"
              cy="130"
              r={R}
              ref={fillRef}
              className={styles.fill}
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              transform="rotate(-90 130 130)"
            />
            {/* Yacht marker — one SVG group riding the stroke head, in the
                ring's own coordinate space. The PNG is drawn via <image>
                so it can never drift out of alignment with the stroke. */}
            <g
              ref={markerGroupRef}
              transform={`translate(${130 + Math.cos(angleRad) * orbitR} ${130 + Math.sin(angleRad) * orbitR}) rotate(${angleDeg + 90})`}
            >
              <circle r="17" className={styles.markerHalo} />
              <image
                href="/yacht-marker.png"
                x="-14"
                y="-14"
                width="28"
                height="28"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          </svg>
          <div className={styles.disc}>
            <video
              ref={videoRef}
              className={styles.video}
              src={VIDEO_SRC}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>
          <span ref={percentRef} className={styles.percent} aria-hidden="true">
            {Math.round(clamped)}%
          </span>
        </div>
        <p className={styles.status} aria-hidden="true">
          {preparing ? "Preparing your experience" : "Yacht Broker Services"}
        </p>
        <button ref={skipRef} type="button" className={styles.skip} onClick={() => dismiss(true)}>
          Skip intro
        </button>
      </div>
    </div>
  );
}
