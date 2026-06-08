'use strict';

// ===== Tagesziele =====
const GOALS = { kcal: 2100, eiweiss: 145, kohlenhydrate: 175, fett: 65, zucker: 50 };

// ===== State =====
let db = [];
let meals = [];
let templates = [];
let menuList = [];
let selectedMenuIndex = -1;
let html5QrCode = null;

// ===== Helpers =====
function $(id) { return document.getElementById(id); }

function parseNum(s) {
    if (typeof s === 'number') return s;
    if (!s) return null;
    const v = parseFloat(String(s).replace(',', '.'));
    return isNaN(v) ? null : v;
}

function round2(v) { return v != null ? Math.round(v * 100) / 100 : 0; }
function today() { return new Date().toISOString().slice(0, 10); }
function nowTime() { return new Date().toTimeString().slice(0, 5); }

// ===== Storage (localStorage) =====
function loadAll() {
    try { db = JSON.parse(localStorage.getItem('kcal_db')) || []; } catch { db = []; }
    try { meals = JSON.parse(localStorage.getItem('kcal_meals')) || []; } catch { meals = []; }
    try { templates = JSON.parse(localStorage.getItem('kcal_templates')) || []; } catch { templates = []; }
}

async function loadInitialData() {
    let changed = false;

    if (db.length === 0) {
        try {
            const res = await fetch('kcal_datenbank.json?' + Date.now());
            if (res.ok) {
                const data = await res.json();
                db = Array.isArray(data) ? data : [data];
                saveDB();
                changed = true;
            }
        } catch (e) { console.log('DB fetch error:', e); }
    }

    if (meals.length === 0) {
        try {
            const res = await fetch('kcal_mahlzeiten.json?' + Date.now());
            if (res.ok) {
                const data = await res.json();
                meals = Array.isArray(data) ? data : [data];
                saveMeals();
                changed = true;
            }
        } catch (e) { console.log('Meals fetch error:', e); }
    }

    if (templates.length === 0) {
        try {
            const res = await fetch('kcal_vorlagen.json?' + Date.now());
            if (res.ok) {
                const data = await res.json();
                templates = Array.isArray(data) ? data : [data];
                saveTemplates();
                changed = true;
            }
        } catch (e) { console.log('Templates fetch error:', e); }
    }

    if (changed) {
        populateMenuFoodDropdown();
        populateEditorFoodDropdown();
        populateTemplateDropdown();
        refreshHistory();
        console.log('Daten geladen:', db.length, 'LM,', meals.length, 'Mahlzeiten,', templates.length, 'Vorlagen');
    }
}

function saveDB() { localStorage.setItem('kcal_db', JSON.stringify(db)); }
function saveMeals() { localStorage.setItem('kcal_meals', JSON.stringify(meals)); }
function saveTemplates() { localStorage.setItem('kcal_templates', JSON.stringify(templates)); }

// ===== Tab Navigation =====
function switchTab(name) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    $('tab-' + name).classList.add('active');
    document.querySelector(`.nav-btn[data-tab="${name}"]`).classList.add('active');
    if (name === 'history') refreshHistory();
}

// ===== Dropdown Population =====
function populateMenuFoodDropdown() {
    const sel = $('menu-food-select');
    if (!sel) return;
    sel.innerHTML = '';
    db.forEach((item, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `${item.Lebensmittel} (${item.Einheit}) - ${item.Kcal} kcal`;
        sel.appendChild(opt);
    });
}

function populateEditorFoodDropdown(filter) {
    const sel = $('editor-food-select');
    sel.innerHTML = '';
    const filtered = filter
        ? db.filter(d => d.Lebensmittel.toLowerCase().includes(filter.toLowerCase()))
        : db;
    filtered.forEach(item => {
        const origIndex = db.indexOf(item);
        const opt = document.createElement('option');
        opt.value = origIndex;
        opt.textContent = `${item.Lebensmittel} (${item.Einheit}) - ${item.Kcal} kcal`;
        sel.appendChild(opt);
    });
    $('editor-status').textContent = `${filtered.length} Eintraege gefunden`;
}

function populateTemplateDropdown() {
    const sel = $('menu-template-select');
    if (!sel) return;
    sel.innerHTML = '';
    templates.forEach((t, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `${t.Name} (${t.Positionen.length} Pos.)`;
        sel.appendChild(opt);
    });
}

// ===== Auto-Save nach Scan =====
function autoSaveFood(food) {
    if (!food.Lebensmittel) return 'none';
    const exists = db.findIndex(d => d.Lebensmittel === food.Lebensmittel);
    if (exists >= 0) {
        showFoodDisplay(db[exists]);
        return 'exists';
    }
    db.push(food);
    saveDB();
    populateEditorFoodDropdown();
    showFoodDisplay(food);
    return 'new';
}

