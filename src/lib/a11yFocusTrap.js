const FOCUS_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

export function getFocusable(dialogEl) {
  if (!dialogEl) return [];
  return Array.from(dialogEl.querySelectorAll(FOCUS_SELECTOR)).filter((item) => {
    return item.offsetParent !== null || item === document.activeElement;
  });
}

export function trapFocus(dialogEl) {
  if (!dialogEl) return () => {};

  const focusable = getFocusable(dialogEl);
  const first = focusable[0] || dialogEl;
  const last = focusable[focusable.length - 1] || dialogEl;
  const previousActive = document.activeElement;

  first.focus();

  function onKeyDown(event) {
    if (event.key !== 'Tab') return;

    const currentFocusable = getFocusable(dialogEl);
    const currentFirst = currentFocusable[0] || dialogEl;
    const currentLast = currentFocusable[currentFocusable.length - 1] || dialogEl;

    if (event.shiftKey && document.activeElement === currentFirst) {
      event.preventDefault();
      currentLast.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === currentLast) {
      event.preventDefault();
      currentFirst.focus();
    }
  }

  document.addEventListener('keydown', onKeyDown);

  return () => {
    document.removeEventListener('keydown', onKeyDown);
    if (previousActive && typeof previousActive.focus === 'function') {
      previousActive.focus();
    }
  };
}
