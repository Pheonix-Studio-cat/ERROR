# ERROR

Eine Website, die sich als komplett kaputtes System ausgibt.
Sie sieht aus wie ein Terminal im Browser – und es kommen ausschliesslich Fehler,
rund um die Uhr. Alle Fehler sind erfunden: Es gibt keinen Server, keine Requests
und keinen einzigen echten Fehler.

Die Oberfläche gibt es auf **Englisch und Deutsch**; umgeschaltet wird über das
Feld `lang:` neben den Befehlen oder mit `lang en` / `lang de`. Die Startsprache
kommt aus dem Browser, die Wahl wird gespeichert.

## Was passiert

- Bei jedem Laden wird ein neuer Fehler gewürfelt (Code, technische Beschreibung
  und Witz werden unabhängig voneinander kombiniert).
- Danach liefern die Knoten des Serverpools von selbst weitere Fehler – wie ein
  Log, das man offen liegen lässt.
- Jeder Fehler bekommt eine eigene Error-ID (`ERR-7F3A-91C2`), eine Severity
  (`LOW` … `CRITICAL`, `probably fine`), ein Modul und einen Fake-Stacktrace.
- Sehr selten (1 %) erscheint ein verstecktes Event. Eines davon behauptet
  kurz, alles sei repariert – und fällt dann zurück in den nächsten Fehler.
- Dazu kommt das GLITCH UPDATE (siehe unten).

## Multi Server 🖥️🖥️🖥️

Fehler kommen nicht einfach so, sondern aus einem Pool von Knoten – natürlich
erfundenen. Mehr Knoten heisst schlicht: mehr Fehler pro Minute.

- **Seltene Fehler tauchen früher auf.** Sechs Knoten liefern gemessen rund
  dreimal so viele Fehler wie einer – und damit dreimal so schnell die seltenen
  Glitches. Wie viele du schon gesehen hast, zeigt `servers`.
- **Überlastung trifft nur einen Knoten.** Jeder Knoten hat eine eigene Last;
  sie steigt mit jedem Fehler und besonders bei `make it worse`. Ab 100 %
  steigt genau dieser Knoten für ein paar Sekunden aus und startet neu – die
  anderen laufen ungerührt weiter. Ist niemand sonst online, kommt er schneller
  zurück.
- **Unter Last wird es schneller.** Der Taktabstand eines Knotens sinkt mit
  steigender Last von 7–14 s auf 1–2,4 s. Das Gerät merkt das.

Damit die Seite dabei nicht wirklich zusammenbricht, gibt es harte Grenzen:
höchstens 6 Knoten, ein globaler Mindestabstand von 380 ms zwischen zwei
Fehlern, keine Ausgabe im Hintergrund-Tab und eine begrenzte Zeilenzahl im DOM.
Gemessen kommen so höchstens ein bis zwei Fehler pro Sekunde an.

```
server pool
  srv-01  eu-central-1   online      load  21%   errors 4
  srv-02  us-east-2      rebooting   load   0%   errors 9
  rare errors found: 2 / 11
```

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
| `servers` | Übersicht über den Serverpool |
| `server add` | einen Knoten dazunehmen (max. 6) |
| `server kill <id>` | einen Knoten abschalten |
| `lang en` / `lang de` | Sprache umschalten |

Unbekannte Eingaben werden mit `command not found` quittiert – und mit einem
weiteren Fehler. Ein paar Klassiker (`ls`, `whoami`, `pwd`, `sudo`) antworten auch.

## GLITCH UPDATE 👾

Zusätzlich zu den normalen Fehlern gibt es seltene **Glitch-Fehler**. Jeder hat
eine eigene, feste Wahrscheinlichkeit; bei jeder Ziehung wird einmal gewürfelt.
Trifft der Wurf kein Glitch-Band, kommt ein ganz normaler Fehler – das ist in
rund drei Vierteln aller Fälle so.

