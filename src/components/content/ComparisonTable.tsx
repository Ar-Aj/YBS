import type { ComparisonRow } from '@/data/site';
import styles from './ComparisonTable.module.css';

export function ComparisonTable({ rows }: { rows: ComparisonRow[] }) {
  return (
    <>
      {/* Desktop table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thFeature}>Feature</th>
              <th className={styles.thTraditional}>Traditional Brokerage</th>
              <th className={styles.thYbs}>Yacht Broker Services</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature}>
                <td className={styles.tdFeature}>{row.feature}</td>
                <td className={styles.tdTraditional}>{row.traditional}</td>
                <td className={styles.tdYbs}>{row.ybs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className={styles.cards}>
        {rows.map((row) => (
          <div key={row.feature} className={styles.card}>
            <h4 className={styles.cardFeature}>{row.feature}</h4>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Traditional</span>
              <p className={styles.cardTraditional}>{row.traditional}</p>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabelYbs}>YBS</span>
              <p className={styles.cardYbs}>{row.ybs}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
