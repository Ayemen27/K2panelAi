/**
 * Navigation Configuration
 * 
 * Defines navigation structure, links, and menu items for the application.
 * Supports nested dropdowns and grouped navigation items with i18n support.
 */

/**
 * Navigation link interface
 */
export interface NavLink {
  label: string;
  href: string;
  description?: string;
  icon?: string;
  badge?: string;
  external?: boolean;
}

/**
 * Navigation dropdown group interface
 */
export interface NavDropdownGroup {
  label: string;
  items: NavLink[];
}

/**
 * Navigation item with optional dropdown
 */
export interface NavItem {
  label: string;
  href?: string;
  dropdown?: NavDropdownGroup[];
  featured?: NavLink;
}

/**
 * Translation function type
 */
type TranslateFn = (key: string) => string;

/**
 * Get primary navigation items with translations
 */
export function getPrimaryNav(t: TranslateFn): NavItem[] {
  return [
    {
      label: t('nav.products.label'),
      dropdown: [
        {
          label: t('nav.products.coreProducts'),
          items: [
            {
              label: t('nav.products.agent.label'),
              href: '/products/agent',
              description: t('nav.products.agent.desc'),
              icon: '/images/icons/agent.svg',
              badge: t('nav.products.agent.badge'),
            },
            {
              label: t('nav.products.deployments.label'),
              href: '/products/deployments',
              description: t('nav.products.deployments.desc'),
              icon: '/images/icons/deployments.svg',
            },
            {
              label: t('nav.products.database.label'),
              href: '/products/database',
              description: t('nav.products.database.desc'),
              icon: '/images/icons/database.svg',
            },
          ],
        },
        {
          label: t('nav.products.solutions'),
          items: [
            {
              label: t('nav.products.mobile.label'),
              href: '/mobile',
              description: t('nav.products.mobile.desc'),
              icon: '/images/icons/mobile.svg',
            },
            {
              label: t('nav.products.security.label'),
              href: '/products/security',
              description: t('nav.products.security.desc'),
              icon: '/images/icons/security.svg',
            },
            {
              label: t('nav.products.integrations.label'),
              href: '/products/integrations',
              description: t('nav.products.integrations.desc'),
              icon: '/images/icons/integrations.svg',
            },
          ],
        },
      ],
      featured: {
        label: t('nav.products.seeAll'),
        href: '/products',
        description: t('nav.products.seeAllDesc'),
      },
    },
    {
      label: t('nav.templates'),
      href: '/templates',
    },
    {
      label: t('nav.gallery'),
      href: '/gallery',
    },
    {
      label: t('nav.customers'),
      href: '/customers',
    },
    {
      label: t('nav.pricing'),
      href: '/pricing',
    },
    {
      label: t('nav.resources.label'),
      dropdown: [
        {
          label: t('nav.resources.learn'),
          items: [
            {
              label: t('nav.resources.helpCenter.label'),
              href: '/help',
              description: t('nav.resources.helpCenter.desc'),
            },
            {
              label: t('nav.resources.documentation.label'),
              href: 'https://docs.replit.com',
              description: t('nav.resources.documentation.desc'),
              external: true,
            },
            {
              label: t('nav.resources.tutorials.label'),
              href: '/tutorials',
              description: t('nav.resources.tutorials.desc'),
            },
          ],
        },
        {
          label: t('nav.resources.community'),
          items: [
            {
              label: t('nav.resources.blog.label'),
              href: '/news',
              description: t('nav.resources.blog.desc'),
            },
            {
              label: t('nav.resources.usecases.label'),
              href: '/usecases',
              description: t('nav.resources.usecases.desc'),
            },
            {
              label: t('nav.resources.communityLink.label'),
              href: 'https://replit.com/discord',
              description: t('nav.resources.communityLink.desc'),
              external: true,
            },
          ],
        },
        {
          label: t('nav.resources.company'),
          items: [
            {
              label: t('nav.resources.about.label'),
              href: '/about',
              description: t('nav.resources.about.desc'),
            },
            {
              label: t('nav.resources.careers.label'),
              href: '/careers',
              description: t('nav.resources.careers.desc'),
            },
            {
              label: t('nav.resources.brandKit.label'),
              href: '/brandkit',
              description: t('nav.resources.brandKit.desc'),
            },
          ],
        },
      ],
    },
  ];
}

/**
 * Get secondary navigation items (CTAs) with translations
 */
export function getSecondaryNav(t: TranslateFn) {
  return [
    {
      label: t('nav.login'),
      href: '/login',
      variant: 'ghost' as const,
    },
    {
      label: t('nav.signup'),
      href: '/signup',
      variant: 'default' as const,
    },
  ];
}

/**
 * Get mobile navigation with translations
 */
export function getMobileNav(t: TranslateFn) {
  return [
    {
      label: t('nav.signup'),
      href: '/signup',
      highlight: true,
    },
    {
      label: t('nav.login'),
      href: '/login',
    },
    { label: t('nav.products.label'), href: '/products' },
    { label: t('nav.templates'), href: '/templates' },
    { label: t('nav.gallery'), href: '/gallery' },
    { label: t('nav.customers'), href: '/customers' },
    { label: t('nav.pricing'), href: '/pricing' },
    { label: t('nav.resources.helpCenter.label'), href: '/help' },
    { label: t('nav.resources.documentation.label'), href: 'https://docs.replit.com', external: true },
    { label: t('nav.resources.blog.label'), href: '/news' },
    { label: t('nav.resources.about.label'), href: '/about' },
    { label: t('nav.resources.careers.label'), href: '/careers' },
  ];
}

/**
 * Breadcrumb configuration
 * Used for generating breadcrumbs on dynamic pages
 */
export const BREADCRUMB_LABELS: Record<string, string> = {
  products: 'Products',
  templates: 'Templates',
  gallery: 'Gallery',
  customers: 'Customers',
  pricing: 'Pricing',
  help: 'Help Center',
  news: 'Blog',
  about: 'About',
  careers: 'Careers',
  brandkit: 'Brand Kit',
  usecases: 'Use Cases',

  // Auth
  login: 'Log in',
  signup: 'Sign up',

  // App
  dashboard: 'Dashboard',
  profile: 'Profile',
} as const;

