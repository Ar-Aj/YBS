import type { Step } from '@/data/site';
import styles from './StepCard.module.css';

export function StepCard({ step }: { step: Step }) {
  return (
    <div className={styles.card}>
      <div className={styles.number}>{step.number}</div>
      <h3 className={styles.title}>{step.title}</h3>
      <p className={styles.text}>{step.description}</p>
    </div>
  );
}
