
'use client';

import { TolgeeProvider as TolgeeReactProvider, Tolgee, DevTools } from '@tolgee/react';
import { FormatIcu } from '@tolgee/format-icu';
import { ReactNode, useMemo } from 'react';
import { SupportedLocale, DEFAULT_LOCALE, FALLBACK_LOCALE, SUPPORTED_LOCALES, NAMESPACES } from '@/lib/i18n/constants';

export interface TolgeeProviderProps {
  children: ReactNode;
  locale: SupportedLocale;
  staticData: Record<string, any>;
}

export function TolgeeProvider({ children, locale, staticData }: TolgeeProviderProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const tolgee = useMemo(() => {
    const instance = Tolgee()
      .use(FormatIcu());

    if (isDevelopment) {
      instance.use(DevTools());
    }

    return instance.init({
      language: locale || DEFAULT_LOCALE,
      fallbackLanguage: FALLBACK_LOCALE,
      availableLanguages: [...SUPPORTED_LOCALES],
      defaultNs: 'common',
      ns: [...NAMESPACES],
      fallbackNs: 'common',
      staticData,
      // Don't fetch from API, use only static data
      apiUrl: undefined,
      apiKey: undefined,
    });
  }, [locale, isDevelopment, staticData]);

  return (
    <TolgeeReactProvider 
      tolgee={tolgee} 
      fallback="..."
      ssr={{ 
        language: locale,
        staticData 
      }}
    >
      {children}
    </TolgeeReactProvider>
  );
}
