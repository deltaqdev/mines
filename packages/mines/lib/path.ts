const ORDER_PREFIX = /^(\d+)\./;
const EXTENSION = /\.mdx?$/;

export interface Segment {
  order: number;
  name: string;
}

export function parseSegment(raw: string): Segment {
  const match = raw.match(ORDER_PREFIX);
  const name = raw.replace(ORDER_PREFIX, '').replace(EXTENSION, '');
  return { order: match ? Number(match[1]) : Infinity, name };
}

export function toSlug(entryPath: string) {
  const names = entryPath.split('/').map((raw) => parseSegment(raw).name);
  if (names.length > 1 && names.at(-1) === 'index') names.pop();
  return names.join('/');
}

export function withBase(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

export function hrefOf(id: string) {
  return withBase(id === 'index' ? '' : id);
}

export function titleize(name: string) {
  const words = name.replace(/[-_]+/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function markdownHref(id: string) {
  return withBase(`${id}.md`);
}

export function absoluteUrl(path: string, site: URL | undefined) {
  return site ? new URL(path, site).href : path;
}
