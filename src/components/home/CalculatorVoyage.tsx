'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Component,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import { tiers } from '@/data/difference';
import {
  calculateIncome,
  money,
  percentageChange,
  whole,
} from '@/lib/commissionCalculator';
import type { CameraViewPreset } from './GoldenYachtScene';
import { VoyageTimeClock } from './VoyageTimeClock';
import styles from './CalculatorVoyage.module.css';

const GoldenYachtScene = dynamic(() => import('./GoldenYachtScene'), {
  ssr: false,
  loading: () => <YachtMorningFallback />,
});

const CAMERA_VIEWS: { id: CameraViewPreset; label: string }[] = [
  { id: 'stern-quarter', label: 'Beach Club Aft' },
  { id: 'bow-quarter', label: 'Bow Quarter' },
  { id: 'profile', label: 'Profile' },
  { id: 'aerial', label: 'Aerial' },
];

const SPLIT_PRESETS = [50, 60, 70] as const;

function AnimatedCurrency({
  value,
  reduced,
  prefix = '',
}: {
  value: number;
  reduced: boolean;
  prefix?: string;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    if (reduced) {
      el.textContent = `${prefix}${money.format(Math.round(value))}`;
      prevValue.current = value;
      return;
    }

    const from = prevValue.current;
    prevValue.current = value;
    const controls = animate(from, value, {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        el.textContent = `${prefix}${money.format(Math.round(latest))}`;
      },
      onComplete: () => {
        el.textContent = `${prefix}${money.format(Math.round(value))}`;
      },
    });

    return () => controls.stop();
  }, [value, reduced, prefix]);

  return (
    <span ref={spanRef}>
      {prefix}
      {money.format(Math.round(value))}
    </span>
  );
}

function YachtMorningFallback() {
  return (
    <div className={styles.fallbackFrame} aria-hidden="true">
      <svg className={styles.silhouette} viewBox="0 0 860 320">
        <defs>
          <linearGradient id="ybs-morning-hull" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#efe0be" />
            <stop offset="55%" stopColor="#c8a45a" />
            <stop offset="100%" stopColor="#947032" />
          </linearGradient>
        </defs>
        <g
          fill="url(#ybs-morning-hull)"
          stroke="#a9822f"
          strokeWidth="1.2"
          strokeLinejoin="round"
        >
          <path d="M88 216 L132 192 L784 168 L732 232 Q420 250 116 232 Z" />
          <path d="M180 190 L226 154 L610 150 L656 174 Z" fill="#fffdf9" />
          <path d="M254 152 L296 120 L528 118 L572 150 Z" fill="#fffdf9" />
          <path d="M320 118 L350 98 L468 98 L496 118 Z" fill="#fffdf9" />
        </g>
      </svg>
    </div>
  );
}

class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <YachtMorningFallback />
    ) : (
      this.props.children
    );
  }
}

