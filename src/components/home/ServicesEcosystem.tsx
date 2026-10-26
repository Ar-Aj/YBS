'use client';

import { Button } from '@/components/ui/Button';
import { PillarIcon } from '@/components/motion/PillarIcon';
import { useReveal } from '@/components/motion/useReveal';
import { settleTime } from '@/components/motion/motion-tokens';
import { servicePillars } from '@/data/services';
import styles from './ServicesEcosystem.module.css';

/**
 * Services ecosystem: the homepage's signature motion moment.
 *
 * One observer watches the stage. When its top edge nears the trigger line the
 * sequence plays once: the hub settles, a spine draws down from it, a branch
 * rule opens sideways, then the four pillars arrive left to right. All motion
 * is CSS keyframes on transform and opacity, so there are no per-frame React
 * renders and no scroll-linked math. Server HTML contains every pillar in full.
 */
export function ServicesEcosystem() {
  const ref = useReveal<HTMLDivElement>({
    trigger: 0.72,
    settle: settleTime({ delay: 1000, duration: 'signature', staggered: true }),
  });

  return (
    <section className={styles.ecosystem} aria-labelledby="ecosystem-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>What We Provide</span>
          <h2 id="ecosystem-title" className={styles.title}>
            One Membership, Four Areas of Support
          </h2>
          <p className={styles.subtitle}>
            Brand and marketing, business operations, CRM and MLS, and transaction
            support, all running under your own company identity.
          </p>
        </div>

        <div ref={ref} className={styles.stage}>
          <div className={styles.hub}>
            <div className={styles.hubInner}>
              <span className={styles.hubLabel}>YBS</span>
              <span className={styles.hubSub}>Membership</span>
            </div>
          </div>

          <span className={styles.spine} aria-hidden="true" />
          <span className={styles.branch} aria-hidden="true" />

          <ul className={styles.pillars}>
            {servicePillars.map((pillar) => (
              <li key={pillar.title} className={styles.pillar}>
                <span className={styles.tick} aria-hidden="true" />
                <div className={styles.card}>
                  <span className={styles.icon}>
                    <PillarIcon icon={pillar.icon} />
                  </span>
                  <h3 className={styles.cardTitle}>{pillar.title}</h3>
                  <p className={styles.cardDesc}>{pillar.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.cta}>
          <Button href="/services" variant="secondary">
            Explore All Services
          </Button>
        </div>
      </div>
    </section>
  );
}
