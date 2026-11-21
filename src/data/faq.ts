import type { FAQCategory } from './site';

/** Explainer Q&A with Kent's approved commission wording; discuss pricing directly. */
export const faqCategories: FAQCategory[] = [
  {
    title: 'The YBS Advantage',
    id: 'membership',
    items: [
      {
        question: 'What is the core benefit of joining the YBS network?',
        answer: 'We operate a Membership Platform that provides infrastructure, marketing, business-development services, and legal compliance coordination to independent yacht brokers. The primary advantage is that you and your entity remain completely independent, while we manage all of the back-office operations required to run your business. We do not act as your employer and do not dictate your daily activities, which leaves you with the freedom to manage your clients your way.',
      },
      {
        question: 'What is the commission structure?',
        answer: 'Commissions range from 75% - 90%, depending on the membership structure you choose.  Contact us for details on membership.',
        link: { label: 'Contact YBS', href: '/contact' },
      },
      {
        question: 'What other services do I receive with my membership?',
        answer: 'Your membership provides you with a robust suite of support services. We guide you through the setup process and provide a stylized brand kit personalized for your company. We handle website creation, provide social media support, and a personalized monthly newsletter with your company’s branding. We supply access to legal advice, contract templates, comps research and reports, survey and sea-trial support, and closing-document coordination. Perhaps most importantly, you own all of your client data in its entirety. YBS only sees the data you choose to share and does not access it for any purpose other than to support your activities.',
      },
      {
        question: 'Are there any other expenses besides the Membership dues and fees?',
        answer: 'Yes, you or your clients are responsible for any non-digital marketing expenses like magazine advertising, banners, printed materials, boat show expenses, and any premium marketing promotions or products that you may choose to employ.',
      },
    ],
  },
  {
    title: 'Program Mechanics',
    id: 'program-mechanics',
    items: [
      {
        question: 'Are there any eligibility requirements for membership?',
        answer:
          'Yes, if you’re in the United States you must hold a yacht broker’s license or be licensed under an Employing Broker who is a member. We can introduce you to an Employing Broker if needed. If you are outside the U.S. and in a jurisdiction that requires licensure, you will need to have that license.',
      },
      {
        question: 'How long is the term of this agreement?',
        answer: 'The initial term of the agreement is twenty-four months. Following this term, the agreement automatically renews for successive twelve-month periods. This ensures you have uninterrupted access to the platform, though either party can choose not to renew by providing a sixty-day notice before the anniversary date.',
      },
      {
        question: 'Are there exclusivity requirements while I am on the platform?',
        answer: 'Yes, during the term of the agreement, you conduct all of your yacht brokerage and charter related activities through the YBS platform. To keep everything organized, you record your transactions via the Membership portal. This ensures that you receive the full benefits offered through the Platform, such as transaction follow-up support, basic KYC, legal support, and any direct sales-related marketing activities.',
      },
      {
        question: 'Can I change my membership tier?',
        answer: 'Yes, but there is a transaction-level lock on every deal. The membership option that is in effect on the date you sign a client agreement governs that transaction through closing. However, you can change your membership tier annually upon renewal.',
      },
      {
        question: 'Can I take my company ID, logo, and intellectual property with me if I want to leave Yacht Broker Services?',
        answer: 'Yes, after the initial 24-month term, if you choose to leave the YBS platform, you get all of your IP and marketing materials and can continue your business without any obligation to Yacht Broker Services, subject only to the restrictions outlined in the detailed terms of the agreement.',
      },
    ],
  },
];