// ===== Naehrwerte anzeigen =====
function showFoodDisplay(food) {
    $('food-display').classList.remove('hidden');
    $('food-display-name').textContent = food.Lebensmittel;

    const rows = [
        ['Kalorien', `${food.Kcal} kcal`],
        ['Fett', `${food.Fett} g`],
        ['dav. gesaettigt', `${food.Gesaettigt} g`],
        ['Kohlenhydrate', `${food.Kohlenhydrate} g`],
        ['dav. Zucker', `${food.Zucker} g`],
        ['Eiweiss', `${food.Eiweiss} g`],
        ['Salz', `${food.Salz} g`],
        ['Ballaststoffe', `${food.Ballaststoffe} g`]
    ];
    $('food-display-nutrients').innerHTML = rows.map(([label, val]) =>
        `<div class="pn-row"><span class="pn-label">${label}</span><span class="pn-value">${val}</span></div>`
    ).join('');
}

// ===== Menu List =====
function refreshMenuList() {
    const box = $('menu-list');
    if (!box) return;
    box.innerHTML = '';
    menuList.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'list-item' + (i === selectedMenuIndex ? ' selected' : '');
        const menge = Math.round(item.Menge);
        const kcal = Math.round(item.Kcal * item.Menge / 100);
        div.textContent = `${item.Lebensmittel} - ${menge}${item.Einheit} (${kcal} kcal)`;
        div.addEventListener('click', () => { selectedMenuIndex = i; refreshMenuList(); });
        box.appendChild(div);
    });
}

// ===== Open Food Facts API =====
async function lookupBarcode(barcode) {
    const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status !== 1) return null;

    const p = data.product;
    const n = p.nutriments || {};
    return {
        Lebensmittel: p.product_name_de || p.product_name || 'Unbekannt',
        Einheit: (p.quantity && /\d+\s*g/.test(p.quantity)) ? 'g' : 'ml',
        Kcal: round2(n['energy-kcal_100g']),
        Fett: round2(n.fat_100g),
        Gesaettigt: round2(n['saturated-fat_100g']),
        Kohlenhydrate: round2(n.carbohydrates_100g),
        Zucker: round2(n.sugars_100g),
        Eiweiss: round2(n.proteins_100g),
        Salz: round2(n.salt_100g),
        Ballaststoffe: round2(n.fiber_100g)
    };
}

// ===== Barcode Search: Hauptfenster =====
async function menuBarcodeSearch() {
    const barcode = $('menu-barcode').value.trim();
    if (!barcode) { $('menu-status').textContent = 'Bitte Barcode eingeben.'; return; }

    $('menu-status').textContent = `Suche Barcode ${barcode}...`;
    try {
        const food = await lookupBarcode(barcode);
        if (!food) { $('menu-status').textContent = `Produkt nicht gefunden: ${barcode}`; return; }

        const result = autoSaveFood(food);
        $('menu-barcode').value = '';
        if (result === 'exists') {
            $('menu-status').textContent = `'${food.Lebensmittel}' bereits vorhanden - ausgewaehlt. (${food.Kcal} kcal/100${food.Einheit})`;
        } else {
            $('menu-status').textContent = `'${food.Lebensmittel}' neu gespeichert. (${food.Kcal} kcal/100${food.Einheit})`;
        }
    } catch (e) {
        $('menu-status').textContent = `Fehler: ${e.message}`;
    }
}

// ===== Barcode Search: Editor =====
async function editorBarcodeSearch() {
    const barcode = $('editor-barcode').value.trim();
    if (!barcode) { $('editor-status').textContent = 'Bitte Barcode eingeben.'; return; }

    $('editor-status').textContent = `Suche Barcode ${barcode}...`;
    try {
        const food = await lookupBarcode(barcode);
        if (!food) { $('editor-status').textContent = `Produkt nicht gefunden: ${barcode}`; return; }

        fillEditorFields(food);
        $('editor-barcode').value = '';
        const hasValues = food.Kcal > 0 || food.Fett > 0 || food.Eiweiss > 0;
        $('editor-status').textContent = hasValues
            ? `'${food.Lebensmittel}' gefunden - pruefen und speichern.`
            : `'${food.Lebensmittel}' gefunden - KEINE Naehrwerte! Manuell eingeben.`;
    } catch (e) {
        $('editor-status').textContent = `Fehler: ${e.message}`;
    }
}

// ===== Editor: Felder befuellen =====
function fillEditorFields(food) {
    $('ed-name').value = food.Lebensmittel || '';
    if ($('ed-unit')) $('ed-unit').value = food.Einheit || 'g';
    $('ed-kcal').value = food.Kcal ?? '';
    $('ed-fett').value = food.Fett ?? '';
    $('ed-gesaettigt').value = food.Gesaettigt ?? '';
    $('ed-kh').value = food.Kohlenhydrate ?? '';
    $('ed-zucker').value = food.Zucker ?? '';
    $('ed-eiweiss').value = food.Eiweiss ?? '';
    $('ed-salz').value = food.Salz ?? '';
    $('ed-ballaststoffe').value = food.Ballaststoffe ?? '';
    $('ed-amount').value = '';
    updateCalcFields();
}

