import type {Metadata} from 'next';

import {CategoryFilters} from '@/components/CategoryFilters';
import {ProjectGrid} from '@/components/ProjectGrid';
import {dedupeCategories, normalizeCategoryValue} from '@/lib/categories';
import {sanityFetch} from '@/lib/sanity.client';
import {homePageQuery, projectsQuery} from '@/lib/sanity.queries';
import {buildMetadata} from '@/lib/seo';
import type {HomePage, ProjectCard} from '@/lib/types';

export async function generateMetadata(): Promise<Metadata> {
  const home = await sanityFetch<HomePage>(homePageQuery);

  return buildMetadata({
    seo: home?.seo,
    fallbackTitle: 'Home | Clay + Motion Studio',
    fallbackDescription: 'Colorful ceramic and animation projects.',
    path: '/'
  });
}

export default async function Home({
  searchParams
}: {
  searchParams?: Promise<{category?: string}>;
}) {
  const [home, projects] = await Promise.all([
    sanityFetch<HomePage>(homePageQuery),
    sanityFetch<ProjectCard[]>(projectsQuery)
  ]);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const activeCategory = resolvedSearchParams?.category;
  const normalizedActiveCategory = activeCategory ? normalizeCategoryValue(activeCategory) : undefined;
  const allProjects = projects || [];
  const allCategories = dedupeCategories(allProjects.flatMap((project) => project.categories || [])).sort(
    (a, b) => a.localeCompare(b)
  );
  const filteredProjects = normalizedActiveCategory
    ? allProjects.filter((project) =>
        (project.categories || []).some(
          (category) => normalizeCategoryValue(category) === normalizedActiveCategory
        )
      )
    : allProjects;

  return (
    <>
      <section className="hero">
        <h1>{home?.headline}</h1>
        {
        home?.intro &&(
                  <p>{home?.intro}</p>

        )
        }

      </section>
      <CategoryFilters categories={allCategories} activeCategory={activeCategory} />
      <ProjectGrid projects={filteredProjects} />
    </>
  );
}
