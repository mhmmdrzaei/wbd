import type {
  CartItem,
  ProductKind,
  ShippingCountry,
  ShippingProfile,
  ShippingSettings,
  ShippingSize,
  ShippingWeight
} from '@/lib/types';

const sizeOrder: Record<ShippingSize, number> = {
  small: 1,
  medium: 2,
  large: 3
};

const weightOrder: Record<ShippingWeight, number> = {
  light: 1,
  medium: 2,
  heavy: 3
};

const sizeLabels: Record<ShippingSize, string> = {
  small: 'Small parcel',
  medium: 'Medium parcel',
  large: 'Large parcel'
};

const weightLabels: Record<ShippingWeight, string> = {
  light: 'Light load',
  medium: 'Medium load',
  heavy: 'Heavy load'
};

const defaultRates: Record<ProductKind, Record<ShippingSize, Record<ShippingWeight, number>>> = {
  print: {
    small: {light: 900, medium: 1200, heavy: 1500},
    medium: {light: 1400, medium: 1800, heavy: 2200},
    large: {light: 2000, medium: 2600, heavy: 3200}
  },
  object: {
    small: {light: 1600, medium: 2000, heavy: 2500},
    medium: {light: 2400, medium: 3000, heavy: 3800},
    large: {light: 3400, medium: 4400, heavy: 5800}
  }
};

const defaultExtraItemSurcharge: Record<ProductKind, number> = {
  print: 250,
  object: 600
};

const defaultCountrySurcharge: Record<ShippingCountry, number> = {
  US: 0,
  CA: 1200,
  GB: 2400,
  FR: 2600,
  DE: 2600,
  AU: 3200
};

export const shippingCountries: Array<{code: ShippingCountry; label: string}> = [
  {code: 'US', label: 'United States'},
  {code: 'CA', label: 'Canada'},
  {code: 'GB', label: 'United Kingdom'},
  {code: 'FR', label: 'France'},
  {code: 'DE', label: 'Germany'},
  {code: 'AU', label: 'Australia'}
];

function clampToWeight(value: number): ShippingWeight {
  if (value <= 1) return 'light';
  if (value === 2) return 'medium';
  return 'heavy';
}

function findMaxSize(items: CartItem[]): ShippingSize {
  const highest = Math.max(...items.map((item) => sizeOrder[item.shippingSize]));
  return (Object.keys(sizeOrder) as ShippingSize[]).find((key) => sizeOrder[key] === highest) || 'small';
}

function buildRateMatrix(settings?: ShippingSettings) {
  const matrix = structuredClone(defaultRates);

  for (const rate of settings?.rates || []) {
    matrix[rate.productKind][rate.shippingSize][rate.shippingWeight] = rate.amount;
  }

  return matrix;
}

function buildCountrySurcharges(settings?: ShippingSettings) {
  return {
    US: settings?.countrySurchargeUS ?? defaultCountrySurcharge.US,
    CA: settings?.countrySurchargeCA ?? defaultCountrySurcharge.CA,
    GB: settings?.countrySurchargeGB ?? defaultCountrySurcharge.GB,
    FR: settings?.countrySurchargeFR ?? defaultCountrySurcharge.FR,
    DE: settings?.countrySurchargeDE ?? defaultCountrySurcharge.DE,
    AU: settings?.countrySurchargeAU ?? defaultCountrySurcharge.AU
  } satisfies Record<ShippingCountry, number>;
}

function buildExtraItemSurcharges(settings?: ShippingSettings) {
  return {
    print: settings?.extraItemSurchargePrint ?? defaultExtraItemSurcharge.print,
    object: settings?.extraItemSurchargeObject ?? defaultExtraItemSurcharge.object
  } satisfies Record<ProductKind, number>;
}

export function buildShippingProfile(
  items: CartItem[],
  country: ShippingCountry,
  settings?: ShippingSettings
): ShippingProfile {
  if (!items.length) {
    return {
      productKind: 'print',
      shippingSize: 'small',
      shippingWeight: 'light',
      country,
      amount: 0,
      currency: 'USD',
      label: 'Shipping calculated at checkout',
      note: 'Add an item to estimate shipping.'
    };
  }

  const rateMatrix = buildRateMatrix(settings);
  const countrySurcharge = buildCountrySurcharges(settings);
  const extraItemSurcharge = buildExtraItemSurcharges(settings);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const maxWeightScore = Math.max(...items.map((item) => weightOrder[item.shippingWeight]));
  const totalWeightScore = items.reduce((sum, item) => sum + weightOrder[item.shippingWeight] * item.quantity, 0);

  const productKind: ProductKind = items.some((item) => item.productKind === 'object') ? 'object' : 'print';
  const shippingSize = findMaxSize(items);
  const shippingWeight = clampToWeight(
    Math.max(maxWeightScore, Math.ceil(totalWeightScore / Math.max(totalQuantity, 2)))
  );
  const baseRate = rateMatrix[productKind][shippingSize][shippingWeight];
  const extraRate = Math.max(totalQuantity - 1, 0) * extraItemSurcharge[productKind];
  const amount = baseRate + extraRate + countrySurcharge[country];
  const currency = items[0]?.currency || 'USD';

  return {
    productKind,
    shippingSize,
    shippingWeight,
    country,
    amount,
    currency,
    label: `${sizeLabels[shippingSize]} / ${weightLabels[shippingWeight]}`,
    note:
      productKind === 'object'
        ? 'Mixed carts resolve to the largest parcel and heaviest combined load, with object handling applied.'
        : 'Mixed print carts resolve to the largest parcel and heaviest combined load.'
  };
}
