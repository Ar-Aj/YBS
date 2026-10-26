import { Section, Container } from '@/components/layout/Section';
import { SectionHeader, GoldRule } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger } from '@/components/motion/Stagger';
import { FounderPreview } from '@/components/content/FounderProfile';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { buildMetadata } from '@/lib/metadata';
import { founders, foundingPrinciple } from '@/data/leadership';
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
        title={<>The Firm Behind<br />Your Independence</>}
        subtitle="Yacht Broker Services was founded to give independent yacht brokers the infrastructure of a major brokerage — without surrendering their autonomy or their earnings."
        posterSrc="/hero_about.jpg"
      />

      <Breadcrumbs items={[{ label: 'About', href: '/about' }]} />

      {/* Philosophy */}
      <Section variant="white">
        <Container>
          <div className={styles.philosophy}>
            <Reveal variant="rise" duration="signature">
              <blockquote className={styles.quote}>
                {foundingPrinciple}
              </blockquote>
            </Reveal>
            <Reveal variant="rise" duration="signature" delay={160}>
              <div>
                <span className={styles.label}>Our Philosophy</span>
                <h2>Independence With Infrastructure</h2>
                <GoldRule delay={200} />
                <p>
                  YBS provides solopreneurs and small teams with the clout, resources
                  and backing of a world-class firm, without the heavy cost of
                  corporate overhead.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Vision */}
      <Section variant="champagne">
        <Container>
          <Reveal>
            <div className={styles.vision}>
              <span className={styles.label}>Our Vision</span>
              <h2>A Turnkey Business Ecosystem</h2>
              <GoldRule center />
              <p>
                We aim to modernize and empower independent brokers with a turnkey
                business ecosystem. By combining MLS integration, automated
                marketing, dedicated legal support and AI-driven client outreach,
                YBS lets brokers operate with the capabilities of a major house
                while keeping their independence and retaining 75% or 90% of their
                gross commissions.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* What is YBS */}
      <Section variant="ivory">
        <Container>
          <div className={styles.originSpread}>
            <aside className={styles.originMargin}>
              <span className={styles.label}>The Firm</span>
              <h2>What Is Yacht Broker Services?</h2>
              <GoldRule />
            </aside>
            <Stagger className={styles.originBody}>
              <p className={styles.originLede}>
                Yacht Broker Services (YBS) is an independent yacht broker membership
                platform. It supplies the business infrastructure behind an
                independent practice: brand kit and website, marketing support,
                CRM and MLS access, assistant support, and help with contracts,
                KYC, surveys and closing.
              </p>
              <h3 className={styles.originSub}>How the Relationship Works</h3>
              <div className={styles.origin}>
                <p>
                  You are the broker and the brand. YBS is a service platform: you
                  choose Express ($1,500 a month, 75% retained) or Preferred ($3,000 a
                  month, 90% retained), and YBS works for you.
                </p>
                <p>
                  Your client data is yours entirely. YBS sees only what you choose
                  to share and uses it only to support your activities. The
                  Independent Broker Membership Agreement governs the details.
                </p>
              </div>
            </Stagger>
          </div>
        </Container>
      </Section>

      {/* Leadership preview */}
      <Section variant="white">
        <Container>
          <SectionHeader label="Leadership" title="Meet the Founder" />
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
              <span className={styles.label}>Next Step</span>
              <h2>Start with a Confidential Conversation</h2>
              <GoldRule center />
              <p>
                Discuss your practice and which membership option fits.
              </p>
              <div className={styles.ctaActions}>
                <Button href="/contact" size="lg">
                  Schedule a Confidential Call
                </Button>
                <Button href="/services" variant="ghost" size="lg">
                  Explore Services
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
