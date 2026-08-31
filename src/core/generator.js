/**
 * Baut aus den Datenlisten ein komplettes Fehler-Objekt.
 *
 * Grundregeln:
 * - Code, technische Beschreibung und Witz werden unabhängig gezogen und
 *   können frei kombiniert werden (mit einer Chance auf bewusstes "Mismatch").
 * - Derselbe Code / derselbe Witz soll sich möglichst nicht direkt wiederholen.
 * - Sehr selten (1 %) erscheint stattdessen ein verstecktes Glitch-Event.
 */
import { ERROR_CODES, MODULES, SEVERITIES } from '../data/errors.js';
import { JOKES } from '../data/jokes.js';
import { CHAOS, CHAOS_META } from '../data/responses.js';
import { SECRET_EVENTS } from '../data/secrets.js';
import { LEVELS, META_FLAVOR, STACK_FRAMES } from '../data/system.js';
import { chance, makeErrorId, pick, pickAvoiding, pickWeighted, randInt, sample } from './random.js';

/** Wahrscheinlichkeit für ein verstecktes Glitch-Event. */
export const SECRET_CHANCE = 0.01;

/** Wahrscheinlichkeit, dass Code und Beschreibung absichtlich nicht zusammenpassen. */
const MISMATCH_CHANCE = 0.22;

/**
 * Erzeugt einen Fehler.
 *
 * @param {object} options
 * @param {'normal'|'chaos'} [options.mode]   - "chaos" = MAKE IT WORSE
 * @param {string|null} [options.lastCode]    - zuletzt gezeigter Code
 * @param {string|null} [options.lastJoke]    - zuletzt gezeigter Witz (erste Zeile)
 * @param {boolean} [options.allowSecret]     - Glitch-Events zulassen
 * @returns {object} Fehler-Objekt für die Komponenten
 */
export function generateError({
  mode = 'normal',
  lastCode = null,
  lastJoke = null,
  allowSecret = true,
} = {}) {
  if (allowSecret && mode === 'normal' && chance(SECRET_CHANCE)) {
    return buildSecret();
  }
  return mode === 'chaos' ? buildChaos(lastCode) : buildStandard(lastCode, lastJoke);
}

/** Der normale Fall: echter HTTP-Code, echte Beschreibung, unpassender Witz. */
function buildStandard(lastCode, lastJoke) {
  const entry = pickAvoiding(ERROR_CODES, (item) => item.code === lastCode);

  // Beschreibung kommt meistens vom Code selbst - manchmal aber absichtlich
  // von einem völlig anderen Fehler. Das wirkt herrlich kaputt.
  const mismatched = chance(MISMATCH_CHANCE)
    ? pickAvoiding(ERROR_CODES, (item) => item.code === entry.code)
    : entry;

  const severity = pickWeighted(SEVERITIES);

  return finalize({
    mode: 'normal',
    code: entry.code,
    title: mismatched.title,
    detail: mismatched.detail,
    joke: pickJoke(lastJoke),
    severity: severity.label,
    tone: severity.tone,
  });
}

/** MAKE IT WORSE: absurde Codes, Severity immer am oberen Ende. */
function buildChaos(lastCode) {
  const entry = pickAvoiding(CHAOS, (item) => item.code === lastCode);

  return finalize({
    mode: 'chaos',
    code: entry.code,
    title: entry.title,
    detail: pick(ERROR_CODES).detail,
    joke: entry.joke,
    severity: chance(0.5) ? 'CRITICAL' : 'CATASTROPHIC',
    tone: 'critical',
    extraMeta: sample(CHAOS_META, 2),
  });
}

/** Das seltene Glitch-Event. */
function buildSecret() {
  const event = pick(SECRET_EVENTS);

  return finalize({
    mode: 'secret',
    code: event.code,
    title: event.title,
    detail: 'Dieses Ereignis war nicht vorgesehen.',
    joke: event.joke,
    severity: event.severity,
    tone: event.fakeFix ? 'ok' : 'secret',
    secretId: event.id,
    fakeFix: Boolean(event.fakeFix),
  });
}

/** Zieht einen Witz und vermeidet dabei den zuletzt gezeigten. */
function pickJoke(lastJoke) {
  return pickAvoiding(JOKES, (lines) => lines[0] === lastJoke);
}

/**
 * Ergänzt die gemeinsamen Felder (Level, ID, Modul, Zeitstempel, Meta, Stack).
 * So sehen alle drei Fehlerarten gleich "echt" aus.
 */
function finalize(partial) {
  return {
    level: partial.mode === 'secret' ? 'GLITCH' : pick(LEVELS),
    errorId: makeErrorId(),
    module: pick(MODULES),
    timestamp: fakeTimestamp(),
    meta: [...sample(META_FLAVOR, 2).map((fn) => fn()), ...(partial.extraMeta ?? [])],
    stack: buildStack(),
    secretId: null,
    fakeFix: false,
    ...partial,
  };
}

/** Erzeugt einen zufälligen, plausibel aussehenden Zeitstempel. */
function fakeTimestamp() {
  const pad = (value) => String(value).padStart(2, '0');
  return `${pad(randInt(0, 23))}:${pad(randInt(0, 59))}:${pad(randInt(0, 59))}.${String(
    randInt(0, 999),
  ).padStart(3, '0')}`;
}

/** Baut einen kurzen Fake-Stacktrace. */
function buildStack() {
  return sample(STACK_FRAMES, randInt(3, 5)).map((frame) => ({
    ...frame,
    line: randInt(3, 480),
    column: randInt(2, 96),
  }));
}
