# Fixx – Landingpage

Statische Website zur Unternehmenspräsentation, für die Stripe-Verifizierung und
als Einstiegsseite für Kundinnen, Kunden und Dienstleister.

Reines HTML5, CSS3 und Vanilla JavaScript. **Kein Framework, kein Build-Schritt,
keine externen Abhängigkeiten** — keine CDN-Skripte, keine Google Fonts, keine
Icon-Bibliothek. Alle Symbole sind Inline-SVG.

Die Seite ist vollständig unabhängig von der mobilen App, dem Admin-Panel und
Supabase. Sie teilt keinerlei Code oder Abhängigkeiten mit diesen Teilen — sie
übernimmt lediglich die Farbwerte, damit Website und Produkt zusammenpassen.

---

## Projektstruktur

```
website/
├── index.html          Startseite: Hero, Funktionen, Branchen, Vorteile,
│                       Preise, FAQ, Call-to-Action
├── impressum.html      Anbieterkennzeichnung (Vorlage)
├── datenschutz.html    Datenschutzerklärung (Vorlage)
├── agb.html            Geschäftsbedingungen (Vorlage)
├── kontakt.html        Kontaktdaten und Formular
│
├── css/
│   ├── style.css       Design-Tokens, Typografie, Layout, Komponenten
│   ├── responsive.css  Alle Breakpoints an einer Stelle (Desktop-first)
│   └── animations.css  Keyframes, Scroll-Reveal, prefers-reduced-motion
│
├── js/
│   └── script.js       Kopfzeile, Menü, FAQ, Scroll-Reveal, Scrollspy,
│                       Formular, Jahreszahl
│
├── images/             Bilder – aktuell leer, siehe images/README.md
├── favicon/            Symbole – Platzhalter, siehe favicon/README.md
│
├── robots.txt          Freigabe für Suchmaschinen, Verweis auf die Sitemap
├── sitemap.xml         Alle fünf Seiten
└── README.md           Diese Datei
```

### Wozu die einzelnen Ordner da sind

| Ordner     | Inhalt                                                              |
| ---------- | ------------------------------------------------------------------- |
| `css/`     | Aufgeteilt nach Zweck: Aussehen, Breakpoints, Bewegung. Beim Ändern eines Abstands landest du in `style.css`, beim Verhalten auf Tablets in `responsive.css`. |
| `js/`      | Eine Datei, in nummerierte Module gegliedert. Jedes Modul prüft zuerst, ob seine Elemente existieren — dieselbe Datei läuft deshalb auf allen Seiten. |
| `images/`  | Bilder. Noch leer: die Seite lädt kein einziges Bild. |
| `favicon/` | Browser-Symbole. Enthält ein Platzhalter-SVG. |

---

## Lokal starten

Ein Doppelklick auf `index.html` genügt für einen ersten Blick. Für realistisches
Verhalten (korrekte Pfade, `mailto:`, kein `file://`-Sonderfall) lieber einen
kleinen Server starten:

```bash
cd website

# Variante 1 – Python (auf den meisten Systemen vorhanden)
python -m http.server 5173

# Variante 2 – Node, ohne Installation
npx serve .
```

Danach im Browser `http://localhost:5173` öffnen.

Es gibt **keinen Build-Schritt**: Datei speichern, Browser neu laden, fertig.

---

## Vor dem Livegang erledigen

### 1. Domain bestätigen

Die Seite verwendet durchgängig `https://www.fixxapp.de` — abgeleitet aus der
Kontaktadresse `support@fixxapp.de` in den Rechtstexten. **Das ist eine
Annahme, keine bestätigte Angabe.** Falls die Domain anders lautet, ersetze sie
in:

- allen fünf HTML-Dateien (`<link rel="canonical">` und die `og:`/`twitter:`-Tags)
- `robots.txt` (Zeile `Sitemap:`)
- `sitemap.xml` (jeder `<loc>`-Eintrag)

Suchen und Ersetzen über den ganzen Ordner erledigt das in einem Schritt.

### 2. Rechtstexte — Herkunft und offene Punkte

`impressum.html`, `datenschutz.html` und `agb.html` enthalten die **echten
Texte aus der Supabase-Tabelle `public.legal_documents`** (Version 1.0.0,
veröffentlicht am 07.06.2026, `is_active = true`). Der Wortlaut wurde
unverändert übernommen und lediglich in semantisches HTML überführt.

Damit sind es dieselben Texte, die auch in der App angezeigt werden. Bei
Änderungen ist die Datenbank die führende Quelle — die HTML-Seiten müssen dann
nachgezogen werden (siehe unten, „Rechtstexte aktualisieren“).

