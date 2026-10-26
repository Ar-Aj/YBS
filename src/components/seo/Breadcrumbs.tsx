import { JsonLd } from './JsonLd';
import { breadcrumbJsonLd } from '@/data/structured-data';

type BreadcrumbItem = {
  label: string;
  href: string;
};

type Props = {
  items: BreadcrumbItem[];
  /** `light` suits the ivory page body (default); `dark` suits a charcoal band. */
  tone?: 'light' | 'dark';
};

/**
 * Breadcrumb UI is intentionally hidden site-wide. Only the BreadcrumbList
 * JSON-LD is emitted so search engines keep the page hierarchy.
 */
export function Breadcrumbs({ items }: Props) {
  const jsonLdItems = items.map((item) => ({
    name: item.label,
    path: item.href,
  }));

  return <JsonLd data={breadcrumbJsonLd(jsonLdItems)} />;
}
