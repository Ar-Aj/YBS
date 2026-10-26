import { Section, Container } from '@/components/layout/Section';
import { GoldRule, EyebrowLabel } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { FAQAccordion } from '@/components/content/FAQAccordion';
import { CinematicHero } from '@/components/layout/CinematicHero';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/metadata';
import { faqPageJsonLd } from '@/data/structured-data';
import { faqCategories } from '@/data/faq';
import shared from '../shared.module.css';

export const metadata = buildMetadata({
  title: 'Membership FAQ: Fees and Terms',
  description:
    'Answers on Express and Preferred fees, the 24-month term, licensing, expenses beyond dues, changing tiers, client-data ownership and getting started.',
  path: '/faq',
});

export default function FAQPage() {
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

      <Breadcrumbs items={[{ label: 'FAQ', href: '/faq' }]} />

      <Section variant="ivory">
        <Container>
          <div className={shared.faqLayout}>
            <nav className={shared.faqNav} aria-label="FAQ categories">
              {faqCategories.map((category) => (
                <a key={category.id} href={`#${category.id}`} className={shared.faqNavLink}>
                  {category.title}
                </a>
              ))}
            </nav>
            <div className={shared.faqColumns}>
              {faqCategories.map((category) => (
                <div key={category.id} id={category.id} className={shared.faqGroup}>
                  <Reveal>
                    <div className={shared.categoryHeader}>
                      <EyebrowLabel>{category.title}</EyebrowLabel>
                      <GoldRule />
                    </div>
                  </Reveal>
                  <Reveal>
                    <FAQAccordion items={category.items} />
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="charcoal">
        <Container narrow>
          <Reveal variant="rise" duration="signature">
            <div className={shared.ctaBlock}>
              <h2>Still Have Questions?</h2>
              <GoldRule center />
              <p>
                Every conversation is confidential. Ask us anything that is not
                covered here.
              </p>
              <div className={shared.ctaActions}>
                <Button href="/contact" size="lg">
                  Get in Touch
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
