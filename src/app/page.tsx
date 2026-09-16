import Image from 'next/image';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { Section, Container } from '@/components/layout/Section';
import { SectionHeader, GoldRule } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ServiceCard } from '@/components/content/ServiceCard';
import { ComparisonTable } from '@/components/content/ComparisonTable';
import { TierCard } from '@/components/content/TierCard';
import { StepCard } from '@/components/content/StepCard';
import { FAQAccordion } from '@/components/content/FAQAccordion';
import { FounderPreview } from '@/components/content/FounderProfile';
import { servicePillars } from '@/data/services';
import { comparisonRows, tiers } from '@/data/difference';
import { steps, deliverables } from '@/data/howItWorks';
import { founders } from '@/data/leadership';
import { faqCategories } from '@/data/faq';
import styles from './page.module.css';

export default function HomePage() {
  const previewFaqs = faqCategories[0].items.slice(0, 3);

  return (
    <>
      {/* 1. Hero */}
      <CinematicHero
        label="Yacht Broker Services"
        title={<>Be The Architect<br />of Your Future</>}
        subtitle="Retain up to 90% of your commissions, while accessing personalized marketing programs, customized back-office operations, and administrative support tailored to elite yacht brokers."
        posterSrc="/hero-home.jpg"
        videoSrc="/videos/hero-home.mp4"
        mobileVideoSrc="/videos/hero-home-mobile.mp4"
        objectPositionDesktop="center center"
        objectPositionMobile="center center"
        overlayVariant="natural"
      />

      {/* 2. Stat Strip */}
      <section className={styles.statStrip}>
        <Container>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>90%</span>
              <span className={styles.statLabel}>Commission Retention</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>Full</span>
              <span className={styles.statLabel}>Brand Autonomy</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>White-Glove</span>
              <span className={styles.statLabel}>Operational Support</span>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Pain → Solution Split */}
      <section className={styles.split}>
        <div className={styles.splitLeft}>
          <RevealOnScroll variant="left">
            <span className={styles.labelDark}>The Problem</span>
            <h3>Traditional Brokerages Take Too Much</h3>
            <GoldRule />
            <p>
              Traditional brokerages take a large cut of your hard-earned commissions
              while providing outdated tools and rigid oversight. You build the
              relationships, close the deals, and carry the risk — but someone else
              captures the reward.
            </p>
          </RevealOnScroll>
        </div>
        <div className={styles.splitRight}>
          <RevealOnScroll variant="right">
            <span className={styles.label}>The YBS Solution</span>
            <h3>Keep More. Own More. Do More.</h3>
            <GoldRule />
            <p>
              YBS flips the script. We provide the infrastructure and marketing
              assets you need to close deals. You keep more of your commissions
              while we take care of the heavy lifting behind the scenes.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* 4. Services Ecosystem */}
      <Section variant="ivory">
        <Container>
          <RevealOnScroll>
            <SectionHeader
              label="What We Provide"
              title="Your Complete Support Ecosystem"
              subtitle="Bespoke marketing, full back-office operations, CRM, and transaction support."
            />
          </RevealOnScroll>
          <RevealOnScroll stagger>
            <div className={styles.servicesGrid}>
              {servicePillars.slice(0, 3).map((p) => (
                <ServiceCard key={p.title} pillar={p} />
              ))}
            </div>
          </RevealOnScroll>
          <div className={styles.centerCta}>
            <Button href="/services" variant="secondary">
              Explore All Services
            </Button>
          </div>
        </Container>
      </Section>

      {/* 5. What You Get */}
      <Section variant="navy">
        <Container>
          <RevealOnScroll>
            <SectionHeader
              label="What You Get"
              title="Everything Included"
              subtitle="From entity formation to closing support — here's what every YBS member receives."
              light
            />
          </RevealOnScroll>
          <RevealOnScroll>
            <ol className={styles.deliverables}>
              {deliverables.map((item, i) => (
                <li key={i} className={styles.deliverableItem}>
                  <span className={styles.deliverableNum}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.deliverableText}>{item}</span>
                </li>
              ))}
            </ol>
          </RevealOnScroll>
          <div className={styles.centerCta}>
            <Button href="/how-it-works" variant="ghost">
              See How It Works
            </Button>
          </div>
        </Container>
      </Section>

      {/* 6. Membership Tiers */}
      <Section variant="ivory">
        <Container>
          <RevealOnScroll>
            <SectionHeader
              label="Membership"
              title="Choose Your Path"
              subtitle="Two tiers. Transparent pricing. Maximum commissions."
            />
          </RevealOnScroll>
          <RevealOnScroll stagger>
            <div className={styles.tiersGrid}>
              {tiers.map((t) => (
                <TierCard key={t.name} tier={t} />
              ))}
            </div>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* 7. Comparison Table */}
      <Section variant="white">
        <Container>
          <RevealOnScroll>
            <SectionHeader
              label="The Difference"
              title="Traditional Brokerage vs. YBS"
            />
          </RevealOnScroll>
          <RevealOnScroll variant="scale">
            <ComparisonTable rows={comparisonRows} />
          </RevealOnScroll>
          <div className={styles.centerCta}>
            <Button href="/the-ybs-difference" variant="secondary">
              Learn More About the Difference
            </Button>
          </div>
        </Container>
      </Section>

      {/* 8. How It Works */}
      <Section variant="ivory">
        <Container>
          <RevealOnScroll>
            <SectionHeader
              label="How It Works"
              title="Three Steps to Independence"
            />
          </RevealOnScroll>
          <RevealOnScroll stagger>
            <div className={styles.stepsGrid}>
              {steps.map((s) => (
                <StepCard key={s.number} step={s} />
              ))}
            </div>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* 9. Leadership Preview */}
      <Section variant="white">
        <Container>
          <RevealOnScroll>
            <SectionHeader
              label="Leadership"
              title="Built by an Industry Veteran"
            />
          </RevealOnScroll>
          <RevealOnScroll stagger>
            <div className={styles.foundersGrid}>
              {founders.map((f) => (
                <FounderPreview key={f.name} founder={f} />
              ))}
            </div>
          </RevealOnScroll>
          <div className={styles.centerCta}>
            <Button href="/leadership" variant="secondary">
              Meet the Founder
            </Button>
          </div>
        </Container>
      </Section>

      {/* 10. FAQ Preview */}
      <Section variant="ivory">
        <Container>
          <RevealOnScroll>
            <SectionHeader
              label="FAQ"
              title="Common Questions"
            />
          </RevealOnScroll>
          <RevealOnScroll>
            <FAQAccordion items={previewFaqs} />
          </RevealOnScroll>
          <div className={styles.centerCta}>
            <Button href="/faq" variant="secondary">
              View All Questions
            </Button>
          </div>
        </Container>
      </Section>

      {/* 11. Final CTA */}
      <Section variant="dark">
        <Container narrow>
          <RevealOnScroll>
            <div className={styles.finalCta}>
              <span className={styles.label}>Ready?</span>
              <h2>Your Future Starts with a Conversation</h2>
              <GoldRule center />
              <p>
                Schedule a confidential call to discuss how YBS can support your
                transition to independence. No obligation. Complete discretion.
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
          </RevealOnScroll>
        </Container>
      </Section>
    </>
  );
}
