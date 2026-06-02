import {NextResponse} from 'next/server';
import Stripe from 'stripe';

import {sanityClient} from '@/lib/sanity.client';
import {shippingSettingsQuery, shopProductsByIdsQuery} from '@/lib/sanity.queries';
import {buildShippingProfile, shippingCountries} from '@/lib/shipping';
import type {ShippingCountry, ShippingSettings, ShopProduct} from '@/lib/types';

type CheckoutRequest = {
  shippingCountry: ShippingCountry;
  items: Array<{productId: string; quantity: number}>;
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({error: 'Missing STRIPE_SECRET_KEY'}, {status: 500});
  }

  const body = (await request.json()) as CheckoutRequest;
  const shippingCountry = body.shippingCountry || 'US';
  const requestedItems = (body.items || []).filter((item) => item.productId && item.quantity > 0);

  if (!requestedItems.length) {
    return NextResponse.json({error: 'Cart is empty'}, {status: 400});
  }

  const products = await sanityClient.fetch<ShopProduct[]>(shopProductsByIdsQuery, {
    ids: requestedItems.map((item) => item.productId)
  });
  const shippingSettings = await sanityClient.fetch<ShippingSettings | null>(shippingSettingsQuery);

  if (!products?.length) {
    return NextResponse.json({error: 'No valid products found'}, {status: 400});
  }

  const lineItems = requestedItems.flatMap((item) => {
    const product = products.find((entry) => entry._id === item.productId);

    if (!product) {
      return [];
    }

    return [
      {
        quantity: item.quantity,
        price_data: {
          currency: product.currency.toLowerCase(),
          unit_amount: Math.round(product.price * 100),
          product_data: {
            name: product.title,
            description: product.description,
            images: product.image?.asset?.url ? [product.image.asset.url] : undefined,
            metadata: {
              sanityId: product._id,
              productKind: product.productKind,
              shippingSize: product.shippingSize,
              shippingWeight: product.shippingWeight
            }
          }
        }
      }
    ];
  });

  if (!lineItems.length) {
    return NextResponse.json({error: 'No valid line items found'}, {status: 400});
  }

  const shippingProfile = buildShippingProfile(
    requestedItems.flatMap((item) => {
      const product = products.find((entry) => entry._id === item.productId);

      if (!product) {
        return [];
      }

      return [
        {
          productId: product._id,
          title: product.title,
          price: Math.round(product.price * 100),
          quantity: item.quantity,
          currency: product.currency,
          imageUrl: product.image?.asset?.url,
          productKind: product.productKind,
          shippingSize: product.shippingSize,
          shippingWeight: product.shippingWeight
        }
      ];
    }),
    shippingCountry,
    shippingSettings || undefined
  );

  const allowedCountry = shippingCountries.find((country) => country.code === shippingCountry);

  if (!allowedCountry) {
    return NextResponse.json({error: 'Unsupported shipping country'}, {status: 400});
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${siteUrl}/shop?success=1`,
    cancel_url: `${siteUrl}/shop?canceled=1`,
    line_items: lineItems,
    shipping_address_collection: {
      allowed_countries: [allowedCountry.code]
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: shippingProfile.amount,
            currency: shippingProfile.currency.toLowerCase()
          },
          display_name: `Shipping: ${shippingProfile.label}`,
          delivery_estimate: {
            minimum: {unit: 'business_day', value: 4},
            maximum: {unit: 'business_day', value: 10}
          }
        }
      }
    ],
    metadata: {
      shippingCountry,
      shippingKind: shippingProfile.productKind,
      shippingSize: shippingProfile.shippingSize,
      shippingWeight: shippingProfile.shippingWeight
    }
  });

  if (!session.url) {
    return NextResponse.json({error: 'Unable to create Stripe checkout session'}, {status: 500});
  }

  return NextResponse.json({url: session.url}, {status: 200});
}
