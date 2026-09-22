const ENTITIES: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };

export const decode = (value: string) => value.replace(/&(amp|lt|gt|quot|#39);/g, (entity) => ENTITIES[entity]);

/** Reads attributes from every opening tag in rendered slot HTML that matches `marker`. */
export function readTags(html: string, marker: RegExp, names: string[]) {
  const tags = html.match(new RegExp(`<[a-z]+[^>]*${marker.source}[^>]*>`, 'g')) ?? [];
  return tags.map((tag) =>
    Object.fromEntries(names.map((name) => [name, decode(tag.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? '')])),
  );
}

export function splitAtLast(html: string, marker: string) {
  const index = html.lastIndexOf(marker);
  return index === -1 ? [html, ''] : [html.slice(0, index), html.slice(index)];
}
