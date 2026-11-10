import type { FAQCategory } from './site';

/** Short clarifications; the full service list, pricing and terms have one home. */
export const faqCategories: FAQCategory[] = [
  {
    title: 'Membership Information',
    id: 'membership',
    items: [
      {
        question: 'Where can I compare the membership options?',
        answer:
          'The membership section sets out the monthly dues and commission retention for Standard and Elevated.',
        link: { label: 'View membership options', href: '/#membership' },
      },
      {
        question: 'Where can I review the agreement terms?',
        answer:
          'Read the key terms, then request the Independent Broker Membership Agreement from YBS for the full details.',
        link: { label: 'Read the key terms', href: '/how-it-works#terms' },
      },
    ],
  },
  {
    title: 'Your Independent Practice',
    id: 'independence',
    items: [
      {
        question: 'Am I employed by YBS?',
        answer:
          'No. You and your entity remain independent. YBS does not act as your employer or dictate your daily activities.',
      },
      {
        question: 'Who can access my client data?',
        answer: 'You control what you share with YBS.',
        link: { label: 'CRM and data ownership', href: '/#services' },
      },
      {
        question: 'Can YBS help me find an Employing Broker?',
        answer: 'YBS can introduce an Employing Broker if your licensing position requires one.',
        link: { label: 'Discuss your licensing position', href: '/contact' },
      },
    ],
  },
];
