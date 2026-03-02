const listeners = new Set();

const state = {
  lang: 'en',
  contentLang: 'en',
  status: 'loading',
  content: null,
  errorMsg: '',
  reducedMotion: false,
  activeSection: 'top',
  drawerOpen: false
};

export function getState() {
  return state;
}

export function setState(patch) {
  let changed = false;

  Object.entries(patch).forEach(([key, value]) => {
    if (state[key] !== value) {
      state[key] = value;
      changed = true;
    }
  });

  if (!changed) return;

  listeners.forEach((listener) => listener(state));
}

export function subscribe(listener) {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
}

export function initStore() {
  const storedLang = localStorage.getItem('lang');
  const initialLang = storedLang === 'vi' ? 'vi' : 'en';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  state.lang = initialLang;
  state.contentLang = initialLang;
  state.reducedMotion = reducedMotion;
  state.status = 'loading';
}
