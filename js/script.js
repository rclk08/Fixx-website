/* ==========================================================================
   Fixx – Landingpage
   script.js · Vanilla JavaScript, keine Abhängigkeiten

   Module in dieser Datei:
     1. Kopfzeile     – Schatten beim Scrollen
     2. Mobiles Menü  – Hamburger, Escape, Klick außerhalb
     3. FAQ           – Akkordeon mit animierter Höhe
     4. Scroll-Reveal – IntersectionObserver
     5. Scrollspy     – aktiver Navigationspunkt
     6. Kontakt       – Validierung und Versand über das E-Mail-Programm
     7. Jahreszahl    – Copyright im Footer

   Jedes Modul prüft zuerst, ob die benötigten Elemente existieren. Dadurch
   läuft dieselbe Datei auf allen Seiten, ohne Fehler zu werfen.
   ========================================================================== */

(function () {
  'use strict';

  /** Nutzer möchte möglichst wenig Bewegung. */
  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ------------------------------------------------------------------------
     1. Kopfzeile
     ---------------------------------------------------------------------- */

  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;

    var ticking = false;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        // rAF-Drosselung: pro Frame höchstens eine Auswertung
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );

    update();
  }

  /* ------------------------------------------------------------------------
     2. Mobiles Menü
     ---------------------------------------------------------------------- */

  function initMobileNav() {
    var burger = document.querySelector('[data-burger]');
    var panel = document.querySelector('[data-mobile-nav]');
    if (!burger || !panel) return;

    function setOpen(open) {
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.classList.toggle('is-open', open);
      document.body.classList.toggle('is-menu-open', open);
    }

    function isOpen() {
      return burger.getAttribute('aria-expanded') === 'true';
    }

    burger.addEventListener('click', function () {
      setOpen(!isOpen());
    });

    // Nach der Auswahl eines Ziels schließen
    panel.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        burger.focus();
      }
    });

    // Klick außerhalb von Panel und Button schließt ebenfalls
    document.addEventListener('click', function (event) {
      if (!isOpen()) return;
      if (panel.contains(event.target) || burger.contains(event.target)) return;
      setOpen(false);
    });

    // Beim Wechsel auf Desktopbreite darf kein offener Zustand zurückbleiben
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024 && isOpen()) setOpen(false);
    });
  }

  /* ------------------------------------------------------------------------
     3. FAQ-Akkordeon

     Die Antwort wird über eine konkrete Pixelhöhe auf- und zugefahren, weil
     `height: auto` nicht animierbar ist. Nach dem Öffnen wird die Höhe auf
     `auto` zurückgesetzt, damit umbrechender Text nicht abgeschnitten wird.
     ---------------------------------------------------------------------- */

  function initFaq() {
    var items = document.querySelectorAll('[data-faq-item]');
    if (!items.length) return;

    Array.prototype.forEach.call(items, function (item) {
      var button = item.querySelector('[data-faq-q]');
      var answer = item.querySelector('[data-faq-a]');
      if (!button || !answer) return;

      function open() {
        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
        answer.hidden = false;

        if (prefersReducedMotion) {
          answer.style.height = 'auto';
          return;
        }

        answer.style.height = answer.scrollHeight + 'px';
        answer.addEventListener('transitionend', function done(event) {
          if (event.propertyName !== 'height') return;
          answer.removeEventListener('transitionend', done);
          // Freigeben, damit spätere Umbrüche die Höhe nicht sprengen
          if (item.classList.contains('is-open')) answer.style.height = 'auto';
        });
      }

      function close() {
        item.classList.remove('is-open');
        button.setAttribute('aria-expanded', 'false');

        if (prefersReducedMotion) {
          answer.style.height = '0px';
          answer.hidden = true;
          return;
        }

        // Von 'auto' auf einen Pixelwert fixieren, sonst springt der Übergang
        answer.style.height = answer.scrollHeight + 'px';
        window.requestAnimationFrame(function () {
          answer.style.height = '0px';
        });

        // Erst nach dem Zufahren aus dem Accessibility-Tree nehmen, damit
        // Screenreader und Tabulator die eingeklappte Antwort nicht erreichen.
        answer.addEventListener('transitionend', function done(event) {
          if (event.propertyName !== 'height') return;
          answer.removeEventListener('transitionend', done);
          if (!item.classList.contains('is-open')) answer.hidden = true;
        });
      }

      button.addEventListener('click', function () {
        if (item.classList.contains('is-open')) close();
        else open();
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. Scroll-Reveal

     Die Startzustände stehen in animations.css hinter `.js-reveal`. Die Klasse
     wird hier gesetzt — ohne JavaScript bleibt also alles sichtbar.
     ---------------------------------------------------------------------- */

  function initReveal() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    // Kein Observer (sehr alte Browser) oder reduzierte Bewegung:
    // Inhalte einfach unverändert stehen lassen.
    if (!('IntersectionObserver' in window) || prefersReducedMotion) return;

    document.documentElement.classList.add('js-reveal');

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          // Einmal sichtbar, dauerhaft sichtbar – Beobachtung beenden
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    );

    Array.prototype.forEach.call(targets, function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     5. Scrollspy – hebt den Navigationspunkt des sichtbaren Abschnitts hervor
     ---------------------------------------------------------------------- */

  function initScrollSpy() {
    var links = document.querySelectorAll('[data-spy-link]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    var sections = [];

    Array.prototype.forEach.call(links, function (link) {
      var id = link.getAttribute('href');
      if (!id || id.charAt(0) !== '#') return;
      var section = document.querySelector(id);
      if (!section) return;
      map[id.slice(1)] = link;
      sections.push(section);
    });

    if (!sections.length) return;

    function clear() {
      Array.prototype.forEach.call(links, function (link) {
        link.classList.remove('is-active');
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var link = map[entry.target.id];
          if (!link) return;
          clear();
          link.classList.add('is-active');
        });
      },
      // Schmales Band in der oberen Bildschirmhälfte als „aktuell“
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ------------------------------------------------------------------------
     6. Kontaktformular

     Bewusst ohne Backend: das Formular prüft die Eingaben und öffnet dann das
     E-Mail-Programm mit vorbereitetem Betreff und Text. Dadurch verlassen die
     Daten den Browser nicht — passend zu den Angaben in der Datenschutz-
     erklärung. Wie du stattdessen einen echten Endpunkt anbindest, steht in
     der README.
     ---------------------------------------------------------------------- */

  function initContactForm() {
    var form = document.querySelector('[data-contact-form]');
    if (!form) return;

    var recipient = form.getAttribute('data-recipient') || '';

    function fieldOf(input) {
      return input.closest('.field');
    }

    function validate(input) {
      var value = (input.value || '').trim();
      var valid = value.length > 0;

      if (valid && input.type === 'email') {
        // Absichtlich großzügig – die eigentliche Prüfung macht der Mailserver
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      }

      var field = fieldOf(input);
      if (field) field.classList.toggle('has-error', !valid);
      input.setAttribute('aria-invalid', valid ? 'false' : 'true');
      return valid;
    }

    var inputs = form.querySelectorAll('[data-required]');

    Array.prototype.forEach.call(inputs, function (input) {
      // Erst nach dem Verlassen prüfen, nicht bei jedem Tastendruck
      input.addEventListener('blur', function () {
        validate(input);
      });
      input.addEventListener('input', function () {
        var field = fieldOf(input);
        if (field && field.classList.contains('has-error')) validate(input);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var allValid = true;
      var firstInvalid = null;

      Array.prototype.forEach.call(inputs, function (input) {
        if (validate(input)) return;
        allValid = false;
        if (!firstInvalid) firstInvalid = input;
      });

      if (!allValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var name = (form.elements.name.value || '').trim();
      var email = (form.elements.email.value || '').trim();
      var subject = (form.elements.subject.value || '').trim();
      var message = (form.elements.message.value || '').trim();

      var body =
        'Name: ' + name + '\n' + 'E-Mail: ' + email + '\n\n' + message + '\n';

      window.location.href =
        'mailto:' +
        encodeURIComponent(recipient) +
        '?subject=' +
        encodeURIComponent(subject) +
        '&body=' +
        encodeURIComponent(body);
    });
  }

  /* ------------------------------------------------------------------------
     7. Jahreszahl im Footer
     ---------------------------------------------------------------------- */

  function initYear() {
    var slots = document.querySelectorAll('[data-year]');
    var year = String(new Date().getFullYear());
    Array.prototype.forEach.call(slots, function (slot) {
      slot.textContent = year;
    });
  }

  /* ------------------------------------------------------------------------
     Start
     ---------------------------------------------------------------------- */

  function init() {
    initHeader();
    initMobileNav();
    initFaq();
    initReveal();
    initScrollSpy();
    initContactForm();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
