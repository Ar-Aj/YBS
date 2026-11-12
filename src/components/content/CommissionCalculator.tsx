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
    };
  });

  return (
    <div className={styles.calc}>
      <article className={`${styles.card} ${styles.currentCard}`}>
        <h4 className={styles.cardTitle}>Your Numbers</h4>

        <label className={styles.label} htmlFor={salesId}>
          Your average annual gross sales
        </label>
        <div className={styles.inputWrap}>
          <span aria-hidden="true">$</span>
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
        </div>

        <label className={styles.label} htmlFor={splitId}>
          Your current average brokerage split (%)
        </label>
        <div className={styles.inputWrap}>
          <input
            id={splitId}
            className={`${styles.input} ${styles.splitInput}`}
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step="any"
            value={currentSplit}
            aria-label="Current average brokerage split"
            onChange={(event) => setCurrentSplit(event.target.value)}
          />
          <span aria-hidden="true">%</span>
        </div>
      </article>

      {results.map((result, index) => (
        <article
          key={result.key}
          className={`${styles.card} ${index === results.length - 1 ? styles.featureCard : styles.standardCard}`}
          aria-live="polite"
        >
          <h4 className={styles.cardTitle}>YBS {result.label}</h4>
          <div className={styles.outputHead}>
            <span className={styles.split}>{result.retention}% to you</span>
            <strong className={styles.primary}>{usd.format(result.income)}</strong>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Additional annual income</span>
            <strong className={styles.amount}>{usd.format(result.additionalIncome)}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}
