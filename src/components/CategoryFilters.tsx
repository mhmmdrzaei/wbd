import Link from 'next/link';

type Props = {
  categories: string[];
  activeCategory?: string;
};

export function CategoryFilters({categories, activeCategory}: Props) {
  if (!categories.length) {
    return null;
  }

  return (
    <nav className="category-filters" aria-label="Project categories">
      <Link href="/" className={!activeCategory ? 'category-chip category-chip--active' : 'category-chip'}>
        All
      </Link>
      {categories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <Link
            key={category}
            href={`/?category=${encodeURIComponent(category)}`}
            className={isActive ? 'category-chip category-chip--active' : 'category-chip'}
          >
            {category}
          </Link>
        );
      })}
    </nav>
  );
}
