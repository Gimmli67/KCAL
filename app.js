'use strict';

// ===== Tagesziele =====
const GOALS = { kcal: 2100, eiweiss: 145, kohlenhydrate: 175, fett: 65, zucker: 50, aqua: 3000 };

// ===== Fruit-Datenbank (pro 100g, typische Durchschnittswerte) =====
// gewicht = typisches Portionsgewicht (1 Stück oder übliche Portion bei Kleinfrüchten)
const FRUCHT_DB = [
    { name: 'Ananas',              gewicht: 200, kcal: 50,  fett: 0.1, ges: 0.0, kh: 13,  zucker: 10,  eiweiss: 0.5, salz: 0.0, ball: 1.4 },
    { name: 'Apfel',               gewicht: 160, kcal: 52,  fett: 0.2, ges: 0.0, kh: 14,  zucker: 10,  eiweiss: 0.3, salz: 0.0, ball: 2.4 },
    { name: 'Aprikose',            gewicht: 150, kcal: 48,  fett: 0.4, ges: 0.0, kh: 11,  zucker: 9,   eiweiss: 1.4, salz: 0.0, ball: 2.0 },
    { name: 'Banane',              gewicht: 110, kcal: 89,  fett: 0.3, ges: 0.1, kh: 23,  zucker: 12,  eiweiss: 1.1, salz: 0.0, ball: 2.6 },
    { name: 'Birne',               gewicht: 160, kcal: 57,  fett: 0.1, ges: 0.0, kh: 15,  zucker: 10,  eiweiss: 0.4, salz: 0.0, ball: 3.1 },
    { name: 'Brombeere',           gewicht: 100, kcal: 43,  fett: 0.5, ges: 0.0, kh: 10,  zucker: 4.9, eiweiss: 1.4, salz: 0.0, ball: 5.3 },
    { name: 'Erdbeere',            gewicht: 150, kcal: 32,  fett: 0.3, ges: 0.0, kh: 7.7, zucker: 4.9, eiweiss: 0.7, salz: 0.0, ball: 2.0 },
    { name: 'Feige',               gewicht: 120, kcal: 74,  fett: 0.3, ges: 0.1, kh: 19,  zucker: 16,  eiweiss: 0.8, salz: 0.0, ball: 2.9 },
    { name: 'Grapefruit',          gewicht: 230, kcal: 42,  fett: 0.1, ges: 0.0, kh: 11,  zucker: 7,   eiweiss: 0.8, salz: 0.0, ball: 1.6 },
    { name: 'Heidelbeere',         gewicht: 100, kcal: 57,  fett: 0.3, ges: 0.0, kh: 14,  zucker: 10,  eiweiss: 0.7, salz: 0.0, ball: 2.4 },
    { name: 'Himbeere',            gewicht: 100, kcal: 52,  fett: 0.7, ges: 0.0, kh: 12,  zucker: 4.4, eiweiss: 1.2, salz: 0.0, ball: 6.5 },
    { name: 'Honigmelone',         gewicht: 200, kcal: 36,  fett: 0.1, ges: 0.0, kh: 9,   zucker: 8,   eiweiss: 0.5, salz: 0.0, ball: 0.9 },
    { name: 'Johannisbeere (rot)', gewicht: 80,  kcal: 56,  fett: 0.2, ges: 0.0, kh: 14,  zucker: 7,   eiweiss: 1.4, salz: 0.0, ball: 4.3 },
    { name: 'Kirsche',             gewicht: 150, kcal: 63,  fett: 0.2, ges: 0.0, kh: 16,  zucker: 13,  eiweiss: 1.1, salz: 0.0, ball: 2.1 },
    { name: 'Kiwi',                gewicht: 70,  kcal: 61,  fett: 0.5, ges: 0.0, kh: 15,  zucker: 9,   eiweiss: 1.1, salz: 0.0, ball: 3.0 },
    { name: 'Limette',             gewicht: 50,  kcal: 30,  fett: 0.2, ges: 0.0, kh: 11,  zucker: 1.7, eiweiss: 0.7, salz: 0.0, ball: 2.8 },
    { name: 'Mandarine',           gewicht: 180, kcal: 53,  fett: 0.3, ges: 0.0, kh: 13,  zucker: 11,  eiweiss: 0.8, salz: 0.0, ball: 1.8 },
    { name: 'Mango',               gewicht: 250, kcal: 60,  fett: 0.4, ges: 0.1, kh: 15,  zucker: 14,  eiweiss: 0.8, salz: 0.0, ball: 1.6 },
    { name: 'Nektarine',           gewicht: 130, kcal: 44,  fett: 0.3, ges: 0.0, kh: 11,  zucker: 7.7, eiweiss: 1.1, salz: 0.0, ball: 1.7 },
    { name: 'Orange',              gewicht: 160, kcal: 47,  fett: 0.1, ges: 0.0, kh: 12,  zucker: 9,   eiweiss: 0.9, salz: 0.0, ball: 2.4 },
    { name: 'Papaya',              gewicht: 300, kcal: 43,  fett: 0.3, ges: 0.1, kh: 11,  zucker: 7.8, eiweiss: 0.5, salz: 0.0, ball: 1.7 },
    { name: 'Pfirsich',            gewicht: 140, kcal: 39,  fett: 0.3, ges: 0.0, kh: 10,  zucker: 8.4, eiweiss: 0.9, salz: 0.0, ball: 1.5 },
    { name: 'Pflaume',             gewicht: 150, kcal: 46,  fett: 0.3, ges: 0.0, kh: 11,  zucker: 10,  eiweiss: 0.7, salz: 0.0, ball: 1.4 },
    { name: 'Traube',              gewicht: 150, kcal: 69,  fett: 0.2, ges: 0.1, kh: 18,  zucker: 16,  eiweiss: 0.6, salz: 0.0, ball: 0.9 },
    { name: 'Wassermelone',        gewicht: 250, kcal: 30,  fett: 0.2, ges: 0.0, kh: 8,   zucker: 6,   eiweiss: 0.6, salz: 0.0, ball: 0.4 },
    { name: 'Zitrone',             gewicht: 60,  kcal: 29,  fett: 0.3, ges: 0.0, kh: 9,   zucker: 2.5, eiweiss: 1.1, salz: 0.0, ball: 2.8 },
];

// ===== Gemüse-Datenbank (pro 100g) =====
const GEMUESE_DB = [
    { name: 'Blumenkohl',     kcal: 25,  fett: 0.3, ges: 0.1, kh: 5.0, zucker: 1.9, eiweiss: 1.9, salz: 0.1, ball: 2.0, favorit: true, gm: 600  },
    { name: 'Icebergsalat',   kcal: 13,  fett: 0.2, ges: 0.0, kh: 2.2, zucker: 1.6, eiweiss: 0.9, salz: 0.0, ball: 1.2, gm: 300 },
    { name: 'Kopfsalat',      kcal: 14,  fett: 0.2, ges: 0.0, kh: 2.0, zucker: 0.9, eiweiss: 1.3, salz: 0.0, ball: 1.5, gm: 200 },
    { name: 'Weißkohl',       kcal: 25,  fett: 0.1, ges: 0.0, kh: 5.8, zucker: 3.2, eiweiss: 1.3, salz: 0.0, ball: 2.5, gm: 1000 },
    { name: 'Erbsen',         kcal: 81,  fett: 0.4, ges: 0.1, kh: 14,  zucker: 5.7, eiweiss: 5.4, salz: 0.0, ball: 5.1 },
    { name: 'Fenchel',        kcal: 31,  fett: 0.2, ges: 0.0, kh: 7.0, zucker: 3.9, eiweiss: 1.3, salz: 0.1, ball: 3.1, gm: 250 },
    { name: 'Gurke',          kcal: 15,  fett: 0.1, ges: 0.0, kh: 3.6, zucker: 1.7, eiweiss: 0.7, salz: 0.0, ball: 0.5, gm: 400 },
    { name: 'Rüebli',         kcal: 41,  fett: 0.2, ges: 0.0, kh: 10,  zucker: 4.7, eiweiss: 0.9, salz: 0.1, ball: 2.8, favorit: true, gm: 80 },
    { name: 'Knoblauch',      kcal: 149, fett: 0.5, ges: 0.1, kh: 33,  zucker: 1.0, eiweiss: 6.4, salz: 0.0, ball: 2.1, gm: 5   },
    { name: 'Kohlrabi',       kcal: 27,  fett: 0.1, ges: 0.0, kh: 6.2, zucker: 3.9, eiweiss: 1.7, salz: 0.0, ball: 3.6, gm: 300 },
    { name: 'Lauch',          kcal: 31,  fett: 0.3, ges: 0.0, kh: 7.0, zucker: 3.9, eiweiss: 1.5, salz: 0.0, ball: 1.8, favorit: true, gm: 200 },
    { name: 'Mais',           kcal: 86,  fett: 1.2, ges: 0.2, kh: 19,  zucker: 3.2, eiweiss: 3.2, salz: 0.0, ball: 2.7 },
    { name: 'Paprika gelb',   kcal: 27,  fett: 0.2, ges: 0.0, kh: 6.3, zucker: 4.6, eiweiss: 1.0, salz: 0.0, ball: 1.7, gm: 160 },
    { name: 'Paprika grün',   kcal: 20,  fett: 0.2, ges: 0.0, kh: 4.6, zucker: 2.4, eiweiss: 0.9, salz: 0.0, ball: 1.7, gm: 160 },
    { name: 'Paprika rot',    kcal: 31,  fett: 0.3, ges: 0.0, kh: 6.0, zucker: 4.2, eiweiss: 1.0, salz: 0.0, ball: 2.1, gm: 160 },
    { name: 'Peperoni',       kcal: 40,  fett: 0.4, ges: 0.1, kh: 9.0, zucker: 5.1, eiweiss: 2.0, salz: 0.0, ball: 1.5, gm: 15  },
    { name: 'Randen',         kcal: 43,  fett: 0.2, ges: 0.0, kh: 10,  zucker: 6.8, eiweiss: 1.6, salz: 0.1, ball: 2.8, gm: 200 },
    { name: 'Sellerie',       kcal: 16,  fett: 0.2, ges: 0.0, kh: 3.0, zucker: 1.8, eiweiss: 0.7, salz: 0.1, ball: 1.6, gm: 40  },
    { name: 'Spinat',         kcal: 23,  fett: 0.4, ges: 0.1, kh: 3.6, zucker: 0.4, eiweiss: 2.9, salz: 0.2, ball: 2.2 },
    { name: 'Tomate',         kcal: 18,  fett: 0.2, ges: 0.0, kh: 3.9, zucker: 2.6, eiweiss: 0.9, salz: 0.0, ball: 1.2, gm: 120 },
    { name: 'Zwiebel',        kcal: 40,  fett: 0.1, ges: 0.0, kh: 9.3, zucker: 4.2, eiweiss: 1.1, salz: 0.0, ball: 1.7, gm: 80  },
    { name: 'Coleslaw Salat', kcal: 140, fett: 10.0, ges: 1.5, kh: 11.0, zucker: 8.0, eiweiss: 1.2, salz: 0.7, ball: 1.8 },
    { name: 'Bohnen (grün)',  kcal: 31,  fett: 0.2, ges: 0.0, kh: 7.0, zucker: 3.3, eiweiss: 1.8, salz: 0.0, ball: 3.4 },
    { name: 'Zuckerhut',      kcal: 17,  fett: 0.2, ges: 0.0, kh: 3.2, zucker: 0.5, eiweiss: 1.3, salz: 0.0, ball: 3.1, gm: 400 },
    { name: 'Rettich',        kcal: 16,  fett: 0.1, ges: 0.0, kh: 3.2, zucker: 2.3, eiweiss: 1.1, salz: 0.0, ball: 1.8, gm: 250 },
    { name: 'Radisli',        kcal: 14,  fett: 0.1, ges: 0.0, kh: 2.8, zucker: 1.8, eiweiss: 0.7, salz: 0.1, ball: 1.6, gm: 10  },
    { name: 'Champignons',    kcal: 20,  fett: 0.3, ges: 0.0, kh: 0.5,  zucker: 0.4, eiweiss: 2.3, salz: 0.2, ball: 1.3, gm: 20  },
    { name: 'Cherrytomaten',  kcal: 20,  fett: 0.3, ges: 0.0, kh: 3.9, zucker: 2.6, eiweiss: 0.9, salz: 0.0, ball: 1.2, gm: 250 },
    { name: 'Peterli',        kcal: 36,  fett: 0.8, ges: 0.1, kh: 6.3, zucker: 0.9, eiweiss: 3.0, salz: 0.14, ball: 3.3 },
    { name: 'Schnittlauch',   kcal: 30,  fett: 0.7, ges: 0.1, kh: 4.4, zucker: 1.9, eiweiss: 3.3, salz: 0.01, ball: 2.5 },
];

// ===== Beilagen-Datenbank (pro 100g, roh/trocken) =====
const BEILAGEN_DB = [
    // Teigwaren
    { name: 'Hörnli (roh)',         kcal: 370, fett: 1.5, ges: 0.3, kh: 74.0, zucker: 3.0, eiweiss: 13.0, salz: 0.1, ball: 3.0 },
    { name: 'Spaghetti (roh)',      kcal: 365, fett: 1.5, ges: 0.3, kh: 73.0, zucker: 2.5, eiweiss: 13.0, salz: 0.0, ball: 2.5 },
    { name: 'Penne (roh)',          kcal: 360, fett: 1.5, ges: 0.3, kh: 72.0, zucker: 2.5, eiweiss: 13.0, salz: 0.0, ball: 2.5 },
    { name: 'Tagliatelle (roh)',    kcal: 365, fett: 2.0, ges: 0.5, kh: 72.0, zucker: 2.5, eiweiss: 13.0, salz: 0.1, ball: 2.5 },
    { name: 'Lasagneplatten (roh)', kcal: 360, fett: 1.5, ges: 0.3, kh: 72.0, zucker: 2.0, eiweiss: 13.0, salz: 0.1, ball: 2.5 },
    { name: 'Spätzli (roh)',        kcal: 225, fett: 3.5, ges: 1.0, kh: 38.0, zucker: 1.0, eiweiss: 8.5,  salz: 0.8, ball: 1.5 },
    // Reis
    { name: 'Weisser Reis (roh)',   kcal: 350, fett: 0.5, ges: 0.1, kh: 77.0, zucker: 0.1, eiweiss: 7.0,  salz: 0.0, ball: 1.4 },
    { name: 'Vollkornreis (roh)',   kcal: 330, fett: 2.7, ges: 0.5, kh: 69.0, zucker: 0.5, eiweiss: 7.5,  salz: 0.0, ball: 3.5 },
    { name: 'Risotto Reis (roh)',   kcal: 350, fett: 0.4, ges: 0.1, kh: 78.0, zucker: 0.3, eiweiss: 6.5,  salz: 0.0, ball: 1.0 },
    { name: 'Risotto Funghi',       kcal: 354, fett: 2.5, ges: 0.5, kh: 74.0, zucker: 0.5,  eiweiss: 8.0, salz: 2.7,  ball: 1.5, gm: null },
    // Kartoffel-Beilagen
    { name: 'Härdöpfel',            kcal: 77,  fett: 0.1, ges: 0.0, kh: 17.0, zucker: 0.8, eiweiss: 2.0,  salz: 0.0, ball: 2.2 },
    { name: 'Rösti FixFertig',      kcal: 110, fett: 5.0, ges: 0.5, kh: 13,   zucker: 0.0, eiweiss: 2.0,  salz: 0.88, ball: 2.0, gm: 250 },
    { name: 'Berner Rösti',         kcal: 107, fett: 5.0, ges: 1.5, kh: 11,   zucker: 0.5, eiweiss: 3.5,  salz: 1.2,  ball: 2.0, gm: 250 },
    { name: 'McCain Pommes Frites', kcal: 158, fett: 5.0, ges: 0.5, kh: 24,   zucker: 0.5, eiweiss: 2.9,  salz: 0.03, ball: 2.8, gm: 750 },
    { name: 'Pommes Duchesse',      kcal: 165, fett: 8.0, ges: 0.7, kh: 18,   zucker: 1.5, eiweiss: 4.5,  salz: 0.98, ball: 1.5, gm: 600 },
    { name: 'Stocki',               kcal: 83,  fett: 3.0, ges: 1.8, kh: 11.0, zucker: 1.0, eiweiss: 2.0,  salz: 0.6,  ball: 1.5 },
    { name: 'Härdöpfelsalat',       kcal: 160, fett: 10.0, ges: 1.5, kh: 14,  zucker: 1.5, eiweiss: 3.0,  salz: 1.0,  ball: 1.5 },
    // Frühstück
    { name: 'Haferflocken (zart)',  kcal: 367, fett: 7.0, ges: 1.3, kh: 59.0, zucker: 1.1, eiweiss: 13.0, salz: 0.0, ball: 10.0 },
    { name: 'Granola Crunchy',      kcal: 430, fett: 15.0, ges: 2.0, kh: 62.0, zucker: 20.0, eiweiss: 8.0, salz: 0.1, ball: 5.0 },
    // Milchbrei-Zutaten
    { name: 'Milchreis',            kcal: 348, fett: 0.7, ges: 0.2, kh: 77.0, zucker: 0.2, eiweiss: 6.7,  salz: 0.0, ball: 1.0 },
    { name: 'Griess (Hartweizen, roh)', kcal: 348, fett: 1.0, ges: 0.2, kh: 71.0, zucker: 1.5, eiweiss: 12.5, salz: 0.0, ball: 3.5 },
];

// ===== Milchprodukte-Datenbank (pro 100g/ml, Schweizer Durchschnittswerte) =====
const MILCH_DB = [
    // Milch
    { name: 'Vollmilch (3.5%)',       kcal: 64,  fett: 3.5,  ges: 2.2,  kh: 4.8, zucker: 4.8, eiweiss: 3.3,  salz: 0.1, ball: 0.0 },
    { name: 'Halbmilch (1.5%)',       kcal: 47,  fett: 1.5,  ges: 1.0,  kh: 4.8, zucker: 4.8, eiweiss: 3.3,  salz: 0.1, ball: 0.0 },
    { name: 'Protein Milk (Emmi Good Day, UHT)', kcal: 42, fett: 0.1, ges: 0.1, kh: 2.7, zucker: 2.7, eiweiss: 7.0, salz: 0.08, ball: 0.0 },
    // Rahm
    { name: 'Halbrahm (15%)',         kcal: 160, fett: 15.0, ges: 9.5,  kh: 3.5, zucker: 3.5, eiweiss: 2.8,  salz: 0.1, ball: 0.0 },
    { name: 'Rahm (35%)',             kcal: 340, fett: 35.0, ges: 22.0, kh: 3.0, zucker: 3.0, eiweiss: 2.5,  salz: 0.1, ball: 0.0 },
    // Joghurt
    { name: 'Joghurt nature (3.5%)',  kcal: 63,  fett: 3.5,  ges: 2.2,  kh: 4.5, zucker: 4.5, eiweiss: 3.5,  salz: 0.1, ball: 0.0 },
    { name: 'Joghurt mager (0.1%)',   kcal: 38,  fett: 0.1,  ges: 0.1,  kh: 5.0, zucker: 5.0, eiweiss: 4.0,  salz: 0.1, ball: 0.0 },
    { name: 'Joghurt griechisch',     kcal: 130, fett: 10.0, ges: 6.0,  kh: 4.0, zucker: 4.0, eiweiss: 6.0,  salz: 0.1, ball: 0.0 },
    { name: 'Fruchtyoghurt',          kcal: 100, fett: 2.5,  ges: 1.6,  kh: 15.0, zucker: 14.0, eiweiss: 3.5, salz: 0.1, ball: 0.0 },
    { name: 'Skyr Nature',            kcal: 63,  fett: 0.2,  ges: 0.1,  kh: 4.0, zucker: 4.0, eiweiss: 11.0, salz: 0.1, ball: 0.0 },
    { name: 'Skyr Vanille',           kcal: 68,  fett: 0.2,  ges: 0.1,  kh: 8.0, zucker: 6.5, eiweiss: 10.5, salz: 0.1, ball: 0.0 },
    // Quark & Frischkäse
    { name: 'Magerquark',             kcal: 67,  fett: 0.3,  ges: 0.2,  kh: 4.0, zucker: 4.0, eiweiss: 12.0, salz: 0.1, ball: 0.0 },
    { name: 'Frischkäse (Halbfett)',  kcal: 110, fett: 7.0,  ges: 4.5,  kh: 3.0, zucker: 3.0, eiweiss: 8.0,  salz: 0.5, ball: 0.0 },
    { name: 'Hüttenkäse',             kcal: 85,  fett: 3.5,  ges: 2.0,  kh: 3.0, zucker: 3.0, eiweiss: 10.0, salz: 0.5, ball: 0.0 },
    // Käse
    { name: 'Gruyère',               kcal: 413, fett: 32.0, ges: 20.0, kh: 0.1, zucker: 0.1, eiweiss: 29.0, salz: 1.5, ball: 0.0 },
    { name: 'Emmenthaler',           kcal: 380, fett: 29.0, ges: 18.0, kh: 0.5, zucker: 0.5, eiweiss: 28.0, salz: 0.9, ball: 0.0 },
    { name: 'Raclette',              kcal: 335, fett: 26.0, ges: 17.0, kh: 0.5, zucker: 0.5, eiweiss: 24.0, salz: 1.2, ball: 0.0 },
    { name: 'Mozzarella',            kcal: 250, fett: 19.0, ges: 12.0, kh: 1.0, zucker: 1.0, eiweiss: 18.0, salz: 0.6, ball: 0.0 },
    { name: 'Parmesan',              kcal: 431, fett: 29.0, ges: 18.0, kh: 0.0, zucker: 0.0, eiweiss: 38.0, salz: 1.8, ball: 0.0 },
    { name: 'Camembert',             kcal: 290, fett: 23.0, ges: 15.0, kh: 0.5, zucker: 0.5, eiweiss: 19.0, salz: 1.5, ball: 0.0 },
    { name: 'Fondue-Mischung',       kcal: 300, fett: 20.0, ges: 13.0, kh: 3.0, zucker: 0.5, eiweiss: 24.0, salz: 1.5, ball: 0.0 },
    // Butter
    { name: 'Butter',                        kcal: 735, fett: 82.0, ges: 52.0, kh: 0.6, zucker: 0.6, eiweiss: 0.7,  salz: 0.1,  ball: 0.0 },
    // Gescannte Produkte
    { name: 'Tilsiter',                      kcal: 354, fett: 28.0, ges: 18.0, kh: 0.5, zucker: 0.5, eiweiss: 25.0, salz: 1.7,  ball: 0.0 },
    { name: 'Emmenthaler AOP mild',          kcal: 395, fett: 31.0, ges: 19.0, kh: 0.1, zucker: 0.1, eiweiss: 29.0, salz: 0.5,  ball: 0.0 },
    { name: 'President Carré Gourmet',       kcal: 324, fett: 28.0, ges: 20.0, kh: 0.1, zucker: 0.1, eiweiss: 18.0, salz: 1.3,  ball: 0.0 },
    { name: 'Molini Mozzarella Block',       kcal: 251, fett: 19.0, ges: 0.0,  kh: 1.0, zucker: 0.0, eiweiss: 19.0, salz: 0.6,  ball: 0.0 },
    { name: 'Skyr Alternative Vanille Soja', kcal: 77,  fett: 2.9,  ges: 0.5,  kh: 6.8, zucker: 6.5, eiweiss: 5.1,  salz: 0.24, ball: 1.1 },
    // Eier
];

