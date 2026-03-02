import { el, clear } from './dom.js';

const DEFAULT_TIMEOUT = 2600;

export function showToast(message, { type = 'info', timeout = DEFAULT_TIMEOUT } = {}) {
  const region = document.getElementById('toast-region');
  if (!region) return;

  const toast = el('div', 'toast', {
    role: 'status',
    'data-type': type
  });

  toast.textContent = message;
  region.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
    if (region.childNodes.length === 0) {
      clear(region);
    }
  }, timeout);
}
