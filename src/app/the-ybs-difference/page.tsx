import type { Metadata } from 'next';
import { Section, Container } from '@/components/layout/Section';
import { SectionHeader, GoldRule } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ComparisonTable } from '@/components/content/ComparisonTable';
import { TierCard } from '@/components/content/TierCard';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { comparisonRows, tiers, pricingExplanation } from '@/data/difference';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Traditional Brokerage vs. YBS — Commission Comparison',
  description:
    'Compare commission splits, autonomy, and support between traditional yacht brokerages and YBS. See transparent tier pricing.',
  openGraph: {
    title: 'Traditional Brokerage vs. YBS — Commission Comparison',
    description: 'Compare commission splits, autonomy, and support between traditional yacht brokerages and YBS.',
  },
  alternates: { canonical: '/the-ybs-difference' },
};

export default function DifferencePage() {
  return (
    <>
      <CinematicHero
        label="The Difference"
        title="Why YBS Changes Everything"
        subtitle="A transparent comparison between the traditional brokerage model and the YBS platform."
        posterSrc="/hero_difference.jpg"
        videoSrc="/videos/hero-difference.mp4"
        objectPositionDesktop="center bottom"
        objectPositionMobile="center bottom"
      />

      {/* Comparison Table */}
      <Section variant="ivory">
        <Container>
          <RevealOnScroll>
            <SectionHeader
              label="Side by Side"
              title="Traditional Brokerage vs. Yacht Broker Services"
            />
          </RevealOnScroll>
          <RevealOnScroll variant="scale">
            <ComparisonTable rows={comparisonRows} />
          </RevealOnScroll>
          <p className={styles.disclaimer}>
            {/* REPLACE: Legal review required */}
            Commission structures and membership terms are subject to the YBS
            Membership Agreement. Contact us for complete details.
          </p>
        </Container>
      </Section>

      {/* AEO: Can brokers keep their own brand with YBS? */}
      <Section variant="white">
        <Container>
          <RevealOnScroll>
            <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
              Can Brokers Keep Their Own Brand with YBS?
            </h2>
            <GoldRule center />
            <p style={{ textAlign: 'center', maxWidth: '72ch', margin: '0 auto', lineHeight: 1.85 }}>
              Yes. YBS is designed to support your independent brand, not replace
              it. You maintain full autonomy over how you market yourself, your
              listings, and your professional identity. YBS provides the
              infrastructure; you own the brand.
            </p>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* Impact Cards */}
      <Section variant="white">
        <Container>
          <RevealOnScroll>
            <SectionHeader
              label="Your Advantage"
              title="What This Means for You"
            />
          </RevealOnScroll>
          <RevealOnScroll stagger>
            <div className={styles.grid4}>
              <div className={styles.impactCard}>
                <h3>More Earnings</h3>
                <GoldRule />
                <p>
                  Keep up to 90% of every commission. No hidden desk fees, no
                  surprise deductions — just transparent, predictable compensation.
                </p>
              </div>
              <div className={styles.impactCard}>
                <h3>Your Brand</h3>
                <GoldRule />
                <p>
                  Market under your own name, build your own reputation, and own
                  your client relationships. YBS supports your identity — it
                  doesn&apos;t replace it.
                </p>
              </div>
              <div className={styles.impactCard}>
                <h3>Your Way</h3>
                <GoldRule />
                <p>
                  No corporate mandates on how you market your listings. No rigid
                  processes. You choose the approach that works best for your
                  clients and your practice.
                </p>
              </div>
              <div className={styles.impactCard}>
                <h3>Predictable Costs</h3>
                <GoldRule />
                <p>
                  One monthly membership fee covers everything — marketing, CRM,
                  legal, closing support. No variable costs, no percentage-based
                  surcharges.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* AEO: How do commission tiers work? */}
      <Section variant="ivory">
        <Container>
          <RevealOnScroll>
            <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
              How Do YBS Commission Tiers Work?
            </h2>
            <GoldRule center />
            <p style={{ textAlign: 'center', maxWidth: '72ch', margin: '0 auto', lineHeight: 1.85 }}>
              YBS offers two membership tiers. The Premium Tier is $3,000 per
              month with a 90/10 commission split — you keep 90% of every
              commission earned. The Standard Tier is $1,500 per month with a
              75/25 split. Both tiers include the full suite of YBS services
              with no hidden fees.
            </p>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* Pricing Tiers */}
      <Section variant="ivory">
        <Container>
          <RevealOnScroll>
            <SectionHeader
              label="Membership Tiers"
              title="Choose the Right Fit"
              subtitle="Two tiers. Transparent pricing. Maximum commissions."
            />
          </RevealOnScroll>
          <RevealOnScroll stagger>
            <div className={styles.grid2}>
              {tiers.map((t) => (
                <TierCard key={t.name} tier={t} />
              ))}
            </div>
          </RevealOnScroll>
          <div className={styles.pricingNote}>
            <p>{pricingExplanation}</p>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section variant="dark">
        <Container narrow>
          <RevealOnScroll>
            <div className={styles.ctaBlock}>
              <h2>Ready to Make the Switch?</h2>
              <GoldRule center />
              <p>
                Schedule a confidential conversation to discuss your situation and
                explore whether YBS is the right fit.
              </p>
              <div className={styles.ctaActions}>
                <Button href="/contact" size="lg">
                  Schedule a Call
                </Button>
                <Button href="/how-it-works" variant="ghost" size="lg">
                  See How It Works
                </Button>
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>
    </>
  );
}
