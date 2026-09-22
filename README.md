# mines

A minimal, compact docs theme for Astro, inspired by [Docus](https://docus.dev). No UI framework: Astro components, plain CSS and a few small scripts.

- `packages/mines`: the integration
- `docs`: the documentation site, which is also the component gallery

## Develop

```bash
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # also builds the search index and OG images
pnpm preview   # try search against the build
```

## Use

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mines from '@deltaq.dev/mines';

export default defineConfig({
  integrations: [mines({ title: 'My Docs' })],
});
```

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { docsLoader, docsSchema } from '@deltaq.dev/mines/loader';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};
```

Pages go in `src/content/docs`. Numeric prefixes (`1.getting-started/2.installation.mdx`) set the order and are removed from URLs.

## Package layout

```
packages/mines/
  index.ts            integration: routes, MDX, Shiki, search + OG after build
  config.ts           option schema
  loader.ts           content loader and frontmatter schema
  layouts/Docs.astro  page shell
  components/
    layout/           overridable slots: Header, Sidebar, PageHeader, Toc, Pager, Footer
    prose/            MDX components, available without imports
    ui/               internal building blocks
  lib/                navigation, Shiki transformer, OG, search, virtual modules
  routes/             page, .md, llms.txt, llms-full.txt
  scripts/            client scripts shared by several components
  styles/             tokens, base, prose
```
