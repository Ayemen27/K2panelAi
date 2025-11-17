'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import * as gtm from '@/lib/gtm';
import * as ga4 from '@/lib/ga4';
import * as amplitude from '@/lib/amplitude';
import * as segment from '@/lib/segment';
import * as datadog from '@/lib/datadog';

interface AnalyticsState {
  initialized: boolean;
  ready: boolean;
}

let analyticsState: AnalyticsState = {
  initialized: false,
  ready: false,
};

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (analyticsState.initialized) return;
    
    const initializeAnalytics = async () => {
      analyticsState.initialized = true;

      const initPromises: Promise<void>[] = [];

      try {
        datadog.initializeDatadog();
      } catch (error) {
        console.error('Datadog initialization failed:', error);
      }

      if (amplitude.AMPLITUDE_API_KEY) {
        initPromises.push(
          amplitude.initialize(amplitude.AMPLITUDE_API_KEY).then(() => {}).catch((error) => {
            console.error('Amplitude initialization failed:', error);
          })
        );
      }

      if (segment.SEGMENT_WRITE_KEY) {
        initPromises.push(
          segment.initialize(segment.SEGMENT_WRITE_KEY).catch((error) => {
            console.error('Segment initialization failed:', error);
          })
        );
      }

      if (ga4.GA_MEASUREMENT_ID) {
        initPromises.push(
          ga4.initialize(ga4.GA_MEASUREMENT_ID).catch((error) => {
            console.error('GA4 initialization failed:', error);
          })
        );
      }

      await Promise.allSettled(initPromises);

      await Promise.all([
        gtm.waitUntilReady().catch(() => {}),
        ga4.waitUntilReady().catch(() => {}),
        segment.waitUntilReady().catch(() => {}),
        amplitude.waitUntilReady().catch(() => {}),
        datadog.waitUntilReady().catch(() => {}),
      ]);

      analyticsState.ready = true;
      setIsReady(true);
      console.log('Analytics fully initialized and ready');
    };

    initializeAnalytics().catch((error) => {
      console.error('Analytics initialization error:', error);
      analyticsState.initialized = false;
    });
  }, []);

  useEffect(() => {
    if (!isReady || !pathname) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    gtm.pageview(url).catch((err) => console.error('GTM pageview failed:', err));
    ga4.pageview(url);
    segment.page(url).catch((err) => console.error('Segment page tracking failed:', err));
    amplitude.trackEvent('Page View', { path: url });
  }, [pathname, searchParams, isReady]);

  return <>{children}</>;
}
