'use client';

/**
 * Analytics placeholder — privacy-friendly, consent-aware.
 *
 * REPLACE: Uncomment and configure one of the following:
 *
 * Option A: Google Analytics 4 (requires cookie consent banner)
 *   - Set GA_MEASUREMENT_ID below
 *   - Add a consent banner component
 *
 * Option B: Plausible Analytics (privacy-friendly, no consent needed)
 *   - Add: <script defer data-domain="yachtbrokerservices.com" src="https://plausible.io/js/script.js" />
 *
 * Option C: Fathom Analytics (privacy-friendly, no consent needed)
 *   - Add: <script src="https://cdn.usefathom.com/script.js" data-site="YOUR_SITE_ID" defer />
 *
 * This component loads nothing by default. It exists as a clearly marked
 * integration point so analytics can be added without touching layout.tsx.
 */
export function AnalyticsProvider() {
  // REPLACE: Uncomment when analytics is configured
  // const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

  return null;

  /* REPLACE: Uncomment for GA4
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure',
            });
          `,
        }}
      />
    </>
  );
  */
}
