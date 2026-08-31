# ERROR

Eine Website, die sich als komplett kaputtes System ausgibt.
Sie sieht aus wie ein Terminal im Browser – und es kommen ausschliesslich Fehler,
rund um die Uhr. Alle Fehler sind erfunden: Es gibt keinen Server, keine Requests
und keinen einzigen echten Fehler.

## Was passiert

- Bei jedem Laden wird ein neuer Fehler gewürfelt (Code, technische Beschreibung
  und Witz werden unabhängig voneinander kombiniert).
- Danach laufen alle paar Sekunden von selbst weitere Fehler durch – wie ein
  Log, das man offen liegen lässt.
- Jeder Fehler bekommt eine eigene Error-ID (`ERR-7F3A-91C2`), eine Severity
  (`LOW` … `CRITICAL`, `probably fine`), ein Modul und einen Fake-Stacktrace.
- Sehr selten (1 %) erscheint ein verstecktes Glitch-Event. Eines davon behauptet
  kurz, alles sei repariert – und fällt dann zurück in den nächsten Fehler.

## Befehle

Eingeben oder unten anklicken:

| Befehl | Wirkung |
| --- | --- |
| `try again` | neuer zufälliger Fehler |
| `make it worse` | besonders absurder Fehler, Chaos-Level steigt |
| `i don't care` | eine freche Antwort |
| `fix` | der Reparaturversuch. Endet wie erwartet. |
| `help` | Liste der Befehle |
| `clear` | Bildschirm leeren |
| `exit` | es gibt keinen Ausgang |

Unbekannte Eingaben werden mit `command not found` quittiert – und mit einem
weiteren Fehler. Ein paar Klassiker (`ls`, `whoami`, `pwd`, `sudo`) antworten auch.

## Starten

Reines HTML, CSS und JavaScript – kein Build, keine Abhängigkeiten.
Wegen der ES-Module braucht es aber einen kleinen Webserver:

```bash
python3 -m http.server 8000
# oder
npx http-server -p 8000 -c-1
```

Danach `http://localhost:8000` öffnen.

## Aufbau

```
index.html                 Grundgerüst, Styles, Einstiegspunkt
src/
  main.js                  startet die App
  app.js                   Ablauf: Boot, Befehle, Dauerbetrieb
  components/
    Terminal.js            Ausgabefläche (Zeilen, Scroll, Tippeffekt)
    Prompt.js              Eingabezeile mit Blockcursor und Schnellbefehlen
    StatusLine.js          Statuszeile am unteren Rand
    GlitchOverlay.js       Scanlines, Flackern, Glitch-Stösse
  core/
    generator.js           baut aus den Daten einen kompletten Fehler
    format.js              macht daraus fertige Terminalzeilen
    banner.js              Blockschrift für den grossen Fehlercode
    random.js              Zufalls-Helfer (u. a. "nicht zweimal dasselbe")
    memory.js              merkt sich den letzten Fehler zwischen zwei Besuchen
    dom.js                 winziger DOM-Helfer statt Framework
  data/
    errors.js              Fehlercodes, Module, Severity-Stufen
    jokes.js               50 Witznachrichten
    responses.js           freche Antworten und Chaos-Fehler
    secrets.js             die seltenen Glitch-Events
    system.js              Boot-Log, Stacktrace-Bausteine, Log-Level
  styles/
    base.css               Farben, Tokens, Reset
    terminal.css           Terminal, Prompt, Statuszeile
    effects.css            Animationen und Scanlines
```

## Details

- Dark Mode, Monospace, keine externen Bilder, keine Libraries.
- Responsive für iPhone, iPad und Desktop; die Statuszeile bleibt einzeilig.
- `prefers-reduced-motion` schaltet Scanlines, Flackern und Tippeffekte ab.
- Ohne JavaScript zeigt die Seite einen statischen Fehler – den einzigen echten.
