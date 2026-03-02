import { el } from '../lib/dom.js';

export function renderExperience(content) {
  const section = el('section', 'section bottom-bento', { id: 'experience' });

  const exp = content.experience || {};
  const card = el('article', 'experience card hoverable');
  card.appendChild(el('h2', '', {}, exp.title || 'Experience'));
  if (exp.subtitle) {
    card.appendChild(el('p', 'u-muted', {}, exp.subtitle));
  }

  const list = el('div', 'list-card');
  (exp.items || []).slice(0, 3).forEach((item) => {
    const row = el('div', 'list-item');
    row.appendChild(el('p', 'item__meta', {}, item.date || ''));
    row.appendChild(el('h3', 'u-line-clamp-2', {}, item.role || ''));
    row.appendChild(el('p', 'item__desc', {}, item.desc || ''));
    list.appendChild(row);
  });
  card.appendChild(list);

  section.appendChild(card);
  return section;
}
