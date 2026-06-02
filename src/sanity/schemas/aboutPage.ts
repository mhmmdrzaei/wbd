import {defineField, defineType} from 'sanity';

export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Page Title', type: 'string', initialValue: 'About'}),
    defineField({name: 'portrait', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'body', title: 'Text', type: 'array', of: [{type: 'block'}]}),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.email()
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']})
    }),
    defineField({name: 'cvPdf', title: 'CV PDF', type: 'file', options: {accept: '.pdf'}}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'})
  ]
});
