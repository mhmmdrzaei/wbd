export type Seo = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: {asset?: {url?: string}};
  noIndex?: boolean;
};

export type SiteSettings = {
  siteTitle?: string;
  siteIcon?: SanityImage;
  menuItems?: Array<{
    label: string;
    href: string;
  }>;
};

export type SanityImageAsset = {
  url?: string;
  metadata?: {
    dimensions?: {
      width?: number;
      height?: number;
      aspectRatio?: number;
    };
  };
};

export type SanityImage = {
  _type?: 'image';
  asset?: SanityImageAsset;
  [key: string]: unknown;
};

export type ProjectCard = {
  _id: string;
  title: string;
  slug: string;
  year: number;
  summary?: string;
  coverImage?: SanityImage;
  categories?: string[];
};

export type ProjectMediaImage = SanityImage;

export type VideoEmbed = {
  _type?: 'videoEmbed';
  title?: string;
  url?: string;
};

export type Project = ProjectCard & {
  body?: unknown[];
  media?: Array<ProjectMediaImage | VideoEmbed>;
  seo?: Seo;
};

export type EventItem = {
  _id: string;
  title: string;
  date?: string;
  location?: string;
  url?: string;
  picture?: SanityImage;
};

export type Page = {
  _id: string;
  title: string;
  slug: string;
  body?: unknown[];
  images?: SanityImage[];
  seo?: Seo;
};

export type HomePage = {
  title?: string;
  headline?: string;
  intro?: string;
  seo?: Seo;
};

export type AboutPage = {
  title?: string;
  portrait?: SanityImage;
  body?: unknown[];
  email?: string;
  instagramUrl?: string;
  cvUrl?: string;
  seo?: Seo;
};

export type ShopPage = {
  title?: string;
  intro?: string;
  seo?: Seo;
};

export type ProductKind = 'object' | 'print';
export type ShippingSize = 'small' | 'medium' | 'large';
export type ShippingWeight = 'light' | 'medium' | 'heavy';
export type ShippingCountry = 'US' | 'CA' | 'GB' | 'FR' | 'DE' | 'AU';
export type ShopProductImage = {
  asset?: SanityImageAsset;
} & Record<string, unknown>;

export type ShopProduct = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  longDescription?: unknown[];
  price: number;
  currency: string;
  image?: ShopProductImage;
  gallery?: SanityImage[];
  tags?: string[];
  productKind: ProductKind;
  shippingSize: ShippingSize;
  shippingWeight: ShippingWeight;
  active?: boolean;
};

export type CartItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  currency: string;
  imageUrl?: string;
  productKind: ProductKind;
  shippingSize: ShippingSize;
  shippingWeight: ShippingWeight;
};

export type ShippingProfile = {
  productKind: ProductKind;
  shippingSize: ShippingSize;
  shippingWeight: ShippingWeight;
  country: ShippingCountry;
  amount: number;
  currency: string;
  label: string;
  note: string;
};

export type ShippingRate = {
  productKind: ProductKind;
  shippingSize: ShippingSize;
  shippingWeight: ShippingWeight;
  amount: number;
};

export type ShippingSettings = {
  rates?: ShippingRate[];
  extraItemSurchargeObject?: number;
  extraItemSurchargePrint?: number;
  countrySurchargeUS?: number;
  countrySurchargeCA?: number;
  countrySurchargeGB?: number;
  countrySurchargeFR?: number;
  countrySurchargeDE?: number;
  countrySurchargeAU?: number;
};
