import type { Step } from '@/data/site';
import styles from './StepCard.module.css';

export function StepCard({ step, rail = false }: { step: Step; rail?: boolean }) {
  return (
    <div className={rail ? styles.railStep : styles.card}>
      <div className={rail ? styles.railNumber : styles.number}>{step.number}</div>
      <h3 className={styles.title}>{step.title}</h3>
      <p className={styles.text}>{step.description}</p>
    </div>
  );
}
