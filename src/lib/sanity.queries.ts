import {groq} from 'next-sanity';

export const homePageQuery = groq`*[_type == "homePage"][0]{
  title,
  headline,
  intro,
  seo{metaTitle, metaDescription, noIndex, "ogImage": ogImage{asset->{url}}}
}`;

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  siteTitle,
  siteIcon{
    ...,
    asset->{url, metadata{dimensions}}
  },
  menuItems[]{
    label,
    href
  }
}`;

export const shippingSettingsQuery = groq`*[_type == "shippingSettings"][0]{
  rates[]{
    productKind,
    shippingSize,
    shippingWeight,
    amount
  },
  extraItemSurchargeObject,
  extraItemSurchargePrint,
  countrySurchargeUS,
  countrySurchargeCA,
  countrySurchargeGB,
  countrySurchargeFR,
  countrySurchargeDE,
  countrySurchargeAU
}`;

export const projectsQuery = groq`*[_type == "project"] | order(year desc){
  _id,
  title,
  "slug": slug.current,
  year,
  summary,
  "coverImage": coalesce(
    media[_type == "image"][0]{
      ...,
      asset->{url, metadata{dimensions}}
    },
    images[0]{
      ...,
      asset->{url, metadata{dimensions}}
    }
  ),
  categories
}`;

export const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  year,
  summary,
  categories,
  body,
  "media": select(
    defined(media) && count(media) > 0 => media[]{
      ...,
      asset->{url, metadata{dimensions}}
    },
    images[]{
      ...,
      asset->{url, metadata{dimensions}}
    }
  ),
  seo{metaTitle, metaDescription, noIndex, "ogImage": ogImage{asset->{url}}}
}`;

export const eventsQuery = groq`*[_type == "event"] | order(date desc){
  _id,
  title,
  date,
  location,
  url,
  picture{
    ...,
    asset->{url, metadata{dimensions}}
  }
}`;

export const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  body,
  images[]{
    ...,
    asset->{url, metadata{dimensions}}
  },
  seo{metaTitle, metaDescription, noIndex, "ogImage": ogImage{asset->{url}}}
}`;

export const pageSlugsQuery = groq`*[_type == "page" && defined(slug.current)]{"slug": slug.current}`;

export const aboutPageQuery = groq`*[_type == "aboutPage"][0]{
  title,
  portrait{
    ...,
    asset->{url, metadata{dimensions}}
  },
  body,
  email,
  instagramUrl,
  "cvUrl": cvPdf.asset->url,
  seo{metaTitle, metaDescription, noIndex, "ogImage": ogImage{asset->{url}}}
}`;

export const shopPageQuery = groq`*[_type == "shopPage"][0]{
  title,
  intro,
  seo{metaTitle, metaDescription, noIndex, "ogImage": ogImage{asset->{url}}}
}`;

export const shopProductsQuery = groq`*[_type == "shopProduct" && active == true] | order(_updatedAt desc){
  _id,
  title,
  "slug": slug.current,
  description,
  tags,
  price,
  currency,
  image{
    ...,
    asset->{url, metadata{dimensions}}
  },
  productKind,
  shippingSize,
  shippingWeight,
  active
}`;

export const shopProductBySlugQuery = groq`*[_type == "shopProduct" && slug.current == $slug && active == true][0]{
  _id,
  title,
  "slug": slug.current,
  description,
  longDescription,
  tags,
  price,
  currency,
  image{
    ...,
    asset->{url, metadata{dimensions}}
  },
  gallery[]{
    ...,
    asset->{url, metadata{dimensions}}
  },
  productKind,
  shippingSize,
  shippingWeight,
  active
}`;

export const shopProductsByIdsQuery = groq`*[_type == "shopProduct" && _id in $ids && active == true]{
  _id,
  title,
  "slug": slug.current,
  description,
  longDescription,
  tags,
  price,
  currency,
  image{
    asset->{url, metadata{dimensions}}
  },
  gallery[]{
    ...,
    asset->{url, metadata{dimensions}}
  },
  productKind,
  shippingSize,
  shippingWeight
}`;
