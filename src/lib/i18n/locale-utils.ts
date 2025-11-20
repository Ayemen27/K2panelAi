import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type SupportedLocale } from './constants';

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
