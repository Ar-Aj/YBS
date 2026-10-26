import { Section, Container } from '@/components/layout/Section';
import { SectionHeader, GoldRule } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger } from '@/components/motion/Stagger';
import { InsightCard } from '@/components/content/InsightCard';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { buildMetadata } from '@/lib/metadata';
import { insightPosts, resources } from '@/data/insights';
import shared from '../shared.module.css';
import styles from './page.module.css';

export const metadata = buildMetadata({
  title: 'Insights for Independent Brokers',
  description:
    'Upcoming guides on what an independent broker membership includes, choosing between Express and Preferred, and building your own brokerage brand.',
  path: '/insights',
});

export default function InsightsPage() {
  return (
    <>
      <CinematicHero
        label="Insights"
        title="Insights & Resources"
        subtitle="Industry intelligence, market trends, and strategy resources for the independent yacht broker."
        posterSrc="/hero_insights.jpg"
      />

      <Breadcrumbs items={[{ label: 'Insights', href: '/insights' }]} />

      <Section variant="ivory">
        <Container>
          <SectionHeader
            label="In Preparation"
            title="Upcoming Guides"
            subtitle="Articles are being prepared. Topics below reflect questions brokers ask about membership."
          />
          <Reveal>
            <div className={styles.masthead}>
              <InsightCard post={insightPosts[0]} featured />
              <div className={styles.index}>
                {insightPosts.slice(1).map((post) => (
                  <InsightCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section variant="champagne">
        <Container>
          <SectionHeader
            label="Resources"
            title="Broker Resources"
            subtitle="Planned guides for independent yacht brokers."
            light
          />
          <Stagger className={shared.grid3}>
            {resources.map((r) => (
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
              <GoldRule center />
              <p>
                Read the membership FAQ or schedule a confidential call with the
                YBS team.
              </p>
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
