import { el } from '../lib/dom.js';
import { safeHref, isExternalHref } from '../lib/safeHref.js';
import { createIcon } from '../lib/icons.js';

const LABELS = {
  en: {
    context: 'Context',
    role: 'Role',
    highlights: 'Highlights',
    constraints: 'Constraints / Trade-offs',
    architecture: 'Architecture',
    technologies: 'Technologies',
    caseStudy: 'Case Study',
    repo: 'Repository',
    demo: 'Demo',
    mediaCaption: 'Project media preview unavailable in this bundle.'
  },
  vi: {
    context: 'Boi canh',
    role: 'Vai tro',
    highlights: 'Diem chinh',
    constraints: 'Rang buoc / Danh doi',
    architecture: 'Kien truc',
    technologies: 'Cong nghe',
    caseStudy: 'Phan tich',
    repo: 'Ma nguon',
    demo: 'Demo',
    mediaCaption: 'Khong co hinh anh du an trong goi hien tai.'
  }
};

export function renderFeatured(content, lang) {
  const labels = LABELS[lang] || LABELS.en;
  const featured = content.featured || {};
  const project = featured.project || {};

  const section = el('section', 'section', { id: 'work' });
  const card = el('article', 'featured card hoverable');

  card.appendChild(el('h2', '', {}, featured.title || 'Featured Work'));
  card.appendChild(el('h3', '', {}, project.name || ''));

  if (project.meta) {
    card.appendChild(el('p', 'featured__meta', {}, project.meta));
  }

  const grid = el('div', 'featured-grid');
  const textCol = el('div', 'featured__text');

  textCol.appendChild(pair(labels.context, project.context));
  textCol.appendChild(pair(labels.role, project.role));

  const highlights = el('div', 'featured__pair');
  highlights.appendChild(el('div', 'featured__label', {}, labels.highlights));
  const bullets = el('ul', 'featured__bullets');
  (project.bullets || []).slice(0, 5).forEach((bullet) => {
    bullets.appendChild(el('li', 'u-line-clamp-2', {}, bullet));
  });
  highlights.appendChild(bullets);
  textCol.appendChild(highlights);

  const constraints = el('div', 'featured__pair');
  constraints.appendChild(el('div', 'featured__label', {}, labels.constraints));
  const constraintsList = el('ul', 'featured__bullets');
  (project.constraints || []).slice(0, 3).forEach((line) => {
    constraintsList.appendChild(el('li', 'u-line-clamp-2', {}, line));
  });
  constraints.appendChild(constraintsList);
  textCol.appendChild(constraints);

  const architecture = el('div', 'featured__pair');
  architecture.appendChild(el('div', 'featured__label', {}, labels.architecture));
  const archList = el('ul', 'featured__arch');
  (project.architecture || []).slice(0, 5).forEach((line) => {
    archList.appendChild(el('li', '', {}, line));
  });
  architecture.appendChild(archList);
  textCol.appendChild(architecture);

  const chipWrap = el('div', 'featured__pair');
  chipWrap.appendChild(el('div', 'featured__label', {}, labels.technologies));
  const chips = el('div', 'chips');
  const chipItems = project.tech_chips || [];
  chipItems.slice(0, 9).forEach((chip) => {
    chips.appendChild(el('span', 'pill pill--cyan', {}, chip));
  });
  if (chipItems.length > 9) {
    chips.appendChild(el('span', 'pill', {}, `+${chipItems.length - 9}`));
  }
  chipWrap.appendChild(chips);
  textCol.appendChild(chipWrap);

  const links = el('div', 'featured__links');
  appendLink(links, project.links?.case_study, labels.caseStudy);
  appendLink(links, project.links?.repo, labels.repo);
  appendLink(links, project.links?.demo, labels.demo);
  if (links.childNodes.length > 0) {
    textCol.appendChild(links);
  }

  const mediaCol = el('div', 'media');
  const imageHref = safeHref(project.image);
  if (imageHref) {
    const img = el('img', '', {
      src: imageHref,
      alt: project.name || 'Featured project',
      loading: 'lazy',
      decoding: 'async'
    });
    mediaCol.appendChild(img);
  } else {
    mediaCol.classList.add('media--placeholder');
  }

  mediaCol.appendChild(el('div', 'media__caption', {}, labels.mediaCaption));

  grid.append(textCol, mediaCol);
  card.appendChild(grid);
  section.appendChild(card);

  return section;
}

function pair(label, value) {
  const wrap = el('div', 'featured__pair');
  if (!value) return wrap;
  wrap.appendChild(el('div', 'featured__label', {}, label));
  wrap.appendChild(el('p', '', {}, value));
  return wrap;
}

function appendLink(parent, rawHref, label) {
  const href = safeHref(rawHref);
  if (!href) return;

  const attrs = {
    href,
    class: 'btn btn--secondary'
  };

  if (isExternalHref(href)) {
    attrs.target = '_blank';
    attrs.rel = 'noopener noreferrer';
  }

  parent.appendChild(el('a', '', attrs, [createIcon('external'), label]));
}