Zwei Punkte, die eine Rechtsberatung prüfen sollte:

- Das Impressum verweist auf **§ 5 TMG**. Das Telemediengesetz wurde im Mai 2024
  durch das **Digitale-Dienste-Gesetz (DDG)** abgelöst; die übliche Formulierung
  lautet heute „Angaben gemäß § 5 DDG“. Der Verweis wurde unverändert aus der
  Datenbank übernommen.
- Die Datenschutzerklärung aus der Datenbank beschreibt die **App**. Für diese
  Website wurde deshalb **Abschnitt 12 „Diese Website“ ergänzt** (keine Cookies,
  kein Tracking, Server-Logfiles beim Hosting-Anbieter, `mailto:`-Formular).
  Ohne diesen Abschnitt fehlten Angaben zur Website selbst. Er steht **nicht**
  in der Datenbank — bei einer Aktualisierung von dort nicht versehentlich
  überschreiben.

### 3. Rechtstexte aktualisieren

Die aktiven Fassungen lassen sich jederzeit abrufen:

```bash
curl -s "$EXPO_PUBLIC_SUPABASE_URL/rest/v1/legal_documents?is_active=eq.true&select=document_type,title,version,content" \
  -H "apikey: $EXPO_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $EXPO_PUBLIC_SUPABASE_ANON_KEY"
```

Die RLS-Policy `Legal documents public read active` erlaubt `anon` das Lesen
aktiver Dokumente — es braucht also nur den öffentlichen Anon-Key.

Nach einer Aktualisierung auch die Zeile „Stand: … · Version …“ am Ende jeder
Rechtsseite anpassen.

### 4. Bilder ergänzen

- `images/og-image.jpg` (1200 × 630) — ohne diese Datei zeigen soziale Netzwerke
  beim Teilen nur einen grauen Kasten.
- `favicon/apple-touch-icon.png` (180 × 180)

Details in `images/README.md` und `favicon/README.md`.

### 5. Social-Media-Links

Die drei Icons im Footer verweisen auf `#`. Echte Profil-URLs eintragen oder die
Links entfernen.

---

## Deployment auf Vercel

Die Seite ist statisch — es gibt nichts zu bauen.

### Variante A: Über die Weboberfläche

