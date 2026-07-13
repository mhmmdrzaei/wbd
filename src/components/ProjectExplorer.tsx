'use client';

import {useSearchParams} from 'next/navigation';
import {useMemo} from 'react';

import {CategoryFilters} from '@/components/CategoryFilters';
import {ProjectGrid} from '@/components/ProjectGrid';
import {normalizeCategoryValue} from '@/lib/categories';
import type {ProjectCard} from '@/lib/types';

type Props = {
  projects: ProjectCard[];
  categories: string[];
};

export function ProjectExplorer({projects, categories}: Props) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || undefined;
  const normalizedActiveCategory = activeCategory ? normalizeCategoryValue(activeCategory) : undefined;

  const filteredProjects = useMemo(() => {
    if (!normalizedActiveCategory) {
      return projects;
    }

    return projects.filter((project) =>
      (project.categories || []).some(
        (category) => normalizeCategoryValue(category) === normalizedActiveCategory
      )
    );
  }, [projects, normalizedActiveCategory]);

  return (
    <>
      <CategoryFilters categories={categories} activeCategory={activeCategory} />
      <ProjectGrid projects={filteredProjects} />
    </>
  );
}
