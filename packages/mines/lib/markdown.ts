import type { CollectionEntry } from 'astro:content';

export function toMarkdown({ data, body = '' }: CollectionEntry<'docs'>) {
  const description = data.description ? `> ${data.description}\n\n` : '';
  return `# ${data.title}\n\n${description}${body.trim()}\n`;
}

export function markdownResponse(content: string) {
  return new Response(content, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
