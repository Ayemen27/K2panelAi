import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const isDevelopment = process.env.NODE_ENV === 'development';

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  const message = 'Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable';
  if (isDevelopment) {
    console.warn(`⚠️  ${message}`);
  } else {
    throw new Error(message);
  }
}

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  const message = 'Missing NEXT_PUBLIC_SANITY_DATASET environment variable';
  if (isDevelopment) {
    console.warn(`⚠️  ${message}`);
  } else {
    throw new Error(message);
  }
}

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_READ_TOKEN,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export async function sanityFetch<T = any>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: Record<string, any>;
  tags?: string[];
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate: process.env.NODE_ENV === 'development' ? 30 : 3600,
      tags,
    },
  });
}
