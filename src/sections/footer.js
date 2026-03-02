import { el } from '../lib/dom.js';

export function renderFooter(content) {
  const footer = el('footer', 'footer', {});
  footer.appendChild(el('p', '', {}, content.footer?.note || ''));
  return footer;
}
