import type {ShopProduct} from '@/lib/types';

export const sampleShopProducts: ShopProduct[] = [
  {
    _id: 'sample-vessel-sun',
    title: 'Sun Vessel',
    slug: 'sun-vessel',
    description:
      'Hand-built ceramic vessel with layered glaze, bright slip details, and a soft asymmetrical lip.',
    longDescription: [
      {
        _type: 'block',
        children: [{_type: 'span', text: 'A bright hand-built vessel with painterly glaze variation and a thick sculptural footing.'}]
      }
    ],
    price: 320,
    currency: 'USD',
    tags: ['Sculpture', 'Ceramic'],
    productKind: 'object',
    shippingSize: 'medium',
    shippingWeight: 'heavy',
    active: true
  },
  {
    _id: 'sample-figure-blue',
    title: 'Blue Figure',
    slug: 'blue-figure',
    description:
      'Small sculptural clay figure with painted underglaze accents and a glossy clear coat finish.',
    longDescription: [
      {
        _type: 'block',
        children: [{_type: 'span', text: 'A compact ceramic figure designed as a colorful shelf object with an expressive silhouette.'}]
      }
    ],
    price: 180,
    currency: 'USD',
    tags: ['Sculpture', 'Figure'],
    productKind: 'object',
    shippingSize: 'small',
    shippingWeight: 'medium',
    active: true
  },
  {
    _id: 'sample-print-motion',
    title: 'Motion Study Print',
    slug: 'motion-study-print',
    description:
      'Archival pigment print from an animation still sequence, printed on heavyweight matte paper.',
    longDescription: [
      {
        _type: 'block',
        children: [{_type: 'span', text: 'A print drawn from a larger animation study, meant to hold motion in a single frame.'}]
      }
    ],
    price: 75,
    currency: 'USD',
    tags: ['Print', 'Animation'],
    productKind: 'print',
    shippingSize: 'small',
    shippingWeight: 'light',
    active: true
  },
  {
    _id: 'sample-print-clay-grid',
    title: 'Clay Grid Poster',
    slug: 'clay-grid-poster',
    description:
      'Large-format studio poster documenting clay test tiles, glaze drips, and process marks.',
    longDescription: [
      {
        _type: 'block',
        children: [{_type: 'span', text: 'A large print focused on process imagery, color studies, and clay surface experiments.'}]
      }
    ],
    price: 95,
    currency: 'USD',
    tags: ['Print', 'Design'],
    productKind: 'print',
    shippingSize: 'medium',
    shippingWeight: 'light',
    active: true
  }
];
