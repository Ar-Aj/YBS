// ============================================================
// YBS — Site-Wide Data & Types
// ============================================================

export const siteConfig = {
  name: 'Yacht Broker Services',
  shortName: 'YBS',
  tagline: 'Own Your Brokerage. Keep Your Commissions.',
  url: 'https://yachtbrokerservices.com',
  email: 'info@yachtbrokerservices.com', // REPLACE: real email
  description:
    'Yacht Broker Services empowers elite yacht brokers with up to 90% commission splits, full brand autonomy, bespoke marketing, CRM integration, and white-glove back-office support.',
} as const;

// Shared types
export type NavLink = {
  label: string;
  href: string;
};

export type Founder = {
  name: string;
  role: string;
  bio: string;
  image: string;
  placeholder?: boolean;
  linkedIn?: string;
};

export type FAQ = {
  question: string;
  answer: string;
};

export type FAQCategory = {
  title: string;
  id: string;
  items: FAQ[];
};

export type ServicePillar = {
  title: string;
  description: string;
  icon: string;
  features: string[];
};

export type Tier = {
  name: string;
  label: string;
  split: string;
  price: string;
  period: string;
  description: string;
  featured: boolean;
};

export type ComparisonRow = {
  feature: string;
  traditional: string;
  ybs: string;
};

export type Step = {
  number: string;
  title: string;
  description: string;
};

export type InsightPost = {
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  dateISO: string;
  slug: string;
  placeholder?: boolean;
};

export type Resource = {
  title: string;
  description: string;
  icon: string;
  available: boolean;
};
