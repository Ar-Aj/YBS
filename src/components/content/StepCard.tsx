import type { Step } from '@/data/site';
import styles from './StepCard.module.css';

export function StepCard({ step }: { step: Step }) {
  return (
    <li className={styles.step}>
      <span className={styles.number} aria-hidden="true">
        {step.number}
      </span>
      <h2 className={styles.title}>{step.title}</h2>
      <p>{step.description}</p>
    </li>
  );
}
