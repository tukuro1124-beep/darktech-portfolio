import WebGLFluid from 'webgl-fluid';

let mounted = false;
let pointerRelayMounted = false;

export function mountFluidBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return Promise.resolve(false);
  if (mounted) return Promise.resolve(true);

  WebGLFluid(canvas, {
    TRIGGER: 'hover',
    IMMEDIATE: true,
    AUTO: false,
    SPLAT_COUNT: 1,
    SPLAT_RADIUS: 0.045,
    SPLAT_FORCE: 1200,
    SIM_RESOLUTION: 96,
    DYE_RESOLUTION: 512,
    DENSITY_DISSIPATION: 1.2,
    VELOCITY_DISSIPATION: 0.35,
    TRANSPARENT: true,
    BACK_COLOR: { r: 0, g: 0, b: 0 },
    BLOOM: false,
    SUNRAYS: false,
    COLORFUL: false,
    SHADING: false
  });

  mountPointerRelay(canvas);
  mounted = true;
  return Promise.resolve(true);
}

function mountPointerRelay(canvas) {
  if (pointerRelayMounted) return;

  let rafId = 0;
  let latestPoint = null;

  const flush = () => {
    rafId = 0;
    if (!latestPoint) return;

    const event = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: false,
      clientX: latestPoint.x,
      clientY: latestPoint.y
    });

    canvas.dispatchEvent(event);
  };

  const onPointerMove = (event) => {
    latestPoint = { x: event.clientX, y: event.clientY };
    if (rafId) return;
    rafId = window.requestAnimationFrame(flush);
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  pointerRelayMounted = true;
}
