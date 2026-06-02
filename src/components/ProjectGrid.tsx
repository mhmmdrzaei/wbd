import Image from 'next/image';
import Link from 'next/link';

import {dedupeCategories} from '@/lib/categories';
import type {ProjectCard} from '@/lib/types';

type Props = {
  projects: ProjectCard[];
};

export function ProjectGrid({projects}: Props) {
  return (
    <section className="project-grid" aria-label="Projects">
      {projects.map((project) => {
        const imageUrl = project.coverImage?.asset?.url;
        const width = project.coverImage?.asset?.metadata?.dimensions?.width || 1200;
        const height = project.coverImage?.asset?.metadata?.dimensions?.height || 900;

        return (
          <Link className="project-card" key={project._id} href={`/projects/${project.slug}`}>
            <div className="project-image-wrap">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={project.title}
                  width={width}
                  height={height}
                  sizes="(max-width: 720px) 100vw, 50vw"
                  className="project-grid-image"
                />
              ) : (
                <div className="project-image-placeholder" />
              )}
            </div>
            <div className="project-card-content">
              <h3>{project.title}</h3>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
