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
      'High-end digital and media assets, listing presentations, and targeted luxury campaigns designed to reach large-yacht buyers, all presented under your own company identity.',
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
    description:
      'Setup guidance and administrative support so that you can run your own brokerage business while YBS handles the operational mechanics.',
    features: [
      'Formation of your operating entity',
      'Guidance through the setup process',
      'Assistant support',
      'Marketing and promotional support',
      'Email templates for prospecting and follow-ups',
    ],
  },
  {
    title: 'CRM & MLS',
    icon: 'monitor',
    description:
      'Broker management tools, lead tracking and inventory databases without the technical overhead. You own all of your client data; YBS sees only what you share and uses it only to support your activities.',
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
    description:
      'Contract administration, escrow management and transaction coordination from offer to closing, with legal guidance available along the way.',
    features: [
      'Contract production and contract templates',
      'KYC support',
      'Survey and sea-trial support, and haul-out scheduling',
      'Access to legal advice, basic legal services and documentation',
      'Closing-document coordination and closing support',
    ],
  },
];
