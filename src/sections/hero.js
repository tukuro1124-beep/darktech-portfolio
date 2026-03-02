import { el } from '../lib/dom.js';
import { createIcon } from '../lib/icons.js';
import { safeHref, isExternalHref } from '../lib/safeHref.js';
import { withBase } from '../lib/basePath.js';

const LABELS = {
  en: {
    contact: 'Contact Me',
    downloadCv: 'Download CV',
    github: 'GitHub',
    linkedin: 'LinkedIn'
  },
  vi: {
    contact: 'Lien He',
    downloadCv: 'Tai CV',
    github: 'GitHub',
    linkedin: 'LinkedIn'
  }
};

export function renderHero(content, lang) {
  const labels = LABELS[lang] || LABELS.en;
  const meta = content.meta || {};
  const hero = content.hero || {};

  const card = el('article', 'hero card hoverable');

  if (hero.badge) {
    card.appendChild(el('div', 'hero__badge', {}, hero.badge));
  }

  const displayName = lang === 'vi' ? meta.name_vi : meta.name_en;
  if (displayName) {
    const h1 = el('h1', '', {}, displayName);
    card.appendChild(h1);
  }

  if (meta.title) {
    card.appendChild(el('p', 'hero__subtitle', {}, meta.title));
  }

  if (hero.tagline) {
    card.appendChild(el('p', 'hero__tagline u-line-clamp-2', {}, hero.tagline));
  }

  const aboutWrap = el('div', 'hero__about');
  (hero.about_paragraphs || []).slice(0, 2).forEach((paragraph) => {
    aboutWrap.appendChild(el('p', 'u-line-clamp-3', {}, paragraph));
  });
  card.appendChild(aboutWrap);

  if (hero.current_line) {
    const current = el('div', 'hero__current');
    current.appendChild(el('div', 'card card--inner', {}, el('p', 'u-line-clamp-2', {}, hero.current_line)));
    card.appendChild(current);
  }

  const cta = el('div', 'hero__cta');
  cta.appendChild(
    el(
      'a',
      'btn btn--primary',
      {
        href: '#contact',
        'data-action': 'nav',
        'data-target': 'contact'
      },
      labels.contact
    )
  );

  const cvHrefRaw = meta.links?.cv ? withBase(meta.links.cv) : null;
  const cvHref = safeHref(cvHrefRaw);
  if (cvHref) {
    const attrs = {
      href: cvHref,
      class: 'btn btn--secondary'
    };
    if (isExternalHref(cvHref)) {
      attrs.target = '_blank';
      attrs.rel = 'noopener noreferrer';
    }
    const cvBtn = el('a', '', attrs, [createIcon('download'), labels.downloadCv]);
    cta.appendChild(cvBtn);
  }

  const githubHref = safeHref(meta.links?.github);
  if (githubHref) {
    cta.appendChild(makeSecondaryLink(githubHref, labels.github, createIcon('github')));
  }

  const linkedinHref = safeHref(meta.links?.linkedin);
  if (linkedinHref) {
    cta.appendChild(makeSecondaryLink(linkedinHref, labels.linkedin, createIcon('linkedin')));
  }

  card.appendChild(cta);
  return card;
}

function makeSecondaryLink(href, label, icon) {
  const attrs = {
    href,
    class: 'btn btn--secondary'
  };

  if (isExternalHref(href)) {
    attrs.target = '_blank';
    attrs.rel = 'noopener noreferrer';
  }

  return el('a', '', attrs, [icon, label]);
}
