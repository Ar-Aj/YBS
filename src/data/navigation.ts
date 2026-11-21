import type { NavLink } from './site';

export const primaryNav: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'See the difference', href: '/the-ybs-difference' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export const mobileNav: NavLink[] = [
  ...primaryNav,
  { label: 'Insights', href: '/insights' },
];

export const footerNav = {
  navigate: [
    { label: 'Home', href: '/' },
    { label: 'About YBS', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ] as NavLink[],
  learnMore: [
    { label: 'See the difference', href: '/the-ybs-difference' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Insights & Resources', href: '/insights' },
  ] as NavLink[],
};
