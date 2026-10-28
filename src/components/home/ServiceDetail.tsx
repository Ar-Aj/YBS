'use client';

import { useId, useState } from 'react';
import type { ServicePillar } from '@/data/site';
import styles from './ServiceDetail.module.css';

type Props = {
  pillars: ServicePillar[];
};

/**
 * Accessible accordion. Every panel is in the server HTML (crawlable); the
 * header button toggles `aria-expanded` and the panel opens with a CSS-grid
 * height transition (no JS-measured heights). Reduced motion removes the
 * transition. Panels are hidden from assistive tech and tab order when closed.
 */
export function ServiceDetail({ pillars }: Props) {
  const [expanded, setExpanded] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className={styles.grid}>
      {pillars.map((pillar, i) => {
        const isExpanded = expanded === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <div key={pillar.title} className={styles.card}>
            <h3 className={styles.heading}>
              <button
                id={buttonId}
                type="button"
                className={styles.header}
                onClick={() => setExpanded(isExpanded ? null : i)}
                aria-expanded={isExpanded}
                aria-controls={panelId}
              >
                <span className={styles.title}>{pillar.title}</span>
                <span className={styles.icon} aria-hidden="true" />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="m-panel"
              data-open={isExpanded}
            >
              <div className="m-panel-inner">
                <div className={styles.body}>
                  <p className={styles.description}>{pillar.description}</p>
                  <ul className={styles.features}>
                    {pillar.features.map((feat) => (
                      <li key={feat}>{feat}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
