import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';

import {CartPanel} from '@/components/CartPanel';
import {RichText} from '@/components/RichText';
import {ShopAddToCartButton} from '@/components/ShopAddToCartButton';
import {ShopProductGallery} from '@/components/ShopProductGallery';
import {dedupeCategories} from '@/lib/categories';
import {sanityFetch} from '@/lib/sanity.client';
import {shippingSettingsQuery, shopProductBySlugQuery} from '@/lib/sanity.queries';
import {buildMetadata} from '@/lib/seo';
import type {ShippingSettings, ShopProduct} from '@/lib/types';

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {style: 'currency', currency}).format(amount);
}

async function getShopProduct(slug: string) {
  return sanityFetch<ShopProduct>(shopProductBySlugQuery, {slug});
}

export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const {slug} = await params;
  const product = await getShopProduct(slug);

  if (!product) {
    return {title: 'Product Not Found'};
  }

  return buildMetadata({
    fallbackTitle: `${product.title} | Shop`,
    fallbackDescription: product.description || product.title,
    path: `/shop/${product.slug}`
  });
}

export default async function ShopProductPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const [product, shippingSettings] = await Promise.all([
    getShopProduct(slug),
    sanityFetch<ShippingSettings>(shippingSettingsQuery)
  ]);

  if (!product) {
    notFound();
  }

  const gallery = (
    product.gallery?.length ? [product.image, ...product.gallery] : [product.image]
  ).filter((image): image is NonNullable<typeof image> => Boolean(image));

  return (
    <div className="shop-layout">
      <article className="shop-detail">
        <div className="shop-detail-media">
          {gallery.length ? <ShopProductGallery title={product.title} images={gallery} /> : null}
        </div>
        <div className="shop-detail-info">
          <h1 className="page-title">{product.title}</h1>
          {product.tags?.length ? (
            <div className="project-detail-categories">
              {dedupeCategories(product.tags).map((tag) => (
                <Link key={`${product._id}-${tag}`} href={`/shop?tag=${encodeURIComponent(tag)}`} className="project-category-pill">
                  {tag}
                </Link>
              ))}
            </div>
          ) : null}
          <p className="shop-detail-price">{formatMoney(product.price, product.currency)}</p>
          {product.description ? <p className="page-intro">{product.description}</p> : null}
          <ShopAddToCartButton product={product} className="shop-detail-cta" />
          <RichText value={product.longDescription} />
        </div>
      </article>
      <CartPanel shippingSettings={shippingSettings} />
    </div>
  );
}
