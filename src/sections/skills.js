import { el } from '../lib/dom.js';

export function renderSkills(content) {
  const skills = content.skills || {};
  const card = el('article', 'skills-contact card hoverable');

  card.appendChild(el('h2', '', {}, skills.title || 'Skills'));

  const table = el('div', 'skills-table');
  (skills.items || []).slice(0, 6).forEach((item) => {
    const row = el('div', 'skills-row');
    row.appendChild(el('span', 'skills-row__key', {}, item.key || ''));
    row.appendChild(el('span', '', {}, item.value || ''));
    table.appendChild(row);
  });

  card.appendChild(table);
  return card;
}
