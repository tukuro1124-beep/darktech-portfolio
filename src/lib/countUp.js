export function parseValue(valueRaw) {
  if (typeof valueRaw !== 'string') {
    return { num: null, suffix: '' };
  }

  const parsed = valueRaw.trim().match(/^(-?\d+(?:\.\d+)?)\s*(.*)$/);
  if (!parsed) {
    return { num: null, suffix: valueRaw.trim() };
  }

  return {
    num: Number(parsed[1]),
    suffix: parsed[2] || ''
  };
}

export function animateValue(el, num, suffix, durationMs = 1000) {
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / durationMs, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = num * eased;
    const formatted = Number.isInteger(num) ? Math.round(current).toString() : current.toFixed(2);
    el.textContent = `${trimTrailingZeros(formatted)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

export function initCountUp(containerEl) {
  if (!containerEl) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const values = containerEl.querySelectorAll('.metric-tile__value[data-display]');

  const startOne = (node) => {
    if (node.dataset.counted === 'true') return;
    node.dataset.counted = 'true';

    const display = node.dataset.display || '';
    const animate = node.dataset.animate === 'true' && !reducedMotion;
    const datasetNum = node.dataset.num ? Number(node.dataset.num) : null;
    const datasetSuffix = node.dataset.suffix ?? '';

    if (!animate || datasetNum === null || Number.isNaN(datasetNum)) {
      node.textContent = display;
      return;
    }

    animateValue(node, datasetNum, datasetSuffix, 1000);
  };

  if (reducedMotion) {
    values.forEach(startOne);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          values.forEach(startOne);
          observer.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(containerEl);
}

function trimTrailingZeros(input) {
  return input.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
}
