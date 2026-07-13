import {createClient} from 'next-sanity';

import {sanityApiVersion, sanityDataset, sanityProjectId} from '@/sanity/env';

export const hasSanityConfig = Boolean(sanityProjectId && sanityDataset);

export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  // Use Sanity's edge-cached CDN for reads (cheaper + faster than the raw API).
  useCdn: true,
  perspective: 'published',
  token: process.env.SANITY_API_READ_TOKEN
});

// Single cache tag lets the Sanity webhook revalidate everything on content change.
export const SANITY_CACHE_TAG = 'sanity';

export async function sanityFetch<T>(query: string, params?: Record<string, unknown>) {
  if (!hasSanityConfig) {
    return null;
  }

  try {
    return await sanityClient.fetch<T>(query, params || {}, {
      next: {
        // No time-based revalidation: content is cached indefinitely and only
        // refreshes when the /api/revalidate webhook fires or a new build deploys.
        // This keeps ISR writes tied strictly to real content changes / deploys.
        revalidate: false,
        tags: [SANITY_CACHE_TAG]
      }
    });
  } catch {
    return null;
  }
}
