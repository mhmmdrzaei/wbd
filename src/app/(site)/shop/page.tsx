import type {Metadata} from 'next';
import {Suspense} from 'react';

import {ShopExplorer} from '@/components/ShopExplorer';
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

export default async function ShopPage() {
  const [shop, products, shippingSettings] = await Promise.all([
    sanityFetch<ShopPage>(shopPageQuery),
    sanityFetch<ShopProduct[]>(shopProductsQuery),
    sanityFetch<ShippingSettings>(shippingSettingsQuery)
  ]);
  const allProducts = products || [];

  return (
    <article>
      <h1 className="page-title">{shop?.title || 'Shop'}</h1>
      <p className="page-intro">
        {shop?.intro || 'Products live in Sanity. Shipping is estimated from item type, parcel size, and combined cart weight before Stripe checkout.'}
      </p>
      <Suspense fallback={null}>
        <ShopExplorer products={allProducts} shippingSettings={shippingSettings} />
      </Suspense>
    </article>
  );
}
