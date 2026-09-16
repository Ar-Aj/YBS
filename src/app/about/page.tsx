import type { Metadata } from 'next';
import { Section, Container } from '@/components/layout/Section';
import { SectionHeader, GoldRule } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { VideoHero } from '@/components/content/VideoHero';
import { FounderPreview } from '@/components/content/FounderProfile';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { founders, foundingPrinciple } from '@/data/leadership';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About YBS — Independent Yacht Brokerage Support',
  description:
    'Learn how Yacht Broker Services empowers independent yacht brokers with operational infrastructure, marketing, and full brand autonomy.',
  openGraph: {
    title: 'About YBS — Independent Yacht Brokerage Support',
    description: 'Learn how Yacht Broker Services empowers independent yacht brokers with operational infrastructure, marketing, and full brand autonomy.',
  },
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <CinematicHero
        label="About YBS"
        title={<>The Firm Behind<br />Your Independence</>}
        subtitle="Yacht Broker Services was founded to give independent yacht brokers the infrastructure of a major brokerage — without surrendering their autonomy or their earnings."
        posterSrc="/hero_about.jpg"
      />

      {/* Video Hero */}
      <Section variant="ivory">
        <Container>
          <RevealOnScroll variant="scale">
            <VideoHero
              poster="/hero-about-poster.jpg"
              title="Where Independence Meets Infrastructure"
              ariaLabel="Cinematic yacht footage showcasing the luxury brokerage lifestyle"
            />
          </RevealOnScroll>
        </Container>
      </Section>

      {/* Philosophy */}
      <Section variant="white">
        <Container>
          <div className={styles.philosophy}>
            <RevealOnScroll variant="left">
              <blockquote className={styles.quote}>
                &ldquo;The best brokers don&apos;t need a corporate name above their door.
                They need the right support behind it.&rdquo;
              </blockquote>
            </RevealOnScroll>
            <RevealOnScroll variant="right">
              <div>
                <span className={styles.label}>Our Philosophy</span>
                <h2>Independence With Infrastructure</h2>
                <GoldRule />
                <p>
                  We believe that the most talented yacht brokers should own their brand,
                  control their client relationships, and retain the majority of their
                  commissions. YBS exists to make that possible — providing the operational
                  backbone that lets independent professionals compete at the highest level.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </Container>
      </Section>

      {/* Vision */}
      <Section variant="navy">
        <Container>
          <RevealOnScroll>
            <div className={styles.vision}>
              <span className={styles.label}>Our Vision</span>
              <h2>Redefining the Brokerage Model</h2>
              <GoldRule center />
              <p>
                The traditional brokerage model was built for a different era. Today&apos;s
                top brokers need flexibility, technology, and personalized support — not
                corporate overhead and restrictive splits. YBS represents the future: a
                platform where your success is measured by your performance, not your
                company&apos;s take.
              </p>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* AEO: What is Yacht Broker Services? */}
      <Section variant="ivory">
        <Container>
          <RevealOnScroll>
            <SectionHeader
              label="Our Origin"
              title="What Is Yacht Broker Services?"
            />
          </RevealOnScroll>
          <RevealOnScroll>
            <div className={styles.origin}>
              <p>
                Yacht Broker Services (YBS) is an independent brokerage support
                platform that provides elite yacht brokers with the operational
                infrastructure of a major firm — marketing, CRM, MLS access,
                legal support, and closing coordination — while allowing them to
                retain up to 90% of their commissions and full control of their
                professional brand.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <h3 style={{ marginTop: 'var(--space-xl)' }}>Why YBS Exists</h3>
            <GoldRule />
          </RevealOnScroll>
          <RevealOnScroll>
            <div className={styles.origin}>
              <p>
                YBS was born from a simple observation: the yacht brokerage industry&apos;s
                most talented professionals were leaving established firms — not because
                they lacked ambition, but because the traditional model no longer served
                their interests. They wanted ownership, flexibility, and fair compensation.
              </p>
              <p>
                We built YBS to answer that need. Not as another brokerage, but as a
                complete operational platform that gives independent brokers everything
                they need to run a world-class practice — from entity formation and legal
                support to marketing, CRM, and closing coordination.
              </p>
              <p>
                {/* REPLACE: Final founding narrative pending client review */}
                The result is a model where the broker is the principal, the brand-builder,
                and the primary beneficiary of their own work. YBS handles the rest.
              </p>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* Leadership Preview */}
      <Section variant="white">
        <Container>
          <RevealOnScroll>
            <SectionHeader
              label="Leadership"
              title="Built by an Industry Veteran"
            />
          </RevealOnScroll>
          <RevealOnScroll>
            <div className={styles.callout}>
              <p>&ldquo;{foundingPrinciple}&rdquo;</p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll stagger>
            <div className={styles.foundersGrid}>
              {founders.map((f) => (
                <FounderPreview key={f.name} founder={f} />
              ))}
            </div>
          </RevealOnScroll>
          <div className={styles.centerCta}>
            <Button href="/leadership" variant="secondary">
              Meet the Founder
            </Button>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section variant="dark">
        <Container narrow>
          <RevealOnScroll>
            <div className={styles.ctaBlock}>
              <span className={styles.label}>Next Step</span>
              <h2>Your Independence Starts Here</h2>
              <GoldRule center />
              <p>
                Schedule a confidential conversation to explore whether YBS is the
                right platform for your practice.
              </p>
              <div className={styles.ctaActions}>
                <Button href="/contact" size="lg">
                  Schedule a Call
                </Button>
                <Button href="/services" variant="ghost" size="lg">
                  Explore Services
                </Button>
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>
    </>
  );
}
