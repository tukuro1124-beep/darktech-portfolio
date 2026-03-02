import { el } from '../lib/dom.js';

export function renderImpact(content) {
  const section = el('article', 'impact card hoverable');
  const impact = content.impact || {};

  section.appendChild(el('h2', '', {}, impact.title || 'Impact'));
  if (impact.subtitle) {
    section.appendChild(el('p', 'impact__subtitle', {}, impact.subtitle));
  }

  const grid = el('div', 'impact__grid');
  (impact.metrics || []).forEach((metric) => {
    const display = metric.display ?? metric.value ?? '';
    const suffix = metric.value_suffix ?? '';
    const animate = metric.animate === true;
    const metricNum = Number(metric.value_num);
    const num = Number.isFinite(metricNum) ? metricNum : null;

    const tile = el('div', 'metric-tile');
    const valueNode = el('div', 'metric-tile__value', {
      dataset: {
        num: num ?? '',
        suffix,
        display,
        animate: animate ? 'true' : 'false'
      }
    });
    valueNode.textContent = display;

    tile.appendChild(valueNode);
    tile.appendChild(el('div', 'metric-tile__label', {}, metric.label || ''));
    tile.appendChild(el('div', 'metric-tile__note u-line-clamp-2', {}, metric.note || ''));
    grid.appendChild(tile);
  });

  section.appendChild(grid);
  return section;
}
