'use client';

import {useEffect, useMemo, useState} from 'react';

import {buildShippingProfile, shippingCountries} from '@/lib/shipping';
import {readStoredCart, writeStoredCart} from '@/lib/shop-cart';
import type {CartItem, ShippingCountry, ShippingSettings} from '@/lib/types';

type Props = {
  shippingSettings?: ShippingSettings | null;
};

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {style: 'currency', currency}).format(amount / 100);
}

export function CartPanel({shippingSettings}: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingCountry, setShippingCountry] = useState<ShippingCountry>('US');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCart(readStoredCart());

    function syncCart() {
      setCart(readStoredCart());
    }

    window.addEventListener('shop-cart-updated', syncCart);
    return () => window.removeEventListener('shop-cart-updated', syncCart);
  }, []);

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const shipping = useMemo(
    () => buildShippingProfile(cart, shippingCountry, shippingSettings || undefined),
    [cart, shippingCountry, shippingSettings]
  );

  function updateQty(productId: string, qty: number) {
    const updated =
      qty <= 0
        ? cart.filter((item) => item.productId !== productId)
        : cart.map((item) => (item.productId === productId ? {...item, quantity: qty} : item));
    writeStoredCart(updated);
    setCart(updated);
  }

  async function checkout() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          shippingCountry,
          items: cart.map(({productId, quantity}) => ({productId, quantity}))
        })
      });

      const data = (await res.json()) as {url?: string; error?: string};

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Checkout failed');
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setLoading(false);
    }
  }

  return (
    <aside className="cart-panel" aria-label="Cart">
      <h2>Cart</h2>
      {cart.length === 0 ? <p>Your cart is empty.</p> : null}
      <ul className="cart-list">
        {cart.map((item) => (
          <li key={item.productId}>
            <div>
              <p>{item.title}</p>
              <small>{formatMoney(item.price, item.currency)}</small>
            </div>
            <div className="qty-controls">
              <button onClick={() => updateQty(item.productId, item.quantity - 1)} type="button">
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQty(item.productId, item.quantity + 1)} type="button">
                +
              </button>
            </div>
          </li>
        ))}
      </ul>
      <label className="shipping-country-field">
        <span>Ship to</span>
        <select value={shippingCountry} onChange={(event) => setShippingCountry(event.target.value as ShippingCountry)}>
          {shippingCountries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.label}
            </option>
          ))}
        </select>
      </label>
      <div className="shipping-summary">
        <p>Shipping</p>
        <strong>{formatMoney(shipping.amount, shipping.currency || 'USD')}</strong>
        <small>{shipping.label}</small>
        <small>{shipping.note}</small>
      </div>
      <div className="cart-total">
        <p>Total before checkout</p>
        <strong>{formatMoney(total + shipping.amount, cart[0]?.currency || 'USD')}</strong>
      </div>
      <button type="button" className="checkout-btn" onClick={checkout} disabled={loading || cart.length === 0}>
        {loading ? 'Redirecting...' : 'Checkout'}
      </button>
      {error ? <p className="error-text">{error}</p> : null}
    </aside>
  );
}
