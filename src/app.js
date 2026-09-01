/**
 * app.js - hält Terminal, Prompt und Statuszeile zusammen.
 *
 * Die Seite verhält sich wie eine offene Konsole: Es laufen laufend Fehler
 * durch, und man kann Befehle eingeben. Es passiert dabei nichts Echtes -
 * kein Request, kein Server, kein echter Fehler. Alles ist Theater.
 */
import { createGlitchEngine } from './components/GlitchEngine.js';
import { createGlitchOverlay } from './components/GlitchOverlay.js';
import { createPrompt } from './components/Prompt.js';
import { createStatusLine } from './components/StatusLine.js';
import { createTerminal } from './components/Terminal.js';
import { el, prefersReducedMotion } from './core/dom.js';
import { formatError } from './core/format.js';
import { detectLanguage, getLanguage, setLanguage, t, text } from './core/i18n.js';
import { generateError } from './core/generator.js';
import { loadMemory, saveMemory } from './core/memory.js';
import { pick, randInt } from './core/random.js';
import { MAX_SERVERS, createServerPool } from './core/servers.js';
import { GLITCH_ERRORS } from './data/glitches.js';
import { SNARK } from './data/responses.js';
import { BOOT_LINES } from './data/system.js';

/** Wie lange die Fake-Reparatur behauptet, alles sei in Ordnung. */
const FAKE_FIX_MS = 2600;

