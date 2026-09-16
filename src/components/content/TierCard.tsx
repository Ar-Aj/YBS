import type { Tier } from '@/data/site';
import { Button } from '@/components/ui/Button';
import styles from './TierCard.module.css';

export function TierCard({ tier }: { tier: Tier }) {
  return (
    <div className={`${styles.card} ${tier.featured ? styles.featured : ''}`}>
      {tier.featured && <span className={styles.badge}>Most Popular</span>}
      <div className={styles.split}>
        {tier.split.split('/').map((n, i) => (
          <span key={i}>
            {i > 0 && <span className={styles.slash}>/</span>}
            {n}
          </span>
        ))}
      </div>
      <div className={styles.label}>{tier.label}</div>
      <div className={styles.price}>{tier.price}</div>
      <div className={styles.period}>{tier.period}</div>
      <p className={styles.desc}>{tier.description}</p>
      <Button href="/contact" size="lg" fullWidth>
        Get Started
      </Button>
    </div>
  );
}
