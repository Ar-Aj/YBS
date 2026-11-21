import { Section, Container } from '@/components/layout/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger } from '@/components/motion/Stagger';
import { FounderProfile } from '@/components/content/FounderProfile';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/metadata';
import { personJsonLd, webPageJsonLd } from '@/data/structured-data';
import { founders, previousPositions, ventures, industryInvolvement, founderExpertise, type ExperienceEntry } from '@/data/leadership';
import leadershipStyles from '../leadership/page.module.css';
import styles from './page.module.css';

const TITLE = 'About Independent Broker Membership';
const DESCRIPTION =
  'Yacht Broker Services gives solopreneurs and small teams the resources and backing of a world-class firm, without the heavy cost of corporate overhead.';
const PATH = '/about';

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

function EntryList({ entries }: { entries: ExperienceEntry[] }) {
  return (
    <Stagger as="ul" className={leadershipStyles.entries}>
      {entries.map((entry) => (
        <li key={entry.organization} className={leadershipStyles.entry}>
          <span className={leadershipStyles.entryName}>{entry.organization}</span>
          <span className={leadershipStyles.entryDetail}>{entry.detail}</span>
        </li>
      ))}
    </Stagger>
  );
}

export default function AboutPage() {
  return (
    <>
      <JsonLd data={webPageJsonLd(TITLE, DESCRIPTION, PATH)} />
      <JsonLd data={personJsonLd({ name: founders[0].name, jobTitle: founders[0].role, path: PATH, imagePath: founders[0].image, description: founders[0].bio, knowsAbout: founderExpertise })} />
      <CinematicHero
        label="About YBS"
        title={
          <>
            The Firm Behind
            <br />
            Your Independence
          </>
        }

        posterSrc="/hero_leadership.jpg"
        videoSrc="/videos/hero-leadership.mp4"
      />

      <Breadcrumbs items={[{ label: 'About', href: '/about' }]} />

      <Section variant="ivory">
        <Container>
          <div className={styles.originSpread}>
            <Reveal variant="rise">
              <h2>Independence With Infrastructure</h2>
            </Reveal>
            <Reveal variant="rise" delay={120}>
              <div className={styles.origin}>
                <p className={styles.originLede}>
                  Yacht Broker Services (YBS) is an independent yacht broker membership platform for
                  solopreneurs and small teams.
                </p>
                <p>
                  Our purpose is to give independent brokers the clout, resources and backing of a
                  world-class firm, without the heavy cost of corporate overhead.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Full founder profile, consolidated from Leadership */}
      <Section variant="white" id="kent">
        <Container>
          <SectionHeader title="About Kent" />
          <Stagger className={styles.foundersGrid}>
            {founders.map((f) => (
              <FounderProfile key={f.name} founder={f} />
            ))}
          </Stagger>

        </Container>
      </Section>

      <Section variant="ivory" ariaLabel="Selected leadership experience">
        <Container>
          <SectionHeader title="Leadership and Ownership" />
          <div className={leadershipStyles.experienceGrid}>
            <div>
              <h3 className={leadershipStyles.groupTitle}>Brokerage leadership</h3>
              <EntryList entries={previousPositions} />
            </div>
            <div>
              <h3 className={leadershipStyles.groupTitle}>Ventures</h3>
              <EntryList entries={[...ventures, { organization: industryInvolvement.organization, detail: industryInvolvement.summary }]} />
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section variant="charcoal">
        <Container narrow>
          <Reveal variant="rise" duration="signature">
            <div className={styles.ctaBlock}>
              <h2>Start with a Confidential Conversation</h2>
              <div className={styles.ctaActions}>
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
