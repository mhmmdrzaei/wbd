'use client';

// Custom next/image loader: resize via Sanity's image CDN instead of Vercel's
// image optimizer. This keeps image transforms off Vercel (fewer edge requests
// and no image-optimization usage) while still serving right-sized images.
type LoaderArgs = {
  src: string;
  width: number;
  quality?: number;
};

export default function sanityImageLoader({src, width, quality}: LoaderArgs) {
  // Non-Sanity sources (e.g. local assets) are returned untouched.
  if (!src.startsWith('https://cdn.sanity.io/')) {
    return src;
  }

  const url = new URL(src);
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality || 75));
  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', 'max');
  return url.toString();
}
