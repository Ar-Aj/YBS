import type { ComparisonRow, Tier } from './site';

/**
 * Comparison with traditional brokerage houses.
 * CONTENT RULE: this data is rendered ONLY on /the-ybs-difference.
 * Source: client "Website Layout" document, section 4.
 */
export const comparisonRows: ComparisonRow[] = [
  {
    feature: 'Commission Split',
    traditional: '50/50 to 70/30 split',
    ybs: '90/10 or 75/25 split',
  },
  {
    feature: 'Autonomy & Brand',
    traditional: 'Dictated by corporate guidelines',
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
      'You effectively pay a high monthly operating expense which is hidden under the commission split',
    ybs: 'Predictable membership dues provide maximum commissions',
  },
];

/**
 * Membership options.
 * Source: Detailed YBS Explainer Video Script, Part I.
 */
export const tiers: Tier[] = [
  {
    name: 'express',
    label: 'Express',
    retention: 75,
    split: '75/25',
    price: '$1,500',
    period: 'per month, paid by ACH',
    description:
      'Retain 75% of your gross commissions with a lower monthly fee. The same platform and services as Preferred.',
    highlights: [
      'MLS and CRM access',
      'All services listed in the Membership Agreement',
    ],
    featured: false,
  },
  {
    name: 'preferred',
    label: 'Preferred',
    retention: 90,
    split: '90/10',
    price: '$3,000',
    period: 'per month, paid by ACH',
    description:
      'Retain 90% of your gross commissions. The higher monthly fee suits brokers whose volume makes maximum retention the priority.',
    highlights: [
      'MLS and CRM access',
      'All services listed in the Membership Agreement',
    ],
    featured: true,
  },
];

export const pricingExplanation =
  'There are two membership options. You choose your tier annually, and dues are paid monthly. To keep 90% of your gross commissions you pay $3,000 a month (Preferred), or you pay $1,500 a month and retain 75% (Express).';

/**
 * Contractual qualifications that apply to both options.
 * Source: Detailed YBS Explainer Video Script, Part II. Subject to the
 * Independent Broker Membership Agreement, which governs in every case.
 */
export const membershipTerms: { title: string; text: string }[] = [
  {
    title: 'Initial term',
    text: 'Twenty-four months. After that the agreement renews for successive twelve-month periods, and either party may decline to renew with sixty days\u2019 notice before the anniversary date.',
  },
  {
    title: 'Changing tier',
    text: 'You can change tier annually on renewal. The tier in effect on the date you sign a client agreement governs that transaction through closing.',
  },
  {
    title: 'How fees are paid',
    text: 'Monthly dues are deducted by ACH. Deal fees are collected through escrow at closing.',
  },
  {
    title: 'Platform activity',
    text: 'During the term, your yacht brokerage and charter activity runs through the YBS platform, and transactions are recorded in the membership portal.',
  },
  {
    title: 'Licensing',
    text: 'In some States you may be required to hold a yacht broker\u2019s license or be licensed under an Employing Broker who is a member. YBS can introduce an Employing Broker if needed. Outside the US, you need a license wherever the jurisdiction requires one.',
  },
  {
    title: 'Other expenses',
    text: 'You or your clients cover non-digital marketing such as magazine advertising, banners, printed materials and boat show costs, plus any premium marketing promotions you choose.',
  },
  {
    title: 'Leaving YBS',
    text: 'After the initial 24-month term, you keep your company identity, logo, intellectual property and marketing materials, subject only to the restrictions in the agreement.',
  },
];

export const membershipDisclaimer =
  'This page summarizes the program. The Independent Broker Membership Agreement governs; contact YBS for the full terms.';
