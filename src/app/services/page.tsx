import type { Metadata } from 'next';
import { Section, Container } from '@/components/layout/Section';
import { SectionHeader, GoldRule } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ServiceCard } from '@/components/content/ServiceCard';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { servicePillars } from '@/data/services';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Services — Marketing, CRM, Legal & Closing Support',
  description:
    'Explore YBS services: luxury marketing, CRM integration, MLS access, legal support, and transaction coordination for independent yacht brokers.',
  openGraph: {
    title: 'Services — Marketing, CRM, Legal & Closing Support for Yacht Brokers',
    description: 'Explore YBS services: luxury marketing, CRM integration, MLS access, legal support, and transaction coordination for independent yacht brokers.',
  },
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <>
      <CinematicHero
        label="Services"
        title="Your Complete Brokerage Ecosystem"
        subtitle="White-glove operational support across four pillars — from brand creation to closing coordination."
        posterSrc="/hero_services.jpg"
      />

      {/* AEO: What services does YBS provide? */}
      <Section variant="white">
        <Container>
          <RevealOnScroll>
            <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
              What Services Does YBS Provide?
            </h2>
            <GoldRule center />
            <p style={{ textAlign: 'center', maxWidth: '72ch', margin: '0 auto', lineHeight: 1.85 }}>
              YBS provides independent yacht brokers with a complete operational
              ecosystem: luxury brand and marketing services, CRM and MLS
              integration, business entity formation, legal and accounting support,
              and end-to-end transaction and closing coordination — all included
              in a single monthly membership.
            </p>
          </RevealOnScroll>
        </Container>
      </Section>
      <Section variant="ivory">
        <Container>
          <RevealOnScroll>
            <SectionHeader
              label="Support Pillars"
              title="Everything You Need to Operate at the Highest Level"
              subtitle="Each pillar is designed to replace the infrastructure of a traditional brokerage — without the overhead or the commission split."
            />
          </RevealOnScroll>
          <RevealOnScroll stagger>
            <div className={styles.grid2}>
              {servicePillars.map((p) => (
                <ServiceCard key={p.title} pillar={p} />
              ))}
            </div>
          </RevealOnScroll>
        </Container>
      </Section>

      <Section variant="navy">
        <Container>
          <RevealOnScroll>
            <div className={styles.ctaBlock}>
              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'var(--gold)', marginBottom: '1rem' }}>Built for Elite Brokers</span>
              <h2>The Support You Deserve.<br />The Freedom You&apos;ve Earned.</h2>
              <GoldRule center />
              <p>
                Every service is included in your membership. No à la carte pricing.
                No surprise invoices. One predictable monthly investment.
              </p>
              <div className={styles.ctaActions}>
                <Button href="/how-it-works" size="lg">See Pricing</Button>
                <Button href="/contact" variant="ghost" size="lg">Talk to Us</Button>
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>
    </>
  );
}
