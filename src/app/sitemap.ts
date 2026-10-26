import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/site';

// No `lastModified`: it would be a build timestamp, not a real content date,
// and `priority` / `changeFrequency` are ignored by Google.
const paths = [
  '',
  '/about',
  '/services',
  '/the-ybs-difference',
  '/how-it-works',
  '/leadership',
  '/faq',
  '/insights',
  '/contact',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({ url: `${siteConfig.url}${path}` }));
}
