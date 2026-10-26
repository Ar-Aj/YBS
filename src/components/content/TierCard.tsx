import type { Tier } from '@/data/site';
import { Button } from '@/components/ui/Button';
import { Counter } from '@/components/motion/Counter';
import styles from './TierCard.module.css';

export function TierCard({ tier }: { tier: Tier }) {
  return (
    <div className={`${styles.card} ${tier.featured ? styles.featured : ''}`}>
      <div className={styles.label}>{tier.label}</div>
      <div className={styles.retention}>
        <span className={styles.retentionLabel}>Retain</span>
        <Counter value={tier.retention} className={styles.retentionValue} />
        <span className={styles.retentionLabel}>of gross commissions</span>
      </div>
      <div className={styles.price}>{tier.price}</div>
      <div className={styles.period}>{tier.period}</div>
      <p className={styles.desc}>{tier.description}</p>
      <ul className={styles.highlights}>
        {tier.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      <Button href="/contact" size="lg" fullWidth>
        Request a Confidential Call
      </Button>
    </div>
  );
}
