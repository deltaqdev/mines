import { defineConfig } from 'astro/config';
import mines from '@deltaq.dev/mines';

export default defineConfig({
  site: 'https://mines.deltaq.dev',
  integrations: [
    mines({
      title: 'Mines',
      logo: '/deltaq.svg',
      favicon: '/favicon.svg',
      description: 'A minimal, compact documentation theme for Astro, built by DeltaQ.',
      github: 'deltaqdev/mines',
      editUrl: 'https://github.com/deltaqdev/mines/edit/main/docs/',
      tocLinks: {
        title: 'Community',
        links: [
          { label: 'Astro docs', href: 'https://docs.astro.build' },
          { label: 'Docus', href: 'https://docus.dev' },
          { label: 'Pagefind', href: 'https://pagefind.app' },
        ],
      },
    }),
  ],
});
