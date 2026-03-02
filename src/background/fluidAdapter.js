import WebGLFluid from 'webgl-fluid';

let mounted = false;

export function mountFluidBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return Promise.resolve(false);
  if (mounted) return Promise.resolve(true);

  WebGLFluid(canvas, {
    TRIGGER: 'hover',
    IMMEDIATE: true,
    AUTO: true,
    INTERVAL: 7000,
    SPLAT_COUNT: 2,
    SPLAT_RADIUS: 0.12,
    TRANSPARENT: true,
    BACK_COLOR: { r: 0, g: 0, b: 0 },
    BLOOM: false,
    SUNRAYS: false,
    COLORFUL: false,
    SHADING: true,
    PAUSED: false
  });

  mounted = true;
  return Promise.resolve(true);
}
