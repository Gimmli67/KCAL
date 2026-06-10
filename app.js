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
        console.log('Daten geladen:', db.length, 'LM,', meals.length, 'Mahlzeiten,', templates.length, 'Menus');
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
    if (name === 'menus') { populateMenuFoodDropdown(); refreshMenuList(); refreshMenuOverview(); }
}

// ===== Dropdown Population =====
function populateMenuFoodDropdown(filter) {
    const sel = $('menu-food-select');
    if (!sel) return;
    sel.innerHTML = '';
    const filtered = filter
        ? db.filter(d => d.Lebensmittel.toLowerCase().includes(filter.toLowerCase()))
        : db;
    const groups = { Food: [], Drinks: [] };
    filtered.forEach(item => {
        const kat = item.Kategorie || (item.Einheit === 'ml' ? 'Drinks' : 'Food');
        groups[kat].push(item);
    });
    for (const [label, items] of Object.entries(groups)) {
        if (items.length === 0) continue;
        const grp = document.createElement('optgroup');
        grp.label = label;
        items.forEach(item => {
            const opt = document.createElement('option');
            opt.value = db.indexOf(item);
            opt.textContent = `${item.Lebensmittel} (${item.Einheit}) - ${item.Kcal} kcal${item.Gesamtmenge ? ' | ' + item.Gesamtmenge + item.Einheit : ''}`;
            grp.appendChild(opt);
        });
        sel.appendChild(grp);
    }
}

