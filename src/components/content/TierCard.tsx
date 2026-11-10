import type { Tier } from '@/data/site';
import { Counter } from '@/components/motion/Counter';
import styles from './TierCard.module.css';

export function TierCard({ tier }: { tier: Tier }) {
  return (
    <article className={styles.card}>
      <h3 className={styles.label}>{tier.label}</h3>
      <div className={styles.retention}>
        <span className={styles.retentionLabel}>Retain</span>
        <Counter value={tier.retention} className={styles.retentionValue} />
        <span className={styles.retentionLabel}>of gross commissions</span>
      </div>
      <div className={styles.price}>{tier.price}</div>
      <div className={styles.period}>{tier.period}</div>
    </article>
  );
}
