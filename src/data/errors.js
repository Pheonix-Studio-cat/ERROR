/**
 * Katalog der (Fake-)Fehlercodes.
 *
 * Jeder Eintrag ist bewusst "echt genug", damit die Seite wie eine kaputte
 * System-Seite wirkt. `title` ist die technische Kurzbeschreibung, `detail`
 * die pseudo-technische Zusatzzeile.
 *
 * WICHTIG: Hier passiert nichts Echtes - kein Request, kein Server, kein Fehler.
 */
export const ERROR_CODES = [
  {
    code: '400',
    title: 'Bad Request.',
    detail: 'Der Client hat etwas gesendet, das niemand verstehen wollte.',
  },
  {
    code: '401',
    title: 'Unauthorized.',
    detail: 'Es fehlt ein Token, das es vermutlich nie gegeben hat.',
  },
  {
    code: '402',
    title: 'Payment Required.',
    detail: 'Abrechnungsmodul aktiviert. Aus Versehen.',
  },
  {
    code: '403',
    title: 'Forbidden.',
    detail: 'Zugriff verweigert. Grund: unbekannt, aber sehr bestimmt.',
  },
  {
    code: '404',
    title: 'Page not found.',
    detail: 'Die angeforderte Ressource existiert in diesem Universum nicht.',
  },
  {
    code: '405',
    title: 'Method Not Allowed.',
    detail: 'Die Methode ist erlaubt. Nur eben nicht hier. Und nicht jetzt.',
  },
  {
    code: '408',
    title: 'Request Timeout.',
    detail: 'Der Server hat 30 Sekunden gewartet und dann aufgegeben.',
  },
  {
    code: '409',
    title: 'Conflict.',
    detail: 'Zwei Prozesse behaupten gleichzeitig, Recht zu haben.',
  },
  {
    code: '410',
    title: 'Gone.',
    detail: 'War mal da. Ist jetzt weg. Endgültig.',
  },
  {
    code: '413',
    title: 'Payload Too Large.',
    detail: 'Der Request wog mehr als der gesamte Arbeitsspeicher.',
  },
  {
    code: '418',
    title: "I'm a teapot.",
    detail: 'Der Server weigert sich, Kaffee zu kochen. Aus Prinzip.',
  },
  {
    code: '420',
    title: 'Enhance Your Calm.',
    detail: 'Der Server bittet um etwas weniger Enthusiasmus.',
  },
  {
    code: '423',
    title: 'Locked.',
    detail: 'Ressource gesperrt. Schlüssel liegt im gesperrten Ordner.',
  },
  {
    code: '429',
    title: 'Too Many Requests.',
    detail: 'Rate Limit erreicht. Und zwar deutlich.',
  },
  {
    code: '451',
    title: 'Unavailable For Legal Reasons.',
    detail: 'Die Rechtsabteilung hat entschieden. Ohne uns zu fragen.',
  },
  {
    code: '500',
    title: 'Internal Server Error.',
    detail: 'Unbehandelte Ausnahme in einem Modul, das niemand geschrieben hat.',
  },
  {
    code: '501',
    title: 'Not Implemented.',
    detail: 'Das Feature steht im Ticket. Seit 2019.',
  },
  {
    code: '502',
    title: 'Bad Gateway.',
    detail: 'Upstream-Server antwortete mit ratlosem Schweigen.',
  },
  {
    code: '503',
    title: 'Service Unavailable.',
    detail: 'Der Dienst ist temporär nicht erreichbar. Sehr temporär. Angeblich.',
  },
  {
    code: '504',
    title: 'Gateway Timeout.',
    detail: 'Irgendwo zwischen hier und dort ist ein Paket verloren gegangen.',
  },
  {
    code: '507',
    title: 'Insufficient Storage.',
    detail: 'Speicher voll. Hauptsächlich mit Logs über vollen Speicher.',
  },
  {
    code: '508',
    title: 'Loop Detected.',
    detail: 'Loop Detected. Loop Detected. Loop Detected.',
  },
  {
    code: '511',
    title: 'Network Authentication Required.',
    detail: 'Das Netzwerk möchte sich erst einmal vorstellen.',
  },
  {
    code: '522',
    title: 'Connection Timed Out.',
    detail: 'Die Verbindung stand kurz. Dann hat sie es sich anders überlegt.',
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
