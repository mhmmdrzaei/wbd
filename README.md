# Clay + Motion Portfolio (Next.js + Sanity + Stripe)

A colorful, modern portfolio + store starter for an artist practice focused on ceramics and animation.

## Stack
- Next.js (App Router)
- Sanity Studio embedded at `/studio`
- Stripe Checkout for payment
- Sanity as the source of truth for store inventory

## Pages
- `/` Home: project grid sorted by newest year first
- `/projects/[slug]`: project details with images, year, and info fields
- `/shop`: products from Sanity, add-to-cart, shipping estimate, and checkout
- `/about`: image, text, and downloadable CV PDF
- `/studio`: embedded Sanity Studio

SEO fields are included in all page and project documents via a reusable `seo` object.

## Shop product model
Each `shopProduct` stores:
- title, slug, description, price, image
- `productKind`: `object` or `print`
- `shippingSize`: `small`, `medium`, `large`
- `shippingWeight`: `light`, `medium`, `heavy`

## Shipping model
Shipping is computed from the cart, not per line item:
- the cart inherits the largest parcel size in the cart
- the cart inherits the heaviest effective load in the cart
- if any item is an `object`, object handling rules apply to the whole shipment
- extra items add a surcharge
- destination country adds a country surcharge

Example:
- `small/light` + `medium/heavy` resolves to a `medium/heavy` shipment
- if either item is an `object`, the shipment uses the `object` rate table

## Environment variables
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_READ_TOKEN`
- `STRIPE_SECRET_KEY`

## Run
```bash
npm install
npm run dev
```

Open:
- Site: `http://localhost:3000`
- Studio: `http://localhost:3000/studio`

## Checkout flow
1. Products are edited in Sanity.
2. Cart is managed in the site UI and persisted in local storage.
3. `/api/checkout` fetches the current Sanity products, calculates the cart shipping profile, and creates a Stripe Checkout Session.
4. Stripe collects payment and shipping details.
