'use client';

import { useRef, useCallback, type PointerEvent as ReactPointerEvent } from 'react';
import styles from './CalculatorVoyage.module.css';

export type TimeStop = {
  hours: number;
  label: string;
  phase: string;
};

export const TIME_STOPS: TimeStop[] = [
  { hours: 0.5, label: '00:30', phase: 'Starlight Night' },
  { hours: 4.5, label: '04:30', phase: 'Blue Hour Dawn' },
  { hours: 6.25, label: '06:15', phase: 'Golden Sunrise' },
  { hours: 9.5, label: '09:30', phase: 'Morning Sea' },
];

type VoyageTimeClockProps = {
  /** Time of day in decimal hours from 0.0 (00:00 Midnight) to 11.0 (11:00 AM) */
  timeHours: number;
  onChange: (hours: number) => void;
};

/**
 * Formats decimal hours (0.0 - 11.99) into HH:MM AM string + atmospheric phase label.
 */
export function formatClockReadout(hours: number): {
  timeStr: string;
  phaseLabel: string;
} {
  const clamped = Math.max(0, Math.min(11.75, hours));
  const h = Math.floor(clamped);
  const m = Math.round((clamped - h) * 60) % 60;
  const displayH = h === 0 ? 12 : h;
  const timeStr = `${String(displayH).padStart(2, '0')}:${String(m).padStart(2, '0')} AM`;

  let phaseLabel = 'Morning Daylight';
  if (clamped < 3.6) {
    phaseLabel = 'Midnight Watch';
  } else if (clamped < 5.3) {
    phaseLabel = 'Nautical Twilight';
  } else if (clamped < 7.2) {
    phaseLabel = 'Golden Sunrise';
  }
  return { timeStr, phaseLabel };
}

/**
 * Deterministic 3-decimal formatter for SVG coordinates so SSR (Node) and Client (Browser)
 * never differ by 1 ULP in Math.sin / Math.cos during React hydration.
 */
function svgCoord(n: number): string {
  return n.toFixed(3);
}

/**
 * Interactive Marine Chronometer Clock component allowing users to rotate the clock hand
 * or select presets from Night (00:00) through Dawn (04:30) and Sunrise (06:15) to Morning (11:00).
 */
