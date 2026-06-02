import Link from 'next/link';

type Props = {
  tags: string[];
  activeTag?: string;
};

export function ShopTagFilters({tags, activeTag}: Props) {
  if (!tags.length) {
    return null;
  }

  return (
    <nav className="category-filters" aria-label="Shop tags">
      <Link href="/shop" className={!activeTag ? 'category-chip category-chip--active' : 'category-chip'}>
        All
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/shop?tag=${encodeURIComponent(tag)}`}
          className={activeTag === tag ? 'category-chip category-chip--active' : 'category-chip'}
        >
          {tag}
        </Link>
      ))}
    </nav>
  );
}
