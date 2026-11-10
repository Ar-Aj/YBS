import { Section, Container } from '@/components/layout/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { ComparisonTable } from '@/components/content/ComparisonTable';
import { CommissionCalculator } from '@/components/content/CommissionCalculator';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { buildMetadata } from '@/lib/metadata';
import { comparisonRows, membershipDisclaimer } from '@/data/difference';
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
          <SectionHeader title="Traditional Brokerage vs. Yacht Broker Services" />
          <Reveal variant="clip" duration="signature">
            <ComparisonTable rows={comparisonRows} />
          </Reveal>
          <Reveal>
            <p className={styles.disclaimer}>{membershipDisclaimer}</p>
          </Reveal>
        </Container>
      </Section>

      {/* Compare against your own numbers — the calculator */}
      <Section variant="ivory">
        <Container>
          <SectionHeader
            title="Compare It Against Your Own Numbers"
            subtitle="Enter what you sell for and what you keep today, then see the same commission under YBS."
          />
          <Reveal variant="rise" duration="signature">
            <CommissionCalculator />
          </Reveal>
        </Container>
      </Section>

      <Section variant="charcoal">
        <Container narrow>
          <Reveal variant="rise" duration="signature">
            <div className={styles.ctaBlock}>
              <h2>Talk It Through With a Person</h2>
              <div className={styles.ctaActions}>
                <Button href="/contact" size="lg">
                  Schedule a Confidential Call
                </Button>
                <Button href="/#membership" variant="ghost" size="lg">
                  View Membership Options
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
