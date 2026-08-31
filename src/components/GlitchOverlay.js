/**
 * GlitchOverlay - Scanlines, Vignette und gelegentliches Flackern.
 *
 * Die Effekte laufen rein dekorativ über der Seite (pointer-events: none)
 * und werden bei "Bewegung reduzieren" komplett abgeschaltet.
 */
import { el, prefersReducedMotion } from '../core/dom.js';

/** Zeitfenster zwischen zwei zufälligen Flacker-Momenten (ms). */
const FLICKER_MIN = 4000;
const FLICKER_MAX = 11000;

export function createGlitchOverlay() {
  const root = el('div', {
    class: 'glitch-overlay',
    attrs: { 'aria-hidden': 'true' },
  }, [
    el('div', { class: 'glitch-overlay__scanlines' }),
    el('div', { class: 'glitch-overlay__flicker' }),
    el('div', { class: 'glitch-overlay__bar' }),
  ]);

  let timer = null;

  /** Startet das dezente Zufallsflackern. */
  function start() {
    if (prefersReducedMotion()) return;
    schedule();
  }

  function schedule() {
    const delay = FLICKER_MIN + Math.random() * (FLICKER_MAX - FLICKER_MIN);
    timer = setTimeout(() => {
      pulse('is-flickering', 260);
      schedule();
    }, delay);
  }

  /** Kräftiger Glitch-Stoss - wird bei Aktionen ausgelöst. */
  function burst(strength = 'normal') {
    if (prefersReducedMotion()) return;
    pulse(strength === 'hard' ? 'is-bursting-hard' : 'is-bursting', 520);
  }

  function pulse(className, duration) {
    root.classList.add(className);
    setTimeout(() => root.classList.remove(className), duration);
  }

  function stop() {
    clearTimeout(timer);
  }

  return { el: root, start, stop, burst };
}
