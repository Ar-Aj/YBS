import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/site';

// `/_next/` is intentionally not disallowed: search engines need the CSS and
// JavaScript there to render the pages.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
