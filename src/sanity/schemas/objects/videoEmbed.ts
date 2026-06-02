import {defineField, defineType} from 'sanity';

export const videoEmbedType = defineType({
  name: 'videoEmbed',
  title: 'Embedded Video',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string'
    }),
    defineField({
      name: 'url',
      title: 'Embed URL',
      type: 'url',
      description: 'Use a YouTube or Vimeo URL.',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']})
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'url'
    },
    prepare: ({title, subtitle}) => ({
      title: title || 'Embedded Video',
      subtitle
    })
  }
});
