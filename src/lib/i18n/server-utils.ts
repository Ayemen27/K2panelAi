
import { Tolgee, DevTools } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';
import { DEFAULT_LOCALE, FALLBACK_LOCALE, SUPPORTED_LOCALES, NAMESPACES, type SupportedLocale, type Namespace } from './constants';
import { loadAllNamespaces } from './namespace-loader';

export async function loadStaticDataForProvider(
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<Record<string, any>> {
  const locales = [locale, FALLBACK_LOCALE];
  const uniqueLocales = Array.from(new Set(locales));

  const results = await Promise.allSettled(
    uniqueLocales.map(async (loc) => {
      try {
        const data = await loadAllNamespaces(loc, NAMESPACES);
        return { locale: loc, data };
      } catch (error) {
        console.error(`[loadStaticDataForProvider] Failed to load namespaces for ${loc}:`, error);
        return { locale: loc, data: {} };
      }
    })
  );

  const staticData: Record<string, any> = {};

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      const { locale: loc, data } = result.value;
      staticData[loc] = data;
    } else {
      console.error('[loadStaticDataForProvider] Promise rejected:', result.reason);
    }
  });

  uniqueLocales.forEach((loc) => {
    if (!staticData[loc]) {
      staticData[loc] = {};
    }
  });

  return staticData;
}

export async function getServerTranslations(
  locale: SupportedLocale = DEFAULT_LOCALE,
  namespaces: string[] = ['common']
) {
  const staticData = await loadStaticDataForProvider(locale);
  
  const wrappedStaticData: Record<string, () => Promise<any>> = {};
  Object.keys(staticData).forEach((loc) => {
    wrappedStaticData[loc] = async () => staticData[loc];
  });

  const tolgee = Tolgee()
    .use(FormatIcu())
    .init({
      language: locale,
      availableLanguages: [...SUPPORTED_LOCALES],
      apiUrl: process.env.NEXT_PUBLIC_TOLGEE_API_URL || '',
      apiKey: process.env.TOLGEE_API_KEY || process.env.NEXT_PUBLIC_TOLGEE_API_KEY || '',
      defaultNs: 'common',
      ns: namespaces,
      fallbackNs: 'common',
      staticData: wrappedStaticData,
    });

  await tolgee.run();

  const t = tolgee.t;

  return { t, tolgee };
}

export function getLocaleFromPath(pathname: string): SupportedLocale {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (SUPPORTED_LOCALES.includes(firstSegment as SupportedLocale)) {
    return firstSegment as SupportedLocale;
  }
  
  return DEFAULT_LOCALE;
}

export function getLocaleFromCookie(cookieValue: string | undefined): SupportedLocale | null {
  if (!cookieValue) return null;
  
  if (SUPPORTED_LOCALES.includes(cookieValue as SupportedLocale)) {
    return cookieValue as SupportedLocale;
  }
  
  return null;
}

interface LanguagePreference {
  locale: string;
  quality: number;
}

export function getLocaleFromAcceptLanguage(acceptLanguage: string | null): SupportedLocale | null {
  if (!acceptLanguage) return null;
  
  const preferences: LanguagePreference[] = acceptLanguage
    .split(',')
    .map(lang => {
      const [locale, qualityStr] = lang.split(';').map(s => s.trim());
      const quality = qualityStr?.startsWith('q=') 
        ? parseFloat(qualityStr.substring(2)) 
        : 1.0;
      
      return {
        locale: locale.toLowerCase().substring(0, 2),
        quality: isNaN(quality) ? 0 : quality,
      };
    })
    .sort((a, b) => b.quality - a.quality);
  
  for (const pref of preferences) {
    if (SUPPORTED_LOCALES.includes(pref.locale as SupportedLocale)) {
      return pref.locale as SupportedLocale;
    }
  }
  
  return null;
}

export function resolveLocale({
  pathname,
  cookie,
  acceptLanguage,
}: {
  pathname?: string;
  cookie?: string;
  acceptLanguage?: string | null;
}): SupportedLocale {
  if (pathname) {
    const pathLocale = getLocaleFromPath(pathname);
    if (pathLocale !== DEFAULT_LOCALE) return pathLocale;
  }
  
  if (cookie) {
    const cookieLocale = getLocaleFromCookie(cookie);
    if (cookieLocale) return cookieLocale;
  }
  
  if (acceptLanguage) {
    const headerLocale = getLocaleFromAcceptLanguage(acceptLanguage);
    if (headerLocale) return headerLocale;
  }
  
  return DEFAULT_LOCALE;
}
