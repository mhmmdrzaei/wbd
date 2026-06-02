import Image from 'next/image';
import Link from 'next/link';

import type {SanityImage} from '@/lib/types';

type Props = {
  title: string;
  href: string;
  image?: SanityImage;
};

export function ToysShortcut({title, href, image}: Props) {
  const imageUrl = image?.asset?.url;

  return (
    <Link href={href} className="toys-shortcut" aria-label={`Visit ${title}`}>
      {imageUrl ? (
        <span className="toys-shortcut-image">
          <Image
            src={imageUrl}
            alt={title}
            width={image?.asset?.metadata?.dimensions?.width || 400}
            height={image?.asset?.metadata?.dimensions?.height || 400}
            sizes="200px"
            className="toys-shortcut-image-media"
          />
        </span>
      ) : null}
      <span className="toys-shortcut-star" aria-hidden="true" />
      <span className="toys-shortcut-star-label">{title}</span>
    </Link>
  );
}
