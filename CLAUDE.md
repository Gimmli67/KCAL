# KCAL-Rechner

## Projekt
Mobile-first Calorie Tracker Web-App (PWA-Style), deployed auf GitHub Pages.

## Architektur
Einfache 3-Datei-Struktur unter `WebBased/`:
- `index.html` - HTML-Struktur mit allen Tabs
- `app.js` - Gesamte Logik (vanilla JS, kein Framework)
- `style.css` - Catppuccin Mocha Theme

## Tabs
- **Food Scan** - Barcode-Suche (Open Food Facts API), Kamera-Scan, OCR Etikett-Scanner (Tesseract.js), Manual Entry, Daily Status Kreise
- **Editor** - Lebensmittel bearbeiten/speichern, Effective Volume Berechnung, als Mahlzeit speichern (z'Morge/z'Mittag/z'Nacht)
- **Verlauf** - Tages-Verlauf pro Mahlzeit
- **Menus** - Speisekarte/Rezeptbuch: Menus aus Produkten zusammenstellen mit Name, werden NICHT ans Tagessoll angerechnet. Erst bei Verwendung als Mahlzeit (z'Morge/z'Mittag/z'Nacht) zaehlt es zum Tag.
- **Daten** - Import/Export JSON, Reset

## Daten
- Alles in `localStorage` (`kcal_db`, `kcal_meals`, `kcal_templates`)
- Initiales Laden von JSON-Dateien: `kcal_datenbank.json`, `kcal_mahlzeiten.json`, `kcal_vorlagen.json`
- Naehrwerte immer pro 100g/ml gespeichert

## Tagesziele
`{ kcal: 2100, eiweiss: 145, kohlenhydrate: 175, fett: 65, zucker: 50 }`

## Wichtige Regeln
- **JS-Crashes vermeiden**: Wenn HTML-Elemente entfernt werden, MUESSEN alle JS-Referenzen abgesichert werden (`if (!el) return`), da ein Fehler in DOMContentLoaded die ganze App crasht.
- **Keine doppelten `const`** im gleichen Block - verschiedene Variablennamen verwenden (z.B. `saveResult` statt `result`).
- **Buttons auf Englisch**, Beschriftungen/Labels duerfen Deutsch sein.
- **Deployment**: Dateien manuell auf GitHub hochladen (User macht das selbst).
