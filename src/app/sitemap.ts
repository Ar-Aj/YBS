import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/site';

// No `lastModified`: it would be a build timestamp, not a real content date,
// and `priority` / `changeFrequency` are ignored by Google.
// `/insights` is omitted while it is noindexed (placeholder articles only);
// add it back here when its `noindex` flag is removed.
const paths = [
  '',
  '/about',
  '/the-ybs-difference',
  '/how-it-works',
  '/faq',
  '/contact',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({ url: `${siteConfig.url}${path}` }));
}
