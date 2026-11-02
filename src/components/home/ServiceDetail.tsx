import type { ServicePillar } from '@/data/site';
import styles from './ServiceDetail.module.css';

type Props = {
  pillars: ServicePillar[];
};

/**
 * Service list for "Everything Included in Your Membership".
 *
 * Every panel is always open: there is no toggle, no plus/minus icon and no
 * click needed. All copy is in the server HTML and visible on first paint.
 */
export function ServiceDetail({ pillars }: Props) {
  return (
    <div className={styles.grid}>
      {pillars.map((pillar) => (
        <div key={pillar.title} className={styles.card}>
          <div className={styles.header}>
            <h3 className={styles.title}>{pillar.title}</h3>
          </div>
          <div className={styles.body}>
            <p className={styles.description}>{pillar.description}</p>
            <ul className={styles.features}>
              {pillar.features.map((feat) => (
                <li key={feat}>{feat}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
