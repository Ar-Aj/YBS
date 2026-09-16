import type { Metadata } from 'next';
import { Section, Container } from '@/components/layout/Section';
import { SectionHeader, GoldRule } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { InsightCard } from '@/components/content/InsightCard';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { insightPosts, resources } from '@/data/insights';
import shared from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Insights — Industry Intelligence for Yacht Brokers',
  description:
    'Strategy articles and resources for independent yacht brokers. Market trends, commission analysis, and brand-building guidance.',
  openGraph: {
    title: 'Insights — Industry Intelligence for Yacht Brokers',
    description: 'Strategy articles and resources for independent yacht brokers. Market trends, commission analysis, and brand-building guidance.',
  },
  alternates: { canonical: '/insights' },
};

export default function InsightsPage() {
  return (
    <>
      <CinematicHero
        label="Insights"
        title="Insights & Resources"
        subtitle="Industry intelligence, market trends, and strategy resources for the independent yacht broker."
        posterSrc="/hero_insights.jpg"
      />

      {/* Blog Grid */}
      <Section variant="ivory">
        <Container>
          <RevealOnScroll>
            <SectionHeader
              label="Latest Articles"
              title="Featured Insights"
            />
          </RevealOnScroll>
          <RevealOnScroll stagger>
            <div className={shared.grid3}>
              {insightPosts.map((post) => (
                <InsightCard key={post.slug} post={post} />
              ))}
            </div>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* Resources */}
      <Section variant="navy">
        <Container>
          <RevealOnScroll>
            <SectionHeader
              label="Tools & Resources"
              title="Broker Resources"
              subtitle="Professional tools and guides designed for independent yacht brokers."
              light
            />
          </RevealOnScroll>
          <RevealOnScroll stagger>
            <div className={shared.grid3}>
              {resources.map((r) => (
                <div key={r.title} className={shared.resourceCard}>
                  <h4>{r.title}</h4>
                  <p>{r.description}</p>
                  <span className={shared.resourceBadge}>
                    {r.available ? 'Download' : 'Coming Soon'}
                  </span>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* CTA */}
      <Section variant="dark">
        <Container narrow>
          <RevealOnScroll>
            <div className={shared.ctaBlock}>
              <h2>Stay Informed</h2>
              <GoldRule center />
              <p>
                Want to learn more about the independent brokerage model? Schedule
                a conversation with our team.
              </p>
              <div className={shared.ctaActions}>
                <Button href="/contact" size="lg">
                  Get in Touch
                </Button>
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>
    </>
  );
}
