// ============================================================
// YBS — Site-Wide Data & Types
// ============================================================

export const siteConfig = {
  name: 'Yacht Broker Services',
  shortName: 'YBS',
  tagline: 'Be the Architect of Your Future',
  // REPLACE: confirm canonical domain. The client video script lists www.yachtbroker.services.
  url: 'https://yachtbrokerservices.com',
  email: 'info@yachtbrokerservices.com', // REPLACE: real email
  description:
    'Yacht Broker Services is an independent broker membership platform: marketing, CRM and MLS access, back-office and transaction support, with up to 90% of gross commissions retained.',
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
  name: 'express' | 'preferred';
  label: string;
  /** Percentage of gross commissions the member retains. */
  retention: number;
  /** Retention / YBS share, e.g. "75/25". */
  split: string;
  price: string;
  period: string;
  description: string;
  highlights: string[];
  /** Factual visual emphasis only (e.g. highest retention). Not a popularity claim. */
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