/** Alle Glitch-Codes, die es aktuell zu entdecken gibt. */
const GLITCH_CODES = GLITCH_ERRORS.map((glitch) => glitch.code);
const GLITCH_COUNT = GLITCH_CODES.length;

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

  // Sprache: gespeicherte Wahl, sonst die Browsersprache.
  setLanguage(memory.lang ?? detectLanguage());

  const state = {
    errorCount: 0,
    chaosLevel: 0,
    current: null,
    busy: false,
  };

  // --- Komponenten ---------------------------------------------------------
  const terminal = createTerminal();
  const prompt = createPrompt({ onSubmit: runCommand, onLanguage: changeLanguage });
  const statusLine = createStatusLine();
  const overlay = createGlitchOverlay();

  terminal.attachPrompt(prompt.el);

  const screen = el('div', { class: 'screen' }, [terminal.el, statusLine.el, overlay.el]);

  // Die Glitch-Effekte brauchen den Screen (für die Klassen) und die Ausgabe
  // (für die kurzzeitige Textkorruption).
  const glitch = createGlitchEngine({ screen, output: terminal.out });
  screen.append(glitch.el);

  // Der Serverpool liefert die Fehler, die von selbst eintrudeln.
  const pool = createServerPool({
    onError: (server) => showError(nextError('normal'), server.id),
    onNotice: handleServerNotice,
    onChange: updateStatus,
  });

  // Der erste Knoten existiert von Anfang an, liefert aber erst nach dem
  // Startvorgang - sonst würde er in die Boot-Ausgabe hineinfunken.
  pool.pause();
  pool.add();
  mountPoint.replaceChildren(screen);

  // Wie in einem echten Terminal: ein Klick irgendwohin bringt den Cursor
  // zurück - ausser man markiert gerade Text oder trifft einen Schnellbefehl.
  screen.addEventListener('pointerup', (event) => {
    if (event.target instanceof Element && event.target.closest('button, a')) return;
    if (window.getSelection()?.toString()) return;
    prompt.focus();
  });

  statusLine.startClock();
  prompt.setLanguage(getLanguage());
  updateStatus();
  boot();

  // --- Start ---------------------------------------------------------------

  /** Kurze Startsequenz, danach der erste Fehler. */
  async function boot() {
    prompt.setBusy(true);

    await terminal.printLines([
      [{ text: 'error.sys 0.9.1-beta', cls: 'accent bold' }],
      [{ text: t('tagline'), cls: 'faint' }],
      [],
      ...BOOT_LINES.map((line) => [{ text: line, cls: 'dim' }]),
      [],
    ]);

    overlay.start();
    prompt.setBusy(false);

    await showError(
      generateError({ lastCode: memory.lastCode, lastJoke: memory.lastJoke }),
    );

    // Ab jetzt liefert der Pool von selbst Fehler.
    pool.resume();
  }

  // --- Befehle -------------------------------------------------------------

  /** Alle bekannten Befehle. Mehrere Schreibweisen zeigen auf dieselbe Aktion. */
  const COMMANDS = [
    { names: ['try again', 'tryagain', 'retry', 'again', 'r'], run: cmdRetry },
    { names: ['make it worse', 'makeitworse', 'worse', 'w'], run: cmdWorse },
    { names: ["i don't care", 'i dont care', 'idc', 'ignore', 'i'], run: cmdIgnore },
    { names: ['fix', 'repair', 'sudo fix', 'reboot', 'restart'], run: cmdFix },
    { names: ['servers', 'nodes', 'pool'], run: cmdServers },
    { names: ['help', '?', 'man', 'commands'], run: cmdHelp },
    { names: ['clear', 'cls'], run: cmdClear },
    { names: ['exit', 'quit', 'logout'], run: cmdExit },
    { names: ['sudo'], run: () => reply(t('sudo')) },
    { names: ['ls', 'dir'], run: () => reply(t('ls')) },
    { names: ['whoami'], run: () => reply(t('whoami')) },
    { names: ['pwd'], run: () => reply(t('pwd')) },
    { names: ['cat'], run: () => reply(t('cat')) },
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

    // Befehle mit Argument werden vor der Liste behandelt.
    if (normalized === 'lang' || normalized.startsWith('lang ')) {
      return cmdLang(normalized.slice(4).trim());
    }

    if (normalized === 'server' || normalized.startsWith('server ')) {
      return cmdServer(normalized.slice(6).trim());
    }

    const command = COMMANDS.find((entry) => entry.names.includes(normalized));

    if (command) {
      await command.run();
      return;
    }

    terminal.print([
      { text: `command not found: ${input}`, cls: 'red' },
      { text: t('notFoundHint'), cls: 'faint' },
    ]);
    terminal.print([]);
    await showError(nextError('normal'));
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

    // Der Pool bekommt die Eskalation direkt zu spüren.
    pool.boost(randInt(18, 30));

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
    reply(text(pick(SNARK)), 'cyan');

    // Manchmal reagiert das System beleidigt und wirft trotzdem einen Fehler.
    if (Math.random() < 0.2) {
      terminal.print([{ text: t('anyway'), cls: 'faint' }]);
      await showError(nextError('normal'));
    }
  }

  /** fix - der Versuch, etwas zu reparieren. Endet erwartungsgemäss. */
  async function cmdFix() {
    overlay.burst('hard');
    terminal.print([{ text: 'applying fix ...', cls: 'dim' }]);
    terminal.print([{ text: t('fixApplied'), cls: 'red' }]);
    setChaos(state.chaosLevel + 10);
    await showError(nextError('chaos'));
  }

  /** help - nur die Befehle, ohne Erklärungen. */
  async function cmdHelp() {
    terminal.print([{ text: t('helpHeader'), cls: 'faint' }]);
    terminal.print([
      {
        text:
          "  try again   make it worse   i don't care   fix   clear   exit\n" +
          '  servers   server add   server kill <id>   lang en|de',
        cls: 'dim',
      },
    ]);
    terminal.print([]);
  }

  /**
   * lang - schaltet zwischen Englisch und Deutsch um.
   * Ohne Argument wird nur die aktuelle Sprache gemeldet.
   */
  async function cmdLang(argument) {
    if (!argument) return reply(`${t('langSet')}   ${t('langUsage')}`, 'dim');
    if (!['en', 'de'].includes(argument)) return reply(t('langUsage'), 'red');
    return changeLanguage(argument);
  }

  async function cmdClear() {
    terminal.clear();
    terminal.print([{ text: t('cleared'), cls: 'faint' }]);
    terminal.print([]);
  }

  async function cmdExit() {
    reply(t('exitReply'), 'red');
    await showError(nextError('normal'));
  }

  /**
   * Wechselt die Sprache. Bereits ausgegebene Zeilen bleiben stehen - ein
   * Terminal schreibt sein Protokoll ja auch nicht nachträglich um. Alles
   * Weitere erscheint in der neuen Sprache, beginnend mit einem frischen Fehler.
   */
  async function changeLanguage(lang) {
    if (state.busy) return;

    const changed = setLanguage(lang);
    prompt.setLanguage(getLanguage());

    if (!changed) return;

    memory.lang = lang;
    saveMemory(memory);

    terminal.print([{ text: t('langSet'), cls: 'green' }]);
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
   * @param {string} [source] - Knoten des Serverpools, falls der Fehler dorther kommt
   */
  async function showError(error, source = null) {
    error.source = source;
    state.current = error;
    state.errorCount += 1;

    // Die Akzentfarbe des ganzen Terminals folgt der Severity.
    document.documentElement.dataset.tone = error.tone;
    document.title = `ERROR ${error.code} · error.sys`;

    updateStatus();
    remember(error);

    await terminal.printLines(formatError(error));

    if (error.mode === 'glitch') rememberGlitch(error);
    if (error.mode === 'secret') await handleSecret(error);
    if (error.mode === 'glitch') await handleGlitch(error);
  }

  /**
   * Die seltenen Glitch-Fehler: kurze Bildstörung, danach ist alles wieder sauber.
   * Nur der extrem seltene Void sperrt kurz die Eingabe - der Screen ist ja weg.
   */
  async function handleGlitch(error) {
    const isVoid = error.effects.includes('void');

    if (isVoid) {
      state.busy = true;
      prompt.setBusy(true);
      pool.pause();
    }

    await glitch.run(error);

    if (!isVoid) return;

    state.busy = false;
    prompt.setBusy(false);
    terminal.print([{ text: 'signal restored', cls: 'dim' }]);

    // Danach geht es mit einer ganz normalen Fehlerseite weiter.
    await showError(
      generateError({ mode: 'normal', allowGlitch: false, allowSecret: false, lastCode: error.code }),
    );
    pool.resume();
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
    pool.pause();
    terminal.print([{ text: 'all systems nominal', cls: 'green' }]);
    terminal.print([]);

    await wait(FAKE_FIX_MS);

    state.busy = false;
    prompt.setBusy(false);
    overlay.burst('hard');
    setChaos(state.chaosLevel + 20);
    terminal.print([{ text: 'nope. rolling back.', cls: 'red' }]);

    await showError(generateError({ mode: 'normal', allowSecret: false, lastCode: error.code }));
    pool.resume();
  }

  // --- Serverpool ----------------------------------------------------------

  /** Zeigt den Pool: Knoten, Last, Fehlerzahl - plus die Glitch-Ausbeute. */
  async function cmdServers() {
    const servers = pool.list();

    terminal.print([{ text: t('serversHeader'), cls: 'faint' }]);

    servers.forEach((server) => {
      terminal.print([
        { text: `  ${server.id}  `, cls: 'cmd' },
        { text: server.region.padEnd(14), cls: 'faint' },
        {
          text: server.state.padEnd(11),
          cls: server.state === 'online' ? 'green' : 'amber',
        },
        { text: `load ${String(server.load).padStart(3)}%   `, cls: 'dim' },
        { text: `errors ${server.errors}`, cls: 'faint' },
      ]);
    });

    terminal.print([
      { text: `  ${t('rareFound')}: `, cls: 'faint' },
      { text: `${foundCount()} / ${GLITCH_COUNT}`, cls: 'accent' },
    ]);

    // Ab vier Knoten ist ein Hinweis fällig. Nur ein Hinweis.
    if (servers.length >= 4) terminal.print([{ text: `  ${t('serversHint')}`, cls: 'dim' }]);
    terminal.print([]);
  }

  /** server add | server kill <id> */
  async function cmdServer(argument) {
    const [action, target] = argument.split(' ');

    if (['add', 'spawn', 'new'].includes(action)) return addServer();
    if (['kill', 'remove', 'stop'].includes(action)) return killServer(target);
    return reply(t('serverUsage'), 'dim');
  }

  function addServer() {
    const server = pool.add();

    if (!server) return reply(t('serverFull'), 'amber');

    terminal.print([
      { text: `node ${server.id} spawned`, cls: 'green' },
      { text: `   ${server.region}`, cls: 'faint' },
    ]);

    // Ab vier Knoten ein Hinweis, beim vollen Rack ein etwas deutlicherer.
    if (pool.count() === MAX_SERVERS) {
      terminal.print([{ text: t('serversMax'), cls: 'amber' }]);
    } else if (pool.count() >= 4) {
      terminal.print([{ text: t('serversHint'), cls: 'dim' }]);
    }

    terminal.print([]);
    return undefined;
  }

  function killServer(id) {
    if (!id) return reply(t('serverUsage'), 'dim');
    if (!pool.has(id)) return reply(t('serverUnknown'), 'red');
    if (pool.count() <= 1) return reply(t('serverLast'), 'amber');

    const server = pool.kill(id);
    if (!server) return reply(t('serverUnknown'), 'red');

    reply(`node ${server.id} terminated`, 'red');
    return undefined;
  }

  /** Meldungen aus dem Pool: Überlast und Rückkehr eines Knotens. */
  function handleServerNotice(event, server) {
    if (event === 'overload') {
      overlay.burst();
      terminal.print([
        { text: `node ${server.id} overloaded. rebooting.`, cls: 'red' },
        {
          text: pool.count() > 1 ? '   the other nodes keep going.' : '',
          cls: 'faint',
        },
      ]);
      terminal.print([]);
      return;
    }

    terminal.print([{ text: `node ${server.id} back online`, cls: 'green' }]);
    terminal.print([]);
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
      nodeCount: pool.count(),
    });
  }

  /** Hält fest, welche Glitch-Fehler schon aufgetaucht sind (Sammelanreiz). */
  function rememberGlitch(error) {
    if (memory.glitchesFound.includes(error.code)) return;

    memory.glitchesFound.push(error.code);
    saveMemory(memory);
    terminal.print([
      { text: `   ${t('rareFound')}: ${foundCount()} / ${GLITCH_COUNT}`, cls: 'faint' },
    ]);
  }

  /**
   * Zählt nur Codes, die es noch gibt - ein alter Eintrag aus dem Speicher
   * soll den Zähler nicht über das Maximum treiben.
   */
  function foundCount() {
    return memory.glitchesFound.filter((code) => GLITCH_CODES.includes(code)).length;
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
