/**
 * Winziger DOM-Helfer statt eines Frameworks.
 * Reicht völlig für eine Seite, die ohnehin nur so tut, als würde sie etwas tun.
 */

/**
 * Erzeugt ein Element.
 *
 * @param {string} tag                       - z. B. "div" oder "button"
 * @param {object} [props]                   - class, text, html, attrs, on (Events), ...
 * @param {(Node|string)[]} [children]       - Kindknoten
 */
export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  const { class: className, text, html, attrs, on, dataset, ...rest } = props;

  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  if (html !== undefined) node.innerHTML = html;

  Object.assign(node, rest);
  Object.entries(attrs ?? {}).forEach(([key, value]) => node.setAttribute(key, value));
  Object.entries(dataset ?? {}).forEach(([key, value]) => {
    node.dataset[key] = value;
  });
  Object.entries(on ?? {}).forEach(([event, handler]) => node.addEventListener(event, handler));

  toArray(children).forEach((child) => {
    if (child === null || child === undefined || child === false) return;
    node.append(child);
  });

  return node;
}

/** Kurzform für querySelector. */
export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

/** Respektiert die Systemeinstellung "Bewegung reduzieren". */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
