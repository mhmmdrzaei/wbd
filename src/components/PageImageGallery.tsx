'use client';

import Image from 'next/image';
import {useMemo, useState} from 'react';

import type {SanityImage} from '@/lib/types';

type Props = {
  title: string;
  images: SanityImage[];
};

export function PageImageGallery({title, images}: Props) {
  const cleanedImages = useMemo(() => images.filter((image) => image?.asset?.url), [images]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const activeImage = lightboxIndex !== null ? cleanedImages[lightboxIndex] : null;

  if (!cleanedImages.length) {
    return null;
  }

  function showPreviousImage() {
    if (lightboxIndex === null || lightboxIndex <= 0) {
      return;
    }
    setLightboxIndex(lightboxIndex - 1);
  }

  function showNextImage() {
    if (lightboxIndex === null || lightboxIndex >= cleanedImages.length - 1) {
      return;
    }
    setLightboxIndex(lightboxIndex + 1);
  }

  return (
    <>
      <section className="page-image-masonry" aria-label="Images">
        {cleanedImages.map((image, index) => (
          <button
            type="button"
            key={(image._key as string) || image.asset?.url || index}
            className="page-image-item"
            onClick={() => setLightboxIndex(index)}
            aria-label={`Open ${title} image ${index + 1}`}
          >
            <Image
              src={image.asset?.url || ''}
              alt={`${title} image ${index + 1}`}
              width={image.asset?.metadata?.dimensions?.width || 1200}
              height={image.asset?.metadata?.dimensions?.height || 900}
              sizes="(max-width: 960px) 50vw, 33vw"
              loading="lazy"
              className="page-image"
            />
          </button>
        ))}
      </section>

      {activeImage?.asset?.url ? (
        <div className="project-lightbox" role="dialog" aria-modal="true" aria-label={`${title} image viewer`}>
          <button
            type="button"
            className="project-lightbox-backdrop"
            aria-label="Close image viewer"
            onClick={() => setLightboxIndex(null)}
          />
          <div className="project-lightbox-content">
            <button type="button" className="project-lightbox-close" onClick={() => setLightboxIndex(null)}>
              Close
            </button>
            <div className="project-lightbox-image-wrap">
              {lightboxIndex !== null && lightboxIndex > 0 ? (
                <button
                  type="button"
                  className="project-lightbox-nav project-lightbox-nav--prev"
                  onClick={showPreviousImage}
                  aria-label="Previous image"
                >
                  Prev
                </button>
              ) : null}
              <Image src={activeImage.asset.url} alt={title} fill sizes="90vw" className="project-lightbox-image" />
              {lightboxIndex !== null && lightboxIndex < cleanedImages.length - 1 ? (
                <button
                  type="button"
                  className="project-lightbox-nav project-lightbox-nav--next"
                  onClick={showNextImage}
                  aria-label="Next image"
                >
                  Next
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
