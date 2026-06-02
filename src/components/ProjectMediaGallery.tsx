'use client';

import Image from 'next/image';
import {useState} from 'react';

import type {ProjectMediaImage, VideoEmbed} from '@/lib/types';

type MediaItem = ProjectMediaImage | VideoEmbed;

type Props = {
  title: string;
  media: MediaItem[];
};

function getEmbedUrl(url?: string) {
  if (!url) {
    return null;
  }

  if (url.includes('youtube.com/watch')) {
    const videoId = new URL(url).searchParams.get('v');
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }

  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }

  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
  }

  return null;
}

export function ProjectMediaGallery({title, media}: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const imageIndexes = media.reduce<number[]>((indexes, item, index) => {
    if (item._type !== 'videoEmbed') {
      indexes.push(index);
    }

    return indexes;
  }, []);
  const activeMedia = activeIndex !== null ? media[activeIndex] : null;
  const activeImage = activeMedia && activeMedia._type !== 'videoEmbed' ? activeMedia : null;
  const activeImagePosition = activeIndex !== null ? imageIndexes.indexOf(activeIndex) : -1;

  function showPreviousImage() {
    if (activeImagePosition <= 0) {
      return;
    }

    setActiveIndex(imageIndexes[activeImagePosition - 1] ?? null);
  }

  function showNextImage() {
    if (activeImagePosition === -1 || activeImagePosition >= imageIndexes.length - 1) {
      return;
    }

    setActiveIndex(imageIndexes[activeImagePosition + 1] ?? null);
  }

  return (
    <>
      <section className="project-gallery">
        {media.map((item, index) => {
          if (item._type === 'videoEmbed') {
            const embedUrl = getEmbedUrl(item.url);

            return (
              <div className="project-gallery-item project-gallery-item--video" key={`${title}-video-${index}`}>
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={item.title || `${title} video ${index + 1}`}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="project-video-fallback">Invalid video URL</div>
                )}
              </div>
            );
          }

          const imageUrl = item.asset?.url;
          const width = item.asset?.metadata?.dimensions?.width || 1400;
          const height = item.asset?.metadata?.dimensions?.height || 1050;

          return (
            <button
              type="button"
              className="project-gallery-item project-gallery-item--button"
              key={`${title}-image-${index}`}
              onClick={() => setActiveIndex(index)}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={`${title} image ${index + 1}`}
                  width={width}
                  height={height}
                  sizes="(max-width: 560px) 100vw, 50vw"
                  loading="lazy"
                  className="project-gallery-image"
                />
              ) : (
                <div className="project-video-fallback">Missing image</div>
              )}
            </button>
          );
        })}
      </section>

      {activeImage?.asset?.url ? (
        <div className="project-lightbox" role="dialog" aria-modal="true" aria-label={`${title} image viewer`}>
          <button
            type="button"
            className="project-lightbox-backdrop"
            aria-label="Close image viewer"
            onClick={() => setActiveIndex(null)}
          />
          <div className="project-lightbox-content">
            <button type="button" className="project-lightbox-close" onClick={() => setActiveIndex(null)}>
              Close
            </button>
            <div className="project-lightbox-image-wrap">
              {activeImagePosition > 0 ? (
                <button
                  type="button"
                  className="project-lightbox-nav project-lightbox-nav--prev"
                  onClick={showPreviousImage}
                  aria-label="Previous image"
                >
                  Prev
                </button>
              ) : null}
              <Image
                src={activeImage.asset.url}
                alt={title}
                fill
                sizes="90vw"
                className="project-lightbox-image"
              />
              {activeImagePosition < imageIndexes.length - 1 ? (
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
