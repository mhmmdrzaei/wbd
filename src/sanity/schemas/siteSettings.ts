import {defineField, defineType} from 'sanity';

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      initialValue: 'Clay + Motion',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'siteIcon',
      title: 'Site Icon',
      type: 'image',
      options: {hotspot: true}
    }),
    defineField({
      name: 'menuItems',
      title: 'Menu Items',
      type: 'array',
      of: [{type: 'siteMenuItem'}],
      initialValue: [
        {label: 'Home', href: '/'},
        {label: 'Shop', href: '/shop'},
        {label: 'About', href: '/about'},
        {label: 'Studio', href: '/studio'}
      ],
      validation: (rule) => rule.min(1)
    })
  ]
});
