import type { ShikiTransformer } from 'shiki';
import type { Element, ElementContent } from 'hast';
import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationHighlight,
} from '@shikijs/transformers';

const TITLE_PATTERNS = [/\[([^\]]+)\]/, /title="([^"]+)"/];

export function parseTitle(meta = '') {
  for (const pattern of TITLE_PATTERNS) {
    const match = meta.match(pattern);
    if (match) return match[1];
  }
}

const el = (tagName: string, properties: Element['properties'], children: ElementContent[] = []): Element => ({
  type: 'element',
  tagName,
  properties,
  children,
});

const text = (value: string): ElementContent => ({ type: 'text', value });

function transformerFrame(): ShikiTransformer {
  return {
    name: 'mines:frame',
    root(root) {
      const pre = root.children.find((node): node is Element => node.type === 'element' && node.tagName === 'pre');
      if (!pre) return;

      const title = parseTitle(this.options.meta?.__raw);
      const copy = el('button', { type: 'button', className: ['code-copy'], dataCopy: '', ariaLabel: 'Copy code' });
      const header = title
        ? [el('figcaption', { className: ['code-title'] }, [el('span', {}, [text(title)]), copy])]
        : [copy];

      root.children = [
        el('figure', { className: ['code'], dataTitle: title, dataLang: this.options.lang }, [...header, pre]),
      ];
    },
  };
}

export const shikiConfig = {
  themes: { light: 'github-light', dark: 'github-dark' },
  defaultColor: false as const,
  transformers: [
    transformerMetaHighlight(),
    transformerNotationHighlight(),
    transformerNotationDiff(),
    transformerFrame(),
  ],
};
