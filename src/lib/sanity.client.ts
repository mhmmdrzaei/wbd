import {createClient} from 'next-sanity';

import {sanityApiVersion, sanityDataset, sanityProjectId} from '@/sanity/env';

export const hasSanityConfig = Boolean(sanityProjectId && sanityDataset);

export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN
});

export async function sanityFetch<T>(query: string, params?: Record<string, unknown>) {
  if (!hasSanityConfig) {
    return null;
  }

  try {
    return await sanityClient.fetch<T>(query, params || {});
  } catch {
    return null;
  }
}
