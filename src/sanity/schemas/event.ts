import {defineField, defineType} from 'sanity';

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'picture',
      title: 'Picture',
      type: 'image',
      options: {hotspot: true}
    }),
    defineField({name: 'date', title: 'Date', type: 'datetime'}),
    defineField({name: 'location', title: 'Location', type: 'string'}),
    defineField({name: 'url', title: 'URL', type: 'url'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'})
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      media: 'picture'
    },
    prepare: ({title, subtitle, media}) => ({
      title,
      subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : 'Event',
      media
    })
  }
});
