import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import type { AstroIntegrationLogger } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { decode } from './html';

const WIDTH = 1200;
const HEIGHT = 630;

/** Dark theme tokens from styles/tokens.css; satori cannot read CSS variables. */
const COLORS = { bg: '#0c0c0e', fg: '#fafafa', muted: '#a1a1aa', accent: '#ffffff' };

const require = createRequire(import.meta.url);

interface Node {
  type: string;
  props: { style?: Record<string, unknown>; children?: Node | Node[] | string };
}

const h = (type: string, style: Node['props']['style'], children?: Node['props']['children']): Node => ({
  type,
  props: { style, children },
});

async function loadFonts() {
  const read = (weight: number) => readFile(require.resolve(`@fontsource/lora/files/lora-latin-${weight}-normal.woff`));
  const [regular, semibold] = await Promise.all([read(400), read(600)]);
  return [
    { name: 'Lora', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'Lora', data: semibold, weight: 600 as const, style: 'normal' as const },
  ];
}

interface OgCard {
  site: string;
  title: string;
  description?: string;
}

function card({ site, title, description }: OgCard) {
  return h(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '72px 80px',
      background: COLORS.bg,
      borderTop: `8px solid ${COLORS.accent}`,
      fontFamily: 'Lora',
    },
    [
      h('div', { fontSize: 28, color: COLORS.accent, fontWeight: 600 }, site),
      h('div', { display: 'flex', flexDirection: 'column', gap: 24 }, [
        h('div', { fontSize: 72, fontWeight: 600, color: COLORS.fg, lineHeight: 1.15 }, title),
        ...(description ? [h('div', { fontSize: 30, color: COLORS.muted, lineHeight: 1.4 }, description)] : []),
      ]),
    ],
  );
}

const readMeta = (html: string, property: string) => {
  const match = html.match(new RegExp(`<meta property="${property}" content="([^"]*)"`));
  return match ? decode(match[1]) : undefined;
};

interface GenerateOptions {
  outDir: string;
  base: string;
  site: string;
  logger: AstroIntegrationLogger;
}

/** Renders a PNG for every built page that declares an og:image inside `outDir`. */
export async function generateOgImages({ outDir, base, site, logger }: GenerateOptions) {
  const fonts = await loadFonts();
  const files = (await readdir(outDir, { recursive: true })).filter((file) => file.endsWith('.html'));
  let count = 0;

  for (const file of files) {
    const html = await readFile(join(outDir, file), 'utf8');
    const image = readMeta(html, 'og:image');
    const title = readMeta(html, 'og:title');
    if (!image || !title) continue;

    const pathname = new URL(image, 'http://localhost').pathname.slice(base.replace(/\/$/, '').length);
    const svg = await satori(card({ site, title, description: readMeta(html, 'og:description') }) as never, {
      width: WIDTH,
      height: HEIGHT,
      fonts,
    });

    const target = join(outDir, pathname);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, new Resvg(svg).render().asPng());
    count++;
  }

  logger.info(`Generated ${count} OG images`);
}
