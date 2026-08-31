/**
 * i18n.js - Sprachumschaltung zwischen Englisch und Deutsch.
 *
 * Zwei Arten von Text:
 * - UI-Texte aus dem Wörterbuch unten  -> t('key')
 * - Datentexte im Format { en, de }    -> text(entry)
 *
 * Kurze Log-Zeilen wie "retrying ..." oder "command not found" bleiben in
 * beiden Sprachen englisch - so klingt ein echtes Terminal.
 */

/** Unterstützte Sprachen. Die erste ist die Rückfallebene. */
export const LANGUAGES = ['en', 'de'];

const DICT = {
  en: {
    tagline: 'Only errors. Around the clock.',
    anyway: 'anyway:',
    notFoundHint: '   (there are only errors here anyway)',
    helpHeader: 'available commands',
    cleared: 'screen cleared. errors not.',
    exitReply: 'There is no way out. Only more errors.',
    whoami: 'someone staring at a broken website',
    pwd: '/var/log/nothing',
    cat: 'meow',
    sudo: 'Nice try.',
    ls: 'errors/   errors.bak/   errors_final/   errors_final_2/',
    secretDetail: 'This event was not part of the plan.',
    fixApplied: 'fix applied to the wrong module',
    langSet: 'language: english',
    langUsage: 'usage: lang en | lang de',
    serversHeader: 'server pool',
    serversHint: 'more nodes, more errors. your device is doing all of this.',
    serversMax: 'six nodes. your device is now part of the joke.',
    serverFull: 'rack is full. six nodes is plenty for one browser tab.',
    serverLast: 'that is the last node. somebody has to produce the errors.',
    serverUnknown: 'no such node.',
    serverUsage: 'usage: servers | server add | server kill <id>',
    rareFound: 'rare errors found',
  },
  de: {
    tagline: 'Nur Fehler. Rund um die Uhr.',
    anyway: 'trotzdem:',
    notFoundHint: '   (hier gibt es sowieso nur Fehler)',
    helpHeader: 'verfügbare Befehle',
    cleared: 'Bildschirm geleert. Die Fehler nicht.',
    exitReply: 'Es gibt keinen Ausgang. Nur weitere Fehler.',
    whoami: 'jemand, der auf eine kaputte Seite starrt',
    pwd: '/var/log/nichts',
    cat: 'miau',
    sudo: 'Netter Versuch.',
    ls: 'fehler/   fehler.bak/   fehler_final/   fehler_final_2/',
    secretDetail: 'Dieses Ereignis war nicht vorgesehen.',
    fixApplied: 'fix applied to the wrong module',
    langSet: 'Sprache: Deutsch',
    langUsage: 'Verwendung: lang en | lang de',
    serversHeader: 'Serverpool',
    serversHint: 'Mehr Knoten, mehr Fehler. Dein Gerät macht das alles.',
    serversMax: 'Sechs Knoten. Dein Gerät ist jetzt Teil des Witzes.',
    serverFull: 'Das Rack ist voll. Sechs Knoten sind für einen Browser-Tab genug.',
    serverLast: 'Das ist der letzte Knoten. Irgendwer muss die Fehler ja liefern.',
    serverUnknown: 'Diesen Knoten gibt es nicht.',
    serverUsage: 'Verwendung: servers | server add | server kill <id>',
    rareFound: 'seltene Fehler gefunden',
  },
};

let current = LANGUAGES[0];

/** Alle, die über einen Sprachwechsel informiert werden wollen. */
const listeners = new Set();

/** Rät die Startsprache aus den Browsereinstellungen. */
export function detectLanguage() {
  const preferred = globalThis.navigator?.language ?? '';
  return preferred.toLowerCase().startsWith('de') ? 'de' : 'en';
}

export function getLanguage() {
  return current;
}

/**
 * Setzt die Sprache und benachrichtigt alle Interessenten.
 * @returns {boolean} true, wenn sich tatsächlich etwas geändert hat
 */
export function setLanguage(lang) {
  if (!LANGUAGES.includes(lang) || lang === current) return false;

  current = lang;
  if (typeof document !== 'undefined') document.documentElement.lang = lang;
  listeners.forEach((listener) => listener(lang));
  return true;
}

/** Meldet einen Beobachter an (z. B. die Prompt-Anzeige). */
export function onLanguageChange(listener) {
  listeners.add(listener);
}

/** UI-Text aus dem Wörterbuch. */
export function t(key) {
  return DICT[current][key] ?? DICT.en[key] ?? key;
}

/** Datentext im Format { en, de } - fällt notfalls auf Englisch zurück. */
export function text(entry) {
  return entry?.[current] ?? entry?.en ?? entry;
}
