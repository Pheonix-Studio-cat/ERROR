/**
 * Merkt sich ein paar Kleinigkeiten zwischen zwei Seitenaufrufen: die gewählte
 * Sprache, den zuletzt gezeigten Fehlercode (damit er sich nicht direkt
 * wiederholt), die Anzahl der Besuche und wie oft schon eskaliert wurde.
 *
 * Alles optional: Wenn localStorage blockiert ist (privates Fenster,
 * strenge Browser-Einstellungen), läuft die Seite trotzdem normal weiter.
 */
const STORAGE_KEY = 'error-site::memory';

const DEFAULTS = {
  lang: null,
  lastCode: null,
  lastJoke: null,
  visits: 0,
  worseCount: 0,
  secretsFound: [],
};

/** Liest den gespeicherten Zustand - fällt bei Problemen auf Defaults zurück. */
export function loadMemory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

/** Schreibt den Zustand zurück. Fehler werden bewusst geschluckt. */
export function saveMemory(memory) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch {
    /* Speichern ist ein Bonus, kein Muss. */
  }
}