// ===== Editor: Effektive Werte berechnen =====
function updateCalcFields() {
    const amount = parseNum($('ed-amount').value);
    const unit = $('ed-unit') ? $('ed-unit').value : 'g';
    const fields = [
        ['ed-kcal', 'ed-kcal-calc'], ['ed-fett', 'ed-fett-calc'],
        ['ed-gesaettigt', 'ed-gesaettigt-calc'], ['ed-kh', 'ed-kh-calc'],
        ['ed-zucker', 'ed-zucker-calc'], ['ed-eiweiss', 'ed-eiweiss-calc'],
        ['ed-salz', 'ed-salz-calc'], ['ed-ballaststoffe', 'ed-ballaststoffe-calc']
    ];
    if (!amount || amount <= 0) {
        $('ed-calc-header').textContent = '';
        fields.forEach(([, c]) => $(c).textContent = '');
        return;
    }
    $('ed-calc-header').textContent = `pro ${Math.round(amount)}${unit}`;
    const f = amount / 100;
    fields.forEach(([inputId, calcId]) => {
        const v = parseNum($(inputId).value);
        $(calcId).textContent = v !== null ? (v * f).toFixed(1) : '';
    });
}

// ===== Editor: Speichern =====
function editorSave() {
    const name = $('ed-name').value.trim();
    if (!name) { $('editor-status').textContent = 'Bitte Lebensmittel eingeben.'; return; }

    const ids = ['kcal', 'fett', 'gesaettigt', 'kh', 'zucker', 'eiweiss', 'salz', 'ballaststoffe'];
    const vals = {};
    for (const id of ids) {
        const v = parseNum($('ed-' + id).value);
        if (v === null) { $('editor-status').textContent = 'Bitte alle Naehrwerte korrekt eingeben.'; return; }
        vals[id] = v;
    }

    const unit = $('ed-unit') ? $('ed-unit').value : 'g';
    const entry = {
        Lebensmittel: name, Einheit: unit,
        Kcal: vals.kcal, Fett: vals.fett, Gesaettigt: vals.gesaettigt,
        Kohlenhydrate: vals.kh, Zucker: vals.zucker, Eiweiss: vals.eiweiss,
        Salz: vals.salz, Ballaststoffe: vals.ballaststoffe
    };

    const idx = db.findIndex(d => d.Lebensmittel === name && d.Einheit === unit);
    let action;
    if (idx >= 0) { db[idx] = entry; action = 'aktualisiert'; }
    else { db.push(entry); action = 'gespeichert'; }

    saveDB();
    populateEditorFoodDropdown();
    populateMenuFoodDropdown();
    $('editor-status').textContent = `'${name}' ${action}. (${db.length} Eintraege)`;
}

// ===== Editor: Laden =====
let editorLoadedFood = null;

function editorLoad() {
    const sel = $('editor-food-select');
    if (sel.selectedIndex < 0) { $('editor-status').textContent = 'Kein Eintrag ausgewaehlt.'; return; }
    const food = db[parseInt(sel.value)];
    editorLoadedFood = food;
    fillEditorFields(food);

    // Naehrwerte-Anzeige
    $('editor-food-display').classList.remove('hidden');
    $('editor-food-name').textContent = food.Lebensmittel;
    const rows = [
        ['Kalorien', `${food.Kcal} kcal`],
        ['Fett', `${food.Fett} g`],
        ['dav. gesaettigt', `${food.Gesaettigt} g`],
        ['Kohlenhydrate', `${food.Kohlenhydrate} g`],
        ['dav. Zucker', `${food.Zucker} g`],
        ['Eiweiss', `${food.Eiweiss} g`],
        ['Salz', `${food.Salz} g`],
        ['Ballaststoffe', `${food.Ballaststoffe} g`]
    ];
    $('editor-food-nutrients').innerHTML = rows.map(([label, val]) =>
        `<div class="pn-row"><span class="pn-label">${label}</span><span class="pn-value">${val}</span></div>`
    ).join('');
    $('ed-amount').value = '';
    $('editor-food-calculated').innerHTML = '';
    $('editor-status').textContent = `'${food.Lebensmittel}' geladen.`;
}

function updateEditorCalc() {
    if (!editorLoadedFood) return;
    const amount = parseNum($('ed-amount').value);
    if (!amount || amount <= 0) { $('editor-food-calculated').innerHTML = ''; return; }
    const f = amount / 100;
    const food = editorLoadedFood;
    const rows = [
        ['Kalorien', `${(food.Kcal * f).toFixed(1)} kcal`],
        ['Fett', `${(food.Fett * f).toFixed(1)} g`],
        ['dav. gesaettigt', `${(food.Gesaettigt * f).toFixed(1)} g`],
        ['Kohlenhydrate', `${(food.Kohlenhydrate * f).toFixed(1)} g`],
        ['dav. Zucker', `${(food.Zucker * f).toFixed(1)} g`],
        ['Eiweiss', `${(food.Eiweiss * f).toFixed(1)} g`],
        ['Salz', `${(food.Salz * f).toFixed(1)} g`],
        ['Ballaststoffe', `${(food.Ballaststoffe * f).toFixed(1)} g`]
    ];
    $('editor-food-calculated').innerHTML =
        `<div class="group-header" style="margin-top:8px">Naehrwerte fuer ${Math.round(amount)}${food.Einheit}</div>` +
        rows.map(([label, val]) =>
            `<div class="pn-row"><span class="pn-label">${label}</span><span class="pn-value">${val}</span></div>`
        ).join('');
}

