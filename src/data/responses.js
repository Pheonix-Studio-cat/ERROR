/**
 * Texte für die Interaktionen - alle zweisprachig (`en` / `de`).
 *
 * - SNARK      -> Antworten auf "i don't care" (frech, aber harmlos)
 * - CHAOS      -> besonders absurde Fehler für "make it worse"
 * - CHAOS_META -> zusätzliche Chaos-Zeilen für die Fehlerausgabe
 */

/** Freche Antworten auf "i don't care". */
export const SNARK = [
  { en: 'The feeling is mutual.', de: 'Das ist gegenseitig.' },
  { en: 'Neither does the server. You two would get along.', de: 'Der Server auch nicht. Ihr passt gut zusammen.' },
  { en: 'Noted. Ignored.', de: 'Notiert. Ignoriert.' },
  { en: 'Your indifference has been saved successfully. To /dev/null.', de: 'Deine Gleichgültigkeit wurde erfolgreich gespeichert. In /dev/null.' },
  { en: 'Great. Now there are two of us.', de: 'Schön. Dann sind wir jetzt zu zweit.' },
  { en: 'Interesting. Tell me more. No, wait, do not.', de: 'Interessant. Erzähl mehr. Nein, warte, doch nicht.' },
  { en: 'We opened a ticket: "user is fine". Priority: never.', de: 'Wir haben ein Ticket erstellt: "User is fine". Priorität: nie.' },
  { en: 'That was the healthiest reaction so far.', de: 'Das war die emotional gesündeste Reaktion bisher.' },
  { en: 'Understood. I will keep breaking things anyway.', de: 'Verstanden. Ich mache trotzdem weiter kaputt.' },
  { en: 'Thank you for your feedback. It has been deleted.', de: 'Danke für dein Feedback. Es wurde umgehend gelöscht.' },
  { en: 'You are the 1,000,000th user who does not care. No prize.', de: 'Du bist der 1.000.000ste Nutzer, dem das egal ist. Kein Preis.' },
  { en: 'Indifference is a form of uptime too.', de: 'Gleichgültigkeit ist auch eine Form von Uptime.' },
  { en: 'I will report this to the server. It does not care either.', de: 'Ich melde das dem Server. Er interessiert sich ebenfalls nicht.' },
  { en: 'Fine. I will just keep staring back.', de: 'Okay. Dann starre ich einfach weiter zurück.' },
  { en: 'Your attitude has been added to the docs. Nobody reads them.', de: 'Deine Haltung wurde in die Doku aufgenommen. Niemand liest sie.' },
  { en: 'Fair. The code never cared about me either.', de: 'Fair. Der Code hat sich auch nie für mich interessiert.' },
  { en: 'I forwarded this to the responsible team. There is none.', de: 'Ich habe das an das zuständige Team weitergeleitet. Es gibt keins.' },
  { en: 'Denial: enabled. System status: still broken.', de: 'Verdrängung: aktiviert. Systemstatus: unverändert kaputt.' },
  { en: 'You just skipped the entire support process. Respect.', de: 'Du hast gerade den Support-Prozess übersprungen. Respekt.' },
  { en: 'Filed as wontfix. Like everything here.', de: 'Wir speichern das als "wontfix". Wie alles hier.' },
  { en: 'Understood. I will be offended in the background.', de: 'Alles klar. Ich bin dann mal beleidigt.' },
  { en: 'I wrote that down. On a sticky note. It fell off.', de: 'Das habe ich mir notiert. Auf einem Post-it. Es ist runtergefallen.' },
  { en: 'Your non-reaction has been classified as critical.', de: 'Deine Nichtreaktion wurde als kritischer Fehler eingestuft.' },
  { en: 'Staying calm is a valid strategy. It just does not work here.', de: 'Cool bleiben ist auch eine Strategie. Funktioniert hier nur nicht.' },
];

/**
 * Absurde Eskalations-Fehler für "make it worse".
 * Der Code und der technische Titel bleiben sprachneutral, nur der Witz wechselt.
 */
