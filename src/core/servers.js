/**
 * servers.js - der Serverpool.
 *
 * Es gibt hier natürlich keine echten Server. Der Pool ist eine Maschine, die
 * mehrere unabhängige Fehlerquellen parallel laufen lässt:
 *
 * - mehr Knoten  -> mehr Fehler pro Minute -> seltene Glitches tauchen früher auf
 * - jeder Knoten hat eine eigene Last; wird sie zu hoch, startet genau dieser
 *   Knoten neu, während alle anderen ungerührt weiterlaufen
 * - unter Last feuert ein Knoten schneller (das ist der Reiz - und der Grund,
 *   warum das Tablet danach wärmer ist)
 *
 * Damit die Seite dabei nie wirklich kaputtgeht, gelten harte Grenzen:
 * MAX_SERVERS Knoten, ein globaler Mindestabstand zwischen zwei Fehlern und
 * keine Ausgabe, solange der Tab im Hintergrund liegt.
 */
import { randInt } from './random.js';
import { REGIONS } from '../data/system.js';

/** Mehr passt nicht ins Rack. Und nicht in einen Browser-Tab. */
export const MAX_SERVERS = 6;

/** Globaler Mindestabstand zwischen zwei ausgegebenen Fehlern (ms). */
const MIN_GAP = 380;

/** Taktabstand eines entspannten Knotens (ms). */
const IDLE_MIN = 7000;
const IDLE_MAX = 14000;

/** Taktabstand eines Knotens unter Volllast (ms). */
const BUSY_MIN = 1100;
const BUSY_MAX = 2400;

/** Last, ab der ein Knoten aussteigt. */
const OVERLOAD = 100;

/** Wie lange ein Knoten zum Neustart braucht (ms). */
const REBOOT_MIN = 7000;
const REBOOT_MAX = 12000;

/**
 * @param {object} handlers
 * @param {(server: object) => Promise<void>} handlers.onError - ein Knoten liefert einen Fehler
 * @param {(event: string, server: object) => void} handlers.onNotice - Überlast, Neustart, ...
 * @param {() => void} handlers.onChange - Pool hat sich verändert (für die Anzeige)
 */
