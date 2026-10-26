import type { FAQCategory } from './site';

/**
 * FAQ answers. Every answer is traceable to the Explainer script or the
 * client website data (see docs/YBS_REPOSITIONING_AND_MOTION_PLAN.md §1).
 * The Independent Broker Membership Agreement governs in all cases.
 */
export const faqCategories: FAQCategory[] = [
  {
    title: 'Membership & Fees',
    id: 'membership',
    items: [
      {
        question: 'What are the YBS membership options?',
        answer:
          'There are two. Express is $1,500 a month and you retain 75% of your gross commissions. Preferred is $3,000 a month and you retain 90% of your gross commissions. Both include MLS and CRM access and the services detailed in the Membership Agreement.',
      },
      {
        question: 'How are fees paid?',
        answer:
          'Monthly membership fees are deducted automatically by ACH withdrawal. Deal fees are collected through escrow at closing.',
      },
      {
        question: 'Are there expenses beyond the membership fees?',
        answer:
          'Yes. You or your clients are responsible for non-digital marketing expenses such as magazine advertising, banners, printed materials and boat show costs, and for any premium marketing promotions or products you choose to use.',
      },
      {
        question: 'Can I change my membership tier?',
        answer:
          'Yes, annually on renewal. Each transaction is locked to the tier in effect on the date you sign the client agreement, and that tier governs the deal through closing.',
      },
    ],
  },
  {
    title: 'Term & Eligibility',
    id: 'term',
    items: [
      {
        question: 'How long is the agreement?',
        answer:
          'The initial term is twenty-four months. After that it renews automatically for successive twelve-month periods. Either party can choose not to renew by giving sixty days\u2019 notice before the anniversary date.',
      },
      {
        question: 'Do I need a license to join?',
        answer:
          'In the United States you must hold a yacht broker\u2019s license or be licensed under an Employing Broker who is a member. YBS can introduce you to an Employing Broker if needed. Outside the US, you need a license if your jurisdiction requires one.',
      },
      {
        question: 'Is there an exclusivity requirement?',
        answer:
          'Yes. During the term, you conduct your yacht brokerage and charter activity through the YBS platform and record your transactions in the membership portal. That is how you receive transaction follow-up support, basic KYC, legal support and direct sales-related marketing activities.',
      },
      {
        question: 'What happens if I leave YBS?',
        answer:
          'After the initial 24-month term, you keep your company identity, logo, intellectual property and marketing materials and can continue your business without further obligation to YBS, subject only to the restrictions in the agreement.',
      },
    ],
  },
  {
    title: 'Services & Independence',
    id: 'services',
    items: [
      {
        question: 'Am I employed by YBS?',
        answer:
          'No. YBS operates a membership platform. You and your entity remain independent, YBS does not act as your employer, and YBS does not dictate your daily activities.',
      },
      {
        question: 'What services do I receive?',
        answer:
          'Setup guidance and a stylized brand kit, website creation, social media support, a monthly newsletter in your branding, a private CRM, MLS services with comps research and reports, assistant support, contract templates and production, KYC support, survey and sea-trial support, haul-out scheduling, access to legal advice, and closing-document coordination.',
      },
      {
        question: 'Who owns my client data?',
        answer:
          'You do, entirely. YBS only sees the data you choose to share and does not access it for any purpose other than supporting your activities.',
      },
      {
        question: 'How do I get started?',
        answer:
          'Request a confidential call. YBS will discuss your practice and licensing position and can provide the Independent Broker Membership Agreement for review.',
      },
    ],
  },
];
