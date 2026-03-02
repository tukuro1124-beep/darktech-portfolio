export function getBasePath() {
  const metaValue = document
    .querySelector('meta[name="base-path"]')
    ?.getAttribute('content')
    ?.trim();

  if (metaValue) {
    return normalizeBase(metaValue);
  }

  const envBase = import.meta.env.BASE_URL || '/';
  if (envBase && envBase !== '/' && envBase !== './' && envBase !== '.') {
    return normalizeBase(envBase);
  }

  if (location.hostname.endsWith('github.io')) {
    const firstSegment = location.pathname.split('/').filter(Boolean)[0];
    return firstSegment ? `/${firstSegment}/` : '/';
  }

  return '/';
}

export function withBase(path) {
  if (!path) return getBasePath();
  if (/^(https?:|mailto:)/i.test(path) || path.startsWith('#')) return path;

  const base = getBasePath();
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

  if (base === '/') {
    return `/${normalizedPath}`;
  }

  return `${base}${normalizedPath}`;
}

function normalizeBase(value) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === '/' || trimmed === './' || trimmed === '.') return '/';
  const noLeading = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  const noTrailing = noLeading.endsWith('/') ? noLeading.slice(0, -1) : noLeading;
  return `/${noTrailing}/`;
}
