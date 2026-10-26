import Link from 'next/link';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { Section, Container } from '@/components/layout/Section';
import { SectionHeader, GoldRule } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger } from '@/components/motion/Stagger';
import { Counter } from '@/components/motion/Counter';
import { ServicesEcosystem } from '@/components/home/ServicesEcosystem';
import { ServiceDetail } from '@/components/home/ServiceDetail';
import { TierCard } from '@/components/content/TierCard';
import { StepCard } from '@/components/content/StepCard';
import { FAQAccordion } from '@/components/content/FAQAccordion';
import { FounderPreview } from '@/components/content/FounderProfile';
import { buildMetadata } from '@/lib/metadata';
import { tiers, pricingExplanation } from '@/data/difference';
import { steps } from '@/data/howItWorks';
import { servicePillars } from '@/data/services';
import { founders } from '@/data/leadership';
import { faqCategories } from '@/data/faq';
import styles from './page.module.css';

export const metadata = buildMetadata({
  title: 'Yacht Broker Services | Independent Yacht Broker Membership',
  description:
    'Run your own yacht brokerage with a brand kit, CRM and MLS access, marketing and transaction support. Retain 75% or 90% of gross commissions. Request a confidential call.',
  path: '/',
  absolute: true,
});

export default function HomePage() {
  const previewFaqs = [
    ...faqCategories[0].items.slice(0, 2),
    faqCategories[1].items[0],
    faqCategories[1].items[1],
  ];

  return (
    <>
      {/* 1. Hero (protected, unchanged) */}
      <CinematicHero
        label="Yacht Broker Services"
        title={<>Be The Architect<br />of Your Future</>}
        subtitle="Retain up to 90% of your commissions, while accessing personalized marketing programs, customized back-office operations, and administrative support tailored to elite yacht brokers."
        posterSrc="/hero-home.jpg"
        videoSrc="/videos/hero-home.mp4"
        mobileVideoSrc="/videos/hero-home-mobile.mp4"
        tabletVideoSrc="/videos/hero-home-tablet.mp4"
        mobileAspect="9 / 16"
        tabletAspect="16 / 9"
        overlayVariant="natural"
      />

      {/* 2. Offer strip: verified figures only */}
      <section className={styles.statStrip} aria-label="Membership at a glance">
        <Container>
          <Stagger className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>
                <Counter value={90} />
              </span>
              <span className={styles.statLabel}>Preferred: $3,000 per month</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>
                <Counter value={75} />
              </span>
              <span className={styles.statLabel}>Express: $1,500 per month</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>Yours</span>
              <span className={styles.statLabel}>Your client data stays with you</span>
            </div>
          </Stagger>
        </Container>
      </section>

      {/* 3. You are the firm */}
      <section className={styles.narrative}>
        <div className={styles.narrativeInner}>
          <div className={styles.narrativeLeft}>
            <Reveal variant="rise" duration="signature">
              <div className={styles.narrativeContent}>
                <span className={styles.labelDark}>You Are the Firm</span>
                <h2>Your Name Above the Door</h2>
                <GoldRule />
                <p className={styles.leadPara}>
                  You&apos;ve earned every client, negotiated every deal, and built
                  trust through years of expertise.
                </p>
                <p>
                  YBS gives independent brokers a stylized brand kit, a website
                  created and maintained for you, and a monthly newsletter in your
                  company&apos;s branding, so the reputation you&apos;ve built carries
                  your name.
                </p>
                <p className={styles.closePara}>
                  Your client data is yours entirely. YBS sees only what you choose to
                  share and uses it only to support your activities.
                </p>
              </div>
            </Reveal>
          </div>
          <div className={styles.narrativeRight}>
            <Reveal variant="rise" duration="signature" delay={180}>
              <div className={styles.narrativeContent}>
                <span className={styles.label}>We Work for You</span>
                <h2>Autonomy, Fully Supported</h2>
                <GoldRule delay={180} />
                <p className={styles.leadPara}>
                  Retain 75% or 90% of your gross commissions while YBS handles the
                  operational mechanics of running a brokerage.
                </p>
                <p>
                  MLS and CRM access, entity formation, contract production, KYC
                  support, survey and sea-trial coordination, legal documentation,
                  closing coordination, and assistant support, all within one
                  membership.
                </p>
                <div className={styles.narrativeHighlight}>
                  <strong>At Yacht Broker Services you&apos;re our client.</strong>{' '}
                  We work for you.
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. Services ecosystem (signature moment) */}
      <ServicesEcosystem />

      {/* 5. What is included */}
      <Section variant="champagne">
        <Container>
          <SectionHeader
            label="What You Get"
            title="Everything Included in Your Membership"
            subtitle="From entity formation to closing support, YBS handles the infrastructure while you build your practice."
            light
          />
          <Reveal>
            <ServiceDetail pillars={servicePillars} />
          </Reveal>
          <div className={styles.centerCta}>
            <Button href="/services" variant="ghost">
              Explore All Services
            </Button>
          </div>
        </Container>
      </Section>

      {/* 6. Membership */}
      <Section variant="ivory">
        <Container>
          <SectionHeader
            label="Membership"
            title="Two Membership Options"
            subtitle="Choose your tier annually. Dues are paid monthly."
          />
          <Stagger className={styles.tiersGrid}>
            {tiers.map((t) => (
              <TierCard key={t.name} tier={t} />
            ))}
          </Stagger>
          <Reveal>
            <p className={styles.tierNote}>
              {pricingExplanation}{' '}
              <Link href="/how-it-works#terms" className={styles.inlineLink}>
                Read the key terms
              </Link>
              {' '}or{' '}
              <Link href="/the-ybs-difference" className={styles.inlineLink}>
                see how the membership compares
              </Link>
              .
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* 7. How it works */}
      <Section variant="white">
        <Container>
          <SectionHeader label="How It Works" title="Three Steps to Independence" />
          <Stagger className={styles.stepsGrid}>
            {steps.map((s) => (
              <StepCard key={s.number} step={s} />
            ))}
          </Stagger>
          <div className={styles.centerCta}>
            <Button href="/how-it-works" variant="secondary">
              See the Full Process
            </Button>
          </div>
        </Container>
      </Section>

      {/* 8. Leadership preview */}
      <Section variant="ivory">
        <Container>
          <SectionHeader label="Leadership" title="Meet the Founder" />
          <Reveal>
            <div className={styles.foundersGrid}>
              {founders.map((f) => (
                <FounderPreview key={f.name} founder={f} />
              ))}
            </div>
          </Reveal>
          <div className={styles.centerCta}>
            <Button href="/leadership" variant="secondary">
              About Our Leadership
            </Button>
          </div>
        </Container>
      </Section>

      {/* 9. FAQ preview */}
      <Section variant="white">
        <Container>
          <SectionHeader label="FAQ" title="Common Questions" />
          <Reveal>
            <FAQAccordion items={previewFaqs} />
          </Reveal>
          <div className={styles.centerCta}>
            <Button href="/faq" variant="secondary">
              View All Questions
            </Button>
          </div>
        </Container>
      </Section>

      {/* 10. Final CTA */}
      <Section variant="charcoal">
        <Container narrow>
          <Reveal variant="rise" duration="signature">
            <div className={styles.finalCta}>
              <span className={styles.label}>Next Step</span>
              <h2>Your Future Starts with a Conversation</h2>
              <GoldRule center />
              <p>
                Schedule a confidential call to discuss your practice, your licensing
                position, and which membership option fits. Complete discretion.
              </p>
              <div className={styles.heroActions}>
                <Button href="/contact" size="lg">
                  Schedule a Confidential Call
                </Button>
                <Button href="/how-it-works" variant="ghost" size="lg">
                  Explore Membership
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