export function CalculatorVoyage() {
  const sectionRef = useRef<HTMLElement>(null);
  const sliderId = useId();
  const visible = useInView(sectionRef, { amount: 0.08 });
  const reducedMotion = Boolean(useReducedMotion());

  // Immediately preload the 3D scene chunk, .glb model, and .hdr environment in the background
  // as soon as the user lands on the homepage so it is 100% loaded and ready before scrolling.
  useEffect(() => {
    void import('./GoldenYachtScene');
    fetch('/models/superyacht.glb?v=9', { credentials: 'same-origin' }).catch(
      () => {}
    );
    fetch('/models/ocean_morning.hdr', { credentials: 'same-origin' }).catch(
      () => {}
    );
  }, []);

  const [selectedTier, setSelectedTier] = useState<'standard' | 'elevated'>(
    'elevated'
  );
  const [salesMillions, setSalesMillions] = useState<number>(25);
  const [currentSplit, setCurrentSplit] = useState<number>(50);
  const [viewPreset, setViewPreset] =
    useState<CameraViewPreset>('stern-quarter');
  const [timeHours, setTimeHours] = useState<number>(6.25);
  const [paused, setPaused] = useState<boolean>(false);

  const elevated = selectedTier === 'elevated';
  const active = visible && !paused && !reducedMotion;

  // Live calculation using exact calculator logic (5% gross commission rate)
  const grossSales = salesMillions * 1_000_000;
  const calc = calculateIncome('sales', grossSales, 0, 5, currentSplit);

  const standardIncome = (calc.pool * 75) / 100;
  const elevatedIncome = (calc.pool * 90) / 100;
  const activeYbsIncome = elevated ? elevatedIncome : standardIncome;
  const annualGain = activeYbsIncome - calc.current;
  const fiveYearDelta = annualGain * 5;
  const pctIncrease = percentageChange(calc.current, activeYbsIncome);

  const maxBar = Math.max(calc.pool, 1);
  const currentBarPct = Math.min(100, Math.round((calc.current / maxBar) * 100));

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="voyage-heading"
    >
      <div className={styles.stage}>
        {/* Upper Main Grid: Left Minimal Calculator Preview + Strong CTA | Right Real Morning 3D Yacht */}
        <div className={styles.mainGrid}>
          <motion.div
            className={styles.leftColumn}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reducedMotion ? 0 : 0.8 }}
          >
            <div className={styles.headerBlock}>
              <span className="eyebrow">Commission Calculator</span>
              <h2 id="voyage-heading" className={styles.heading}>
                See What Your Volume Earns With YBS
              </h2>
              <p className={styles.lead}>
                Preview your annual take-home below, or open the full calculator
                to enter your exact gross sales, commission rate, and 5-year
                projection.
              </p>
            </div>

            {/* Interactive Quick Controls */}
            <div
              className={styles.simulatorPanel}
              role="region"
              aria-label="Commission preview controls"
            >
              {/* 1. Annual Gross Sales Slider */}
              <div className={styles.controlGroup}>
                <div className={styles.controlHeader}>
                  <label htmlFor={sliderId} className={styles.controlLabel}>
                    Average Annual Gross Sales
                  </label>
                  <output htmlFor={sliderId} className={styles.controlValue}>
                    ${whole.format(salesMillions)},000,000
                  </output>
                </div>
                <input
                  id={sliderId}
                  type="range"
                  min={10}
                  max={75}
                  step={5}
                  value={salesMillions}
                  onChange={(e) => setSalesMillions(Number(e.target.value))}
                  className={styles.rangeSlider}
                />
                <div className={styles.rangeTicks} aria-hidden="true">
                  <span>$10M</span>
                  <span>$25M</span>
                  <span>$40M</span>
                  <span>$55M</span>
                  <span>$75M</span>
                </div>
              </div>

              {/* 2. Split & Tier Selectors */}
              <div className={styles.controlRow}>
                <div className={styles.controlBlock}>
                  <span className={styles.controlLabel}>Current Split</span>
                  <div
                    className={styles.pillGroup}
                    role="group"
                    aria-label="Your current brokerage split"
                  >
                    {SPLIT_PRESETS.map((sp) => (
                      <button
                        key={sp}
                        type="button"
                        className={styles.pillBtn}
                        aria-pressed={currentSplit === sp}
                        onClick={() => setCurrentSplit(sp)}
                      >
                        {sp}/{100 - sp}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.controlBlock}>
                  <span className={styles.controlLabel}>Membership</span>
                  <div
                    className={styles.pillGroup}
                    role="group"
                    aria-label="YBS Membership Tier"
                  >
                    {tiers.map((t) => (
                      <button
                        key={t.name}
                        type="button"
                        className={styles.pillBtn}
                        aria-pressed={selectedTier === t.name}
                        onClick={() => setSelectedTier(t.name)}
                      >
                        <span>{t.label}</span>
                        <strong>{t.retention}%</strong>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Strong, Prominent Primary CTA to Calculator Page */}
            <div className={styles.ctaCard}>
              <div className={styles.ctaSummary}>
                <span className={styles.ctaSummaryLabel}>
                  Estimated Annual Gain ({elevated ? 'Elevated' : 'Standard'})
                </span>
                <div className={styles.ctaSummaryAmount}>
                  <AnimatedCurrency
                    value={Math.abs(annualGain)}
                    reduced={reducedMotion}
                    prefix={annualGain >= 0 ? '+' : '-'}
                  />
                  <span className={styles.ctaSummaryBadge}>{pctIncrease}</span>
                </div>
              </div>

              <Link
                className={styles.primaryCta}
                href="/the-ybs-difference#calculator"
              >
                <span>Calculate With Your Exact Numbers</span>
                <span className={styles.ctaArrow} aria-hidden="true">
                  &rarr;
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Real Morning Daylight 3D Superyacht & Ocean */}
          <div className={styles.rightColumn}>
            <div
              className={styles.canvasContainer}
              role="region"
              aria-label="Interactive 3D yacht in open ocean"
            >
              <SceneErrorBoundary>
                <GoldenYachtScene
                  active={active}
                  elevated={elevated}
                  viewPreset={viewPreset}
                  timeHours={timeHours}
                />
              </SceneErrorBoundary>
            </div>

            {/* Top HUD: Interactive Marine Chronometer (Night -> Dawn -> Sunrise -> Morning) */}
            <div className={styles.viewportTopHud}>
              <VoyageTimeClock
                timeHours={timeHours}
                onChange={setTimeHours}
              />
            </div>

            {/* Bottom HUD: Floating Glassmorphic Camera Controls */}
            <div className={styles.cameraBar}>
              <div
                className={styles.cameraPresets}
                role="group"
                aria-label="Camera views"
              >
                {CAMERA_VIEWS.map((cam) => (
                  <button
                    key={cam.id}
                    type="button"
                    className={styles.camBtn}
                    aria-pressed={viewPreset === cam.id}
                    onClick={() => setViewPreset(cam.id)}
                  >
                    {cam.label}
                  </button>
                ))}
              </div>

              {!reducedMotion && (
                <button
                  type="button"
                  className={styles.camBtn}
                  onClick={() => setPaused((p) => !p)}
                  aria-label={paused ? 'Play animation' : 'Pause animation'}
                >
                  {paused ? 'Play' : 'Pause'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom 4-Column Live Comparison Strip (Light Champagne / Pearl Theme) */}
        <div
          className={styles.telemetryDeck}
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Column 1: Current House */}
          <div className={styles.telemetryCard}>
            <div className={styles.telemetryHeader}>
              <span className={styles.telemetryTag}>
                Current Split ({currentSplit}/{100 - currentSplit})
              </span>
            </div>
            <div className={styles.telemetryAmountMuted}>
              <AnimatedCurrency value={calc.current} reduced={reducedMotion} />
              <small>/yr</small>
            </div>
            <div className={styles.barTrack} aria-hidden="true">
              <div
                className={styles.barFillMuted}
                style={{ width: `${currentBarPct}%` }}
              />
            </div>
            <p className={styles.telemetryMeta}>
              House takes{' '}
              <strong>{money.format(calc.pool - calc.current)}</strong>/yr
            </p>
          </div>

          {/* Column 2: YBS Standard (75%) */}
          <div
            className={`${styles.telemetryCard} ${selectedTier === 'standard' ? styles.telemetryCardActive : ''
              }`}
            onClick={() => setSelectedTier('standard')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedTier('standard');
              }
            }}
            aria-pressed={selectedTier === 'standard'}
          >
            <div className={styles.telemetryHeader}>
              <span className={styles.telemetryTagGold}>
                Standard &middot; 75%
              </span>
              <span className={styles.telemetryDues}>$1,500/mo</span>
            </div>
            <div className={styles.telemetryAmount}>
              <AnimatedCurrency
                value={standardIncome}
                reduced={reducedMotion}
              />
              <small>/yr</small>
            </div>
            <div className={styles.barTrack} aria-hidden="true">
              <div
                className={styles.barFillStandard}
                style={{ width: '75%' }}
              />
            </div>
            <p className={styles.telemetryMeta}>
              <strong>
                {standardIncome >= calc.current ? '+' : ''}
                {money.format(standardIncome - calc.current)}/yr
              </strong>{' '}
              ({percentageChange(calc.current, standardIncome)})
            </p>
          </div>

          {/* Column 3: YBS Elevated (90%) */}
          <div
            className={`${styles.telemetryCard} ${selectedTier === 'elevated' ? styles.telemetryCardActive : ''
              }`}
            onClick={() => setSelectedTier('elevated')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedTier('elevated');
              }
            }}
            aria-pressed={selectedTier === 'elevated'}
          >
            <div className={styles.telemetryHeader}>
              <span className={styles.telemetryTagGold}>
                Elevated &middot; 90%
              </span>
              <span className={styles.telemetryDues}>$3,000/mo</span>
            </div>
            <div className={styles.telemetryAmount}>
              <AnimatedCurrency
                value={elevatedIncome}
                reduced={reducedMotion}
              />
              <small>/yr</small>
            </div>
            <div className={styles.barTrack} aria-hidden="true">
              <div
                className={styles.barFillElevated}
                style={{ width: '90%' }}
              />
            </div>
            <p className={styles.telemetryMeta}>
              <strong>
                {elevatedIncome >= calc.current ? '+' : ''}
                {money.format(elevatedIncome - calc.current)}/yr
              </strong>{' '}
              ({percentageChange(calc.current, elevatedIncome)})
            </p>
          </div>

          {/* Column 4: 5-Year Difference + Direct Link */}
          <div className={styles.telemetryCardHighlight}>
            <div className={styles.telemetryHeader}>
              <span className={styles.telemetryTagGold}>5-Year Difference</span>
              <span className={styles.telemetryDues}>
                {elevated ? 'Elevated' : 'Standard'}
              </span>
            </div>
            <div className={styles.telemetryAmountGold}>
              <AnimatedCurrency
                value={Math.abs(fiveYearDelta)}
                reduced={reducedMotion}
                prefix={fiveYearDelta >= 0 ? '+' : '-'}
              />
            </div>
            <Link
              href="/the-ybs-difference#calculator"
              className={styles.deckLink}
            >
              <span>Open 5-Year Chart in Calculator</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