// ===== Brot-Datenbank (pro 100g, Schweizer Durchschnittswerte) =====
const BROT_DB = [
    { name: 'Baguette',          kcal: 270, fett: 1.5, ges: 0.4, kh: 54.0, zucker: 2.5, eiweiss: 9.0, salz: 1.2, ball: 2.0, gm: 250 },
    { name: 'Laugen-Salzbrezel', kcal: 320, fett: 4.0, ges: 1.0, kh: 60.0, zucker: 2.0, eiweiss: 9.5, salz: 3.5, ball: 2.0, gm: 85  },
    { name: 'Laugenbrot',        kcal: 255, fett: 2.5, ges: 0.6, kh: 48.0, zucker: 2.0, eiweiss: 9.0, salz: 1.8, ball: 2.5, gm: 80  },
    { name: 'Bauernbrot',        kcal: 230, fett: 1.5, ges: 0.3, kh: 44.0, zucker: 1.5, eiweiss: 7.5, salz: 1.2, ball: 4.5, gm: 60  },
    { name: 'Ruchbrot',          kcal: 245, fett: 1.5, ges: 0.3, kh: 46.0, zucker: 1.5, eiweiss: 9.0, salz: 1.2, ball: 3.5, gm: 60  },
    { name: 'Vollkornbrot',      kcal: 210, fett: 2.0, ges: 0.4, kh: 38.0, zucker: 2.0, eiweiss: 8.0, salz: 1.1, ball: 6.0, gm: 60  },
    { name: 'Toastbrot',         kcal: 265, fett: 3.5, ges: 0.8, kh: 48.0, zucker: 4.0, eiweiss: 8.5, salz: 1.3, ball: 2.0, gm: 25  },
    { name: 'Weggli',            kcal: 285, fett: 4.5, ges: 1.0, kh: 53.0, zucker: 5.0, eiweiss: 9.0, salz: 1.2, ball: 2.0, gm: 50  },
    { name: 'Semmeli',           kcal: 270, fett: 2.0, ges: 0.5, kh: 53.0, zucker: 2.0, eiweiss: 9.0, salz: 1.3, ball: 2.5, gm: 50  },
    { name: 'Fussballbrötchen',  kcal: 265, fett: 2.5, ges: 0.5, kh: 50.0, zucker: 2.0, eiweiss: 9.0, salz: 1.2, ball: 2.5, gm: 55  },
    { name: 'Holzofenbrot',      kcal: 230, fett: 1.5, ges: 0.3, kh: 44.0, zucker: 1.5, eiweiss: 7.5, salz: 1.2, ball: 4.0, gm: 60  },
    { name: 'Krustenkranz',      kcal: 260, fett: 2.0, ges: 0.4, kh: 50.0, zucker: 2.0, eiweiss: 9.0, salz: 1.2, ball: 2.5, gm: 60  },
    { name: 'Zopf',              kcal: 315, fett: 8.0, ges: 4.5, kh: 50.0, zucker: 5.0, eiweiss: 9.5, salz: 0.8, ball: 2.0, gm: 80  },
    { name: 'Steinofen Twister', kcal: 255, fett: 2.5, ges: 0.5, kh: 49.0, zucker: 2.0, eiweiss: 9.0, salz: 1.2, ball: 2.5, gm: 60  },
    { name: 'Silserkranz',       kcal: 265, fett: 3.0, ges: 0.8, kh: 50.0, zucker: 3.0, eiweiss: 9.0, salz: 1.0, ball: 2.0, gm: 60  },
    { name: 'Huusbrot Rustico',  kcal: 232, fett: 1.0, ges: 0.2, kh: 45.0, zucker: 0.6, eiweiss: 8.4, salz: 1.87, ball: 4.5 },
    { name: 'Brötchen (Ø)',     kcal: 265, fett: 2.5, ges: 0.5, kh: 50.0, zucker: 2.0, eiweiss: 9.0, salz: 1.2, ball: 2.5, gm: 60  },
    // Gipfeli
    { name: 'Buttergipfeli',     kcal: 400, fett: 22.0, ges: 14.0, kh: 42.0, zucker: 5.0, eiweiss: 8.0, salz: 1.0, ball: 1.5, gm: 60  },
    { name: 'Laugengipfeli',     kcal: 300, fett: 10.0, ges: 5.0,  kh: 44.0, zucker: 3.0, eiweiss: 9.0, salz: 2.0, ball: 2.0, gm: 65  },
    { name: 'Vollkorngipfeli',   kcal: 340, fett: 15.0, ges: 8.0,  kh: 40.0, zucker: 4.0, eiweiss: 9.5, salz: 1.0, ball: 4.5, gm: 65  },
    // Pizza-/Pinsateig
    { name: 'Pinsa Teig',        kcal: 240, fett: 4.0, ges: 0.6, kh: 42.0, zucker: 1.5, eiweiss: 8.0, salz: 1.2, ball: 2.5, gm: 230 },
    { name: 'Pizzateig',         kcal: 260, fett: 3.5, ges: 0.5, kh: 48.0, zucker: 2.0, eiweiss: 8.5, salz: 1.3, ball: 2.0, gm: 250 },
];

// ===== Fleisch-Datenbank (pro 100g, Schweizer Durchschnittswerte) =====
const FLEISCH_DB = [
    // Rind
    { name: 'Rindsghackets',                      kcal: 195, fett: 14.0, ges: 5.8, kh: 0.0, zucker: 0.0, eiweiss: 17.0, salz: 0.1, ball: 0.0 },
    { name: 'Rindsgschnätzelts',                  kcal: 175, fett: 8.0,  ges: 3.2,  kh: 0.0, zucker: 0.0, eiweiss: 26.0, salz: 0.3,  ball: 0.0 },
    { name: 'Rind mager (Filet/Huft/Nierstück)',  kcal: 118, fett: 3.5,  ges: 1.3, kh: 0.0, zucker: 0.0, eiweiss: 22.0, salz: 0.1, ball: 0.0 },
    { name: 'Rind marmoriert (Entrecôte/Ribeye)', kcal: 212, fett: 14.0, ges: 5.8, kh: 0.0, zucker: 0.0, eiweiss: 20.0, salz: 0.1, ball: 0.0 },
    // Schwein
    { name: 'Schweinsgschnätzelts',               kcal: 165, fett: 7.0,  ges: 2.5,  kh: 0.0, zucker: 0.0, eiweiss: 25.0, salz: 0.3,  ball: 0.0 },
    { name: 'Schwein mager (Filet/Nierstück)',    kcal: 112, fett: 3.0,  ges: 1.1, kh: 0.0, zucker: 0.0, eiweiss: 22.0, salz: 0.1, ball: 0.0 },
    { name: 'Schwein marmoriert (Hals/Nacken)',   kcal: 225, fett: 16.0, ges: 6.0, kh: 0.0, zucker: 0.0, eiweiss: 18.0, salz: 0.1, ball: 0.0 },
    { name: 'Schweineschnitzel',                  kcal: 120, fett: 3.5,  ges: 1.2, kh: 0.0, zucker: 0.0, eiweiss: 22.0, salz: 0.1, ball: 0.0 },
    // Geflügel
    { name: 'Pouletgschnätzelts',                 kcal: 203, fett: 9.0,  ges: 2.5,  kh: 0.0, zucker: 0.0, eiweiss: 30.0, salz: 0.3,  ball: 0.0 },
    { name: 'Poulet Brust (ohne Haut)',           kcal: 105, fett: 1.2,  ges: 0.3, kh: 0.0, zucker: 0.0, eiweiss: 22.0, salz: 0.1, ball: 0.0 },
    { name: 'Poulet Schenkel (mit Haut)',         kcal: 165, fett: 8.8,  ges: 2.6, kh: 0.0, zucker: 0.0, eiweiss: 18.0, salz: 0.1, ball: 0.0 },
    // Verarbeitetes
    { name: 'Cervelat',                           kcal: 285, fett: 24.0, ges: 9.0,  kh: 1.0, zucker: 0.5, eiweiss: 14.0, salz: 2.2,  ball: 0.0 },
    { name: 'Bratwurst (roh)',                    kcal: 265, fett: 22.0, ges: 8.0,  kh: 2.0, zucker: 0.5, eiweiss: 13.0, salz: 1.5,  ball: 0.0 },
    { name: 'Speckwürfel',                        kcal: 330, fett: 28.0, ges: 10.0, kh: 0.0, zucker: 0.0, eiweiss: 18.0, salz: 2.0,  ball: 0.0 },
    { name: 'Bratspeck',                          kcal: 370, fett: 33.0, ges: 12.0, kh: 0.0, zucker: 0.0, eiweiss: 17.0, salz: 2.3,  ball: 0.0 },
    { name: 'Naturafarm Bratspeck',               kcal: 345, fett: 33.0, ges: 9.9,  kh: 0.0, zucker: 0.0, eiweiss: 12.0, salz: 1.7,  ball: 0.0 },
    { name: 'Wienerli',                           kcal: 230, fett: 18.0, ges: 7.0,  kh: 1.0, zucker: 0.5, eiweiss: 14.0, salz: 2.0,  ball: 0.0, gm: 50  },
    { name: 'Schinkewürfeli',                     kcal: 118, fett: 4.0,  ges: 1.5,  kh: 1.0, zucker: 0.5, eiweiss: 19.0, salz: 2.5,  ball: 0.0 },
    { name: 'Bündnerfleisch',                     kcal: 216, fett: 5.0,  ges: 2.2,  kh: 0.8, zucker: 0.8, eiweiss: 43.0, salz: 5.2,  ball: 0.0 },
    { name: 'Mostbröckli',                        kcal: 170, fett: 3.0,  ges: 1.2,  kh: 1.0, zucker: 0.5, eiweiss: 35.0, salz: 4.5,  ball: 0.0 },
    { name: 'Salsiz',                             kcal: 400, fett: 32.0, ges: 12.0, kh: 1.0, zucker: 0.5, eiweiss: 28.0, salz: 4.0,  ball: 0.0 },
    { name: 'Landjäger',                          kcal: 380, fett: 30.0, ges: 11.0, kh: 1.0, zucker: 0.5, eiweiss: 25.0, salz: 3.8,  ball: 0.0 },
    { name: 'Bündner Rohschinken',                kcal: 200, fett: 8.0,  ges: 3.0,  kh: 0.0, zucker: 0.0, eiweiss: 32.0, salz: 5.0,  ball: 0.0 },
    { name: 'Walliser Trockenfleisch',            kcal: 210, fett: 5.0,  ges: 2.0,  kh: 0.5, zucker: 0.5, eiweiss: 42.0, salz: 5.0,  ball: 0.0 },
    { name: 'Appenzeller Pantli',                 kcal: 250, fett: 12.0, ges: 4.5,  kh: 0.5, zucker: 0.0, eiweiss: 35.0, salz: 4.5,  ball: 0.0 },
    { name: 'Coppa',                              kcal: 250, fett: 16.0, ges: 6.0,  kh: 0.0, zucker: 0.0, eiweiss: 28.0, salz: 4.0,  ball: 0.0 },
    { name: 'Bresaola',                           kcal: 150, fett: 2.5,  ges: 1.0,  kh: 0.5, zucker: 0.0, eiweiss: 32.0, salz: 3.8,  ball: 0.0 },
    { name: 'Kochschinken',                       kcal: 107, fett: 3.0,  ges: 1.0,  kh: 1.0, zucker: 0.5, eiweiss: 18.0, salz: 2.3,  ball: 0.0 },
    { name: 'Hinterschinken (geräuchert)',        kcal: 125, fett: 4.5,  ges: 1.7,  kh: 0.5, zucker: 0.0, eiweiss: 20.0, salz: 2.5,  ball: 0.0 },
    { name: 'Pouletbrust-Aufschnitt',             kcal: 100, fett: 1.5,  ges: 0.4,  kh: 1.0, zucker: 0.5, eiweiss: 20.0, salz: 2.0,  ball: 0.0 },
    { name: 'Truthahn-Aufschnitt',                kcal: 105, fett: 1.5,  ges: 0.4,  kh: 1.0, zucker: 0.5, eiweiss: 21.0, salz: 2.0,  ball: 0.0 },
    { name: 'Lyoner (Schwein)',                   kcal: 280, fett: 24.0, ges: 9.0,  kh: 1.0, zucker: 0.5, eiweiss: 12.0, salz: 2.0,  ball: 0.0 },
    { name: 'Poulet Lyoner',                      kcal: 166, fett: 13.0, ges: 2.5,  kh: 0.0, zucker: 0.0, eiweiss: 12.0, salz: 2.1,  ball: 0.0 },
    { name: 'Bierschinken',                       kcal: 190, fett: 14.0, ges: 5.0,  kh: 1.0, zucker: 0.5, eiweiss: 13.0, salz: 2.0,  ball: 0.0 },
    { name: 'Salami Milano',                      kcal: 383, fett: 31.0, ges: 12.0, kh: 0.0, zucker: 0.0, eiweiss: 26.0, salz: 4.03, ball: 0.0 },
    { name: 'Toastschinken',                      kcal: 105, fett: 4.0,  ges: 1.5,  kh: 0.0, zucker: 0.0, eiweiss: 17.0, salz: 2.3,  ball: 0.0 },
    { name: 'Fleischkäse',                        kcal: 270, fett: 24.0, ges: 10.0, kh: 0.5, zucker: 0.5, eiweiss: 13.0, salz: 1.8,  ball: 0.0 },
    { name: 'Naturafarm Fleischkäse',             kcal: 336, fett: 32.0, ges: 13.0, kh: 0.0, zucker: 0.0, eiweiss: 12.0, salz: 1.8,  ball: 0.0 },
    { name: 'Malbuner Fleischkäse',                kcal: 202, fett: 16.0, ges: 6.0,  kh: 0.8, zucker: 0.5, eiweiss: 14.0, salz: 1.8,  ball: 0.0 },
    { name: 'Hamburger aus Rinderhack',           kcal: 230, fett: 15.0, ges: 6.0,  kh: 0.5, zucker: 0.0, eiweiss: 18.0, salz: 1.0,  ball: 0.0 },
    // Grill & Smoker
    { name: 'Spareribs (Schwein)',                kcal: 250, fett: 18.0, ges: 7.0,  kh: 0.0, zucker: 0.0, eiweiss: 22.0, salz: 0.2,  ball: 0.0 },
    { name: 'Pulled Pork',                        kcal: 210, fett: 12.0, ges: 4.5,  kh: 0.0, zucker: 0.0, eiweiss: 25.0, salz: 0.8,  ball: 0.0 },
    { name: 'Brisket (Rind)',                     kcal: 235, fett: 15.0, ges: 6.0,  kh: 0.0, zucker: 0.0, eiweiss: 24.0, salz: 0.3,  ball: 0.0 },
    { name: 'Dino Ribs (Beef Short Ribs)',        kcal: 280, fett: 21.0, ges: 9.0,  kh: 0.0, zucker: 0.0, eiweiss: 22.0, salz: 0.3,  ball: 0.0 },
    { name: 'Smoked Pork Ribs',                   kcal: 260, fett: 19.0, ges: 7.5,  kh: 0.0, zucker: 0.0, eiweiss: 22.0, salz: 0.5,  ball: 0.0 },
    { name: 'Poulet Flügeli',                     kcal: 190, fett: 12.0, ges: 3.5,  kh: 0.0, zucker: 0.0, eiweiss: 18.0, salz: 0.2,  ball: 0.0 },
    { name: 'Roastbeef (Entrecôte)',              kcal: 212, fett: 14.0, ges: 5.8,  kh: 0.0, zucker: 0.0, eiweiss: 20.0, salz: 0.3,  ball: 0.0 },
    { name: 'Halloumi (Grillkäse)',              kcal: 320, fett: 25.0, ges: 16.0, kh: 2.0, zucker: 1.0, eiweiss: 22.0, salz: 2.5,  ball: 0.0 },
    { name: 'Würstli Appenzell',                 kcal: 517, fett: 46.0, ges: 0.0,  kh: 0.7, zucker: 0.0, eiweiss: 25.0, salz: 4.0,  ball: 0.0 },
];

// ===== Getränke-Datenbank (pro 100ml, mit Gesamtmenge) =====
const GETRÄNKE_DB = [
    { name: 'Emi Energy Milk Vanilla',               kcal: 62, fett: 0.8,  ges: 0.5, kh: 4.9,  zucker: 4.8,  eiweiss: 8.0,  salz: 0.35, ball: 0.0,  gm: 330 },
    { name: 'Emi Energy Milk Skyr Mango/Passion',    kcal: 61, fett: 0.1,  ges: 0.1, kh: 5.3,  zucker: 4.4,  eiweiss: 8.8,  salz: 0.03, ball: 0.0,  gm: 330 },
    { name: 'Emi Energy Milk Vanilla Double Zero',   kcal: 61, fett: 0.7,  ges: 0.4, kh: 4.6,  zucker: 4.5,  eiweiss: 8.0,  salz: 0.34, ball: 0.0,  gm: 330 },
    { name: 'Innocent Orangensaft mit Fruchtfleisch',kcal: 43, fett: 0.0,  ges: 0.0, kh: 9.5,  zucker: 8.8,  eiweiss: 0.73, salz: 0.0,  ball: 0.88, gm: 330 },
    { name: 'Innocent Apfel & Mango',                kcal: 45, fett: 0.4,  ges: 0.1, kh: 11.0, zucker: 9.9,  eiweiss: 0.17, salz: 0.0,  ball: 0.66, gm: 330 },
    { name: 'Bilz Stellare Limone',                  kcal: 21, fett: 0.0,  ges: 0.0, kh: 5.0,  zucker: 3.9,  eiweiss: 0.0,  salz: 0.0,  ball: 0.0,  gm: 330 },
    { name: 'Bilz Stellare Blutorange',              kcal: 32, fett: 0.0,  ges: 0.0, kh: 7.6,  zucker: 6.3,  eiweiss: 0.5,  salz: 0.0,  ball: 0.0,  gm: 330 },
    { name: 'Comella Choco Drink',                   kcal: 64, fett: 1.0,  ges: 0.6, kh: 9.7,  zucker: 9.5,  eiweiss: 3.5,  salz: 0.1,  ball: 0.0,  gm: 330 },
    { name: 'Coca Cola Original',                    kcal: 44, fett: 0.0,  ges: 0.0, kh: 10.9, zucker: 10.9, eiweiss: 0.0,  salz: 0.0,  ball: 0.0,  gm: 500 },
    { name: 'Red Bull Energy Drink',                 kcal: 46, fett: 0.0,  ges: 0.0, kh: 11.0, zucker: 11.0, eiweiss: 0.0,  salz: 0.1,  ball: 0.0,  gm: 250 },
    { name: 'Red Bull The Blue Sea Edition',         kcal: 45, fett: 0.0, ges: 0.0, kh: 11.0, zucker: 11.0, eiweiss: 0.0,  salz: 0.0,  ball: 0.0,  gm: 250 },
    { name: 'Red Bull ICE',                          kcal: 45, fett: 0.0, ges: 0.0, kh: 11.0, zucker: 11.0, eiweiss: 0.0,  salz: 0.0,  ball: 0.0,  gm: 250 },
    { name: 'Nestea Eistee Peach',                   kcal: 19, fett: 0.0, ges: 0.0, kh: 4.5,  zucker: 4.5,  eiweiss: 0.0,  salz: 0.1,  ball: 0.0,  gm: 500 },
    { name: 'Nestea Eistee Lemon',                   kcal: 19, fett: 0.0, ges: 0.0, kh: 4.5,  zucker: 4.5,  eiweiss: 0.0,  salz: 0.1,  ball: 0.0,  gm: 500 },
    { name: 'Anna Best Pink Grapefruit',             kcal: 39, fett: 0.5, ges: 0.0, kh: 8.9,  zucker: 7.5,  eiweiss: 0.5,  salz: 0.02, ball: 0.5,  gm: 330 },
    { name: 'Schweppes Bitter Lemon',                kcal: 18, fett: 0.0, ges: 0.0, kh: 4.4,  zucker: 4.2,  eiweiss: 0.0,  salz: 0.0,  ball: 0.0,  gm: 500 },
    { name: 'Schweppes Indian Tonic',                kcal: 19, fett: 0.0, ges: 0.0, kh: 4.4,  zucker: 4.4,  eiweiss: 0.0,  salz: 0.0,  ball: 0.0,  gm: 500 },
    { name: 'Schweppes Wild Berry',                   kcal: 19, fett: 0.0, ges: 0.0, kh: 4.2,  zucker: 4.2,  eiweiss: 0.0,  salz: 0.01, ball: 0.0,  gm: 500 },
    { name: 'Pepita Grapefruit',                     kcal: 29.6, fett: 0.0, ges: 0.0, kh: 6.9,  zucker: 6.9,  eiweiss: 0.0,  salz: 0.0,  ball: 0.0,  gm: 500 },
    { name: 'Sinalco Original',                      kcal: 46.5, fett: 0.5, ges: 0.0, kh: 10.0, zucker: 10.0, eiweiss: 0.5,  salz: 0.0,  ball: 0.0,  gm: 500 },

    // Alkoholische Getränke
    { name: 'Bier (Lager)',             kcal: 42, fett: 0.0,  ges: 0.0, kh: 3.5,  zucker: 0.3,  eiweiss: 0.5,  salz: 0.0,  ball: 0.0,  gm: 330 },
    { name: 'Bier (Weizen)',            kcal: 45, fett: 0.0,  ges: 0.0, kh: 4.0,  zucker: 0.5,  eiweiss: 0.5,  salz: 0.0,  ball: 0.0,  gm: 500 },
    { name: 'Somersby Apple Original',  kcal: 61, fett: 0.0,  ges: 0.0, kh: 8.6,  zucker: 7.7,  eiweiss: 0.0,  salz: 0.0,  ball: 0.0,  gm: 500 },
    { name: 'Prosecco',                 kcal: 75, fett: 0.0,  ges: 0.0, kh: 1.5,  zucker: 1.0,  eiweiss: 0.1,  salz: 0.0,  ball: 0.0,  gm: 100 },
    { name: 'Trojka Black',             kcal: 228, fett: 0.0, ges: 0.0, kh: 17.0, zucker: 17.0, eiweiss: 0.0,  salz: 0.0,  ball: 0.0,  gm: 40  },
    { name: 'Trojka Green',             kcal: 213, fett: 0.0, ges: 0.0, kh: 15.0, zucker: 15.0, eiweiss: 0.0,  salz: 0.0,  ball: 0.0,  gm: 40  },
    { name: 'Eve Litchi',               kcal: 60, fett: 0.0,  ges: 0.0, kh: 8.0,  zucker: 7.5,  eiweiss: 0.0,  salz: 0.0,  ball: 0.0,  gm: 275 },
    { name: 'Eve Pink Mimosa',          kcal: 55, fett: 0.0,  ges: 0.0, kh: 7.0,  zucker: 6.5,  eiweiss: 0.0,  salz: 0.0,  ball: 0.0,  gm: 275 },
    { name: 'Smirnoff Ice',             kcal: 70, fett: 0.0,  ges: 0.0, kh: 9.0,  zucker: 8.5,  eiweiss: 0.0,  salz: 0.0,  ball: 0.0,  gm: 275 },
    { name: 'Calanda Radler Mango 0.0%', kcal: 30, fett: 0.5, ges: 0.1, kh: 7.0,  zucker: 5.6,  eiweiss: 0.5,  salz: 0.01, ball: 0.0,  gm: 330 },
    { name: 'Nestea Eistee',             kcal: 19, fett: 0.0, ges: 0.0, kh: 4.5,  zucker: 4.5,  eiweiss: 0.0,  salz: 0.1,  ball: 0.0,  gm: 500 },
];

// ===== Snacks-Datenbank (pro 100g) =====
const SNACKS_DB = [
    // Salziges
    { name: 'Salzstängeli',              kcal: 380, fett: 5.0,  ges: 0.8,  kh: 72.0, zucker: 2.0,  eiweiss: 11.0, salz: 4.5,  ball: 2.5, gm: 100 },
    { name: 'Zweifel Chips Nature',      kcal: 535, fett: 33.0, ges: 3.0,  kh: 50.0, zucker: 0.5,  eiweiss: 6.5,  salz: 1.3,  ball: 4.0, gm: 170 },
    { name: 'Zweifel Chips Paprika',     kcal: 530, fett: 32.0, ges: 3.0,  kh: 52.0, zucker: 3.0,  eiweiss: 6.0,  salz: 1.5,  ball: 4.0, gm: 170 },
    { name: 'Zweifel Kezz',              kcal: 500, fett: 26.0, ges: 2.5,  kh: 57.0, zucker: 2.5,  eiweiss: 7.0,  salz: 2.0,  ball: 3.0, gm: 110 },
    { name: 'Popcorn (süss)',            kcal: 420, fett: 15.0, ges: 2.0,  kh: 62.0, zucker: 25.0, eiweiss: 7.0,  salz: 1.0,  ball: 10.0, gm: 100 },
    { name: 'Popcorn (salzig)',          kcal: 380, fett: 12.0, ges: 1.5,  kh: 58.0, zucker: 1.0,  eiweiss: 8.0,  salz: 2.5,  ball: 10.0, gm: 100 },
    { name: 'Erdnüsse (gesalzen)',       kcal: 600, fett: 50.0, ges: 7.0,  kh: 12.0, zucker: 4.0,  eiweiss: 26.0, salz: 1.2,  ball: 8.0, gm: 200 },
];

