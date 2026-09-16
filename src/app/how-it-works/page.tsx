import type { Metadata } from 'next';
import { Section, Container } from '@/components/layout/Section';
import { SectionHeader, GoldRule } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { StepCard } from '@/components/content/StepCard';
import { TierCard } from '@/components/content/TierCard';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { steps, deliverables } from '@/data/howItWorks';
import { tiers, pricingExplanation } from '@/data/difference';
import styles from './page.module.css';
import shared from '../shared.module.css';

export const metadata: Metadata = {
  title: 'How It Works — Three Steps to Your Own Yacht Brokerage',
  description:
    'Join YBS in three steps: schedule a call, choose your membership tier, and launch your independent yacht brokerage with full support.',
  openGraph: {
    title: 'How It Works — Three Steps to Your Own Yacht Brokerage',
    description: 'Join YBS in three steps: schedule a call, choose your membership tier, and launch your independent yacht brokerage with full support.',
  },
  alternates: { canonical: '/how-it-works' },
};

export default function HowItWorksPage() {
  return (
    <>
      <CinematicHero
        label="How It Works"
        title="Three Steps to Independence"
        subtitle="Getting started is simple, confidential, and on your timeline."
        posterSrc="/hero_how_it_works.jpg"
        videoSrc="/videos/hero-how-it-works.mp4"
        objectPositionDesktop="center center"
        objectPositionMobile="center 60%"
      />

      {/* AEO: How does YBS work? */}
      <Section variant="white">
        <Container>
          <RevealOnScroll>
            <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
              How Does YBS Work?
            </h2>
            <GoldRule center />
            <p style={{ textAlign: 'center', maxWidth: '72ch', margin: '0 auto', lineHeight: 1.85 }}>
              YBS works in three steps: schedule a confidential conversation with
              our team, choose the membership tier that fits your practice, and
              launch your independent brokerage with full marketing, CRM, legal,
              and closing support from day one.
            </p>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* Steps */}
      <Section variant="ivory">
        <Container>
          <RevealOnScroll stagger>
            <div className={shared.grid3}>
              {steps.map((s) => (
                <StepCard key={s.number} step={s} />
              ))}
            </div>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* Deliverables */}
      <Section variant="navy">
        <Container>
          <RevealOnScroll>
            <SectionHeader
              label="What You Get"
              title="Everything Included in Your Membership"
              subtitle="No à la carte. No hidden fees. Every service below is included."
              light
            />
          </RevealOnScroll>
          <RevealOnScroll>
            <ol className={styles.deliverables}>
              {deliverables.map((item, i) => (
                <li key={i} className={styles.deliverableItem}>
                  <span className={styles.deliverableNum}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.deliverableText}>{item}</span>
                </li>
              ))}
            </ol>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* Pricing */}
      <Section variant="ivory">
        <Container>
          <RevealOnScroll>
            <SectionHeader
              label="What You Pay"
              title="Two Tiers. Maximum Transparency."
            />
          </RevealOnScroll>
          <RevealOnScroll stagger>
            <div className={shared.grid2}>
              {tiers.map((t) => (
                <TierCard key={t.name} tier={t} />
              ))}
            </div>
          </RevealOnScroll>
          <div className={shared.pricingNote}>
            <p>{pricingExplanation}</p>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section variant="dark">
        <Container narrow>
          <RevealOnScroll>
            <div className={shared.ctaBlock}>
              <h2>Start Your Journey Today</h2>
              <GoldRule center />
              <p>
                Every conversation is confidential. Let&apos;s discuss how YBS fits
                your practice.
              </p>
              <div className={shared.ctaActions}>
                <Button href="/contact" size="lg">
                  Schedule a Confidential Call
                </Button>
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>
    </>
  );
}
