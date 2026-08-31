/**
 * Seltene "Glitch-Events" (Standard: 1 % Chance pro Fehler).
 *
 * Jedes Event kann optional `fakeFix: true` setzen. Dann behauptet die Seite
 * kurz, sie sei repariert - und fällt danach wieder in einen Fehler zurück.
 * Die Witzzeilen liegen zweisprachig vor.
 */
export const SECRET_EVENTS = [
  {
    id: 'nothing',
    code: '000',
    title: 'Nothing happened.',
    joke: {
      en: ['Absolutely nothing happened.', 'Around here that counts as a success.'],
      de: ['Es ist absolut nichts passiert.', 'Das ist hier bereits ein Erfolg.'],
    },
    severity: 'probably fine',
  },
  {
    id: 'error-not-found',
    code: 'ERROR',
    title: 'ERROR: ERROR NOT FOUND',
    joke: {
      en: ['We could not find the error.', 'That is the error.'],
      de: ['Wir konnten den Fehler nicht finden.', 'Das ist der Fehler.'],
    },
    severity: 'unknown',
  },
  {
    id: 'fixed-nothing',
    code: '200',
    title: 'Congratulations! You fixed nothing.',
    joke: {
      en: ['Everything works.', 'Nobody knows why. That is the problem.'],
      de: ['Alles funktioniert.', 'Niemand weiss, warum. Das ist das Problem.'],
    },
    severity: 'suspicious',
  },
  {
    id: 'teapot',
    code: '418',
    title: "I'm still a teapot.",
    joke: {
      en: ['I am still a teapot.', 'That is not going to change.'],
      de: ['Ich bin immer noch eine Teekanne.', 'Daran wird sich nichts ändern.'],
    },
    severity: 'LOW',
  },
  {
    id: 'fake-fix',
    code: '200',
    title: 'System restored.',
    joke: {
      en: ['All systems are back to normal.', 'Finally.'],
      de: ['Alle Systeme laufen wieder normal.', 'Endlich.'],
    },
    severity: 'OK',
    fakeFix: true,
  },
  {
    id: 'self-aware',
    code: '???',
    title: 'This is a website.',
    joke: {
      en: ['Quick note: this site is not broken.', 'It is only pretending. Very convincingly.'],
      de: ['Kurzer Hinweis: Diese Seite ist nicht kaputt.', 'Sie tut nur so. Sehr überzeugend.'],
    },
    severity: 'meta',
  },
  {
    id: 'you-again',
    code: '429',
    title: 'You again.',
    joke: {
      en: ['You have been here a lot.', 'We are starting to worry.'],
      de: ['Du warst schon öfter hier.', 'Wir fangen an, uns Sorgen zu machen.'],
    },
    severity: 'MEDIUM',
  },
];
