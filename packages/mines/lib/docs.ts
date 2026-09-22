import { getCollection, type CollectionEntry } from 'astro:content';
import { buildNavigation, type NavSection } from './navigation';

interface Docs {
  entries: CollectionEntry<'docs'>[];
  sections: NavSection[];
}

let cached: Promise<Docs> | undefined;

async function load(): Promise<Docs> {
  const entries: CollectionEntry<'docs'>[] = await getCollection('docs');
  return { entries, sections: buildNavigation(entries) };
}

export function getDocs() {
  if (import.meta.env.DEV) return load();
  return (cached ??= load());
}
