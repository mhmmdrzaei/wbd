import {defineField, defineType} from 'sanity';

export const shopProductType = defineType({
  name: 'shopProduct',
  title: 'Shop Product',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required()
    }),
    defineField({name: 'description', title: 'Brief Description', type: 'text', rows: 3}),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'array',
      of: [{type: 'block'}]
    }),
    defineField({
      name: 'price',
      title: 'Price (major units)',
      type: 'number',
      description: 'Example: 125 for USD 125.00',
      validation: (r) => r.required().min(0)
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'USD',
      options: {list: [{title: 'USD', value: 'USD'}]},
      validation: (r) => r.required()
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true}
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}]
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'}
    }),
    defineField({
      name: 'productKind',
      title: 'Item Type',
      type: 'string',
      initialValue: 'object',
      options: {
        layout: 'radio',
        list: [
          {title: 'Object', value: 'object'},
          {title: 'Print', value: 'print'}
        ]
      },
      validation: (r) => r.required()
    }),
    defineField({
      name: 'shippingSize',
      title: 'Shipping Size',
      type: 'string',
      initialValue: 'small',
      options: {
        layout: 'radio',
        list: [
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'}
        ]
      },
      validation: (r) => r.required()
    }),
    defineField({
      name: 'shippingWeight',
      title: 'Shipping Weight',
      type: 'string',
      initialValue: 'light',
      options: {
        layout: 'radio',
        list: [
          {title: 'Light', value: 'light'},
          {title: 'Medium', value: 'medium'},
          {title: 'Heavy', value: 'heavy'}
        ]
      },
      validation: (r) => r.required()
    }),
    defineField({
      name: 'active',
      title: 'Active in shop',
      type: 'boolean',
      initialValue: true
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'productKind',
      media: 'image'
    },
    prepare: ({title, subtitle}) => ({
      title,
      subtitle: subtitle ? `Type: ${subtitle}` : 'Shop item'
    })
  }
});
