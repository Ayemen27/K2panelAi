import { headers } from 'next/headers';
import { cn } from '@/lib/utils';
import { getServerTranslations } from '@/lib/i18n/server-utils';
import { DEFAULT_LOCALE, type SupportedLocale } from '@/lib/i18n/constants';
import {
  getFooterColumns,
  getFooterCTA,
  getFooterBottom,
  getNewsletterConfig,
} from '@/config/footer';
import {
  FooterCTA,
  FooterColumn,
  FooterNewsletter,
  FooterSocial,
  FooterBottom,
} from './FooterClient';

interface FooterProps {
  className?: string;
}

export async function Footer({ className }: FooterProps) {
  const headersList = await headers();
  const locale = (headersList.get('x-locale') as SupportedLocale) || DEFAULT_LOCALE;
  
  const { t } = await getServerTranslations(locale, ['layout']);

  const footerColumns = getFooterColumns(t);
  const footerCTA = getFooterCTA(t);
  const footerBottom = getFooterBottom(t);
  const newsletterConfig = getNewsletterConfig(t);

  return (
    <footer className={cn('w-full bg-background', className)} role="contentinfo">
      <FooterCTA 
        enabled={footerCTA.enabled}
        title={footerCTA.title}
        description={footerCTA.description}
        primaryButton={footerCTA.primaryButton}
        secondaryButton={footerCTA.secondaryButton}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerColumns.map((section) => (
              <FooterColumn key={section.title} section={section} />
            ))}
          </div>
          
          <div className="lg:col-span-4">
            <FooterNewsletter config={newsletterConfig} />
            <div className="mt-8">
              <FooterSocial />
            </div>
          </div>
        </div>
      </div>
      
      <FooterBottom 
        copyright={footerBottom.copyright}
        links={footerBottom.links}
      />
    </footer>
  );
}
