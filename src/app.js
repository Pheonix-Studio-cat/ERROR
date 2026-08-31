/**
 * app.js - hält Terminal, Prompt und Statuszeile zusammen.
 *
 * Die Seite verhält sich wie eine offene Konsole: Es laufen laufend Fehler
 * durch, und man kann Befehle eingeben. Es passiert dabei nichts Echtes -
 * kein Request, kein Server, kein echter Fehler. Alles ist Theater.
 */
import { createGlitchOverlay } from './components/GlitchOverlay.js';
import { createPrompt } from './components/Prompt.js';
import { createStatusLine } from './components/StatusLine.js';
import { createTerminal } from './components/Terminal.js';
import { el, prefersReducedMotion } from './core/dom.js';
import { formatError } from './core/format.js';
import { generateError } from './core/generator.js';
import { loadMemory, saveMemory } from './core/memory.js';
import { pick, randInt } from './core/random.js';
import { SNARK } from './data/responses.js';
import { BOOT_LINES } from './data/system.js';

/** Wie lange die Fake-Reparatur behauptet, alles sei in Ordnung. */
const FAKE_FIX_MS = 2600;

/** Abstand, in dem von selbst neue Fehler eintrudeln (ms). */
const STREAM_MIN = 7000;
const STREAM_MAX = 14000;

/** Statuswort je nach Chaos-Level. */
const STATUS_LABELS = [
  { min: 90, label: 'ON FIRE' },
  { min: 70, label: 'CRITICAL' },
  { min: 40, label: 'UNSTABLE' },
  { min: 15, label: 'DEGRADED' },
  { min: 0, label: 'probably fine' },
];

