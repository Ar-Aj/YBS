import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BrandLoader } from '@/components/ui/BrandLoader';
import { JsClassBootstrap } from '@/components/ui/JsClassBootstrap';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { AnalyticsProvider } from '@/components/seo/AnalyticsProvider';
import {
  organizationJsonLd,
  webSiteJsonLd,
  professionalServiceJsonLd,
} from '@/data/structured-data';
import './globals.css';

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
    default: 'Yacht Broker Services — Keep Up to 90% of Your Commissions',
    template: '%s | Yacht Broker Services',
  },
  description:
    'Independent yacht broker support with up to 90% commission retention, bespoke marketing, CRM integration, legal support, and white-glove back-office services.',
  openGraph: {
    type: 'website',
    siteName: 'Yacht Broker Services',
    title: 'Yacht Broker Services — Keep Up to 90% of Your Commissions',
    description:
      'Independent yacht broker support with up to 90% commission retention, bespoke marketing, CRM integration, legal support, and white-glove back-office services.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yacht Broker Services — Keep Up to 90% of Your Commissions',
    description:
      'Independent yacht broker support with up to 90% commission retention, bespoke marketing, and white-glove back-office services.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.svg',
  },
  alternates: {
    canonical: '/',
  },
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
        <JsonLdGroup
          items={[
            organizationJsonLd,
            webSiteJsonLd,
            professionalServiceJsonLd,
          ]}
        />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <BrandLoader />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
