/**
 * Texte für die Interaktionen.
 *
 * - SNARK      -> Antworten auf "I DON'T CARE" (frech, aber harmlos)
 * - CHAOS      -> besonders absurde Fehler für "MAKE IT WORSE"
 * - CHAOS_META -> zusätzliche Chaos-Zeilen für die Statusleiste
 */

/** Freche Antworten auf den "I DON'T CARE"-Button. */
export const SNARK = [
  'Das ist gegenseitig.',
  'Der Server auch nicht. Ihr passt gut zusammen.',
  'Notiert. Ignoriert.',
  'Deine Gleichgültigkeit wurde erfolgreich gespeichert. In /dev/null.',
  'Schön. Dann sind wir jetzt zu zweit.',
  'Interessant. Erzähl mehr. Nein, warte, doch nicht.',
  'Wir haben ein Ticket erstellt: "User is fine". Priorität: nie.',
  'Das war die emotional gesündeste Reaktion bisher.',
  'Verstanden. Ich mache trotzdem weiter kaputt.',
  'Danke für dein Feedback. Es wurde umgehend gelöscht.',
  'Du bist der 1.000.000ste Nutzer, dem das egal ist. Kein Preis.',
  'Gleichgültigkeit ist auch eine Form von Uptime.',
  'Ich melde das dem Server. Er interessiert sich ebenfalls nicht.',
  'Okay. Dann starre ich einfach weiter zurück.',
  'Deine Haltung wurde in die Doku aufgenommen. Niemand liest sie.',
  'Fair. Der Code hat sich auch nie für mich interessiert.',
  'Ich habe das an das zuständige Team weitergeleitet. Es gibt keins.',
  'Verdrängung: aktiviert. Systemstatus: unverändert kaputt.',
  'Du hast gerade den Support-Prozess übersprungen. Respekt.',
  'Wir speichern das als "wontfix". Wie alles hier.',
  'Alles klar. Ich bin dann mal beleidigt.',
  'Das habe ich mir notiert. Auf einem Post-it. Es ist runtergefallen.',
  'Deine Nichtreaktion wurde als kritischer Fehler eingestuft.',
  'Cool bleiben ist auch eine Strategie. Funktioniert hier nur nicht.',
];

/**
 * Absurde Eskalations-Fehler für "MAKE IT WORSE".
 * Bewusst unsinnige Codes - die Seite gibt hier jede Glaubwürdigkeit auf.
 */
export const CHAOS = [
  {
    code: '9001',
    title: 'Error level too high.',
    joke: ['Der Fehler ist jetzt größer als das Programm.', 'Gut gemacht.'],
  },
  {
    code: '0xDEAD',
    title: 'Memory returned nonsense.',
    joke: ['Der Arbeitsspeicher erzählt jetzt Geschichten.', 'Keine davon stimmt.'],
  },
  {
    code: '???',
    title: 'Unknown error type.',
    joke: ['Wir wissen nicht, was das ist.', 'Es war vorher nicht da.'],
  },
  {
    code: '-1',
    title: 'Negative error count.',
    joke: ['Es gibt jetzt weniger als null Fehler.', 'Das ist mathematisch beunruhigend.'],
  },
  {
    code: '404.404',
    title: 'Error page not found.',
    joke: ['Die Fehlerseite für den Fehler', 'ist ebenfalls nicht auffindbar.'],
  },
  {
    code: 'NaN',
    title: 'Result is not a number.',
    joke: ['Das Ergebnis ist keine Zahl.', 'Es ist auch sonst nichts.'],
  },
  {
    code: '500.500',
    title: 'Server error inside server error.',
    joke: ['Der Fehler hat einen Fehler geworfen.', 'Der Fehler nimmt es persönlich.'],
  },
  {
    code: '∞',
    title: 'Infinite recursion.',
    joke: ['Um diesen Fehler zu verstehen,', 'lies bitte zuerst diesen Fehler.'],
  },
  {
    code: 'C:\\',
    title: 'Wrong operating system.',
    joke: ['Wir sind versehentlich in einem', 'anderen Betriebssystem gelandet.'],
  },
  {
    code: '02:14',
    title: 'Deployed at night.',
    joke: ['Jemand hat nachts um 02:14 deployed.', 'Wir tragen alle die Folgen.'],
  },
  {
    code: 'ERR',
    title: 'Error while erroring.',
    joke: ['Beim Anzeigen des Fehlers', 'ist ein Fehler aufgetreten.'],
  },
  {
    code: '666',
    title: 'Cursed dependency.',
    joke: ['Ein Paket aus dem Jahr 2013', 'ist erwacht und sehr wütend.'],
  },
  {
    code: '¯\\_(ツ)_/¯',
    title: 'No further information.',
    joke: ['Das ist alles, was wir haben.', 'Wir haben ehrlich gesagt nie mehr gehabt.'],
  },
  {
    code: 'undefined',
    title: 'undefined is not a function.',
    joke: ['Klassiker. Immer noch nicht behoben.', 'Wird auch nie behoben.'],
  },
];

/** Zusätzliche Statuszeilen, die nur im Chaos-Modus erscheinen. */
export const CHAOS_META = [
  'Kühlung: manuell (jemand pustet)',
  'Backup-Strategie: Hoffnung',
  'Testabdeckung: 0.4 %',
  'Zuständigkeit: ungeklärt',
  'Letztes Review: nie',
  'Rollback: theoretisch möglich',
  'Dokumentation: mündlich überliefert',
  'Notfallplan: laut schreien',
];
