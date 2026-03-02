import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';

import { initStore, subscribe, getState, setState } from './store.js';
import { loadContent, getLastGoodContent, setLastGoodContent } from './fetchContent.js';
import { renderApp } from './renderApp.js';
import { validateContent } from './lib/validateContent.js';
import { showToast } from './lib/toast.js';
import { initReveal } from './lib/motion.js';
import { initCountUp } from './lib/countUp.js';
import { initActiveSectionObserver } from './lib/navActive.js';
import { trapFocus } from './lib/a11yFocusTrap.js';
import { initDevOverlay } from './lib/devOverlay.js';
import { mountFluidBackground } from './background/fluidAdapter.js';

const SECTION_IDS = ['top', 'work', 'impact', 'experience', 'contact'];

let loadVersion = 0;
let cleanupSectionObserver = () => {};
let cleanupFocusTrap = () => {};
let observedReady = false;

initStore();
bindGlobalEvents();
initDevOverlay();

mountFluidBackground().catch(() => {
  showToast('Background effect unavailable.');
});

subscribe((state) => {
  renderApp(state);
  syncDocumentMeta(state);
  syncMotionMode(state);
  syncDrawerAccessibility(state);

  if (state.status === 'ready' && state.content) {
    initReveal(document);
    initCountUp(document.getElementById('impact'));

    if (!observedReady) {
      observedReady = true;
      cleanupSectionObserver = initActiveSectionObserver(SECTION_IDS, (activeId) => {
        setState({ activeSection: activeId });
      });
    }
  }

  if (state.errorMsg) {
    showToast(state.errorMsg);
    setState({ errorMsg: '' });
  }
});

requestContent(getState().lang);

function bindGlobalEvents() {
  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;

    if (action === 'set-lang') {
      const nextLang = target.dataset.lang;
      if (nextLang === 'en' || nextLang === 'vi') {
        requestContent(nextLang);
      }
      return;
    }

    if (action === 'toggle-drawer') {
      setState({ drawerOpen: true });
      return;
    }

    if (action === 'close-drawer') {
      if (target.classList.contains('drawer')) {
        setState({ drawerOpen: false });
      } else if (target.matches('button')) {
        setState({ drawerOpen: false });
      }
      return;
    }

    if (action === 'nav') {
      event.preventDefault();
      const sectionId = target.dataset.target;
      if (!sectionId) return;

      const navigate = () => {
        const sectionNode = document.getElementById(sectionId);
        if (sectionNode) {
          sectionNode.scrollIntoView({ behavior: getState().reducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
      };

      if (getState().drawerOpen) {
        setState({ drawerOpen: false });
        window.setTimeout(navigate, 90);
      } else {
        navigate();
      }
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && getState().drawerOpen) {
      setState({ drawerOpen: false });
    }
  });
}

async function requestContent(lang) {
  const version = ++loadVersion;
  setState({ status: 'loading', drawerOpen: false });

  try {
    const content = await loadContent(lang);
    if (version !== loadVersion) return;

    const withLang = { ...content, __lang: lang };
    const validation = validateContent(withLang);

    if (!validation.ok) {
      throw new Error(validation.errors[0] || 'Content validation failed');
    }

    setLastGoodContent(withLang);
    localStorage.setItem('lang', lang);

    setState({
      lang,
      contentLang: lang,
      status: 'ready',
      content: withLang,
      activeSection: 'top'
    });

    announceLanguage(lang);
  } catch (error) {
    if (error?.name === 'AbortError') {
      return;
    }

    const fallback = getLastGoodContent();
    if (fallback) {
      const fallbackLang = fallback.__lang || getState().contentLang || 'en';
      setState({
        lang: fallbackLang,
        contentLang: fallbackLang,
        status: 'ready',
        content: fallback,
        errorMsg: fallbackLang === 'vi' ? 'Khong tai duoc du lieu ngon ngu moi.' : 'Could not load requested language content.'
      });
      return;
    }

    setState({
      status: 'error',
      errorMsg: lang === 'vi' ? 'Tai du lieu that bai.' : 'Failed to load content.'
    });
  }
}

function syncDocumentMeta(state) {
  document.documentElement.lang = state.lang;
  const content = state.content;
  if (!content?.meta) return;

  const displayName = state.lang === 'vi' ? content.meta.name_vi : content.meta.name_en;
  document.title = `${displayName || 'Portfolio'} | ${content.meta.title || 'Portfolio'}`;

  const desc = content.meta.description || '';
  const descTag = document.querySelector('meta[name="description"]');
  if (descTag) {
    descTag.setAttribute('content', desc);
  }
}

function syncMotionMode(state) {
  document.documentElement.style.scrollBehavior = state.reducedMotion ? 'auto' : 'smooth';
}

function syncDrawerAccessibility(state) {
  if (state.drawerOpen) {
    document.body.style.overflow = 'hidden';
    const dialog = document.querySelector('.drawer.is-open .drawer__panel');
    cleanupFocusTrap();
    cleanupFocusTrap = trapFocus(dialog);
  } else {
    document.body.style.overflow = '';
    cleanupFocusTrap();
    cleanupFocusTrap = () => {};
  }
}

function announceLanguage(lang) {
  const liveRegion = document.getElementById('sr-live');
  if (!liveRegion) return;
  liveRegion.textContent = lang === 'vi' ? 'Da chuyen sang tieng Viet' : 'Switched to English';
}

window.addEventListener('beforeunload', () => {
  cleanupSectionObserver();
  cleanupFocusTrap();
});
