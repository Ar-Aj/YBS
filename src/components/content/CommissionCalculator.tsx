'use client';

import { useEffect, useId, useState, type CSSProperties } from 'react';
import { tiers } from '@/data/difference';
import { calculateIncome, money, numberValue, percentageChange, whole } from '@/lib/commissionCalculator';
import styles from './CommissionCalculator.module.css';

type View = 'compare' | 'years';
const views = [['compare', 'Compare'], ['years', '5 Years']] as const;
const vars = (values: Record<string, number>) => Object.fromEntries(Object.entries(values).map(([key, value]) => [`--${key}`, value])) as CSSProperties;

function CompareChart({ current, income, growth }: { current: number; income: number; growth: number }) {
  const top = Math.max(current, income);
  const k = top > 0 ? 112 / top * growth : 0;
  const items = [
    { base: current, gold: 0, short: 0, value: current, cx: 94, name: 'Current Income' },
    { base: Math.min(current, income), gold: Math.max(0, income - current), short: Math.max(0, current - income), value: income, cx: 226, name: 'Income with YBS' },
  ];
  return <>
    <path className={styles.axis} d="M30 168H290" />
    {items.map((item) => <g key={item.name}>
      {(['base', 'gold', 'short'] as const).map((segment) => <rect
        key={segment}
        className={`${styles.grow} ${segment === 'base' ? styles.barBase : segment === 'gold' ? styles.barGold : styles.barShort}`}
        x={item.cx - 42} y={167} width={84} height={1}
        style={{ ...vars({ b: segment === 'base' ? 0 : item.base * k, h: item[segment] * k }), transformOrigin: '0px 168px' }}
      />)}
      <text className={styles.val} x={item.cx} y={160} style={vars({ t: (item.base + item.gold) * k })}>{money.format(item.value)}</text>
      <text className={styles.cap} x={item.cx} y={188}>{item.name}</text>
    </g>)}
  </>;
}

function YearsChart({ current, income, growth }: { current: number; income: number; growth: number }) {
  const max = Math.max(current, income);
  const fc = max > 0 ? current / max * growth : 0;
  const fy = max > 0 ? income / max * growth : 0;
  const above = income >= current;
  const diff = (income - current) * 5;
  const scaledPath = (className: string, d: string, factor: number) => <path className={`${styles.sy} ${className}`} d={d} style={{ ...vars({ f: factor }), transformOrigin: '0px 166px' }} />;
  return <>
    {scaledPath(styles.areaGold, 'M40 166L246 166L246 54Z', fy)}
    {scaledPath(styles.areaBg, 'M40 166L246 166L246 54Z', fc)}
    <path className={styles.axis} d="M40 166H246" />
    {[1, 2, 3, 4, 5].map((year) => <g key={year}>
      <path className={styles.tickv} d={`M${40 + 206 * year / 5} 166v4`} />
      <text className={styles.cap} x={40 + 206 * year / 5} y={185}>Yr {year}</text>
    </g>)}
    {scaledPath(styles.lineCur, 'M40 166L246 54', fc)}
    {scaledPath(styles.lineGold, 'M40 166L246 54', fy)}
    <circle className={`${styles.dot} ${styles.dotCur}`} cx={246} cy={166} r={4.5} style={vars({ t: fc * 112 })} />
    <circle className={`${styles.dot} ${styles.dotGold}`} cx={246} cy={166} r={4.5} style={vars({ t: fy * 112 })} />
    <text className={styles.endLabel} x={256} y={170} style={vars({ t: fc * 112, dy: above ? 13 : -5 })}>Current</text>
    <text className={`${styles.endLabel} ${styles.gold}`} x={256} y={170} style={vars({ t: fy * 112, dy: above ? -5 : 13 })}>With YBS</text>
    <text className={styles.headline} x={150} y={26}>{diff >= 0 ? '+' : '−'}{money.format(Math.abs(diff))} over 5 years</text>
  </>;
}

