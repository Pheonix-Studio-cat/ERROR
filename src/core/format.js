/**
 * format.js - macht aus einem Fehler-Objekt fertige Terminalzeilen.
 *
 * Eine Zeile ist ein Array aus Segmenten: { text, cls }.
 * `cls` steuert nur die Farbe (wie ANSI-Farben in einem echten Terminal).
 */
import { toBanner } from './banner.js';

/** Leerzeile - häufig genug, um sie einmal zu benennen. */
const BLANK = [];

/**
 * @param {object} error - Ergebnis von generateError()
 * @returns {Array<Array<{text: string, cls?: string}>>}
 */
export function formatError(error) {
  const lines = [
    [
      { text: `[${error.timestamp}] `, cls: 'dim' },
      { text: error.level, cls: 'accent' },
      { text: `  ERROR ${error.code}`, cls: 'accent bold' },
      { text: ` · ${error.title}` },
    ],
    BLANK,
    // Der Fehlercode gross in Blockschrift.
    ...toBanner(error.code).map((row) => [{ text: row, cls: 'accent banner' }]),
    BLANK,
    [{ text: `  ${error.detail}`, cls: 'dim' }],
    BLANK,
    ...error.joke.map((line) => [{ text: `  „${line}“`, cls: 'joke' }]),
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