export function mountApp(mountPoint) {
  // --- Zustand -------------------------------------------------------------
  const memory = loadMemory();
  memory.visits += 1;

  const state = {
    errorCount: 0,
    chaosLevel: 0,
    current: null,
    busy: false,
  };

  let streamTimer = null;

  // --- Komponenten ---------------------------------------------------------
  const terminal = createTerminal();
  const prompt = createPrompt({ onSubmit: runCommand });
  const statusLine = createStatusLine();
  const overlay = createGlitchOverlay();

  terminal.attachPrompt(prompt.el);

  const screen = el('div', { class: 'screen' }, [terminal.el, statusLine.el, overlay.el]);
  mountPoint.replaceChildren(screen);

  // Wie in einem echten Terminal: ein Klick irgendwohin bringt den Cursor
  // zurück - ausser man markiert gerade Text oder trifft einen Schnellbefehl.
  screen.addEventListener('pointerup', (event) => {
    if (event.target instanceof Element && event.target.closest('button, a')) return;
    if (window.getSelection()?.toString()) return;
    prompt.focus();
  });

  statusLine.startClock();
  updateStatus();
  boot();

  // --- Start ---------------------------------------------------------------

  /** Kurze Startsequenz, danach der erste Fehler. */
  async function boot() {
    prompt.setBusy(true);

    await terminal.printLines([
      [{ text: 'error.sys 0.9.1-beta', cls: 'accent bold' }],
      [{ text: 'Nur Fehler. Rund um die Uhr.', cls: 'faint' }],
      [],
      ...BOOT_LINES.map((line) => [{ text: line, cls: 'dim' }]),
      [],
    ]);

    overlay.start();
    prompt.setBusy(false);

    await showError(
      generateError({ lastCode: memory.lastCode, lastJoke: memory.lastJoke }),
    );
    scheduleStream();
  }

  // --- Befehle -------------------------------------------------------------

  /** Alle bekannten Befehle. Mehrere Schreibweisen zeigen auf dieselbe Aktion. */
  const COMMANDS = [
    { names: ['try again', 'tryagain', 'retry', 'again', 'r'], run: cmdRetry },
    { names: ['make it worse', 'makeitworse', 'worse', 'w'], run: cmdWorse },
    { names: ["i don't care", 'i dont care', 'idc', 'ignore', 'i'], run: cmdIgnore },
    { names: ['fix', 'repair', 'sudo fix', 'reboot', 'restart'], run: cmdFix },
    { names: ['help', '?', 'man', 'commands'], run: cmdHelp },
    { names: ['clear', 'cls'], run: cmdClear },
    { names: ['exit', 'quit', 'logout'], run: cmdExit },
    { names: ['sudo'], run: () => reply('Nice try.') },
    { names: ['ls', 'dir'], run: () => reply('errors/   errors.bak/   errors_final/   errors_final_2/') },
    { names: ['whoami'], run: () => reply('jemand, der gerade eine kaputte Seite anschaut') },
    { names: ['pwd'], run: () => reply('/var/log/nichts') },
    { names: ['cat'], run: () => reply('miau') },
  ];

  /**
   * Nimmt eine Eingabe entgegen, schreibt sie ins Terminal und führt sie aus.
   * @param {string} raw
   */
  async function runCommand(raw) {
    if (state.busy) return;

    const input = raw.trim();
    echo(input);

    const normalized = input.toLowerCase().replace(/[’`´]/g, "'").replace(/\s+/g, ' ');
    const command = COMMANDS.find((entry) => entry.names.includes(normalized));

    if (command) {
      await command.run();
    } else {
      terminal.print([
        { text: `command not found: ${input}`, cls: 'red' },
        { text: '   (es gibt hier ohnehin nur Fehler)', cls: 'faint' },
      ]);
      terminal.print([]);
      await showError(nextError('normal'));
    }

    scheduleStream();
  }

  /** Schreibt die Eingabe als Prompt-Zeile ins Protokoll. */
  function echo(input) {
    terminal.print([
      { text: 'visitor@error.sys', cls: 'green' },
      { text: ':~$ ', cls: 'dim' },
      { text: input, cls: 'cmd' },
    ]);
  }

  /** Kurze Antwortzeile ohne Fehlerblock. */
  function reply(text, cls = 'dim') {
    terminal.print([{ text, cls }]);
    terminal.print([]);
  }

  // --- Aktionen ------------------------------------------------------------

  /** try again - neuer zufälliger Fehler. */
  async function cmdRetry() {
    overlay.burst();
    setChaos(state.chaosLevel - 5);
    terminal.print([{ text: 'retrying ...', cls: 'dim' }]);
    await showError(nextError('normal'));
  }

  /** make it worse - absurder Fehler, Chaos steigt. */
  async function cmdWorse() {
    overlay.burst('hard');
    setChaos(state.chaosLevel + randInt(14, 24));
    memory.worseCount += 1;

    terminal.print([
      {
        text: pick([
          'removing safety checks ... done',
          'escalating ... done',
          'deleting the fallback ... done',
          'increasing error level ... done',
        ]),
        cls: 'red',
      },
    ]);
    await showError(nextError('chaos'));
  }

  /** i don't care - freche Antwort, sonst passiert (fast) nichts. */
  async function cmdIgnore() {
    setChaos(state.chaosLevel + 2);
    reply(pick(SNARK), 'cyan');

    // Manchmal reagiert das System beleidigt und wirft trotzdem einen Fehler.
    if (Math.random() < 0.2) {
      terminal.print([{ text: 'trotzdem:', cls: 'faint' }]);
      await showError(nextError('normal'));
    }
  }

  /** fix - der Versuch, etwas zu reparieren. Endet erwartungsgemäss. */
  async function cmdFix() {
    overlay.burst('hard');
    terminal.print([{ text: 'applying fix ...', cls: 'dim' }]);
    terminal.print([{ text: 'fix applied to the wrong module', cls: 'red' }]);
    setChaos(state.chaosLevel + 10);
    await showError(nextError('chaos'));
  }

  /** help - nur die Befehle, ohne Erklärungen. */
  async function cmdHelp() {
    terminal.print([{ text: 'available commands', cls: 'faint' }]);
    terminal.print([
      { text: '  try again   make it worse   i don\'t care   fix   clear   exit', cls: 'dim' },
    ]);
    terminal.print([]);
  }

  async function cmdClear() {
    terminal.clear();
    terminal.print([{ text: 'screen cleared. errors not.', cls: 'faint' }]);
    terminal.print([]);
  }

  async function cmdExit() {
    reply('Es gibt keinen Ausgang. Nur weitere Fehler.', 'red');
    await showError(nextError('normal'));
  }

  // --- Fehlerausgabe -------------------------------------------------------

  /** Zieht den nächsten Fehler und vermeidet dabei den zuletzt gezeigten. */
  function nextError(mode) {
    return generateError({
      mode,
      lastCode: state.current?.code ?? memory.lastCode,
      lastJoke: state.current?.joke?.[0] ?? memory.lastJoke,
    });
  }

  /**
   * Gibt einen Fehler im Terminal aus und aktualisiert Status und Speicher.
   * @param {object} error
   */
  async function showError(error) {
    state.current = error;
    state.errorCount += 1;

    // Die Akzentfarbe des ganzen Terminals folgt der Severity.
    document.documentElement.dataset.tone = error.tone;
    document.title = `ERROR ${error.code} · error.sys`;

    updateStatus();
    remember(error);

    await terminal.printLines(formatError(error));

    if (error.mode === 'secret') await handleSecret(error);
  }

  /** Die seltenen Glitch-Events (1 %). */
  async function handleSecret(error) {
    if (!memory.secretsFound.includes(error.secretId)) {
      memory.secretsFound.push(error.secretId);
      saveMemory(memory);
    }
    overlay.burst('hard');

    if (!error.fakeFix) return;

    // Die Seite behauptet kurz, sie sei repariert - und fällt dann zurück.
    state.busy = true;
    prompt.setBusy(true);
    stopStream();
    terminal.print([{ text: 'all systems nominal', cls: 'green' }]);
    terminal.print([]);

    await wait(FAKE_FIX_MS);

    state.busy = false;
    prompt.setBusy(false);
    overlay.burst('hard');
    setChaos(state.chaosLevel + 20);
    terminal.print([{ text: 'nope. rolling back.', cls: 'red' }]);

    await showError(generateError({ mode: 'normal', allowSecret: false, lastCode: error.code }));
    scheduleStream();
  }

  // --- Dauerbetrieb --------------------------------------------------------

  /** Plant den nächsten Fehler, der ganz von selbst eintrudelt. */
  function scheduleStream() {
    stopStream();
    streamTimer = setTimeout(async () => {
      if (state.busy || document.hidden) return scheduleStream();
      await showError(nextError('normal'));
      scheduleStream();
    }, randInt(STREAM_MIN, STREAM_MAX));
  }

  function stopStream() {
    clearTimeout(streamTimer);
  }

  // --- Kleinkram -----------------------------------------------------------

  function setChaos(value) {
    state.chaosLevel = Math.max(0, Math.min(100, Math.round(value)));
    updateStatus();
  }

  function updateStatus() {
    statusLine.render({
      errorCount: state.errorCount,
      chaosLevel: state.chaosLevel,
      label: STATUS_LABELS.find((entry) => state.chaosLevel >= entry.min).label,
    });
  }

  /** Merkt sich, was beim nächsten Laden nicht wiederholt werden soll. */
  function remember(error) {
    memory.lastCode = error.code;
    memory.lastJoke = error.joke[0];
    saveMemory(memory);
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, prefersReducedMotion() ? 400 : ms));
  }
}