// ===== Editor: Loeschen =====
function editorDelete() {
    const sel = $('editor-food-select');
    if (sel.selectedIndex < 0) { $('editor-status').textContent = 'Kein Eintrag ausgewaehlt.'; return; }
    const idx = parseInt(sel.value);
    const name = db[idx].Lebensmittel;
    if (!confirm(`'${name}' wirklich entfernen?`)) return;
    db.splice(idx, 1);
    saveDB();
    populateEditorFoodDropdown();
    populateMenuFoodDropdown();
    $('editor-status').textContent = `'${name}' entfernt.`;
}

// ===== Editor: Felder leeren =====
function editorClear() {
    ['ed-name', 'ed-kcal', 'ed-fett', 'ed-gesaettigt', 'ed-kh', 'ed-zucker',
     'ed-eiweiss', 'ed-salz', 'ed-ballaststoffe', 'ed-amount'].forEach(id => {
        if ($(id)) $(id).value = '';
    });
    if ($('editor-food-display')) $('editor-food-display').classList.add('hidden');
    editorLoadedFood = null;
    $('editor-status').textContent = 'Felder geleert.';
}

// ===== Menue: Hinzufuegen =====
function menuAdd() {
    const sel = $('menu-food-select');
    if (sel.selectedIndex < 0) { $('menu-status').textContent = 'Bitte Lebensmittel waehlen.'; return; }
    const amount = parseNum($('menu-amount').value);
    if (!amount || amount <= 0) { $('menu-status').textContent = 'Bitte gueltige Menge eingeben.'; return; }

    const d = db[parseInt(sel.value)];
    menuList.push({
        Lebensmittel: d.Lebensmittel, Einheit: d.Einheit, Menge: amount,
        Kcal: d.Kcal, Fett: d.Fett, Gesaettigt: d.Gesaettigt,
        Kohlenhydrate: d.Kohlenhydrate, Zucker: d.Zucker, Eiweiss: d.Eiweiss,
        Salz: d.Salz, Ballaststoffe: d.Ballaststoffe
    });
    $('menu-amount').value = '';
    selectedMenuIndex = -1;
    refreshMenuList();
    $('menu-status').textContent = `'${d.Lebensmittel}' hinzugefuegt. (${menuList.length} Positionen)`;
}

// ===== Menue: Entfernen =====
function menuRemove() {
    if (selectedMenuIndex < 0) { $('menu-status').textContent = 'Bitte Eintrag in Liste antippen.'; return; }
    const name = menuList[selectedMenuIndex].Lebensmittel;
    menuList.splice(selectedMenuIndex, 1);
    selectedMenuIndex = -1;
    refreshMenuList();
    $('menu-status').textContent = `'${name}' entfernt.`;
}

// ===== Menue: Leeren =====
function menuClear() {
    menuList = [];
    selectedMenuIndex = -1;
    refreshMenuList();
    $('menu-status').textContent = 'Menue geleert.';
}

// ===== Menue: Berechnen =====
function menuCalculate() {
    if (menuList.length === 0) { $('menu-status').textContent = 'Bitte zuerst Lebensmittel hinzufuegen.'; return; }

    const s = { kcal: 0, fett: 0, ges: 0, kh: 0, zucker: 0, eiweiss: 0, salz: 0, ball: 0 };
    const lines = [];
    lines.push('==================================================');
    lines.push('  MENUE-UEBERSICHT');
    lines.push('==================================================');

    menuList.forEach(m => {
        const f = m.Menge / 100;
        const kc = m.Kcal * f, fe = m.Fett * f, ge = m.Gesaettigt * f;
        const kh = m.Kohlenhydrate * f, zu = m.Zucker * f;
        const ei = m.Eiweiss * f, sa = m.Salz * f, ba = m.Ballaststoffe * f;
        s.kcal += kc; s.fett += fe; s.ges += ge; s.kh += kh;
        s.zucker += zu; s.eiweiss += ei; s.salz += sa; s.ball += ba;
        lines.push(`  ${m.Lebensmittel} (${Math.round(m.Menge)}${m.Einheit})`);
        lines.push(`    Kcal:${kc.toFixed(1).padStart(7)} F:${fe.toFixed(1).padStart(5)} KH:${kh.toFixed(1).padStart(5)} E:${ei.toFixed(1).padStart(5)}`);
        lines.push('');
    });

    lines.push('==================================================');
    lines.push(`  ${'NAEHRSTOFF'.padEnd(22)} ${'GESAMT'.padStart(8)} ${'ZIEL'.padStart(6)}`);
    lines.push('==================================================');
    lines.push(`  ${'Kalorien (kcal)'.padEnd(22)} ${s.kcal.toFixed(1).padStart(8)} ${String(GOALS.kcal).padStart(6)}`);
    lines.push(`  ${'Fett (g)'.padEnd(22)} ${s.fett.toFixed(1).padStart(8)} ${String(GOALS.fett).padStart(6)}`);
    lines.push(`  ${'  dav. gesaettigt'.padEnd(22)} ${s.ges.toFixed(1).padStart(8)}`);
    lines.push(`  ${'Kohlenhydrate (g)'.padEnd(22)} ${s.kh.toFixed(1).padStart(8)} ${String(GOALS.kohlenhydrate).padStart(6)}`);
    lines.push(`  ${'  dav. Zucker (g)'.padEnd(22)} ${s.zucker.toFixed(1).padStart(8)} ${String(GOALS.zucker).padStart(6)}`);
    lines.push(`  ${'Eiweiss (g)'.padEnd(22)} ${s.eiweiss.toFixed(1).padStart(8)} ${String(GOALS.eiweiss).padStart(6)}`);
    lines.push(`  ${'Salz (g)'.padEnd(22)} ${s.salz.toFixed(1).padStart(8)}`);
    lines.push(`  ${'Ballaststoffe (g)'.padEnd(22)} ${s.ball.toFixed(1).padStart(8)}`);
    lines.push('==================================================');
    lines.push('');
    lines.push('  VERBLEIBEND');
    lines.push('--------------------------------------------------');

    const rest = [
        ['Kalorien (kcal)', GOALS.kcal - s.kcal],
        ['Fett (g)', GOALS.fett - s.fett],
        ['Kohlenhydrate (g)', GOALS.kohlenhydrate - s.kh],
        ['Zucker (g)', GOALS.zucker - s.zucker],
        ['Eiweiss (g)', GOALS.eiweiss - s.eiweiss]
    ];
    rest.forEach(([label, v]) => {
        lines.push(`  ${label.padEnd(22)} ${v.toFixed(1).padStart(8)}  ${v < 0 ? 'UEBER' : 'ok'}`);
    });
    lines.push('==================================================');

    showResultModal('Menue-Uebersicht', lines.join('\n'));
    $('menu-status').textContent = `${menuList.length} Pos., ${Math.round(s.kcal)} kcal von ${GOALS.kcal}`;
}

