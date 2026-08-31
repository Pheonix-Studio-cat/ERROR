/**
 * Seltene "Glitch-Events" (Standard: 1 % Chance pro Fehler).
 *
 * Jedes Event kann optional `fakeFix: true` setzen. Dann behauptet die Seite
 * kurz, sie sei repariert - und fällt danach wieder in einen Fehler zurück.
 */
export const SECRET_EVENTS = [
  {
    id: 'nothing',
    code: '000',
    title: 'Nothing happened.',
    joke: ['Es ist absolut nichts passiert.', 'Das ist hier bereits ein Erfolg.'],
    severity: 'probably fine',
  },
  {
    id: 'error-not-found',
    code: 'ERROR',
    title: 'ERROR: ERROR NOT FOUND',
    joke: ['Wir konnten den Fehler nicht finden.', 'Das ist der Fehler.'],
    severity: 'unknown',
  },
  {
    id: 'fixed-nothing',
    code: '200',
    title: 'Congratulations! You fixed nothing.',
    joke: ['Alles funktioniert.', 'Niemand weiss, warum. Das ist das Problem.'],
    severity: 'suspicious',
  },
  {
    id: 'teapot',
    code: '418',
    title: "I'm still a teapot.",
    joke: ['Ich bin immer noch eine Teekanne.', 'Daran wird sich nichts ändern.'],
    severity: 'LOW',
  },
  {
    id: 'fake-fix',
    code: '200',
    title: 'System restored.',
    joke: ['Alle Systeme laufen wieder normal.', 'Endlich.'],
    severity: 'OK',
    fakeFix: true,
  },
  {
    id: 'self-aware',
    code: '???',
    title: 'This is a website.',
    joke: ['Kurzer Hinweis: Diese Seite ist nicht kaputt.', 'Sie tut nur so. Sehr überzeugend.'],
    severity: 'meta',
  },
  {
    id: 'you-again',
    code: '429',
    title: 'You again.',
    joke: ['Du warst schon öfter hier.', 'Wir fangen an, uns Sorgen zu machen.'],
    severity: 'MEDIUM',
  },
];