| Stufe | Fehler | Chance | Effekt |
| --- | --- | --- | --- |
| leicht | `0xGLITCH` SCREEN CORRUPTION DETECTED | 5 % | RGB-Split |
| leicht | `404.5` REALITY BUFFER ERROR | 4,5 % | Text-Jitter |
| selten | `RGB` COLOR CORRUPTION | 3,5 % | RGB-Split + Jitter |
| selten | `???` DATA CORRUPTION | 2,8 % | Zeichenkorruption |
| selten | `67` SIX SEVEN | 2,5 % | der ganze Screen schaukelt |
| selten | `666` VISUAL CORRUPTION | 2 % | Bildverschiebung + RGB |
| sehr selten | `0xDEAD` DISPLAY FAILURE | 1,5 % | Verschiebung + RGB + Korruption |
| sehr selten | `0x000` DISPLAY LOST | 1,2 % | Screen wird 0,3–1 s schwarz |
| sehr selten | `∞` SYSTEM COLLAPSE | 0,8 % | vier Effekte kombiniert |
| sehr selten | `ERROR` THE ERROR HAS ENCOUNTERED AN ERROR | 0,6 % | Korruption + RGB + UI-Versatz |
| extrem selten | `∅` SIGNAL LOST | 0,3 % | der Screen verschwindet: `... ... ... oh. ERROR.` |

Gesamt liegen alle Glitches bei rund 24,7 % – jeder einzelne deutlich unter 10 %.
Die Werte stehen in `src/data/glitches.js` und lassen sich dort direkt ändern.

Regeln, die im Code hart eingehalten werden:

- immer nur eine Effekt-Sequenz gleichzeitig; ein neuer Glitch bricht den alten sauber ab
- jeder Effekt ist zeitlich begrenzt, alle Timer werden mitgeführt und beendet
- danach sind alle Klassen entfernt und jeder veränderte Text wiederhergestellt
- keine Endlosschleifen, keine Dauereffekte, kein Ton
- animiert werden nur `transform`, `opacity` und `text-shadow`
- bei `prefers-reduced-motion` passiert gar nichts

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
    GlitchEngine.js        führt die kurzen Bildstörungen aus
    Prompt.js              Eingabezeile mit Blockcursor und Schnellbefehlen
    StatusLine.js          Statuszeile am unteren Rand
    GlitchOverlay.js       Scanlines, Flackern, Glitch-Stösse
  core/
    generator.js           baut aus den Daten einen kompletten Fehler
    servers.js             der Serverpool (Takt, Last, Überlastung)
    i18n.js                Sprachumschaltung Englisch / Deutsch
    format.js              macht daraus fertige Terminalzeilen
    banner.js              Blockschrift für den grossen Fehlercode
    random.js              Zufalls-Helfer (u. a. "nicht zweimal dasselbe")
    memory.js              merkt sich den letzten Fehler zwischen zwei Besuchen
    dom.js                 winziger DOM-Helfer statt Framework
  data/
    errors.js              Fehlercodes, Module, Severity-Stufen
    glitches.js            Glitch-Fehler mit Wahrscheinlichkeit und Effekten
    jokes.js               50 Witznachrichten (en/de)
    responses.js           freche Antworten und Chaos-Fehler (en/de)
    secrets.js             die seltenen versteckten Events
    system.js              Boot-Log, Stacktrace-Bausteine, Log-Level
  styles/
    base.css               Farben, Tokens, Reset
    terminal.css           Terminal, Prompt, Sprachfeld, Statuszeile
    effects.css            Animationen und Scanlines
    glitch.css             die Effekte des GLITCH UPDATE
```

## Details

- Dark Mode, Monospace, keine externen Bilder, keine Libraries.
- Zweisprachig (en/de); Texte liegen als `{ en, de }` in den Datendateien.
- Responsive für iPhone, iPad und Desktop; die Statuszeile bleibt einzeilig.
- `prefers-reduced-motion` schaltet Scanlines, Flackern und Tippeffekte ab.
- Ohne JavaScript zeigt die Seite einen statischen Fehler – den einzigen echten.
