import {defineField, defineType} from 'sanity';

export const shippingRateType = defineType({
  name: 'shippingRate',
  title: 'Shipping Rate',
  type: 'object',
  fields: [
    defineField({
      name: 'productKind',
      title: 'Item Type',
      type: 'string',
      options: {
        list: [
          {title: 'Object', value: 'object'},
          {title: 'Print', value: 'print'}
        ]
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'shippingSize',
      title: 'Shipping Size',
      type: 'string',
      options: {
        list: [
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'}
        ]
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'shippingWeight',
      title: 'Shipping Weight',
      type: 'string',
      options: {
        list: [
          {title: 'Light', value: 'light'},
          {title: 'Medium', value: 'medium'},
          {title: 'Heavy', value: 'heavy'}
        ]
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'amount',
      title: 'Amount (cents)',
      type: 'number',
      validation: (rule) => rule.required().min(0)
    })
  ],
  preview: {
    select: {
      productKind: 'productKind',
      shippingSize: 'shippingSize',
      shippingWeight: 'shippingWeight',
      amount: 'amount'
    },
    prepare: ({productKind, shippingSize, shippingWeight, amount}) => ({
      title: `${productKind || 'item'} / ${shippingSize || 'size'} / ${shippingWeight || 'weight'}`,
      subtitle: typeof amount === 'number' ? `${amount} cents` : 'No amount set'
    })
  }
});
