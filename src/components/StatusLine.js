/**
 * StatusLine - schmale Leiste am unteren Rand, wie die Statuszeile in tmux.
 * Zeigt nur Werte, keine Erklärungen.
 */
import { el } from '../core/dom.js';

export function createStatusLine() {
  const status = el('span', { class: 'statusline__value', text: 'BOOTING' });
  const errors = el('span', { class: 'statusline__value', text: '0' });
  const chaos = el('span', { class: 'statusline__value', text: '0%' });
  const clock = el('span', { class: 'statusline__clock', text: '--:--:--' });

  const root = el('div', { class: 'statusline' }, [
    el('span', { class: 'statusline__tag', text: 'error.sys' }),
    el('span', { class: 'statusline__cell' }, [
      el('span', { class: 'statusline__key', text: 'status:' }),
      status,
    ]),
    el('span', { class: 'statusline__cell' }, [
      el('span', { class: 'statusline__key', text: 'errors:' }),
      errors,
    ]),
    el('span', { class: 'statusline__cell statusline__cell--chaos' }, [
      el('span', { class: 'statusline__key', text: 'chaos:' }),
      chaos,
    ]),
    clock,
  ]);

  /** Uhrzeit läuft mit - ein Terminal steht schliesslich nie still. */
  function startClock() {
    const tick = () => {
      clock.textContent = new Date().toLocaleTimeString('de-CH', { hour12: false });
    };
    tick();
    setInterval(tick, 1000);
  }

  function render({ errorCount, chaosLevel, label }) {
    status.textContent = label;
    errors.textContent = String(errorCount);
    chaos.textContent = `${chaosLevel}%`;
    root.dataset.chaos = chaosLevel >= 70 ? 'high' : chaosLevel >= 35 ? 'mid' : 'low';
  }

  return { el: root, render, startClock };
}
