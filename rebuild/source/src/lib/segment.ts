import { retryWithBackoff } from './analyticsRetry';

export const SEGMENT_WRITE_KEY = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY || '';

let analytics: any = null;
let analyticsPromise: Promise<any> | null = null;
let segmentModule: any = null;

async function loadSegment() {
  if (segmentModule) return segmentModule;
  try {
    segmentModule = await import('@segment/analytics-next');
    return segmentModule;
  } catch (error) {
    console.warn('Segment SDK not available - analytics disabled');
    return null;
  }
}

export async function initialize(writeKey: string): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!writeKey) {
    console.warn('Segment Write Key not found');
    return;
  }
  if (analytics || analyticsPromise) return;

  const segment = await loadSegment();
  if (!segment) return;

  try {
    analyticsPromise = retryWithBackoff(async () => {
      const result = await segment.AnalyticsBrowser.load({ writeKey });
      analytics = result[0];
      return analytics;
    });
    await analyticsPromise;
  } catch (error) {
    console.error('Failed to initialize Segment:', error);
    analyticsPromise = null;
  }
}

export async function waitUntilReady(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (!SEGMENT_WRITE_KEY) {
    return Promise.resolve();
  }

  if (analytics) {
    return Promise.resolve();
  }

  if (analyticsPromise) {
    try {
      await analyticsPromise;
    } catch (error) {
      console.error('Failed to wait for Segment readiness:', error);
    }
  }
}

async function getAnalytics(): Promise<any | null> {
  if (analytics) return analytics;
  if (analyticsPromise) {
    try {
      return await analyticsPromise;
    } catch (error) {
      console.error('Failed to resolve Segment analytics:', error);
      return null;
    }
  }
  return null;
}

export async function page(name?: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  
  const client = await getAnalytics();
  if (!client) return;

  try {
    await client.page(name, properties);
  } catch (error) {
    console.error('Failed to track Segment page:', error);
  }
}

export async function track(eventName: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  
  const client = await getAnalytics();
  if (!client) return;

  try {
    await client.track(eventName, properties);
  } catch (error) {
    console.error('Failed to track Segment event:', error);
  }
}

export async function identify(userId: string, traits?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  
  const client = await getAnalytics();
  if (!client) return;

  try {
    await client.identify(userId, traits);
  } catch (error) {
    console.error('Failed to identify Segment user:', error);
  }
}
