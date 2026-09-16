import type { Metadata } from 'next';
import { Section, Container } from '@/components/layout/Section';
import { SectionHeader, GoldRule } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { FounderProfile } from '@/components/content/FounderProfile';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { founders, foundingPrinciple } from '@/data/leadership';
import shared from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Leadership — Meet the Founder of YBS',
  description:
    'Meet the founder of Yacht Broker Services — an experienced industry professional building infrastructure for independent yacht brokers.',
  openGraph: {
    title: 'Leadership — Meet the Founder of Yacht Broker Services',
    description: 'Meet the founder of YBS — an experienced industry professional building infrastructure for independent yacht brokers.',
  },
  alternates: { canonical: '/leadership' },
};

export default function LeadershipPage() {
  return (
    <>
      <CinematicHero
        label="Leadership"
        title="The Person Behind YBS"
        subtitle="Founded by an industry veteran who understands what it takes to build a successful, independent yacht brokerage."
        posterSrc="/hero_leadership.jpg"
        videoSrc="/videos/hero-leadership.mp4"
        objectPositionDesktop="center center"
        objectPositionMobile="center center"
      />

      <Section variant="ivory">
        <Container>
          {founders.map((founder, i) => (
            <div key={founder.name} className={shared.founderBlock}>
              <RevealOnScroll variant={i % 2 === 0 ? 'left' : 'right'}>
                <FounderProfile
                  founder={founder}
                  reverse={i % 2 !== 0}
                />
              </RevealOnScroll>
            </div>
          ))}
        </Container>
      </Section>

      {/* Founding Principle */}
      <Section variant="navy">
        <Container narrow>
          <RevealOnScroll>
            <div style={{ textAlign: 'center' }}>
              <SectionHeader
                label="Our Principle"
                title="Why We Built This"
                light
              />
              <blockquote style={{
                fontStyle: 'italic',
                fontSize: 'var(--text-xl)',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.8,
                maxWidth: 700,
                margin: '0 auto',
              }}>
                &ldquo;{foundingPrinciple}&rdquo;
              </blockquote>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* CTA */}
      <Section variant="dark">
        <Container narrow>
          <RevealOnScroll>
            <div className={shared.ctaBlock}>
              <h2>Ready to Talk?</h2>
              <GoldRule center />
              <p>
                Schedule a confidential conversation with our team to explore how
                YBS can support your independent practice.
              </p>
              <div className={shared.ctaActions}>
                <Button href="/contact" size="lg">
                  Schedule a Call
                </Button>
                <Button href="/about" variant="ghost" size="lg">
                  Learn About YBS
                </Button>
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>
    </>
  );
}
