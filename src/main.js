/**
 * Einstiegspunkt. Sucht den App-Container und startet die Anwendung.
 */
import { mountApp } from './app.js';
import { qs } from './core/dom.js';

const root = qs('#app');

if (root) {
  mountApp(root);
} else {
  // Sollte nie passieren - wäre aber ein sehr passender Fehler.
  console.warn('[error.sys] Kein #app-Container gefunden.');
}
