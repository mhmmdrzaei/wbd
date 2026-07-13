'use client';

import {useSearchParams} from 'next/navigation';
import {useMemo} from 'react';

import {ShopClient} from '@/components/ShopClient';
import {ShopTagFilters} from '@/components/ShopTagFilters';
import {dedupeCategories, normalizeCategoryValue} from '@/lib/categories';
import type {ShippingSettings, ShopProduct} from '@/lib/types';

type Props = {
  products: ShopProduct[];
  shippingSettings?: ShippingSettings | null;
};

export function ShopExplorer({products, shippingSettings}: Props) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get('tag') || undefined;
  const normalizedActiveTag = activeTag ? normalizeCategoryValue(activeTag) : undefined;

  const allTags = useMemo(
    () =>
      dedupeCategories(products.flatMap((product) => product.tags || [])).sort((a, b) =>
        a.localeCompare(b)
      ),
    [products]
  );

  const displayProducts = useMemo(() => {
    if (!normalizedActiveTag) {
      return products;
    }

    return products.filter((product) =>
      (product.tags || []).some((tag) => normalizeCategoryValue(tag) === normalizedActiveTag)
    );
  }, [products, normalizedActiveTag]);

  return (
    <>
      <ShopTagFilters tags={allTags} activeTag={activeTag} />
      <ShopClient products={displayProducts} shippingSettings={shippingSettings} />
    </>
  );
}
