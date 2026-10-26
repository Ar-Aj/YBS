import { Stagger } from '@/components/motion/Stagger';
import styles from './TermsList.module.css';

type Term = { title: string; text: string };

/**
 * Definition list of the contractual qualifications that apply to both
 * membership options. Semantic <dl> so the terms stay machine-readable.
 */
export function TermsList({ terms }: { terms: Term[] }) {
  return (
    <Stagger as="dl" className={styles.list}>
      {terms.map((t) => (
        <div key={t.title} className={styles.item}>
          <dt className={styles.term}>{t.title}</dt>
          <dd className={styles.text}>{t.text}</dd>
        </div>
      ))}
    </Stagger>
  );
}
