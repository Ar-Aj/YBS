import { BrokerTeaserPreload } from '@/components/content/BrokerTeaserPreload';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { JsClassBootstrap } from '@/components/ui/JsClassBootstrap';
import { JsonLd } from '@/components/seo/JsonLd';
import { AnalyticsProvider } from '@/components/seo/AnalyticsProvider';
import { siteJsonLd } from '@/data/structured-data';
import { siteConfig } from '@/data/site';
import './globals.css';
import './fonts.css';
import '@/components/motion/motion.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Yacht Broker Services | Independent Yacht Broker Membership',
    template: '%s | Yacht Broker Services',
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: 'en_US',
    url: '/',
    title: 'Yacht Broker Services | Independent Yacht Broker Membership',
    description: siteConfig.description,
    images: [{ url: '/og-image.jpg', width: 1264, height: 848, alt: siteConfig.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yacht Broker Services | Independent Yacht Broker Membership',
    description: siteConfig.description,
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48 64x64 192x192', type: 'image/x-icon' },
      { url: '/icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  // No root-level canonical: every route declares its own through
  // buildMetadata(), so a page that forgets cannot inherit "/".
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" href="/fonts/inter-normal-15.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/playfair-display-normal-08.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* Marks that JS is available so the reveal-on-scroll hidden states
            apply. Runs synchronously before the first paint; without JS the
            class is never set and the content stays visible. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body>
        <JsClassBootstrap />
        <BrokerTeaserPreload />
        <JsonLd data={siteJsonLd} />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ScrollToTop />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
