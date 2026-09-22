const STORAGE_PREFIX = 'tabs:';

const roots = [...document.querySelectorAll<HTMLElement>('[data-tabs]')];

const ownTabs = (root: HTMLElement) =>
  [...root.querySelectorAll<HTMLElement>('[data-tab]')].filter((tab) => tab.closest('[data-tabs]') === root);

function select(root: HTMLElement, index: number) {
  ownTabs(root).forEach((tab) => tab.setAttribute('aria-selected', String(Number(tab.dataset.tab) === index)));
  const panels = root.querySelector('[data-tab-panels]')!.children;
  [...panels].forEach((panel, i) => ((panel as HTMLElement).hidden = i !== index));
}

function selectLabel(root: HTMLElement, label: string) {
  const tab = ownTabs(root).find((tab) => tab.textContent?.trim() === label);
  if (tab) select(root, Number(tab.dataset.tab));
}

function readSaved(key: string) {
  try {
    return localStorage.getItem(STORAGE_PREFIX + key);
  } catch {
    return null;
  }
}

function save(key: string, label: string) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, label);
  } catch {}
}

for (const root of roots) {
  const { sync } = root.dataset;
  const saved = sync && readSaved(sync);

  select(root, 0);
  if (saved) selectLabel(root, saved);
  root.toggleAttribute('data-ready', true);

  root.addEventListener('click', (event) => {
    const tab = (event.target as Element).closest<HTMLElement>('[data-tab]');
    if (!tab || tab.closest('[data-tabs]') !== root) return;

    select(root, Number(tab.dataset.tab));
    if (!sync) return;

    const label = tab.textContent!.trim();
    save(sync, label);
    roots.filter((other) => other !== root && other.dataset.sync === sync).forEach((other) => selectLabel(other, label));
  });
}
