import type { FAQ } from '@/data/site';
import styles from './FAQAccordion.module.css';

type Props = {
  items: FAQ[];
  dark?: boolean;
};

export function FAQAccordion({ items, dark }: Props) {
  return (
    <div className={`${styles.list} ${dark ? styles.dark : ''}`}>
      {items.map((item) => (
        <details key={item.question} className={styles.item}>
          <summary className={styles.question}>
            <span>{item.question}</span>
            <span className={styles.icon} aria-hidden="true" />
          </summary>
          <div className={styles.answer}>
            <p>{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