function populateEditorFoodDropdown(filter) {
    const sel = $('editor-food-select');
    sel.innerHTML = '';
    const filtered = filter
        ? db.filter(d => d.Lebensmittel.toLowerCase().includes(filter.toLowerCase()))
        : db;
    const groups = { Food: [], Drinks: [] };
    filtered.forEach(item => {
        const kat = item.Kategorie || (item.Einheit === 'ml' ? 'Drinks' : 'Food');
        groups[kat].push(item);
    });
    for (const [label, items] of Object.entries(groups)) {
        if (items.length === 0) continue;
        const grp = document.createElement('optgroup');
        grp.label = label;
        items.forEach(item => {
            const opt = document.createElement('option');
            opt.value = db.indexOf(item);
            opt.textContent = `${item.Lebensmittel} (${item.Einheit}) - ${item.Kcal} kcal${item.Gesamtmenge ? ' | ' + item.Gesamtmenge + item.Einheit : ''}`;
            grp.appendChild(opt);
        });
        sel.appendChild(grp);
    }
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
        if (food.Gesamtmenge && !db[exists].Gesamtmenge) {
            db[exists].Gesamtmenge = food.Gesamtmenge;
            saveDB();
        }
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
    const qtyEl = $('food-display-quantity');
    if (qtyEl) {
        qtyEl.value = food.Gesamtmenge || '';
        qtyEl.placeholder = food.Einheit || 'g/ml';
    }

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
        Kategorie: (p.quantity && /\d+\s*g/.test(p.quantity)) ? 'Food' : 'Drinks',
        Gesamtmenge: parseFloat(p.product_quantity) || null,
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
        const gm = food.Gesamtmenge ? ` | ${food.Gesamtmenge}${food.Einheit}` : '';
        const info = `${food.Lebensmittel} (${food.Einheit}) - ${food.Kcal} kcal${gm}`;
        if (result === 'exists') {
            $('menu-status').textContent = `${info} - bereits vorhanden`;
        } else {
            $('menu-status').textContent = `${info} - gespeichert`;
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
        const edGm = food.Gesamtmenge ? ` (Packung: ${food.Gesamtmenge}${food.Einheit})` : '';
        $('editor-status').textContent = hasValues
            ? `'${food.Lebensmittel}' gefunden - pruefen und speichern.${edGm}`
            : `'${food.Lebensmittel}' gefunden - KEINE Naehrwerte! Manuell eingeben.${edGm}`;
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

// ===== Editor: Effektive Werte berechnen (alt - nicht mehr verwendet) =====
function updateCalcFields() {
    // Wird nicht mehr benoetigt - updateEditorCalc ersetzt diese Funktion
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
    const kategorie = unit === 'ml' ? 'Drinks' : 'Food';
    const entry = {
        Lebensmittel: name, Einheit: unit, Kategorie: kategorie,
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

function updateEditorHeader() {
    const h = $('ed-header');
    if (!h || !editorLoadedFood) return;
    const isDrink = editorLoadedFood.Einheit === 'ml';
    h.textContent = isDrink ? 'Drink per 100ml' : 'Food per 100g';
}

// ===== Editor: Laden =====
let editorLoadedFood = null;

function editorLoad() {
    const sel = $('editor-food-select');
    if (sel.selectedIndex < 0) return;
    const food = db[parseInt(sel.value)];
    if (!food) return;
    editorLoadedFood = food;

    // Felder befuellen
    $('ed-name').value = food.Lebensmittel || '';
    $('ed-kcal').value = food.Kcal ?? '';
    $('ed-fett').value = food.Fett ?? '';
    $('ed-gesaettigt').value = food.Gesaettigt ?? '';
    $('ed-kh').value = food.Kohlenhydrate ?? '';
    $('ed-zucker').value = food.Zucker ?? '';
    $('ed-eiweiss').value = food.Eiweiss ?? '';
    $('ed-salz').value = food.Salz ?? '';
    $('ed-ballaststoffe').value = food.Ballaststoffe ?? '';
    updateEditorHeader();
    $('ed-amount').value = food.Gesamtmenge || '';
    if ($('editor-food-calculated')) $('editor-food-calculated').innerHTML = '';
    updateEditorCalc();
    $('editor-status').textContent = `'${food.Lebensmittel}' geladen.`;
}

function updateEditorCalc() {
    const amount = parseNum($('ed-amount').value);
    const fields = [
        ['ed-kcal', 'ed-kcal-calc'], ['ed-fett', 'ed-fett-calc'],
        ['ed-gesaettigt', 'ed-gesaettigt-calc'], ['ed-kh', 'ed-kh-calc'],
        ['ed-zucker', 'ed-zucker-calc'], ['ed-eiweiss', 'ed-eiweiss-calc'],
        ['ed-salz', 'ed-salz-calc'], ['ed-ballaststoffe', 'ed-ballaststoffe-calc']
    ];
    const header = $('ed-calc-header');
    if (!amount || amount <= 0) {
        if (header) header.textContent = '';
        fields.forEach(([, c]) => { if ($(c)) $(c).textContent = ''; });
        return;
    }
    const unit = editorLoadedFood ? editorLoadedFood.Einheit : 'g';
    if (header) header.innerHTML = `<span style="color:#a6e3a1;font-weight:700">Effectiv</span>`;
    const f = amount / 100;
    fields.forEach(([inputId, calcId]) => {
        const v = parseNum($(inputId).value);
        if ($(calcId)) $(calcId).textContent = v !== null ? (v * f).toFixed(1) : '';
    });
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
    if (sel.selectedIndex < 0) { $('menus-status').textContent = 'Bitte Lebensmittel waehlen.'; return; }
    const amount = parseNum($('menu-amount').value);
    if (!amount || amount <= 0) { $('menus-status').textContent = 'Bitte gueltige Menge eingeben.'; return; }

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
    $('menus-status').textContent = `'${d.Lebensmittel}' hinzugefuegt. (${menuList.length} Positionen)`;
}

// ===== Menue: Entfernen =====
function menuRemove() {
    if (selectedMenuIndex < 0) { $('menus-status').textContent = 'Bitte Eintrag in Liste antippen.'; return; }
    const name = menuList[selectedMenuIndex].Lebensmittel;
    menuList.splice(selectedMenuIndex, 1);
    selectedMenuIndex = -1;
    refreshMenuList();
    $('menus-status').textContent = `'${name}' entfernt.`;
}

// ===== Menue: Leeren =====
function menuClear() {
    menuList = [];
    selectedMenuIndex = -1;
    refreshMenuList();
    $('menus-status').textContent = 'Menue geleert.';
}

// ===== Menue: Als Rezept speichern =====
function menuSaveRecipe() {
    const statusEl = $('menus-status');
    const name = $('menu-name').value.trim();
    if (!name) { statusEl.textContent = 'Bitte Menuname eingeben.'; return; }
    if (menuList.length === 0) { statusEl.textContent = 'Bitte zuerst Lebensmittel hinzufuegen.'; return; }

    const positions = menuList.map(m => ({
        Lebensmittel: m.Lebensmittel, Einheit: m.Einheit, Menge: m.Menge,
        Kcal: m.Kcal, Fett: m.Fett, Gesaettigt: m.Gesaettigt,
        Kohlenhydrate: m.Kohlenhydrate, Zucker: m.Zucker, Eiweiss: m.Eiweiss,
        Salz: m.Salz, Ballaststoffe: m.Ballaststoffe
    }));

    const idx = templates.findIndex(t => t.Name === name);
    if (idx >= 0) { templates[idx] = { Name: name, Positionen: positions }; }
    else { templates.push({ Name: name, Positionen: positions }); }

    saveTemplates();
    menuList = [];
    selectedMenuIndex = -1;
    $('menu-name').value = '';
    refreshMenuList();
    refreshMenuOverview();
    statusEl.textContent = `Menu '${name}' gespeichert.`;
}

// ===== Menue-Uebersicht (Speisekarte) =====
function refreshMenuOverview() {
    const container = $('menu-overview');
    if (!container) return;
    container.innerHTML = '';

    if (templates.length === 0) {
        container.innerHTML = '<div style="color:var(--subtext);text-align:center;padding:12px">Noch keine Menus gespeichert.</div>';
        return;
    }

    templates.forEach((tpl, tplIdx) => {
        let totalKcal = 0;
        tpl.Positionen.forEach(p => {
            totalKcal += (p.Kcal || 0) * (p.Menge || 0) / 100;
        });

        const card = document.createElement('div');
        card.className = 'menu-card';

        const header = document.createElement('div');
        header.className = 'menu-card-header';
        header.innerHTML = `<span class="menu-card-name">${tpl.Name}</span><span class="menu-card-kcal">${Math.round(totalKcal)} kcal</span>`;
        card.appendChild(header);

        const items = document.createElement('div');
        items.className = 'menu-card-items';
        tpl.Positionen.forEach(p => {
            const menge = Math.round(p.Menge || 0);
            const kcal = Math.round((p.Kcal || 0) * menge / 100);
            const div = document.createElement('div');
            div.className = 'menu-card-item';
            div.textContent = `${p.Lebensmittel} - ${menge}${p.Einheit} (${kcal} kcal)`;
            items.appendChild(div);
        });
        card.appendChild(items);

        const actions = document.createElement('div');
        actions.className = 'button-row';
        actions.style.marginTop = '8px';

        ["z'Morge", "z'Mittag", "z'Nacht"].forEach(meal => {
            const btn = document.createElement('button');
            btn.className = 'btn-meal';
            btn.textContent = meal;
            btn.addEventListener('click', () => useMenuAsMeal(tplIdx, meal));
            actions.appendChild(btn);
        });

        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn-red';
        btnDelete.textContent = 'Delete';
        btnDelete.addEventListener('click', () => {
            if (!confirm(`Menu '${tpl.Name}' entfernen?`)) return;
            templates.splice(tplIdx, 1);
            saveTemplates();
            refreshMenuOverview();
            $('menus-status').textContent = `Menu '${tpl.Name}' entfernt.`;
        });

        actions.appendChild(btnDelete);
        card.appendChild(actions);

        container.appendChild(card);
    });
}

// ===== Menu als Mahlzeit verwenden (zaehlt zum Tagessoll) =====
function useMenuAsMeal(tplIdx, mealType) {
    const tpl = templates[tplIdx];
    if (!tpl) return;

    const s = { kcal: 0, fett: 0, kh: 0, zucker: 0, eiweiss: 0 };
    const positions = tpl.Positionen.map(p => {
        const f = (p.Menge || 0) / 100;
        s.kcal += (p.Kcal || 0) * f;
        s.fett += (p.Fett || 0) * f;
        s.kh += (p.Kohlenhydrate || 0) * f;
        s.zucker += (p.Zucker || 0) * f;
        s.eiweiss += (p.Eiweiss || 0) * f;
        return { Lebensmittel: p.Lebensmittel, Menge: p.Menge, Einheit: p.Einheit,
                 Kcal: Math.round((p.Kcal || 0) * f * 10) / 10 };
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
    updateDailyCircles();
    $('menus-status').textContent = `'${tpl.Name}' als ${mealType} gespeichert - ${Math.round(s.kcal)} kcal`;
}

// ===== Mahlzeit speichern (z'Morge / z'Mittag / z'Nacht) =====
function saveMealFromEditor(mealType) {
    if (!editorLoadedFood) {
        $('editor-status').textContent = 'Bitte zuerst ein Lebensmittel auswaehlen.';
        return;
    }
    const amount = parseNum($('ed-amount').value);
    if (!amount || amount <= 0) {
        $('editor-status').textContent = 'Bitte Effective Volume eingeben.';
        return;
    }

    const food = editorLoadedFood;
    const f = amount / 100;

    meals.push({
        Datum: today(),
        Zeit: nowTime(),
        Mahlzeit: mealType,
        Positionen: [{
            Lebensmittel: food.Lebensmittel,
            Menge: amount,
            Einheit: food.Einheit,
            Kcal: Math.round(food.Kcal * f * 10) / 10
        }],
        Summe: {
            Kcal: Math.round(food.Kcal * f * 10) / 10,
            Fett: Math.round(food.Fett * f * 10) / 10,
            Kohlenhydrate: Math.round(food.Kohlenhydrate * f * 10) / 10,
            Zucker: Math.round(food.Zucker * f * 10) / 10,
            Eiweiss: Math.round(food.Eiweiss * f * 10) / 10
        }
    });
    saveMeals();
    updateDailyCircles();
    $('editor-status').textContent = `${food.Lebensmittel} (${Math.round(amount)}${food.Einheit}) als ${mealType} gespeichert.`;
}

// ===== Daily Status Circles =====
function updateDailyCircles() {
    const todayStr = today();
    const todayMeals = meals.filter(m => m.Datum === todayStr);

    const totals = { kcal: 0, eiweiss: 0, kh: 0, fett: 0, zucker: 0 };
    todayMeals.forEach(m => {
        totals.kcal += m.Summe.Kcal || 0;
        totals.eiweiss += m.Summe.Eiweiss || 0;
        totals.kh += m.Summe.Kohlenhydrate || 0;
        totals.fett += m.Summe.Fett || 0;
        totals.zucker += m.Summe.Zucker || 0;
    });

    const circumference = 2 * Math.PI * 52; // 326.7
    const items = [
        ['kcal', totals.kcal, GOALS.kcal],
        ['eiweiss', totals.eiweiss, GOALS.eiweiss],
        ['kh', totals.kh, GOALS.kohlenhydrate],
        ['fett', totals.fett, GOALS.fett],
        ['zucker', totals.zucker, GOALS.zucker]
    ];

    items.forEach(([id, current, goal]) => {
        const pct = goal > 0 ? Math.round((current / goal) * 100) : 0;
        const ratio = Math.min(current / goal, 1);
        const offset = circumference * (1 - ratio);
        const circle = $('circle-' + id);
        const valEl = $('circle-' + id + '-val');
        if (circle) {
            circle.style.strokeDashoffset = offset;
            circle.classList.remove('over', 'warn');
            if (pct > 100) {
                circle.classList.add('over');
            } else if (pct > 80) {
                circle.classList.add('warn');
            }
        }
        if (valEl) valEl.textContent = pct + '%';
    });

    renderDailyMeals(todayMeals);
}

function renderDailyMeals(todayMeals) {
    const container = $('daily-meals-list');
    if (!container) return;

    const mealTypes = ["z'Morge", "z'Mittag", "z'Nacht"];
    let html = '';
    let totalKcal = 0;

    mealTypes.forEach(type => {
        const items = todayMeals.filter(m => m.Mahlzeit === type);
        if (items.length === 0) return;

        let mealKcal = 0;
        items.forEach(m => { mealKcal += m.Summe.Kcal || 0; });
        totalKcal += mealKcal;

        html += `<div class="daily-meal-group">`;
        html += `<div class="daily-meal-header">${type} <span class="daily-meal-sum">(${Math.round(mealKcal)} kcal)</span></div>`;
        items.forEach(m => {
            m.Positionen.forEach((p, pi) => {
                const mealIdx = todayMeals.indexOf(m);
                const kcal = Math.round(p.Kcal);
                html += `<div class="daily-meal-item">${p.Lebensmittel} - ${kcal} kcal <span class="daily-meal-delete" data-meal="${mealIdx}" data-pos="${pi}" title="Remove">✕</span></div>`;
            });
        });
        html += `</div>`;
    });

    if (html) {
        html += `<div class="daily-meal-total">Total: ${Math.round(totalKcal)} / ${GOALS.kcal} kcal</div>`;
    }

    container.innerHTML = html || '<div class="daily-meal-item" style="color:var(--subtext)">Noch keine Mahlzeiten heute</div>';

    container.querySelectorAll('.daily-meal-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const todayStr = today();
            const todayMealsList = meals.filter(m => m.Datum === todayStr);
            const mi = parseInt(btn.dataset.meal);
            const meal = todayMealsList[mi];
            if (!meal) return;
            const globalIdx = meals.indexOf(meal);
            if (globalIdx >= 0) {
                meals.splice(globalIdx, 1);
                saveMeals();
                updateDailyCircles();
            }
        });
    });
}

// ===== Verlauf =====
let currentMealTab = 'zmorge';
const MEAL_NAMES = { zmorge: "z'Morge", zmittag: "z'Mittag", znacht: "z'Nacht" };

function refreshHistory() {
    const content = $('history-content');
    if (!content) return;
    const todayStr = today();
    const mealName = MEAL_NAMES[currentMealTab];
    const mealEntries = meals.filter(m => m.Datum === todayStr && m.Mahlzeit === mealName);

    const lines = [];
    lines.push('==================================================');
    lines.push(`  ${mealName} - ${todayStr}`);
    lines.push('==================================================');

    if (mealEntries.length === 0) {
        lines.push('');
        lines.push(`  Noch nichts fuer ${mealName} gespeichert.`);
    } else {
        const tag = { kcal: 0, fett: 0, kh: 0, zucker: 0, eiweiss: 0 };

        mealEntries.forEach(m => {
            lines.push('');
            lines.push(`  ${m.Zeit}`);
            lines.push('  ' + '-'.repeat(44));
            m.Positionen.forEach(p => {
                const mg = Math.round(p.Menge);
                lines.push(`    ${(p.Lebensmittel || '').padEnd(24)} ${String(mg).padStart(4)}${p.Einheit} ${String(p.Kcal).padStart(6)} kcal`);
            });
            tag.kcal += m.Summe.Kcal;
            tag.fett += m.Summe.Fett;
            tag.kh += m.Summe.Kohlenhydrate;
            tag.zucker += m.Summe.Zucker;
            tag.eiweiss += m.Summe.Eiweiss;
        });

        lines.push('');
        lines.push('==================================================');
        lines.push(`  ${'TOTAL'.padEnd(22)} ${'Ist'.padStart(8)} ${'Ziel'.padStart(6)}`);
        lines.push('==================================================');
        lines.push(`  ${'Kalorien (kcal)'.padEnd(22)} ${tag.kcal.toFixed(1).padStart(8)} ${String(GOALS.kcal).padStart(6)}`);
        lines.push(`  ${'Fett (g)'.padEnd(22)} ${tag.fett.toFixed(1).padStart(8)} ${String(GOALS.fett).padStart(6)}`);
        lines.push(`  ${'Kohlenhydrate (g)'.padEnd(22)} ${tag.kh.toFixed(1).padStart(8)} ${String(GOALS.kohlenhydrate).padStart(6)}`);
        lines.push(`  ${'Zucker (g)'.padEnd(22)} ${tag.zucker.toFixed(1).padStart(8)} ${String(GOALS.zucker).padStart(6)}`);
        lines.push(`  ${'Eiweiss (g)'.padEnd(22)} ${tag.eiweiss.toFixed(1).padStart(8)} ${String(GOALS.eiweiss).padStart(6)}`);
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
    updateDailyCircles();

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

    // --- Manual Entry: Formular ein-/ausblenden ---
    $('menu-manual-entry').addEventListener('click', () => {
        const form = $('manual-entry-form');
        form.classList.toggle('hidden');
        if (!form.classList.contains('hidden')) {
            ['me-name','me-kcal','me-fett','me-gesaettigt','me-kh','me-zucker','me-eiweiss','me-salz','me-ballaststoffe']
                .forEach(id => { if ($(id)) $(id).value = ''; });
        }
    });
    $('me-save').addEventListener('click', () => {
        const name = $('me-name').value.trim();
        if (!name) { $('menu-status').textContent = 'Bitte Produktname eingeben.'; return; }

        const food = {
            Lebensmittel: name, Einheit: 'g',
            Kcal: parseNum($('me-kcal').value) || 0,
            Fett: parseNum($('me-fett').value) || 0,
            Gesaettigt: parseNum($('me-gesaettigt').value) || 0,
            Kohlenhydrate: parseNum($('me-kh').value) || 0,
            Zucker: parseNum($('me-zucker').value) || 0,
            Eiweiss: parseNum($('me-eiweiss').value) || 0,
            Salz: parseNum($('me-salz').value) || 0,
            Ballaststoffe: parseNum($('me-ballaststoffe').value) || 0
        };

        const saveResult = autoSaveFood(food);
        $('manual-entry-form').classList.add('hidden');
        if (saveResult === 'exists') {
            $('menu-status').textContent = `'${name}' bereits vorhanden - ausgewaehlt.`;
        } else {
            $('menu-status').textContent = `'${name}' neu gespeichert. (${food.Kcal} kcal/100g)`;
        }
    });
    $('me-cancel').addEventListener('click', () => {
        $('manual-entry-form').classList.add('hidden');
    });
    $('me-amount').addEventListener('input', () => {
        const amount = parseNum($('me-amount').value);
        const fields = [
            ['me-kcal','me-kcal-calc'],['me-fett','me-fett-calc'],
            ['me-gesaettigt','me-gesaettigt-calc'],['me-kh','me-kh-calc'],
            ['me-zucker','me-zucker-calc'],['me-eiweiss','me-eiweiss-calc'],
            ['me-salz','me-salz-calc'],['me-ballaststoffe','me-ballaststoffe-calc']
        ];
        const header = $('me-calc-header');
        if (!amount || amount <= 0) {
            if (header) header.textContent = '';
            fields.forEach(([,c]) => { if ($(c)) $(c).textContent = ''; });
            return;
        }
        if (header) header.innerHTML = '<span style="color:#a6e3a1;font-weight:700">Effectiv</span>';
        const f = amount / 100;
        fields.forEach(([inputId, calcId]) => {
            const v = parseNum($(inputId).value);
            if ($(calcId)) $(calcId).textContent = v !== null ? (v * f).toFixed(1) : '';
        });
    });

    // --- Menus Tab: Lebensmittel suchen ---
    $('menu-search-btn').addEventListener('click', () => populateMenuFoodDropdown($('menu-search').value));
    $('menu-search').addEventListener('keydown', e => { if (e.key === 'Enter') populateMenuFoodDropdown($('menu-search').value); });

    // --- Menus Tab: Aktionen ---
    $('menu-add').addEventListener('click', menuAdd);
    $('menu-remove').addEventListener('click', menuRemove);
    $('menu-clear').addEventListener('click', menuClear);
    $('menu-save-recipe').addEventListener('click', menuSaveRecipe);

    // --- Editor: Aktionen ---
    $('editor-search-btn').addEventListener('click', () => populateEditorFoodDropdown($('editor-search').value));
    $('editor-search').addEventListener('keydown', e => { if (e.key === 'Enter') populateEditorFoodDropdown($('editor-search').value); });
    $('editor-show-all').addEventListener('click', () => { $('editor-search').value = ''; populateEditorFoodDropdown(); });
    $('editor-food-select').addEventListener('change', editorLoad);
    $('editor-food-select').addEventListener('click', editorLoad);
    $('editor-delete').addEventListener('click', editorDelete);
    $('editor-save').addEventListener('click', editorSave);
    $('editor-clear').addEventListener('click', editorClear);

    // --- Editor: Menge berechnen ---
    $('ed-amount').addEventListener('input', updateEditorCalc);

    // --- Mahlzeit-Buttons ---
    $('btn-zmorge').addEventListener('click', () => saveMealFromEditor("z'Morge"));
    $('btn-zmittag').addEventListener('click', () => saveMealFromEditor("z'Mittag"));
    $('btn-znacht').addEventListener('click', () => saveMealFromEditor("z'Nacht"));

    // --- Verlauf: Meal Tabs ---
    document.querySelectorAll('.meal-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.meal-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMealTab = btn.dataset.meal;
            refreshHistory();
        });
    });

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
            $('data-status').textContent = `${data.length} Menus importiert.`;
        });
        e.target.value = '';
    });
    $('export-templates').addEventListener('click', () => {
        exportData(templates, 'kcal_vorlagen.json');
        $('data-status').textContent = 'Speisekarte exportiert.';
    });

    // --- Reset: Daten neu laden ---
    $('reset-reload').addEventListener('click', () => {
        if (!confirm('Lokale Daten loeschen und vom Server neu laden?')) return;
        localStorage.removeItem('kcal_db');
        localStorage.removeItem('kcal_meals');
        localStorage.removeItem('kcal_templates');
        db = []; meals = []; templates = [];
        loadInitialData().then(() => {
            updateDailyCircles();
            $('data-status').textContent = `Neu geladen: ${db.length} LM, ${meals.length} Mahlzeiten, ${templates.length} Menus.`;
        });
    });

  } catch (e) {
    console.error('Init error:', e);
  }
});