export const CHAOS = [
  {
    code: '9001',
    title: 'Error level too high.',
    joke: {
      en: ['The error is now larger than the program.', 'Well done.'],
      de: ['Der Fehler ist jetzt größer als das Programm.', 'Gut gemacht.'],
    },
  },
  {
    code: '0xDEAD',
    title: 'Memory returned nonsense.',
    joke: {
      en: ['The memory is telling stories now.', 'None of them are true.'],
      de: ['Der Arbeitsspeicher erzählt jetzt Geschichten.', 'Keine davon stimmt.'],
    },
  },
  {
    code: '???',
    title: 'Unknown error type.',
    joke: {
      en: ['We do not know what this is.', 'It was not here before.'],
      de: ['Wir wissen nicht, was das ist.', 'Es war vorher nicht da.'],
    },
  },
  {
    code: '-1',
    title: 'Negative error count.',
    joke: {
      en: ['There are now fewer than zero errors.', 'Mathematically worrying.'],
      de: ['Es gibt jetzt weniger als null Fehler.', 'Das ist mathematisch beunruhigend.'],
    },
  },
  {
    code: '404.404',
    title: 'Error page not found.',
    joke: {
      en: ['The error page for this error', 'cannot be found either.'],
      de: ['Die Fehlerseite für den Fehler', 'ist ebenfalls nicht auffindbar.'],
    },
  },
  {
    code: 'NaN',
    title: 'Result is not a number.',
    joke: {
      en: ['The result is not a number.', 'It is not anything else either.'],
      de: ['Das Ergebnis ist keine Zahl.', 'Es ist auch sonst nichts.'],
    },
  },
  {
    code: '500.500',
    title: 'Server error inside server error.',
    joke: {
      en: ['The error threw an error.', 'The error is taking it personally.'],
      de: ['Der Fehler hat einen Fehler geworfen.', 'Der Fehler nimmt es persönlich.'],
    },
  },
  {
    code: '∞',
    title: 'Infinite recursion.',
    joke: {
      en: ['To understand this error,', 'please read this error first.'],
      de: ['Um diesen Fehler zu verstehen,', 'lies bitte zuerst diesen Fehler.'],
    },
  },
  {
    code: 'C:\\',
    title: 'Wrong operating system.',
    joke: {
      en: ['We accidentally ended up', 'in a different operating system.'],
      de: ['Wir sind versehentlich in einem', 'anderen Betriebssystem gelandet.'],
    },
  },
  {
    code: '02:14',
    title: 'Deployed at night.',
    joke: {
      en: ['Somebody deployed at 02:14 in the morning.', 'We all carry the consequences.'],
      de: ['Jemand hat nachts um 02:14 deployed.', 'Wir tragen alle die Folgen.'],
    },
  },
  {
    code: 'ERR',
    title: 'Error while erroring.',
    joke: {
      en: ['An error occurred', 'while displaying the error.'],
      de: ['Beim Anzeigen des Fehlers', 'ist ein Fehler aufgetreten.'],
    },
  },
  {
    code: '¯\\_(ツ)_/¯',
    title: 'No further information.',
    joke: {
      en: ['That is all we have.', 'Honestly, we never had more.'],
      de: ['Das ist alles, was wir haben.', 'Wir haben ehrlich gesagt nie mehr gehabt.'],
    },
  },
  {
    code: 'undefined',
    title: 'undefined is not a function.',
    joke: {
      en: ['A classic. Still not fixed.', 'It never will be.'],
      de: ['Klassiker. Immer noch nicht behoben.', 'Wird auch nie behoben.'],
    },
  },
];

/** Zusätzliche Statuszeilen, die nur im Chaos-Modus erscheinen. */
export const CHAOS_META = [
  { en: 'Cooling: manual (someone is blowing on it)', de: 'Kühlung: manuell (jemand pustet)' },
  { en: 'Backup strategy: hope', de: 'Backup-Strategie: Hoffnung' },
  { en: 'Test coverage: 0.4 %', de: 'Testabdeckung: 0.4 %' },
  { en: 'Ownership: unclear', de: 'Zuständigkeit: ungeklärt' },
  { en: 'Last review: never', de: 'Letztes Review: nie' },
  { en: 'Rollback: theoretically possible', de: 'Rollback: theoretisch möglich' },
  { en: 'Documentation: passed down orally', de: 'Dokumentation: mündlich überliefert' },
  { en: 'Emergency plan: screaming', de: 'Notfallplan: laut schreien' },
];
