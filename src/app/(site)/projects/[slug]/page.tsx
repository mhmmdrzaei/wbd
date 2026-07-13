import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';

import {ProjectMediaGallery} from '@/components/ProjectMediaGallery';
import {RichText} from '@/components/RichText';
import {dedupeCategories, formatCategoryLabel} from '@/lib/categories';
import {sanityFetch} from '@/lib/sanity.client';
import {projectBySlugQuery, projectSlugsQuery} from '@/lib/sanity.queries';
import {buildMetadata} from '@/lib/seo';
import type {Project} from '@/lib/types';

export async function generateStaticParams() {
  const projects = (await sanityFetch<Array<{slug: string}>>(projectSlugsQuery)) || [];
  return projects.filter((project) => project.slug).map((project) => ({slug: project.slug}));
}

export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const {slug} = await params;
  const project = await sanityFetch<Project>(projectBySlugQuery, {slug});

  if (!project) {
    return {title: 'Project Not Found'};
  }

  return buildMetadata({
    seo: project.seo,
    fallbackTitle: `${project.title} | Project`,
    fallbackDescription: project.summary || `${project.title} from ${project.year}`,
    path: `/projects/${project.slug}`
  });
}

export default async function ProjectPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const project = await sanityFetch<Project>(projectBySlugQuery, {slug});

  if (!project) {
    notFound();
  }

  return (
    <article className="project-view">
      <header>
        <p className="project-year">{project.year}</p>
        <h1 className="page-title">{project.title}</h1>
        {project.categories?.length ? (
          <div className="project-detail-categories">
            {dedupeCategories(project.categories).map((category) => (
              <Link
                key={`${project._id}-${category}`}
                href={`/?category=${encodeURIComponent(formatCategoryLabel(category))}`}
                className="project-category-pill"
              >
                {formatCategoryLabel(category)}
              </Link>
            ))}
          </div>
        ) : null}
        {project.summary ? <p className="page-intro">{project.summary}</p> : null}
      </header>

      {project.media?.length ? <ProjectMediaGallery title={project.title} media={project.media} /> : null}

      <RichText value={project.body} />
    </article>
  );
}
