'use client';

import { useId, useState } from 'react';
import { tiers } from '@/data/difference';
import styles from './CommissionCalculator.module.css';

/**
 * Commission on gross selling price, per the client-supplied logic:
 * 10% on the first $10M, 5% on the next $10M, 2.5% on everything above $20M.
 */
function commissionOnPrice(price: number): number {
  if (price <= 0) return 0;
  const firstBand = Math.min(price, 10_000_000) * 0.1;
  const secondBand = Math.min(Math.max(price - 10_000_000, 0), 10_000_000) * 0.05;
  const thirdBand = Math.max(price - 20_000_000, 0) * 0.025;
  return firstBand + secondBand + thirdBand;
}

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** Non-negative number from a text field. */
function toNumber(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

/** Percentage from a text field, clamped to 0–100. */
function toPercent(value: string): number {
  return Math.min(100, toNumber(value));
}

type AmountMode = 'price' | 'commission';

/**
 * "Compare it against your own numbers."
 *
 * Three columns: the broker's own figures (and what they keep today), then the
 * same commission under YBS Express (75%) and YBS Preferred (90%).
 *
 * The tiered commission structure is the client-supplied logic; the broker's
 * share of the commission is then split at the current rate or the YBS rate.
 */
export function CommissionCalculator() {
  const [mode, setMode] = useState<AmountMode>('price');
  const [amount, setAmount] = useState('10000000');
  const [currentSplit, setCurrentSplit] = useState('50');

  const amountId = useId();
  const splitId = useId();

  const grossCommission =
    mode === 'price' ? commissionOnPrice(toNumber(amount)) : toNumber(amount);

  const today = grossCommission * (toPercent(currentSplit) / 100);

  // Express (75%) first, Preferred (90%) second — 90% sits to the right of 75%.
  const columns = tiers.map((tier) => {
    const take = grossCommission * (tier.retention / 100);
    return {
      key: tier.name,
      label: tier.label,
      retention: tier.retention,
      take,
      ybsShare: grossCommission - take,
      dues: tier.price,
      difference: take - today,
    };
  });

  return (
    <div className={styles.calc}>
      {/* Column 1 — the broker's own numbers, and what they keep today */}
      <div className={styles.yours}>
        <span className={styles.cardLabel}>Your Numbers</span>

        <div className={styles.modeToggle} role="group" aria-label="Amount type">
          <button
            type="button"
            className={`${styles.modeBtn} ${mode === 'price' ? styles.modeBtnActive : ''}`}
            aria-pressed={mode === 'price'}
            onClick={() => setMode('price')}
          >
            Sell price
          </button>
          <button
            type="button"
            className={`${styles.modeBtn} ${mode === 'commission' ? styles.modeBtnActive : ''}`}
            aria-pressed={mode === 'commission'}
            onClick={() => setMode('commission')}
          >
            Commission
          </button>
        </div>

        <label className={styles.label} htmlFor={amountId}>
          {mode === 'price' ? 'Gross selling price ($)' : 'Gross commission ($)'}
        </label>
        <input
          id={amountId}
          className={styles.input}
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label className={styles.label} htmlFor={splitId}>
          Your current brokerage split (%)
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
          onChange={(e) => setCurrentSplit(e.target.value)}
        />
        <p className={styles.hint}>The share you keep under your current arrangement.</p>

        <div className={styles.todayBlock}>
          <span className={styles.cardLabel}>You keep today</span>
          <div className={styles.todayAmount}>{usd.format(today)}</div>
          <p className={styles.todayNote}>
            On a {usd.format(grossCommission)} gross commission
          </p>
        </div>
      </div>

      {/* Columns 2 and 3 — the same commission under YBS */}
      {columns.map((column) => (
        <div key={column.key} className={styles.card}>
          <span className={styles.cardLabel}>YBS {column.label}</span>
          <div className={styles.pill}>
            <span className={styles.pillValue}>{column.retention}%</span>
            <span className={styles.pillLabel}>to you</span>
          </div>
          <div className={styles.amount}>{usd.format(column.take)}</div>
          <p className={styles.delta}>
            {Math.round(column.difference) === 0
              ? 'About the same as today'
              : column.difference > 0
                ? `+${usd.format(column.difference)} more than today`
                : `${usd.format(Math.abs(column.difference))} less than today`}
          </p>
          <dl className={styles.ledger}>
            <div className={styles.ledgerRow}>
              <dt>YBS share</dt>
              <dd>{usd.format(column.ybsShare)}</dd>
            </div>
            <div className={styles.ledgerRow}>
              <dt>Dues</dt>
              <dd>{column.dues} per month</dd>
            </div>
          </dl>
        </div>
      ))}

      <p className={styles.note}>
        Illustrative only, before dues and deal costs. Your actual split depends
        on your agreement and the Independent Broker Membership Agreement.
      </p>
    </div>
  );
}
