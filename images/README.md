# images/

Bilddateien der Landingpage. Der Ordner ist derzeit bis auf diese Datei leer —
die Seite lädt **kein einziges Bild** und kommt vollständig mit Inline-SVG und
CSS aus. Das hält die Ladezeit niedrig.

## Was hier noch fehlt

### `og-image.jpg` — erforderlich

Vorschaubild beim Teilen in WhatsApp, LinkedIn, Slack, Facebook und Co.
Ist in allen fünf HTML-Seiten bereits verlinkt.

- Format: 1200 × 630 px, JPG oder PNG, unter 300 KB
- Inhalt: Logo, die Headline und ruhiger Hintergrund in den Markenfarben
- Ohne diese Datei zeigen soziale Netzwerke nur einen grauen Kasten

### `app-screenshot.png` — optional

Der Hero zeigt derzeit ein in HTML/CSS gezeichnetes Telefon-Mockup
(`.mockup` in `css/style.css`). Das ist bewusst so gebaut: kein Ladevorgang,
scharf auf jedem Display.

Wenn du stattdessen einen echten Screenshot zeigen möchtest:

1. Screenshot hier ablegen, z. B. `app-screenshot.png` (Breite ca. 600 px reicht).
2. In `index.html` den kompletten Block `<div class="mockup" …> … </div>` ersetzen:

   ```html
   <img
     src="images/app-screenshot.png"
     alt="Die Fixx-App zeigt die Tagesübersicht mit gebuchten Terminen"
     width="300"
     height="620"
     loading="lazy"
     class="hero__shot"
   />
   ```

3. In `css/style.css` eine passende Regel ergänzen, z. B.:

   ```css
   .hero__shot {
     justify-self: center;
     width: 300px;
     border-radius: 36px;
     box-shadow: var(--shadow-lg);
   }
   ```

Setze `width` und `height` immer mit — sonst springt das Layout beim Laden
(Cumulative Layout Shift).

## Hinweise

- Fotos als **WebP** speichern, wenn möglich; JPG nur als Rückfallebene.
- Jedes inhaltstragende Bild braucht ein aussagekräftiges `alt`-Attribut.
- Rein dekorative Bilder bekommen `alt=""`.
- Bilder unterhalb des ersten Bildschirms mit `loading="lazy"` einbinden.
