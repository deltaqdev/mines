import { z } from 'astro/zod';

export const layoutSlots = ['Header', 'Sidebar', 'PageHeader', 'Toc', 'Pager', 'Footer'] as const;

export type LayoutSlot = (typeof layoutSlots)[number];

export const linkSchema = z.object({ label: z.string(), href: z.string() });

export type Link = z.infer<typeof linkSchema>;

export const configSchema = z.object({
  title: z.string(),
  description: z.string().default(''),
  favicon: z.string().optional().describe('Icon path under public/, such as /favicon.svg'),
  logo: z.string().optional().describe('Image shown before the title, as a path under public/'),
  github: z.string().optional().describe('owner/repo, shown as a header link'),
  editUrl: z.string().url().optional().describe('Base URL the entry file path is appended to'),
  subNav: z.enum(['none', 'header']).default('none'),
  groups: z.record(z.string(), z.string()).default({}).describe('Folder name to sidebar label'),
  og: z.boolean().default(true),
  tocLinks: z
    .object({ title: z.string().default('Links'), links: z.array(linkSchema) })
    .optional()
    .describe('Links shown below the table of contents on every page'),
  customCss: z.array(z.string()).default([]),
  components: z.partialRecord(z.enum(layoutSlots), z.string()).default({}),
  mdxComponents: z.record(z.string(), z.string()).default({}),
});

export type MinesUserConfig = z.input<typeof configSchema>;
export type MinesConfig = z.output<typeof configSchema>;
