import WebGLFluid from 'webgl-fluid';

let mounted = false;

export function mountFluidBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return Promise.resolve(false);
  if (mounted) return Promise.resolve(true);

  WebGLFluid(canvas, {
    IMMEDIATE: true,
    AUTO: true,
    INTERVAL: 1800,
    SPLAT_COUNT: 1,
    SPLAT_RADIUS: 0.06,
    SPLAT_FORCE: 1800,
    TRANSPARENT: true,
    BACK_COLOR: { r: 0, g: 0, b: 0 },
    BLOOM: false,
    SUNRAYS: false,
    COLORFUL: false
  });

  mounted = true;
  return Promise.resolve(true);
}
