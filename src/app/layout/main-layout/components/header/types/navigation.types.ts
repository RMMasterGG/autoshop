export type navType = 'link' | 'button';
export interface NavItem {
  label: string;
  link: string;
  type: navType;
  customClass?: string;
}

export const navItems: NavItem[] = [
  { label: 'nav.home', link: 'main', type: 'link' },
  { label: 'nav.booking', link: 'booking', type: 'button', customClass: 'booking__button' },
  { label: 'nav.services', link: 'services', type: 'link' },
  { label: 'nav.about', link: 'about', type: 'link' },
  { label: 'nav.reviews', link: 'reviews', type: 'link' },
  { label: 'nav.contacts', link: 'contacts', type: 'link' },
];
