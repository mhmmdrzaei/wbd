import type {CartItem, ShopProduct} from '@/lib/types';

export const cartStorageKey = 'wayne-port-store-cart';

export function readStoredCart() {
  try {
    const storedCart = window.localStorage.getItem(cartStorageKey);
    return storedCart ? (JSON.parse(storedCart) as CartItem[]) : [];
  } catch {
    window.localStorage.removeItem(cartStorageKey);
    return [];
  }
}

export function writeStoredCart(cart: CartItem[]) {
  window.localStorage.setItem(cartStorageKey, JSON.stringify(cart));
}

export function addProductToCart(cart: CartItem[], product: ShopProduct) {
  const existing = cart.find((item) => item.productId === product._id);

  if (existing) {
    return cart.map((item) =>
      item.productId === product._id ? {...item, quantity: item.quantity + 1} : item
    );
  }

  return [
    ...cart,
    {
      productId: product._id,
      title: product.title,
      price: Math.round(product.price * 100),
      quantity: 1,
      currency: product.currency,
      imageUrl: product.image?.asset?.url,
      productKind: product.productKind,
      shippingSize: product.shippingSize,
      shippingWeight: product.shippingWeight
    }
  ];
}