1. Repository auf [vercel.com/new](https://vercel.com/new) importieren.
2. **Root Directory** auf `website` setzen. Das ist der entscheidende Schritt:
   Vercel darf nicht das Projekt-Root nehmen, sonst versucht es, die Expo-App zu
   bauen.
3. **Framework Preset**: `Other`.
4. **Build Command** leer lassen, **Output Directory** leer lassen.
5. Deploy.

### Variante B: Über die CLI

```bash
cd website
npx vercel        # Vorschau-Deployment
npx vercel --prod # Produktion
```

Beim ersten Aufruf fragt die CLI nach dem Verzeichnis — `./` bestätigen, da du
bereits in `website/` bist.

### Eigene Domain

Im Vercel-Projekt unter **Settings → Domains** hinzufügen und den DNS-Eintrag
beim Registrar setzen. Danach nicht vergessen, Schritt 1 oben (Domain in
canonical, OG-Tags, `robots.txt`, `sitemap.xml`) nachzuziehen.

### Andere Anbieter

Funktioniert genauso bei Netlify, Cloudflare Pages, GitHub Pages oder klassischem
Webspace: den Inhalt von `website/` hochladen, fertig. Achte nur darauf, dass
`index.html` im Wurzelverzeichnis der Domain liegt.

---

## Navigation und Footer

Kopfzeile und Footer sind auf allen fünf Seiten **als Markup dupliziert**. Das
ist Absicht: ohne Build-Schritt gäbe es nur die Alternative, beides per
JavaScript einzufügen — dann sähen Suchmaschinen und der Stripe-Review die
Navigation und die Rechtslinks im Quelltext nicht.

**Wenn du an Navigation oder Footer etwas änderst, musst du es in allen fünf
Dateien nachziehen.** Ein Unterschied: auf `index.html` zeigen die Menüpunkte auf
Anker (`#funktionen`), auf den Unterseiten auf `index.html#funktionen`.

---

## Wie du die Seite erweiterst

### Neue Seite anlegen

1. Eine bestehende Unterseite kopieren, z. B. `impressum.html` → `preise.html`.
2. `<title>`, `<meta name="description">`, `canonical` und die `og:`-Tags anpassen.
3. Inhalt zwischen `<main id="main">` und `</main>` ersetzen.
4. Einen `<url>`-Block in `sitemap.xml` ergänzen.
5. Falls die Seite ins Menü soll: Link in allen fünf Dateien eintragen
   (Desktop-Navigation *und* mobiles Menü).

### Neuen Abschnitt auf der Startseite

```html
<section class="section section--alt" id="mein-abschnitt">
  <div class="container">
    <div class="section__head" data-reveal>
      <span class="eyebrow">Kurzlabel</span>
      <h2>Überschrift</h2>
      <p class="lead">Einleitung.</p>
    </div>
    <div class="grid grid--3">
      <article class="card" data-reveal data-delay="1">…</article>
    </div>
  </div>
</section>
```

- `section--alt` und `section--mint` wechseln den Hintergrund.
- `data-reveal` blendet das Element beim Scrollen ein.
  Varianten: `data-reveal="left" | "right" | "scale"`.
- `data-delay="1"` bis `"6"` staffelt mehrere Karten.
- Soll der Abschnitt in der Navigation hervorgehoben werden, ergänze am Link
  `data-spy-link`.

### Farben ändern

Alle Farben stehen als Custom Properties oben in `css/style.css` unter `:root`.
Eine Änderung dort wirkt auf die ganze Seite.

### Schrift auf die App-Schriften umstellen

Die Seite nutzt bewusst Systemschriften: kein zusätzlicher Request, keine
Datenübertragung an Dritte, sofort sichtbarer Text.

Wenn du stattdessen die Schriften der App (Outfit, DM Sans) verwenden willst,
lade die `.woff2`-Dateien herunter, lege sie unter `css/fonts/` ab und ergänze in
`style.css`:

```css
@font-face {
  font-family: "Outfit";
  src: url("fonts/outfit-variable.woff2") format("woff2");
  font-weight: 400 800;
  font-display: swap;
}

:root {
  --font-sans: "Outfit", ui-sans-serif, system-ui, sans-serif;
}
```

**Binde die Schriften selbst ein, nicht per Google-Fonts-CDN.** Sonst wird bei
jedem Seitenaufruf die IP-Adresse an einen Drittanbieter übertragen — dann muss
die Datenschutzerklärung ergänzt werden.

### Kontaktformular an ein Backend hängen

Das Formular sendet derzeit nichts an einen Server: `js/script.js` prüft die
Eingaben und öffnet danach das E-Mail-Programm über einen `mailto:`-Link. Deshalb
kommt die Seite ohne Backend aus und die Datenschutzerklärung bleibt kurz.

Für echten Versand (z. B. über Formspree, Vercel Functions oder einen eigenen
Endpunkt):

1. In `kontakt.html` `action` und `method` am `<form>` setzen.
2. In `js/script.js` im Modul „6. Kontaktformular“ den `mailto:`-Block durch
   `form.submit()` oder einen `fetch()`-Aufruf ersetzen. Die Validierung darüber
   kann unverändert bleiben.
3. **Datenschutzerklärung ergänzen**: Empfänger, Zweck, Rechtsgrundlage und
   Speicherdauer. Der aktuelle Abschnitt 5 beschreibt ausdrücklich den
   `mailto:`-Weg und wäre dann falsch.

### Login-Bereich vorbereiten

Die Struktur ist darauf ausgelegt: Kopfzeile, Footer und Design-Tokens sind
seitenunabhängig. Für einen Login-Bereich legst du eine `login.html` nach obigem
Muster an, ergänzt in `robots.txt` ein `Disallow:` für den geschützten Pfad und
nimmst die Seite **nicht** in die Sitemap auf.

---

## Barrierefreiheit und Performance

Beides ist eingebaut, nicht nachträglich draufgesetzt:

- Sprunglink zum Inhalt, semantische Landmarken (`header`, `nav`, `main`, `footer`)
- Sichtbarer Tastaturfokus, `aria-expanded` an Menü und FAQ, `aria-label` an allen
  Icon-Links
- `prefers-reduced-motion` schaltet sämtliche Bewegung ab
- **Ohne JavaScript bleibt die Seite vollständig lesbar** — die Startzustände der
  Scroll-Animation setzt erst das Skript
- Keine externen Requests, keine Bilder, keine Schriftdateien
- Scroll-Ereignisse über `requestAnimationFrame` gedrosselt, Sichtbarkeit über
  `IntersectionObserver` statt Scroll-Rechnerei

## Browser-Unterstützung

Aktuelle Versionen von Chrome, Firefox, Safari und Edge. In älteren Browsern ohne
`IntersectionObserver` bleiben alle Inhalte sichtbar, nur die Einblend-Animation
entfällt.
