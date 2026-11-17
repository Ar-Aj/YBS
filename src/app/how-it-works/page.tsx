import Link from 'next/link';
import { Section, Container } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger } from '@/components/motion/Stagger';
import { StepCard } from '@/components/content/StepCard';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/metadata';
import { webPageJsonLd } from '@/data/structured-data';
import { steps } from '@/data/howItWorks';
import styles from './page.module.css';
import shared from '../shared.module.css';

const TITLE = 'Joining YBS';
const DESCRIPTION =
  'Discover the three steps to joining YBS. Contact us for a confidential conversation about membership.';
const PATH = '/how-it-works';

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd data={webPageJsonLd(TITLE, DESCRIPTION, PATH)} />
      <CinematicHero
        label="How It Works"
        title="Three Steps to Independence"
        subtitle="Getting started is simple, confidential, and on your timeline."
        posterSrc="/hero_how_it_works.jpg"
        videoSrc="/videos/hero-how-it-works.mp4"
      />

      <Breadcrumbs items={[{ label: 'How It Works', href: '/how-it-works' }]} />

      <Section variant="ivory">
        <Container>
          <Stagger as="ol" className={styles.process}>
            {steps.map((s) => (
              <StepCard key={s.number} step={s} />
            ))}
          </Stagger>
          <nav className={styles.processLinks} aria-label="Membership information">
            <Link href="/#services">Included services</Link>
          </nav>
        </Container>
      </Section>

      <Section variant="charcoal">
        <Container narrow>
          <Reveal variant="rise" duration="signature">
            <div className={shared.ctaBlock}>
              <h2>Start with a Confidential Call</h2>
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
