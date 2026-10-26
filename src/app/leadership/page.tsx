import Link from 'next/link';
import { Section, Container } from '@/components/layout/Section';
import { SectionHeader, GoldRule, EyebrowLabel } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger } from '@/components/motion/Stagger';
import { FounderProfile } from '@/components/content/FounderProfile';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/metadata';
import { personJsonLd, webPageJsonLd } from '@/data/structured-data';
import { siteConfig } from '@/data/site';
import {
  founders,
  foundingPrinciple,
  biography,
  previousPositions,
  ventures,
  industryInvolvement,
  education,
  founderExpertise,
  type ExperienceEntry,
} from '@/data/leadership';
import shared from '../shared.module.css';
import styles from './page.module.css';

const TITLE = 'Kent Chamberlain, Founder of YBS';
const DESCRIPTION =
  'Meet Kent Chamberlain, founder of Yacht Broker Services, whose large-yacht career spans brokerage leadership, charter, management and an international yacht show.';
const PATH = '/leadership';

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

function EntryList({ entries }: { entries: ExperienceEntry[] }) {
  return (
    <Stagger as="ul" className={styles.entries}>
      {entries.map((e) => (
        <li key={e.organization} className={styles.entry}>
          <span className={styles.entryName}>{e.organization}</span>
          <span className={styles.entryDetail}>{e.detail}</span>
        </li>
      ))}
    </Stagger>
  );
}

export default function LeadershipPage() {
  const kent = founders[0];

  return (
    <>
      <JsonLd
        data={personJsonLd({
          name: kent.name,
          jobTitle: kent.role,
          path: PATH,
          imagePath: kent.image,
          description: kent.bio,
          alumniOf: education.institution,
          knowsAbout: founderExpertise,
        })}
      />
      <JsonLd
        data={webPageJsonLd(
          TITLE,
          DESCRIPTION,
          PATH,
          `${siteConfig.url}${PATH}#person`
        )}
      />

      <CinematicHero
        label="Leadership"
        title="The Person Behind YBS"
        subtitle="Founded by an industry veteran who understands what it takes to build a successful, independent yacht brokerage."
        posterSrc="/hero_leadership.jpg"
        videoSrc="/videos/hero-leadership.mp4"
      />

      <Breadcrumbs items={[{ label: 'Leadership', href: '/leadership' }]} />

      {/* Profile */}
      <Section variant="ivory">
        <Container>
          {founders.map((founder, i) => (
            <div key={founder.name} className={shared.founderBlock}>
              <Reveal variant="rise" duration="signature">
                <FounderProfile founder={founder} reverse={i % 2 !== 0} />
              </Reveal>
            </div>
          ))}
        </Container>
      </Section>

      {/* Biography */}
      <Section variant="white" ariaLabel="Biography">
        <Container>
          <div className={styles.biographyGrid}>
            <Reveal variant="rise">
              <EyebrowLabel>Biography</EyebrowLabel>
              <h2 className={styles.sectionTitle}>{biography.heading}</h2>
              <GoldRule />
            </Reveal>
            <Reveal variant="rise" delay={120}>
              <div className={styles.prose}>
                {biography.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Selected experience */}
      <Section variant="ivory" ariaLabel="Selected leadership experience">
        <Container>
          <Reveal variant="rise" className={styles.experienceHeader}>
            <EyebrowLabel>Selected Experience</EyebrowLabel>
            <h2 className={styles.sectionTitle} style={{ maxWidth: 'none' }}>
              Leadership and Ownership
            </h2>
            <GoldRule />
            <p>
              Selected positions and ventures from Kent&rsquo;s career, as
              recorded in his 2006 biography.
            </p>
          </Reveal>

          <div className={styles.experienceGrid}>
            <div>
              <h3 className={styles.groupTitle}>Brokerage leadership</h3>
              <EntryList entries={previousPositions} />
            </div>
            <div>
              <h3 className={styles.groupTitle}>Ventures</h3>
              <EntryList entries={ventures} />
            </div>
          </div>
        </Container>
      </Section>

      {/* Industry involvement and education */}
      <Section variant="white" ariaLabel="Industry involvement and education">
        <Container>
          <div className={styles.pairGrid}>
            <Reveal variant="rise" className={styles.pairItem}>
              <EyebrowLabel>Industry</EyebrowLabel>
              <h2 className={styles.pairTitle}>{industryInvolvement.heading}</h2>
              <p className={styles.pairName}>{industryInvolvement.organization}</p>
              <p className={styles.pairText}>{industryInvolvement.summary}</p>
            </Reveal>
            <Reveal variant="rise" delay={120} className={styles.pairItem}>
              <EyebrowLabel>Academic</EyebrowLabel>
              <h2 className={styles.pairTitle}>{education.heading}</h2>
              <p className={styles.pairName}>{education.institution}</p>
              <p className={styles.pairText}>{education.summary}</p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Company principle (a company statement, not a personal quotation) */}
      <Section variant="champagne">
        <Container narrow>
          <div className={styles.principleWrap}>
            <SectionHeader label="Our Principle" title="Why the Broker Comes First" light />
            <Reveal variant="fade" duration="signature">
              <p className={styles.principle}>{foundingPrinciple}</p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section variant="charcoal">
        <Container narrow>
          <Reveal variant="rise" duration="signature">
            <div className={shared.ctaBlock}>
              <h2>Start with a Conversation</h2>
              <GoldRule center />
              <p>
                Schedule a confidential call to discuss your practice and which
                membership option, Express or Preferred, fits.
              </p>
              <div className={shared.ctaActions}>
                <Button href="/contact" size="lg">
                  Schedule a Confidential Call
                </Button>
                <Button href="/about" variant="ghost" size="lg">
                  About YBS
                </Button>
              </div>
              <nav className={styles.textLinks} aria-label="Related pages">
                <Link href="/how-it-works" className={styles.textLink}>
                  How membership works
                </Link>
                <Link href="/services" className={styles.textLink}>
                  Services for independent brokers
                </Link>
                <Link href="/the-ybs-difference" className={styles.textLink}>
                  The YBS difference
                </Link>
              </nav>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
