import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import { layoutSlots, type MinesConfig } from '../config';

const PREFIX = 'virtual:mines/';

const packagePath = (path: string) => fileURLToPath(new URL(`../${path}`, import.meta.url));

function exportComponents(entries: [string, string][]) {
  return entries.map(([name, path]) => `export { default as ${name} } from ${JSON.stringify(path)};`).join('\n');
}

export function virtualModules(config: MinesConfig, root: URL): Plugin {
  const userPath = (path: string) => fileURLToPath(new URL(path, root));

  const modules: Record<string, string> = {
    config: `export default ${JSON.stringify(config)};`,
    styles: [
      ...['styles/tokens.css', 'styles/base.css', 'styles/prose.css'].map(packagePath),
      ...config.customCss.map(userPath),
    ]
      .map((path) => `import ${JSON.stringify(path)};`)
      .join('\n'),
    components: exportComponents(
      layoutSlots.map((slot) => [
        slot,
        config.components[slot] ? userPath(config.components[slot]) : packagePath(`components/layout/${slot}.astro`),
      ]),
    ),
    'mdx-components': [
      `import * as defaults from ${JSON.stringify(packagePath('components/prose/index.ts'))};`,
      ...Object.entries(config.mdxComponents).map(
        ([name, path]) => `import ${name} from ${JSON.stringify(userPath(path))};`,
      ),
      `export default { ...defaults, ${Object.keys(config.mdxComponents).join(', ')} };`,
    ].join('\n'),
  };

  return {
    name: 'mines:virtual',
    resolveId(id) {
      if (id.startsWith(PREFIX)) return `\0${id}`;
    },
    load(id) {
      if (id.startsWith(`\0${PREFIX}`)) return modules[id.slice(PREFIX.length + 1)];
    },
  };
}
