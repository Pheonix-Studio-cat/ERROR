/**
 * Katalog der (Fake-)Fehlercodes.
 *
 * `title` ist die technische Kurzbeschreibung (bleibt englisch, wie im echten
 * HTTP-Standard), `detail` die pseudo-technische Zusatzzeile - die gibt es
 * zweisprachig, passend zum Sprachumschalter.
 *
 * WICHTIG: Hier passiert nichts Echtes - kein Request, kein Server, kein Fehler.
 */
export const ERROR_CODES = [
  {
    code: '400',
    title: 'Bad Request.',
    detail: {
      en: 'The client sent something nobody wanted to understand.',
      de: 'Der Client hat etwas gesendet, das niemand verstehen wollte.',
    },
  },
  {
    code: '401',
    title: 'Unauthorized.',
    detail: {
      en: 'A token is missing that probably never existed.',
      de: 'Es fehlt ein Token, das es vermutlich nie gegeben hat.',
    },
  },
  {
    code: '402',
    title: 'Payment Required.',
    detail: {
      en: 'Billing module activated. By accident.',
      de: 'Abrechnungsmodul aktiviert. Aus Versehen.',
    },
  },
  {
    code: '403',
    title: 'Forbidden.',
    detail: {
      en: 'Access denied. Reason: unknown, but very firm.',
      de: 'Zugriff verweigert. Grund: unbekannt, aber sehr bestimmt.',
    },
  },
  {
    code: '404',
    title: 'Page not found.',
    detail: {
      en: 'The requested resource does not exist in this universe.',
      de: 'Die angeforderte Ressource existiert in diesem Universum nicht.',
    },
  },
  {
    code: '405',
    title: 'Method Not Allowed.',
    detail: {
      en: 'The method is allowed. Just not here. And not now.',
      de: 'Die Methode ist erlaubt. Nur eben nicht hier. Und nicht jetzt.',
    },
  },
  {
    code: '408',
    title: 'Request Timeout.',
    detail: {
      en: 'The server waited 30 seconds and then gave up.',
      de: 'Der Server hat 30 Sekunden gewartet und dann aufgegeben.',
    },
  },
  {
    code: '409',
    title: 'Conflict.',
    detail: {
      en: 'Two processes claim to be right at the same time.',
      de: 'Zwei Prozesse behaupten gleichzeitig, Recht zu haben.',
    },
  },
  {
    code: '410',
    title: 'Gone.',
    detail: {
      en: 'It was here once. Now it is gone. For good.',
      de: 'War mal da. Ist jetzt weg. Endgültig.',
    },
  },
  {
    code: '413',
    title: 'Payload Too Large.',
    detail: {
      en: 'The request weighed more than the entire memory.',
      de: 'Der Request wog mehr als der gesamte Arbeitsspeicher.',
    },
  },
  {
    code: '418',
    title: "I'm a teapot.",
    detail: {
      en: 'The server refuses to brew coffee. On principle.',
      de: 'Der Server weigert sich, Kaffee zu kochen. Aus Prinzip.',
    },
  },
  {
    code: '420',
    title: 'Enhance Your Calm.',
    detail: {
      en: 'The server would like slightly less enthusiasm.',
      de: 'Der Server bittet um etwas weniger Enthusiasmus.',
    },
  },
  {
    code: '423',
    title: 'Locked.',
    detail: {
      en: 'Resource locked. The key is inside the locked folder.',
      de: 'Ressource gesperrt. Schlüssel liegt im gesperrten Ordner.',
    },
  },
  {
    code: '429',
    title: 'Too Many Requests.',
    detail: {
      en: 'Rate limit reached. By a wide margin.',
      de: 'Rate Limit erreicht. Und zwar deutlich.',
    },
  },
  {
    code: '451',
    title: 'Unavailable For Legal Reasons.',
    detail: {
      en: 'Legal has decided. Without asking us.',
      de: 'Die Rechtsabteilung hat entschieden. Ohne uns zu fragen.',
    },
  },
  {
    code: '500',
    title: 'Internal Server Error.',
    detail: {
      en: 'Unhandled exception in a module nobody wrote.',
      de: 'Unbehandelte Ausnahme in einem Modul, das niemand geschrieben hat.',
    },
  },
  {
    code: '501',
    title: 'Not Implemented.',
    detail: {
      en: 'The feature is in the backlog. Since 2019.',
      de: 'Das Feature steht im Ticket. Seit 2019.',
    },
  },
  {
    code: '502',
    title: 'Bad Gateway.',
    detail: {
      en: 'Upstream server responded with puzzled silence.',
      de: 'Upstream-Server antwortete mit ratlosem Schweigen.',
    },
  },
  {
    code: '503',
    title: 'Service Unavailable.',
    detail: {
      en: 'The service is temporarily unavailable. Very temporarily. Allegedly.',
      de: 'Der Dienst ist temporär nicht erreichbar. Sehr temporär. Angeblich.',
    },
  },
  {
    code: '504',
    title: 'Gateway Timeout.',
    detail: {
      en: 'Somewhere between here and there a packet went missing.',
      de: 'Irgendwo zwischen hier und dort ist ein Paket verloren gegangen.',
    },
  },
  {
    code: '507',
    title: 'Insufficient Storage.',
    detail: {
      en: 'Storage full. Mostly with logs about full storage.',
      de: 'Speicher voll. Hauptsächlich mit Logs über vollen Speicher.',
    },
  },
  {
    code: '508',
    title: 'Loop Detected.',
    detail: {
      en: 'Loop detected. Loop detected. Loop detected.',
      de: 'Loop Detected. Loop Detected. Loop Detected.',
    },
  },
  {
    code: '511',
    title: 'Network Authentication Required.',
    detail: {
      en: 'The network would like to introduce itself first.',
      de: 'Das Netzwerk möchte sich erst einmal vorstellen.',
    },
  },
  {
    code: '522',
    title: 'Connection Timed Out.',
    detail: {
      en: 'The connection held for a moment. Then it changed its mind.',
      de: 'Die Verbindung stand kurz. Dann hat sie es sich anders überlegt.',
    },
  },
];

/**
 * Systemmodule, die in der Fehlerausgabe als "Quelle" auftauchen.
 * Rein dekorativ - keines davon existiert.
 */
export const MODULES = [
  'core/renderer',
  'core/hydration',
  'net/gateway',
  'net/socket-pool',
  'auth/session',
  'db/connection-pool',
  'cache/invalidator',
  'fs/tempfile',
  'ui/layout-engine',
  'worker/queue-3',
  'crypto/entropy',
  'legacy/dont-touch-this',
  'utils/misc/final_v2_FINAL',
  'kernel/panic-handler',
];

/**
 * Severity-Stufen inkl. Gewichtung.
 * "probably fine" ist absichtlich häufig - es ist der ehrlichste Zustand.
 */
export const SEVERITIES = [
  { label: 'LOW', weight: 3, tone: 'low' },
  { label: 'MEDIUM', weight: 3, tone: 'medium' },
  { label: 'HIGH', weight: 2, tone: 'high' },
  { label: 'CRITICAL', weight: 2, tone: 'critical' },
  { label: 'probably fine', weight: 4, tone: 'fine' },
];
