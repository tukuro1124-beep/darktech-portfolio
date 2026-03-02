import { el } from '../lib/dom.js';
import { safeHref, isExternalHref } from '../lib/safeHref.js';
import { createIcon } from '../lib/icons.js';

export function renderContact(content) {
  const contact = content.contact || {};

  const card = el('article', 'skills-contact card hoverable', { id: 'contact' });
  card.appendChild(el('h2', '', {}, contact.title || 'Contact'));

  if (contact.subtitle) {
    card.appendChild(el('p', 'u-muted', {}, contact.subtitle));
  }

  if (contact.cta) {
    card.appendChild(el('p', '', {}, contact.cta));
  }

  const links = el('div', 'contact-links');
  (contact.links || []).forEach((link) => {
    const href = safeHref(link.href);
    if (!href) return;

    const attrs = {
      href,
      class: 'btn btn--secondary'
    };

    if (isExternalHref(href)) {
      attrs.target = '_blank';
      attrs.rel = 'noopener noreferrer';
    }

    const iconName = href.startsWith('mailto:') ? 'mail' : 'external';
    links.appendChild(el('a', '', attrs, [createIcon(iconName), link.label || href]));
  });

  if (links.childNodes.length > 0) {
    card.appendChild(links);
  }

  return card;
}
