import type { CollectionEntry } from 'astro:content';
import config from 'virtual:mines/config';
import { hrefOf, parseSegment, titleize, type Segment } from './path';

type DocsEntry = CollectionEntry<'docs'>;

export interface NavPage {
  id: string;
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  pages: NavPage[];
}

export interface NavSection extends NavGroup {
  key: string;
  href: string;
  groups: NavGroup[];
}

function segmentsOf(entry: DocsEntry): Segment[] {
  const raw = entry.filePath!.split('/');
  const isNestedIndex = parseSegment(raw.at(-1)!).name === 'index' && entry.id !== 'index';
  const depth = entry.id.split('/').length + (isNestedIndex ? 1 : 0);
  return raw.slice(-depth).map(parseSegment);
}

function compareSegments(a: Segment[], b: Segment[]) {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    const byOrder = a[i].order - b[i].order;
    if (byOrder) return byOrder;
    const byName = a[i].name.localeCompare(b[i].name);
    if (byName) return byName;
  }
  return a.length - b.length;
}

function groupBy<T>(items: T[], keyOf: (item: T) => string) {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = keyOf(item);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return groups;
}

const labelOf = (folder: string) => (folder ? (config.groups[folder] ?? titleize(folder)) : '');

const folderAt = (segments: Segment[], depth: number) =>
  segments.length > depth + 1 ? segments[depth].name : '';

export function buildNavigation(entries: DocsEntry[]): NavSection[] {
  const items = entries
    .map((entry) => ({ entry, segments: segmentsOf(entry) }))
    .sort((a, b) => compareSegments(a.segments, b.segments));

  const toPage = ({ entry }: (typeof items)[number]): NavPage => ({
    id: entry.id,
    title: entry.data.title,
    href: hrefOf(entry.id),
  });

  return [...groupBy(items, (item) => folderAt(item.segments, 0))].map(([key, sectionItems]) => {
    const pages = sectionItems.map(toPage);
    const groups = [...groupBy(sectionItems, (item) => folderAt(item.segments, 1))].map(
      ([folder, groupItems]) => ({ title: labelOf(folder), pages: groupItems.map(toPage) }),
    );
    return { key, title: labelOf(key), href: pages[0].href, pages, groups };
  });
}

export function sectionOf(sections: NavSection[], id: string) {
  return sections.find((section) => section.pages.some((page) => page.id === id));
}

export function sidebarGroups(sections: NavSection[], id: string): NavGroup[] {
  if (config.subNav === 'header') return sectionOf(sections, id)?.groups ?? [];
  return sections.map(({ title, pages }) => ({ title, pages }));
}

export function surroundingPages(sections: NavSection[], id: string) {
  const pages = sections.flatMap((section) =>
    config.subNav === 'header' ? section.groups.flatMap((group) => group.pages) : section.pages,
  );
  const index = pages.findIndex((page) => page.id === id);
  return { prev: pages[index - 1], next: pages[index + 1] };
}
