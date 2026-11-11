import Link from 'next/link';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { Section, Container } from '@/components/layout/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger } from '@/components/motion/Stagger';
import { ServicesEcosystem } from '@/components/home/ServicesEcosystem';
import { TierCard } from '@/components/content/TierCard';
import { buildMetadata } from '@/lib/metadata';
import { tiers } from '@/data/difference';
import styles from './page.module.css';

export const metadata = buildMetadata({
  title: 'Yacht Broker Services | Independent Yacht Broker Membership',
  description:
    'Run your own yacht brokerage with a brand kit, CRM and MLS access, marketing and transaction support. Retain 75% or 90% of gross commissions. Request a confidential call.',
  path: '/',
  absolute: true,
});

export default function HomePage() {
  return (
    <>
      <CinematicHero
        title={
          <>
            Be The Architect
            <br />
            of Your Future
          </>
        }
        cursiveTitle
        subtitle="Retain up to 90% of your commissions, while accessing personalized marketing programs, customized back-office operations, and administrative support tailored to elite yacht brokers."
        posterSrc="/hero-home.jpg"
        videoSrc="/videos/hero-home.mp4"
        mobileVideoSrc="/videos/hero-home-mobile.mp4"
        tabletVideoSrc="/videos/hero-home-tablet.mp4"
        mobileAspect="9 / 16"
        tabletAspect="16 / 9"
        overlayVariant="natural"
      />

      <section className={styles.narrative} aria-label="Your independent brokerage">
        <div className={styles.narrativeInner}>
          <div className={styles.narrativeLeft}>
            <Reveal variant="rise" duration="signature">
              <div className={styles.narrativeContent}>
                <h2>Your Name Above the Door</h2>
                <p className={styles.leadPara}>
                  You&apos;ve earned every client, negotiated every deal, and built trust through
                  years of expertise.
                </p>
                <p>
                  Build your brokerage under your own name, with the independence to decide how you
                  work with your clients.
                </p>
              </div>
            </Reveal>
          </div>
          <div className={styles.narrativeRight}>
            <Reveal variant="rise" duration="signature" delay={180}>
              <div className={styles.narrativeContent}>
                <h2>Autonomy, Fully Supported</h2>
                <p className={styles.leadPara}>
                  YBS handles the operational mechanics behind your practice, so you can focus on
                  your clients and sales.
                </p>
                <p>
                  You remain independent. YBS supplies the infrastructure and support behind your
                  business.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <ServicesEcosystem />

      <Section variant="ivory" id="membership" className={styles.membership}>
        <Container>
          <SectionHeader
            title="Two Membership Options"
            subtitle="Both provide the same amazing services"
            className={styles.membershipHeader}
          />
          <Stagger className={styles.tiersGrid}>
            {tiers.map((tier) => (
              <TierCard key={tier.name} tier={tier} />
            ))}
          </Stagger>
          <nav className={styles.membershipLinks} aria-label="Membership details">
            <Link href="/how-it-works#terms" className={styles.inlineLink}>
              Key terms
            </Link>
            <Link href="/the-ybs-difference" className={styles.inlineLink}>
              Compare your numbers
            </Link>
            <Link href="/how-it-works" className={styles.inlineLink}>
              How to join
            </Link>
          </nav>
        </Container>
      </Section>

      <Section variant="charcoal">
        <Container narrow>
          <Reveal variant="rise" duration="signature">
            <div className={styles.finalCta}>
              <h2>Your Future Starts with a Conversation</h2>
              <div className={styles.heroActions}>
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
