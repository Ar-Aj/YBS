import { Section, Container } from '@/components/layout/Section';
import { SectionHeader, GoldRule } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger } from '@/components/motion/Stagger';
import { StepCard } from '@/components/content/StepCard';
import { TierCard } from '@/components/content/TierCard';
import { TermsList } from '@/components/content/TermsList';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { buildMetadata } from '@/lib/metadata';
import { steps, deliverables } from '@/data/howItWorks';
import {
  tiers,
  pricingExplanation,
  membershipTerms,
  membershipDisclaimer,
} from '@/data/difference';
import styles from './page.module.css';
import shared from '../shared.module.css';

export const metadata = buildMetadata({
  title: 'Membership, Tiers and Key Terms',
  description:
    'Three steps to join YBS, everything included in membership, the Express ($1,500/mo) and Preferred ($3,000/mo) options, and the key terms of the membership agreement.',
  path: '/how-it-works',
});

export default function HowItWorksPage() {
  return (
    <>
      <CinematicHero
        label="How It Works"
        title="Three Steps to Independence"
        subtitle="Getting started is simple, confidential, and on your timeline."
        posterSrc="/hero_how_it_works.jpg"
        videoSrc="/videos/hero-how-it-works.mp4"
      />

      <Breadcrumbs items={[{ label: 'How It Works', href: '/how-it-works' }]} />

      <Section variant="white">
        <Container>
          <Reveal>
            <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
              How Does YBS Membership Work?
            </h2>
            <GoldRule center />
            <p style={{ textAlign: 'center', maxWidth: '72ch', margin: '0 auto', lineHeight: 1.85 }}>
              You hold a confidential call with YBS, choose the Express or Preferred
              membership option, and launch your own brokerage with the YBS
              platform behind you. The Independent Broker Membership Agreement
              governs the arrangement.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section variant="ivory">
        <Container>
          <Stagger className={styles.process}>
            {steps.map((s) => (
              <StepCard key={s.number} step={s} rail />
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section variant="champagne">
        <Container>
          <SectionHeader
            label="What You Get"
            title="Everything Included in Your Membership"
            subtitle="Each service below is part of the membership. Your agreement lists the full scope."
            light
          />
          <Stagger as="ol" className={styles.deliverables}>
            {deliverables.map((item, i) => (
              <li key={item} className={styles.deliverableItem}>
                <span className={styles.deliverableNum}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={styles.deliverableText}>{item}</span>
              </li>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section variant="ivory">
        <Container>
          <SectionHeader
            label="What You Pay"
            title="Express or Preferred"
            subtitle="You choose your tier annually, and dues are paid monthly."
          />
          <Stagger className={shared.grid2}>
            {tiers.map((t) => (
              <TierCard key={t.name} tier={t} />
            ))}
          </Stagger>
          <Reveal>
            <div className={shared.pricingNote}>
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

      <Section variant="white" id="terms">
        <Container>
          <SectionHeader
            label="Key Terms"
            title="What to Know Before You Join"
            subtitle="A summary of the terms that apply to both options."
          />
          <TermsList terms={membershipTerms} />
          <Reveal>
            <p className={shared.disclaimer}>{membershipDisclaimer}</p>
          </Reveal>
        </Container>
      </Section>

      <Section variant="charcoal">
        <Container narrow>
          <Reveal variant="rise" duration="signature">
            <div className={shared.ctaBlock}>
              <h2>Start with a Confidential Call</h2>
              <GoldRule center />
              <p>
                Talk through your practice, your licensing position and which
                option fits. Every conversation is confidential.
              </p>
              <div className={shared.ctaActions}>
                <Button href="/contact" size="lg">
                  Schedule a Confidential Call
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
