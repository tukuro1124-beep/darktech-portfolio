export function initActiveSectionObserver(sectionIds, onActiveChange) {
  const ratios = new Map();
  const nodes = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!nodes.length) return () => {};

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        ratios.set(entry.target.id, entry.intersectionRatio);
      });

      const navBottom = document.getElementById('navbar')?.getBoundingClientRect().bottom || 0;
      let winner = sectionIds[0];
      let bestRatio = -1;
      let bestDistance = Number.POSITIVE_INFINITY;

      sectionIds.forEach((id) => {
        const node = document.getElementById(id);
        if (!node) return;

        const ratio = ratios.get(id) ?? 0;
        const distance = Math.abs(node.getBoundingClientRect().top - navBottom);

        if (ratio > bestRatio || (ratio === bestRatio && distance < bestDistance)) {
          winner = id;
          bestRatio = ratio;
          bestDistance = distance;
        }
      });

      onActiveChange(winner);
    },
    {
      threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.7, 1],
      rootMargin: '-12% 0px -55% 0px'
    }
  );

  nodes.forEach((node) => observer.observe(node));

  return () => observer.disconnect();
}
