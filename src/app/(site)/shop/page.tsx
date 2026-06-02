import type {Metadata} from 'next';

import {ShopClient} from '@/components/ShopClient';
import {ShopTagFilters} from '@/components/ShopTagFilters';
import {dedupeCategories, normalizeCategoryValue} from '@/lib/categories';
import {sanityFetch} from '@/lib/sanity.client';
import {shippingSettingsQuery, shopPageQuery, shopProductsQuery} from '@/lib/sanity.queries';
import {buildMetadata} from '@/lib/seo';
import type {ShippingSettings, ShopPage, ShopProduct} from '@/lib/types';

export async function generateMetadata(): Promise<Metadata> {
  const shop = await sanityFetch<ShopPage>(shopPageQuery);

  return buildMetadata({
    seo: shop?.seo,
    fallbackTitle: 'Shop | Clay + Motion Studio',
    fallbackDescription: 'Buy artworks and editions.',
    path: '/shop'
  });
}

export default async function ShopPage({
  searchParams
}: {
  searchParams?: Promise<{tag?: string}>;
}) {
  const [shop, products, shippingSettings] = await Promise.all([
    sanityFetch<ShopPage>(shopPageQuery),
    sanityFetch<ShopProduct[]>(shopProductsQuery),
    sanityFetch<ShippingSettings>(shippingSettingsQuery)
  ]);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const activeTag = resolvedSearchParams?.tag;
  const normalizedActiveTag = activeTag ? normalizeCategoryValue(activeTag) : undefined;
  const allProducts = products || [];
  const allTags = dedupeCategories(allProducts.flatMap((product) => product.tags || [])).sort((a, b) =>
    a.localeCompare(b)
  );
  const displayProducts = normalizedActiveTag
    ? allProducts.filter((product) =>
        (product.tags || []).some((tag) => normalizeCategoryValue(tag) === normalizedActiveTag)
      )
    : allProducts;

  return (
    <article>
      <h1 className="page-title">{shop?.title || 'Shop'}</h1>
      <p className="page-intro">
        {shop?.intro || 'Products live in Sanity. Shipping is estimated from item type, parcel size, and combined cart weight before Stripe checkout.'}
      </p>
      <ShopTagFilters tags={allTags} activeTag={activeTag} />
      <ShopClient products={displayProducts} shippingSettings={shippingSettings} />
    </article>
  );
}
