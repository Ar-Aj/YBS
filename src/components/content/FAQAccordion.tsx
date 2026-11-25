import Link from 'next/link';
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
            <span className={styles.toggleHint}><span className={styles.showHint}>View answer</span><span className={styles.hideHint}>Hide answer</span>
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
            </span>
          </summary>
          <div className={styles.answer}>
            <p>{item.answer}</p>
            {item.link && (
              <Link className={styles.answerLink} href={item.link.href}>
                {item.link.label}
              </Link>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
