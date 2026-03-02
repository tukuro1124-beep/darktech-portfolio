import { clear, el } from './lib/dom.js';
import { markReveal, resetRevealSequence } from './lib/motion.js';
import { renderNavbar } from './sections/navbar.js';
import { renderHero } from './sections/hero.js';
import { renderFeatured } from './sections/featured.js';
import { renderMoreWork } from './sections/moreWork.js';
import { renderExperience } from './sections/experience.js';
import { renderSkills } from './sections/skills.js';
import { renderContact } from './sections/contact.js';
import { renderFooter } from './sections/footer.js';

export function renderApp(state) {
  const navbarHost = document.getElementById('navbar');
  const appHost = document.getElementById('app');
  if (!navbarHost || !appHost) return;

  clear(navbarHost);
  navbarHost.appendChild(renderNavbar(state, state.content));

  const fragment = document.createDocumentFragment();

  if ((state.status === 'loading' || state.status === 'error') && !state.content) {
    fragment.appendChild(renderLoadingSkeleton());
    clear(appHost);
    appHost.appendChild(fragment);
    return;
  }

  const content = state.content || {};
  resetRevealSequence();

  const topSection = el('section', 'section', { id: 'top' });
  const hero = renderHero(content, state.lang);
  markReveal(hero);
  topSection.append(hero);

  const featuredSection = renderFeatured(content, state.lang);
  markReveal(featuredSection.firstElementChild);

  const moreWorkCard = renderMoreWork(content);
  const moreWorkSection = el('section', 'section');
  markReveal(moreWorkCard);
  moreWorkSection.appendChild(moreWorkCard);

  const experienceSection = renderExperience(content);
  const skillsCard = renderSkills(content);
  const contactCard = renderContact(content);
  markReveal(experienceSection.firstElementChild);
  markReveal(skillsCard);
  markReveal(contactCard);
  experienceSection.append(skillsCard, contactCard);

  const footer = renderFooter(content);

  fragment.append(topSection, featuredSection, moreWorkSection, experienceSection, footer);

  clear(appHost);
  appHost.appendChild(fragment);
}

function renderLoadingSkeleton() {
  const wrapper = el('section', 'section topband');
  const left = el('div', 'card');
  left.append(
    el('div', 'skel skel--text'),
    el('div', 'skel skel--block-72', { style: 'margin-top:12px' }),
    el('div', 'skel skel--block-72', { style: 'margin-top:12px' })
  );

  const right = el('div', 'card');
  right.append(
    el('div', 'skel skel--text'),
    el('div', 'skel skel--tile-68', { style: 'margin-top:12px' }),
    el('div', 'skel skel--tile-68', { style: 'margin-top:12px' })
  );

  wrapper.append(left, right);
  return wrapper;
}
