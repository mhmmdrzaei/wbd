'use client';

import Image from 'next/image';
import Link from 'next/link';
import {CartPanel} from '@/components/CartPanel';
import {addProductToCart, readStoredCart, writeStoredCart} from '@/lib/shop-cart';
import {dedupeCategories} from '@/lib/categories';
import type {ShippingSettings, ShopProduct} from '@/lib/types';

type Props = {
  products: ShopProduct[];
  shippingSettings?: ShippingSettings | null;
};

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {style: 'currency', currency}).format(amount / 100);
}
export function ShopClient({products, shippingSettings}: Props) {
  function addToCart(product: ShopProduct) {
    const updated = addProductToCart(readStoredCart(), product);
    writeStoredCart(updated);
    window.dispatchEvent(new Event('shop-cart-updated'));
  }

  return (
    <div className="shop-layout">
      <section className="shop-grid" aria-label="Products">
        {products.map((product) => {
          const imageUrl = product.image?.asset?.url;
          const width = product.image?.asset?.metadata?.dimensions?.width || 1200;
          const height = product.image?.asset?.metadata?.dimensions?.height || 900;

          return (
            <article key={product._id} className="shop-card">
              <Link href={`/shop/${product.slug}`} className="shop-card-link">
                {imageUrl ? (
                  <div className="shop-image-wrap">
                    <Image
                      src={imageUrl}
                      alt={product.title}
                      width={width}
                      height={height}
                      sizes="(max-width: 960px) 100vw, 50vw"
                      className="shop-image"
                    />
                  </div>
                ) : (
                  <div className="shop-image-placeholder" />
                )}
              </Link>
              <h3>
                <Link href={`/shop/${product.slug}`}>{product.title}</Link>
              </h3>
              {product.tags?.length ? (
                <div className="project-card-categories">
                  {dedupeCategories(product.tags).map((tag) => (
                    <Link key={`${product._id}-${tag}`} href={`/shop?tag=${encodeURIComponent(tag)}`} className="project-category-pill">
                      {tag}
                    </Link>
                  ))}
                </div>
              ) : null}
              {product.description ? <p>{product.description}</p> : null}
              <div className="shop-card-footer">
                <strong>{formatMoney(Math.round(product.price * 100), product.currency)}</strong>
                <button onClick={() => addToCart(product)} type="button">
                  Add to cart
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <CartPanel shippingSettings={shippingSettings} />
    </div>
  );
}
