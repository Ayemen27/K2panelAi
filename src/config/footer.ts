/**
 * Footer Configuration
 * 
 * Defines footer structure, links, and content with i18n support.
 * Includes columns, social links, and newsletter signup.
 */

import { SOCIAL_LINKS, COMPANY_INFO } from './site';

/**
 * Footer link interface
 */
export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  badge?: string;
}

/**
 * Footer section/column interface
 */
export interface FooterSection {
  title: string;
  links: FooterLink[];
}

type TranslateFn = (key: string) => string;

/**
 * Get footer columns with translations
 */
export function getFooterColumns(t: TranslateFn): FooterSection[] {
  return [
    {
      title: t('footer.product.title'),
      links: [
        { label: t('footer.product.agent'), href: '/products/agent' },
        { label: t('footer.product.deployments'), href: '/products/deployments' },
        { label: t('footer.product.database'), href: '/products/database' },
        { label: t('footer.product.mobile'), href: '/mobile' },
        { label: t('footer.product.security'), href: '/products/security' },
        { label: t('footer.product.integrations'), href: '/products/integrations' },
        { label: t('footer.product.pricing'), href: '/pricing' },
        { label: t('footer.product.templates'), href: '/templates' },
      ],
    },
    {
      title: t('footer.resources.title'),
      links: [
        { label: t('footer.resources.helpCenter'), href: '/help' },
        { label: t('footer.resources.documentation'), href: 'https://docs.k2panel.online', external: true },
        { label: t('footer.resources.tutorials'), href: '/tutorials' },
        { label: t('footer.resources.blog'), href: '/news' },
        { label: t('footer.resources.community'), href: 'https://k2panel.online/discord', external: true },
        { label: t('footer.resources.gallery'), href: '/gallery' },
        { label: t('footer.resources.usecases'), href: '/usecases' },
        { label: t('footer.resources.customers'), href: '/customers' },
      ],
    },
    {
      title: t('footer.company.title'),
      links: [
        { label: t('footer.company.about'), href: '/about' },
        { label: t('footer.company.careers'), href: '/careers' },
        { label: t('footer.company.brandKit'), href: '/brandkit' },
        { label: t('footer.company.press'), href: '/press' },
        { label: t('footer.company.contact'), href: '/contact' },
        { label: t('footer.company.status'), href: 'https://status.k2panel.online', external: true },
      ],
    },
    {
      title: t('footer.legal.title'),
      links: [
        { label: t('footer.legal.terms'), href: '/terms' },
        { label: t('footer.legal.privacy'), href: '/privacy-policy' },
        { label: t('footer.legal.dpa'), href: '/dpa' },
        { label: t('footer.legal.commercial'), href: '/commercial-agreement' },
        { label: t('footer.legal.cookies'), href: '/cookies' },
        { label: t('footer.legal.security'), href: '/security' },
      ],
    },
  ];
}

/**
 * Get newsletter configuration with translations
 */
export function getNewsletterConfig(t: TranslateFn) {
  return {
    title: t('footer.newsletter.title'),
    description: t('footer.newsletter.description'),
    placeholder: t('footer.newsletter.placeholder'),
    buttonText: t('footer.newsletter.button'),
    successMessage: t('footer.newsletter.success'),
    errorMessage: t('footer.newsletter.error'),
    endpoint: '/api/newsletter/subscribe',
    privacyNote: t('footer.newsletter.privacyNote'),
    privacyLinkText: t('footer.newsletter.privacyLink'),
    privacyLinkHref: '/privacy-policy',
  };
}

/**
 * Footer social links (no translation needed - icons only)
 */
export const FOOTER_SOCIAL = [
  {
    platform: 'Twitter',
    url: SOCIAL_LINKS.twitter.url,
    icon: 'twitter',
  },
  {
    platform: 'GitHub',
    url: SOCIAL_LINKS.github.url,
    icon: 'github',
  },
  {
    platform: 'LinkedIn',
    url: SOCIAL_LINKS.linkedin.url,
    icon: 'linkedin',
  },
  {
    platform: 'Discord',
    url: SOCIAL_LINKS.discord.url,
    icon: 'discord',
  },
  {
    platform: 'YouTube',
    url: SOCIAL_LINKS.youtube.url,
    icon: 'youtube',
  },
] as const;

/**
 * Get footer bottom section with translations
 */
export function getFooterBottom(t: TranslateFn) {
  return {
    copyright: t('footer.copyright'),
    links: [
      { label: t('footer.bottom.terms'), href: '/terms' },
      { label: t('footer.bottom.privacy'), href: '/privacy-policy' },
      { label: t('footer.bottom.security'), href: '/security' },
    ],
  };
}

/**
 * Get footer CTA with translations
 */
export function getFooterCTA(t: TranslateFn) {
  return {
    enabled: true,
    title: t('footer.cta.title'),
    description: t('footer.cta.description'),
    primaryButton: {
      label: t('footer.cta.primaryButton'),
      href: '/signup',
    },
    secondaryButton: {
      label: t('footer.cta.secondaryButton'),
      href: '/contact',
    },
  };
}

/**
 * Type exports for TypeScript inference
 */
export type FooterSocialLink = typeof FOOTER_SOCIAL[number];
