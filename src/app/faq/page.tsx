import type { Metadata } from 'next';
import { Section, Container } from '@/components/layout/Section';
import { GoldRule, EyebrowLabel } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { FAQAccordion } from '@/components/content/FAQAccordion';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqPageJsonLd } from '@/data/structured-data';
import { faqCategories } from '@/data/faq';
import shared from '../shared.module.css';

export const metadata: Metadata = {
  title: 'FAQ — Yacht Broker Membership, Commissions & Services',
  description:
    'Answers about YBS membership tiers, commission splits, marketing support, CRM access, brand autonomy, and how to get started.',
  openGraph: {
    title: 'FAQ — Yacht Broker Membership, Commissions & Services',
    description: 'Answers about YBS membership tiers, commission splits, marketing support, CRM access, brand autonomy, and how to get started.',
  },
  alternates: { canonical: '/faq' },
};

export default function FAQPage() {
  // Flatten all FAQ items for JSON-LD
  const allFaqs = faqCategories.flatMap((c) => c.items);

  return (
    <>
      <JsonLd data={faqPageJsonLd(allFaqs)} />
      <CinematicHero
        label="FAQ"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about YBS, our membership model, and how we support independent yacht brokers."
        posterSrc="/hero_faq.jpg"
      />

      <Section variant="ivory">
        <Container>
          <div className={shared.faqColumns}>
            {faqCategories.map((category) => (
              <div key={category.id} className={shared.faqGroup}>
                <RevealOnScroll>
                  <div className={shared.categoryHeader}>
                    <EyebrowLabel>{category.title}</EyebrowLabel>
                    <GoldRule />
                  </div>
                </RevealOnScroll>
                <RevealOnScroll>
                  <FAQAccordion items={category.items} />
                </RevealOnScroll>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section variant="dark">
        <Container narrow>
          <RevealOnScroll>
            <div className={shared.ctaBlock}>
              <h2>Still Have Questions?</h2>
              <GoldRule center />
              <p>
                Every conversation is confidential. We&apos;re happy to answer anything
                that&apos;s not covered here.
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
