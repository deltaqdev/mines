import type { APIRoute } from 'astro';
import config from 'virtual:mines/config';
import { getDocs } from '../lib/docs';
import { markdownResponse } from '../lib/markdown';
import { absoluteUrl, markdownHref } from '../lib/path';

export const GET: APIRoute = async ({ site }) => {
  const { entries, sections } = await getDocs();
  const descriptions = new Map(entries.map((entry) => [entry.id, entry.data.description]));

  const groups = sections.flatMap((section) =>
    section.groups.map((group) => {
      const heading = [section.title, group.title].filter(Boolean).join(' / ') || 'Docs';
      const links = group.pages.map((page) => {
        const description = descriptions.get(page.id);
        return `- [${page.title}](${absoluteUrl(markdownHref(page.id), site)})${description ? `: ${description}` : ''}`;
      });
      return `## ${heading}\n\n${links.join('\n')}`;
    }),
  );

  const intro = config.description ? `> ${config.description}\n\n` : '';
  return markdownResponse(`# ${config.title}\n\n${intro}${groups.join('\n\n')}\n`);
};
