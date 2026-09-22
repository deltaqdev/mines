function codeFor(button: Element) {
  const scope = button.closest('.code, [data-tabs]');
  return scope?.querySelector('.code:not([hidden]) pre code') ?? scope?.querySelector('pre code');
}

document.addEventListener('click', async (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>('[data-copy]');
  const code = button && codeFor(button);
  if (!button || !code) return;

  await navigator.clipboard.writeText(code.textContent ?? '');
  button.toggleAttribute('data-copied', true);
  setTimeout(() => button.removeAttribute('data-copied'), 1500);
});
