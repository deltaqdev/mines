import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { linkSchema } from './config';
import { toSlug } from './lib/path';

export function docsLoader({ base = 'src/content/docs' } = {}) {
  return glob({
    base,
    pattern: '**/*.{md,mdx}',
    generateId: ({ entry }) => toSlug(entry),
  });
}

export function docsSchema() {
  return z.object({
    title: z.string(),
    description: z.string().optional(),
    toc: z.boolean().default(true),
    related: z.array(z.union([z.string(), linkSchema])).default([]),
  });
}
