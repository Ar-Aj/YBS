import type { NavLink } from './site';

export const primaryNav: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'The Difference', href: '/the-ybs-difference' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Leadership', href: '/leadership' },
  { label: 'Contact', href: '/contact' },
];

export const mobileNav: NavLink[] = [
  ...primaryNav,
  { label: 'FAQ', href: '/faq' },
  { label: 'Insights', href: '/insights' },
];

export const footerNav = {
  navigate: [
    { label: 'Home', href: '/' },
    { label: 'About YBS', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Leadership', href: '/leadership' },
    { label: 'Contact', href: '/contact' },
  ] as NavLink[],
  learnMore: [
    { label: 'The YBS Difference', href: '/the-ybs-difference' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Insights & Resources', href: '/insights' },
  ] as NavLink[],
};