// ===== Menue: Speichern =====
function menuSave() {
    if (menuList.length === 0) { $('menu-status').textContent = 'Bitte zuerst Lebensmittel hinzufuegen.'; return; }

    const mealType = 'Mahlzeit';
    const s = { kcal: 0, fett: 0, kh: 0, zucker: 0, eiweiss: 0 };
    const positions = menuList.map(m => {
        const f = m.Menge / 100;
        s.kcal += m.Kcal * f; s.fett += m.Fett * f; s.kh += m.Kohlenhydrate * f;
        s.zucker += m.Zucker * f; s.eiweiss += m.Eiweiss * f;
        return { Lebensmittel: m.Lebensmittel, Menge: m.Menge, Einheit: m.Einheit,
                 Kcal: Math.round(m.Kcal * f * 10) / 10 };
    });

    meals.push({
        Datum: today(), Zeit: nowTime(), Mahlzeit: mealType,
        Positionen: positions,
        Summe: {
            Kcal: Math.round(s.kcal * 10) / 10, Fett: Math.round(s.fett * 10) / 10,
            Kohlenhydrate: Math.round(s.kh * 10) / 10, Zucker: Math.round(s.zucker * 10) / 10,
            Eiweiss: Math.round(s.eiweiss * 10) / 10
        }
    });
    saveMeals();
    $('menu-status').textContent = `${mealType} gespeichert (${today()} ${nowTime()}) - ${Math.round(s.kcal)} kcal`;
}

// ===== Menue: Als Vorlage =====
function menuSaveAsTemplate() {
    if (menuList.length === 0) { $('menu-status').textContent = 'Bitte zuerst Lebensmittel hinzufuegen.'; return; }
    const name = prompt('Name fuer die Vorlage:');
    if (!name || !name.trim()) return;

    const positions = menuList.map(m => ({
        Lebensmittel: m.Lebensmittel, Einheit: m.Einheit, Menge: m.Menge
    }));
    const idx = templates.findIndex(t => t.Name === name.trim());
    if (idx >= 0) { templates[idx] = { Name: name.trim(), Positionen: positions }; }
    else { templates.push({ Name: name.trim(), Positionen: positions }); }

    saveTemplates();
    populateTemplateDropdown();
    $('menu-status').textContent = `Vorlage '${name.trim()}' gespeichert.`;
}

// ===== Vorlage: Laden =====
function menuLoadTemplate() {
    const sel = $('menu-template-select');
    if (sel.selectedIndex < 0) { $('menu-status').textContent = 'Keine Vorlage ausgewaehlt.'; return; }

    const tpl = templates[parseInt(sel.value)];
    menuList = [];
    selectedMenuIndex = -1;
    const notFound = [];

    tpl.Positionen.forEach(pos => {
        const d = db.find(x => x.Lebensmittel === pos.Lebensmittel);
        if (!d) { notFound.push(pos.Lebensmittel); return; }
        menuList.push({
            Lebensmittel: d.Lebensmittel, Einheit: d.Einheit, Menge: pos.Menge,
            Kcal: d.Kcal, Fett: d.Fett, Gesaettigt: d.Gesaettigt,
            Kohlenhydrate: d.Kohlenhydrate, Zucker: d.Zucker, Eiweiss: d.Eiweiss,
            Salz: d.Salz, Ballaststoffe: d.Ballaststoffe
        });
    });
    refreshMenuList();
    $('menu-status').textContent = notFound.length > 0
        ? `Geladen. ACHTUNG: ${notFound.join(', ')} nicht in DB!`
        : `'${tpl.Name}' geladen. (${menuList.length} Pos.)`;
}

