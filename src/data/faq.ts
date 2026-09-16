import type { FAQCategory } from './site';

export const faqCategories: FAQCategory[] = [
  {
    title: 'Membership & Pricing',
    id: 'membership',
    items: [
      {
        question: 'What are the membership tiers?',
        answer:
          'YBS offers two tiers: the Premium Tier at $3,000/month with a 90/10 commission split, and the Standard Tier at $1,500/month with a 75/25 commission split. Both require an annual commitment billed monthly.',
      },
      {
        question: 'How does the commission split work?',
        answer:
          'Your commission split is determined by your membership tier. On the Premium Tier, you retain 90% of every commission earned, with 10% going to YBS. On the Standard Tier, you retain 75%. There are no hidden fees or surprise deductions.',
      },
      {
        question: 'Are there any additional fees beyond the monthly dues?',
        answer:
          'Your monthly membership dues cover the full suite of YBS services. There are no hidden charges. Your commission split and monthly dues are transparent and predictable.',
      },
    ],
  },
  {
    title: 'Services & Support',
    id: 'services',
    items: [
      {
        question: 'What marketing support does YBS provide?',
        answer:
          'YBS provides bespoke luxury marketing including professional listing presentations, targeted buyer campaigns, luxury brand co-marketing, event organization, and one AI-generated video per month featuring you or your listings. We also handle website creation, maintenance, and content updates.',
      },
      {
        question: 'What is included in back-office support?',
        answer:
          'Our back-office support covers contract production, KYC support, survey coordination, haul-out scheduling, basic legal services, documentation, and closing support. We handle the operational complexity so you can focus on relationships and deals.',
      },
      {
        question: 'Do I get access to a CRM system?',
        answer:
          'Yes. Every YBS member receives access to a private, confidential CRM along with MLS services, market research and reports, lead tracking, email templates for prospecting and follow-ups, and dedicated assistant support.',
      },
    ],
  },
  {
    title: 'Independence & Brand',
    id: 'independence',
    items: [
      {
        question: 'Can I maintain my own brand identity?',
        answer:
          'Absolutely. YBS is designed to support your independent brand, not replace it. You maintain full autonomy over how you market yourself, your listings, and your professional identity. We provide the infrastructure; you own the brand.',
      },
      {
        question: 'How is YBS different from a traditional brokerage?',
        answer:
          'Traditional brokerages take 30–50% of your commissions while dictating how you market yourself and your listings. YBS flips the model: you retain up to 90% of your commissions, keep full brand autonomy, and receive tailored operational support — all for predictable monthly dues.',
      },
      {
        question: 'How do I get started?',
        answer:
          'Schedule a confidential call with our team. We\'ll discuss your goals, current practice, and how YBS can support your transition. There\'s no obligation and every conversation is strictly confidential.',
      },
    ],
  },
];
