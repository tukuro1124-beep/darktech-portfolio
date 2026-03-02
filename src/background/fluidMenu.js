import { el } from '../lib/dom.js';
import { createIcon } from '../lib/icons.js';

export function initFluidMenu() {
  const config = window.__fluidConfig;
  if (!config) return;

  const host = el('div', 'fluid-menu', { id: 'fluid-menu' });
  const toggle = el(
    'button',
    'fluid-menu__toggle',
    { type: 'button', 'aria-expanded': 'false', 'aria-controls': 'fluid-menu-panel' },
    [createIcon('sliders'), 'Fluid']
  );

  const panel = el('div', 'fluid-menu__panel u-hidden', { id: 'fluid-menu-panel' });
  panel.append(
    createRangeControl('Radius', config.SPLAT_RADIUS, 0.05, 0.35, 0.01, (value) => {
      config.SPLAT_RADIUS = value;
    }),
    createRangeControl('Force', config.SPLAT_FORCE, 1500, 9000, 100, (value) => {
      config.SPLAT_FORCE = value;
    }),
    createRangeControl('White', config.WHITE_INTENSITY ?? 1.25, 0.4, 2.4, 0.05, (value) => {
      config.WHITE_INTENSITY = value;
    }),
    createToggleControl('Bloom', !!config.BLOOM, (checked) => {
      config.BLOOM = checked;
      if (typeof window.__fluidUpdateKeywords === 'function') {
        window.__fluidUpdateKeywords();
      }
    })
  );

  toggle.addEventListener('click', () => {
    const willOpen = panel.classList.contains('u-hidden');
    panel.classList.toggle('u-hidden', !willOpen);
    toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  });

  host.append(toggle, panel);
  document.body.appendChild(host);
}

function createRangeControl(label, initial, min, max, step, onChange) {
  const wrap = el('label', 'fluid-menu__row');
  const head = el('span', 'fluid-menu__label', {}, label);
  const valueNode = el('span', 'fluid-menu__value', {}, formatRangeValue(initial, step));
  const input = el('input', 'fluid-menu__input', {
    type: 'range',
    min: String(min),
    max: String(max),
    step: String(step),
    value: String(initial)
  });

  input.addEventListener('input', () => {
    const value = Number(input.value);
    onChange(value);
    valueNode.textContent = formatRangeValue(value, step);
  });

  const top = el('div', 'fluid-menu__top');
  top.append(head, valueNode);
  wrap.append(top, input);
  return wrap;
}

function createToggleControl(label, initial, onChange) {
  const wrap = el('label', 'fluid-menu__toggle-row');
  const input = el('input', '', { type: 'checkbox' });
  input.checked = initial;
  input.addEventListener('change', () => onChange(input.checked));
  wrap.append(input, el('span', '', {}, label));
  return wrap;
}

function formatRangeValue(value, step) {
  return step < 1 ? value.toFixed(2) : String(Math.round(value));
}
