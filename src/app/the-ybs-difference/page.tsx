import { Section, Container } from '@/components/layout/Section';
import { SectionHeader, GoldRule } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger } from '@/components/motion/Stagger';
import { ComparisonTable } from '@/components/content/ComparisonTable';
import { TierCard } from '@/components/content/TierCard';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { buildMetadata } from '@/lib/metadata';
import {
  comparisonRows,
  tiers,
  pricingExplanation,
  membershipDisclaimer,
} from '@/data/difference';
import styles from '../shared.module.css';

export const metadata = buildMetadata({
  title: 'YBS vs. Traditional Brokerage',
  description:
    'A side-by-side look at commission split, autonomy, support and overhead for traditional yacht brokerage houses and YBS membership (75% or 90% retention).',
  path: '/the-ybs-difference',
});

export default function DifferencePage() {
  return (
    <>
      <CinematicHero
        label="The Difference"
        title="Why YBS Changes Everything"
        subtitle="A transparent comparison between the traditional brokerage model and the YBS platform."
        posterSrc="/hero_difference.jpg"
        videoSrc="/videos/hero-difference.mp4"
      />

      <Breadcrumbs items={[{ label: 'The YBS Difference', href: '/the-ybs-difference' }]} />

      {/* The only comparison on the site */}
      <Section variant="ivory">
        <Container>
          <SectionHeader
            label="Side by Side"
            title="Traditional Brokerage vs. Yacht Broker Services"
          />
          <Reveal variant="clip" duration="signature">
            <ComparisonTable rows={comparisonRows} />
          </Reveal>
          <Reveal>
            <p className={styles.disclaimer}>{membershipDisclaimer}</p>
          </Reveal>
        </Container>
      </Section>

      {/* AEO: brand */}
      <Section variant="white">
        <Container>
          <Reveal>
            <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
              Can Brokers Keep Their Own Brand with YBS?
            </h2>
            <GoldRule center />
            <p style={{ textAlign: 'center', maxWidth: '72ch', margin: '0 auto', lineHeight: 1.85 }}>
              Yes. YBS is built around the independent broker&apos;s own brand: you
              market your company under your name and YBS supplies the brand kit,
              website and marketing support behind it. Your client data stays with
              you, and after the initial term you keep your company identity, logo
              and marketing materials, subject to the agreement.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Impact */}
      <Section variant="white">
        <Container>
          <SectionHeader label="Your Advantage" title="What This Means for You" />
          <Stagger className={styles.grid4}>
            <div className={styles.impactCard}>
              <h3>Retention</h3>
              <GoldRule />
              <p>
                Retain 75% (Express) or 90% (Preferred) of your gross commissions,
                with dues paid monthly by ACH.
              </p>
            </div>
            <div className={styles.impactCard}>
              <h3>Your Brand</h3>
              <GoldRule />
              <p>
                Market under your own name and build your own reputation. YBS
                supports your identity and does not replace it.
              </p>
            </div>
            <div className={styles.impactCard}>
              <h3>Your Approach</h3>
              <GoldRule />
              <p>
                You decide how to present your listings and run your clients and
                sales. Support is tailored and marketing is personalized.
              </p>
            </div>
            <div className={styles.impactCard}>
              <h3>Predictable Dues</h3>
              <GoldRule />
              <p>
                One fixed monthly membership fee covers the platform and services.
                Non-digital marketing and boat show costs are separate.
              </p>
            </div>
          </Stagger>
        </Container>
      </Section>

      {/* Tiers */}
      <Section variant="ivory">
        <Container>
          <SectionHeader
            label="Membership"
            title="Express or Preferred"
            subtitle="Higher dues, higher retention. Same platform and services."
          />
          <Stagger className={styles.grid2}>
            {tiers.map((t) => (
              <TierCard key={t.name} tier={t} />
            ))}
          </Stagger>
          <Reveal>
            <div className={styles.pricingNote}>
              <p>{pricingExplanation}</p>
            </div>
          </Reveal>
          <Reveal>
            <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
              <Button href="/contact" size="lg">
                Request a Confidential Call
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section variant="charcoal">
        <Container narrow>
          <Reveal variant="rise" duration="signature">
            <div className={styles.ctaBlock}>
              <h2>Compare It Against Your Own Numbers</h2>
              <GoldRule center />
              <p>
                A confidential call is the quickest way to see which option fits
                your volume and your practice.
              </p>
              <div className={styles.ctaActions}>
                <Button href="/contact" size="lg">
                  Schedule a Confidential Call
                </Button>
                <Button href="/how-it-works" variant="ghost" size="lg">
                  See How It Works
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
