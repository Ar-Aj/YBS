import type { ServicePillar } from '@/data/site';
import styles from './ServiceCard.module.css';

export function ServiceCard({ pillar }: { pillar: ServicePillar }) {
  return (
    <div className={styles.card}>
      <div className={styles.topRule} />
      <h3 className={styles.title}>{pillar.title}</h3>
      <p className={styles.desc}>{pillar.description}</p>
      <hr className={styles.rule} />
      <ul className={styles.features}>
        {pillar.features.map((f) => (
          <li key={f}>
            <span className={styles.check}>✦</span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
