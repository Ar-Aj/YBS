import type { Metadata } from 'next';
import { Section, Container } from '@/components/layout/Section';
import { GoldRule } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ContactForm } from '@/components/content/ContactForm';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { siteConfig } from '@/data/site';
import shared from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Contact — Confidential Consultation for Yacht Brokers',
  description:
    'Schedule a confidential strategy session. Discuss your goals and explore YBS membership for independent yacht brokerage support.',
  openGraph: {
    title: 'Contact — Confidential Consultation for Yacht Brokers',
    description: 'Schedule a confidential strategy session. Discuss your goals and explore YBS membership for independent yacht brokerage support.',
  },
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <>
      <CinematicHero
        label="Get in Touch"
        title="Let's Talk — Discreetly and Confidentially"
        subtitle="Schedule a confidential strategy session to discuss your goals and explore the YBS ecosystem."
        posterSrc="/hero_contact.jpg"
      />

      <Section variant="ivory">
        <Container>
          <div className={shared.contactLayout}>
            {/* Form */}
            <RevealOnScroll variant="left">
              <div>
                <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-xs)' }}>
                  Send Us a Message
                </h2>
                <p style={{ color: 'var(--slate)', marginBottom: 'var(--space-xl)' }}>
                  We typically respond within one business day.
                </p>
                <ContactForm />
              </div>
            </RevealOnScroll>

            {/* Sidebar */}
            <RevealOnScroll variant="right">
              <div className={shared.sidebar}>
                <span style={{
                  display: 'block',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--gold)',
                  marginBottom: 'var(--space-md)',
                }}>
                  Prefer a Call?
                </span>
                <h3>Book a Confidential<br />Strategy Session</h3>
                <p>
                  Speak directly with our team about your goals, your current
                  situation, and how YBS can support your transition to independence.
                </p>
                <GoldRule />

                <div className={shared.contactItem}>
                  <svg className={shared.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className={shared.contactText}
                  >
                    {siteConfig.email}
                  </a>
                </div>

                <div className={shared.contactItem}>
                  <svg className={shared.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className={shared.contactText}>Available worldwide</span>
                </div>

                {/* REPLACE: Update with real booking link */}
                <Button href="#" size="lg" fullWidth>
                  Schedule a Call
                </Button>

                <p className={shared.confidential}>
                  All conversations are strictly confidential.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </Container>
      </Section>
    </>
  );
}
