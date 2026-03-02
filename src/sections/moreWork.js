import { el } from '../lib/dom.js';

export function renderMoreWork(content) {
  const section = el('article', 'more-work card hoverable');
  const more = content.more_work || {};

  section.appendChild(el('h2', '', {}, more.title || 'More Work'));
  if (more.subtitle) {
    section.appendChild(el('p', 'u-muted', {}, more.subtitle));
  }

  const list = el('div', 'list-card');
  (more.items || []).slice(0, 3).forEach((item) => {
    const card = el('div', 'list-item');
    card.appendChild(el('h3', '', {}, item.name || ''));
    if (item.meta) {
      card.appendChild(el('p', 'item__meta', {}, item.meta));
    }
    if (item.desc) {
      card.appendChild(el('p', 'item__desc u-line-clamp-2', {}, item.desc));
    }
    list.appendChild(card);
  });

  section.appendChild(list);
  return section;
}
