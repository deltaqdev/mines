import { defineCollection } from 'astro:content';
import { docsLoader, docsSchema } from '@deltaq.dev/mines/loader';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};
