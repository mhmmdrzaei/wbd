'use client';

import {useState} from 'react';

import {addProductToCart, readStoredCart, writeStoredCart} from '@/lib/shop-cart';
import type {ShopProduct} from '@/lib/types';

type Props = {
  product: ShopProduct;
  className?: string;
};

export function ShopAddToCartButton({product, className}: Props) {
  const [added, setAdded] = useState(false);

  function handleAdd() {
    const updatedCart = addProductToCart(readStoredCart(), product);
    writeStoredCart(updatedCart);
    setAdded(true);
    window.dispatchEvent(new Event('shop-cart-updated'));
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button type="button" onClick={handleAdd} className={className}>
      {added ? 'Added' : 'Add to cart'}
    </button>
  );
}
