import { Section, Container } from '@/components/layout/Section';
import { SectionHeader, GoldRule } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger } from '@/components/motion/Stagger';
import { ServiceChapter } from '@/components/content/ServiceChapter';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { buildMetadata } from '@/lib/metadata';
import { servicePillars } from '@/data/services';
import styles from '../shared.module.css';

export const metadata = buildMetadata({
  title: 'Broker Services and Support',
  description:
    'What a YBS membership includes: brand kit and website, monthly AI video, private CRM, MLS research and comps, contract production, KYC support and closing coordination.',
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      <CinematicHero
        label="Services"
        title="Your Complete Brokerage Ecosystem"
        subtitle="White-glove operational support across four pillars — from brand creation to closing coordination."
        posterSrc="/hero_services.jpg"
      />

      <Breadcrumbs items={[{ label: 'Services', href: '/services' }]} />

      <Section variant="white">
        <Container>
          <Reveal>
            <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
              What Does a YBS Membership Include?
            </h2>
            <GoldRule center />
            <p style={{ textAlign: 'center', maxWidth: '72ch', margin: '0 auto', lineHeight: 1.85 }}>
              A YBS membership gives an independent yacht broker a brand kit and
              website, marketing support, a private CRM, MLS services with market
              research and reports, assistant support, and transaction help from
              contract production and KYC support through survey coordination and
              closing documents. Your membership agreement lists every service.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section variant="ivory">
        <Container>
          <SectionHeader
            title="What we do for you"
          />
          <Stagger>
            {servicePillars.map((p, i) => (
              <ServiceChapter key={p.title} pillar={p} index={i} />
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section variant="charcoal">
        <Container>
          <Reveal variant="rise" duration="signature">
            <div className={styles.ctaBlock}>
              <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'var(--text-accent-on-dark)', marginBottom: '1rem' }}>Membership</span>
              <h2>See How the Membership Works</h2>
              <GoldRule center />
              <p>
                Choose Express at $1,500 a month or Preferred at $3,000 a month. Some
                costs, such as non-digital marketing and boat shows, are separate,
                and the Membership Agreement sets out the details.
              </p>
              <div className={styles.ctaActions}>
                <Button href="/how-it-works" size="lg">See Membership Options</Button>
                <Button href="/contact" variant="ghost" size="lg">Request a Confidential Call</Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
