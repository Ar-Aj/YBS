'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { servicePillars } from '@/data/services';
import styles from './ServicesEcosystem.module.css';

/**
 * Services Ecosystem — scroll-driven radial assembly
 * 
 * Choreography:
 * - Central hub fades in + scales up from 0.7 → 1.0
 * - Three service nodes orbit in from offset positions, each on its own timing
 * - Connection lines draw from 0 → 100% stroke-dashoffset
 * - Everything locks into final grid on completion
 * 
 * Mobile: vertical stack with sequential fade-up, no orbital motion
 */

const REDUCED_MOTION = typeof window !== 'undefined' 
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
  : false;

export function ServicesEcosystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Start when section top hits 80% down viewport, complete when section center hits 30% down
    offset: ['start 0.8', 'center 0.3'],
  });

  // Hub: fade + scale 0→0.4 scroll
  const hubOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  const hubScale = useTransform(scrollYProgress, [0, 0.4], [0.7, 1]);

  // Nodes orbit in sequentially: Marketing 0.1→0.5, Operations 0.2→0.6, CRM 0.3→0.7
  const node1Progress = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const node2Progress = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);
  const node3Progress = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);

  // Lines draw 0.4→0.8
  const lineProgress = useTransform(scrollYProgress, [0.4, 0.8], [0, 1]);

  return (
    <section ref={containerRef} className={styles.ecosystem}>
      <div className={styles.container}>
        {/* Section header (static) */}
        <div className={styles.header}>
          <span className={styles.label}>What We Provide</span>
          <h2 className={styles.title}>Your Complete Support Ecosystem</h2>
          <p className={styles.subtitle}>
            Bespoke marketing, full back-office operations, CRM, and transaction support.
          </p>
        </div>

        {/* Desktop: radial orbital layout */}
        <div className={styles.desktopOrbit} aria-hidden={REDUCED_MOTION ? 'false' : undefined}>
          {/* Central hub */}
          <motion.div
            className={styles.hub}
            style={{
              opacity: REDUCED_MOTION ? 1 : hubOpacity,
              scale: REDUCED_MOTION ? 1 : hubScale,
            }}
          >
            <div className={styles.hubInner}>
              <span className={styles.hubLabel}>YBS</span>
              <span className={styles.hubSub}>Infrastructure</span>
            </div>
          </motion.div>

          {/* Node 1: Marketing — starts top-left, moves to final position */}
          <ServiceNode
            pillar={servicePillars[0]}
            progress={node1Progress}
            startX={-120}
            startY={-80}
            finalX={0}
            finalY={0}
            position="top"
          />

          {/* Node 2: Operations — starts bottom-left, moves right */}
          <ServiceNode
            pillar={servicePillars[1]}
            progress={node2Progress}
            startX={-100}
            startY={60}
            finalX={0}
            finalY={0}
            position="left"
          />

          {/* Node 3: CRM — starts right, moves in */}
          <ServiceNode
            pillar={servicePillars[2]}
            progress={node3Progress}
            startX={100}
            startY={-40}
            finalX={0}
            finalY={0}
            position="right"
          />

          {/* Connection lines (SVG overlay) */}
          <svg className={styles.lines} aria-hidden="true">
            <ConnectionLine progress={lineProgress} x1="50%" y1="50%" x2="50%" y2="20%" />
            <ConnectionLine progress={lineProgress} x1="50%" y1="50%" x2="20%" y2="70%" />
            <ConnectionLine progress={lineProgress} x1="50%" y1="50%" x2="80%" y2="30%" />
          </svg>
        </div>

        {/* Mobile: simple vertical stack with sequential fade-up */}
        <div className={styles.mobileStack}>
          {servicePillars.slice(0, 3).map((pillar, i) => (
            <MobileServiceCard key={pillar.title} pillar={pillar} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <Button href="/services" variant="secondary">
            Explore All Services
          </Button>
        </div>
      </div>
    </section>
  );
}

interface ServiceNodeProps {
  pillar: typeof servicePillars[0];
  progress: any;
  startX: number;
  startY: number;
  finalX: number;
  finalY: number;
  position: 'top' | 'left' | 'right';
}

function ServiceNode({ pillar, progress, startX, startY, finalX, finalY, position }: ServiceNodeProps) {
  const x = useTransform(progress, [0, 1], [startX, finalX]);
  const y = useTransform(progress, [0, 1], [startY, finalY]);
  const opacity = useTransform(progress, [0, 0.3], [0, 1]);
  const scale = useTransform(progress, [0, 0.5, 1], [0.8, 1.05, 1]);

  return (
    <motion.div
      className={`${styles.node} ${styles[`node${position.charAt(0).toUpperCase()}${position.slice(1)}`]}`}
      style={{
        x: REDUCED_MOTION ? 0 : x,
        y: REDUCED_MOTION ? 0 : y,
        opacity: REDUCED_MOTION ? 1 : opacity,
        scale: REDUCED_MOTION ? 1 : scale,
      }}
    >
      <div className={styles.nodeIcon}>{pillar.icon}</div>
      <h3 className={styles.nodeTitle}>{pillar.title}</h3>
      <p className={styles.nodeDesc}>{pillar.description.slice(0, 90)}…</p>
    </motion.div>
  );
}

interface ConnectionLineProps {
  progress: any;
  x1: string;
  y1: string;
  x2: string;
  y2: string;
}

function ConnectionLine({ progress, x1, y1, x2, y2 }: ConnectionLineProps) {
  const pathLength = useTransform(progress, [0, 1], [1, 0]); // SVG dashoffset: 1 → 0 reveals the line

  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="rgba(180, 135, 44, 0.3)"
      strokeWidth="1.5"
      strokeDasharray="1"
      style={{ strokeDashoffset: REDUCED_MOTION ? 0 : pathLength }}
    />
  );
}

// Mobile simplified card
function MobileServiceCard({ pillar, index }: { pillar: typeof servicePillars[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.6'],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <motion.div
      ref={ref}
      className={styles.mobileCard}
      style={{
        opacity: REDUCED_MOTION ? 1 : opacity,
        y: REDUCED_MOTION ? 0 : y,
      }}
    >
      <div className={styles.mobileIcon}>{pillar.icon}</div>
      <h3 className={styles.mobileTitle}>{pillar.title}</h3>
      <p className={styles.mobileDesc}>{pillar.description}</p>
    </motion.div>
  );
}