// ===== Süsses-Datenbank =====
// Pro 100g
const SÜSSES_DB_100 = [
    // Schokolade (gm = 1 Tafel)
    { name: 'Milchschokolade',           kcal: 535, fett: 30.0, ges: 18.0, kh: 58.0, zucker: 55.0, eiweiss: 7.0,  salz: 0.2,  ball: 1.5,  gm: 100 },
    { name: 'Dunkle Schokolade (70%)',   kcal: 590, fett: 42.0, ges: 25.0, kh: 33.0, zucker: 25.0, eiweiss: 8.0,  salz: 0.1,  ball: 10.0, gm: 100 },
    { name: 'Schokolade mit Nüssen',     kcal: 560, fett: 36.0, ges: 15.0, kh: 48.0, zucker: 45.0, eiweiss: 9.0,  salz: 0.2,  ball: 3.0,  gm: 100 },
    { name: 'Weisse Schokolade',         kcal: 540, fett: 32.0, ges: 19.0, kh: 59.0, zucker: 58.0, eiweiss: 6.0,  salz: 0.3,  ball: 0.0,  gm: 100 },
    { name: 'Mars',                      kcal: 443, fett: 16.0, ges: 7.4,  kh: 70.0, zucker: 62.0, eiweiss: 4.51, salz: 0.67, ball: 0.0,  gm: 51  },
    // Gummibärli (gm = 1 Beutel)
    { name: 'Haribo Goldbären',          kcal: 340, fett: 0.5,  ges: 0.1,  kh: 77.0, zucker: 46.0, eiweiss: 6.9,  salz: 0.1,  ball: 0.0,  gm: 25  }, // ~10 Stk
    { name: 'Haribo Colaflaschen',       kcal: 340, fett: 0.5,  ges: 0.1,  kh: 77.0, zucker: 45.0, eiweiss: 6.5,  salz: 0.1,  ball: 0.0,  gm: 50  }, // ~10 Stk
    { name: 'Haribo Saure Bären',        kcal: 335, fett: 0.4,  ges: 0.1,  kh: 76.0, zucker: 43.0, eiweiss: 6.5,  salz: 0.3,  ball: 0.0,  gm: 25  }, // ~10 Stk
    // Süssungsmittel/Gewürze
    { name: 'Zucker (Haushaltszucker)',  kcal: 400, fett: 0.0,  ges: 0.0,  kh: 100.0, zucker: 100.0, eiweiss: 0.0,  salz: 0.0,  ball: 0.0 },
    { name: 'Zimt (gemahlen)',           kcal: 247, fett: 1.2,  ges: 0.1,  kh: 80.6,  zucker: 2.2,   eiweiss: 4.0,  salz: 0.0,  ball: 53.1 },
];
// Pro Portion
const SÜSSES_DB_PORTION = [
    { name: 'Kinderschokolade (1 Riegel)', kcal: 78,  fett: 4.8,  ges: 3.0,  kh: 7.5,  zucker: 7.2,  eiweiss: 1.2,  salz: 0.05, ball: 0.0 },
    { name: 'Toffifee (1 Stk)',            kcal: 65,  fett: 3.8,  ges: 1.5,  kh: 7.0,  zucker: 6.0,  eiweiss: 0.8,  salz: 0.02, ball: 0.2 },
    { name: 'Dubler Mohrenkopf',           kcal: 210, fett: 10.0, ges: 7.0,  kh: 28.0, zucker: 24.0, eiweiss: 2.0,  salz: 0.1,  ball: 0.5 },
    { name: 'Ferrero Rocher (1 Stk)',      kcal: 75,  fett: 5.3,  ges: 2.0,  kh: 5.8,  zucker: 5.0,  eiweiss: 1.0,  salz: 0.03, ball: 0.3 },
];

// ===== Dessert-Datenbank =====
// Glace pro 100g/ml
const DESSERT_DB_100 = [
    { name: 'Vanilleglace',       kcal: 200, fett: 11.0, ges: 7.0,  kh: 24.0, zucker: 20.0, eiweiss: 3.5, salz: 0.1, ball: 0.0 },
    { name: 'Schokoladenglace',   kcal: 220, fett: 12.0, ges: 7.5,  kh: 26.0, zucker: 22.0, eiweiss: 4.0, salz: 0.1, ball: 1.5 },
    { name: 'Erdbeerglace',       kcal: 180, fett: 8.0,  ges: 5.0,  kh: 25.0, zucker: 20.0, eiweiss: 3.0, salz: 0.1, ball: 0.5 },
    { name: 'Rahmglace',          kcal: 240, fett: 15.0, ges: 9.0,  kh: 24.0, zucker: 20.0, eiweiss: 3.5, salz: 0.1, ball: 0.0 },
];
// Homemade Ice (pro 100g)
const HOMEMADE_ICE_DB = [
    // Glace
    { name: 'Vanille-Glace',      kcal: 243, fett: 16.6, ges:  9.7, kh: 19.1, zucker: 18.7, eiweiss: 3.7, salz: 0.1, ball: 0.0 },
    { name: 'Schoggi-Glace',      kcal: 301, fett: 21.1, ges: 12.3, kh: 20.8, zucker: 19.0, eiweiss: 4.9, salz: 0.1, ball: 2.0 },
    { name: 'Himbeer-Glace',      kcal: 165, fett:  9.2, ges:  5.1, kh: 17.1, zucker: 13.5, eiweiss: 2.7, salz: 0.0, ball: 3.0 },
    { name: 'Mango-Glace',        kcal: 159, fett:  8.7, ges:  4.9, kh: 17.2, zucker: 16.5, eiweiss: 2.4, salz: 0.0, ball: 0.8 },
    { name: 'Erdbeer-Glace',      kcal: 150, fett:  8.8, ges:  4.9, kh: 14.4, zucker: 12.9, eiweiss: 2.4, salz: 0.0, ball: 0.9 },
    { name: 'Pfirsich-Glace',     kcal: 151, fett:  8.6, ges:  4.8, kh: 15.3, zucker: 14.4, eiweiss: 2.4, salz: 0.0, ball: 0.7 },
    { name: 'Honigmelone-Glace',  kcal: 144, fett:  8.2, ges:  4.7, kh: 14.2, zucker: 13.5, eiweiss: 2.2, salz: 0.0, ball: 0.4 },
    { name: 'Kokosnuss-Glace',    kcal: 261, fett: 20.6, ges: 16.0, kh: 13.3, zucker: 12.9, eiweiss: 3.3, salz: 0.0, ball: 1.9 },
    { name: 'Apfel-Glace',        kcal: 154, fett:  8.3, ges:  4.7, kh: 17.1, zucker: 15.0, eiweiss: 2.1, salz: 0.0, ball: 1.2 },
    { name: 'Kiwi-Glace',         kcal: 163, fett:  9.0, ges:  5.0, kh: 18.5, zucker: 15.6, eiweiss: 2.6, salz: 0.0, ball: 1.4 },
    { name: 'Bananen-Glace',      kcal: 174, fett:  9.3, ges:  5.3, kh: 19.4, zucker: 14.3, eiweiss: 2.7, salz: 0.0, ball: 1.2 },
    { name: 'Heidelbeer-Glace',   kcal: 163, fett:  8.7, ges:  4.9, kh: 17.8, zucker: 15.7, eiweiss: 2.4, salz: 0.0, ball: 1.1 },
    { name: 'Ice Coffee-Glace',   kcal: 219, fett: 14.5, ges:  8.5, kh: 17.2, zucker: 16.9, eiweiss: 3.0, salz: 0.1, ball: 0.0 },
    // Sorbet
    { name: 'Vanille-Sorbet',     kcal:  85, fett:  0.0, ges:  0.0, kh: 21.1, zucker: 20.8, eiweiss: 0.0, salz: 0.0, ball: 0.0 },
    { name: 'Schoggi-Sorbet',     kcal: 193, fett:  8.4, ges:  5.0, kh: 25.1, zucker: 22.5, eiweiss: 2.6, salz: 0.0, ball: 3.7 },
    { name: 'Himbeer-Sorbet',     kcal:  96, fett:  0.6, ges:  0.0, kh: 21.9, zucker: 15.7, eiweiss: 1.0, salz: 0.0, ball: 5.3 },
    { name: 'Mango-Sorbet',       kcal:  92, fett:  0.3, ges:  0.1, kh: 21.8, zucker: 20.8, eiweiss: 0.7, salz: 0.0, ball: 1.3 },
    { name: 'Erdbeer-Sorbet',     kcal:  74, fett:  0.2, ges:  0.0, kh: 17.1, zucker: 14.6, eiweiss: 0.6, salz: 0.0, ball: 1.6 },
    { name: 'Pfirsich-Sorbet',    kcal:  78, fett:  0.2, ges:  0.0, kh: 18.3, zucker: 16.8, eiweiss: 0.7, salz: 0.0, ball: 1.2 },
    { name: 'Honigmelone-Sorbet', kcal:  70, fett:  0.1, ges:  0.0, kh: 16.4, zucker: 15.4, eiweiss: 0.4, salz: 0.0, ball: 0.7 },
    { name: 'Kokosnuss-Sorbet',   kcal: 243, fett: 18.3, ges: 16.6, kh: 15.4, zucker: 14.9, eiweiss: 1.8, salz: 0.0, ball: 2.4 },
    { name: 'Apfel-Sorbet',       kcal:  87, fett:  0.2, ges:  0.0, kh: 21.3, zucker: 17.9, eiweiss: 0.2, salz: 0.0, ball: 1.9 },
    { name: 'Kiwi-Sorbet',        kcal:  95, fett:  0.4, ges:  0.0, kh: 23.6, zucker: 18.6, eiweiss: 0.9, salz: 0.0, ball: 2.4 },
    { name: 'Bananen-Sorbet',     kcal: 110, fett:  0.2, ges:  0.1, kh: 26.7, zucker: 17.8, eiweiss: 0.9, salz: 0.0, ball: 2.0 },
    { name: 'Heidelbeer-Sorbet',  kcal:  94, fett:  0.2, ges:  0.0, kh: 22.1, zucker: 18.7, eiweiss: 0.6, salz: 0.0, ball: 1.9 },
    { name: 'Ice Coffee-Sorbet',  kcal:  87, fett:  0.0, ges:  0.0, kh: 20.0, zucker: 19.6, eiweiss: 0.0, salz: 0.0, ball: 0.0 },
];
// Stück-Desserts pro Portion
const DESSERT_DB_PORTION = [
    // Glace-Stücke
    { name: 'Rakete (Glace)',          kcal: 80,  fett: 1.5,  ges: 1.0,  kh: 16.0, zucker: 12.0, eiweiss: 0.5, salz: 0.0, ball: 0.0 },
    { name: 'Pralinato Vanille',       kcal: 280, fett: 17.0, ges: 12.0, kh: 28.0, zucker: 24.0, eiweiss: 4.0, salz: 0.1, ball: 0.5 },
    { name: 'Cornetto Classico',       kcal: 260, fett: 14.0, ges: 10.0, kh: 30.0, zucker: 22.0, eiweiss: 3.5, salz: 0.1, ball: 1.0 },
    { name: 'Ice Coffee Chübeli',      kcal: 171, fett: 6.2, ges: 5.5, kh: 24.0, zucker: 20.0, eiweiss: 4.3, salz: 0.16, ball: 1.0, gm: 82  },
    // Gebäck/Desserts
    { name: 'Cremeschnitte',           kcal: 350, fett: 22.0, ges: 14.0, kh: 32.0, zucker: 18.0, eiweiss: 5.0, salz: 0.3, ball: 0.5 },
    { name: 'Tiramisu',                kcal: 320, fett: 18.0, ges: 10.0, kh: 30.0, zucker: 22.0, eiweiss: 7.0, salz: 0.2, ball: 0.5 },
    { name: 'Mousse au Chocolat',      kcal: 280, fett: 18.0, ges: 11.0, kh: 24.0, zucker: 20.0, eiweiss: 5.0, salz: 0.1, ball: 1.5 },
    { name: 'Panna Cotta',             kcal: 240, fett: 16.0, ges: 10.0, kh: 20.0, zucker: 18.0, eiweiss: 3.5, salz: 0.1, ball: 0.0 },
    { name: 'Berliner (Krapfen)',      kcal: 330, fett: 14.0, ges: 3.5,  kh: 44.0, zucker: 18.0, eiweiss: 6.0, salz: 0.5, ball: 1.5 },
    { name: 'Nussgipfel',              kcal: 420, fett: 24.0, ges: 8.0,  kh: 42.0, zucker: 20.0, eiweiss: 9.0, salz: 0.5, ball: 2.0 },
];

// ===== Fertigprodukte (pro 100g) =====
const FERTIGPRODUKTE_DB = [
    // SwissTPH
    { name: 'SwissTPH Eiersalat Sandwich',    kcal: 258, fett: 12.6, ges: 2.5,  kh: 24.6, zucker:  1.5, eiweiss:  8.2, salz: 1.0,  ball: 1.0, gm: 120  },
    { name: 'SwissTPH Schinken-Sandwich',     kcal: 201, fett:  4.5, ges: 1.5,  kh: 23.5, zucker:  2.6, eiweiss: 15.6, salz: 1.2,  ball: 1.5, gm: 120  },
    { name: 'SwissTPH Premium Butter-Brezel', kcal: 380, fett: 18.0, ges: 8.0,  kh: 45.0, zucker:  1.3, eiweiss:  6.0, salz: 1.3,  ball: 0.0, gm: 72   },
    { name: 'SwissTPH Pommes Frites',         kcal: 270, fett: 14.0, ges: 2.0,  kh: 33.0, zucker:  0.5, eiweiss:  3.5, salz: 0.7,  ball: 2.5, gm: 300  },
    { name: 'SwissTPH Hamburger',             kcal: 250, fett: 12.0, ges: 5.0,  kh: 22.0, zucker:  4.0, eiweiss: 15.0, salz: 1.5,  ball: 1.5, gm: 200  },
    { name: 'Apfelmus',                       kcal:  68, fett:  0.1, ges: 0.0,  kh: 16.0, zucker: 13.0, eiweiss:  0.3, salz: 0.0,  ball: 1.5, gm: null  },
    { name: 'Chicken Nuggets',                kcal: 253, fett: 11.0, ges: 1.5,  kh: 25.0, zucker:  0.6, eiweiss: 13.0, salz: 1.0,  ball: 1.2, gm: 250  },
    { name: 'Curry Balls',                    kcal: 193, fett:  9.0, ges: 2.0,  kh: 14.0, zucker:  2.5, eiweiss: 14.0, salz: 1.8,  ball: 0.0, gm: 250  },
    { name: 'Fischstäbchen',                  kcal: 214, fett:  8.9, ges: 0.7,  kh: 19.0, zucker:  0.5, eiweiss: 14.0, salz: 0.59, ball: 0.8, gm: 150  },
    { name: 'Rahmspinat',                     kcal:  77, fett:  5.0, ges: 1.1,  kh:  4.1, zucker:  1.8, eiweiss:  3.1, salz: 1.0,  ball: 0.0, gm: 600  },
    { name: 'Thon in Wasser (Dose)',          kcal: 109, fett:  0.8, ges: 0.2,  kh:  0.0, zucker:  0.0, eiweiss: 25.0, salz: 0.4,  ball: 0.0, gm: 130  },
    { name: 'Thon in Öl (Dose)',              kcal: 198, fett: 10.0, ges: 1.5,  kh:  0.0, zucker:  0.0, eiweiss: 27.0, salz: 0.5,  ball: 0.0, gm: 130  },
    { name: 'Lachs (roh)',                    kcal: 208, fett: 13.0, ges: 2.5,  kh:  0.0, zucker:  0.0, eiweiss: 20.0, salz: 0.1,  ball: 0.0, gm: null },
    { name: 'Räucherlachs',                   kcal: 142, fett:  8.0, ges: 1.5,  kh:  0.0, zucker:  0.0, eiweiss: 18.3, salz: 3.7,  ball: 0.0, gm: null },
    // Tex-Mex
    { name: 'Tortilla Pockets',               kcal: 300, fett:  7.0, ges: 3.5,  kh: 50.0, zucker:  2.0, eiweiss:  7.0, salz: 1.2,  ball: 2.0, gm: 223  },
    { name: 'Barquitas',                      kcal: 320, fett:  9.0, ges: 4.0,  kh: 50.0, zucker:  2.5, eiweiss:  7.5, salz: 1.3,  ball: 2.5, gm: 312  },
    { name: 'Salsa Sauce',                    kcal:  35, fett:  0.2, ges: 0.0,  kh:  7.0, zucker:  5.0, eiweiss:  1.0, salz: 1.5,  ball: 1.0, gm: null  },
    // Saucen
    { name: 'Tomatensauce (Passata)',         kcal:  30, fett:  0.2, ges: 0.0,  kh:  5.5, zucker:  4.0, eiweiss:  1.2, salz: 0.5,  ball: 1.5, gm: 500  },
    { name: 'Tomatenmark',                    kcal:  82, fett:  0.5, ges: 0.1,  kh: 16.0, zucker: 12.0, eiweiss:  4.0, salz: 1.5,  ball: 4.0, gm: 140  },
    { name: 'Pesto (Basilico)',               kcal: 380, fett: 36.0, ges: 6.0,  kh:  5.0, zucker:  2.0, eiweiss:  5.0, salz: 2.5,  ball: 2.0, gm: 190  },
    { name: 'Bratensauce',                    kcal:  35, fett:  1.5, ges: 0.8,  kh:  4.0, zucker:  1.0, eiweiss:  1.0, salz: 1.2,  ball: 0.0, gm: null  },
    { name: 'Rahmsauce',                      kcal: 120, fett: 10.0, ges: 6.0,  kh:  4.0, zucker:  1.5, eiweiss:  2.0, salz: 1.0,  ball: 0.0, gm: null  },
    { name: 'Jägersauce',                     kcal:  75, fett:  5.0, ges: 3.0,  kh:  4.5, zucker:  1.5, eiweiss:  2.0, salz: 1.2,  ball: 0.5, gm: null  },
    { name: 'Pfeffersauce',                   kcal:  95, fett:  7.0, ges: 4.0,  kh:  5.0, zucker:  1.0, eiweiss:  2.0, salz: 1.5,  ball: 0.3, gm: null  },
    { name: 'BBQ Sauce',                      kcal: 150, fett:  0.5, ges: 0.1,  kh: 35.0, zucker: 28.0, eiweiss:  1.0, salz: 2.5,  ball: 0.5, gm: null  },
    { name: 'Currysauce',                     kcal:  85, fett:  5.0, ges: 2.5,  kh:  8.0, zucker:  4.0, eiweiss:  1.5, salz: 1.5,  ball: 0.5, gm: null  },
    { name: 'Carbonara Sauce (Fertig)',       kcal: 130, fett: 10.0, ges: 5.5,  kh:  4.0, zucker:  1.5, eiweiss:  5.0, salz: 1.3,  ball: 0.0, gm: 250  },
    { name: 'Arrabbiata Sauce (Fertig)',      kcal:  55, fett:  2.0, ges: 0.3,  kh:  7.0, zucker:  5.0, eiweiss:  1.5, salz: 1.2,  ball: 1.5, gm: 400  },
    { name: 'Bolognese Sauce (Fertig)',       kcal:  80, fett:  3.5, ges: 1.2,  kh:  6.5, zucker:  4.0, eiweiss:  5.0, salz: 1.0,  ball: 1.0, gm: 400  },
    { name: 'Napoli Sauce (Fertig)',          kcal:  45, fett:  1.5, ges: 0.2,  kh:  6.0, zucker:  4.5, eiweiss:  1.2, salz: 1.0,  ball: 1.5, gm: 400  },
    { name: 'Mozzarella Stick',               kcal: 235, fett: 17.0, ges: 10.0, kh:  1.5, zucker:  1.5, eiweiss: 19.0, salz: 0.6,  ball: 0.0, gm: null  },
    { name: 'Spring Rolls mit Poulet (Chicken)', kcal: 221, fett: 11.0, ges: 1.4, kh: 24.0, zucker: 8.0, eiweiss: 5.2, salz: 1.28, ball: 2.5, gm: 370 },
];

// ===== Fastfood-Datenbank (pro Portion) =====
const FASTFOOD_DB = [
    // Döner
    { name: 'Döner Kebab',              kcal: 650, fett: 30.0, ges: 12.0, kh: 55.0, zucker: 5.0,  eiweiss: 35.0, salz: 2.5, ball: 3.0 },
    { name: 'Dürüm Kebab',              kcal: 700, fett: 32.0, ges: 13.0, kh: 60.0, zucker: 5.0,  eiweiss: 35.0, salz: 2.8, ball: 3.0 },
    { name: 'Falafel Döner',            kcal: 550, fett: 22.0, ges: 3.0,  kh: 65.0, zucker: 6.0,  eiweiss: 18.0, salz: 2.5, ball: 6.0 },
    // Pizza (1 Portion/halbe Pizza)
    { name: 'Pizza Margherita',         kcal: 750, fett: 25.0, ges: 12.0, kh: 90.0, zucker: 8.0,  eiweiss: 30.0, salz: 2.5, ball: 3.5 },
    { name: 'Pizza Salami',             kcal: 900, fett: 40.0, ges: 18.0, kh: 85.0, zucker: 7.0,  eiweiss: 38.0, salz: 3.5, ball: 3.0 },
    { name: 'Pizza Prosciutto',         kcal: 800, fett: 28.0, ges: 13.0, kh: 88.0, zucker: 7.0,  eiweiss: 35.0, salz: 3.0, ball: 3.0 },
    { name: 'Pizza Quattro Formaggi',   kcal: 880, fett: 38.0, ges: 20.0, kh: 82.0, zucker: 6.0,  eiweiss: 40.0, salz: 3.5, ball: 2.5 },
    // McDonald's
    { name: 'Big Mac',                  kcal: 503, fett: 25.0, ges: 9.5,  kh: 42.0, zucker: 8.0,  eiweiss: 26.0, salz: 2.3, ball: 3.0 },
    { name: 'Cheeseburger',             kcal: 300, fett: 13.0, ges: 6.0,  kh: 30.0, zucker: 6.0,  eiweiss: 16.0, salz: 1.8, ball: 1.5 },
    { name: 'McChicken',                kcal: 400, fett: 18.0, ges: 2.5,  kh: 40.0, zucker: 5.0,  eiweiss: 16.0, salz: 1.8, ball: 2.0 },
    { name: 'Chicken McNuggets (6er)',  kcal: 260, fett: 15.0, ges: 2.5,  kh: 16.0, zucker: 0.5,  eiweiss: 16.0, salz: 1.5, ball: 1.0 },
    { name: 'Chicken McNuggets (9er)',  kcal: 390, fett: 22.0, ges: 3.5,  kh: 24.0, zucker: 0.8,  eiweiss: 24.0, salz: 2.2, ball: 1.5 },
    { name: 'McFlurry Oreo',            kcal: 340, fett: 12.0, ges: 7.0,  kh: 50.0, zucker: 40.0, eiweiss: 7.0,  salz: 0.5, ball: 1.0 },
    // Burger King
    { name: 'Whopper',                  kcal: 660, fett: 35.0, ges: 12.0, kh: 50.0, zucker: 10.0, eiweiss: 30.0, salz: 2.5, ball: 2.0 },
    { name: 'Chicken Royale',           kcal: 570, fett: 30.0, ges: 5.0,  kh: 48.0, zucker: 7.0,  eiweiss: 22.0, salz: 2.5, ball: 2.0 },
];

