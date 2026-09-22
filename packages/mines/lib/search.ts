import { join } from 'node:path';
import type { AstroIntegrationLogger } from 'astro';
import * as pagefind from 'pagefind';

export async function buildSearchIndex(outDir: string, logger: AstroIntegrationLogger) {
  const { index, errors } = await pagefind.createIndex();
  if (!index) throw new Error(`Pagefind failed: ${errors.join(', ')}`);

  const { page_count } = await index.addDirectory({ path: outDir });
  await index.writeFiles({ outputPath: join(outDir, 'pagefind') });
  await pagefind.close();

  logger.info(`Search index built for ${page_count} pages`);
}