export function VoyageTimeClock({ timeHours, onChange }: VoyageTimeClockProps) {
  const dialRef = useRef<SVGSVGElement>(null);
  const draggingRef = useRef(false);

  // Map 0..12 hours onto a 360-degree 12-hour analog clock face
  const clampedHours = Math.max(0, Math.min(11.75, timeHours));
  const hourAngleDeg = (clampedHours / 12) * 360;
  const minuteAngleDeg = ((clampedHours % 1) * 360) % 360;

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const svg = dialRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.5;
      const dx = clientX - cx;
      const dy = clientY - cy;
      // Angle clockwise from 12 o'clock (top = -Y)
      let deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
      if (deg < 0) deg += 360;
      const rawHours = (deg / 360) * 12;
      const snapped = Math.round(rawHours * 12) / 12; // 5-minute increments
      onChange(Math.max(0.0, Math.min(11.5, snapped)));
    },
    [onChange]
  );

  const handlePointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!draggingRef.current) return;
    updateFromPointer(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const { timeStr, phaseLabel } = formatClockReadout(clampedHours);

  // Hand endpoint coordinates on 64x64 viewBox (center 32,32) rounded deterministically for SSR hydration
  const rad = ((hourAngleDeg - 90) * Math.PI) / 180;
  const handX = svgCoord(32 + Math.cos(rad) * 18.5);
  const handY = svgCoord(32 + Math.sin(rad) * 18.5);

  const minRad = ((minuteAngleDeg - 90) * Math.PI) / 180;
  const minX = svgCoord(32 + Math.cos(minRad) * 22.5);
  const minY = svgCoord(32 + Math.sin(minRad) * 22.5);

  const isNight = clampedHours < 4.8;

  return (
    <div
      className={styles.chronometerWidget}
      role="group"
      aria-label="Time of day marine chronometer"
    >
      {/* Interactive Rotary Analog Chronometer Dial */}
      <div className={styles.chronometerDialWrap}>
        <svg
          ref={dialRef}
          viewBox="0 0 64 64"
          className={styles.chronometerSvg}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          role="slider"
          aria-label="Drag clock hand from midnight to morning"
          aria-valuemin={0}
          aria-valuemax={11.5}
          aria-valuenow={Number(clampedHours.toFixed(2))}
          aria-valuetext={`${timeStr}, ${phaseLabel}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
              e.preventDefault();
              onChange(Math.min(11.5, clampedHours + 0.5));
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
              e.preventDefault();
              onChange(Math.max(0.0, clampedHours - 0.5));
            }
          }}
        >
          <defs>
            <linearGradient id="ybs-chrono-bezel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f8f2e4" />
              <stop offset="50%" stopColor="#d4b982" />
              <stop offset="100%" stopColor="#9c7b3e" />
            </linearGradient>
            <radialGradient id="ybs-chrono-face" cx="50%" cy="50%" r="50%">
              <stop
                offset="0%"
                stopColor={isNight ? '#13243b' : '#fffdf9'}
              />
              <stop
                offset="100%"
                stopColor={isNight ? '#091526' : '#f3ead8'}
              />
            </radialGradient>
          </defs>

          {/* Outer Brass Bezel Ring */}
          <circle
            cx="32"
            cy="32"
            r="30"
            fill="url(#ybs-chrono-bezel)"
            stroke="rgba(168, 132, 68, 0.45)"
            strokeWidth="1"
          />
          {/* Inner Chronometer Face */}
          <circle
            cx="32"
            cy="32"
            r="26.5"
            fill="url(#ybs-chrono-face)"
            stroke="rgba(184, 149, 82, 0.35)"
            strokeWidth="0.8"
          />

          {/* 12 Hour Tick Marks around the Chronometer */}
          {Array.from({ length: 12 }).map((_, idx) => {
            const a = ((idx * 30 - 90) * Math.PI) / 180;
            const rIn = idx % 3 === 0 ? 21.5 : 23.2;
            const rOut = 25.2;
            return (
              <line
                key={idx}
                x1={svgCoord(32 + Math.cos(a) * rIn)}
                y1={svgCoord(32 + Math.sin(a) * rIn)}
                x2={svgCoord(32 + Math.cos(a) * rOut)}
                y2={svgCoord(32 + Math.sin(a) * rOut)}
                stroke={
                  isNight
                    ? idx % 3 === 0
                      ? '#e5c787'
                      : 'rgba(229, 199, 135, 0.45)'
                    : idx % 3 === 0
                      ? '#7a5c22'
                      : 'rgba(122, 92, 34, 0.4)'
                }
                strokeWidth={idx % 3 === 0 ? '1.5' : '0.9'}
                strokeLinecap="round"
              />
            );
          })}

          {/* Minute Hand */}
          <line
            x1="32"
            y1="32"
            x2={minX}
            y2={minY}
            stroke={isNight ? 'rgba(232, 208, 156, 0.55)' : 'rgba(92, 72, 36, 0.45)'}
            strokeWidth="1.1"
            strokeLinecap="round"
          />

          {/* Primary Hour Hand */}
          <line
            x1="32"
            y1="32"
            x2={handX}
            y2={handY}
            stroke={isNight ? '#f4c86e' : '#9e7526'}
            strokeWidth="2.1"
            strokeLinecap="round"
          />

          {/* Glowing Sun / Moon Orb at the tip of the Hour Hand */}
          <circle
            cx={handX}
            cy={handY}
            r="3.2"
            fill={isNight ? '#56e8f2' : '#f0a838'}
            stroke={isNight ? '#ffffff' : '#fffdf8'}
            strokeWidth="1"
          />

          {/* Center Pivot Cap */}
          <circle
            cx="32"
            cy="32"
            r="2.4"
            fill="#c59f52"
            stroke="#fffdf7"
            strokeWidth="0.7"
          />
        </svg>
      </div>

      {/* Digital Readout + Scrubber + Quick Time Stops */}
      <div className={styles.chronometerControls}>
        <div className={styles.chronometerHeader}>
          <span className={styles.chronometerTime}>{timeStr}</span>
          <span className={styles.chronometerPhase}>{phaseLabel}</span>
        </div>

        <input
          type="range"
          min={0}
          max={11}
          step={0.1}
          value={clampedHours}
          onChange={(e) => onChange(Number(e.target.value))}
          className={styles.chronometerSlider}
          aria-label="Scrub time from night to morning"
        />

        <div className={styles.chronometerStops}>
          {TIME_STOPS.map((st) => {
            const isSelected = Math.abs(clampedHours - st.hours) < 0.6;
            return (
              <button
                key={st.label}
                type="button"
                className={styles.chronoStopBtn}
                aria-pressed={isSelected}
                onClick={() => onChange(st.hours)}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
