export function safeHref(rawHref) {
  if (typeof rawHref !== 'string') return null;
  const href = rawHref.trim();
  if (!href) return null;

  if (href.startsWith('#')) {
    return href;
  }

  try {
    const parsed = new URL(href, location.origin);

    if (parsed.protocol === 'mailto:') {
      return parsed.href;
    }

    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      if (parsed.origin === location.origin && !/^https?:\/\//i.test(href)) {
        return `${parsed.pathname}${parsed.search}${parsed.hash}`;
      }

      return parsed.href;
    }
  } catch {
    return null;
  }

  return null;
}

export function isExternalHref(href) {
  if (!href) return false;
  if (href.startsWith('#') || href.startsWith('/')) return false;

  try {
    const parsed = new URL(href, location.origin);
    return parsed.origin !== location.origin && /^https?:$/i.test(parsed.protocol);
  } catch {
    return false;
  }
}
