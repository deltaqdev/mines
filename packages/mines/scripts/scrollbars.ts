// Scrollbars are transparent until their container scrolls or is hovered.

const IDLE = 800;
const timers = new WeakMap<Element, ReturnType<typeof setTimeout>>();

let hovered: Element | undefined;

function scrollerOf(target: Element | null) {
  for (let node = target; node; node = node.parentElement) {
    const { overflowX, overflowY } = getComputedStyle(node);
    const scrolls =
      (/auto|scroll/.test(overflowY) && node.scrollHeight > node.clientHeight) ||
      (/auto|scroll/.test(overflowX) && node.scrollWidth > node.clientWidth);
    if (scrolls) return node;
  }
  return document.documentElement;
}

addEventListener(
  'scroll',
  (event) => {
    const target = event.target;
    const scroller = target instanceof Element ? target : document.documentElement;
    scroller.toggleAttribute('data-scrolling', true);
    clearTimeout(timers.get(scroller));
    timers.set(
      scroller,
      setTimeout(() => scroller.removeAttribute('data-scrolling'), IDLE),
    );
  },
  { capture: true, passive: true },
);

addEventListener('pointerover', (event) => {
  const scroller = scrollerOf(event.target as Element);
  if (scroller === hovered) return;

  hovered?.removeAttribute('data-scroll-hover');
  scroller.toggleAttribute('data-scroll-hover', true);
  hovered = scroller;
});
