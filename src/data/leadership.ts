import type { Founder } from './site';

/**
 * Source: Kent Chamberlain biography dated 2006, supplied by the client.
 *
 * That biography is historical. Every position below is stated in the past
 * tense or as "involvement", and no dates are given beyond the one the source
 * itself supplies (2001). Do not turn any entry into a "current" role without
 * written confirmation from Kent. Items awaiting confirmation are listed in
 * `leadershipOpenQuestions` at the foot of this file.
 */
export const founders: Founder[] = [
  {
    name: 'Kent Chamberlain',
    role: 'Founder',
    image: '/kent.png',
    placeholder: false,
    bio: 'Kent Chamberlain is the founder of Yacht Broker Services. His career in the large-yacht industry spans sales, charter and management, and includes owning and leading brokerage firms and creating an international yacht show.',
    // REPLACE: Add LinkedIn URL when supplied and approved.
  },
];

/**
 * Taken verbatim from the client brand film. This is a company statement,
 * not a personal quotation.
 */
export const foundingPrinciple =
  'At Yacht Broker Services you\u2019re our client. We work for you.';

/** Editorial biography, in reading order. */
export const biography = {
  heading: 'A Career in Large-Yacht Brokerage',
  paragraphs: [
    'Kent\u2019s work has centered on the large-yacht market. He has worked with yacht owners, buyers and other brokerage firms to market, sell, charter and manage yachts.',
    'His earlier positions include owner of San Diego Yacht Sales and of Chamberlain Yachts, General Manager of Bradford Yacht Sales, Vice President of Westship World Yachts and CEO of Merle Wood & Associates. YBS draws on that background to support independent brokers with the marketing, operations and transaction work behind each sale.',
    'He has also built businesses of his own. In 2001 he created the International Yacht & Jet Show in Nassau, Bahamas, which he later sold, and he has been involved with PartnerShips and Certified Yachts, two companies that serve different parts of the yacht market.',
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
    detail: 'Created in 2001 in Nassau, Bahamas, and later sold',
  },
  {
    organization: 'PartnerShips',
    detail: 'Involved with this fractional yacht sales and management company',
  },
  {
    organization: 'Certified Yachts',
    detail: 'Involved with this yacht acquisition and sales organization',
  },
];

export const industryInvolvement = {
  heading: 'Industry Involvement',
  organization: 'Superyacht Network',
  summary:
    'The Superyacht Network is a group of large-yacht brokers who meet to discuss industry trends and opportunities. Kent\u2019s 2006 biography identifies him as its Chairman.',
} as const;

export const education = {
  heading: 'Education',
  institution: 'University of Denver',
  summary: 'Studied Business Management and Sports Science.',
} as const;

/** Used for Person structured data. Each item is supported by the biography. */
export const founderExpertise = [
  'Large-yacht sales',
  'Yacht charter',
  'Yacht management',
] as const;

/**
 * Facts to confirm with Kent before launch. Kept here so they are not lost;
 * this export is not rendered anywhere.
 */
export const leadershipOpenQuestions = [
  'Is Kent still Chairman of the Superyacht Network? The page attributes the title to his 2006 biography. Once confirmed, it can be restated as current or as a past role.',
  'Is the University of Denver listing accurate as written (studied, no degree stated)? Person schema uses alumniOf.',
  'Dates and order of the previous positions, and whether any are still held.',
  'Status of PartnerShips and Certified Yachts, and what his involvement was.',
  'Whether to add a brief personal maritime detail (sailing a classic 41-foot Rhodes from Newport, Rhode Island). Omitted for now, as it does not add to the professional profile.',
] as const;
