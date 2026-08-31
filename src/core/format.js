/**
 * format.js - macht aus einem Fehler-Objekt fertige Terminalzeilen.
 *
 * Eine Zeile ist ein Array aus Segmenten: { text, cls }.
 * `cls` steuert nur die Farbe (wie ANSI-Farben in einem echten Terminal).
 */
import { toBanner } from './banner.js';
import { getLanguage } from './i18n.js';

/** Leerzeile - häufig genug, um sie einmal zu benennen. */
const BLANK = [];

/** Anführungszeichen je Sprache - deutsche Zitate sehen anders aus. */
const QUOTES = {
  en: ['\u201c', '\u201d'],
  de: ['\u201e', '\u201c'],
};

/**
 * @param {object} error - Ergebnis von generateError()
 * @returns {Array<Array<{text: string, cls?: string}>>}
 */
export function formatError(error) {
  const lines = [
    [
      { text: `[${error.timestamp}] `, cls: 'dim' },
      { text: error.level, cls: 'accent' },
      // Kommt der Fehler aus dem Serverpool, steht der Knoten dabei.
      { text: error.source ? `  ${error.source}` : '', cls: 'faint' },
      { text: `  ERROR ${error.code}`, cls: 'accent bold' },
      { text: ` · ${error.title}` },
    ],
    BLANK,
    // Der Fehlercode gross in Blockschrift.
    ...toBanner(error.code).map((row) => [{ text: row, cls: 'accent banner' }]),
    BLANK,
    [{ text: `  ${error.detail}`, cls: 'dim' }],
    BLANK,
    ...error.joke.map((line) => {
      const [open, close] = QUOTES[getLanguage()] ?? QUOTES.en;
      return [{ text: `  ${open}${line}${close}`, cls: 'joke' }];
    }),
    BLANK,
    [
      { text: '  id=', cls: 'faint' },
      { text: error.errorId },
      { text: '  severity=', cls: 'faint' },
      { text: error.severity, cls: 'accent' },
      { text: '  module=', cls: 'faint' },
      { text: error.module },
    ],
  ];

  // Zusatzwerte wie "Retries: 12" als eigene Zeile, kompakt nebeneinander.
  if (error.meta.length > 0) {
    lines.push([
      { text: '  ', cls: 'faint' },
      { text: error.meta.join('   '), cls: 'faint' },
    ]);
  }

  lines.push(
    ...error.stack.map((frame) => [
      {
        text: `    at ${frame.fn} (${frame.file}:${frame.line}:${frame.column})`,
        cls: 'faint',
      },
    ]),
    BLANK,
  );

  return lines;
}
