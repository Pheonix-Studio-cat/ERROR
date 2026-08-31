/**
 * Terminal - die Ausgabefläche.
 *
 * Verhält sich wie ein echtes Terminal: Zeilen werden unten angehängt,
 * die Ansicht scrollt mit, alte Zeilen fallen irgendwann raus.
 */
import { el, prefersReducedMotion } from '../core/dom.js';

/** Maximale Anzahl Zeilen im DOM - danach wird oben abgeschnitten. */
const MAX_LINES = 700;

/** Verzögerung zwischen zwei Ausgabezeilen (ms). */
const LINE_DELAY = 26;

export function createTerminal() {
  const out = el('div', { class: 'term__out' });
  const slot = el('div', { class: 'term__slot' });

  const root = el('div', {
    class: 'term',
    attrs: { role: 'log', 'aria-live': 'polite', 'aria-label': 'Systemausgabe' },
  }, [out, slot]);

  /** Nimmt das Prompt-Element auf, damit es direkt unter der Ausgabe sitzt. */
  function attachPrompt(node) {
    slot.replaceChildren(node);
  }

  /**
   * Hängt eine einzelne Zeile an.
   *
   * Läuft gerade ein gestaffelter Block, wird dieser zuerst fertig geschrieben -
   * sonst landet die neue Zeile mitten in einem Fehlerblock.
   *
   * @param {Array<{text: string, cls?: string}>|string} line
   * @returns {HTMLElement} die erzeugte Zeile (für den Tipp-Effekt)
   */
  function print(line) {
    flush();
    return appendLine(line);
  }

  /** Der eigentliche Anhang - ohne Rücksicht auf laufende Blöcke. */
  function appendLine(line) {
    const segments = typeof line === 'string' ? [{ text: line }] : line;

    const node = el(
      'div',
      { class: 'term__line' },
      segments.map((segment) => el('span', { class: segment.cls ?? '', text: segment.text })),
    );

    out.append(node);
    while (out.childElementCount > MAX_LINES) out.firstElementChild.remove();
    scrollToEnd();
    return node;
  }

  /** Die gerade laufende, gestaffelte Ausgabe (immer höchstens eine). */
  let running = null;

  /**
   * Gibt mehrere Zeilen nacheinander aus - das erzeugt den "Log läuft"-Effekt.
   *
   * Läuft noch eine ältere Ausgabe, wird diese sofort zu Ende geschrieben.
   * Sonst würden sich zwei Blöcke ineinander schieben (etwa wenn der
   * Dauerbetrieb feuert, während gerade ein Befehl ausgegeben wird).
   *
   * @returns {Promise<void>} erfüllt, wenn die letzte Zeile steht
   */
  function printLines(lines) {
    flush();

    if (prefersReducedMotion()) {
      lines.forEach(appendLine);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const job = { lines, index: 0, resolve, timer: null };

      job.timer = setInterval(() => {
        appendLine(job.lines[job.index]);
        job.index += 1;
        if (job.index >= job.lines.length) finish(job);
      }, LINE_DELAY);

      running = job;
    });
  }

  /** Schreibt eine noch laufende Ausgabe sofort fertig. */
  function flush() {
    if (!running) return;

    const job = running;
    running = null; // erst freigeben, damit appendLine nicht erneut flusht
    clearInterval(job.timer);

    while (job.index < job.lines.length) {
      appendLine(job.lines[job.index]);
      job.index += 1;
    }
    finish(job);
  }

  function finish(job) {
    clearInterval(job.timer);
    if (running === job) running = null;
    job.resolve();
  }

  /**
   * Tippt einen Befehl zeichenweise in eine bereits gedruckte Zeile.
   * @param {HTMLElement} lineNode - Rückgabewert von print()
   * @param {string} text
   */
  function typeInto(lineNode, text) {
    const target = el('span', { class: 'cmd' });
    lineNode.append(target);

    if (prefersReducedMotion()) {
      target.textContent = text;
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      let index = 0;
      const timer = setInterval(() => {
        target.textContent += text[index];
        index += 1;
        scrollToEnd();
        if (index >= text.length) {
          clearInterval(timer);
          resolve();
        }
      }, 34);
    });
  }

  /** Leert den Bildschirm (Befehl "clear"). */
  function clear() {
    flush();
    out.replaceChildren();
  }

  function scrollToEnd() {
    root.scrollTop = root.scrollHeight;
  }

  return { el: root, out, attachPrompt, print, printLines, typeInto, clear, scrollToEnd };
}
