import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import mdx from '@astrojs/mdx';
import { configSchema, type MinesUserConfig } from './config';
import { shikiConfig } from './lib/shiki';
import { virtualModules } from './lib/virtual';
import { buildSearchIndex } from './lib/search';
import { generateOgImages } from './lib/og';

export type { MinesUserConfig } from './config';

const route = (path: string) => fileURLToPath(new URL(`./routes/${path}`, import.meta.url));

export default function mines(userConfig: MinesUserConfig): AstroIntegration {
  const config = configSchema.parse(userConfig);
  let base = '/';

  return {
    name: '@deltaq.dev/mines',
    hooks: {
      'astro:config:setup'({ config: astroConfig, updateConfig, injectRoute }) {
        base = astroConfig.base;
        const hasMdx = astroConfig.integrations.some((integration) => integration.name === '@astrojs/mdx');

        updateConfig({
          integrations: hasMdx ? [] : [mdx()],
          markdown: { shikiConfig },
          vite: { plugins: [virtualModules(config, astroConfig.root)] },
        });

        injectRoute({ pattern: '/[...slug]', entrypoint: route('page.astro') });
        injectRoute({ pattern: '/[...slug].md', entrypoint: route('markdown.ts') });
        injectRoute({ pattern: '/llms.txt', entrypoint: route('llms.txt.ts') });
        injectRoute({ pattern: '/llms-full.txt', entrypoint: route('llms-full.txt.ts') });
      },
      async 'astro:build:done'({ dir, logger }) {
        const outDir = fileURLToPath(dir);
        if (config.og) await generateOgImages({ outDir, base, site: config.title, logger });
        await buildSearchIndex(outDir, logger);
      },
    },
  };
}
