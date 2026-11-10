import { Section, Container } from '@/components/layout/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger } from '@/components/motion/Stagger';
import { FounderPreview } from '@/components/content/FounderProfile';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { buildMetadata } from '@/lib/metadata';
import { founders } from '@/data/leadership';
import styles from './page.module.css';

export const metadata = buildMetadata({
  title: 'About Independent Broker Membership',
  description:
    'Yacht Broker Services gives solopreneurs and small teams the resources and backing of a world-class firm, without the heavy cost of corporate overhead.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <CinematicHero
        label="About YBS"
        title={
          <>
            The Firm Behind
            <br />
            Your Independence
          </>
        }
        subtitle="Yacht Broker Services was founded to give independent yacht brokers the infrastructure of a major brokerage — without surrendering their autonomy or their earnings."
        posterSrc="/hero_about.jpg"
      />

      <Breadcrumbs items={[{ label: 'About', href: '/about' }]} />

      <Section variant="ivory">
        <Container>
          <div className={styles.originSpread}>
            <Reveal variant="rise">
              <h2>Independence With Infrastructure</h2>
            </Reveal>
            <Reveal variant="rise" delay={120}>
              <div className={styles.origin}>
                <p className={styles.originLede}>
                  Yacht Broker Services (YBS) is an independent yacht broker membership platform for
                  solopreneurs and small teams.
                </p>
                <p>
                  Our purpose is to give independent brokers the clout, resources and backing of a
                  world-class firm, without the heavy cost of corporate overhead.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Leadership preview */}
      <Section variant="white">
        <Container>
          <SectionHeader title="Meet the Founder" />
          <Stagger className={styles.foundersGrid}>
            {founders.map((f) => (
              <FounderPreview key={f.name} founder={f} />
            ))}
          </Stagger>
          <div className={styles.centerCta}>
            <Button href="/leadership" variant="secondary">
              About Our Leadership
            </Button>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section variant="charcoal">
        <Container narrow>
          <Reveal variant="rise" duration="signature">
            <div className={styles.ctaBlock}>
              <h2>Start with a Confidential Conversation</h2>
              <div className={styles.ctaActions}>
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
