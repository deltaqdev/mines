import type { CollectionEntry } from 'astro:content';
import config from 'virtual:mines/config';
import type { Link } from '../config';
import { hrefOf } from './path';

export interface LinkGroup {
  title: string;
  links: Link[];
}

type DocsEntry = CollectionEntry<'docs'>;

/** Link groups below the table of contents: the page's `related` entries, then site-wide `tocLinks`. */
export function tocLinkGroups(entry: DocsEntry, entries: DocsEntry[]): LinkGroup[] {
  const byId = new Map(entries.map((doc) => [doc.id, doc]));

  const pageLink = (slug: string): Link => {
    const id = slug.replace(/^\/|\/$/g, '') || 'index';
    const page = byId.get(id);
    if (!page) throw new Error(`"${entry.id}" lists an unknown related page "${slug}"`);
    return { label: page.data.title, href: hrefOf(id) };
  };

  const related = entry.data.related.map((item: string | Link) => (typeof item === 'string' ? pageLink(item) : item));

  return [{ title: 'Related', links: related }, ...(config.tocLinks ? [config.tocLinks] : [])].filter(
    (group) => group.links.length > 0,
  );
}
