import {defineField, defineType} from 'sanity';

export const shopPageType = defineType({
  name: 'shopPage',
  title: 'Shop Page',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Page Title', type: 'string', initialValue: 'Shop'}),
    defineField({name: 'intro', title: 'Intro Text', type: 'text', rows: 3}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'})
  ]
});
