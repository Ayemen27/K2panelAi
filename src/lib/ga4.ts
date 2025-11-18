import { retryWithBackoff } from './analyticsRetry';

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

let ga4Initialized = false;
let ga4ReadyPromise: Promise<void> | null = null;

export async function initialize(measurementId: string): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!measurementId) {
    console.warn('GA4 Measurement ID not found');
    return;
  }
  if (ga4Initialized) return;

  await retryWithBackoff(async () => {
    return new Promise<void>((resolve, reject) => {
      try {
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        script1.onload = () => {
          window.dataLayer = window.dataLayer || [];
          window.gtag = function gtag() {
            window.dataLayer?.push(arguments);
          };
          window.gtag('js', new Date());
          window.gtag('config', measurementId, {
            page_path: window.location.pathname,
          });
          ga4Initialized = true;
          resolve();
        };
        script1.onerror = () => reject(new Error('Failed to load GA4 script'));
        document.head.appendChild(script1);
      } catch (error) {
        reject(error);
      }
    });
  });
}

export function waitUntilReady(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (!GA_MEASUREMENT_ID) {
    return Promise.resolve();
  }

  if (ga4ReadyPromise) {
    return ga4ReadyPromise;
  }

  ga4ReadyPromise = new Promise((resolve) => {
    const checkGA4 = () => {
      if (window.gtag && ga4Initialized) {
        resolve();
      } else {
        setTimeout(checkGA4, 50);
      }
    };
    checkGA4();
  });

  return ga4ReadyPromise;
}

export function pageview(url: string) {
  if (typeof window === 'undefined') return;
  if (!window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

export function event(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  if (!window.gtag) return;

  window.gtag('event', eventName, eventParams);
}
