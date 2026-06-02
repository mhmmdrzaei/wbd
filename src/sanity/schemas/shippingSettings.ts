import {defineField, defineType} from 'sanity';

const defaultRates = [
  {productKind: 'print', shippingSize: 'small', shippingWeight: 'light', amount: 900},
  {productKind: 'print', shippingSize: 'small', shippingWeight: 'medium', amount: 1200},
  {productKind: 'print', shippingSize: 'small', shippingWeight: 'heavy', amount: 1500},
  {productKind: 'print', shippingSize: 'medium', shippingWeight: 'light', amount: 1400},
  {productKind: 'print', shippingSize: 'medium', shippingWeight: 'medium', amount: 1800},
  {productKind: 'print', shippingSize: 'medium', shippingWeight: 'heavy', amount: 2200},
  {productKind: 'print', shippingSize: 'large', shippingWeight: 'light', amount: 2000},
  {productKind: 'print', shippingSize: 'large', shippingWeight: 'medium', amount: 2600},
  {productKind: 'print', shippingSize: 'large', shippingWeight: 'heavy', amount: 3200},
  {productKind: 'object', shippingSize: 'small', shippingWeight: 'light', amount: 1600},
  {productKind: 'object', shippingSize: 'small', shippingWeight: 'medium', amount: 2000},
  {productKind: 'object', shippingSize: 'small', shippingWeight: 'heavy', amount: 2500},
  {productKind: 'object', shippingSize: 'medium', shippingWeight: 'light', amount: 2400},
  {productKind: 'object', shippingSize: 'medium', shippingWeight: 'medium', amount: 3000},
  {productKind: 'object', shippingSize: 'medium', shippingWeight: 'heavy', amount: 3800},
  {productKind: 'object', shippingSize: 'large', shippingWeight: 'light', amount: 3400},
  {productKind: 'object', shippingSize: 'large', shippingWeight: 'medium', amount: 4400},
  {productKind: 'object', shippingSize: 'large', shippingWeight: 'heavy', amount: 5800}
];

export const shippingSettingsType = defineType({
  name: 'shippingSettings',
  title: 'Shipping Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'rates',
      title: 'Shipping Rate Matrix',
      type: 'array',
      of: [{type: 'shippingRate'}],
      initialValue: defaultRates,
      validation: (rule) => rule.min(1)
    }),
    defineField({
      name: 'extraItemSurchargeObject',
      title: 'Extra Item Surcharge: Object (cents)',
      type: 'number',
      initialValue: 600,
      validation: (rule) => rule.required().min(0)
    }),
    defineField({
      name: 'extraItemSurchargePrint',
      title: 'Extra Item Surcharge: Print (cents)',
      type: 'number',
      initialValue: 250,
      validation: (rule) => rule.required().min(0)
    }),
    defineField({
      name: 'countrySurchargeUS',
      title: 'Country Surcharge: United States (cents)',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.required().min(0)
    }),
    defineField({
      name: 'countrySurchargeCA',
      title: 'Country Surcharge: Canada (cents)',
      type: 'number',
      initialValue: 1200,
      validation: (rule) => rule.required().min(0)
    }),
    defineField({
      name: 'countrySurchargeGB',
      title: 'Country Surcharge: United Kingdom (cents)',
      type: 'number',
      initialValue: 2400,
      validation: (rule) => rule.required().min(0)
    }),
    defineField({
      name: 'countrySurchargeFR',
      title: 'Country Surcharge: France (cents)',
      type: 'number',
      initialValue: 2600,
      validation: (rule) => rule.required().min(0)
    }),
    defineField({
      name: 'countrySurchargeDE',
      title: 'Country Surcharge: Germany (cents)',
      type: 'number',
      initialValue: 2600,
      validation: (rule) => rule.required().min(0)
    }),
    defineField({
      name: 'countrySurchargeAU',
      title: 'Country Surcharge: Australia (cents)',
      type: 'number',
      initialValue: 3200,
      validation: (rule) => rule.required().min(0)
    })
  ]
});
