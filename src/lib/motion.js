const THRESHOLD = 0.18;
const ROOT_MARGIN = '0px 0px -10% 0px';

let observer;
let revealIndex = 0;

export function resetRevealSequence() {
  revealIndex = 0;
}

export function markReveal(node) {
  if (!node) return;
  node.classList.add('reveal');
  const delay = Math.min(revealIndex * 60, 260);
  node.style.setProperty('--reveal-delay', `${delay}ms`);
  revealIndex += 1;
}

export function initReveal(root = document) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = root.querySelectorAll('.reveal');

  if (reduced) {
    targets.forEach((node) => node.classList.add('is-visible'));
    return;
  }

  if (observer) {
    observer.disconnect();
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: THRESHOLD,
      rootMargin: ROOT_MARGIN
    }
  );

  targets.forEach((target) => observer.observe(target));
}
