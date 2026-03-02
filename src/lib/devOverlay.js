import { el } from './dom.js';

export function initDevOverlay() {
  const isDev = new URLSearchParams(location.search).get('dev') === '1';
  if (!isDev) return;

  const box = el('div', 'dev-overlay', { id: 'dev-overlay', 'aria-hidden': 'true' });
  document.body.append(box);

  function breakpoint(width) {
    if (width <= 360) return 'tiny';
    if (width < 640) return 'mobile';
    if (width < 1024) return 'tablet';
    if (width < 1440) return 'desktop';
    return 'wide';
  }

  function tick() {
    const width = window.innerWidth;
    box.textContent = `${width}px | ${breakpoint(width)}`;
  }

  window.addEventListener('resize', tick);
  tick();
}
