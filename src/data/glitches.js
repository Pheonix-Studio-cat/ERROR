/**
 * glitches.js - das GLITCH UPDATE.
 *
 * Jeder Glitch-Fehler hat eine EIGENE, feste Wahrscheinlichkeit. Bei jeder
 * Fehlerziehung wird einmal gewürfelt: Fällt der Wurf in das Band eines
 * Glitches, kommt dieser Glitch - sonst ein ganz normaler Fehler.
 *
 * Damit gilt garantiert:
 * - jeder einzelne Glitch liegt unter 10 %
 * - alle Glitches zusammen liegen deutlich unter 50 %,
 *   normale Fehler bleiben also klar in der Mehrheit (rund 76 %)
 *
 * Texte liegen zweisprachig vor (`en` / `de`); die Titel bleiben englisch,
 * weil sie wie echte Systemmeldungen aussehen sollen.
 *
 * Die Stufen entsprechen der Vorgabe:
 *   light   5-9 %   | rare 2-5 %   | very rare 0.5-2 %   | extreme < 0.5 %
 */

/**
 * Effekt-Bausteine (siehe GlitchEngine.js und styles/glitch.css):
 *   rgb      dezenter RGB-Split
 *   jitter   Text zittert kurz
 *   tear     horizontale Bildverschiebung (Slices)
 *   corrupt  einzelne Zeichen kippen kurz in Blockgrafik
 *   shift    einzelne UI-Elemente verrutschen
 *   blackout Screen wird kurz komplett schwarz
 *   sway     der ganze Screen schaukelt hin und her
 *   void     der Screen verschwindet und zeigt kurz "oh. ERROR."
 */
export const GLITCH_ERRORS = [
  // --- leicht: 5-9 % --------------------------------------------------------
  {
    code: '0xGLITCH',
    title: 'SCREEN CORRUPTION DETECTED',
    detail: {
      en: 'The renderer produced output that nobody asked for.',
      de: 'Der Renderer hat Ausgaben produziert, nach denen niemand gefragt hat.',
    },
    joke: {
      en: ['Something moved.', 'We are choosing to ignore it.'],
      de: ['Da hat sich etwas bewegt.', 'Wir ignorieren das bewusst.'],
    },
    tier: 'light',
    chance: 0.05,
    effects: ['rgb'],
  },
  {
    code: '404.5',
    title: 'REALITY BUFFER ERROR',
    detail: {
      en: 'Half of the page was found. The other half declined to comment.',
      de: 'Die halbe Seite wurde gefunden. Die andere Hälfte wollte sich nicht äussern.',
    },
    joke: {
      en: ['This page exists to 47 %.', 'We rounded up.'],
      de: ['Diese Seite existiert zu 47 %.', 'Wir haben aufgerundet.'],
    },
    tier: 'light',
    chance: 0.045,
    effects: ['jitter'],
  },

  // --- selten: 2-5 % --------------------------------------------------------
  {
    code: 'RGB',
    title: 'COLOR CORRUPTION',
    detail: {
      en: 'The color channels have stopped agreeing with each other.',
      de: 'Die Farbkanäle sind sich nicht mehr einig.',
    },
    joke: {
      en: ['Red went one way.', 'Blue went the other.'],
      de: ['Rot ging in die eine Richtung.', 'Blau in die andere.'],
    },
    tier: 'rare',
    chance: 0.035,
    effects: ['rgb', 'jitter'],
  },
  {
    code: '???',
    title: 'DATA CORRUPTION',
    detail: {
      en: 'The payload arrived. Sort of. In pieces.',
      de: 'Die Daten sind angekommen. Irgendwie. In Teilen.',
    },
    joke: {
      en: ['We received the data.', 'We just cannot read it anymore.'],
      de: ['Wir haben die Daten erhalten.', 'Lesen können wir sie nicht mehr.'],
    },
    tier: 'rare',
    chance: 0.028,
    effects: ['corrupt'],
  },
  {
    code: '67',
    title: 'SIX SEVEN',
    detail: {
      en: 'The server heard the number and could not stop itself.',
      de: 'Der Server hat die Zahl gehört und konnte sich nicht mehr beherrschen.',
    },
    joke: {
      en: ['six seven', 'The whole machine is doing it now.'],
      de: ['six seven', 'Jetzt macht es die ganze Maschine.'],
    },
    tier: 'rare',
    chance: 0.025,
    effects: ['sway'],
  },

  // --- sehr selten: 0.5-2 % -------------------------------------------------
  {
    code: '0xDEAD',
    title: 'DISPLAY FAILURE',
    detail: {
      en: 'The display driver has left the building.',
      de: 'Der Grafiktreiber hat das Gebäude verlassen.',
    },
    joke: {
      en: ['The screen is still there.', 'It simply stopped cooperating.'],
      de: ['Der Bildschirm ist noch da.', 'Er macht nur nicht mehr mit.'],
    },
    tier: 'very-rare',
    chance: 0.015,
    effects: ['tear', 'rgb', 'corrupt'],
  },
  {
    code: '0x000',
    title: 'DISPLAY LOST',
    detail: {
      en: 'Signal dropped. Reason: none given.',
      de: 'Signal weg. Grund: keiner genannt.',
    },
    joke: {
      en: ['Do not adjust your screen.', 'It is not your screen.'],
      de: ['Stell nicht an deinem Bildschirm herum.', 'Es ist nicht dein Bildschirm.'],
    },
    tier: 'very-rare',
    chance: 0.012,
    effects: ['blackout'],
  },
  {
    code: '∞',
    title: 'SYSTEM COLLAPSE',
    detail: {
      en: 'Every subsystem failed at once. Impressive, really.',
      de: 'Alle Teilsysteme sind gleichzeitig ausgefallen. Beachtlich, eigentlich.',
    },
    joke: {
      en: ['To understand this error,', 'please read this error.'],
      de: ['Um diesen Fehler zu verstehen,', 'lies bitte diesen Fehler.'],
    },
    tier: 'very-rare',
    chance: 0.008,
    effects: ['tear', 'rgb', 'jitter', 'blackout'],
  },
  {
    code: 'ERROR',
    title: 'THE ERROR HAS ENCOUNTERED AN ERROR',
    detail: {
      en: 'The error handler needs an error handler.',
      de: 'Der Fehlerbehandler braucht einen Fehlerbehandler.',
    },
    joke: {
      en: ['We tried to show you an error.', 'That went wrong as well.'],
      de: ['Wir wollten dir einen Fehler zeigen.', 'Das ging auch schief.'],
    },
    tier: 'very-rare',
    chance: 0.006,
    effects: ['corrupt', 'rgb', 'shift'],
  },

  // --- extrem selten: unter 0.5 % ------------------------------------------
  {
    code: '∅',
    title: 'SIGNAL LOST',
    detail: {
      en: 'Nothing is being rendered. Nothing at all.',
      de: 'Es wird nichts gerendert. Gar nichts.',
    },
    joke: {
      en: ['oh.', 'ERROR.'],
      de: ['oh.', 'ERROR.'],
    },
    tier: 'extreme',
    chance: 0.003,
    effects: ['void'],
  },
];

/** Summe aller Glitch-Wahrscheinlichkeiten - der Rest bleibt normaler Fehler. */
export const GLITCH_TOTAL = GLITCH_ERRORS.reduce((sum, entry) => sum + entry.chance, 0);
