import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { BrandLoader } from '@/components/ui/BrandLoader';
import { JsClassBootstrap } from '@/components/ui/JsClassBootstrap';
import { JsonLd } from '@/components/seo/JsonLd';
import { AnalyticsProvider } from '@/components/seo/AnalyticsProvider';
import { siteJsonLd } from '@/data/structured-data';
import { siteConfig } from '@/data/site';
import './globals.css';
import '@/components/motion/motion.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://yachtbrokerservices.com'),
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
    icon: '/favicon.svg',
  },
  // No root-level canonical: every route declares its own through
  // buildMetadata(), so a page that forgets cannot inherit "/".
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Preload the intro clip so it can own the first paint. */}
        <link rel="preload" href="/logo/ybs-logo-intro.mp4" as="video" type="video/mp4" />
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
        <JsonLd data={siteJsonLd} />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <BrandLoader />
        <ScrollToTop />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
