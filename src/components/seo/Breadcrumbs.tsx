import Link from 'next/link';
import { JsonLd } from './JsonLd';
import { breadcrumbJsonLd } from '@/data/structured-data';
import styles from './Breadcrumbs.module.css';

type BreadcrumbItem = {
  label: string;
  href: string;
};

type Props = {
  items: BreadcrumbItem[];
};

/**
 * Renders visible breadcrumbs + BreadcrumbList JSON-LD.
 * Usage: <Breadcrumbs items={[{ label: 'About', href: '/about' }]} />
 */
export function Breadcrumbs({ items }: Props) {
  const jsonLdItems = items.map((item) => ({
    name: item.label,
    path: item.href,
  }));

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(jsonLdItems)} />
      <nav aria-label="Breadcrumb" className={styles.nav}>
        <ol className={styles.list}>
          <li className={styles.item}>
            <Link href="/" className={styles.link}>Home</Link>
          </li>
          {items.map((item, i) => (
            <li key={item.href} className={styles.item}>
              <span className={styles.separator} aria-hidden="true">/</span>
              {i === items.length - 1 ? (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
