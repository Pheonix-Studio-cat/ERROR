/**
 * GlitchEngine - führt die kurzen Bildstörungen der Glitch-Fehler aus.
 *
 * Regeln, die hier bewusst hart eingehalten werden:
 * - immer nur EINE Sequenz gleichzeitig (ein neuer Lauf bricht den alten sauber ab)
 * - jeder Effekt ist zeitlich begrenzt; alle Timer werden mitgeführt und beendet
 * - am Ende wird jede Klasse entfernt und jeder veränderte Text wiederhergestellt
 * - keine Endlosschleifen, keine Dauereffekte, kein Ton
 * - bei "Bewegung reduzieren" passiert gar nichts
 */
import { el, prefersReducedMotion } from '../core/dom.js';

/** Zeichen, aus denen die Textkorruption gebaut wird. */
const NOISE = '█▓▒░#%&@≠¤§◆◇';

/** Laufzeiten der einzelnen Effekte (ms) - alles bleibt kurz. */
const DURATION = {
  rgb: 700,
  jitter: 600,
  tear: 700,
  shift: 600,
  sway: 2400,
  corrupt: 520,
};

/** Verzögerung, bis der Effekt nach der Fehlerausgabe startet. */
const START_DELAY = 550;

/** Der Screen wird zwischen 0,3 und 1 Sekunde schwarz. */
const BLACKOUT_MIN = 300;
const BLACKOUT_MAX = 1000;

/**
 * @param {object} options
 * @param {HTMLElement} options.screen - Wurzelelement, das die Klassen bekommt
 * @param {HTMLElement} options.output - Bereich, dessen Text korrumpiert werden darf
 */
export function createGlitchEngine({ screen, output }) {
  const voidText = el('pre', { class: 'gfx__void' });

  const overlay = el('div', {
    class: 'gfx',
    attrs: { 'aria-hidden': 'true' },
  }, [voidText]);

  /** Löst den gerade laufenden run()-Aufruf auf (immer höchstens einer). */
  let settle = null;
  /** Alle laufenden Timer - werden bei stop() restlos abgeräumt. */
  let timers = [];
  /** Gesicherte Originaltexte der korrumpierten Zeilen. */
  let corrupted = [];
  /** Alle gesetzten Effektklassen. */
  let classes = [];

  /**
   * Spielt die Effekte eines Glitch-Fehlers ab.
   * @param {object} error - Fehler mit `effects`
   * @returns {Promise<void>} erfüllt, wenn alles wieder sauber ist
   */
  function run(error) {
    stop();

    const effects = error.effects ?? [];
    if (effects.length === 0 || prefersReducedMotion()) return Promise.resolve();

    return new Promise((resolve) => {
      // stop() erfüllt dieses Promise - auch dann, wenn ein neuer Glitch
      // dazwischenfunkt. Sonst würde der Aufrufer ewig warten.
      settle = resolve;

      let pending = effects.length;

      const done = () => {
        pending -= 1;
        if (pending <= 0) stop();
      };

      effects.forEach((effect) => {
        after(START_DELAY, () => startEffect(effect, done));
      });
    });
  }

  /** Startet einen einzelnen Effekt und meldet sich, wenn er fertig ist. */
  function startEffect(effect, done) {
    if (effect === 'corrupt') return runCorruption(done);
    if (effect === 'blackout') return runBlackout(done);
    if (effect === 'void') return runVoid(done);

    // Alle rein visuellen Effekte laufen über eine CSS-Klasse.
    return runClass(`gfx-${effect}`, DURATION[effect] ?? 600, done);
  }

  /** Setzt eine Klasse auf den Screen und nimmt sie danach wieder weg. */
  function runClass(className, duration, done) {
    screen.classList.add(className);
    classes.push(className);

    after(duration, () => {
      screen.classList.remove(className);
      classes = classes.filter((entry) => entry !== className);
      done();
    });
  }

  /** Kippt einzelne Zeichen kurz in Blockgrafik und stellt sie danach her. */
  function runCorruption(done) {
    const lines = [...output.querySelectorAll('.term__line > span')]
      .slice(-40)
      .filter((node) => node.textContent.trim().length > 3);

    // Nur eine Handvoll Zeilen anfassen - das reicht optisch völlig.
    corrupted = pickSome(lines, 12).map((node) => ({ node, text: node.textContent }));

    const wave = () => {
      corrupted.forEach(({ node, text }) => {
        node.textContent = scramble(text);
      });
    };

    wave();
    after(DURATION.corrupt / 3, wave);
    after((DURATION.corrupt / 3) * 2, wave);
    after(DURATION.corrupt, () => {
      restoreText();
      done();
    });
  }

  /** Screen wird kurz komplett schwarz. */
  function runBlackout(done) {
    const duration = BLACKOUT_MIN + Math.random() * (BLACKOUT_MAX - BLACKOUT_MIN);

    overlay.classList.add('is-black');
    after(duration, () => {
      overlay.classList.remove('is-black');
      done();
    });
  }

  /** Der extrem seltene Fall: der Screen verschwindet und meldet sich kurz. */
  function runVoid(done) {
    const steps = [
      [0, '...'],
      [260, '...\n...'],
      [520, '...\n...\n...'],
      [1000, '...\n...\n...\n\noh.'],
      [1450, '...\n...\n...\n\noh.\n\nERROR.'],
    ];

    voidText.textContent = '';
    overlay.classList.add('is-void');

    steps.forEach(([delay, text]) => {
      after(delay, () => {
        voidText.textContent = text;
      });
    });

    after(2200, () => {
      overlay.classList.remove('is-void');
      voidText.textContent = '';
      done();
    });
  }

  /** Beendet alles sofort und hinterlässt einen sauberen Bildschirm. */
  function stop() {
    timers.forEach(clearTimeout);
    timers = [];

    classes.forEach((className) => screen.classList.remove(className));
    classes = [];

    overlay.classList.remove('is-black', 'is-void');
    voidText.textContent = '';
    restoreText();

    // Erst freigeben, dann auflösen - ein neuer Lauf darf sofort starten.
    const resolve = settle;
    settle = null;
    if (resolve) resolve();
  }

  function restoreText() {
    corrupted.forEach(({ node, text }) => {
      node.textContent = text;
    });
    corrupted = [];
  }

  /** setTimeout, das seinen Timer für stop() mitschreibt. */
  function after(delay, fn) {
    timers.push(setTimeout(fn, delay));
  }

  return { el: overlay, run, stop };
}

/** Ersetzt rund ein Fünftel der Zeichen durch Blockgrafik. */
function scramble(text) {
  return [...text]
    .map((char) =>
      char !== ' ' && Math.random() < 0.2
        ? NOISE[Math.floor(Math.random() * NOISE.length)]
        : char,
    )
    .join('');
}

/** Zufällige Auswahl ohne Wiederholung. */
function pickSome(list, count) {
  const copy = [...list];
  const out = [];

  while (copy.length > 0 && out.length < count) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}
