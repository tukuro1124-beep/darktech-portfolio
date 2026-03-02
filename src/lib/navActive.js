export function initActiveSectionObserver(sectionIds, onActiveChange) {
  const nodes = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  if (!nodes.length) return () => {};

  let lastActive = '';
  let rafId = 0;

  const computeActive = () => {
    rafId = 0;

    const navBottom = document.getElementById('navbar')?.getBoundingClientRect().bottom || 0;
    const viewportHeight = window.innerHeight;
    const pivotY = navBottom + 24;

    let active = nodes[0].id;
    let bestScore = -1;
    let bestDistance = Number.POSITIVE_INFINITY;

    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      const visibleTop = Math.max(rect.top, navBottom);
      const visibleBottom = Math.min(rect.bottom, viewportHeight);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const score = visibleHeight / Math.max(rect.height, 1);
      const distance = Math.abs(rect.top - pivotY);

      if (score > bestScore || (score === bestScore && distance < bestDistance)) {
        bestScore = score;
        bestDistance = distance;
        active = node.id;
      }
    });

    if (bestScore <= 0) {
      nodes.forEach((node) => {
        if (node.getBoundingClientRect().top <= pivotY) {
          active = node.id;
        }
      });
    }

    const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (nearBottom) {
      active = nodes[nodes.length - 1].id;
    }

    if (active !== lastActive) {
      lastActive = active;
      onActiveChange(active);
    }
  };

  const onScrollOrResize = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(computeActive);
  };

  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize, { passive: true });
  computeActive();

  return () => {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
    }
    window.removeEventListener('scroll', onScrollOrResize);
    window.removeEventListener('resize', onScrollOrResize);
  };
}
