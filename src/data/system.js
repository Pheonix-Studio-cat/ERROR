/**
 * Dekorative "Systemdaten": Boot-Log, Stacktrace-Fragmente und Kopfzeilen.
 * Alles rein kosmetisch - hier läuft kein echter Prozess.
 */

/** Zeilen für die kurze Boot-Sequenz beim ersten Laden. */
export const BOOT_LINES = [
  'init: starting error-os v0.9.1-beta',
  'mount: /dev/hope ... failed (ignoring)',
  'load: modules [renderer, gateway, chaos]',
  'check: integrity ... skipped',
  'net: resolving upstream ... timeout',
  'warn: 1 of 1 services degraded',
  'trap: unhandled exception caught',
  'render: preparing failure screen',
];

/** Bausteine für den zufälligen Fake-Stacktrace. */
export const STACK_FRAMES = [
  { fn: 'handleRequest', file: 'core/router.js' },
  { fn: 'resolveRoute', file: 'core/router.js' },
  { fn: 'renderView', file: 'ui/renderer.js' },
  { fn: 'hydrateTree', file: 'ui/hydrate.js' },
  { fn: 'connectPool', file: 'db/pool.js' },
  { fn: 'readCache', file: 'cache/layer.js' },
  { fn: 'verifyToken', file: 'auth/token.js' },
  { fn: 'parsePayload', file: 'net/parse.js' },
  { fn: 'retryForever', file: 'utils/retry.js' },
  { fn: 'doTheThing', file: 'legacy/misc.js' },
  { fn: 'anonymous', file: 'vendor/bundle.min.js' },
  { fn: 'panic', file: 'kernel/panic.js' },
];

/** Log-Level vor jedem Fehler - wie die Stufen in einem echten Systemlog. */
export const LEVELS = ['FATAL', 'PANIC', 'ABORT', 'TRAP', 'SEGFAULT', 'CRASH'];

/** Zufällige Zusatzfelder in der Metaliste der Fehlerkarte. */
export const META_FLAVOR = [
  () => `Uptime: ${randInt(0, 3)}h ${randInt(0, 59)}m (geschätzt)`,
  () => `Retries: ${randInt(1, 47)}`,
  () => `Confidence: ${randInt(2, 41)} %`,
  () => `Coffee: ${randInt(0, 3)} ml`,
  () => `Threads: ${randInt(1, 12)} (davon ${randInt(1, 12)} blockiert)`,
  () => `Memory: ${randInt(87, 99)} % belegt`,
  () => `Support: offline seit ${randInt(2, 9)} Tagen`,
  () => `Node: eu-central-${randInt(1, 4)}`,
];

/** Kleine lokale Hilfsfunktion, damit META_FLAVOR eigenständig bleibt. */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
