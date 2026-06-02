import {defineField, defineType} from 'sanity';

export const siteMenuItemType = defineType({
  name: 'siteMenuItem',
  title: 'Menu Item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'href',
      title: 'Link Path',
      type: 'string',
      description: 'Examples: /, /shop, /about, /studio',
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'href'
    }
  }
});
