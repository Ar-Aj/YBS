'use client';

import { useId, useState } from 'react';
import { tiers } from '@/data/difference';
import styles from './CommissionCalculator.module.css';

const COMMISSION_RATE = 0.065;

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function toNumber(value: string): number {
  const parsed = Number(value.replace(/[$,%\s,]/g, ''));
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function toPercent(value: string): number {
  return Math.min(100, toNumber(value)) / 100;
}

/** Estimates annual income from average annual gross sales using the client's 6.5% model. */
export function CommissionCalculator() {
  const [sales, setSales] = useState('25,000,000');
  const [currentSplit, setCurrentSplit] = useState('65');
  const salesId = useId();
  const splitId = useId();

  const grossCommissionPool = toNumber(sales) * COMMISSION_RATE;
  const currentIncome = grossCommissionPool * toPercent(currentSplit);

  const results = tiers.map((tier) => {
    const income = grossCommissionPool * (tier.retention / 100);
    return {
      key: tier.name,
      label: tier.label,
      retention: tier.retention,
      income,
      additionalIncome: income - currentIncome,
      ybsShare: grossCommissionPool - income,
      dues: tier.price,
    };
  });

  return (
    <div className={styles.calc}>
      <article className={`${styles.card} ${styles.currentCard}`}>
        <h4 className={styles.cardTitle}>Your Numbers</h4>

        <label className={styles.label} htmlFor={salesId}>
          Average annual gross sales ($)
        </label>
        <input
          id={salesId}
          className={styles.input}
          type="text"
          inputMode="decimal"
          value={sales}
          aria-label="Average annual gross sales"
          onFocus={() => setSales((value) => value.replace(/,/g, ''))}
          onChange={(event) => setSales(event.target.value)}
          onBlur={() =>
            setSales(
              new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(
                toNumber(sales),
              ),
            )
          }
        />

        <label className={styles.label} htmlFor={splitId}>
          Your current average brokerage split (%)
        </label>
        <input
          id={splitId}
          className={styles.input}
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          step="any"
          value={currentSplit}
          aria-label="Current average brokerage split"
          onChange={(event) => setCurrentSplit(event.target.value)}
        />
        <p className={styles.hint}>The share you keep under your current arrangement.</p>

        <div className={styles.todayBlock}>
          <span className={styles.cardLabel}>You keep today</span>
          <div className={styles.resultAmount}>{usd.format(currentIncome)}</div>
          <p className={styles.todayNote}>
            On an estimated {usd.format(grossCommissionPool)} annual gross commission pool
          </p>
        </div>
      </article>

      {results.map((result, index) => (
        <article
          key={result.key}
          className={`${styles.card} ${index === results.length - 1 ? styles.featureCard : styles.standardCard}`}
          aria-live="polite"
        >
          <h4 className={styles.cardTitle}>YBS {result.label}</h4>
          <div className={styles.outputSummary}>
            <div className={styles.pill}>
              <span className={styles.pillValue}>{result.retention}%</span>
              <span className={styles.pillLabel}>to you</span>
            </div>
            <div className={styles.resultAmount}>{usd.format(result.income)}</div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Additional annual income</span>
              <strong className={styles.amount}>{usd.format(result.additionalIncome)}</strong>
            </div>
          </div>
          <dl className={styles.ledger}>
            <div className={styles.ledgerRow}>
              <dt>YBS share</dt>
              <dd>{usd.format(result.ybsShare)}</dd>
            </div>
            <div className={styles.ledgerRow}>
              <dt>Dues</dt>
              <dd>{result.dues} per month</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}
