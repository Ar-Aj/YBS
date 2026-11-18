"use client";

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
              Your next chapter.<br />
              <em>
                <ShimmeringText
                  text="In numbers."
                  paused={!animate}
                  duration={2.8}
                  className={styles.shimmer}
                  style={{ '--color': 'var(--text-accent)', '--shimmering-color': 'var(--text-strong)' } as CSSProperties}
                  animate={{ backgroundPosition: animate ? ['100% 0%', '0% 0%'] : '100% 0%' }}
                  transition={{ duration: reducedMotion ? 0 : 2.8, delay: 0.4, ease: 'easeInOut', repeat: 0 }}
                />
              </em>
            </h2>
            <p className={styles.description}>
              You know your business. See what your numbers could look like with YBS.
            </p>
            <Button href="/the-ybs-difference#calculator" size="lg" className={styles.cta}>
              Calculate Your Income
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" /></svg>
            </Button>
            <p className={styles.note}>Your sales. Your split. A clearer picture.</p>
          </div>

          <div className={styles.art} aria-hidden="true">
            <span className={styles.backdropSymbol}>%</span>
            <div className={styles.calculator}>
              <div className={styles.instrumentHeader}><span>YBS</span><span>Income calculator</span></div>
              <div className={styles.display}>
                <span className={styles.displayLabel}>Your possibilities</span>
                <span className={styles.question}>What if?</span>
              </div>
              <div className={styles.keys}>
                {['7', '8', '9', '+', '4', '5', '6', '−', '1', '2', '3', '×', '%', '0', '.', '='].map((key, i) => (
                  <span key={key} className={i === 15 ? styles.equalKey : i % 4 === 3 ? styles.operatorKey : styles.key}>{key}</span>
                ))}
              </div>
            </div>
            <span className={styles.artCaption}>A different way to look at your future.</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
