import { withBase } from '../lib/basePath.js';

let fluidLoadPromise;

export function mountFluidBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return Promise.resolve(false);

  if (fluidLoadPromise) {
    return fluidLoadPromise;
  }

  window.__FLUID_BG_CANVAS_ID__ = 'bg-canvas';
  window.__FLUID_BASE_PATH__ = withBase('/vendor/fluid/');
  window.ga = window.ga || (() => {});

  fluidLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = withBase('/vendor/fluid/fluid-background.js');
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load fluid background script'));
    document.body.appendChild(script);
  });

  return fluidLoadPromise;
}

