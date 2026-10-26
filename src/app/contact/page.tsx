import { Section, Container } from '@/components/layout/Section';
import { GoldRule } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { ContactForm } from '@/components/content/ContactForm';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { buildMetadata } from '@/lib/metadata';
import { siteConfig } from '@/data/site';
import shared from '../shared.module.css';

export const metadata = buildMetadata({
  title: 'Request a Confidential Call',
  description:
    'Request a confidential call to discuss your practice, your licensing position and the Express and Preferred membership options at Yacht Broker Services.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <CinematicHero
        label="Get in Touch"
        title="Let's Talk — Discreetly and Confidentially"
        subtitle="Schedule a confidential strategy session to discuss your goals and explore the YBS ecosystem."
        posterSrc="/hero_contact.jpg"
      />

      <Breadcrumbs items={[{ label: 'Contact', href: '/contact' }]} />

      <Section variant="ivory">
        <Container>
          <div className={shared.contactLayout}>
            <Reveal variant="rise" duration="signature">
              <div className={shared.contactForm}>
                <h2>Send Us a Message</h2>
                <p className={shared.contactLead}>
                  Tell us about your practice and we will arrange a confidential call.
                </p>
                <ContactForm />
              </div>
            </Reveal>

            <Reveal variant="rise" duration="signature" delay={160}>
              <div className={shared.sidebar}>
                <span className={shared.sidebarLabel}>Prefer to Email?</span>
                <h3>Request a Confidential<br />Call</h3>
                <p>
                  Discuss your practice, your licensing position and which
                  membership option fits.
                </p>
                <GoldRule delay={200} />

                <div className={shared.contactItem}>
                  <svg className={shared.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                  <a href={`mailto:${siteConfig.email}`} className={shared.contactText}>
                    {siteConfig.email}
                  </a>
                </div>

                <Button
                  href={`mailto:${siteConfig.email}?subject=Confidential%20call%20request`}
                  size="lg"
                  fullWidth
                >
                  Email to Schedule a Call
                </Button>

                <p className={shared.confidential}>
                  All conversations are strictly confidential.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
