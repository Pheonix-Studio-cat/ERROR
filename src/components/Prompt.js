/**
 * Prompt - die Eingabezeile.
 *
 * Sichtbar ist nur Text plus Blockcursor; das echte <input> liegt unsichtbar
 * darüber, damit Tastatur, Fokus und mobile Eingabe normal funktionieren.
 */
import { el } from '../core/dom.js';

/** Anklickbare Kurzbefehle - bewusst nur die Befehle, ohne Erklärung. */
const QUICK_COMMANDS = ['try again', 'make it worse', "i don't care"];

/**
 * @param {object} handlers
 * @param {(value: string) => void} handlers.onSubmit - Befehl abgeschickt
 */
export function createPrompt({ onSubmit }) {
  const mirror = el('span', { class: 'prompt__text' });
  const caret = el('span', { class: 'prompt__caret', attrs: { 'aria-hidden': 'true' } });

  const input = el('input', {
    class: 'prompt__input',
    type: 'text',
    attrs: {
      'aria-label': 'Befehl eingeben',
      autocomplete: 'off',
      autocapitalize: 'off',
      autocorrect: 'off',
      spellcheck: 'false',
      enterkeyhint: 'send',
    },
  });

  const line = el('div', { class: 'prompt__line' }, [
    el('span', { class: 'prompt__user', text: 'visitor@error.sys' }),
    el('span', { class: 'prompt__path', text: ':~$\u00a0' }),
    el('span', { class: 'prompt__field' }, [mirror, caret, input]),
  ]);

  // Schnellbefehle: klicken schreibt den Befehl und führt ihn aus.
  const quick = el(
    'div',
    { class: 'prompt__quick' },
    QUICK_COMMANDS.map((command) =>
      el('button', {
        class: 'quick',
        type: 'button',
        text: command,
        on: { click: () => submit(command) },
      }),
    ),
  );

  const root = el('div', { class: 'prompt' }, [line, quick]);

  input.addEventListener('input', () => {
    mirror.textContent = input.value;
  });

  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    submit(input.value);
  });

  function submit(value) {
    const command = value.trim();
    input.value = '';
    mirror.textContent = '';

    // Nach einem Klick auf einen Schnellbefehl gehört der Cursor zurück in die
    // Zeile. Auf Touch-Geräten nicht - dort würde sonst die Tastatur aufspringen.
    if (window.matchMedia('(hover: hover)').matches) focus();

    if (command) onSubmit(command);
  }

  function focus() {
    if (input.disabled) return;
    input.focus({ preventScroll: true });
  }

  /** Sperrt die Eingabe, solange das System "beschäftigt" ist. */
  function setBusy(busy) {
    input.disabled = busy;
    root.classList.toggle('is-busy', busy);
    quick.querySelectorAll('button').forEach((button) => {
      button.disabled = busy;
    });
    if (!busy) focus();
  }

  return { el: root, focus, setBusy };
}