// ===== Portion-Datenbank (pro Portion) =====
const PORTION_DB = [
    { name: 'Nissin Asian Soba Chilli',          kcal: 479, fett: 19.7, ges: 9.7, kh: 62.1, zucker: 8.2, eiweiss: 10.2, salz: 2.8, ball: 0.0 },
    { name: 'Knorr Asia Noodles Chicken',        kcal: 336, fett: 15.0, ges: 1.7, kh: 42.0, zucker: 2.6, eiweiss: 6.0,  salz: 2.7, ball: 1.6 },
    { name: 'Knorr Asia Noodles Spicy Chicken',  kcal: 345, fett: 15.0, ges: 1.5, kh: 43.0, zucker: 2.0, eiweiss: 6.9, salz: 2.9, ball: 2.0 },
    { name: 'Eier 63+',                          kcal:  95, fett:  7.0, ges: 2.0, kh:  0.5, zucker: 0.0, eiweiss:  8.0, salz: 0.2, ball: 0.0 },
    { name: 'Spiegelei (1 Stk)',                 kcal:  80, fett:  6.5, ges: 1.8, kh:  0.3, zucker: 0.0, eiweiss:  5.2, salz: 0.1, ball: 0.0 },
    { name: 'Rührei (2 Eier)',                   kcal: 124, fett:  9.2, ges: 2.6, kh:  0.6, zucker: 0.0, eiweiss: 10.4, salz: 0.2, ball: 0.0 },
];