export function createServerPool({ onError, onNotice, onChange }) {
  const servers = [];
  let counter = 0;
  let lastEmit = 0;
  let paused = false;

  /**
   * Startet einen weiteren Knoten.
   * @returns {object|null} der neue Knoten oder null, wenn das Rack voll ist
   */
  function add() {
    if (servers.length >= MAX_SERVERS) return null;

    counter += 1;
    const server = {
      id: `srv-${String(counter).padStart(2, '0')}`,
      region: REGIONS[(counter - 1) % REGIONS.length],
      state: 'online',
      load: 0,
      errors: 0,
      timer: null,
    };

    servers.push(server);
    schedule(server);
    onChange();
    return server;
  }

  /**
   * Nimmt einen Knoten aus dem Pool. Der letzte bleibt stehen -
   * ganz ohne Fehlerquelle wäre die Seite ja plötzlich in Ordnung.
   * @returns {object|null} der entfernte Knoten
   */
  function kill(id) {
    if (servers.length <= 1) return null;

    const index = servers.findIndex((server) => server.id === id);
    if (index === -1) return null;

    const [server] = servers.splice(index, 1);
    clearTimeout(server.timer);
    onChange();
    return server;
  }

  /**
   * Erhöht die Last nach "make it worse".
   *
   * Der Schlag trifft bewusst nur einen Knoten voll - und zwar den, der ohnehin
   * schon am meisten zu tun hat. Wer mehrfach eskaliert, legt damit zuverlässig
   * einen Knoten lahm, während die übrigen nur einen Bruchteil abbekommen und
   * weiterlaufen. Genau dafür gibt es ja mehrere.
   */
  function boost(amount) {
    const online = servers.filter((server) => server.state === 'online');
    if (online.length === 0) return;

    const target = online.reduce((worst, server) => (server.load > worst.load ? server : worst));

    online.forEach((server) => {
      raiseLoad(server, server === target ? amount : Math.round(amount / 5));

      // Wer damit über die Grenze kommt, steigt sofort aus - nicht erst beim
      // nächsten Takt. Alle anderen bekommen den neuen, kürzeren Takt.
      if (server.load >= OVERLOAD) overload(server);
      else schedule(server);
    });
    onChange();
  }

  /** Hält den Pool an (z. B. während der Screen weg ist). */
  function pause() {
    paused = true;
    servers.forEach((server) => clearTimeout(server.timer));
  }

  /** Lässt den Pool weiterlaufen. */
  function resume() {
    paused = false;
    servers.forEach((server) => {
      if (server.state === 'online') schedule(server);
    });
  }

  /** Kopie der Knotenliste für die Anzeige. */
  function list() {
    return servers.map(({ timer, ...rest }) => ({ ...rest }));
  }

  function count() {
    return servers.length;
  }

  /** Gibt es diesen Knoten überhaupt? */
  function has(id) {
    return servers.some((server) => server.id === id);
  }

  // --- Innenleben -----------------------------------------------------------

  /** Plant den nächsten Fehler dieses Knotens ein. */
  function schedule(server) {
    clearTimeout(server.timer);
    if (paused || server.state !== 'online') return;

    server.timer = setTimeout(() => tick(server), delayFor(server));
  }

  /**
   * Der Taktabstand sinkt mit steigender Last - ein überlasteter Knoten
   * spuckt schneller Fehler aus, bis er aussteigt.
   */
  function delayFor(server) {
    const pressure = Math.min(server.load, OVERLOAD) / OVERLOAD;
    const min = IDLE_MIN + (BUSY_MIN - IDLE_MIN) * pressure;
    const max = IDLE_MAX + (BUSY_MAX - IDLE_MAX) * pressure;
    return randInt(Math.round(min), Math.round(max));
  }

  async function tick(server) {
    if (paused || server.state !== 'online') return;

    // Im Hintergrund wird nichts ausgegeben, und zwei Fehler im selben
    // Sekundenbruchteil sind auch niemandem geholfen.
    const now = Date.now();
    if (document.hidden || now - lastEmit < MIN_GAP) {
      server.timer = setTimeout(() => tick(server), MIN_GAP);
      return;
    }

    lastEmit = now;
    server.errors += 1;
    raiseLoad(server, randInt(9, 19));
    cooldownOthers(server);

    await onError(server);

    if (server.load >= OVERLOAD) return overload(server);
    onChange();
    schedule(server);
  }

  function raiseLoad(server, amount) {
    server.load = Math.min(OVERLOAD, server.load + amount);
  }

  /** Wer gerade nicht dran ist, erholt sich ein wenig. */
  function cooldownOthers(active) {
    servers.forEach((server) => {
      if (server !== active && server.state === 'online') {
        server.load = Math.max(0, server.load - 6);
      }
    });
  }

  /** Ein Knoten steigt aus - und kommt von selbst zurück. */
  function overload(server) {
    server.state = 'rebooting';
    clearTimeout(server.timer);
    onNotice('overload', server);
    onChange();

    // Ist sonst niemand mehr online, kommt dieser Knoten schneller zurück -
    // eine Seite ganz ohne Fehler wäre schliesslich verdächtig.
    const alone = servers.every((entry) => entry === server || entry.state !== 'online');
    const wait = alone ? randInt(2500, 4000) : randInt(REBOOT_MIN, REBOOT_MAX);

    server.timer = setTimeout(() => {
      server.state = 'online';
      server.load = 0;
      onNotice('back', server);
      onChange();
      schedule(server);
    }, wait);
  }

  return { add, kill, boost, pause, resume, list, count, has };
}
