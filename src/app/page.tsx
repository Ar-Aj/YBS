import { CinematicHero } from '@/components/layout/CinematicHero';
import { Section, Container } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { CalculatorInvitation } from '@/components/home/CalculatorInvitation';
import { ServicesEcosystem } from '@/components/home/ServicesEcosystem';
import { buildMetadata } from '@/lib/metadata';
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

      <CalculatorInvitation />

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
