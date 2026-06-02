import type {Metadata} from 'next';

import type {Seo} from '@/lib/types';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export function buildMetadata(params: {
  seo?: Seo;
  fallbackTitle: string;
  fallbackDescription: string;
  path: string;
}): Metadata {
  const {seo, fallbackTitle, fallbackDescription, path} = params;

  const title = seo?.metaTitle || fallbackTitle;
  const description = seo?.metaDescription || fallbackDescription;
  const image = seo?.ogImage?.asset?.url;
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    robots: seo?.noIndex ? {index: false, follow: false} : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: fallbackTitle,
      images: image ? [{url: image}] : undefined,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined
    }
  };
}
