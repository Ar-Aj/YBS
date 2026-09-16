import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
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
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
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
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
