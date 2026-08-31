/**
 * Kleine Zufalls-Helfer. Bewusst ohne Library - das ist alles, was wir brauchen.
 */

/** Ganzzahl zwischen min und max (beide inklusive). */
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Ein zufälliges Element aus einer Liste. */
export function pick(list) {
  return list[randInt(0, list.length - 1)];
}

/**
 * Wie `pick`, vermeidet aber ein bestimmtes Element (z. B. den letzten Fehler).
 * Fällt auf normales `pick` zurück, wenn die Liste zu klein ist.
 */
export function pickAvoiding(list, isBlocked) {
  const candidates = list.filter((item) => !isBlocked(item));
  return candidates.length > 0 ? pick(candidates) : pick(list);
}

/** Gewichtete Auswahl - Einträge brauchen ein `weight`-Feld. */
export function pickWeighted(list) {
  const total = list.reduce((sum, item) => sum + item.weight, 0);
  let ticket = Math.random() * total;

  for (const item of list) {
    ticket -= item.weight;
    if (ticket <= 0) return item;
  }
  return list[list.length - 1];
}

/** Wahr mit der angegebenen Wahrscheinlichkeit (0..1). */
export function chance(probability) {
  return Math.random() < probability;
}

/** Zufällige Hex-Gruppe, z. B. "7F3A". */
export function hexGroup(length = 4) {
  const chars = '0123456789ABCDEF';
  let out = '';
  for (let i = 0; i < length; i += 1) out += chars[randInt(0, chars.length - 1)];
  return out;
}

/** Error-ID im Format ERR-7F3A-91C2. */
export function makeErrorId() {
  return `ERR-${hexGroup()}-${hexGroup()}`;
}

/** Kopie der Liste in zufälliger Reihenfolge (Fisher-Yates). */
export function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Mehrere verschiedene Elemente aus einer Liste. */
export function sample(list, count) {
  return shuffle(list).slice(0, Math.min(count, list.length));
}
