import type { Metadata } from "next";
import { getServerTranslations } from '@/lib/i18n/server-utils';
import { getLocale } from '@/lib/i18n/locale-utils';

export const metadata: Metadata = {
  title: "Help - K2Panel",
  description: "Get help with K2Panel",
};

export default async function HelpPage() {
  const locale = getLocale();
  const { t } = await getServerTranslations(locale, ['marketing']);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">{t('help.title')}</h1>
      <p className="text-gray-600">
        {t('help.subtitle')}
      </p>
    </div>
  );
}
