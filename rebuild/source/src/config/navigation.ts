/**
 * Navigation Configuration
 * 
 * Defines navigation structure, links, and menu items for the application.
 * Supports nested dropdowns and grouped navigation items.
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
 * Primary navigation items
 * Main navigation menu displayed in the header
 */
export const PRIMARY_NAV: NavItem[] = [
  {
    label: 'Products',
    dropdown: [
      {
        label: 'Core Products',
        items: [
          {
            label: 'Replit Agent',
            href: '/products/agent',
            description: 'Build software with AI',
            icon: '/images/icons/agent.svg',
            badge: 'New',
          },
          {
            label: 'Deployments',
            href: '/products/deployments',
            description: 'Ship to production instantly',
            icon: '/images/icons/deployments.svg',
          },
          {
            label: 'Database',
            href: '/products/database',
            description: 'Managed PostgreSQL',
            icon: '/images/icons/database.svg',
          },
        ],
      },
      {
        label: 'Solutions',
        items: [
          {
            label: 'Mobile',
            href: '/mobile',
            description: 'Code on the go',
            icon: '/images/icons/mobile.svg',
          },
          {
            label: 'Security',
            href: '/products/security',
            description: 'Enterprise-grade security',
            icon: '/images/icons/security.svg',
          },
          {
            label: 'Integrations',
            href: '/products/integrations',
            description: 'Connect your tools',
            icon: '/images/icons/integrations.svg',
          },
        ],
      },
    ],
    featured: {
      label: 'See all products',
      href: '/products',
      description: 'Explore our complete product suite',
    },
  },
  {
    label: 'Templates',
    href: '/templates',
  },
  {
    label: 'Gallery',
    href: '/gallery',
  },
  {
    label: 'Customers',
    href: '/customers',
  },
  {
    label: 'Pricing',
    href: '/pricing',
  },
  {
    label: 'Resources',
    dropdown: [
      {
        label: 'Learn',
        items: [
          {
            label: 'Help Center',
            href: '/help',
            description: 'Get support and answers',
          },
          {
            label: 'Documentation',
            href: 'https://docs.replit.com',
            description: 'Technical guides and API docs',
            external: true,
          },
          {
            label: 'Tutorials',
            href: '/tutorials',
            description: 'Step-by-step learning',
          },
        ],
      },
      {
        label: 'Community',
        items: [
          {
            label: 'Blog',
            href: '/news',
            description: 'Latest news and updates',
          },
          {
            label: 'Use Cases',
            href: '/usecases',
            description: 'See what others are building',
          },
          {
            label: 'Community',
            href: 'https://replit.com/discord',
            description: 'Join our Discord',
            external: true,
          },
        ],
      },
      {
        label: 'Company',
        items: [
          {
            label: 'About',
            href: '/about',
            description: 'Our mission and team',
          },
          {
            label: 'Careers',
            href: '/careers',
            description: 'Join the team',
          },
          {
            label: 'Brand Kit',
            href: '/brandkit',
            description: 'Logos and guidelines',
          },
        ],
      },
    ],
  },
] as const;

/**
 * Secondary navigation items (CTAs)
 * Typically displayed in the header alongside primary navigation
 */
export const SECONDARY_NAV = [
  {
    label: 'Log in',
    href: '/login',
    variant: 'ghost' as const,
  },
  {
    label: 'Sign up',
    href: '/signup',
    variant: 'default' as const,
  },
] as const;

/**
 * Mobile-specific navigation
 * Flattened structure optimized for mobile navigation
 */
export const MOBILE_NAV = [
  // Quick actions
  {
    label: 'Sign up',
    href: '/signup',
    highlight: true,
  },
  {
    label: 'Log in',
    href: '/login',
  },
  
  // Main navigation
  { label: 'Products', href: '/products' },
  { label: 'Templates', href: '/templates' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Customers', href: '/customers' },
  { label: 'Pricing', href: '/pricing' },
  
  // Resources
  { label: 'Help Center', href: '/help' },
  { label: 'Documentation', href: 'https://docs.replit.com', external: true },
  { label: 'Blog', href: '/news' },
  { label: 'About', href: '/about' },
  { label: 'Careers', href: '/careers' },
] as const;

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

/**
 * Type exports for TypeScript inference
 */
export type PrimaryNavItem = typeof PRIMARY_NAV[number];
export type SecondaryNavItem = typeof SECONDARY_NAV[number];
export type MobileNavItem = typeof MOBILE_NAV[number];
