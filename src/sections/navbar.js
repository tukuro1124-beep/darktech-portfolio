import { el } from '../lib/dom.js';
import { createIcon } from '../lib/icons.js';
import { safeHref, isExternalHref } from '../lib/safeHref.js';

const LABELS = {
  en: {
    top: 'Top',
    work: 'Work',
    impact: 'Impact',
    experience: 'Experience',
    contact: 'Contact',
    menu: 'Open menu',
    closeMenu: 'Close menu',
    switchLang: 'Switch language'
  },
  vi: {
    top: 'Dau trang',
    work: 'Du an',
    impact: 'Tac dong',
    experience: 'Kinh nghiem',
    contact: 'Lien he',
    menu: 'Mo menu',
    closeMenu: 'Dong menu',
    switchLang: 'Chuyen ngon ngu'
  }
};

const SECTION_IDS = ['top', 'work', 'impact', 'experience', 'contact'];

export function renderNavbar(state, content) {
  const labels = LABELS[state.lang] || LABELS.en;
  const meta = content?.meta || {};
  const links = meta.links || {};

  const shell = el('div', 'navbar__card');
  const inner = el('div', 'navbar__inner');
  shell.appendChild(inner);

  const left = el('div', 'navbar__left');
  const mark = el('div', 'navbar__mark', { 'aria-hidden': 'true' }, 'TM');
  const brand = el('div', 'navbar__name', {}, state.lang === 'vi' ? meta.name_vi : meta.name_en);
  left.append(mark, brand);

  const center = el('nav', 'navbar__links', { 'aria-label': 'Primary' });
  SECTION_IDS.forEach((id) => {
    const link = el(
      'a',
      `navbar__link${state.activeSection === id ? ' is-active' : ''}`,
      {
        href: `#${id}`,
        'data-action': 'nav',
        'data-target': id
      },
      labels[id]
    );
    center.appendChild(link);
  });

  const right = el('div', 'navbar__right');

  const langBtn = el(
    'button',
    'navbar__icon-btn',
    {
      type: 'button',
      'data-action': 'set-lang',
      'data-lang': state.lang === 'en' ? 'vi' : 'en',
      'aria-label': labels.switchLang,
      title: labels.switchLang
    },
    [createIcon('globe')]
  );

  const langText = el('span', 'u-mono text-sm', {}, state.lang === 'en' ? 'VI' : 'EN');
  langBtn.appendChild(langText);
  right.appendChild(langBtn);

  const githubHref = safeHref(links.github);
  if (githubHref) {
    right.appendChild(makeIconLink(githubHref, 'GitHub', createIcon('github')));
  }

  const linkedinHref = safeHref(links.linkedin);
  if (linkedinHref) {
    right.appendChild(makeIconLink(linkedinHref, 'LinkedIn', createIcon('linkedin')));
  }

  const menuBtn = el(
    'button',
    'navbar__icon-btn navbar__menu-btn',
    {
      type: 'button',
      'data-action': state.drawerOpen ? 'close-drawer' : 'toggle-drawer',
      'aria-expanded': state.drawerOpen ? 'true' : 'false',
      'aria-controls': 'mobile-drawer',
      'aria-label': state.drawerOpen ? labels.closeMenu : labels.menu,
      title: state.drawerOpen ? labels.closeMenu : labels.menu
    },
    createIcon('menu')
  );
  right.appendChild(menuBtn);

  inner.append(left, center, right);

  const drawer = renderDrawer(state, labels);

  const fragment = document.createDocumentFragment();
  fragment.append(shell, drawer);
  return fragment;
}

function renderDrawer(state, labels) {
  const drawer = el('div', `drawer${state.drawerOpen ? ' is-open' : ''}`, {
    id: 'mobile-drawer',
    'data-action': 'close-drawer',
    'aria-hidden': state.drawerOpen ? 'false' : 'true'
  });

  const panel = el('div', 'drawer__panel', {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': labels.menu,
    tabindex: '-1'
  });

  ['top', 'work', 'impact', 'experience', 'contact'].forEach((id) => {
    const link = el(
      'a',
      'drawer__item',
      {
        href: `#${id}`,
        'data-action': 'nav',
        'data-target': id
      },
      labels[id]
    );
    panel.appendChild(link);
  });

  drawer.appendChild(panel);
  return drawer;
}

function makeIconLink(href, label, icon) {
  const attrs = {
    href,
    class: 'navbar__icon-btn',
    'aria-label': label,
    title: label
  };

  if (isExternalHref(href)) {
    attrs.target = '_blank';
    attrs.rel = 'noopener noreferrer';
  }

  return el('a', '', attrs, icon);
}
