import { Section, Container } from '@/components/layout/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { ComparisonTable } from '@/components/content/ComparisonTable';
import { CommissionCalculator } from '@/components/content/CommissionCalculator';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/metadata';
import { webPageJsonLd } from '@/data/structured-data';
import { comparisonRows, membershipDisclaimer } from '@/data/difference';
import shared from '../shared.module.css';
import styles from './page.module.css';

const TITLE = 'YBS Changes Everything';
const DESCRIPTION =
  'A side-by-side look at commission split, autonomy, support and overhead for traditional yacht brokerage houses and YBS membership (75% or 90% retention).';
const PATH = '/the-ybs-difference';

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

export default function DifferencePage() {
  return (
    <>
      <JsonLd data={webPageJsonLd(TITLE, DESCRIPTION, PATH)} />
      <CinematicHero
        centeredCopy
        title="YBS Changes Everything"
        subtitle="A transparent comparison between the traditional brokerage model and the YBS platform."
        posterSrc="/hero_difference.jpg"
        videoSrc="/videos/hero-difference.mp4"
      />

      <Breadcrumbs items={[{ label: 'YBS Changes Everything', href: '/the-ybs-difference' }]} />

      {/* The only comparison on the site */}
      <Section variant="ivory" className={styles.comparison}>
        <Container>
          <SectionHeader
            className={styles.comparisonHeader}
            title={
              <>
                Traditional Brokerage
                <br />
                vs.
                <br />
                Yacht Broker Services
              </>
            }
          />
          <Reveal variant="clip" duration="signature">
            <ComparisonTable rows={comparisonRows} />
          </Reveal>
        </Container>
        <Container wide>
          <Reveal>
            <p className={`${shared.disclaimer} ${styles.comparisonDisclaimer}`}>
              {membershipDisclaimer}
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Compare against your own numbers — the calculator */}
      <Section variant="ivory" id="calculator" className={styles.calculator}>
        <Container>
          <SectionHeader
            title="Compare It Against Your Own Numbers"
            subtitle="Enter your average annual gross sales or recent gross income and your current brokerage split to compare estimated annual income under YBS."
          />
          <Reveal variant="rise" duration="signature">
            <h3 className={styles.calculatorTitle}>Calculator</h3>
            <CommissionCalculator />
          </Reveal>
        </Container>
      </Section>

      <Section variant="charcoal" className={styles.actionSection}>
        <Container narrow>
          <Reveal variant="rise" duration="signature">
            <div className={`${shared.ctaActions} ${styles.actions}`}>
              <Button href="/contact" size="lg">
                Schedule a Confidential Call
              </Button>

            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
