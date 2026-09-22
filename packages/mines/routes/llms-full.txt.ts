import type { APIRoute } from 'astro';
import { getDocs } from '../lib/docs';
import { markdownResponse, toMarkdown } from '../lib/markdown';

export const GET: APIRoute = async () => {
  const { entries, sections } = await getDocs();
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const ordered = sections.flatMap((section) => section.pages).map((page) => byId.get(page.id)!);

  return markdownResponse(ordered.map(toMarkdown).join('\n---\n\n'));
};
