export function numberValue(value: string): number {
  const parsed = Number(value.replace(/[$,%\s,]/g, ''));
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

export function calculateIncome(basis: 'sales' | 'income', sales: number, income: number, rate: number, split: number) {
  const share = Math.min(100, Math.max(0, split)) / 100;
  const rateFraction = Math.min(100, Math.max(0, rate)) / 100;
  const pool = basis === 'income' ? (share > 0 ? income / share : 0) : sales * rateFraction;
  return {
    pool,
    current: basis === 'income' ? income : pool * share,
    estimatedSales: rateFraction > 0 && share > 0 ? income / (rateFraction * share) : 0,
    estimatedIncome: sales * rateFraction * share,
    house: Math.round((100 - share * 100) * 100) / 100,
  };
}

export const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
export const whole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
export function percentageChange(current: number, value: number) {
  return current > 0 ? `${value >= current ? '+' : '-'}${Math.abs(Math.round((value - current) / current * 100))}%` : 'N/A';
}
