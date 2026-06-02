'use client';

import Image from 'next/image';
import {useMemo, useState} from 'react';

import type {SanityImage} from '@/lib/types';

type Props = {
  title: string;
  images: SanityImage[];
};

export function ShopProductGallery({title, images}: Props) {
  const cleanedImages = useMemo(() => images.filter((image) => image?.asset?.url), [images]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const selectedImage = cleanedImages[selectedIndex];
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
      <div className="shop-product-gallery">
        <button
          type="button"
          className="shop-product-main"
          onClick={() => setLightboxIndex(selectedIndex)}
          aria-label={`Open ${title} image ${selectedIndex + 1}`}
        >
          <Image
            src={selectedImage.asset?.url || ''}
            alt={`${title} image ${selectedIndex + 1}`}
            width={selectedImage.asset?.metadata?.dimensions?.width || 1600}
            height={selectedImage.asset?.metadata?.dimensions?.height || 1200}
            sizes="(max-width: 960px) 100vw, 60vw"
            className="shop-product-main-image"
          />
        </button>

        {cleanedImages.length > 1 ? (
          <div className="shop-product-thumbs" aria-label="Product image thumbnails">
            {cleanedImages.map((image, index) => (
              <button
                type="button"
                key={`${title}-thumb-${index}`}
                className={index === selectedIndex ? 'shop-product-thumb shop-product-thumb--active' : 'shop-product-thumb'}
                onClick={() => setSelectedIndex(index)}
                aria-label={`View ${title} image ${index + 1}`}
              >
                <Image
                  src={image.asset?.url || ''}
                  alt={`${title} thumbnail ${index + 1}`}
                  width={image.asset?.metadata?.dimensions?.width || 400}
                  height={image.asset?.metadata?.dimensions?.height || 300}
                  sizes="120px"
                  className="shop-product-thumb-image"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

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
              {lightboxIndex > 0 ? (
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
              {lightboxIndex < cleanedImages.length - 1 ? (
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
