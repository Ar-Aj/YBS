import { siteConfig } from './site';

/**
 * Organization schema — injected in root layout.
 * REPLACE: Add phone, address, and sameAs (social) when available.
 */
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/Logo.png`,
  email: siteConfig.email,
  description: siteConfig.description,
  // REPLACE: Add when client provides
  // telephone: '+1-xxx-xxx-xxxx',
  // address: { '@type': 'PostalAddress', ... },
  // sameAs: ['https://linkedin.com/company/...', 'https://instagram.com/...'],
};

/**
 * WebSite schema — injected in root layout.
 */
export const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  publisher: {
    '@type': 'Organization',
    name: siteConfig.name,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/Logo.png`,
    },
  },
};

/**
 * ProfessionalService schema — injected in root layout.
 * More accurate than LocalBusiness for a service firm without a verified walk-in address.
 */
export const professionalServiceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/Logo.png`,
  email: siteConfig.email,
  description: siteConfig.description,
  priceRange: '$$$',
  serviceType: 'Yacht Brokerage Support Services',
  areaServed: {
    '@type': 'Place',
    name: 'Worldwide',
  },
  // REPLACE: Add when client provides
  // telephone: '+1-xxx-xxx-xxxx',
  // address: { '@type': 'PostalAddress', ... },
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
 * FAQPage schema generator.
 * Transforms FAQ data into Google-structured FAQ rich result markup.
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
 * WebPage schema generator.
 */
export function webPageJsonLd(
  name: string,
  description: string,
  path: string
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url: `${siteConfig.url}${path}`,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}
