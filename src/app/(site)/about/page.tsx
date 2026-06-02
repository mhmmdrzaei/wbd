import Image from 'next/image';
import type {Metadata} from 'next';

import {RichText} from '@/components/RichText';
import {sanityFetch} from '@/lib/sanity.client';
import {aboutPageQuery} from '@/lib/sanity.queries';
import {buildMetadata} from '@/lib/seo';
import type {AboutPage} from '@/lib/types';

export async function generateMetadata(): Promise<Metadata> {
  const about = await sanityFetch<AboutPage>(aboutPageQuery);

  return buildMetadata({
    seo: about?.seo,
    fallbackTitle: 'About | Clay + Motion Studio',
    fallbackDescription: 'About the artist and downloadable CV.',
    path: '/about'
  });
}

export default async function AboutPage() {
  const about = await sanityFetch<AboutPage>(aboutPageQuery);

  return (
    <article>
      <h1 className="page-title">{about?.title || 'About'}</h1>
      <section className="about-layout">
        {about?.portrait?.asset?.url ? (
          <div className="about-image">
            <Image
              src={about.portrait.asset.url}
              alt="Artist portrait"
              width={about.portrait.asset.metadata?.dimensions?.width || 900}
              height={about.portrait.asset.metadata?.dimensions?.height || 1100}
              sizes="(max-width: 960px) 100vw, 420px"
              className="about-image-media"
            />
          </div>
        ) : null}

        <div>
          <RichText value={about?.body} />
          {about?.email || about?.instagramUrl || about?.cvUrl ? (
            <div className="about-links">
              {about.email ? (
                <a className="cv-link" href={`mailto:${about.email}`}>
                  {about.email}
                </a>
              ) : null}
              {about.instagramUrl ? (
                <a className="cv-link" href={about.instagramUrl} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              ) : null}
              {about?.cvUrl ? (
                <a className="cv-link" href={about.cvUrl} target="_blank" rel="noreferrer">
                  Download CV (PDF)
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </article>
  );
}
