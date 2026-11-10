import type { ServicePillar } from './site';

/**
 * Four service pillars. Terms follow the client website data and the
 * Explainer script; nothing here is added beyond those sources.
 */
export const servicePillars: ServicePillar[] = [
  {
    title: 'Brand & Marketing',
    icon: 'layers',
    description:
      'Your company identity across every client-facing asset, with campaigns designed to reach large-yacht buyers.',
    features: [
      'Stylized brand kit personalized for your company',
      'Website creation, maintenance, and content updates',
      'Social media support and a monthly newsletter in your branding',
      'Professional listing presentations',
      'One AI-generated video monthly featuring you or one of your listings',
      'Luxury brand co-marketing and event organization',
    ],
  },
  {
    title: 'Business Operations',
    icon: 'briefcase',
    description: 'Administrative support for the day-to-day running of your brokerage.',
    features: [
      'Formation of your operating entity',
      'Guidance through the setup process',
      'Assistant support',
      'Email templates for prospecting and follow-ups',
    ],
  },
  {
    title: 'CRM & MLS',
    icon: 'monitor',
    description:
      'You own all of your client data. YBS sees only what you share and uses it only to support your activities.',
    features: [
      'Private confidential CRM',
      'MLS services including market research and reports',
      'Comps research and reports',
      'Lead tracking and inventory databases',
    ],
  },
  {
    title: 'Transaction & Closing Support',
    icon: 'fileCheck',
    description: 'Escrow management and transaction coordination from offer to closing.',
    features: [
      'Contract production and contract templates',
      'KYC support',
      'Survey and sea-trial support, and haul-out scheduling',
      'Access to legal advice, basic legal services and documentation',
      'Closing-document coordination and closing support',
    ],
  },
];
