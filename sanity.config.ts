'use client';

import {visionTool} from '@sanity/vision';
import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import type {StructureResolver} from 'sanity/structure';

import {schemaTypes} from './src/sanity/schemas';

const singletonTypes = new Set([
  'homePage',
  'aboutPage',
  'shopPage',
  'siteSettings',
  'shippingSettings'
]);

const singletonActions = new Set(['publish', 'discardChanges', 'restore']);

const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home Page')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.listItem()
        .title('About Page')
        .id('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.listItem()
        .title('Shop Page')
        .id('shopPage')
        .child(S.document().schemaType('shopPage').documentId('shopPage')),
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('Shipping Settings')
        .id('shippingSettings')
        .child(S.document().schemaType('shippingSettings').documentId('shippingSettings')),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !singletonTypes.has(listItem.getId() || '')
      )
    ]);

export default defineConfig({
  name: 'default',
  title: 'Wayne Portfolio Studio',
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [structureTool({structure}), visionTool()],
  document: {
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type === 'global') {
        return prev.filter((templateItem) => !singletonTypes.has(templateItem.templateId));
      }

      return prev;
    },
    actions: (prev, context) =>
      singletonTypes.has(context.schemaType)
        ? prev.filter(({action}) => action && singletonActions.has(action))
        : prev
  },
  schema: {
    types: schemaTypes
  }
});