// ===== Vorlage: Loeschen =====
function menuDeleteTemplate() {
    const sel = $('menu-template-select');
    if (sel.selectedIndex < 0) { $('menu-status').textContent = 'Keine Vorlage ausgewaehlt.'; return; }
    const idx = parseInt(sel.value);
    const name = templates[idx].Name;
    if (!confirm(`Vorlage '${name}' entfernen?`)) return;
    templates.splice(idx, 1);
    saveTemplates();
    populateTemplateDropdown();
    $('menu-status').textContent = `Vorlage '${name}' entfernt.`;
}

// ===== Verlauf =====
function refreshHistory() {
    const content = $('history-content');
    const todayStr = today();
    const todayMeals = meals.filter(m => m.Datum === todayStr);

    const lines = [];
    lines.push('==================================================');
    lines.push(`  TAGESVERLAUF - ${todayStr}`);
    lines.push('==================================================');

    if (todayMeals.length === 0) {
        lines.push('');
        lines.push('  Heute noch keine Mahlzeiten gespeichert.');
    } else {
        const tag = { kcal: 0, fett: 0, kh: 0, zucker: 0, eiweiss: 0 };

        todayMeals.forEach(m => {
            lines.push('');
            lines.push(`  ${m.Mahlzeit} (${m.Zeit})`);
            lines.push('  ' + '-'.repeat(44));
            m.Positionen.forEach(p => {
                const mg = Math.round(p.Menge);
                lines.push(`    ${(p.Lebensmittel || '').padEnd(24)} ${String(mg).padStart(4)}${p.Einheit} ${String(p.Kcal).padStart(6)} kcal`);
            });
            lines.push(`    ${'Summe:'.padEnd(24)} ${String(m.Summe.Kcal).padStart(11)} kcal`);
            tag.kcal += m.Summe.Kcal;
            tag.fett += m.Summe.Fett;
            tag.kh += m.Summe.Kohlenhydrate;
            tag.zucker += m.Summe.Zucker;
            tag.eiweiss += m.Summe.Eiweiss;
        });

        lines.push('');
        lines.push('==================================================');
        lines.push(`  ${'TAGESGESAMT'.padEnd(22)} ${'Ist'.padStart(8)} ${'Ziel'.padStart(6)}`);
        lines.push('==================================================');
        lines.push(`  ${'Kalorien (kcal)'.padEnd(22)} ${tag.kcal.toFixed(1).padStart(8)} ${String(GOALS.kcal).padStart(6)}`);
        lines.push(`  ${'Fett (g)'.padEnd(22)} ${tag.fett.toFixed(1).padStart(8)} ${String(GOALS.fett).padStart(6)}`);
        lines.push(`  ${'Kohlenhydrate (g)'.padEnd(22)} ${tag.kh.toFixed(1).padStart(8)} ${String(GOALS.kohlenhydrate).padStart(6)}`);
        lines.push(`  ${'Zucker (g)'.padEnd(22)} ${tag.zucker.toFixed(1).padStart(8)} ${String(GOALS.zucker).padStart(6)}`);
        lines.push(`  ${'Eiweiss (g)'.padEnd(22)} ${tag.eiweiss.toFixed(1).padStart(8)} ${String(GOALS.eiweiss).padStart(6)}`);
        lines.push('==================================================');
        lines.push('');
        lines.push('  VERBLEIBEND');
        lines.push('--------------------------------------------------');

        const rest = [
            ['Kalorien (kcal)', GOALS.kcal - tag.kcal],
            ['Fett (g)', GOALS.fett - tag.fett],
            ['Kohlenhydrate (g)', GOALS.kohlenhydrate - tag.kh],
            ['Zucker (g)', GOALS.zucker - tag.zucker],
            ['Eiweiss (g)', GOALS.eiweiss - tag.eiweiss]
        ];
        rest.forEach(([label, v]) => {
            lines.push(`  ${label.padEnd(22)} ${v.toFixed(1).padStart(8)}  ${v < 0 ? 'UEBER' : 'ok'}`);
        });
        lines.push('==================================================');
    }

    content.textContent = lines.join('\n');
}

// ===== Barcode Kamera-Scanner =====
function startBarcodeScanner(onSuccess) {
    if (typeof Html5Qrcode === 'undefined') {
        alert('Barcode-Scanner nicht verfuegbar.\nInternet wird fuer den Kamera-Scanner benoetigt.');
        return;
    }
    $('scanner-modal').classList.remove('hidden');

    html5QrCode = new Html5Qrcode('scanner-reader');

    // Scan-Region an Bildschirmgroesse anpassen
    const screenW = Math.min(window.innerWidth - 60, 400);
    const boxW = Math.round(screenW * 0.85);
    const boxH = Math.round(boxW * 0.4);

    html5QrCode.start(
        { facingMode: 'environment' },
        {
            fps: 15,
            qrbox: { width: boxW, height: boxH },
            aspectRatio: 1.0,
            formatsToSupport: [
                Html5QrcodeSupportedFormats.EAN_13,
                Html5QrcodeSupportedFormats.EAN_8,
                Html5QrcodeSupportedFormats.UPC_A,
                Html5QrcodeSupportedFormats.UPC_E,
                Html5QrcodeSupportedFormats.CODE_128,
                Html5QrcodeSupportedFormats.CODE_39,
                Html5QrcodeSupportedFormats.QR_CODE
            ]
        },
        text => { stopBarcodeScanner(); onSuccess(text); },
        () => {}
    ).catch(err => {
        $('scanner-modal').classList.add('hidden');
        alert('Kamera konnte nicht gestartet werden:\n' + err);
    });
}

