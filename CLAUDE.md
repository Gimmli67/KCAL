# KCAL-Rechner

## Projekt
Mobile-first Calorie Tracker Web-App (PWA-Style), deployed auf GitHub Pages.

## Architektur
Einfache 3-Datei-Struktur unter `WebBased/`:
- `index.html` - HTML-Struktur mit allen Tabs
- `app.js` - Gesamte Logik (vanilla JS, kein Framework)
- `style.css` - Catppuccin Mocha Theme

## Tabs
- **Food Scan** - Barcode-Suche (Open Food Facts API), Kamera-Scan (Html5Qrcode, EAN_13/EAN_8/QR_CODE, 30fps), OCR Etikett-Scanner (Tesseract.js), Manual Entry, Daily Status Kreise (% im Kreis), AquaTrack (Wassertropfen mit Fuellstand), Today-Uebersicht (Mahlzeiten pro z'Morge/z'Mittag/z'Nacht mit Loeschen per Position, Summe pro Mahlzeit, Tages-Total)
- **Editor** - Stored Food (Dropdown mit Food/Drinks Gruppen), z'Morge/z'Mittag/z'Nacht Buttons, Food/Drink per 100g/ml (Header+Label wechseln automatisch je nach Einheit), Effective Volume ("For me"), Naehrwert-Grid (Spaltenreihenfolge: Label | Effectiv | pro 100), Save/Clear. Edit-Button auf Food Scan oeffnet Produkt direkt im Editor.
- **Verlauf** - Datums-Navigation (Pfeile, Picker, Today-Button), Tabs: z'Morge/z'Mittag/z'Nacht/Aqua, Clear Day / Clear All History
- **Menus** - Menu zusammenstellen (Drinks-Menge wird auto-gefuellt), Speisekarte: Antippen klappt Details auf (z'xxx Buttons, Edit, Delete), Cancel-Button bei Bearbeitung, Edit ueberschreibt bestehendes Menu
- **Daten** - Import/Export einzeln + Quick Backup (Export All / Import All als `kcal_backup.json`), Reset, Backup-Reminder nach 7 Tagen

## Daten
- Alles in `localStorage` (`kcal_db`, `kcal_meals`, `kcal_templates`, `kcal_aqua`, `kcal_last_export`)
- Initiales Laden von JSON-Dateien (nur wenn localStorage leer): `kcal_datenbank.json`, `kcal_mahlzeiten.json`, `kcal_vorlagen.json` (alle aktuell leer `[]`)
- Naehrwerte immer pro 100g/ml gespeichert
- Kategorien: Food (g) / Drinks (ml) - automatisch erkannt via API (quantity + categories_tags), Fallback: Food

## AquaTrack
- Tagesziel: 3000ml
- Quick-Add Buttons: Wasser 750ml, Espresso 30ml, Kaffee 200ml (mit entsprechenden Remove-Buttons)
- Zaehlt automatisch alle Drinks (ml) aus Mahlzeiten mit
- Tropfen wird gruen bei >= 3000ml
- Eigener localStorage `kcal_aqua`
- History im Verlauf-Tab unter "Aqua"

## Tagesziele
`{ kcal: 2100, eiweiss: 145, kohlenhydrate: 175, fett: 65, zucker: 50, aqua: 3000 }`

## Gesamtmenge (Packungsgroesse)
- Open Food Facts API liefert `product_quantity` (z.B. 330ml fuer Energy Milk)
- Wird im food-display als kleines Input-Feld rechts neben Produktname angezeigt (manuell editierbar)
- Bei Drinks: "For me" Feld im Editor wird automatisch mit Gesamtmenge vorausgefuellt
- Bei Food: "For me" bleibt leer (Portion muss manuell eingegeben werden)
- Anzeige-Format in Dropdowns: `Energy Milk Vanilla (ml) - 84 kcal | 330ml`

## Menus - Regeln
- Saucen (jeglicher Art), Oel und Essig werden in Menus NICHT mitgezaehlt/aufgefuehrt

## Wichtige Regeln
- **JS-Crashes vermeiden**: Wenn HTML-Elemente entfernt werden, MUESSEN alle JS-Referenzen abgesichert werden (`if (!el) return`), da ein Fehler in DOMContentLoaded die ganze App crasht.
- **Keine doppelten `const`** im gleichen Block - verschiedene Variablennamen verwenden (z.B. `saveResult` statt `result`).
- **Buttons auf Englisch**, Beschriftungen/Labels duerfen Deutsch sein.
- **Deployment**: Dateien manuell auf GitHub hochladen (User macht das selbst). Kein Git-Repo lokal.
- **Commit-Files immer auflisten**: Nach Aenderungen dem User immer sagen, welche Dateien hochgeladen werden muessen.
- **Browser-Cache**: Bei Tests lokal immer auf Ctrl+Shift+R (Hard Reload) hinweisen.
- **Toast-Feedback**: Bei Mahlzeit-Speicherung und AquaTrack-Aktionen wird ein gruener Toast angezeigt (2s).
