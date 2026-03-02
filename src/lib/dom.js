export function el(tag, className = '', attrs = {}, children = []) {
  const node = document.createElement(tag);

  if (className) {
    node.className = className;
  }

  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false) continue;

    if (key === 'dataset' && typeof value === 'object') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        if (dataValue !== undefined && dataValue !== null) {
          node.dataset[dataKey] = String(dataValue);
        }
      });
      continue;
    }

    if (value === true) {
      node.setAttribute(key, '');
      continue;
    }

    node.setAttribute(key, String(value));
  }

  const normalizedChildren = Array.isArray(children) ? children : [children];
  normalizedChildren.forEach((child) => {
    if (child === undefined || child === null) return;
    if (child instanceof Node) {
      node.appendChild(child);
    } else {
      node.appendChild(document.createTextNode(String(child)));
    }
  });

  return node;
}

export function txt(str) {
  return document.createTextNode(str ?? '');
}

export function setText(node, str) {
  if (!node) return;
  node.textContent = str ?? '';
}

export function clear(node) {
  if (!node) return;
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}
