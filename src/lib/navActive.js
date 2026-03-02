export function initActiveSectionObserver(sectionIds, onActiveChange) {
  const nodes = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  if (!nodes.length) return () => {};

  let lastActive = '';
  let rafId = 0;

  const computeActive = () => {
    rafId = 0;

    const navBottom = document.getElementById('navbar')?.getBoundingClientRect().bottom || 0;
    const pivot = navBottom + 24;
    let active = sectionIds[0];

    nodes.forEach((node) => {
      if (node.getBoundingClientRect().top <= pivot) {
        active = node.id;
      }
    });

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
