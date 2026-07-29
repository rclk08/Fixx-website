# favicon/

Symbole für Browser-Tab, Lesezeichen und Startbildschirm.

## Aktueller Stand

| Datei         | Status      | Verwendung                         |
| ------------- | ----------- | ---------------------------------- |
| `favicon.svg` | Platzhalter | Browser-Tab (alle modernen Browser) |

Das SVG ist ein einfaches Monogramm in den Fixx-Farben. Es funktioniert, ist aber
kein offizielles Logo.

## Noch zu ergänzen

Diese Dateien sind in den HTML-Seiten bereits verlinkt bzw. üblich, liegen aber
noch nicht vor — sie lassen sich nur als Bilddatei erzeugen:

| Datei                  | Größe     | Zweck                              |
| ---------------------- | --------- | ---------------------------------- |
| `apple-touch-icon.png` | 180 × 180 | iOS-Startbildschirm                |
| `favicon-32x32.png`    | 32 × 32   | Fallback für ältere Browser        |
| `favicon.ico`          | 32 × 32   | Sehr alte Browser, manche Crawler  |
| `site.webmanifest`     | –         | Nur nötig, falls die Seite als PWA laufen soll |

Bis `apple-touch-icon.png` existiert, läuft die entsprechende Zeile im `<head>`
ins Leere. Das ist unkritisch (der Browser fällt auf das SVG zurück), sollte vor
dem Livegang aber ergänzt werden.

## Ersetzen

1. Offizielles Logo als quadratisches SVG hier ablegen, Dateiname `favicon.svg`.
2. Aus demselben Logo die PNG-Größen exportieren.
3. Prüfen, ob in allen fünf HTML-Dateien die `<link rel="icon">`-Zeilen passen.
