import {defineField, defineType} from 'sanity';

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Page Title', type: 'string', initialValue: 'Home'}),
    defineField({name: 'headline', title: 'Headline', type: 'string'}),
    defineField({name: 'intro', title: 'Intro Text', type: 'text', rows: 3}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'})
  ]
});
