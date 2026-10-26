import { siteConfig } from './site';

const ORG_ID = `${siteConfig.url}/#organization`;
const SITE_ID = `${siteConfig.url}/#website`;
const SERVICE_ID = `${siteConfig.url}/#service`;

/**
 * Site-wide structured data as one linked @graph, injected in the root layout.
 * Only verified facts are included. Phone, street address and social profiles
 * are deliberately absent until the client confirms them (the video script
 * lists a Fort Lauderdale address and phone number, but also a different
 * domain from siteConfig.url).
 */
export const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: siteConfig.name,
      alternateName: siteConfig.shortName,
      url: siteConfig.url,
      logo: { '@type': 'ImageObject', url: `${siteConfig.url}/Logo.png` },
      email: siteConfig.email,
      description: siteConfig.description,
    },
    {
      '@type': 'WebSite',
      '@id': SITE_ID,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      publisher: { '@id': ORG_ID },
      inLanguage: 'en-US',
    },
    {
      '@type': 'ProfessionalService',
      '@id': SERVICE_ID,
      name: siteConfig.name,
      url: siteConfig.url,
      description:
        'Independent broker membership: brand and marketing, CRM and MLS access, business operations and transaction support for yacht brokers.',
      provider: { '@id': ORG_ID },
      serviceType: 'Yacht broker membership and business support',
      audience: { '@type': 'Audience', audienceType: 'Independent yacht brokers' },
    },
  ],
};

/**
 * BreadcrumbList generator.
 * Pass the current page path and label to generate a breadcrumb trail.
 */
export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.url,
      },
      ...items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: item.name,
        item: `${siteConfig.url}${item.path}`,
      })),
    ],
  };
}

/**
 * FAQPage schema generator. Answers must match the visible FAQ text exactly.
 */
export function faqPageJsonLd(
  faqs: { question: string; answer: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * WebPage schema generator, linked to the site-wide WebSite node by @id.
 */
export function webPageJsonLd(
  name: string,
  description: string,
  path: string,
  mainEntityId?: string
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteConfig.url}${path}#webpage`,
    name,
    description,
    url: `${siteConfig.url}${path}`,
    isPartOf: { '@id': SITE_ID },
    about: { '@id': ORG_ID },
    ...(mainEntityId ? { mainEntity: { '@id': mainEntityId } } : {}),
  };
}

/**
 * Person schema for the founder, linked to the Organization by @id.
 * Restricted to facts the client has supplied and that are not time-sensitive.
 * Deliberately omitted until confirmed: the Superyacht Network chairmanship
 * and the previous employers, whose current status is unknown.
 */
export function personJsonLd(person: {
  name: string;
  jobTitle: string;
  path: string;
  imagePath: string;
  description: string;
  alumniOf: string;
  knowsAbout: readonly string[];
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteConfig.url}${person.path}#person`,
    name: person.name,
    jobTitle: person.jobTitle,
    description: person.description,
    image: `${siteConfig.url}${person.imagePath}`,
    url: `${siteConfig.url}${person.path}`,
    worksFor: { '@id': ORG_ID },
    alumniOf: { '@type': 'CollegeOrUniversity', name: person.alumniOf },
    knowsAbout: [...person.knowsAbout],
  };
}
