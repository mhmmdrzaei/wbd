import type {Metadata} from 'next';
import {notFound} from 'next/navigation';

import {PageImageGallery} from '@/components/PageImageGallery';
import {RichText} from '@/components/RichText';
import {sanityFetch} from '@/lib/sanity.client';
import {pageBySlugQuery, pageSlugsQuery} from '@/lib/sanity.queries';
import {buildMetadata} from '@/lib/seo';
import type {Page} from '@/lib/types';

export async function generateStaticParams() {
  const pages = (await sanityFetch<Array<{slug: string}>>(pageSlugsQuery)) || [];
  return pages.filter((page) => page.slug).map((page) => ({slug: page.slug}));
}

export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const {slug} = await params;
  const page = await sanityFetch<Page>(pageBySlugQuery, {slug});

  if (!page) {
    return {title: 'Page Not Found'};
  }

  return buildMetadata({
    seo: page.seo,
    fallbackTitle: `${page.title} | Clay + Motion Studio`,
    fallbackDescription: page.title,
    path: `/pages/${page.slug}`
  });
}

export default async function GenericPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const page = await sanityFetch<Page>(pageBySlugQuery, {slug});

  if (!page) {
    notFound();
  }

  const images = (page.images || []).filter((image) => image?.asset?.url);

  return (
    <article>
      <h1 className="page-title">{page.title}</h1>
      <RichText value={page.body} />
      {images.length ? <PageImageGallery title={page.title} images={images} /> : null}
    </article>
  );
}
