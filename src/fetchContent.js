import { withBase } from './lib/basePath.js';

const cache = new Map();
let currentAbortController = null;
let lastGoodContent = null;

export function getContentUrl(lang) {
  return withBase(`/CV/portfolio.${lang}.json`);
}

export function setAbortController(ac) {
  if (currentAbortController) {
    currentAbortController.abort();
  }
  currentAbortController = ac;
}

export function getLastGoodContent() {
  return lastGoodContent;
}

export function setLastGoodContent(content) {
  lastGoodContent = content;
}

export async function loadContent(lang) {
  if (cache.has(lang)) {
    return cache.get(lang);
  }

  const controller = new AbortController();
  setAbortController(controller);

  const response = await fetch(getContentUrl(lang), {
    signal: controller.signal,
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Content fetch failed: ${response.status}`);
  }

  const data = await response.json();
  cache.set(lang, data);
  return data;
}
