import type { Founder } from './site';

/**
 * Sources: Kent Chamberlain's 2006 biography for historical roles and the
 * client's approved revisions for the founder profile and network description.
 */
export const founders: Founder[] = [
  {
    name: 'Kent Chamberlain',
    role: 'Founder',
    image: '/kent-chamberlain.png',
    placeholder: false,
    bio: 'As the founder of Yacht Broker Services, Kent Chamberlain brings decades of leadership to the large-yacht sector. His distinguished career spans yacht sales, chartering, and management, alongside a proven track record of owning and leading prominent brokerage firms, shipyards, as well as creating international yacht shows.',
    // REPLACE: Add LinkedIn URL when supplied and approved.
  },
];

/** Editorial biography, in reading order. */
export const biography = {
  heading: 'A Career in Large-Yacht Brokerage',
  paragraphs: [
    'Kent\u2019s work has centered on the large-yacht market. He has worked with yacht owners, buyers and other brokerage firms to market, sell, charter and manage yachts.',
  ],
} as const;

export type ExperienceEntry = {
  organization: string;
  /** Short descriptor shown beneath the organization name. */
  detail: string;
};

/**
 * Positions listed in the 2006 biography, in the order the source gives them.
 * The source supplies no dates, so this is deliberately not a timeline.
 */
export const previousPositions: ExperienceEntry[] = [
  { organization: 'San Diego Yacht Sales', detail: 'Owner' },
  { organization: 'Bradford Yacht Sales', detail: 'General Manager' },
  { organization: 'Westship World Yachts', detail: 'Vice President' },
  { organization: 'Chamberlain Yachts', detail: 'Owner' },
  { organization: 'Merle Wood & Associates', detail: 'Chief Executive Officer' },
];

export const ventures: ExperienceEntry[] = [
  {
    organization: 'International Yacht & Jet Show',
    detail: 'Created in Nassau, Bahamas, and later sold',
  },
  {
    organization: 'PartnerShips',
    detail:
      'Started this fractional yacht sales and management company after selling the International Yacht & Jet Show',
  },
  {
    organization: 'Certified Yachts',
    detail: 'Started this yacht refurbishment, acquisition and sales business',
  },
];

export const industryInvolvement = {
  heading: 'Industry Involvement',
  organization: 'Superyacht Network',
  summary:
    'Kent is the Chairman of the Superyacht Network, a group of approximately 150 large-yacht brokers worldwide who regularly communicate and periodically meet to discuss industry trends and yacht sales opportunities around the world.',
} as const;

export const education = {
  heading: 'Education',
  institution: 'University of Denver',
  summary: 'Business Management and Sports Science.',
} as const;

/** Used for Person structured data. Each item is supported by the biography. */
export const founderExpertise = ['Large-yacht sales', 'Yacht charter', 'Yacht management'] as const;

/**
 * Facts to confirm with Kent before launch. Kept here so they are not lost;
 * this export is not rendered anywhere.
 */
export const leadershipOpenQuestions = [
  'Is the University of Denver listing accurate as written (studied, no degree stated)? Person schema uses alumniOf.',
  'Dates and order of the previous positions, and whether any are still held.',
  'Status of PartnerShips and Certified Yachts, and what his involvement was.',
  'Whether to add a brief personal maritime detail (sailing a classic 41-foot Rhodes from Newport, Rhode Island). Omitted for now, as it does not add to the professional profile.',
] as const;
