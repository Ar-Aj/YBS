"use client";

import Link from 'next/link';
import { useRef, type CSSProperties } from 'react';
import { useInView } from 'motion/react';
import { Container } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { ShimmeringText } from '@/components/bklit/ShimmeringText';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import styles from './CalculatorInvitation.module.css';

export function CalculatorInvitation() {
  const ref = useRef<HTMLElement>(null);
  const entered = useInView(ref, { once: true, amount: 0.25 });
  const reducedMotion = usePrefersReducedMotion();
  const animate = entered && !reducedMotion;

  return (
    <section ref={ref} className={styles.section} data-entered={entered} aria-labelledby="calculator-invitation-title">
      <Container>
        <div className={styles.layout}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>The YBS income calculator</p>
            <h2 id="calculator-invitation-title" className={styles.title}>
              Your next chapter<br />
              <em>
                <ShimmeringText
                  text="In numbers"
                  paused={!animate}
                  duration={2.8}
                  className={styles.shimmer}
                  style={{ '--color': 'var(--text-accent)', '--shimmering-color': 'var(--text-strong)' } as CSSProperties}
                  animate={{ backgroundPosition: animate ? ['100% 0%', '0% 0%'] : '100% 0%' }}
                  transition={{ duration: reducedMotion ? 0 : 2.8, delay: 0.4, ease: 'easeInOut', repeat: 0 }}
                />
              </em>
            </h2>
            <Button href="/the-ybs-difference#calculator" size="lg" className={styles.cta}>
              Calculate Your Income
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" /></svg>
            </Button>
          </div>

          <Link href="/the-ybs-difference#calculator" className={styles.art} aria-label="Calculate your income with YBS">
            <span className={styles.backdropSymbol} aria-hidden="true">%</span>
            <div className={styles.calculator} aria-hidden="true">
              <div className={styles.instrumentHeader}><span>YBS</span><span>Income calculator</span></div>
              <div className={styles.display}>
                <span className={styles.question}>What if?</span>
              </div>
              <div className={styles.keys}>
                {['7', '8', '9', '+', '4', '5', '6', '−', '1', '2', '3', '×', '%', '0', '.', '='].map((key, i) => (
                  <span key={key} className={i === 15 ? styles.equalKey : i % 4 === 3 ? styles.operatorKey : styles.key}>{key}</span>
                ))}
              </div>
            </div>
          </Link>
        </div>
      </Container>
    </section>
  );
}
