import type { ServicePillar } from '@/data/site';
import styles from './ServiceChapter.module.css';

export function ServiceChapter({
  pillar,
  index,
}: {
  pillar: ServicePillar;
  index: number;
}) {
  return (
    <article className={styles.chapter}>
      <div className={styles.index} aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className={styles.body}>
        <div className={styles.head}>
          <h3 className={styles.title}>{pillar.title}</h3>
          <p className={styles.desc}>{pillar.description}</p>
        </div>
        <ul className={styles.features}>
          {pillar.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