function stopBarcodeScanner() {
    $('scanner-modal').classList.add('hidden');
    if (html5QrCode) {
        html5QrCode.stop().catch(() => {});
        html5QrCode = null;
    }
}

// ===== Etikett-Scanner (OCR mit Tesseract.js) =====
function parseNutrition(text) {
    const result = {};
    const t = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');
    let m;

    if ((m = t.match(/(?:Brennwert|Energie)[^\d]*\d+[\.,]?\d*\s*kJ\s*[\/\|]\s*(\d+[\.,]?\d*)\s*kcal/i))) {
        result.Kcal = parseFloat(m[1].replace(',', '.'));
    } else if ((m = t.match(/(\d+[\.,]?\d*)\s*kcal/i))) {
        result.Kcal = parseFloat(m[1].replace(',', '.'));
    }

    if ((m = t.match(/(?<!ges[aä]ttigte\w*\s)(?<!unges[aä]ttigte\w*\s)Fett\s*[:\s]+(\d+[\.,]?\d*)\s*g/i))) {
        result.Fett = parseFloat(m[1].replace(',', '.'));
    }
    if ((m = t.match(/ges[äa]ttigte?\s*(?:Fetts[äa]uren?)?\s*[:\s]+(\d+[\.,]?\d*)\s*g/i))) {
        result.Gesaettigt = parseFloat(m[1].replace(',', '.'));
    }
    if ((m = t.match(/Kohlenhydrate?\s*[:\s]+(\d+[\.,]?\d*)\s*g/i))) {
        result.Kohlenhydrate = parseFloat(m[1].replace(',', '.'));
    }
    if ((m = t.match(/Zucker\s*[:\s]+(\d+[\.,]?\d*)\s*g/i))) {
        result.Zucker = parseFloat(m[1].replace(',', '.'));
    }
    if ((m = t.match(/(?:Eiwei[sß]|Protein)\s*[:\s]+(\d+[\.,]?\d*)\s*g/i))) {
        result.Eiweiss = parseFloat(m[1].replace(',', '.'));
    }
    if ((m = t.match(/Salz\s*[:\s]+(\d+[\.,]?\d*)\s*g/i))) {
        result.Salz = parseFloat(m[1].replace(',', '.'));
    }
    if ((m = t.match(/Ballaststoffe?\s*[:\s]+(\d+[\.,]?\d*)\s*g/i))) {
        result.Ballaststoffe = parseFloat(m[1].replace(',', '.'));
    }

    return result;
}

async function scanLabel(file) {
    if (typeof Tesseract === 'undefined') {
        alert('OCR nicht verfuegbar.\nInternet wird fuer den Etikett-Scanner benoetigt.');
        return null;
    }

    const modal = $('ocr-modal');
    const bar = $('ocr-progress-bar');
    const statusText = $('ocr-status-text');
    modal.classList.remove('hidden');
    bar.style.width = '0%';
    statusText.textContent = 'OCR wird initialisiert (Sprachdaten werden geladen)...';

    try {
        const worker = await Tesseract.createWorker('deu', 1, {
            logger: m => {
                if (m.status === 'recognizing text') {
                    bar.style.width = Math.round(m.progress * 100) + '%';
                    statusText.textContent = `Texterkennung: ${Math.round(m.progress * 100)}%`;
                } else if (m.status === 'loading language traineddata') {
                    bar.style.width = Math.round(m.progress * 50) + '%';
                    statusText.textContent = `Sprachdaten laden: ${Math.round(m.progress * 100)}%`;
                } else {
                    statusText.textContent = m.status || 'Verarbeite...';
                }
            }
        });

        const { data: { text } } = await worker.recognize(file);
        await worker.terminate();
        modal.classList.add('hidden');

        if (!text || !text.trim()) {
            alert('Kein Text im Bild erkannt.');
            return null;
        }

        return { text, values: parseNutrition(text) };
    } catch (e) {
        modal.classList.add('hidden');
        alert('OCR-Fehler: ' + e.message);
        return null;
    }
}

// ===== Modals =====
function showResultModal(title, text) {
    $('result-title').textContent = title;
    $('result-text').textContent = text;
    $('result-modal').classList.remove('hidden');
}

// ===== Import / Export =====
function exportData(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function importData(file, callback) {
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result);
            callback(Array.isArray(data) ? data : [data]);
        } catch {
            alert('Ungueltige JSON-Datei.');
        }
    };
    reader.readAsText(file);
}

