'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getTypographyClass } from '@/lib/design-system/typography';
import {
  FOOTER_SOCIAL,
  type FooterSection,
  type FooterSocialLink,
} from '@/config/footer';
import { Icons } from '@/components/ui/icons';

interface FooterCTAProps {
  className?: string;
  enabled: boolean;
  title: string;
  description: string;
  primaryButton: { label: string; href: string };
  secondaryButton: { label: string; href: string };
}

export function FooterCTA({ className, enabled, title, description, primaryButton, secondaryButton }: FooterCTAProps) {
  if (!enabled) return null;

  return (
    <div className={cn('border-b border-border', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={cn(getTypographyClass('headline-xl'), 'mb-4')}>
            {title}
          </h2>
          <p className={cn(getTypographyClass('body-lg'), 'text-muted-foreground mb-8')}>
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={primaryButton.href}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              {primaryButton.label} →
            </Link>
            <Link
              href={secondaryButton.href}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg font-semibold hover:bg-accent transition-colors"
            >
              {secondaryButton.label}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FooterColumnProps {
  section: FooterSection;
  className?: string;
}

export function FooterColumn({ section, className }: FooterColumnProps) {
  return (
    <div className={className}>
      <h3 className={cn(getTypographyClass('caption-lg'), 'mb-4 font-semibold')}>
        {section.title}
      </h3>
      <ul className="space-y-3">
        {section.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className={cn(
                getTypographyClass('body-sm'),
                'text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2'
              )}
            >
              {link.label}
              {link.badge && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                  {link.badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface FooterNewsletterProps {
  className?: string;
  config: {
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
    privacyNote: string;
    privacyLinkText: string;
    privacyLinkHref: string;
  };
}

export function FooterNewsletter({ className, config }: FooterNewsletterProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    console.log('Newsletter signup:', email);
  };

  return (
    <div className={className}>
      <h3 className={cn(getTypographyClass('caption-lg'), 'mb-4 font-semibold')}>
        {config.title}
      </h3>
      <p className={cn(getTypographyClass('body-sm'), 'text-muted-foreground mb-4')}>
        {config.description}
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            name="email"
            placeholder={config.placeholder}
            required
            aria-label="Email address"
            className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            {config.buttonText}
          </button>
        </div>
        <p className={cn(getTypographyClass('caption-sm'), 'text-muted-foreground')}>
          {config.privacyNote}{' '}
          <Link
            href={config.privacyLinkHref}
            className="text-foreground hover:underline"
          >
            {config.privacyLinkText}
          </Link>
        </p>
      </form>
    </div>
  );
}

interface FooterSocialProps {
  className?: string;
}

export function FooterSocial({ className }: FooterSocialProps) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {FOOTER_SOCIAL.map((social: FooterSocialLink) => {
        const Icon = Icons[social.icon as keyof typeof Icons];
        return (
          <Link
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.platform}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-accent hover:border-foreground/20 transition-colors"
          >
            <Icon className="w-5 h-5" />
          </Link>
        );
      })}
    </div>
  );
}

interface FooterBottomProps {
  className?: string;
  copyright: string;
  links: Array<{ label: string; href: string }>;
}

export function FooterBottom({ className, copyright, links }: FooterBottomProps) {
  return (
    <div className={cn('border-t border-border', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className={cn(getTypographyClass('body-sm'), 'text-muted-foreground')}>
            {copyright}
          </p>
          <nav className="flex items-center gap-6" aria-label="Footer legal links">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  getTypographyClass('body-sm'),
                  'text-muted-foreground hover:text-foreground transition-colors'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
