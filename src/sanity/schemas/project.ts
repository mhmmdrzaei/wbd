import {defineField, defineType} from 'sanity';

export const projectType = defineType({
  name: 'project',
  title: 'Project',
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
    defineField({name: 'year', title: 'Project Year', type: 'number', validation: (r) => r.required()}),
    defineField({name: 'summary', title: 'Summary', type: 'text', rows: 4}),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      }
    }),
    defineField({name: 'body', title: 'Project Information', type: 'array', of: [{type: 'block'}]}),
    defineField({
      name: 'media',
      title: 'Project Media',
      type: 'array',
      of: [
        {type: 'image', options: {hotspot: true}},
        {type: 'videoEmbed'}
      ],
      validation: (r) => r.min(1)
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'})
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'year',
      media: 'media.0'
    }
  }
});