export function CommissionCalculator() {
  const id = useId();
  const [basis, setBasis] = useState<'sales' | 'income'>('sales');
  const [sales, setSales] = useState('25,000,000');
  const [income, setIncome] = useState('625,000');
  const [rate, setRate] = useState('5');
  const [split, setSplit] = useState('50');
  const [view, setView] = useState<View>('compare');
  const [growth, setGrowth] = useState(0);
  const [replay, setReplay] = useState(0);
  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => setGrowth(1)); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [replay]);
  const selectView = (next: View) => {
    setGrowth(0);
    setView(next);
    setReplay((value) => value + 1);
  };
  const result = calculateIncome(basis, numberValue(sales), numberValue(income), numberValue(rate), numberValue(split));
  const salesValue = basis === 'sales' ? sales : whole.format(Math.round(result.estimatedSales));
  const incomeValue = basis === 'income' ? income : whole.format(Math.round(result.estimatedIncome));
  const changeBasis = (next: 'sales' | 'income') => {
    if (next === 'income') setIncome(incomeValue); else setSales(salesValue);
    setBasis(next);
  };
  const formatField = (value: string) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(numberValue(value));
  const percentInput = (key: string, value: string, label: string, onChange?: (value: string) => void, disabled = false) => <input
    id={`${id}-${key}`} className={`${styles.input} ${styles.splitInput}`} inputMode="decimal" value={value}
    style={{ width: `${Math.max(1, value.length) + 1}ch` }} aria-label={label}
    readOnly={!onChange} tabIndex={onChange ? undefined : -1} disabled={disabled}
    onChange={onChange ? (event) => onChange(event.target.value) : undefined}
  />;

  return <div className={styles.calc}>
    <section className={styles.card}>
      <h4 className={styles.cardTitle}>Your Numbers</h4>
      <p className={styles.hint}>Choose one: start from your annual gross sales or your recent gross income.</p>
      <div className={`${styles.field} ${basis === 'income' ? styles.off : ''}`}>
        <div className={styles.labelRow}>
          <input type="radio" name={`${id}-basis`} checked={basis === 'sales'} onChange={() => changeBasis('sales')} aria-label="Calculate from my average annual gross sales" />
          <label className={styles.label} htmlFor={`${id}-sales`}>YOUR AVERAGE ANNUAL GROSS SALES</label>
        </div>
        <div className={styles.inputWrap}><span>$&nbsp;</span><input id={`${id}-sales`} className={styles.input} inputMode="decimal" value={salesValue} disabled={basis === 'income'} aria-label="Average annual gross sales" onFocus={() => setSales(sales.replace(/,/g, ''))} onChange={(e) => setSales(e.target.value)} onBlur={() => setSales(formatField(sales))} /></div>
      </div>
      <div className={styles.orDivider} aria-hidden="true"><span>or</span></div>
      <div className={`${styles.field} ${basis === 'sales' ? styles.off : ''}`}>
        <div className={styles.labelRow}>
          <input type="radio" name={`${id}-basis`} checked={basis === 'income'} onChange={() => changeBasis('income')} aria-label="Calculate from my recent gross income" />
          <label className={styles.label} htmlFor={`${id}-income`}>YOUR RECENT GROSS INCOME</label>
        </div>
        <div className={styles.inputWrap}><span>$&nbsp;</span><input id={`${id}-income`} className={styles.input} inputMode="decimal" value={incomeValue} disabled={basis === 'sales'} aria-label="Recent gross income" onFocus={() => setIncome(income.replace(/,/g, ''))} onChange={(e) => setIncome(e.target.value)} onBlur={() => setIncome(formatField(income))} /></div>
      </div>
      <div className={`${styles.field} ${basis === 'income' ? styles.off : ''}`}>
        <label className={styles.label} htmlFor={`${id}-rate`}>GROSS COMMISSION % RETAINED BY YOU &amp; YOUR HOUSE (TYPICALLY ~5%)</label>
        <div className={styles.inputWrap}>{percentInput('rate', rate, 'Gross commission percent retained by you and your house', setRate, basis === 'income')}<span>%</span></div>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${id}-split`}>YOUR CURRENT BROKERAGE SPLIT WITH THE HOUSE (YOU / HOUSE)</label>
        <div className={styles.inputWrap}>
          {percentInput('split', split, 'Your share of the split, percent', setSplit)}<span>%</span>
          <span className={styles.locked}><span className={styles.slash}>/</span>{percentInput('house', String(result.house), 'House share of the split, percent (calculated)')}<span>%</span></span>
        </div>
      </div>
    </section>
    {tiers.map((tier) => {
      const annual = result.pool * tier.retention / 100;
      const chartId = `${id}-${tier.name}`;
      return <section key={tier.name} className={`${styles.card} ${tier.name === 'elevated' ? styles.feature : styles.standard}`}>
        <h4 className={styles.cardTitle}>YBS {tier.label}</h4>
        <div aria-live="polite">
          <div className={styles.outputHead}><div className={styles.split}>{tier.retention}% to you</div><div className={styles.primary}>{money.format(annual)}</div></div>
          <div className={styles.metric}><div className={styles.amount}>{money.format(annual - result.current)}</div><div className={styles.metricLabel}>Increase in annual income</div></div>
          <div className={styles.metric}><div className={styles.amount}>{percentageChange(result.current, annual)}</div><div className={styles.metricLabel}>Percentage increase</div></div>
        </div>
        <div className={styles.scaleWrap}>
          <div className={styles.tabs} role="tablist" aria-label={`YBS ${tier.label} chart view`}>
            {views.map(([key, label], index) => <button key={key} id={`${chartId}-${key}-tab`} type="button" className={styles.tab} role="tab" aria-selected={view === key} aria-controls={`${chartId}-${key}`} tabIndex={view === key ? 0 : -1} onClick={() => selectView(key)} onKeyDown={(event) => {
              if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
                event.preventDefault();
                const next = event.key === 'Home' ? 'compare' : event.key === 'End' ? 'years' : views[1 - index][0];
                selectView(next);
                document.getElementById(`${chartId}-${next}-tab`)?.focus();
              }
            }}>{label}</button>)}
          </div>
          {views.map(([key]) => <div key={key} id={`${chartId}-${key}`} role="tabpanel" aria-labelledby={`${chartId}-${key}-tab`} hidden={view !== key}>
            <svg className={styles.chartSvg} viewBox="0 0 320 200" role="img" aria-label={key === 'compare' ? `YBS ${tier.label}: current income ${money.format(result.current)}, income with YBS ${money.format(annual)}` : `YBS ${tier.label}: over five years, ${money.format(Math.abs((annual - result.current) * 5))} ${annual >= result.current ? 'more' : 'less'} than your current income`}>
              {key === 'compare' ? <CompareChart current={result.current} income={annual} growth={growth} /> : <YearsChart current={result.current} income={annual} growth={growth} />}
            </svg>
          </div>)}
        </div>
      </section>;
    })}
  </div>;
}