// ===== Menü-Vorlagen (werden beim Start eingefügt wenn Name noch nicht existiert) =====
const MENU_DB = [
    {
        Name: "Hörnli & Ghackets",
        Positionen: [
            { Lebensmittel: 'Hörnli (roh)',   Einheit: 'g', Menge: 100, Kcal: 370, Fett: 1.5,  Gesaettigt: 0.3, Kohlenhydrate: 74, Zucker: 3,  Eiweiss: 13,  Salz: 0.1, Ballaststoffe: 3   },
            { Lebensmittel: 'Rindsghackets',  Einheit: 'g', Menge: 150, Kcal: 195, Fett: 14.0, Gesaettigt: 5.8, Kohlenhydrate: 0,  Zucker: 0,  Eiweiss: 17,  Salz: 0.1, Ballaststoffe: 0   },
            { Lebensmittel: 'Apfelmus',       Einheit: 'g', Menge: 40,  Kcal: 68,  Fett: 0.1,  Gesaettigt: 0,   Kohlenhydrate: 16, Zucker: 13, Eiweiss: 0.3, Salz: 0,   Ballaststoffe: 1.5 },
        ]
    },
    {
        Name: "Spaghetti Bolognese",
        Positionen: [
            { Lebensmittel: 'Spaghetti (roh)', Einheit: 'g', Menge: 100, Kcal: 365, Fett: 1.5, Gesaettigt: 0.3, Kohlenhydrate: 73.0, Zucker: 2.5, Eiweiss: 13.0, Salz: 0.0, Ballaststoffe: 2.5 },
            { Lebensmittel: 'Rindsghackets',   Einheit: 'g', Menge: 150, Kcal: 195, Fett: 14.0, Gesaettigt: 5.8, Kohlenhydrate: 0.0,  Zucker: 0.0, Eiweiss: 17.0, Salz: 0.1, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Tomate',          Einheit: 'g', Menge: 150, Kcal: 18,  Fett: 0.2,  Gesaettigt: 0.0, Kohlenhydrate: 3.9,  Zucker: 2.6, Eiweiss: 0.9,  Salz: 0.0, Ballaststoffe: 1.2 },
            { Lebensmittel: 'Zwiebel',         Einheit: 'g', Menge: 50,  Kcal: 40,  Fett: 0.1,  Gesaettigt: 0.0, Kohlenhydrate: 9.3,  Zucker: 4.2, Eiweiss: 1.1,  Salz: 0.0, Ballaststoffe: 1.7 },
            { Lebensmittel: 'Knoblauch',       Einheit: 'g', Menge: 10,  Kcal: 149, Fett: 0.5,  Gesaettigt: 0.1, Kohlenhydrate: 33.0, Zucker: 1.0, Eiweiss: 6.4,  Salz: 0.0, Ballaststoffe: 2.1 },
        ]
    },
    {
        Name: "Gschnätzelts mit Stocki",
        Positionen: [
            { Lebensmittel: 'Pouletgschnätzelts',   Einheit: 'g', Menge: 180, Kcal: 203, Fett: 9.0,  Gesaettigt: 2.5, Kohlenhydrate: 0.0,  Zucker: 0.0, Eiweiss: 30.0, Salz: 0.3, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Stocki',               Einheit: 'g', Menge: 250, Kcal: 83,  Fett: 3.0,  Gesaettigt: 1.8, Kohlenhydrate: 11.0, Zucker: 1.0, Eiweiss: 2.0,  Salz: 0.6, Ballaststoffe: 1.5 },
            { Lebensmittel: 'Bratensauce',          Einheit: 'g', Menge: 80,  Kcal: 25,  Fett: 0.8,  Gesaettigt: 0.3, Kohlenhydrate: 3.5,  Zucker: 0.5, Eiweiss: 0.5,  Salz: 1.0, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Rüebli',               Einheit: 'g', Menge: 150, Kcal: 41,  Fett: 0.2,  Gesaettigt: 0.0, Kohlenhydrate: 10.0, Zucker: 5.0, Eiweiss: 0.9,  Salz: 0.1, Ballaststoffe: 2.8 },
            { Lebensmittel: 'Grüne Bohnen (Dose)',  Einheit: 'g', Menge: 150, Kcal: 22,  Fett: 0.2,  Gesaettigt: 0.0, Kohlenhydrate: 3.2,  Zucker: 1.0, Eiweiss: 1.5,  Salz: 0.5, Ballaststoffe: 2.5 },
        ]
    },
    {
        Name: "Icebergsalat mit Toppings",
        Positionen: [
            { Lebensmittel: 'Icebergsalat',       Einheit: 'g', Menge: 150, Kcal: 13,  Fett: 0.2,  Gesaettigt: 0.0, Kohlenhydrate: 2.2,  Zucker: 1.6, Eiweiss: 0.9,  Salz: 0.0, Ballaststoffe: 1.2 },
            { Lebensmittel: 'Cherrytomaten',      Einheit: 'g', Menge: 100, Kcal: 20,  Fett: 0.3,  Gesaettigt: 0.0, Kohlenhydrate: 3.9,  Zucker: 2.6, Eiweiss: 0.9,  Salz: 0.0, Ballaststoffe: 1.2 },
            { Lebensmittel: 'Pouletgschnätzelts', Einheit: 'g', Menge: 120, Kcal: 203, Fett: 9.0, Gesaettigt: 2.5, Kohlenhydrate: 0.0, Zucker: 0.0, Eiweiss: 30.0, Salz: 0.3, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Emmenthaler',        Einheit: 'g', Menge: 40,  Kcal: 380, Fett: 29.0, Gesaettigt: 18.0, Kohlenhydrate: 0.5, Zucker: 0.5, Eiweiss: 28.0, Salz: 0.9, Ballaststoffe: 0.0 },
        ]
    },
    {
        Name: "Fischstäbli mit Spinat",
        Positionen: [
            { Lebensmittel: 'Fischstäbchen',     Einheit: 'g', Menge: 150, Kcal: 214, Fett: 8.9,  Gesaettigt: 0.7, Kohlenhydrate: 19.0, Zucker: 0.5, Eiweiss: 14.0, Salz: 0.59, Ballaststoffe: 0.8 },
            { Lebensmittel: 'Rahmspinat',        Einheit: 'g', Menge: 200, Kcal: 77, Fett: 5.0, Gesaettigt: 1.1, Kohlenhydrate: 4.1, Zucker: 1.8, Eiweiss: 3.1, Salz: 1.0, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Härdöpfel',         Einheit: 'g', Menge: 250, Kcal: 77,  Fett: 0.1,  Gesaettigt: 0.0, Kohlenhydrate: 17.0, Zucker: 0.8, Eiweiss: 2.0,  Salz: 0.0, Ballaststoffe: 2.2 },
        ]
    },
    {
        Name: "Buure z'Morge",
        Positionen: [
            { Lebensmittel: 'Eier 63+',             Einheit: 'p', Menge: 4,   Kcal: 95,  Fett: 7,    Gesaettigt: 2,   Kohlenhydrate: 0.5, Zucker: 0, Eiweiss: 8,  Salz: 0.2,  Ballaststoffe: 0 },
            { Lebensmittel: 'Rösti FixFertig',      Einheit: 'g', Menge: 125, Kcal: 110, Fett: 5,    Gesaettigt: 0.5, Kohlenhydrate: 13,  Zucker: 0, Eiweiss: 2,  Salz: 0.88, Ballaststoffe: 2 },
            { Lebensmittel: 'Bratspeck',            Einheit: 'g', Menge: 100, Kcal: 370, Fett: 33,   Gesaettigt: 12,  Kohlenhydrate: 0,   Zucker: 0, Eiweiss: 17, Salz: 2.3,  Ballaststoffe: 0 },
        ]
    },
    {
        Name: "Reis mit Ghackets & Gemüse",
        Positionen: [
            { Lebensmittel: 'Weisser Reis (roh)',  Einheit: 'g', Menge: 80,  Kcal: 350, Fett: 0.6,  Gesaettigt: 0.2, Kohlenhydrate: 78.0, Zucker: 0.0, Eiweiss: 7.0,  Salz: 0.0, Ballaststoffe: 1.3 },
            { Lebensmittel: 'Rindsghackets',       Einheit: 'g', Menge: 150, Kcal: 195, Fett: 14.0, Gesaettigt: 5.8, Kohlenhydrate: 0.0,  Zucker: 0.0, Eiweiss: 17.0, Salz: 0.1, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Rüebli',              Einheit: 'g', Menge: 100, Kcal: 41,  Fett: 0.2,  Gesaettigt: 0.0, Kohlenhydrate: 10.0, Zucker: 5.0, Eiweiss: 0.9,  Salz: 0.1, Ballaststoffe: 2.8 },
            { Lebensmittel: 'Lauch',               Einheit: 'g', Menge: 100, Kcal: 31,  Fett: 0.3,  Gesaettigt: 0.0, Kohlenhydrate: 3.9,  Zucker: 2.3, Eiweiss: 1.5,  Salz: 0.0, Ballaststoffe: 1.8 },
        ]
    },
    {
        Name: "Riz Casimir (ohne Früchte)",
        Positionen: [
            { Lebensmittel: 'Pouletgschnätzelts',        Einheit: 'g', Menge: 180, Kcal: 203, Fett: 9.0,  Gesaettigt: 2.5, Kohlenhydrate: 0.0,  Zucker: 0.0, Eiweiss: 30.0, Salz: 0.3, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Weisser Reis (roh)',        Einheit: 'g', Menge: 80,  Kcal: 350, Fett: 0.6,  Gesaettigt: 0.2, Kohlenhydrate: 78.0, Zucker: 0.0, Eiweiss: 7.0,  Salz: 0.0, Ballaststoffe: 1.3 },
            { Lebensmittel: 'Currysauce',                Einheit: 'g', Menge: 100, Kcal: 80,  Fett: 5.0,  Gesaettigt: 2.5, Kohlenhydrate: 6.0,  Zucker: 2.0, Eiweiss: 1.5,  Salz: 1.0, Ballaststoffe: 0.5 },
        ]
    },
    {
        Name: "Tacos",
        Positionen: [
            { Lebensmittel: 'Taco Shells',                  Einheit: 'g', Menge: 140, Kcal: 310, Fett: 8.0,  Gesaettigt: 3.8, Kohlenhydrate: 50.0, Zucker: 2.3, Eiweiss: 7.3,  Salz: 1.3, Ballaststoffe: 2.3 },
            { Lebensmittel: 'Rindsghackets',                Einheit: 'g', Menge: 150, Kcal: 195, Fett: 14.0, Gesaettigt: 5.8, Kohlenhydrate: 0.0,  Zucker: 0.0, Eiweiss: 17.0, Salz: 0.1, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Mais',                         Einheit: 'g', Menge: 80,  Kcal: 86,  Fett: 1.2,  Gesaettigt: 0.2, Kohlenhydrate: 19.0, Zucker: 3.2, Eiweiss: 3.2,  Salz: 0.0, Ballaststoffe: 2.7 },
            { Lebensmittel: 'Zwiebel',                      Einheit: 'g', Menge: 50,  Kcal: 40,  Fett: 0.1,  Gesaettigt: 0.0, Kohlenhydrate: 9.3,  Zucker: 4.2, Eiweiss: 1.1,  Salz: 0.0, Ballaststoffe: 1.7 },
        ]
    },
    {
        Name: "Chicken Nuggets mit Pommes",
        Positionen: [
            { Lebensmittel: 'Chicken Nuggets',         Einheit: 'g', Menge: 250, Kcal: 253, Fett: 11.0, Gesaettigt: 1.5, Kohlenhydrate: 25.0, Zucker: 0.6, Eiweiss: 13.0, Salz: 1.0, Ballaststoffe: 1.2 },
            { Lebensmittel: 'McCain Pommes Frites',    Einheit: 'g', Menge: 200, Kcal: 158, Fett: 5.0,  Gesaettigt: 0.5, Kohlenhydrate: 24.0, Zucker: 0.5, Eiweiss: 2.9,  Salz: 0.03, Ballaststoffe: 2.8 },
        ]
    },
    {
        Name: "Thon-Salat",
        Positionen: [
            { Lebensmittel: 'Thon in Wasser (Dose)',  Einheit: 'g', Menge: 130, Kcal: 109, Fett: 0.8,  Gesaettigt: 0.2, Kohlenhydrate: 0.0,  Zucker: 0.0, Eiweiss: 25.0, Salz: 0.4, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Icebergsalat',           Einheit: 'g', Menge: 150, Kcal: 13,  Fett: 0.2,  Gesaettigt: 0.0, Kohlenhydrate: 2.2,  Zucker: 1.6, Eiweiss: 0.9,  Salz: 0.0, Ballaststoffe: 1.2 },
            { Lebensmittel: 'Tomate',                 Einheit: 'g', Menge: 100, Kcal: 18,  Fett: 0.2,  Gesaettigt: 0.0, Kohlenhydrate: 3.9,  Zucker: 2.6, Eiweiss: 0.9,  Salz: 0.0, Ballaststoffe: 1.2 },
        ]
    },
    {
        Name: "Fleischkäse mit Spiegelei",
        Positionen: [
            { Lebensmittel: 'Fleischkäse',            Einheit: 'g', Menge: 150, Kcal: 270, Fett: 24.0, Gesaettigt: 10.0, Kohlenhydrate: 0.5,  Zucker: 0.5, Eiweiss: 13.0, Salz: 1.8, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Spiegelei (1 Stk)',      Einheit: 'p', Menge: 2,   Kcal: 80,  Fett: 6.5,  Gesaettigt: 1.8, Kohlenhydrate: 0.3,  Zucker: 0.0, Eiweiss: 5.2,  Salz: 0.1, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Rösti FixFertig',        Einheit: 'g', Menge: 250, Kcal: 110, Fett: 5.0,  Gesaettigt: 0.5, Kohlenhydrate: 13.0, Zucker: 0.0, Eiweiss: 2.0,  Salz: 0.88, Ballaststoffe: 2.0 },
        ]
    },
    {
        Name: "Omelette",
        Positionen: [
            { Lebensmittel: 'Eier 63+',     Einheit: 'p', Menge: 4,  Kcal: 95,  Fett: 7.0, Gesaettigt: 2.0, Kohlenhydrate: 0.5, Zucker: 0.0, Eiweiss: 8.0,  Salz: 0.2,  Ballaststoffe: 0.0 },
            { Lebensmittel: 'Champignons',  Einheit: 'g', Menge: 90, Kcal: 20,  Fett: 0.3, Gesaettigt: 0.0, Kohlenhydrate: 0.5, Zucker: 0.4, Eiweiss: 2.3,  Salz: 0.2,  Ballaststoffe: 1.3 },
            { Lebensmittel: 'Kochschinken', Einheit: 'g', Menge: 75, Kcal: 107, Fett: 3.0, Gesaettigt: 1.0, Kohlenhydrate: 1.0, Zucker: 0.5, Eiweiss: 18.0, Salz: 2.3,  Ballaststoffe: 0.0 },
            { Lebensmittel: 'Peterli',      Einheit: 'g', Menge: 15, Kcal: 36,  Fett: 0.8, Gesaettigt: 0.1, Kohlenhydrate: 6.3, Zucker: 0.9, Eiweiss: 3.0,  Salz: 0.14, Ballaststoffe: 3.3 },
            { Lebensmittel: 'Schnittlauch', Einheit: 'g', Menge: 15, Kcal: 30,  Fett: 0.7, Gesaettigt: 0.1, Kohlenhydrate: 4.4, Zucker: 1.9, Eiweiss: 3.3,  Salz: 0.01, Ballaststoffe: 2.5 },
        ]
    },
    {
        Name: 'Birchermüesli',
        Positionen: [
            { Lebensmittel: 'Skyr Vanille',    Einheit: 'g', Menge: 200, Kcal: 68,  Fett: 0.2,  Gesaettigt: 0.1, Kohlenhydrate: 8.0,  Zucker: 6.5,  Eiweiss: 10.5, Salz: 0.1, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Granola Crunchy', Einheit: 'g', Menge: 40,  Kcal: 430, Fett: 15.0, Gesaettigt: 2.0, Kohlenhydrate: 62.0, Zucker: 20.0, Eiweiss: 8.0,  Salz: 0.1, Ballaststoffe: 5.0 },
        ]
    },
    {
        Name: 'Milchreis mit Zucker & Zimt',
        Positionen: [
            { Lebensmittel: 'Milchreis',                          Einheit: 'g', Menge: 60,  Kcal: 348, Fett: 0.7, Gesaettigt: 0.2, Kohlenhydrate: 77.0, Zucker: 0.2,   Eiweiss: 6.7, Salz: 0.0, Ballaststoffe: 1.0 },
            { Lebensmittel: 'Protein Milk (Emmi Good Day, UHT)',  Einheit: 'g', Menge: 400, Kcal: 42, Fett: 0.1, Gesaettigt: 0.1, Kohlenhydrate: 2.7, Zucker: 2.7, Eiweiss: 7.0, Salz: 0.08, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Zucker (Haushaltszucker)',           Einheit: 'g', Menge: 5, Kcal: 400, Fett: 0.0, Gesaettigt: 0.0, Kohlenhydrate: 100.0, Zucker: 100.0, Eiweiss: 0.0, Salz: 0.0, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Zimt (gemahlen)',                    Einheit: 'g', Menge: 1,  Kcal: 247, Fett: 1.2, Gesaettigt: 0.1, Kohlenhydrate: 80.6, Zucker: 2.2,   Eiweiss: 4.0, Salz: 0.0, Ballaststoffe: 53.1 },
        ]
    },
    {
        Name: 'Griessbrei mit Banane & Aprikose',
        Positionen: [
            { Lebensmittel: 'Griess (Hartweizen, roh)',           Einheit: 'g',   Menge: 50,  Kcal: 348, Fett: 1.0,  Gesaettigt: 0.2, Kohlenhydrate: 71.0, Zucker: 1.5,  Eiweiss: 12.5, Salz: 0.0, Ballaststoffe: 3.5 },
            { Lebensmittel: 'Protein Milk (Emmi Good Day, UHT)',  Einheit: 'g',   Menge: 400, Kcal: 42,  Fett: 0.1,  Gesaettigt: 0.1, Kohlenhydrate: 2.7,  Zucker: 2.7,  Eiweiss: 7.0,  Salz: 0.08, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Banane',                             Einheit: 'stk', Menge: 0.5, Kcal: 97.9, Fett: 0.33, Gesaettigt: 0.11, Kohlenhydrate: 25.3, Zucker: 13.2, Eiweiss: 1.21, Salz: 0.0, Ballaststoffe: 2.86 },
            { Lebensmittel: 'Aprikose',                           Einheit: 'stk', Menge: 0.5, Kcal: 72,   Fett: 0.6,  Gesaettigt: 0.0,  Kohlenhydrate: 16.5, Zucker: 13.5, Eiweiss: 2.1,  Salz: 0.0, Ballaststoffe: 3.0 },
        ]
    },
    {
        Name: 'Burger Day',
        Positionen: [
            { Lebensmittel: 'SwissTPH Hamburger',      Einheit: 'g',  Menge: 200, Kcal: 250, Fett: 12.0, Gesaettigt: 5.0, Kohlenhydrate: 22.0, Zucker: 4.0, Eiweiss: 15.0, Salz: 1.5, Ballaststoffe: 1.5 },
            { Lebensmittel: 'SwissTPH Pommes Frites',  Einheit: 'g',  Menge: 300, Kcal: 270, Fett: 14.0, Gesaettigt: 2.0, Kohlenhydrate: 33.0, Zucker: 0.5, Eiweiss: 3.5,  Salz: 0.7, Ballaststoffe: 2.5 },
            { Lebensmittel: 'Nestea Eistee Peach',     Einheit: 'ml', Menge: 500, Kcal: 19,  Fett: 0.0,  Gesaettigt: 0.0, Kohlenhydrate: 4.5,  Zucker: 4.5, Eiweiss: 0.0,  Salz: 0.1, Ballaststoffe: 0.0 },
        ]
    },
    {
        Name: 'Brötchen mit Pouletbrust',
        Positionen: [
            { Lebensmittel: 'Fussballbrötchen',         Einheit: 'g', Menge: 55,  Kcal: 265, Fett: 2.5,  Gesaettigt: 0.5, Kohlenhydrate: 50.0, Zucker: 2.0, Eiweiss: 9.0,  Salz: 1.2, Ballaststoffe: 2.5 },
            { Lebensmittel: 'Poulet Brust (ohne Haut)', Einheit: 'g', Menge: 100, Kcal: 105, Fett: 1.2,  Gesaettigt: 0.3, Kohlenhydrate: 0.0,  Zucker: 0.0, Eiweiss: 22.0, Salz: 0.1, Ballaststoffe: 0.0 },
        ]
    },
    {
        Name: 'Brötchen mit Hüttenkäse',
        Positionen: [
            { Lebensmittel: 'Brötchen (Ø)',       Einheit: 'g', Menge: 60,  Kcal: 265, Fett: 2.5,  Gesaettigt: 0.5, Kohlenhydrate: 50.0, Zucker: 2.0, Eiweiss: 9.0,  Salz: 1.2, Ballaststoffe: 2.5 },
            { Lebensmittel: 'Hüttenkäse',         Einheit: 'g', Menge: 100, Kcal: 85,  Fett: 3.5,  Gesaettigt: 2.0, Kohlenhydrate: 3.0,  Zucker: 3.0, Eiweiss: 10.0, Salz: 0.5, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Schnittlauch',       Einheit: 'g', Menge: 10,  Kcal: 30,  Fett: 0.7,  Gesaettigt: 0.1, Kohlenhydrate: 4.4,  Zucker: 1.9, Eiweiss: 3.3,  Salz: 0.01, Ballaststoffe: 2.5 },
            { Lebensmittel: 'Emmenthaler',        Einheit: 'g', Menge: 30,  Kcal: 380, Fett: 29.0, Gesaettigt: 18.0, Kohlenhydrate: 0.5, Zucker: 0.5, Eiweiss: 28.0, Salz: 0.9, Ballaststoffe: 0.0 },
        ]
    },
    {
        Name: 'Brötchen mit Trockenfleisch',
        Positionen: [
            { Lebensmittel: 'Brötchen (Ø)',        Einheit: 'g', Menge: 60,  Kcal: 265, Fett: 2.5,  Gesaettigt: 0.5, Kohlenhydrate: 50.0, Zucker: 2.0, Eiweiss: 9.0,  Salz: 1.2, Ballaststoffe: 2.5 },
            { Lebensmittel: 'Mostbröckli',         Einheit: 'g', Menge: 50,  Kcal: 170, Fett: 3.0,  Gesaettigt: 1.2, Kohlenhydrate: 1.0,  Zucker: 0.5, Eiweiss: 35.0, Salz: 4.5, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Bündnerfleisch',      Einheit: 'g', Menge: 30,  Kcal: 216, Fett: 5.0,  Gesaettigt: 2.2, Kohlenhydrate: 0.8,  Zucker: 0.8, Eiweiss: 43.0, Salz: 5.2, Ballaststoffe: 0.0 },
        ]
    },
    {
        Name: 'Brötchen mit Hüttenkäse & Ei',
        Positionen: [
            { Lebensmittel: 'Brötchen (Ø)',       Einheit: 'g', Menge: 60,  Kcal: 265, Fett: 2.5,  Gesaettigt: 0.5, Kohlenhydrate: 50.0, Zucker: 2.0, Eiweiss: 9.0,  Salz: 1.2, Ballaststoffe: 2.5 },
            { Lebensmittel: 'Hüttenkäse',         Einheit: 'g', Menge: 100, Kcal: 85,  Fett: 3.5,  Gesaettigt: 2.0, Kohlenhydrate: 3.0,  Zucker: 3.0, Eiweiss: 10.0, Salz: 0.5, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Eier 63+',           Einheit: 'p', Menge: 2,   Kcal: 95,  Fett: 7.0,  Gesaettigt: 2.0, Kohlenhydrate: 0.5,  Zucker: 0.0, Eiweiss: 8.0,  Salz: 0.2, Ballaststoffe: 0.0 },
        ]
    },
    {
        Name: 'Brötchen mit Lachs',
        Positionen: [
            { Lebensmittel: 'Toastbrot',    Einheit: 'g', Menge: 50, Kcal: 265, Fett: 3.5, Gesaettigt: 0.8, Kohlenhydrate: 48.0, Zucker: 4.0, Eiweiss: 8.5,  Salz: 1.3, Ballaststoffe: 2.0 },
            { Lebensmittel: 'Räucherlachs', Einheit: 'g', Menge: 40, Kcal: 142, Fett: 8.0, Gesaettigt: 1.5, Kohlenhydrate: 0.0,  Zucker: 0.0, Eiweiss: 18.3, Salz: 3.7, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Zwiebel',      Einheit: 'g', Menge: 15, Kcal: 40,  Fett: 0.1, Gesaettigt: 0.0, Kohlenhydrate: 9.3,  Zucker: 4.2, Eiweiss: 1.1,  Salz: 0.0, Ballaststoffe: 1.7 },
        ]
    },
    {
        Name: 'Spaghetti Carbonara',
        Positionen: [
            { Lebensmittel: 'Spaghetti (roh)', Einheit: 'g', Menge: 100, Kcal: 365, Fett: 1.5,  Gesaettigt: 0.3, Kohlenhydrate: 73.0, Zucker: 2.5, Eiweiss: 13.0, Salz: 0.0, Ballaststoffe: 2.5 },
            { Lebensmittel: 'Speckwürfel',     Einheit: 'g', Menge: 80,  Kcal: 330, Fett: 28.0, Gesaettigt: 10.0, Kohlenhydrate: 0.0, Zucker: 0.0, Eiweiss: 18.0, Salz: 2.0, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Eier 63+',        Einheit: 'p', Menge: 2,   Kcal: 95,  Fett: 7.0,  Gesaettigt: 2.0, Kohlenhydrate: 0.5,  Zucker: 0.0, Eiweiss: 8.0,  Salz: 0.2, Ballaststoffe: 0.0 },
            { Lebensmittel: 'Parmesan',        Einheit: 'g', Menge: 20,  Kcal: 431, Fett: 29.0, Gesaettigt: 18.0, Kohlenhydrate: 0.0, Zucker: 0.0, Eiweiss: 38.0, Salz: 1.8, Ballaststoffe: 0.0 },
        ]
    },
    {
        Name: 'Spaghetti Pesto',
        Positionen: [
            { Lebensmittel: 'Spaghetti (roh)',    Einheit: 'g', Menge: 100, Kcal: 365, Fett: 1.5,  Gesaettigt: 0.3, Kohlenhydrate: 73.0, Zucker: 2.5, Eiweiss: 13.0, Salz: 0.0, Ballaststoffe: 2.5 },
            { Lebensmittel: 'Pesto (Basilico)',   Einheit: 'g', Menge: 50,  Kcal: 380, Fett: 36.0, Gesaettigt: 6.0,  Kohlenhydrate: 5.0,  Zucker: 2.0, Eiweiss: 5.0,  Salz: 2.5, Ballaststoffe: 2.0 },
            { Lebensmittel: 'Parmesan',           Einheit: 'g', Menge: 15,  Kcal: 431, Fett: 29.0, Gesaettigt: 18.0, Kohlenhydrate: 0.0, Zucker: 0.0, Eiweiss: 38.0, Salz: 1.8, Ballaststoffe: 0.0 },
        ]
    },
    {
        Name: 'Spaghetti Tomatensauce',
        Positionen: [
            { Lebensmittel: 'Spaghetti (roh)',        Einheit: 'g', Menge: 100, Kcal: 365, Fett: 1.5,  Gesaettigt: 0.3, Kohlenhydrate: 73.0, Zucker: 2.5, Eiweiss: 13.0, Salz: 0.0, Ballaststoffe: 2.5 },
            { Lebensmittel: 'Tomatensauce (Passata)', Einheit: 'g', Menge: 200, Kcal: 30,  Fett: 0.2,  Gesaettigt: 0.0, Kohlenhydrate: 5.5,  Zucker: 4.0, Eiweiss: 1.2,  Salz: 0.5, Ballaststoffe: 1.5 },
            { Lebensmittel: 'Zwiebel',                Einheit: 'g', Menge: 50,  Kcal: 40,  Fett: 0.1,  Gesaettigt: 0.0, Kohlenhydrate: 9.3,  Zucker: 4.2, Eiweiss: 1.1,  Salz: 0.0, Ballaststoffe: 1.7 },
            { Lebensmittel: 'Parmesan',               Einheit: 'g', Menge: 15,  Kcal: 431, Fett: 29.0, Gesaettigt: 18.0, Kohlenhydrate: 0.0, Zucker: 0.0, Eiweiss: 38.0, Salz: 1.8, Ballaststoffe: 0.0 },
        ]
    },
];

// ===== Menu-Pairings (automatische Menu-Vorschlaege) =====
// Jeder Eintrag: keywords = Suchbegriffe, items = [{name, menge}] aus DB
const MENU_PAIRINGS = [
    { keywords: ['fischstäbchen', 'fischstaebchen', 'fischstabchen'],
      items: [
        { name: 'Fischstäbchen', menge: 150 },
        { name: 'Härdöpfel', menge: 200 },
        { name: 'Rahmspinat', menge: 200 },
    ]},
    { keywords: ['chicken nuggets', 'nuggets'],
      items: [
        { name: 'Chicken Nuggets', menge: 250 },
        { name: 'McCain Pommes Frites', menge: 200 },
    ]},
    { keywords: ['hörnli', 'hoernli', 'ghackets'],
      items: [
        { name: 'Hörnli (roh)', menge: 100 },
        { name: 'Rindsghackets', menge: 150 },
        { name: 'Apfelmus', menge: 40 },
    ]},
    { keywords: ['spaghetti', 'bolognese'],
      items: [
        { name: 'Spaghetti (roh)', menge: 100 },
        { name: 'Rindsghackets', menge: 150 },
        { name: 'Tomate', menge: 150 },
        { name: 'Zwiebel', menge: 50 },
    ]},
    { keywords: ['bratwurst'],
      items: [
        { name: 'Bratwurst (roh)', menge: 150 },
        { name: 'Rösti FixFertig', menge: 250 },
    ]},
    { keywords: ['poulet', 'chicken', 'pouletbrust'],
      items: [
        { name: 'Poulet Brust (ohne Haut)', menge: 200 },
        { name: 'Weisser Reis (roh)', menge: 80 },
        { name: 'Erbsen', menge: 100 },
    ]},
    { keywords: ['cervelat'],
      items: [
        { name: 'Cervelat', menge: 200 },
        { name: 'Ruchbrot', menge: 80 },
    ]},
    { keywords: ['rösti', 'roesti', 'buure'],
      items: [
        { name: 'Rösti FixFertig', menge: 250 },
        { name: 'Bratspeck', menge: 100 },
        { name: 'Eier 63+', menge: 4 },
    ]},
    { keywords: ['curry', 'curry balls'],
      items: [
        { name: 'Curry Balls', menge: 250 },
        { name: 'Weisser Reis (roh)', menge: 80 },
    ]},
    { keywords: ['schnitzel', 'schweineschnitzel'],
      items: [
        { name: 'Schweineschnitzel', menge: 200 },
        { name: 'McCain Pommes Frites', menge: 200 },
        { name: 'Erbsen', menge: 100 },
    ]},
    { keywords: ['pommes', 'frites'],
      items: [
        { name: 'McCain Pommes Frites', menge: 250 },
        { name: 'Chicken Nuggets', menge: 200 },
    ]},
    { keywords: ['hamburger', 'burger'],
      items: [
        { name: 'Hamburger aus Rinderhack', menge: 200 },
        { name: 'McCain Pommes Frites', menge: 200 },
        { name: 'Icebergsalat', menge: 50 },
    ]},
    { keywords: ['rindsgeschnetzeltes', 'rindsgschnätzelts', 'rind geschnetzeltes'],
      items: [
        { name: 'Rind mager (Filet/Huft/Nierstück)', menge: 200 },
        { name: 'Spätzli (roh)', menge: 120 },
        { name: 'Lauch', menge: 100 },
    ]},
    { keywords: ['schweinsgeschnetzeltes', 'schweinsgschnätzelts', 'schwein geschnetzeltes'],
      items: [
        { name: 'Schwein mager (Filet/Nierstück)', menge: 200 },
        { name: 'Spätzli (roh)', menge: 120 },
        { name: 'Lauch', menge: 100 },
    ]},
    { keywords: ['pouletgeschnetzeltes', 'pouletgschnätzelts', 'poulet geschnetzeltes'],
      items: [
        { name: 'Poulet Brust (ohne Haut)', menge: 200 },
        { name: 'Spätzli (roh)', menge: 120 },
        { name: 'Lauch', menge: 100 },
    ]},
    { keywords: ['geschnetzeltes', 'gschnätzelts', 'geschnetzelte'],
      items: [
        { name: 'Rind mager (Filet/Huft/Nierstück)', menge: 200 },
        { name: 'Spätzli (roh)', menge: 120 },
        { name: 'Lauch', menge: 100 },
    ]},
    { keywords: ['thon', 'thunfisch', 'tuna'],
      items: [
        { name: 'Thon in Wasser (Dose)', menge: 130 },
        { name: 'Weisser Reis (roh)', menge: 80 },
        { name: 'Mais', menge: 50 },
    ]},
    { keywords: ['lasagne'],
      items: [
        { name: 'Lasagneplatten (roh)', menge: 100 },
        { name: 'Rindsghackets', menge: 150 },
        { name: 'Tomate', menge: 100 },
        { name: 'Mozzarella', menge: 50 },
    ]},
    { keywords: ['penne'],
      items: [
        { name: 'Penne (roh)', menge: 100 },
        { name: 'Poulet Brust (ohne Haut)', menge: 150 },
        { name: 'Halbrahm (15%)', menge: 50 },
    ]},
    { keywords: ['pinsa', 'pizza selber', 'pizza homemade'],
      items: [
        { name: 'Pinsa Teig', menge: 230 },
        { name: 'Tomatensauce (Passata)', menge: 80 },
        { name: 'Mozzarella', menge: 125 },
    ]},
    { keywords: ['pizzateig', 'pizza selbstgemacht'],
      items: [
        { name: 'Pizzateig', menge: 250 },
        { name: 'Tomatensauce (Passata)', menge: 80 },
        { name: 'Mozzarella', menge: 125 },
    ]},
    // Grill & Smoker
    { keywords: ['pulled pork'],
      items: [
        { name: 'Pulled Pork', menge: 200 },
        { name: 'BBQ Sauce', menge: 30 },
        { name: 'Icebergsalat', menge: 50 },
    ]},
    { keywords: ['brisket'],
      items: [
        { name: 'Brisket (Rind)', menge: 250 },
        { name: 'BBQ Sauce', menge: 30 },
    ]},
    { keywords: ['dino ribs', 'beef ribs'],
      items: [
        { name: 'Dino Ribs (Beef Short Ribs)', menge: 300 },
        { name: 'BBQ Sauce', menge: 30 },
    ]},
    { keywords: ['spareribs', 'ribs'],
      items: [
        { name: 'Spareribs (Schwein)', menge: 300 },
        { name: 'BBQ Sauce', menge: 30 },
        { name: 'McCain Pommes Frites', menge: 200 },
    ]},
    { keywords: ['pouletflügeli', 'poulet flügeli', 'chicken wings'],
      items: [
        { name: 'Poulet Flügeli', menge: 250 },
        { name: 'McCain Pommes Frites', menge: 200 },
        { name: 'BBQ Sauce', menge: 30 },
    ]},
    { keywords: ['pouletschenkel', 'poulet schenkel', 'pouletoberschenkel', 'poulet oberschenkel'],
      items: [
        { name: 'Poulet Schenkel (mit Haut)', menge: 250 },
        { name: 'Weisser Reis (roh)', menge: 80 },
    ]},
    { keywords: ['raclette'],
      items: [
        { name: 'Raclette', menge: 150 },
        { name: 'Härdöpfel', menge: 200 },
    ]},
    { keywords: ['fondue', 'käsefondue'],
      items: [
        { name: 'Fondue-Mischung', menge: 200 },
        { name: 'Ruchbrot', menge: 120 },
    ]},
    { keywords: ['wienerli'],
      items: [
        { name: 'Wienerli', menge: 150 },
        { name: 'Härdöpfelsalat', menge: 200 },
    ]},
    { keywords: ['grillieren', 'grillen', 'bbq'],
      items: [
        { name: 'Bratwurst (roh)', menge: 150 },
        { name: 'Cervelat', menge: 100 },
        { name: 'Ruchbrot', menge: 60 },
    ]},
];

function searchLokal(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const fruits = FRUCHT_DB.filter(f => f.name.toLowerCase().includes(q)).map(f => ({ ...f, type: 'fruit' }));
    const vegs = GEMUESE_DB.filter(g => g.name.toLowerCase().includes(q)).map(g => ({ ...g, type: 'gemuese' }));
    return [...fruits, ...vegs];
}

async function searchOpenFoodFacts(query) {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=8&fields=product_name,nutriments,product_quantity`;
    try {
        const res = await fetch(url);
        if (!res.ok) return [];
        const data = await res.json();
        return (data.products || [])
            .filter(p => p.product_name && p.nutriments &&
                (p.nutriments['energy-kcal_100g'] > 0 || p.nutriments['energy-kj_100g'] > 0 || p.nutriments['energy_100g'] > 0))
            .map(p => {
                const n = p.nutriments;
                const kcal = n['energy-kcal_100g'] || Math.round((n['energy-kj_100g'] || n['energy_100g'] || 0) / 4.184);
                return ({
                name: p.product_name,
                kcal: Math.round(kcal),
                fett: round2(p.nutriments['fat_100g'] || 0),
                ges: round2(p.nutriments['saturated-fat_100g'] || 0),
                kh: round2(p.nutriments['carbohydrates_100g'] || 0),
                zucker: round2(p.nutriments['sugars_100g'] || 0),
                eiweiss: round2(p.nutriments['proteins_100g'] || 0),
                salz: round2(p.nutriments['salt_100g'] || 0),
                ball: round2(p.nutriments['fiber_100g'] || 0),
                gesamtmenge: parseFloat(p.product_quantity) || null,
                type: 'ofacts'
            });});
    } catch (e) {
        console.log('OFacts search error:', e);
        return [];
    }
}

function fillFromSearchResult(item) {
    if (item.type === 'fruit') {
        const fak = item.gewicht ? item.gewicht / 100 : 1;
        if ($('me-name')) $('me-name').value = item.name;
        if ($('me-unit')) $('me-unit').value = 'stk';
        if ($('me-amount')) $('me-amount').value = '1';
        if ($('me-kcal')) $('me-kcal').value = round2(item.kcal * fak);
        if ($('me-fett')) $('me-fett').value = round2(item.fett * fak);
        if ($('me-gesaettigt')) $('me-gesaettigt').value = round2(item.ges * fak);
        if ($('me-kh')) $('me-kh').value = round2(item.kh * fak);
        if ($('me-zucker')) $('me-zucker').value = round2(item.zucker * fak);
        if ($('me-eiweiss')) $('me-eiweiss').value = round2(item.eiweiss * fak);
        if ($('me-salz')) $('me-salz').value = round2(item.salz * fak);
        if ($('me-ballaststoffe')) $('me-ballaststoffe').value = round2(item.ball * fak);
    } else {
        if ($('me-name')) $('me-name').value = item.name;
        if ($('me-unit')) $('me-unit').value = 'g';
        if ($('me-amount')) $('me-amount').value = '';
        if ($('me-kcal')) $('me-kcal').value = item.kcal;
        if ($('me-fett')) $('me-fett').value = item.fett;
        if ($('me-gesaettigt')) $('me-gesaettigt').value = item.ges;
        if ($('me-kh')) $('me-kh').value = item.kh;
        if ($('me-zucker')) $('me-zucker').value = item.zucker;
        if ($('me-eiweiss')) $('me-eiweiss').value = item.eiweiss;
        if ($('me-salz')) $('me-salz').value = item.salz;
        if ($('me-ballaststoffe')) $('me-ballaststoffe').value = item.ball;
    }
    const res = $('me-search-results');
    if (res) res.classList.add('hidden');
}

function showMeSearchResults(items) {
    const res = $('me-search-results');
    if (!res) return;
    if (items.length === 0) {
        res.innerHTML = '<div class="sr-empty">Keine Treffer gefunden.</div>';
        res.classList.remove('hidden');
        return;
    }
    res.innerHTML = items.map((f, i) => {
        const tag = f.type === 'ofacts' ? ' <span class="sr-source">OFacts</span>' : '';
        const unit = f.type === 'fruit' ? 'stk' : '100g';
        const kcalVal = f.type === 'fruit' && f.gewicht ? round2(f.kcal * f.gewicht / 100) : f.kcal;
        return `<div class="sr-item" data-idx="${i}">${f.name}${tag} <span class="sr-kcal">${kcalVal} kcal/${unit}</span></div>`;
    }).join('');
    res.classList.remove('hidden');
    res.querySelectorAll('.sr-item').forEach(el => {
        el.addEventListener('click', () => fillFromSearchResult(items[parseInt(el.dataset.idx)]));
    });
}

// ===== State =====
let db = [];
let meals = [];
let templates = [];
let menuList = [];
let scanFavorit = false;
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

// Portion/Fruit (p/stk) speichern Naehrwerte pro 1 Stueck, Food/Drinks pro 100g/ml
function mengenFaktor(einheit, menge) {
    return (einheit === 'p' || einheit === 'stk') ? (menge || 0) : (menge || 0) / 100;
}

function showToast(msg) {
    let toast = $('toast-msg');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-msg';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}
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

    // Migration: alte 'f'-Einträge entfernen (wurden durch 'stk' ersetzt)
    const oldF = db.filter(d => d.Einheit === 'f');
    if (oldF.length > 0) {
        db = db.filter(d => d.Einheit !== 'f');
        saveDB();
        changed = true;
    }

    // Migration: Gesamtmenge (Durchschnittsgewicht) nachpflegen fuer bestehende Eintraege
    const allStaticDBs = [
        ...GEMUESE_DB.map(i => ({ name: i.name, gm: i.gm })),
        ...BROT_DB.map(i => ({ name: i.name, gm: i.gm })),
        ...SNACKS_DB.map(i => ({ name: i.name, gm: i.gm })),
        ...SÜSSES_DB_100.map(i => ({ name: i.name, gm: i.gm })),
        ...BEILAGEN_DB.map(i => ({ name: i.name, gm: i.gm })),
    ];
    let gmUpdated = false;
    allStaticDBs.forEach(item => {
        if (!item.gm) return;
        const existing = db.find(d => d.Lebensmittel === item.name);
        if (existing && !existing.Gesamtmenge) {
            existing.Gesamtmenge = item.gm;
            gmUpdated = true;
        }
    });
    if (gmUpdated) { saveDB(); changed = true; }

    // Migration: falsche Gesamtmenge=1 bei Portions-Items (p) auf null setzen
    let portionGmFixed = false;
    db.forEach(d => {
        if (d.Einheit === 'p' && d.Gesamtmenge === 1) {
            d.Gesamtmenge = null;
            portionGmFixed = true;
        }
    });
    if (portionGmFixed) { saveDB(); changed = true; }

    // Migration: alte 'Brot Weggli' Duplikat entfernen (wurde durch 'Weggli' ersetzt)
    const brotWeggli = db.filter(d => d.Lebensmittel === 'Brot Weggli');
    if (brotWeggli.length > 0) {
        db = db.filter(d => d.Lebensmittel !== 'Brot Weggli');
        saveDB();
        changed = true;
    }

    // Migration: 'Eier 63+' war faelschlich unter Dairy/g (100g) statt Portion/p (1 Ei) einsortiert
    const eier63 = db.find(d => d.Lebensmittel === 'Eier 63+' && d.Einheit === 'g');
    if (eier63) {
        eier63.Einheit = 'p';
        eier63.Kategorie = 'Portion';
        eier63.Gesamtmenge = null;
        saveDB();
        changed = true;
    }

    // Migration: alte "Z'Morge Ei" Eintraege entfernen (ersetzt durch 'Eier 63+')
    const zMorgeEi = db.filter(d => d.Lebensmittel === "Z'Morge Ei");
    if (zMorgeEi.length > 0) {
        db = db.filter(d => d.Lebensmittel !== "Z'Morge Ei");
        saveDB();
        changed = true;
    }

    // Migration: 'Radieschen' → 'Radisli' umbenennen
    const radieschen = db.find(d => d.Lebensmittel === 'Radieschen');
    if (radieschen) {
        radieschen.Lebensmittel = 'Radisli';
        saveDB();
        changed = true;
    }

    // Migration: "Farmer's Best Rahmspinat" → 'Rahmspinat' umbenennen (kein Markenname)
    const rahmspinat = db.find(d => d.Lebensmittel === "Farmer's Best Rahmspinat");
    if (rahmspinat) {
        rahmspinat.Lebensmittel = 'Rahmspinat';
        saveDB();
        changed = true;
    }

    // Migration: Markennamen entfernen (keine Firmennamen in der DB)
    const brandRenames = [
        ['Findus Chicken Nuggets', 'Chicken Nuggets'],
        ['Pelican Fischstäbchen', 'Fischstäbchen'],
        ['Old El Paso Tortilla Pockets', 'Tortilla Pockets'],
        ['Old El Paso Barquitas', 'Barquitas'],
    ];
    brandRenames.forEach(([alt, neu]) => {
        const item = db.find(d => d.Lebensmittel === alt);
        if (item) {
            item.Lebensmittel = neu;
            saveDB();
            changed = true;
        }
    });

    // Migration: 'Quark (mager)' → 'Magerquark' umbenennen
    const magerquark = db.find(d => d.Lebensmittel === 'Quark (mager)');
    if (magerquark) {
        magerquark.Lebensmittel = 'Magerquark';
        saveDB();
        changed = true;
    }

    // Gemüse: fehlende Einträge nachfügen (Werte pro 100g)
    let gemuseAdded = false;
    GEMUESE_DB.forEach(g => {
        if (!db.find(d => d.Lebensmittel === g.name)) {
            db.push({
                Lebensmittel: g.name, Einheit: 'g', Kategorie: 'Gemüse', Gesamtmenge: g.gm || null,
                Kcal: g.kcal, Fett: g.fett, Gesaettigt: g.ges,
                Kohlenhydrate: g.kh, Zucker: g.zucker, Eiweiss: g.eiweiss,
                Salz: g.salz, Ballaststoffe: g.ball
            });
            gemuseAdded = true;
        }
    });
    if (gemuseAdded) { saveDB(); changed = true; }

    // Früchte: fehlende Einträge nachfügen (Werte pro 1 Stück)
    let fruchtAdded = false;
    FRUCHT_DB.forEach(f => {
        if (!db.find(d => d.Lebensmittel === f.name)) {
            const fak = f.gewicht / 100;
            db.push({
                Lebensmittel: f.name, Einheit: 'stk', Kategorie: 'Fruit',
                Gesamtmenge: null,
                Kcal: round2(f.kcal * fak), Fett: round2(f.fett * fak),
                Gesaettigt: round2(f.ges * fak), Kohlenhydrate: round2(f.kh * fak),
                Zucker: round2(f.zucker * fak), Eiweiss: round2(f.eiweiss * fak),
                Salz: round2(f.salz * fak), Ballaststoffe: round2(f.ball * fak)
            });
            fruchtAdded = true;
        }
    });
    if (fruchtAdded) { saveDB(); changed = true; }

    // Milchprodukte: fehlende Einträge nachfügen
    let milchAdded = false;
    MILCH_DB.forEach(item => {
        if (!db.find(d => d.Lebensmittel === item.name)) {
            db.push({
                Lebensmittel: item.name, Einheit: 'g', Kategorie: 'Dairy', Gesamtmenge: null,
                Kcal: item.kcal, Fett: item.fett, Gesaettigt: item.ges,
                Kohlenhydrate: item.kh, Zucker: item.zucker, Eiweiss: item.eiweiss,
                Salz: item.salz, Ballaststoffe: item.ball
            });
            milchAdded = true;
        }
    });
    if (milchAdded) { saveDB(); changed = true; }

    // Beilagen: fehlende Einträge nachfügen
    let beilagenAdded = false;
    BEILAGEN_DB.forEach(item => {
        if (!db.find(d => d.Lebensmittel === item.name)) {
            db.push({
                Lebensmittel: item.name, Einheit: 'g', Kategorie: 'Beilagen', Gesamtmenge: item.gm || null,
                Kcal: item.kcal, Fett: item.fett, Gesaettigt: item.ges,
                Kohlenhydrate: item.kh, Zucker: item.zucker, Eiweiss: item.eiweiss,
                Salz: item.salz, Ballaststoffe: item.ball
            });
            beilagenAdded = true;
        }
    });
    if (beilagenAdded) { saveDB(); changed = true; }

    // Brot: fehlende Einträge nachfügen
    let brotAdded = false;
    BROT_DB.forEach(item => {
        if (!db.find(d => d.Lebensmittel === item.name)) {
            db.push({
                Lebensmittel: item.name, Einheit: 'g', Kategorie: 'Bread', Gesamtmenge: item.gm || null,
                Kcal: item.kcal, Fett: item.fett, Gesaettigt: item.ges,
                Kohlenhydrate: item.kh, Zucker: item.zucker, Eiweiss: item.eiweiss,
                Salz: item.salz, Ballaststoffe: item.ball
            });
            brotAdded = true;
        }
    });
    if (brotAdded) { saveDB(); changed = true; }

    // Menü-Vorlagen: fehlende Einträge nachfügen
    let vorlagenAdded = false;
    MENU_DB.forEach(v => {
        if (!templates.find(t => t.Name === v.Name)) {
            templates.push(v);
            vorlagenAdded = true;
        }
    });
    if (vorlagenAdded) { saveTemplates(); changed = true; }

    // Fleisch: fehlende Einträge nachfügen
    let fleischAdded = false;
    FLEISCH_DB.forEach(item => {
        if (!db.find(d => d.Lebensmittel === item.name)) {
            db.push({
                Lebensmittel: item.name, Einheit: 'g', Kategorie: 'Meat', Gesamtmenge: null,
                Kcal: item.kcal, Fett: item.fett, Gesaettigt: item.ges,
                Kohlenhydrate: item.kh, Zucker: item.zucker, Eiweiss: item.eiweiss,
                Salz: item.salz, Ballaststoffe: item.ball
            });
            fleischAdded = true;
        }
    });
    if (fleischAdded) { saveDB(); changed = true; }

    // Getränke: fehlende Einträge nachfügen
    let getraenkeAdded = false;
    GETRÄNKE_DB.forEach(item => {
        if (!db.find(d => d.Lebensmittel === item.name)) {
            db.push({
                Lebensmittel: item.name, Einheit: 'ml', Kategorie: 'Drinks', Gesamtmenge: item.gm,
                Kcal: item.kcal, Fett: item.fett, Gesaettigt: item.ges,
                Kohlenhydrate: item.kh, Zucker: item.zucker, Eiweiss: item.eiweiss,
                Salz: item.salz, Ballaststoffe: item.ball
            });
            getraenkeAdded = true;
        }
    });
    if (getraenkeAdded) { saveDB(); changed = true; }

    // Diverses: fehlende Einträge nachfügen
    let fertigprodukteAdded = false;
    FERTIGPRODUKTE_DB.forEach(item => {
        if (!db.find(d => d.Lebensmittel === item.name)) {
            db.push({
                Lebensmittel: item.name, Einheit: 'g', Kategorie: 'Misc', Gesamtmenge: item.gm,
                Kcal: item.kcal, Fett: item.fett, Gesaettigt: item.ges,
                Kohlenhydrate: item.kh, Zucker: item.zucker, Eiweiss: item.eiweiss,
                Salz: item.salz, Ballaststoffe: item.ball
            });
            fertigprodukteAdded = true;
        }
    });
    if (fertigprodukteAdded) { saveDB(); changed = true; }

    // Snacks: fehlende Einträge nachfügen
    let snacksAdded = false;
    SNACKS_DB.forEach(item => {
        if (!db.find(d => d.Lebensmittel === item.name)) {
            db.push({
                Lebensmittel: item.name, Einheit: 'g', Kategorie: 'Snacks', Gesamtmenge: item.gm || null,
                Kcal: item.kcal, Fett: item.fett, Gesaettigt: item.ges,
                Kohlenhydrate: item.kh, Zucker: item.zucker, Eiweiss: item.eiweiss,
                Salz: item.salz, Ballaststoffe: item.ball
            });
            snacksAdded = true;
        }
    });
    if (snacksAdded) { saveDB(); changed = true; }

    // Süsses (pro 100g): fehlende Einträge nachfügen
    let suesses100Added = false;
    SÜSSES_DB_100.forEach(item => {
        if (!db.find(d => d.Lebensmittel === item.name)) {
            db.push({
                Lebensmittel: item.name, Einheit: 'g', Kategorie: 'Süsses', Gesamtmenge: item.gm || null,
                Kcal: item.kcal, Fett: item.fett, Gesaettigt: item.ges,
                Kohlenhydrate: item.kh, Zucker: item.zucker, Eiweiss: item.eiweiss,
                Salz: item.salz, Ballaststoffe: item.ball
            });
            suesses100Added = true;
        }
    });
    if (suesses100Added) { saveDB(); changed = true; }

    // Süsses (pro Portion): fehlende Einträge nachfügen
    let suessesPortionAdded = false;
    SÜSSES_DB_PORTION.forEach(item => {
        if (!db.find(d => d.Lebensmittel === item.name)) {
            db.push({
                Lebensmittel: item.name, Einheit: 'p', Kategorie: 'Süsses', Gesamtmenge: null,
                Kcal: item.kcal, Fett: item.fett, Gesaettigt: item.ges,
                Kohlenhydrate: item.kh, Zucker: item.zucker, Eiweiss: item.eiweiss,
                Salz: item.salz, Ballaststoffe: item.ball
            });
            suessesPortionAdded = true;
        }
    });
    if (suessesPortionAdded) { saveDB(); changed = true; }

    // Desserts (pro 100g): fehlende Einträge nachfügen
    let dessert100Added = false;
    DESSERT_DB_100.forEach(item => {
        if (!db.find(d => d.Lebensmittel === item.name)) {
            db.push({
                Lebensmittel: item.name, Einheit: 'g', Kategorie: 'Dessert', Gesamtmenge: null,
                Kcal: item.kcal, Fett: item.fett, Gesaettigt: item.ges,
                Kohlenhydrate: item.kh, Zucker: item.zucker, Eiweiss: item.eiweiss,
                Salz: item.salz, Ballaststoffe: item.ball
            });
            dessert100Added = true;
        }
    });
    if (dessert100Added) { saveDB(); changed = true; }

    // Homemade Ice (pro 100g): fehlende Einträge nachfügen
    let homemadeIceAdded = false;
    HOMEMADE_ICE_DB.forEach(item => {
        if (!db.find(d => d.Lebensmittel === item.name)) {
            db.push({
                Lebensmittel: item.name, Einheit: 'g', Kategorie: 'Dessert', Gesamtmenge: null,
                Kcal: item.kcal, Fett: item.fett, Gesaettigt: item.ges,
                Kohlenhydrate: item.kh, Zucker: item.zucker, Eiweiss: item.eiweiss,
                Salz: item.salz, Ballaststoffe: item.ball
            });
            homemadeIceAdded = true;
        }
    });
    if (homemadeIceAdded) { saveDB(); changed = true; }

    // Desserts (pro Portion): fehlende Einträge nachfügen
    let dessertPortionAdded = false;
    DESSERT_DB_PORTION.forEach(item => {
        if (!db.find(d => d.Lebensmittel === item.name)) {
            db.push({
                Lebensmittel: item.name, Einheit: 'p', Kategorie: 'Dessert', Gesamtmenge: null,
                Kcal: item.kcal, Fett: item.fett, Gesaettigt: item.ges,
                Kohlenhydrate: item.kh, Zucker: item.zucker, Eiweiss: item.eiweiss,
                Salz: item.salz, Ballaststoffe: item.ball
            });
            dessertPortionAdded = true;
        }
    });
    if (dessertPortionAdded) { saveDB(); changed = true; }

    // Portionen: fehlende Einträge nachfügen
    let portionAdded = false;
    PORTION_DB.forEach(item => {
        if (!db.find(d => d.Lebensmittel === item.name)) {
            db.push({
                Lebensmittel: item.name, Einheit: 'p', Kategorie: 'Portion', Gesamtmenge: null,
                Kcal: item.kcal, Fett: item.fett, Gesaettigt: item.ges,
                Kohlenhydrate: item.kh, Zucker: item.zucker, Eiweiss: item.eiweiss,
                Salz: item.salz, Ballaststoffe: item.ball
            });
            portionAdded = true;
        }
    });
    if (portionAdded) { saveDB(); changed = true; }

    // Fastfood: fehlende Einträge nachfügen
    let fastfoodAdded = false;
    FASTFOOD_DB.forEach(item => {
        if (!db.find(d => d.Lebensmittel === item.name)) {
            db.push({
                Lebensmittel: item.name, Einheit: 'p', Kategorie: 'Fastfood', Gesamtmenge: null,
                Kcal: item.kcal, Fett: item.fett, Gesaettigt: item.ges,
                Kohlenhydrate: item.kh, Zucker: item.zucker, Eiweiss: item.eiweiss,
                Salz: item.salz, Ballaststoffe: item.ball
            });
            fastfoodAdded = true;
        }
    });
    if (fastfoodAdded) { saveDB(); changed = true; }

    if (changed) {
        populateMenuFoodDropdown();
        populateEditorFoodDropdown();
        populateTemplateDropdown();
        refreshHistory();
        console.log('Daten geladen:', db.length, 'LM,', meals.length, 'Mahlzeiten,', templates.length, 'Menus');
    }
}

function saveDB() { localStorage.setItem('kcal_db', JSON.stringify(db)); autoBackup(); }
function saveMeals() { localStorage.setItem('kcal_meals', JSON.stringify(meals)); autoBackup(); }
function saveTemplates() { localStorage.setItem('kcal_templates', JSON.stringify(templates)); autoBackup(); }

function recalcMealSumme(meal) {
    const s = { Kcal: 0, Fett: 0, Kohlenhydrate: 0, Zucker: 0, Eiweiss: 0 };
    meal.Positionen.forEach(p => {
        s.Kcal += p.Kcal || 0;
    });
    meal.Summe = s;
}

// ===== Auto-Backup (1x taeglich als Download) =====
function autoBackup() {
    const key = 'kcal_auto_backup_date';
    const lastBackup = localStorage.getItem(key);
    if (lastBackup === today()) return;
    if (db.length === 0 && meals.length === 0 && templates.length === 0) return;
    localStorage.setItem(key, today());
    const allData = {
        datenbank: db,
        mahlzeiten: meals,
        vorlagen: templates,
        aqua: loadAquaLog()
    };
    exportData(allData, 'kcal_backup.json');
    localStorage.setItem('kcal_last_export', today());
    showToast('Auto-Backup gespeichert');
}

// ===== Tab Navigation =====
function switchTab(name) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    $('tab-' + name).classList.add('active');
    document.querySelector(`.nav-btn[data-tab="${name}"]`).classList.add('active');
    if (name === 'home') updateDailyCircles();
    if (name === 'editor') { editorClear(); $('editor-search').value = ''; $('editor-food-select').innerHTML = ''; $('editor-status').textContent = ''; }
    if (name === 'history') refreshHistory();
    if (name === 'menus') { if ($('menu-food-select')) $('menu-food-select').innerHTML = ''; if ($('menu-search')) $('menu-search').value = ''; if ($('menu-amount')) $('menu-amount').value = ''; refreshMenuList(); refreshMenuOverview(); }
}

// ===== Dropdown Population =====
function populateMenuFoodDropdown(filter) {
    const sel = $('menu-food-select');
    if (!sel) return;
    sel.innerHTML = '';
    const filtered = filter
        ? db.filter(d => d.Lebensmittel.toLowerCase().includes(filter.toLowerCase()))
        : db;
    const favItems = filtered.filter(item => item.Favorit);
    if (favItems.length > 0) {
        const grp = document.createElement('optgroup');
        grp.label = '⭐ Favoriten';
        favItems.forEach(item => {
            const opt = document.createElement('option');
            opt.value = db.indexOf(item);
            opt.textContent = `${item.Lebensmittel} (${item.Einheit}) - ${item.Kcal} kcal${item.Gesamtmenge ? ' | ' + item.Gesamtmenge + (item.Einheit === 'ml' ? 'ml' : 'g') : ''}`;
            grp.appendChild(opt);
        });
        sel.appendChild(grp);
    }
    const groups = { Food: [], Meat: [], Dairy: [], Bread: [], Pasta: [], Misc: [], Gemüse: [], Fruit: [], Drinks: [], Portion: [] };
    filtered.filter(item => !item.Favorit).forEach(item => {
        const kat = item.Kategorie || (item.Einheit === 'ml' ? 'Drinks' : item.Einheit === 'p' ? 'Portion' : item.Einheit === 'stk' ? 'Fruit' : 'Food');
        if (!groups[kat]) groups[kat] = [];
        groups[kat].push(item);
    });
    for (const [label, items] of Object.entries(groups)) {
        if (items.length === 0) continue;
        const grp = document.createElement('optgroup');
        grp.label = label;
        items.forEach(item => {
            const opt = document.createElement('option');
            opt.value = db.indexOf(item);
            opt.textContent = `${item.Lebensmittel} (${item.Einheit}) - ${item.Kcal} kcal${item.Gesamtmenge ? ' | ' + item.Gesamtmenge + (item.Einheit === 'ml' ? 'ml' : 'g') : ''}`;
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
    const favItems = filtered.filter(item => item.Favorit);
    if (favItems.length > 0) {
        const grp = document.createElement('optgroup');
        grp.label = '⭐ Favoriten';
        favItems.forEach(item => {
            const opt = document.createElement('option');
            opt.value = db.indexOf(item);
            opt.textContent = `${item.Lebensmittel} (${item.Einheit}) - ${item.Kcal} kcal${item.Gesamtmenge ? ' | ' + item.Gesamtmenge + (item.Einheit === 'ml' ? 'ml' : 'g') : ''}`;
            grp.appendChild(opt);
        });
        sel.appendChild(grp);
    }
    const groups = { Food: [], Meat: [], Dairy: [], Bread: [], Pasta: [], Misc: [], Gemüse: [], Fruit: [], Drinks: [], Portion: [] };
    filtered.filter(item => !item.Favorit).forEach(item => {
        const kat = item.Kategorie || (item.Einheit === 'ml' ? 'Drinks' : item.Einheit === 'p' ? 'Portion' : item.Einheit === 'stk' ? 'Fruit' : 'Food');
        if (!groups[kat]) groups[kat] = [];
        groups[kat].push(item);
    });
    for (const [label, items] of Object.entries(groups)) {
        if (items.length === 0) continue;
        const grp = document.createElement('optgroup');
        grp.label = label;
        items.forEach(item => {
            const opt = document.createElement('option');
            opt.value = db.indexOf(item);
            opt.textContent = `${item.Lebensmittel} (${item.Einheit}) - ${item.Kcal} kcal${item.Gesamtmenge ? ' | ' + item.Gesamtmenge + (item.Einheit === 'ml' ? 'ml' : 'g') : ''}`;
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


// ===== Scan Preview anzeigen (editierbar, kein Auto-Save) =====
function findSimilarInDB(name) {
    if (!name) return [];
    const lower = name.toLowerCase();
    return db.filter(d => {
        const dLower = d.Lebensmittel.toLowerCase();
        return dLower !== lower && (dLower.includes(lower) || lower.includes(dLower));
    });
}

function showScanPreview(food) {
    $('food-display').classList.remove('hidden');
    $('fd-name').value = food.Lebensmittel || '';
    $('fd-unit').value = food.Einheit || 'g';
    $('fd-quantity').value = food.Gesamtmenge || '';
    $('fd-kcal').value = food.Kcal ?? '';
    $('fd-fett').value = food.Fett ?? '';
    $('fd-gesaettigt').value = food.Gesaettigt ?? '';
    $('fd-kh').value = food.Kohlenhydrate ?? '';
    $('fd-zucker').value = food.Zucker ?? '';
    $('fd-eiweiss').value = food.Eiweiss ?? '';
    $('fd-salz').value = food.Salz ?? '';
    $('fd-ballaststoffe').value = food.Ballaststoffe ?? '';
    scanFavorit = food.Favorit || false;
    const favBtn = $('fd-favorit');
    if (favBtn) favBtn.textContent = scanFavorit ? '⭐' : '☆';
    updateScanPreviewHeader();
    const hint = $('fd-similar-hint');
    if (hint) {
        const similars = findSimilarInDB(food.Lebensmittel || '');
        if (similars.length > 0) {
            hint.classList.remove('hidden');
            const links = similars.map((s, i) =>
                `<a href="#" data-idx="${i}" style="color:#f38ba8;text-decoration:underline">${s.Lebensmittel}</a>`
            ).join(' &nbsp;|&nbsp; ');
            hint.innerHTML = `Ähnlich in DB: ${links}`;
            hint.querySelectorAll('a').forEach(a => {
                a.addEventListener('click', e => {
                    e.preventDefault();
                    $('fd-name').value = similars[parseInt(a.dataset.idx)].Lebensmittel;
                    hint.classList.add('hidden');
                });
            });
        } else {
            hint.classList.add('hidden');
        }
    }
}

function updateScanPreviewHeader() {
    const unit = $('fd-unit').value;
    const h = $('fd-pro100-header');
    if (h) h.textContent = unit === 'ml' ? 'pro 100ml' : unit === 'p' ? '1 Port.' : unit === 'stk' ? '1 Stk.' : 'pro 100g';
}

function saveScanPreview() {
    const name = $('fd-name').value.trim();
    if (!name) { $('menu-status').textContent = 'Bitte Produktname eingeben.'; return; }
    const unit = $('fd-unit').value;
    const gmVal = parseFloat($('fd-quantity').value);
    const gm = isNaN(gmVal) ? null : gmVal;
    const kcal = parseFloat($('fd-kcal').value) || 0;

    const food = {
        Lebensmittel: name,
        Einheit: unit,
        Kategorie: unit === 'ml' ? 'Drinks' : unit === 'p' ? 'Portion' : unit === 'stk' ? 'Fruit' : 'Food',
        Gesamtmenge: gm,
        Kcal: round2(kcal),
        Fett: round2(parseFloat($('fd-fett').value) || 0),
        Gesaettigt: round2(parseFloat($('fd-gesaettigt').value) || 0),
        Kohlenhydrate: round2(parseFloat($('fd-kh').value) || 0),
        Zucker: round2(parseFloat($('fd-zucker').value) || 0),
        Eiweiss: round2(parseFloat($('fd-eiweiss').value) || 0),
        Salz: round2(parseFloat($('fd-salz').value) || 0),
        Ballaststoffe: round2(parseFloat($('fd-ballaststoffe').value) || 0),
        Favorit: scanFavorit
    };

    const exists = db.findIndex(d => d.Lebensmittel === food.Lebensmittel);
    let action;
    if (exists >= 0) {
        db[exists] = food;
        action = 'aktualisiert';
    } else {
        db.push(food);
        action = 'gespeichert';
    }
    saveDB();
    populateEditorFoodDropdown();
    populateMenuFoodDropdown();

    const gmStr = gm ? ' | ' + gm + unit : '';
    $('menu-status').textContent = `${name} (${unit}) - ${food.Kcal} kcal${gmStr} - ${action}`;
    $('food-display').classList.add('hidden');
    showToast('✓ ' + name + ' gespeichert');
}

// ===== Menu List =====
function refreshMenuList() {
    const box = $('menu-list');
    if (!box) return;
    box.innerHTML = '';
    menuList.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'mli';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'mli-name';
        nameSpan.textContent = item.Lebensmittel;

        const inp = document.createElement('input');
        inp.type = 'number';
        inp.className = 'mli-qty';
        inp.value = item.Menge;
        inp.min = '0.1';
        inp.step = (item.Einheit === 'stk') ? '0.5' : '1';

        const unitSpan = document.createElement('span');
        unitSpan.className = 'mli-unit';
        unitSpan.textContent = item.Einheit;

        const kcalSpan = document.createElement('span');
        kcalSpan.className = 'mli-kcal';
        kcalSpan.textContent = Math.round(item.Kcal * mengenFaktor(item.Einheit, item.Menge)) + ' kcal';

        inp.addEventListener('input', () => {
            const v = parseFloat(inp.value);
            if (v > 0) {
                menuList[i].Menge = v;
                kcalSpan.textContent = Math.round(item.Kcal * mengenFaktor(item.Einheit, v)) + ' kcal';
            }
        });

        const delBtn = document.createElement('button');
        delBtn.className = 'mli-del';
        delBtn.textContent = '×';
        delBtn.addEventListener('click', () => {
            menuList.splice(i, 1);
            selectedMenuIndex = -1;
            refreshMenuList();
        });

        div.appendChild(nameSpan);
        div.appendChild(inp);
        div.appendChild(unitSpan);
        div.appendChild(kcalSpan);
        div.appendChild(delBtn);
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
    const cats = (p.categories_tags || []).join(' ');
    const qtyStr = (p.quantity || '').toLowerCase();
    const isDrink = /\d+\s*ml/.test(qtyStr) || /\d+\s*l\b/.test(qtyStr) || cats.includes('beverages') || cats.includes('drinks');
    return {
        Lebensmittel: p.product_name_de || p.product_name || 'Unbekannt',
        Einheit: isDrink ? 'ml' : 'g',
        Kategorie: isDrink ? 'Drinks' : 'Food',
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

        showScanPreview(food);
        $('menu-barcode').value = '';
        $('menu-status').textContent = `${food.Lebensmittel} - pruefen und speichern.`;
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
    $('ed-amount').value = (food.Einheit === 'p' || food.Einheit === 'stk') ? '1' : (food.Einheit === 'ml' && food.Gesamtmenge) ? food.Gesamtmenge : '';
    updateEditorHeader();
    updateEditorCalc();
}

// ===== Editor: Effektive Werte berechnen (alt - nicht mehr verwendet) =====
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

    const unit = editorLoadedFood ? editorLoadedFood.Einheit : 'g';
    const kategorie = unit === 'ml' ? 'Drinks' : unit === 'p' ? 'Portion' : unit === 'stk' ? 'Fruit' : 'Food';
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
    if (!editorLoadedFood) return;
    const unit = editorLoadedFood.Einheit;
    const h = $('ed-header');
    if (h) h.textContent = unit === 'ml' ? 'Drink per 100ml' : unit === 'p' ? 'Portion per 1p' : unit === 'stk' ? 'Fruit per 1 Stk.' : 'Food per 100g';
    const lbl = $('ed-name-label');
    if (lbl) lbl.textContent = unit === 'ml' ? 'Drink:' : unit === 'p' ? 'Portion:' : unit === 'stk' ? 'Fruit:' : 'Food:';
    const pro = $('ed-pro100-header');
    if (pro) pro.textContent = unit === 'ml' ? 'pro 100ml' : unit === 'p' ? '1 Port.' : unit === 'stk' ? '1 Stk.' : 'pro 100g';
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
    $('ed-amount').value = (food.Einheit === 'p' || food.Einheit === 'stk') ? '1' : (food.Einheit === 'ml' && food.Gesamtmenge) ? food.Gesamtmenge : '';
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
    const f = (unit === 'p' || unit === 'stk') ? amount : amount / 100;
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
    if ($('ed-pro100-header')) $('ed-pro100-header').textContent = 'pro 100';
    if ($('ed-header')) $('ed-header').textContent = 'Food per 100g';
    if ($('ed-name-label')) $('ed-name-label').textContent = 'Food:';
    if ($('ed-calc-header')) $('ed-calc-header').textContent = '';
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

// ===== Menue: Bestehendes Menu editieren =====
let editingTemplateIdx = -1;

function menuEditTemplate(tplIdx) {
    const tpl = templates[tplIdx];
    if (!tpl) return;
    editingTemplateIdx = tplIdx;
    $('menu-name').value = tpl.Name;
    menuList = tpl.Positionen.map(p => ({ ...p }));
    selectedMenuIndex = -1;
    refreshMenuList();
    $('menu-cancel').classList.remove('hidden');
    $('menus-status').textContent = `Menu '${tpl.Name}' wird bearbeitet.`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function menuCancelEdit() {
    editingTemplateIdx = -1;
    menuList = [];
    selectedMenuIndex = -1;
    $('menu-name').value = '';
    refreshMenuList();
    $('menu-cancel').classList.add('hidden');
    $('menus-status').textContent = 'Bearbeitung abgebrochen.';
}

// ===== Menue: Leeren =====
function menuClear() {
    editingTemplateIdx = -1;
    menuList = [];
    selectedMenuIndex = -1;
    $('menu-name').value = '';
    refreshMenuList();
    $('menu-cancel').classList.add('hidden');
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

    if (editingTemplateIdx >= 0) {
        templates[editingTemplateIdx] = { Name: name, Positionen: positions };
    } else {
        const idx = templates.findIndex(t => t.Name === name);
        if (idx >= 0) { templates[idx] = { Name: name, Positionen: positions }; }
        else { templates.push({ Name: name, Positionen: positions }); }
    }

    saveTemplates();
    editingTemplateIdx = -1;
    menuList = [];
    selectedMenuIndex = -1;
    $('menu-name').value = '';
    refreshMenuList();
    refreshMenuOverview();
    $('menu-cancel').classList.add('hidden');
    statusEl.textContent = `Menu '${name}' gespeichert.`;
}

// ===== Menue-Uebersicht (Speisekarte) =====
function menuTotalKcal(tpl) {
    let totalKcal = 0;
    tpl.Positionen.forEach(p => { totalKcal += (p.Kcal || 0) * mengenFaktor(p.Einheit, p.Menge); });
    return totalKcal;
}

// Baut Zutatenliste + Aktions-Buttons fuer ein Menu (per tplIdx); wird sowohl fuer
// einzelne Karten als auch fuer die Varianten innerhalb einer gruppierten Karte genutzt.
function buildMenuCardDetails(tplIdx) {
    const tpl = templates[tplIdx];
    const details = document.createElement('div');
    details.className = 'menu-card-details hidden';

    const items = document.createElement('div');
    items.className = 'menu-card-items';
    tpl.Positionen.forEach(p => {
        const menge = Math.round(p.Menge || 0);
        const kcal = Math.round((p.Kcal || 0) * mengenFaktor(p.Einheit, p.Menge));
        const div = document.createElement('div');
        div.className = 'menu-card-item';
        div.textContent = `${p.Lebensmittel} - ${menge}${p.Einheit} (${kcal} kcal)`;
        items.appendChild(div);
    });
    details.appendChild(items);

    const actions = document.createElement('div');
    actions.className = 'button-row';
    actions.style.marginTop = '8px';

    ["z'Morge", "z'Mittag", "z'Nacht"].forEach(meal => {
        const btn = document.createElement('button');
        btn.className = 'btn-meal';
        btn.textContent = meal;
        btn.addEventListener('click', e => { e.stopPropagation(); useMenuAsMeal(tplIdx, meal); });
        actions.appendChild(btn);
    });

    const btnEdit = document.createElement('button');
    btnEdit.className = 'btn-green';
    btnEdit.textContent = 'Edit';
    btnEdit.addEventListener('click', e => {
        e.stopPropagation();
        menuEditTemplate(tplIdx);
    });

    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn-red';
    btnDelete.textContent = 'Delete';
    btnDelete.addEventListener('click', e => {
        e.stopPropagation();
        if (!confirm(`Menu '${tpl.Name}' entfernen?`)) return;
        templates.splice(tplIdx, 1);
        saveTemplates();
        refreshMenuOverview();
        $('menus-status').textContent = `Menu '${tpl.Name}' entfernt.`;
    });

    actions.appendChild(btnEdit);
    actions.appendChild(btnDelete);
    details.appendChild(actions);
    return details;
}

// Einzelkarte (keine Varianten) - wie bisher
function renderMenuCard(container, tplIdx) {
    const tpl = templates[tplIdx];

    const card = document.createElement('div');
    card.className = 'menu-card';

    const header = document.createElement('div');
    header.className = 'menu-card-header';
    header.innerHTML = `<span class="menu-card-name">${tpl.Name}</span><span class="menu-card-kcal">${Math.round(menuTotalKcal(tpl))} kcal</span>`;
    card.appendChild(header);

    const details = buildMenuCardDetails(tplIdx);
    card.appendChild(details);

    header.addEventListener('click', () => {
        details.classList.toggle('hidden');
    });

    container.appendChild(card);
}

// Laengstes gemeinsames Wort-Praefix mehrerer Namen (z.B. "Brötchen mit" bei
// "Brötchen mit Pouletbrust" / "Brötchen mit Hüttenkäse" / ...)
function commonWordPrefix(names) {
    const wordArrays = names.map(n => n.split(' '));
    const minLen = Math.min(...wordArrays.map(w => w.length));
    const prefixWords = [];
    for (let i = 0; i < minLen; i++) {
        const word = wordArrays[0][i];
        if (wordArrays.every(w => w[i] === word)) prefixWords.push(word);
        else break;
    }
    return prefixWords.join(' ');
}

// Gruppierte Karte: mehrere Menus mit gleichem erstem Namenswort (z.B. "Spaghetti Bolognese"/
// "Spaghetti Carbonara") teilen sich eine Karte. Zugeklappt zeigt das Dropdown immer den
// fixen Titel ("Brötchen mit..."); aufgeklappt stehen die vollen Namen aller Varianten zur Wahl.
function renderGroupedMenuCard(container, tplIndices) {
    const card = document.createElement('div');
    card.className = 'menu-card';

    const names = tplIndices.map(idx => templates[idx].Name);
    const firstWord = names[0].split(' ')[0];
    const prefix = (commonWordPrefix(names) || firstWord) + '...';

    const header = document.createElement('div');
    header.className = 'menu-card-header';

    const select = document.createElement('select');
    select.className = 'menu-card-name menu-card-variant-select';

    const placeholderOpt = document.createElement('option');
    placeholderOpt.value = '';
    placeholderOpt.textContent = prefix;
    placeholderOpt.disabled = true;
    select.appendChild(placeholderOpt);

    // Optionen zeigen nur den Rest nach dem ersten (gemeinsamen) Wort, z.B. "mit Pouletbrust"
    // statt "Brötchen mit Pouletbrust" - kuerzer, passt auf eine Zeile.
    tplIndices.forEach(idx => {
        const opt = document.createElement('option');
        opt.value = idx;
        const full = templates[idx].Name;
        opt.textContent = full.startsWith(firstWord + ' ') ? full.slice(firstWord.length + 1) : full;
        select.appendChild(opt);
    });
    select.value = ''; // zeigt zugeklappt immer den Platzhalter-Titel

    const kcalSpan = document.createElement('span');
    kcalSpan.className = 'menu-card-kcal';

    header.appendChild(select);
    header.appendChild(kcalSpan);
    card.appendChild(header);

    let details = null;
    function showVariant(tplIdx, forceOpen) {
        const tpl = templates[tplIdx];
        kcalSpan.textContent = Math.round(menuTotalKcal(tpl)) + ' kcal';
        const wasOpen = details && !details.classList.contains('hidden');
        if (details) details.remove();
        details = buildMenuCardDetails(tplIdx);
        if (wasOpen || forceOpen) details.classList.remove('hidden');
        card.appendChild(details);
    }

    select.addEventListener('change', () => {
        showVariant(parseInt(select.value, 10), true);
        select.selectedIndex = 0; // zurueck auf Platzhalter-Titel (Index 0 = placeholder)
    });
    header.addEventListener('click', e => {
        if (e.target === select) return;
        if (details) details.classList.toggle('hidden');
    });

    showVariant(tplIndices[0]);
    container.appendChild(card);
}

function refreshMenuOverview() {
    const container = $('menu-overview');
    if (!container) return;
    container.innerHTML = '';

    if (templates.length === 0) {
        container.innerHTML = '<div style="color:var(--subtext);text-align:center;padding:12px">Noch keine Menus gespeichert.</div>';
        return;
    }

    // Gruppierung nach erstem Wort im Namen (z.B. "Spaghetti", "Brötchen")
    const groupOrder = [];
    const groupMap = {};
    templates.forEach((tpl, tplIdx) => {
        const key = tpl.Name.split(' ')[0].toLowerCase();
        if (!(key in groupMap)) {
            groupMap[key] = [];
            groupOrder.push(key);
        }
        groupMap[key].push(tplIdx);
    });

    groupOrder.forEach(key => {
        const indices = groupMap[key];
        if (indices.length === 1) {
            renderMenuCard(container, indices[0]);
        } else {
            renderGroupedMenuCard(container, indices);
        }
    });
}

// ===== Positionen (Menu-Zutaten) als Mahlzeit verbuchen (zaehlt zum Tagessoll) =====
function logPositionsAsMeal(positionsSrc, mealType) {
    const s = { kcal: 0, fett: 0, kh: 0, zucker: 0, eiweiss: 0, ges: 0, salz: 0, ball: 0 };
    const positions = positionsSrc.map(p => {
        const f = mengenFaktor(p.Einheit, p.Menge);
        s.kcal += (p.Kcal || 0) * f;
        s.fett += (p.Fett || 0) * f;
        s.kh += (p.Kohlenhydrate || 0) * f;
        s.zucker += (p.Zucker || 0) * f;
        s.eiweiss += (p.Eiweiss || 0) * f;
        s.ges += (p.Gesaettigt || 0) * f;
        s.salz += (p.Salz || 0) * f;
        s.ball += (p.Ballaststoffe || 0) * f;
        return { Lebensmittel: p.Lebensmittel, Menge: p.Menge, Einheit: p.Einheit,
                 Kcal: Math.round((p.Kcal || 0) * f * 10) / 10 };
    });

    meals.push({
        Datum: today(), Zeit: nowTime(), Mahlzeit: mealType,
        Positionen: positions,
        Summe: {
            Kcal: Math.round(s.kcal * 10) / 10, Fett: Math.round(s.fett * 10) / 10,
            Kohlenhydrate: Math.round(s.kh * 10) / 10, Zucker: Math.round(s.zucker * 10) / 10,
            Eiweiss: Math.round(s.eiweiss * 10) / 10, Gesaettigt: Math.round(s.ges * 10) / 10,
            Salz: Math.round(s.salz * 10) / 10, Ballaststoffe: Math.round(s.ball * 10) / 10
        }
    });
    saveMeals();
    updateDailyCircles();
    return s;
}

// ===== Menu als Mahlzeit verwenden (zaehlt zum Tagessoll) =====
function useMenuAsMeal(tplIdx, mealType) {
    const tpl = templates[tplIdx];
    if (!tpl) return;
    const s = logPositionsAsMeal(tpl.Positionen, mealType);
    $('menus-status').textContent = `'${tpl.Name}' als ${mealType} gespeichert - ${Math.round(s.kcal)} kcal`;
    showToast(`✓ ${tpl.Name} → ${mealType}`);
}

// ===== Aktuellen Menu-Baukasten (angepasste Mengen) direkt als Mahlzeit loggen, ohne das Rezept zu ueberschreiben =====
function logMenuBuilderAsMeal(mealType) {
    if (menuList.length === 0) { $('menus-status').textContent = 'Bitte zuerst Lebensmittel hinzufuegen.'; return; }
    const label = $('menu-name').value.trim() || 'Menu';
    const s = logPositionsAsMeal(menuList, mealType);

    editingTemplateIdx = -1;
    menuList = [];
    selectedMenuIndex = -1;
    $('menu-name').value = '';
    refreshMenuList();
    $('menu-cancel').classList.add('hidden');

    $('menus-status').textContent = `'${label}' als ${mealType} gespeichert - ${Math.round(s.kcal)} kcal`;
    showToast(`✓ ${label} → ${mealType}`);
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
    const f = (food.Einheit === 'p' || food.Einheit === 'stk') ? amount : amount / 100;

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
            Eiweiss: Math.round(food.Eiweiss * f * 10) / 10,
            Gesaettigt: Math.round((food.Gesaettigt || 0) * f * 10) / 10,
            Salz: Math.round((food.Salz || 0) * f * 10) / 10,
            Ballaststoffe: Math.round((food.Ballaststoffe || 0) * f * 10) / 10
        }
    });
    saveMeals();
    updateDailyCircles();
    $('editor-status').textContent = `${food.Lebensmittel} (${Math.round(amount)}${food.Einheit}) als ${mealType} gespeichert.`;
    showToast(`✓ ${mealType} gespeichert`);
}

// ===== AquaTrack =====
function loadAquaLog() {
    try { return JSON.parse(localStorage.getItem('kcal_aqua')) || []; } catch { return []; }
}
function saveAquaLog(log) { localStorage.setItem('kcal_aqua', JSON.stringify(log)); }

function addAquaEntry(name, ml) {
    const log = loadAquaLog();
    log.push({ Datum: today(), Zeit: nowTime(), Name: name, Menge: ml });
    saveAquaLog(log);
    updateAquaTrack();
    showToast(`✓ ${name} +${ml}ml`);
}

function removeAquaEntry(name, ml) {
    const log = loadAquaLog();
    const todayStr = today();
    for (let i = log.length - 1; i >= 0; i--) {
        if (log[i].Datum === todayStr && log[i].Name === name && log[i].Menge === ml) {
            log.splice(i, 1);
            saveAquaLog(log);
            updateAquaTrack();
            showToast(`✕ ${name} -${ml}ml`);
            return;
        }
    }
    showToast(`Kein ${name} zum Entfernen`);
}

function updateAquaTrack() {
    const todayStr = today();

    // Manuelle Einträge (Wasser, Kaffee)
    const log = loadAquaLog();
    let totalMl = 0;
    log.filter(e => e.Datum === todayStr).forEach(e => { totalMl += e.Menge; });

    // Drinks aus Mahlzeiten (alles mit Einheit ml)
    meals.filter(m => m.Datum === todayStr).forEach(m => {
        m.Positionen.forEach(p => {
            if (p.Einheit === 'ml') totalMl += (p.Menge || 0);
        });
    });

    const pct = Math.min(Math.round((totalMl / GOALS.aqua) * 100), 100);
    const info = $('aqua-info');
    const dropFill = $('aqua-drop-fill');
    const dropPct = $('aqua-drop-pct');
    const reached = totalMl >= GOALS.aqua;
    if (info) info.textContent = `${Math.round(totalMl)} / ${GOALS.aqua} ml`;
    if (dropFill) {
        dropFill.setAttribute('y', 130 - (pct / 100 * 130));
        dropFill.style.fill = reached ? 'var(--green)' : '#74c7ec';
    }
    if (dropPct) dropPct.textContent = pct + '%';
    if (info) info.style.color = reached ? 'var(--green)' : '#74c7ec';

}

// ===== Daily Status Circles =====
function updateDailyCircles() {
    const todayStr = today();
    const todayMeals = meals.filter(m => m.Datum === todayStr);

    const totals = { kcal: 0, eiweiss: 0, kh: 0, fett: 0, zucker: 0, ges: 0, salz: 0, ball: 0 };
    todayMeals.forEach(m => {
        totals.kcal += m.Summe.Kcal || 0;
        totals.eiweiss += m.Summe.Eiweiss || 0;
        totals.kh += m.Summe.Kohlenhydrate || 0;
        totals.fett += m.Summe.Fett || 0;
        totals.zucker += m.Summe.Zucker || 0;
        totals.ges += m.Summe.Gesaettigt || 0;
        totals.salz += m.Summe.Salz || 0;
        totals.ball += m.Summe.Ballaststoffe || 0;
    });

    const circumference = 2 * Math.PI * 52; // 326.7
    const items = [
        ['kcal', totals.kcal, GOALS.kcal],
        ['eiweiss', totals.eiweiss, GOALS.eiweiss],
        ['kh', totals.kh, GOALS.kohlenhydrate],
        ['fett', totals.fett, GOALS.fett],
        ['zucker', totals.zucker, GOALS.zucker]
    ];

    const kcalTotal = $('daily-kcal-total');
    if (kcalTotal) kcalTotal.textContent = '— ' + Math.round(totals.kcal) + ' / ' + GOALS.kcal + ' kcal';

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
        if (valEl) {
            const remaining = Math.max(goal - current, 0);
            const unit = id === 'kcal' ? '' : 'g';
            const remText = pct > 100 ? '+' + Math.round(current - goal) + unit : Math.round(remaining) + unit;
            valEl.innerHTML = pct + '%<br><span class="circle-remaining">' + remText + '</span>';
        }
    });

    const extraStats = $('daily-extra-stats');
    if (extraStats) {
        const SALZ_REF = 5; // WHO-Richtwert pro Tag
        const salzClass = totals.salz >= SALZ_REF ? 'salz-over' : totals.salz >= SALZ_REF / 2 ? 'salz-warn' : 'salz-ok';
        extraStats.innerHTML = `Salz: <span class="${salzClass}">${totals.salz.toFixed(1)}g</span> · gesättigt: ${totals.ges.toFixed(1)}g · Ballaststoffe: ${totals.ball.toFixed(1)}g`;
    }

    renderDailyMeals(todayMeals);
    updateAquaTrack();
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
            const pi = parseInt(btn.dataset.pos);
            const meal = todayMealsList[mi];
            if (!meal) return;

            if (meal.Positionen.length <= 1) {
                // Letzter Eintrag -> ganzen Meal löschen
                const globalIdx = meals.indexOf(meal);
                if (globalIdx >= 0) meals.splice(globalIdx, 1);
            } else {
                // Einzelne Position entfernen und Summe neu berechnen
                meal.Positionen.splice(pi, 1);
                recalcMealSumme(meal);
            }
            saveMeals();
            updateDailyCircles();
        });
    });
}

// ===== Verlauf =====
let currentMealTab = 'zmorge';
let historyDate = today();
const MEAL_NAMES = { zmorge: "z'Morge", zmittag: "z'Mittag", znacht: "z'Nacht", aqua: "Aqua" };

function refreshHistory() {
    const content = $('history-content');
    if (!content) return;
    const dateEl = $('history-date');
    if (dateEl) dateEl.value = historyDate;

    if (currentMealTab === 'aqua') {
        refreshAquaHistory(content);
        return;
    }

    const mealName = MEAL_NAMES[currentMealTab];
    const mealEntries = meals.filter(m => m.Datum === historyDate && m.Mahlzeit === mealName);

    let html = '';
    html += '<div class="hist-header">' + mealName + ' - ' + historyDate + '</div>';

    if (mealEntries.length === 0) {
        html += '<div class="hist-empty">Noch nichts fuer ' + mealName + ' gespeichert.</div>';
    } else {
        const tag = { kcal: 0, fett: 0, kh: 0, zucker: 0, eiweiss: 0 };

        mealEntries.forEach((m, mi) => {
            const mealIdx = meals.indexOf(m);
            html += '<div class="hist-time">' + m.Zeit + '</div>';
            html += '<div class="hist-sep"></div>';
            m.Positionen.forEach((p, pi) => {
                const mg = Math.round(p.Menge);
                html += '<div class="hist-entry">';
                html += '<span class="hist-item">' + (p.Lebensmittel || '') + '</span>';
                html += '<span class="hist-detail">' + mg + p.Einheit + ' / ' + p.Kcal + ' kcal</span>';
                html += '<button class="hist-del" data-meal="' + mealIdx + '" data-pos="' + pi + '">✕</button>';
                html += '</div>';
            });
            tag.kcal += m.Summe.Kcal;
            tag.fett += m.Summe.Fett;
            tag.kh += m.Summe.Kohlenhydrate;
            tag.zucker += m.Summe.Zucker;
            tag.eiweiss += m.Summe.Eiweiss;
        });

        html += '<div class="hist-header" style="margin-top:10px">TOTAL</div>';
        html += '<div class="hist-total">Kalorien: ' + tag.kcal.toFixed(1) + ' / ' + GOALS.kcal + ' kcal</div>';
        html += '<div class="hist-total">Fett: ' + tag.fett.toFixed(1) + ' / ' + GOALS.fett + ' g</div>';
        html += '<div class="hist-total">KH: ' + tag.kh.toFixed(1) + ' / ' + GOALS.kohlenhydrate + ' g</div>';
        html += '<div class="hist-total">Zucker: ' + tag.zucker.toFixed(1) + ' / ' + GOALS.zucker + ' g</div>';
        html += '<div class="hist-total">Eiweiss: ' + tag.eiweiss.toFixed(1) + ' / ' + GOALS.eiweiss + ' g</div>';
    }

    content.innerHTML = html;

    content.querySelectorAll('.hist-del').forEach(btn => {
        btn.addEventListener('click', () => {
            const mi = parseInt(btn.dataset.meal);
            const pi = parseInt(btn.dataset.pos);
            const meal = meals[mi];
            if (!meal) return;
            meal.Positionen.splice(pi, 1);
            if (meal.Positionen.length === 0) {
                meals.splice(mi, 1);
            } else {
                recalcMealSumme(meal);
            }
            saveMeals();
            updateDailyCircles();
            refreshHistory();
            showToast('✓ Eintrag geloescht');
        });
    });
}

function refreshAquaHistory(content) {
    const log = loadAquaLog();
    const dayEntries = log.filter(e => e.Datum === historyDate);

    // Drinks aus Mahlzeiten
    const mealDrinks = [];
    meals.filter(m => m.Datum === historyDate).forEach(m => {
        m.Positionen.forEach(p => {
            if (p.Einheit === 'ml') {
                mealDrinks.push({ Zeit: m.Zeit, Name: p.Lebensmittel, Menge: p.Menge || 0 });
            }
        });
    });

    let html = '';
    html += '<div class="hist-header">AquaTrack - ' + historyDate + '</div>';

    let totalMl = 0;

    if (dayEntries.length === 0 && mealDrinks.length === 0) {
        html += '<div class="hist-empty">Keine Eintraege.</div>';
    } else {
        if (dayEntries.length > 0) {
            html += '<div class="hist-time">Quick-Add:</div>';
            html += '<div class="hist-sep"></div>';
            dayEntries.forEach((e, ei) => {
                totalMl += e.Menge;
                html += '<div class="hist-entry">';
                html += '<span class="hist-item">' + e.Zeit + '  ' + (e.Name || '') + '</span>';
                html += '<span class="hist-detail">' + e.Menge + ' ml</span>';
                html += '<button class="hist-del" data-aqua="' + ei + '">✕</button>';
                html += '</div>';
            });
        }
        if (mealDrinks.length > 0) {
            html += '<div class="hist-time" style="margin-top:8px">Drinks aus Mahlzeiten:</div>';
            html += '<div class="hist-sep"></div>';
            mealDrinks.forEach(d => {
                totalMl += d.Menge;
                html += '<div class="hist-entry">';
                html += '<span class="hist-item">' + d.Zeit + '  ' + (d.Name || '') + '</span>';
                html += '<span class="hist-detail">' + Math.round(d.Menge) + ' ml</span>';
                html += '</div>';
            });
        }

        const pct = Math.round((totalMl / GOALS.aqua) * 100);
        html += '<div class="hist-header" style="margin-top:10px">TOTAL: ' + Math.round(totalMl) + ' / ' + GOALS.aqua + ' ml (' + pct + '%)</div>';
    }

    content.innerHTML = html;

    content.querySelectorAll('.hist-del[data-aqua]').forEach(btn => {
        btn.addEventListener('click', () => {
            const ei = parseInt(btn.dataset.aqua);
            const fullLog = loadAquaLog();
            const dayIndices = [];
            fullLog.forEach((e, i) => { if (e.Datum === historyDate) dayIndices.push(i); });
            if (ei < dayIndices.length) {
                fullLog.splice(dayIndices[ei], 1);
                saveAquaLog(fullLog);
                updateAquaTrack();
                refreshHistory();
                showToast('✓ Aqua-Eintrag geloescht');
            }
        });
    });
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
    const screenW = Math.min(window.innerWidth - 40, 500);
    const boxW = Math.round(screenW * 0.9);
    const boxH = Math.round(boxW * 0.45);

    html5QrCode.start(
        { facingMode: 'environment' },
        {
            fps: 15,
            qrbox: { width: boxW, height: boxH },
            formatsToSupport: [
                Html5QrcodeSupportedFormats.EAN_13,
                Html5QrcodeSupportedFormats.EAN_8
            ],
            experimentalFeatures: { useBarCodeDetectorIfSupported: true }
        },
        text => { stopBarcodeScanner(); onSuccess(text); },
        () => {}
    ).then(() => {
        // Hauptkamera + Zoom erzwingen (verhindert Makro-Modus auf iPhone 14 Pro)
        try {
            const video = document.querySelector('#scanner-reader video');
            if (video && video.srcObject) {
                const track = video.srcObject.getVideoTracks()[0];
                const caps = track.getCapabilities ? track.getCapabilities() : {};
                const constraints = {};
                // Aufloesung erhoehen
                if (caps.width && caps.width.max >= 1920) constraints.width = 1920;
                if (caps.height && caps.height.max >= 1080) constraints.height = 1080;
                if (Object.keys(constraints).length > 0) {
                    track.applyConstraints(constraints);
                }
                // Zoom + Autofocus via advanced
                const adv = {};
                if (caps.focusMode && caps.focusMode.includes('continuous')) {
                    adv.focusMode = 'continuous';
                }
                if (caps.zoom && caps.zoom.max >= 2.0) {
                    adv.zoom = 2.0;
                }
                if (Object.keys(adv).length > 0) {
                    track.applyConstraints({ advanced: [adv] });
                }
            }
        } catch(e) { /* nicht alle Kameras unterstuetzen das */ }
    }).catch(err => {
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
async function exportData(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const file = new File([json], filename, { type: 'text/plain' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({ files: [file], title: filename });
            return;
        } catch (e) {
            if (e.name === 'AbortError') return;
        }
    }
    const blob = new Blob([json], { type: 'application/json' });
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

    // --- Backup Reminder ---
    const lastExport = localStorage.getItem('kcal_last_export');
    if (lastExport) {
        const days = Math.floor((Date.now() - new Date(lastExport).getTime()) / 86400000);
        if (days >= 7) {
            showToast(`Backup ist ${days} Tage alt!`);
        }
    } else if (db.length > 0 || meals.length > 0) {
        showToast('Noch kein Backup gemacht!');
    }

    // --- Tab Navigation ---
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // --- Food Display: Edit & Clear ---
    $('fd-save').addEventListener('click', saveScanPreview);
    $('fd-unit').addEventListener('change', updateScanPreviewHeader);
    $('fd-favorit').addEventListener('click', () => {
        scanFavorit = !scanFavorit;
        $('fd-favorit').textContent = scanFavorit ? '⭐' : '☆';
    });
    $('fd-clear').addEventListener('click', () => {
        $('food-display').classList.add('hidden');
    });

    // --- AquaTrack Quick-Add ---
    $('aqua-wasser').addEventListener('click', () => addAquaEntry('Wasser', 750));
    $('aqua-water100').addEventListener('click', () => addAquaEntry('Wasser', 100));
    $('aqua-espresso').addEventListener('click', () => addAquaEntry('Espresso', 30));
    $('aqua-kaffee').addEventListener('click', () => addAquaEntry('Kaffee', 200));
    $('aqua-wasser-rm').addEventListener('click', () => removeAquaEntry('Wasser', 750));
    $('aqua-water100-rm').addEventListener('click', () => removeAquaEntry('Wasser', 100));
    $('aqua-espresso-rm').addEventListener('click', () => removeAquaEntry('Espresso', 30));
    $('aqua-kaffee-rm').addEventListener('click', () => removeAquaEntry('Kaffee', 200));
    updateAquaTrack();

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

        const food = {
            Lebensmittel: '', Einheit: 'g', Kategorie: 'Food', Gesamtmenge: null,
            Kcal: v.Kcal ?? 0, Fett: v.Fett ?? 0, Gesaettigt: v.Gesaettigt ?? 0,
            Kohlenhydrate: v.Kohlenhydrate ?? 0, Zucker: v.Zucker ?? 0,
            Eiweiss: v.Eiweiss ?? 0, Salz: v.Salz ?? 0, Ballaststoffe: v.Ballaststoffe ?? 0
        };
        showScanPreview(food);
        $('menu-status').textContent = `${count} Werte erkannt - Name eingeben und speichern.`;
    });

    // --- Manual Entry: Formular ein-/ausblenden ---
    $('menu-manual-entry').addEventListener('click', () => {
        const form = $('manual-entry-form');
        form.classList.toggle('hidden');
        if (!form.classList.contains('hidden')) {
            ['me-name','me-amount','me-kcal','me-fett','me-gesaettigt','me-kh','me-zucker','me-eiweiss','me-salz','me-ballaststoffe']
                .forEach(id => { if ($(id)) $(id).value = ''; });
            if ($('me-unit')) $('me-unit').value = 'g';
            if ($('me-search-results')) $('me-search-results').classList.add('hidden');
        }
    });

    $('me-search').addEventListener('click', async () => {
        const query = $('me-name') ? $('me-name').value.trim() : '';
        if (!query) return;
        const lokalResults = searchLokal(query);
        if (lokalResults.length > 0) { showMeSearchResults(lokalResults); return; }
        const resEl = $('me-search-results');
        if (resEl) { resEl.innerHTML = '<div class="sr-empty">Suche online...</div>'; resEl.classList.remove('hidden'); }
        const onlineResults = await searchOpenFoodFacts(query);
        showMeSearchResults(onlineResults);
    });
    $('me-name').addEventListener('keydown', async e => {
        if (e.key !== 'Enter') return;
        const query = $('me-name') ? $('me-name').value.trim() : '';
        if (!query) return;
        const lokalResults = searchLokal(query);
        if (lokalResults.length > 0) { showMeSearchResults(lokalResults); return; }
        const resEl = $('me-search-results');
        if (resEl) { resEl.innerHTML = '<div class="sr-empty">Suche online...</div>'; resEl.classList.remove('hidden'); }
        const onlineResults = await searchOpenFoodFacts(query);
        showMeSearchResults(onlineResults);
    });
    $('me-save').addEventListener('click', () => {
        const name = $('me-name').value.trim();
        if (!name) { $('menu-status').textContent = 'Bitte Produktname eingeben.'; return; }

        const meUnit = $('me-unit') ? $('me-unit').value : 'g';
        const meKat = meUnit === 'ml' ? 'Drinks' : meUnit === 'p' ? 'Portion' : meUnit === 'stk' ? 'Fruit' : 'Food';
        const food = {
            Lebensmittel: name, Einheit: meUnit, Kategorie: meKat,
            Kcal: parseNum($('me-kcal').value) || 0,
            Fett: parseNum($('me-fett').value) || 0,
            Gesaettigt: parseNum($('me-gesaettigt').value) || 0,
            Kohlenhydrate: parseNum($('me-kh').value) || 0,
            Zucker: parseNum($('me-zucker').value) || 0,
            Eiweiss: parseNum($('me-eiweiss').value) || 0,
            Salz: parseNum($('me-salz').value) || 0,
            Ballaststoffe: parseNum($('me-ballaststoffe').value) || 0
        };

        const exists = db.findIndex(d => d.Lebensmittel === food.Lebensmittel);
        if (exists >= 0) {
            db[exists] = food;
        } else {
            db.push(food);
        }
        saveDB();
        populateEditorFoodDropdown();
        populateMenuFoodDropdown();
        $('manual-entry-form').classList.add('hidden');
        $('menu-status').textContent = `'${name}' gespeichert. (${food.Kcal} kcal/100g)`;
        showToast('✓ ' + name + ' gespeichert');
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

    // --- Lust auf... Suche ---
    // Smart-Fallback: automatische Menu-Vorschlaege basierend auf Kategorie
    // Kein Fallback fuer: Fruit, Drinks, Snacks, Süsses, Dessert (macht keinen Sinn)
    function buildSmartPairing(query) {
        const q = query.toLowerCase();
        const item = db.find(d => d.Lebensmittel.toLowerCase().includes(q));
        if (!item) return null;

        const cat = item.Kategorie;
        const noFallback = ['Fruit', 'Drinks', 'Snacks', 'Süsses', 'Dessert'];
        if (noFallback.includes(cat)) return null;

        const items = [{ name: item.Lebensmittel, menge: item.Gesamtmenge || (item.Einheit === 'p' ? 1 : 150) }];

        if (cat === 'Meat' || cat === 'Misc' || cat === 'Fastfood' || cat === 'Portion') {
            // Fleisch/Fertigprodukt → Beilage + Gemuese
            const beilage = db.find(d => d.Kategorie === 'Beilagen' && d.Lebensmittel.includes('Reis'));
            const gemuese = db.filter(d => d.Kategorie === 'Gemüse' && d.Favorit).find(Boolean)
                         || db.find(d => d.Kategorie === 'Gemüse');
            if (beilage) items.push({ name: beilage.Lebensmittel, menge: 80 });
            if (gemuese) items.push({ name: gemuese.Lebensmittel, menge: 100 });
        } else if (cat === 'Beilagen') {
            // Beilage → Fleisch + Gemuese
            const fleisch = db.find(d => d.Kategorie === 'Meat' && d.Lebensmittel.includes('Poulet Brust'));
            const gemuese = db.filter(d => d.Kategorie === 'Gemüse' && d.Favorit).find(Boolean)
                         || db.find(d => d.Kategorie === 'Gemüse');
            if (fleisch) items.push({ name: fleisch.Lebensmittel, menge: 150 });
            if (gemuese) items.push({ name: gemuese.Lebensmittel, menge: 100 });
        } else if (cat === 'Gemüse') {
            // Gemuese → Fleisch + Beilage
            const fleisch = db.find(d => d.Kategorie === 'Meat' && d.Lebensmittel.includes('Poulet Brust'));
            const beilage = db.find(d => d.Kategorie === 'Beilagen' && d.Lebensmittel.includes('Reis'));
            if (fleisch) items.push({ name: fleisch.Lebensmittel, menge: 150 });
            if (beilage) items.push({ name: beilage.Lebensmittel, menge: 80 });
        } else if (cat === 'Dairy') {
            // Milchprodukt (Käse) → Beilage
            const beilage = db.find(d => d.Kategorie === 'Beilagen' && d.Lebensmittel.includes('Härdöpfel'));
            if (beilage) items.push({ name: beilage.Lebensmittel, menge: 200 });
        } else if (cat === 'Bread') {
            // Brot → Käse + Fleisch
            const kaese = db.find(d => d.Kategorie === 'Dairy' && d.Lebensmittel.includes('Gruyère'));
            const aufschnitt = db.find(d => d.Kategorie === 'Meat' && d.Lebensmittel.includes('Toastschinken'));
            if (kaese) items.push({ name: kaese.Lebensmittel, menge: 40 });
            if (aufschnitt) items.push({ name: aufschnitt.Lebensmittel, menge: 50 });
        }

        return items.length > 1 ? { keywords: [], items } : null;
    }

    function findMenuPairing(query) {
        const q = query.toLowerCase();
        // Zuerst: Keyword-Match (Hauptgericht)
        const byKeyword = MENU_PAIRINGS.find(p => p.keywords.some(kw => q.includes(kw) || kw.includes(q)));
        if (byKeyword) return byKeyword;
        // Dann: Item-Match (Beilage/Zutat) — sucht Pairings die dieses Produkt enthalten
        const byItem = MENU_PAIRINGS.find(p => p.items.some(it => it.name.toLowerCase().includes(q)));
        if (byItem) return byItem;
        // Fallback: Smart-Pairing basierend auf Kategorie
        return buildSmartPairing(q);
    }

    function resolvePairingItems(pairing) {
        return pairing.items.map(pi => {
            const dbItem = db.find(d => d.Lebensmittel === pi.name);
            if (!dbItem) return null;
            return {
                Lebensmittel: dbItem.Lebensmittel, Einheit: dbItem.Einheit, Menge: pi.menge,
                Kcal: dbItem.Kcal, Fett: dbItem.Fett, Gesaettigt: dbItem.Gesaettigt,
                Kohlenhydrate: dbItem.Kohlenhydrate, Zucker: dbItem.Zucker, Eiweiss: dbItem.Eiweiss,
                Salz: dbItem.Salz, Ballaststoffe: dbItem.Ballaststoffe
            };
        }).filter(Boolean);
    }

    function renderMenuSuggestion(pairing) {
        const sugBox = $('lust-suggestion');
        if (!sugBox) return;
        const resolved = resolvePairingItems(pairing);
        if (resolved.length === 0) { sugBox.classList.add('hidden'); sugBox.innerHTML = ''; return; }

        let totalKcal = 0;
        let html = '<div class="menu-suggestion">';
        html += '<div class="menu-suggestion-title">Menu-Vorschlag</div>';
        resolved.forEach(item => {
            const kcal = Math.round(item.Kcal * mengenFaktor(item.Einheit, item.Menge));
            totalKcal += kcal;
            html += `<div class="menu-suggestion-item">`;
            html += `<span>${item.Lebensmittel}</span>`;
            html += `<span>${item.Menge}${item.Einheit} · ${kcal} kcal</span>`;
            html += `</div>`;
        });
        html += `<div class="menu-suggestion-total">`;
        html += `<span>Total</span><span>${totalKcal} kcal</span></div>`;
        html += `<button id="lust-add-menu" class="menu-suggestion-add">Add Menu</button>`;
        html += '</div>';
        sugBox.innerHTML = html;
        sugBox.classList.remove('hidden');

        $('lust-add-menu').addEventListener('click', () => {
            resolved.forEach(item => menuList.push({ ...item }));
            refreshMenuList();
            $('menus-status').textContent = `Menu mit ${resolved.length} Positionen hinzugefuegt (${totalKcal} kcal).`;
            sugBox.classList.add('hidden');
            sugBox.innerHTML = '';
            showToast(`Menu hinzugefuegt (${totalKcal} kcal)`);
        });
    }

    function lustSearch() {
        const q = $('lust-input').value.trim().toLowerCase();
        const box = $('lust-results');
        const sugBox = $('lust-suggestion');
        if (!q) { box.classList.add('hidden'); box.innerHTML = ''; if (sugBox) { sugBox.classList.add('hidden'); sugBox.innerHTML = ''; } return; }

        // Menu-Pairing pruefen
        const pairing = findMenuPairing(q);
        if (pairing) {
            renderMenuSuggestion(pairing);
        } else if (sugBox) {
            sugBox.classList.add('hidden');
            sugBox.innerHTML = '';
        }

        // Einzelne Treffer weiterhin anzeigen
        const hits = db.filter(d => d.Lebensmittel.toLowerCase().includes(q));
        if (hits.length === 0 && !pairing) { box.classList.remove('hidden'); box.innerHTML = '<span style="font-size:12px;color:var(--subtext)">Nichts gefunden</span>'; return; }
        if (hits.length === 0) { box.classList.add('hidden'); box.innerHTML = ''; return; }
        box.classList.remove('hidden');
        box.innerHTML = '';
        hits.forEach(item => {
            const btn = document.createElement('button');
            btn.textContent = item.Lebensmittel;
            btn.style.cssText = 'font-size:12px;padding:4px 10px;border-radius:16px;background:var(--surface1);border:1px solid var(--border);color:var(--text);cursor:pointer';
            btn.addEventListener('click', () => {
                const amount = item.Gesamtmenge || 100;
                menuList.push({
                    Lebensmittel: item.Lebensmittel, Einheit: item.Einheit, Menge: amount,
                    Kcal: item.Kcal, Fett: item.Fett, Gesaettigt: item.Gesaettigt,
                    Kohlenhydrate: item.Kohlenhydrate, Zucker: item.Zucker, Eiweiss: item.Eiweiss,
                    Salz: item.Salz, Ballaststoffe: item.Ballaststoffe
                });
                refreshMenuList();
                $('menus-status').textContent = `'${item.Lebensmittel}' hinzugefuegt (${amount}${item.Einheit}).`;
            });
            box.appendChild(btn);
        });
    }
    $('lust-search-btn').addEventListener('click', lustSearch);
    $('lust-input').addEventListener('keydown', e => { if (e.key === 'Enter') lustSearch(); });
    $('lust-clear-btn').addEventListener('click', () => {
        $('lust-input').value = '';
        $('lust-clear-btn').classList.add('hidden');
        $('lust-results').classList.add('hidden'); $('lust-results').innerHTML = '';
        const sugBox = $('lust-suggestion'); if (sugBox) { sugBox.classList.add('hidden'); sugBox.innerHTML = ''; }
    });
    $('lust-input').addEventListener('input', () => {
        $('lust-clear-btn').classList.toggle('hidden', !$('lust-input').value);
    });

    // --- Menus Tab: Lebensmittel suchen ---
    $('menu-search-btn').addEventListener('click', () => populateMenuFoodDropdown($('menu-search').value));
    $('menu-search').addEventListener('keydown', e => { if (e.key === 'Enter') populateMenuFoodDropdown($('menu-search').value); });

    // --- Menus Tab: Aktionen ---
    $('menu-food-select').addEventListener('change', () => {
        const sel = $('menu-food-select');
        if (sel.selectedIndex < 0) return;
        const d = db[parseInt(sel.value)];
        if (d && d.Einheit === 'ml' && d.Gesamtmenge) {
            $('menu-amount').value = d.Gesamtmenge;
        } else {
            $('menu-amount').value = '';
        }
    });
    $('menu-add').addEventListener('click', menuAdd);
    if ($('menu-remove')) $('menu-remove').addEventListener('click', menuRemove);
    $('menu-clear').addEventListener('click', menuClear);
    $('menu-cancel').addEventListener('click', menuCancelEdit);
    $('menu-save-recipe').addEventListener('click', menuSaveRecipe);
    if ($('menu-log-zmorge')) $('menu-log-zmorge').addEventListener('click', () => logMenuBuilderAsMeal("z'Morge"));
    if ($('menu-log-zmittag')) $('menu-log-zmittag').addEventListener('click', () => logMenuBuilderAsMeal("z'Mittag"));
    if ($('menu-log-znacht')) $('menu-log-znacht').addEventListener('click', () => logMenuBuilderAsMeal("z'Nacht"));

    // --- Editor: Aktionen ---
    $('editor-search-btn').addEventListener('click', () => populateEditorFoodDropdown($('editor-search').value));
    $('editor-search').addEventListener('keydown', e => { if (e.key === 'Enter') populateEditorFoodDropdown($('editor-search').value); });

    $('editor-food-select').addEventListener('change', editorLoad);
    $('editor-food-select').addEventListener('click', editorLoad);
    $('editor-clear-search').addEventListener('click', () => { $('editor-search').value = ''; editorClear(); $('editor-food-select').innerHTML = ''; $('editor-status').textContent = ''; });
    $('editor-edit-food').addEventListener('click', () => {
        const sel = $('editor-food-select');
        const idx = parseInt(sel.value);
        const food = db[idx];
        if (!food) { $('editor-status').textContent = 'Bitte zuerst ein Lebensmittel auswaehlen.'; return; }
        showScanPreview(food);
        switchTab('menu');
    });
    $('editor-delete').addEventListener('click', editorDelete);
    $('editor-save').addEventListener('click', editorSave);
    $('editor-clear').addEventListener('click', editorClear);

    // --- Editor: Menge berechnen ---
    $('ed-amount').addEventListener('input', updateEditorCalc);

    // --- Mahlzeit-Buttons ---
    $('btn-zmorge').addEventListener('click', () => saveMealFromEditor("z'Morge"));
    $('btn-zmittag').addEventListener('click', () => saveMealFromEditor("z'Mittag"));
    $('btn-znacht').addEventListener('click', () => saveMealFromEditor("z'Nacht"));

    // --- Verlauf: Datum Navigation ---
    $('history-date').addEventListener('change', () => { historyDate = $('history-date').value; refreshHistory(); });
    $('history-prev').addEventListener('click', () => {
        const d = new Date(historyDate); d.setDate(d.getDate() - 1);
        historyDate = d.toISOString().slice(0, 10); refreshHistory();
    });
    $('history-next').addEventListener('click', () => {
        const d = new Date(historyDate); d.setDate(d.getDate() + 1);
        historyDate = d.toISOString().slice(0, 10); refreshHistory();
    });
    $('history-today').addEventListener('click', () => { historyDate = today(); refreshHistory(); });

    // --- Verlauf: Clear Buttons ---
    $('history-clear-day').addEventListener('click', () => {
        if (!confirm(`Alle Eintraege fuer ${historyDate} loeschen?`)) return;
        meals = meals.filter(m => m.Datum !== historyDate);
        saveMeals();
        const log = loadAquaLog().filter(e => e.Datum !== historyDate);
        saveAquaLog(log);
        updateDailyCircles();
        refreshHistory();
    });
    $('history-clear-all').addEventListener('click', () => {
        if (!confirm('Gesamte History (Mahlzeiten + AquaTrack) loeschen?')) return;
        meals = [];
        saveMeals();
        saveAquaLog([]);
        updateDailyCircles();
        refreshHistory();
    });

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
    // --- Full Data Import / Export ---
    $('export-all').addEventListener('click', () => {
        const allData = {
            datenbank: db,
            mahlzeiten: meals,
            vorlagen: templates,
            aqua: loadAquaLog()
        };
        exportData(allData, 'kcal_backup.json');
        localStorage.setItem('kcal_last_export', today());
        $('data-status').textContent = 'Backup exportiert (kcal_backup.json).';
    });
    $('import-all').addEventListener('click', () => $('import-all-file').click());
    $('import-all-file').addEventListener('change', e => {
        if (!e.target.files[0]) return;
        const reader = new FileReader();
        reader.onload = evt => {
            try {
                const all = JSON.parse(evt.target.result);
                if (all.datenbank) { db = all.datenbank; saveDB(); }
                if (all.mahlzeiten) { meals = all.mahlzeiten; saveMeals(); }
                if (all.vorlagen) { templates = all.vorlagen; saveTemplates(); }
                if (all.aqua) { saveAquaLog(all.aqua); }
                populateMenuFoodDropdown();
                populateEditorFoodDropdown();
                populateTemplateDropdown();
                updateDailyCircles();
                $('data-status').textContent = `Backup importiert: ${db.length} LM, ${meals.length} Mahlzeiten, ${templates.length} Menus.`;
            } catch {
                alert('Ungueltige Backup-Datei.');
            }
        };
        reader.readAsText(e.target.files[0]);
        e.target.value = '';
    });

    // --- Reset: Daten neu laden ---
    $('reset-reload').addEventListener('click', () => {
        if (!confirm('Lokale Daten loeschen und vom Server neu laden?')) return;
        localStorage.removeItem('kcal_db');
        localStorage.removeItem('kcal_meals');
        localStorage.removeItem('kcal_templates');
        localStorage.removeItem('kcal_aqua');
        localStorage.removeItem('kcal_basis_seeded');
        localStorage.removeItem('kcal_alarm');
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
