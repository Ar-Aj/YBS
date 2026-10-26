import type { InsightPost, Resource } from './site';

/**
 * Insight articles are placeholders: no articles have been written or
 * approved. They stay out of the sitemap and structured data until real
 * content exists. Titles avoid anti-traditional framing.
 */
export const insightPosts: InsightPost[] = [
  {
    title: 'What an Independent Broker Membership Includes',
    excerpt:
      'A plain-language walk through the services in a YBS membership, from entity formation and brand kit to MLS research and closing coordination.',
    tag: 'Membership',
    date: 'Coming Soon',
    dateISO: '',
    slug: 'what-membership-includes',
    placeholder: true,
  },
  {
    title: 'Choosing Between Express and Preferred',
    excerpt:
      'How to weigh a lower monthly fee against higher commission retention, and how the annual tier change and transaction-level lock work.',
    tag: 'Strategy',
    date: 'Coming Soon',
    dateISO: '',
    slug: 'choosing-express-or-preferred',
    placeholder: true,
  },
  {
    title: 'Building Your Own Brokerage Brand',
    excerpt:
      'What goes into a brand kit, a website and a monthly newsletter that carry your company name rather than someone else\u2019s.',
    tag: 'Brand Building',
    date: 'Coming Soon',
    dateISO: '',
    slug: 'building-your-brokerage-brand',
    placeholder: true,
  },
];

export const resources: Resource[] = [
  {
    title: 'Membership Overview',
    description:
      'A short summary of the Express and Preferred options and the services included in each.',
    icon: 'fileText',
    available: false,
  },
  {
    title: 'Launch Checklist',
    description:
      'What to prepare before launching your own brokerage: licensing, entity, brand and client data.',
    icon: 'calculator',
    available: false,
  },
  {
    title: 'Market Research Reports',
    description:
      'Comps research and market reports delivered through the MLS services included in membership.',
    icon: 'barChart',
    available: false,
  },
];