// ===== Initialisierung =====
document.addEventListener('DOMContentLoaded', () => {
  try {
    loadAll();
    populateMenuFoodDropdown();
    populateEditorFoodDropdown();
    populateTemplateDropdown();
    refreshHistory();
    loadInitialData();

    // --- Tab Navigation ---
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // --- Menue: Barcode ---
    $('menu-barcode-search').addEventListener('click', menuBarcodeSearch);
    $('menu-barcode').addEventListener('keydown', e => { if (e.key === 'Enter') menuBarcodeSearch(); });
    $('menu-barcode-cam').addEventListener('click', () => {
        startBarcodeScanner(code => {
            $('menu-barcode').value = code;
            $('menu-status').textContent = `Barcode erkannt: ${code}`;
            menuBarcodeSearch();
        });
    });

    // --- Menue: Etikett scannen ---
    $('menu-label-scan').addEventListener('click', () => $('label-file-input-menu').click());
    $('label-file-input-menu').addEventListener('change', async e => {
        const file = e.target.files[0];
        if (!file) return;
        e.target.value = '';

        const result = await scanLabel(file);
        if (!result) return;

        const v = result.values;
        const count = Object.keys(v).length;
        $('menu-status').textContent = `Etikett gescannt: ${count} von 8 Werten erkannt.`;

        const name = prompt('Produktname eingeben:');
        if (!name || !name.trim()) { $('menu-status').textContent = 'Abgebrochen - kein Name eingegeben.'; return; }

        const food = {
            Lebensmittel: name.trim(), Einheit: 'g',
            Kcal: v.Kcal ?? 0, Fett: v.Fett ?? 0, Gesaettigt: v.Gesaettigt ?? 0,
            Kohlenhydrate: v.Kohlenhydrate ?? 0, Zucker: v.Zucker ?? 0,
            Eiweiss: v.Eiweiss ?? 0, Salz: v.Salz ?? 0, Ballaststoffe: v.Ballaststoffe ?? 0
        };

        const saveResult = autoSaveFood(food);
        if (saveResult === 'exists') {
            $('menu-status').textContent = `'${name.trim()}' bereits vorhanden - ausgewaehlt. (${food.Kcal} kcal/100g)`;
        } else {
            $('menu-status').textContent = `'${name.trim()}' neu gespeichert. (${food.Kcal} kcal/100g)`;
        }
    });

    // --- Menue: Aktionen (deaktiviert - kommt spaeter) ---

    // --- Editor: Aktionen ---
    $('editor-search-btn').addEventListener('click', () => populateEditorFoodDropdown($('editor-search').value));
    $('editor-search').addEventListener('keydown', e => { if (e.key === 'Enter') populateEditorFoodDropdown($('editor-search').value); });
    $('editor-show-all').addEventListener('click', () => { $('editor-search').value = ''; populateEditorFoodDropdown(); });
    $('editor-food-select').addEventListener('change', editorLoad);
    $('editor-delete').addEventListener('click', editorDelete);
    $('editor-save').addEventListener('click', editorSave);
    $('editor-clear').addEventListener('click', editorClear);

    // --- Editor: Menge berechnen ---
    $('ed-amount').addEventListener('input', updateEditorCalc);

    // --- Verlauf ---
    $('history-refresh').addEventListener('click', refreshHistory);

    // --- Modals ---
    $('scanner-close').addEventListener('click', stopBarcodeScanner);
    $('result-close').addEventListener('click', () => $('result-modal').classList.add('hidden'));

    // --- Import / Export ---
    $('import-db').addEventListener('click', () => $('import-db-file').click());
    $('import-db-file').addEventListener('change', e => {
        if (!e.target.files[0]) return;
        importData(e.target.files[0], data => {
            db = data; saveDB(); populateMenuFoodDropdown(); populateEditorFoodDropdown();
            $('data-status').textContent = `${data.length} Lebensmittel importiert.`;
        });
        e.target.value = '';
    });
    $('export-db').addEventListener('click', () => {
        exportData(db, 'kcal_datenbank.json');
        $('data-status').textContent = 'Datenbank exportiert.';
    });

    $('import-meals').addEventListener('click', () => $('import-meals-file').click());
    $('import-meals-file').addEventListener('change', e => {
        if (!e.target.files[0]) return;
        importData(e.target.files[0], data => {
            meals = data; saveMeals();
            $('data-status').textContent = `${data.length} Mahlzeiten importiert.`;
        });
        e.target.value = '';
    });
    $('export-meals').addEventListener('click', () => {
        exportData(meals, 'kcal_mahlzeiten.json');
        $('data-status').textContent = 'Mahlzeiten exportiert.';
    });

    $('import-templates').addEventListener('click', () => $('import-templates-file').click());
    $('import-templates-file').addEventListener('change', e => {
        if (!e.target.files[0]) return;
        importData(e.target.files[0], data => {
            templates = data; saveTemplates(); populateTemplateDropdown();
            $('data-status').textContent = `${data.length} Vorlagen importiert.`;
        });
        e.target.value = '';
    });
    $('export-templates').addEventListener('click', () => {
        exportData(templates, 'kcal_vorlagen.json');
        $('data-status').textContent = 'Vorlagen exportiert.';
    });

    // --- Reset: Daten neu laden ---
    $('reset-reload').addEventListener('click', () => {
        if (!confirm('Lokale Daten loeschen und vom Server neu laden?')) return;
        localStorage.removeItem('kcal_db');
        localStorage.removeItem('kcal_meals');
        localStorage.removeItem('kcal_templates');
        db = []; meals = []; templates = [];
        loadInitialData().then(() => {
            $('data-status').textContent = `Neu geladen: ${db.length} LM, ${meals.length} Mahlzeiten, ${templates.length} Vorlagen.`;
        });
    });

  } catch (e) {
    console.error('Init error:', e);
  }
});
