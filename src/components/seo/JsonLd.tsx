import { type ReactNode } from 'react';

/**
 * Renders a JSON-LD structured data script tag.
 * Safe for SSR — outputs a <script> with type="application/ld+json".
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Renders multiple JSON-LD blocks.
 */
export function JsonLdGroup({ items }: { items: Record<string, unknown>[] }) {
  return (
    <>
      {items.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
    </>
  );
}
