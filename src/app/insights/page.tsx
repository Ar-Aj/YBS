import { Section, Container } from '@/components/layout/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger } from '@/components/motion/Stagger';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { buildMetadata } from '@/lib/metadata';
import { resources } from '@/data/insights';
import shared from '../shared.module.css';

export const metadata = buildMetadata({
  title: 'Insights for Independent Brokers',
  description:
    'Brokerage resources for independent yacht brokers, including a launch checklist and market research reports.',
  path: '/insights',
  // Every article and resource is still "Coming Soon". Keep the page out of
  // search results (and out of sitemap.ts) until the first real article ships.
  noindex: true,
});

export default function InsightsPage() {
  return (
    <>
      <CinematicHero
        label="Insights"
        title="Insights & Resources"

        posterSrc="/hero_insights.jpg"
      />

      <Breadcrumbs items={[{ label: 'Insights', href: '/insights' }]} />


      <Section variant="champagne">
        <Container>
          <SectionHeader title="Brokerage Resources" light />
          <Stagger className={shared.grid3}>
            {resources.filter((r) => r.title !== 'Membership Overview').map((r) => (
              <div key={r.title} className={shared.resourceCard}>
                <h3>{r.title}</h3>
                <p>{r.description}</p>
                <span className={shared.resourceBadge}>
                  {r.available ? 'Download' : 'Coming Soon'}
                </span>
              </div>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section variant="charcoal">
        <Container narrow>
          <Reveal variant="rise" duration="signature">
            <div className={shared.ctaBlock}>
              <h2>Questions in the Meantime?</h2>
              <div className={shared.ctaActions}>
                <Button href="/faq" size="lg">
                  Read the FAQ
                </Button>
                <Button href="/contact" variant="ghost" size="lg">
                  Get in Touch
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
