import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';

/**
 * Next.js replaces (does not deep-merge) a nested `openGraph` or `twitter`
 * object declared by a page, so a page that sets only `openGraph.title` would
 * lose the root image and site name. Every page builds its metadata here so
 * the shared parts are always present and title/description cannot drift
 * between the document, Open Graph and Twitter.
 */
const OG_IMAGE = {
  url: '/og-image.jpg',
  width: 1264,
  height: 848,
  alt: 'Yacht Broker Services',
};

type Input = {
  /** Page title. The root template appends the site name unless `absolute` is set. */
  title: string;
  description: string;
  /** Path beginning with "/", used for the canonical URL and og:url. */
  path: string;
  /** Use the title exactly as written (no site-name suffix). For the homepage. */
  absolute?: boolean;
  /** Keep the page out of search results (thin or placeholder pages). */
  noindex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  absolute = false,
  noindex = false,
}: Input): Metadata {
  const socialTitle = absolute ? title : `${title} | ${siteConfig.name}`;
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      locale: 'en_US',
      url: path,
      title: socialTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
