import type { ComparisonRow, Tier } from './site';

export const comparisonRows: ComparisonRow[] = [
  {
    feature: 'Commission Split',
    traditional: '50/50 to 70/30 split',
    ybs: '90/10 or 75/25 split',
  },
  {
    feature: 'Autonomy & Brand',
    traditional: 'Strict corporate guidelines',
    ybs: 'Full autonomy to market your brand',
  },
  {
    feature: 'Operational Support',
    traditional: 'Company dictates what you get and how your listings are promoted',
    ybs: 'Tailored support & personalized marketing',
  },
  {
    feature: 'Monthly Overhead',
    traditional:
      'You effectively pay a monthly operating expense which is hidden under the high commission split',
    ybs: 'Predictable membership dues provide maximum commissions',
  },
];

export const tiers: Tier[] = [
  {
    name: 'premium',
    label: 'Premium Tier',
    split: '90/10',
    price: '$3,000',
    period: 'Annual commitment, billed monthly',
    description:
      'Keep 90% of every commission. Designed for high-volume brokers who want maximum earnings with full operational support.',
    featured: true,
  },
  {
    name: 'standard',
    label: 'Standard Tier',
    split: '75/25',
    price: '$1,500',
    period: 'Annual commitment, billed monthly',
    description:
      'Retain 75% of your commissions with lower monthly dues. Ideal for brokers building their practice with comprehensive support.',
    featured: false,
  },
];

export const pricingExplanation =
  'There are two membership tiers. You choose your tier annually, and dues are paid monthly. If you want to keep 90% of your commissions, you pay $3,000 a month, or pay $1,500 a month, and retain 75% of your commissions.';
