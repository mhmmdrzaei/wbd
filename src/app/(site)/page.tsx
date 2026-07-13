import type {Metadata} from 'next';
import {Suspense} from 'react';

import {ProjectExplorer} from '@/components/ProjectExplorer';
import {ProjectGrid} from '@/components/ProjectGrid';
import {ToysShortcut} from '@/components/ToysShortcut';
import {dedupeCategories} from '@/lib/categories';
import {sanityFetch} from '@/lib/sanity.client';
import {homePageQuery, pageBySlugQuery, projectsQuery} from '@/lib/sanity.queries';
import {buildMetadata} from '@/lib/seo';
import type {HomePage, Page, ProjectCard} from '@/lib/types';

export async function generateMetadata(): Promise<Metadata> {
  const home = await sanityFetch<HomePage>(homePageQuery);

  return buildMetadata({
    seo: home?.seo,
    fallbackTitle: 'Home | Clay + Motion Studio',
    fallbackDescription: 'Colorful ceramic and animation projects.',
    path: '/'
  });
}

export default async function Home() {
  const [home, projects, toysPage] = await Promise.all([
    sanityFetch<HomePage>(homePageQuery),
    sanityFetch<ProjectCard[]>(projectsQuery),
    sanityFetch<Page>(pageBySlugQuery, {slug: 'toys'})
  ]);
  const toysImage = toysPage?.images?.find((image) => image?.asset?.url);
  const allProjects = projects || [];
  const allCategories = dedupeCategories(allProjects.flatMap((project) => project.categories || [])).sort(
    (a, b) => a.localeCompare(b)
  );

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h1>{home?.headline}</h1>
          {home?.intro && <p>{home?.intro}</p>}
        </div>
        {toysPage ? (
          <ToysShortcut title={toysPage.title || 'TOYS!'} href="/pages/toys" image={toysImage} />
        ) : null}
      </section>
      <Suspense fallback={<ProjectGrid projects={allProjects} />}>
        <ProjectExplorer projects={allProjects} categories={allCategories} />
      </Suspense>
    </>
  );
}
