const THRESHOLD = 0.18;
const ROOT_MARGIN = '0px 0px -10% 0px';

let observer;

export function markReveal(node) {
  if (node) {
    node.classList.add('reveal');
  }
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
