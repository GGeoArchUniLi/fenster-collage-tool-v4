import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';

// --- VOLLSTÄNDIGES WÖRTERBUCH (UNGEKÜRZT) ---
const LANGS = {
  "🇩🇪 DE": { title: "🧱 Facade AI Pro v9.0", search_h: "1. Globale Suche", c_land: "Land", c_zip: "PLZ / Ort", c_rad: "Umkreis (km)", reuse: "Gebraucht", new: "Neu", btn_search: "Echte Daten abrufen", cust_h: "2. Eigenbestand", w_lbl: "Breite", h_lbl: "Höhe", btn_add: "Hinzufügen", wall_h: "Wandöffnung (mm)", btn_suggest: "💡 Wand optimieren", btn_shuf: "🎲 Zufälliger Seed", btn_gaps: "✂️ Zuschnitt drehen", lock: "🔒 Gepinnte behalten", sym: "📐 Symmetrie", chaos: "Chaos", seed: "Seed-Regler", auto_rot: "🔄 Auto-Rotation erlauben", clust_num: "🏝️ Anzahl Cluster", clust_pin: "🧲 Um Gepinnte anordnen", mode_cluster: "🏝️ Organisch Clustern", mode_rect: "🧱 Rechteckig füllen", mode_scatter: "🌌 Zufällig verstreuen", wall_a: "Wandfläche", win_a: "Fensterfläche", fill: "Füllgrad", price: "Gesamtpreis", mat_h: "📋 Fenster Matrix", exp_csv: "📥 CSV", exp_cad: "📥 DXF", exp_img: "🖼️ Collage", exp_bw: "🖼️ S/W", exp_line: "🖼️ Linien", exp_zip: "📦 ZIP Komplett", gaps_h: "🟥 Zuschnitt-Liste", no_gaps: "Wand perfekt gefüllt!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Maße", a:"m²", src:"Herkunft", dist: "Distanz", pr:"Preis", l:"Link"}, all_windows: "📦 Inventar (Alle Fenster)", used_windows: "🏗️ Verwendete Fenster", fullscreen: "⛶ Vollbild" },
  "🇪🇸 ES": { title: "🧱 Generador Fachadas v9.0", search_h: "1. Búsqueda Global", c_land: "País", c_zip: "C.P. / Ciudad", c_rad: "Radio (km)", reuse: "Usado", new: "Nuevo", btn_search: "Obtener datos reales", cust_h: "2. Inventario Propio", w_lbl: "Ancho", h_lbl: "Alto", btn_add: "Añadir", wall_h: "Muro (mm)", btn_suggest: "💡 Optimizar Muro", btn_shuf: "🎲 Reagrupar (IA)", btn_gaps: "✂️ Rotar cortes", lock: "🔒 Bloquear Pines", sym: "📐 Simetría", chaos: "Caos", seed: "Semilla", auto_rot: "🔄 Auto-rotación", clust_num: "🏝️ Número de Clústeres", clust_pin: "🧲 Agrupar en torno a fijos", mode_cluster: "🏝️ Clúster Orgánico", mode_rect: "🧱 Relleno Rectangular", mode_scatter: "🌌 Dispersión Aleatoria", wall_a: "Área Muro", win_a: "Área Vent.", fill: "Relleno", price: "Precio Total", mat_h: "📋 Matriz de ventanas", exp_csv: "📥 CSV", exp_cad: "📥 DXF", exp_img: "🖼️ Collage", exp_bw: "🖼️ B/N", exp_line: "🖼️ Líneas", exp_zip: "📦 ZIP Completo", gaps_h: "🟥 Paneles de Relleno", no_gaps: "¡Muro perfecto!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dim", a:"m²", src:"Origen", dist: "Distancia", pr:"Precio", l:"Link"}, all_windows: "📦 Inventario (Todas)", used_windows: "🏗️ Ventanas Usadas", fullscreen: "⛶ Pantalla Completa" },
  "🇬🇧 EN": { title: "🧱 Facade AI Pro v9.0", search_h: "1. Global Search", c_land: "Country", c_zip: "ZIP / City", c_rad: "Radius (km)", reuse: "Used", new: "New", btn_search: "Fetch Real Data", cust_h: "2. Custom Inventory", w_lbl: "Width", h_lbl: "Height", btn_add: "Add", wall_h: "Wall Opening (mm)", btn_suggest: "💡 Optimize Wall", btn_shuf: "🎲 Random Seed", btn_gaps: "✂️ Toggle Gaps", lock: "🔒 Keep Pinned", sym: "📐 Symmetry", chaos: "Chaos", seed: "Seed Slider", auto_rot: "🔄 Allow Auto-Rotation", clust_num: "🏝️ Number of Clusters", clust_pin: "🧲 Cluster around Pinned", mode_cluster: "🏝️ Organic Cluster", mode_rect: "🧱 Rectangular Block", mode_scatter: "🌌 Random Scatter", wall_a: "Wall Area", win_a: "Window Area", fill: "Fill Rate", price: "Total Price", mat_h: "📋 Window Matrix", exp_csv: "📥 CSV", exp_cad: "📥 DXF", exp_img: "🖼️ Collage", exp_bw: "🖼️ B/W", exp_line: "🖼️ Lines", exp_zip: "📦 Full ZIP", gaps_h: "🟥 Gap Panels", no_gaps: "Perfectly filled!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dims", a:"m²", src:"Source", dist: "Distance", pr:"Price", l:"Link"}, all_windows: "📦 Inventory (All Windows)", used_windows: "🏗️ Used Windows", fullscreen: "⛶ Fullscreen" },
  "🇫🇷 FR": { title: "🧱 Générateur de Façade v9.0", search_h: "1. Recherche", c_land: "Pays", c_zip: "CP / Ville", c_rad: "Rayon (km)", reuse: "Usagé", new: "Neuf", btn_search: "Obtenir données", cust_h: "2. Inventaire", w_lbl: "Largeur", h_lbl: "Hauteur", btn_add: "Ajouter", wall_h: "Mur (mm)", btn_suggest: "💡 Optimiser le Mur", btn_shuf: "🎲 Graine Aléatoire", btn_gaps: "✂️ Alterner Trous", lock: "🔒 Garder Pins", sym: "📐 Symétrie", chaos: "Chaos", seed: "Graine", auto_rot: "🔄 Rotation Auto", clust_num: "🏝️ Nombre de Clústeres", clust_pin: "🧲 Grouper autour des fixés", mode_cluster: "🏝️ Grappe Organique", mode_rect: "🧱 Remplissage Rectangulaire", mode_scatter: "🌌 Dispersion Aléatoire", wall_a: "Surface Mur", win_a: "Surface Fen.", fill: "Remplissage", price: "Prix Total", mat_h: "📋 Matrice", exp_csv: "📥 CSV", exp_cad: "📥 DXF", exp_img: "🖼️ Collage", exp_bw: "🖼️ N/B", exp_line: "🖼️ Lignes", exp_zip: "📦 ZIP Complet", gaps_h: "🟥 Panneaux de coupe", no_gaps: "Mur parfait!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dim", a:"m²", src:"Source", dist: "Distance", pr:"Prix", l:"Lien"}, all_windows: "📦 Inventaire (Toutes)", used_windows: "🏗️ Fenêtres Utilisées", fullscreen: "⛶ Plein Écran" },
  "🇮🇹 IT": { title: "🧱 Generatore Facciate v9.0", search_h: "1. Ricerca Globale", c_land: "Paese", c_zip: "CAP / Città", c_rad: "Raggio (km)", reuse: "Usato", new: "Nuovo", btn_search: "Cerca Dati", cust_h: "2. Inventario Proprio", w_lbl: "Larghezza", h_lbl: "Altezza", btn_add: "Aggiungi", wall_h: "Muro (mm)", btn_suggest: "💡 Ottimizza Muro", btn_shuf: "🎲 Seme Casuale", btn_gaps: "✂️ Inverti Tagli", lock: "🔒 Mantieni Pin", sym: "📐 Simmetria", chaos: "Caos", seed: "Seme", auto_rot: "🔄 Rotazione Auto", clust_num: "🏝️ Numero di Cluster", clust_pin: "🧲 Raggruppa attorno ai fissati", mode_cluster: "🏝️ Cluster Organico", mode_rect: "🧱 Blocco Rettangolare", mode_scatter: "🌌 Dispersione Casuale", wall_a: "Area Muro", win_a: "Area Finestre", fill: "Riempimento", price: "Prezzo Totale", mat_h: "📋 Matrice Finestre", exp_csv: "📥 CSV", exp_cad: "📥 DXF", exp_img: "🖼️ Collage", exp_bw: "🖼️ B/N", exp_line: "🖼️ Linee", exp_zip: "📦 ZIP Completo", gaps_h: "🟥 Pannelli Necessari", no_gaps: "Muro perfetto!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dim", a:"m²", src:"Fonte", dist: "Distanza", pr:"Prezzo", l:"Link"}, all_windows: "📦 Inventario (Tutte)", used_windows: "🏗️ Finestre Usate", fullscreen: "⛶ Schermo Intero" },
  "🇨🇭 RM": { title: "🧱 Generatur Façadas v9.0", search_h: "1. Tschertga", c_land: "Pajais", c_zip: "PLZ / Lieu", c_rad: "Radius (km)", reuse: "Duvrà", new: "Nov", btn_search: "Tschertgar Datas", cust_h: "2. Inventari", w_lbl: "Ladezza", h_lbl: "Autezza", btn_add: "Agiuntar", wall_h: "Paraid (mm)", btn_suggest: "💡 Optimisar Paraid", btn_shuf: "🎲 Seed Casual", btn_gaps: "✂️ Midar Panels", lock: "🔒 Tegnair Fixà", sym: "📐 Simetria", chaos: "Caos", seed: "Seed", auto_rot: "🔄 Rotaziun Auto", clust_num: "🏝️ Dumber da Clusters", clust_pin: "🧲 Groupar enturn ils fixads", mode_cluster: "🏝️ Cluster Organic", mode_rect: "🧱 Bloc Rectangular", mode_scatter: "🌌 Strewiment Casual", wall_a: "Surfatscha Paraid", win_a: "Surfatscha Fanestra", fill: "Emplenida", price: "Pretsch Total", mat_h: "📋 Matrix da Fanestras", exp_csv: "📥 CSV", exp_cad: "📥 DXF", exp_img: "🖼️ Maletg", exp_bw: "🖼️ S/W", exp_line: "🖼️ Lingias", exp_zip: "📦 ZIP", gaps_h: "🟥 Panels Basegnaivels", no_gaps: "Paraid perfetg!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dim", a:"m²", src:"Funtauna", dist: "Distanza", pr:"Pretsch", l:"Link"}, all_windows: "📦 Inventari", used_windows: "🏗️ Fanestras duvradas", fullscreen: "⛶ Vollbild" },
  "🇧🇬 BG": { title: "🧱 Генератор на фасади v9.0", search_h: "1. Търсене", c_land: "Държава", c_zip: "ПК / Град", c_rad: "Радиус (км)", reuse: "Стари", new: "Нови", btn_search: "Търси реални данни", cust_h: "2. Инвентар", w_lbl: "Ширина", h_lbl: "Височина", btn_add: "Добави", wall_h: "Стена (мм)", btn_suggest: "💡 Оптимизирай Стена", btn_shuf: "🎲 Рандъм Сийд", btn_gaps: "✂️ Смени Панели", lock: "🔒 Запази Пин", sym: "📐 Симетрия", chaos: "Хаос", seed: "Сийд", auto_rot: "🔄 Авто-Ротация", clust_num: "🏝️ Брой Клъстери", clust_pin: "🧲 Групирай около фиксирани", mode_cluster: "🏝️ Органичен Клъстер", mode_rect: "🧱 Правоъгълен Блок", mode_scatter: "🌌 Случайно Разпръскване", wall_a: "Площ Стена", win_a: "Площ Прозорци", fill: "Запълване", price: "Обща Цена", mat_h: "📋 Матрица", exp_csv: "📥 CSV", exp_cad: "📥 DXF", exp_img: "🖼️ Колаж", exp_bw: "🖼️ Ч/Б", exp_line: "🖼️ Линии", exp_zip: "📦 ZIP", gaps_h: "🟥 Нужни Панели", no_gaps: "Идеално!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Размери", a:"m²", src:"Източник", dist: "Разстояние", pr:"Цена", l:"Линк"}, all_windows: "📦 Инвентар", used_windows: "🏗️ Използвани", fullscreen: "⛶ Цял Екран" },
  "🇮🇱 HE": { title: "🧱 מחולל חזיתות v9.0", search_h: "1. חיפוש גלובלי", c_land: "מדינה", c_zip: "מיקוד / עיר", c_rad: "רדיוס (ק״מ)", reuse: "משומש", new: "חדש", btn_search: "הבא נתונים אמיתיים", cust_h: "2. מלאי אישי", w_lbl: "רוחב", h_lbl: "גובה", btn_add: "הוסף", wall_h: "פתיחת קיר (מ״מ)", btn_suggest: "💡 יעל קיר", btn_shuf: "🎲 גרעין אקראי", btn_gaps: "✂️ החלף חיתוכים", lock: "🔒 שים נעוצים", sym: "📐 סימטריה", chaos: "כאוס", seed: "גרעין", auto_rot: "🔄 סיבוב אוטומטי", clust_num: "🏝️ מספר אשכולות", clust_pin: "🧲 קבץ סביב חלונות נעוצים", mode_cluster: "🏝️ אשכול אורגני", mode_rect: "🧱 בלוק מלבני", mode_scatter: "🌌 פיזור אקראי", wall_a: "שטח קיר", win_a: "שטח חלונות", fill: "אחוז מילוי", price: "מחיר כולל", mat_h: "📋 מטריצת חלונות", exp_csv: "📥 CSV", exp_cad: "📥 DXF", exp_img: "🖼️ קולאז׳", exp_bw: "🖼️ ש/ל", exp_line: "🖼️ קווים", exp_zip: "📦 ZIP מלא", gaps_h: "🟥 לוחות חיתוך", no_gaps: "הקיר מלא לחלוטין!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"מידות", a:"מ״ר", src:"מקור", dist: "מרחק", pr:"מחיר", l:"קישור"}, all_windows: "📦 כל החלונות", used_windows: "🏗️ חלונות בשימוש", fullscreen: "⛶ מסך מלא" },
  "🇯🇵 JA": { title: "🧱 ファサードAI Pro v9.0", search_h: "1. グローバル検索", c_land: "国", c_zip: "郵便番号 / 都市", c_rad: "半径 (km)", reuse: "中古", new: "新品", btn_search: "実データを取得", cust_h: "2. カスタム在庫", w_lbl: "幅", h_lbl: "高さ", btn_add: "追加", wall_h: "壁の開口部 (mm)", btn_suggest: "💡 壁を最適化", btn_shuf: "🎲 ランダムシード", btn_gaps: "✂️ パネルを切り替え", lock: "🔒 ピン留めを維持", sym: "📐 対称性", chaos: "カオス", seed: "シード", auto_rot: "🔄 自動回転を許可", clust_num: "🏝️ クラスター数", clust_pin: "🧲 ピン留めの周りにグループ化", mode_cluster: "🏝️ オーガニッククラスター", mode_rect: "🧱 長方形ブロック", mode_scatter: "🌌 ランダム分散", wall_a: "壁の面積", win_a: "窓の面積", fill: "充填率", price: "合計価格", mat_h: "📋 ウィンドウマトリックス", exp_csv: "📥 CSV", exp_cad: "📥 DXF", exp_img: "🖼️ コラージュ", exp_bw: "🖼️ 白黒", exp_line: "🖼️ 線画", exp_zip: "📦 完全なZIP", gaps_h: "🟥 必要なカットパネル", no_gaps: "壁は完全に埋まっています！", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"寸法", a:"m²", src:"ソース", dist: "距離", pr:"価格", l:"リンク"}, all_windows: "📦 全ての窓", used_windows: "🏗️ 使用中の窓", fullscreen: "⛶ フルスクリーン" }
};

const COUNTRIES = ["Deutschland", "Österreich", "Schweiz", "España", "France", "Italia", "United Kingdom", "USA"];

function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export default function App() {
  const [lang, setLang] = useState("🇩🇪 DE");
  const T = LANGS[lang] || LANGS["🇩🇪 DE"]; 

  const [searchParams, setSearch] = useState({ land: "Deutschland", zip: "10115", radius: 50, reuse: true, new: false });
  const [customWin, setCustomWin] = useState({ w: 1000, h: 1200 });

  const [wall, setWall] = useState({ w: 4000, h: 3000 });
  const [windows, setWindows] = useState([]);
  const [gaps, setGaps] = useState([]);
  const [counter, setCounter] = useState(1);
  
  const [params, setParams] = useState({ 
    symmetry: false, chaos: 10, lock: true, gapToggle: false, autoRot: false, 
    clusterCount: 1, clusterPinned: true, layoutMode: 'cluster' 
  });
  const [seed, setSeed] = useState(42);
  
  // DRAG & DROP & HIGHLIGHTS
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({x: 0, y: 0});
  const [selectedId, setSelectedId] = useState(null); // NEU: Bidirektionales Highlighting
  const canvasRef = useRef(null); 
  
  // UI TOGGLE STATES
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [topPaneHeight, setTopPaneHeight] = useState(55); // 0 = nur Matrix, 100 = nur Zeichnung
  
  const topPaneRef = useRef(null);
  const [paneSize, setPaneSize] = useState({ w: 800, h: 400 }); 

  // CHATBOT
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: '👋 Hallo! Ich bin deine intelligente Architekten-KI.' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // FULLSCREEN LOGIK
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.log(err));
        setIsFullscreen(true);
    } else {
        document.exitFullscreen();
        setIsFullscreen(false);
    }
  };

  // HIGHLIGHT SCROLL LOGIK
  const scrollToRow = (id) => {
    setTimeout(() => {
      const elAll = document.getElementById(`row-all-${id}`);
      const elUsed = document.getElementById(`row-used-${id}`);
      if (elAll) elAll.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (elUsed) elUsed.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  // OBSERVER FÜR CANVASSKALIERUNG
  useEffect(() => {
    if(!topPaneRef.current) return;
    const obs = new ResizeObserver(entries => {
      setPaneSize({ w: entries[0].contentRect.width, h: entries[0].contentRect.height });
    });
    obs.observe(topPaneRef.current);
    return () => obs.disconnect();
  }, [topPaneHeight, leftOpen, rightOpen]); // Auch auf Sidebar-Toggles reagieren

  const paddingOffset = 100;
  const mainScale = Math.min((paneSize.w * 0.45) / Math.max(wall.w, 1), Math.max(10, paneSize.h - paddingOffset) / Math.max(wall.h, 1));
  const subScale = Math.min((paneSize.w * 0.22) / Math.max(wall.w, 1), Math.max(10, paneSize.h - paddingOffset) / Math.max(wall.h, 1));
  
  const canvasH = wall.h * mainScale;
  const canvasW = wall.w * mainScale;

  useEffect(() => {
    let initial = [
      { id: "1", pos: "P1", w: 1200, h: 1400, x:0, y:0, price: 85, color: "#4682b4", source: "Lager", dist: 0, type: "Fenster", pinned: false, rotated: false, visible: true },
      { id: "2", pos: "P2", w: 2000, h: 2100, x:0, y:0, price: 350, color: "#add8e6", source: "Lager", dist: 0, type: "Fenster", pinned: false, rotated: false, visible: true },
      { id: "3", pos: "P3", w: 800, h: 600, x:0, y:0, price: 40, color: "#4682b4", source: "Lager", dist: 0, type: "Fenster", pinned: false, rotated: false, visible: true },
      { id: "4", pos: "P4", w: 1000, h: 1000, x:0, y:0, price: 50, color: "#add8e6", source: "Lager", dist: 0, type: "Fenster", pinned: false, rotated: false, visible: true },
      { id: "5", pos: "P5", w: 600, h: 800, x:0, y:0, price: 25, color: "#4682b4", source: "Lager", dist: 0, type: "Fenster", pinned: false, rotated: false, visible: true }
    ];
    setCounter(6);
    runAI(initial, wall, params, seed);
  }, []);

  useEffect(() => {
    if(chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleDividerDragStart = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleDividerDrag);
    document.addEventListener('mouseup', handleDividerDragEnd);
  };
  const handleDividerDrag = (e) => {
    const newHeight = (e.clientY / window.innerHeight) * 100;
    setTopPaneHeight(Math.max(0, Math.min(newHeight, 100))); 
  };
  const handleDividerDragEnd = () => {
    document.removeEventListener('mousemove', handleDividerDrag);
    document.removeEventListener('mouseup', handleDividerDragEnd);
  };

  const checkOverlap = (x, y, w, h, placedList, ignoreId = null) => {
    return placedList.some(p => {
        if(p.id === ignoreId) return false;
        return !(x + w <= p.x || x >= p.x + p.w || y + h <= p.y || y >= p.y + p.h);
    });
  };

  const calculateGapsExact = (wall_w, wall_h, placed, toggle_dir) => {
    let xs = Array.from(new Set([0, wall_w, ...placed.flatMap(p=>[p.x, p.x+p.w])])).sort((a,b)=>a-b);
    let ys = Array.from(new Set([0, wall_h, ...placed.flatMap(p=>[p.y, p.y+p.h])])).sort((a,b)=>a-b);
    let grid = Array(ys.length-1).fill().map(()=>Array(xs.length-1).fill(false));
    placed.forEach(p => {
      let x1 = xs.indexOf(p.x), x2 = xs.indexOf(p.x + p.w);
      let y1 = ys.indexOf(p.y), y2 = ys.indexOf(p.y + p.h);
      for(let r=y1; r<y2; r++) for(let c=x1; c<x2; c++) grid[r][c] = true;
    });

    let newGaps = [];
    for(let r=0; r<ys.length-1; r++) {
      for(let c=0; c<xs.length-1; c++) {
        if(!grid[r][c]) {
          let cw = 0, ch = 0, valid = true;
          if(toggle_dir) {
            while(r+ch < ys.length-1 && !grid[r+ch][c]) ch++;
            while(c+cw < xs.length-1 && valid) { for(let ir=r; ir<r+ch; ir++) if(grid[ir][c+cw]) valid=false; if(valid) cw++; }
          } else {
            while(c+cw < xs.length-1 && !grid[r][c+cw]) cw++;
            while(r+ch < ys.length-1 && valid) { for(let ic=c; ic<c+cw; ic++) if(grid[r+ch][ic]) valid=false; if(valid) ch++; }
          }
          for(let ir=r; ir<r+ch; ir++) for(let ic=c; ic<c+cw; ic++) grid[ir][ic] = true;
          newGaps.push({ id: Math.random().toString(), x: xs[c], y: ys[r], w: xs[c+cw]-xs[c], h: ys[r+ch]-ys[r] });
        }
      }
    }
    return newGaps;
  };

  const runAI = (winList, currentWall, currentParams, currentSeed) => {
    const rng = mulberry32(currentSeed);
    let placed = []; let fixed_x = [], fixed_y = [];
    
    winList.forEach(w => {
      if(!w.visible) return;
      if(w.pinned) {
        let eff_w = w.rotated ? w.h : w.w; let eff_h = w.rotated ? w.w : w.h;
        let tx = Math.max(0, Math.min(w.x || 0, currentWall.w - eff_w));
        let ty = Math.max(0, Math.min(w.y || 0, currentWall.h - eff_h));
        
        if(!checkOverlap(tx, ty, eff_w, eff_h, placed)) {
          placed.push({...w, x: tx, y: ty, w: eff_w, h: eff_h});
          fixed_x.push(tx + eff_w/2); fixed_y.push(ty + eff_h/2);
        } else {
          let bx=tx, by=ty, minDist=Infinity;
          for(let r=0; r<=currentWall.h-eff_h; r+=10) {
            for(let c=0; c<=currentWall.w-eff_w; c+=10) {
              if(!checkOverlap(c, r, eff_w, eff_h, placed)) {
                let d = Math.pow(c-tx,2)+Math.pow(r-ty,2);
                if(d < minDist) { minDist=d; bx=c; by=r; }
              }
            }
          }
          placed.push({...w, x: bx, y: by, w: eff_w, h: eff_h});
          fixed_x.push(bx + eff_w/2); fixed_y.push(by + eff_h/2);
        }
      }
    });

    let centers = [];
    if (currentParams.clusterPinned && fixed_x.length > 0) {
        for (let i = 0; i < fixed_x.length; i++) centers.push({ x: fixed_x[i], y: fixed_y[i] });
    } else {
        const cCount = currentParams.clusterCount || 1;
        for (let i = 0; i < cCount; i++) centers.push({ x: currentWall.w * ((i + 1) / (cCount + 1)), y: currentWall.h * 0.5 });
    }

    let unpinned = winList.filter(w => w.visible && !w.pinned);
    unpinned = unpinned.map(w => ({...w, _weight: (w.w*w.h) * (1 + (rng()-0.5)*(currentParams.chaos/50)) })).sort((a,b)=>b._weight - a._weight);
    let step = currentWall.w > 15000 ? 200 : 100;
    if(currentParams.layoutMode === 'rect') step = 50; 
    
    unpinned.forEach(w => {
      let bestPos = null, minScore = Infinity;
      let orientations = currentParams.autoRot ? [false, true] : [w.rotated];
      
      orientations.forEach(rot => {
          let eff_w = rot ? w.h : w.w; let eff_h = rot ? w.w : w.h;
          if (eff_w > currentWall.w || eff_h > currentWall.h) return; 
          
          for(let y=0; y<=currentWall.h - eff_h; y+=step) {
            for(let x=0; x<=currentWall.w - eff_w; x+=step) {
              if(!checkOverlap(x, y, eff_w, eff_h, placed)) {
                let score = 0;
                if (currentParams.layoutMode === 'scatter') {
                    score = rng(); 
                } else if (currentParams.layoutMode === 'rect') {
                    score = y * 100000 + x; 
                } else {
                    score = Math.min(...centers.map(c => Math.pow(x+eff_w/2 - c.x, 2) + Math.pow(y+eff_h/2 - c.y, 2)));
                    if(currentParams.symmetry) score += Math.min(Math.abs(x+eff_w/2 - centers[0].x), Math.abs(y+eff_h/2 - centers[0].y)) * 5000;
                }
                
                if(score < minScore) { minScore = score; bestPos = {...w, x:x, y:y, w:eff_w, h:eff_h, rotated: rot}; }
              }
            }
          }
      });
      if(bestPos) placed.push(bestPos);
    });

    if(placed.length > 0 && fixed_x.length === 0 && currentParams.layoutMode !== 'scatter' && (!currentParams.clusterCount || currentParams.clusterCount === 1)) {
      let minX = Math.min(...placed.map(p=>p.x)), maxX = Math.max(...placed.map(p=>p.x+p.w));
      let minY = Math.min(...placed.map(p=>p.y)), maxY = Math.max(...placed.map(p=>p.y+p.h));
      let sx = Math.floor((currentWall.w - (maxX - minX)) / 2) - minX;
      let sy = Math.floor((currentWall.h - (maxY - minY)) / 2) - minY;
      placed = placed.map(p => ({...p, x: p.x+sx, y: p.y+sy}));
    }

    setGaps(calculateGapsExact(currentWall.w, currentWall.h, placed, currentParams.gapToggle));
    setWindows(winList.map(w => {
      let p = placed.find(pl => pl.id === w.id);
      if(p) return {...w, x: p.x, y: p.y, rotated: p.rotated}; 
      return w;
    }));
  };

  const optimizeWall = () => {
    let placed = windows.filter(w => w.visible);
    if(placed.length === 0) return;
    let minX = Math.min(...placed.map(w => w.x));
    let minY = Math.min(...placed.map(w => w.y));
    let maxX = Math.max(...placed.map(w => w.x + (w.rotated ? w.h : w.w)));
    let maxY = Math.max(...placed.map(w => w.y + (w.rotated ? w.w : w.h)));
    let newW = maxX - minX; let newH = maxY - minY;
    if(newW <= 0 || newH <= 0) return;

    let updatedWins = windows.map(w => {
        if(!w.visible) return w;
        return {...w, x: w.x - minX, y: w.y - minY, pinned: true};
    });
    setWall({w: newW, h: newH});
    setWindows(updatedWins);
    runAI(updatedWins, {w: newW, h: newH}, params, seed);
  };

  const performSearch = async () => {
    setChatMessages(prev => [...prev, { role: 'bot', text: 'Suchen im Internet nach echten Fenstern... Bitte warten.' }]);
    try {
      const q = new URLSearchParams(searchParams).toString();
      const res = await fetch(`/api/search?${q}`);
      const data = await res.json();
      
      if(data.results && data.results.length > 0) {
        let c = counter;
        let mappedResults = data.results.map(r => ({
          ...r, pos: `P${c++}`, pinned: false, rotated: false, visible: true
        }));
        setCounter(c);
        runAI([...windows, ...mappedResults], wall, params, seed);
        setChatMessages(prev => [...prev, { role: 'bot', text: `Erfolg! Ich habe ${data.results.length} reale Fenster gefunden und importiert.` }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'bot', text: 'Leider keine passenden Fenster gefunden.' }]);
      }
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'bot', text: 'Netzwerkfehler beim Abrufen der Webdaten.' }]);
    }
  };

  const addCustom = () => {
    const nw = { id: Math.random().toString(), pos: `P${counter}`, w: customWin.w, h: customWin.h, x:0, y:0, price: 0, color: "#90EE90", source: "Eigen", dist: 0, type: "Fenster", pinned: false, rotated: false, visible: true, force: true };
    setCounter(counter+1);
    runAI([...windows, nw], wall, params, seed);
  };

  const toggleAll = (prop) => {
      const allTrue = windows.every(w => w[prop]);
      const updated = windows.map(w => ({ ...w, [prop]: !allTrue, pinned: prop === 'rotated' ? true : w.pinned }));
      setWindows(updated); runAI(updated, wall, params, seed);
  };

  const toggleWinProp = (id, prop) => {
    const updated = windows.map(w => w.id === id ? {...w, [prop]: !w[prop]} : w);
    runAI(updated, wall, params, seed);
  };

  const toggleRotate = (id) => {
    const updated = windows.map(w => w.id === id ? {...w, rotated: !w.rotated, pinned: true} : w);
    setWindows(updated); runAI(updated, wall, params, seed);
  };

  const getCsvString = () => {
    let r = [ ["ID", "Typ", "Breite", "Hoehe", "m2", "Preis", "Distanz(km)", "Herkunft"] ];
    windows.filter(w=>w.visible).forEach(w => r.push([w.pos, w.type, w.w, w.h, ((w.w*w.h)/1000000).toFixed(2), w.price.toFixed(2), w.dist, w.source]));
    gaps.forEach((g,i) => r.push([`Gap-${i+1}`, "Zuschnitt", g.w, g.h, ((g.w*g.h)/1000000).toFixed(2), "0", "0", "Holz/Metall"]));
    return "data:text/csv;charset=utf-8," + r.map(e => e.join(",")).join("\n");
  };

  const getDxfString = () => {
    let dxf = "0\nSECTION\n2\nENTITIES\n";
    const addRect = (x, y, w, h, color) => `0\nLWPOLYLINE\n8\n0\n62\n${color}\n90\n4\n70\n1\n43\n0\n10\n${x}\n20\n${y}\n10\n${x+w}\n20\n${y}\n10\n${x+w}\n20\n${y+h}\n10\n${x}\n20\n${y+h}\n`;
    dxf += addRect(0, 0, wall.w, wall.h, 1); 
    gaps.forEach(g => dxf += addRect(g.x, g.y, g.w, g.h, 1)); 
    windows.filter(w=>w.visible).forEach(w => {
        let dw = w.rotated ? w.h : w.w; let dh = w.rotated ? w.w : w.h;
        dxf += addRect(w.x, w.y, dw, dh, 7); 
    });
    dxf += "0\nENDSEC\n0\nEOF\n";
    return dxf;
  };

  const drawMainCanvas = () => {
    const cvs = document.createElement("canvas"); cvs.width = wall.w; cvs.height = wall.h; const ctx = cvs.getContext("2d");
    ctx.fillStyle = "#fce4e4"; ctx.fillRect(0,0, wall.w, wall.h);
    ctx.fillStyle = "rgba(255, 75, 75, 0.4)"; ctx.strokeStyle = "#FF4B4B"; ctx.lineWidth = 15;
    gaps.forEach(g => { ctx.fillRect(g.x, wall.h - g.y - g.h, g.w, g.h); ctx.strokeRect(g.x, wall.h - g.y - g.h, g.w, g.h); });
    windows.filter(w=>w.visible).forEach(w => {
        let dw = w.rotated ? w.h : w.w; let dh = w.rotated ? w.w : w.h;
        ctx.fillStyle = w.color; ctx.fillRect(w.x, wall.h - w.y - dh, dw, dh);
        ctx.strokeStyle = w.pinned ? "#111" : "#555"; ctx.lineWidth = w.pinned ? 30 : 15;
        ctx.strokeRect(w.x, wall.h - w.y - dh, dw, dh);
    });
    return cvs;
  };

  const drawBWCanvas = () => {
    const cvs = document.createElement("canvas"); cvs.width = wall.w; cvs.height = wall.h; const ctx = cvs.getContext("2d");
    ctx.fillStyle = "white"; ctx.fillRect(0,0, wall.w, wall.h);
    ctx.fillStyle = "black"; gaps.forEach(g => { ctx.fillRect(g.x, wall.h - g.y - g.h, g.w, g.h); });
    windows.filter(w=>w.visible).forEach(w => {
        let dw = w.rotated ? w.h : w.w; let dh = w.rotated ? w.w : w.h;
        ctx.fillStyle = "white"; ctx.fillRect(w.x, wall.h - w.y - dh, dw, dh);
        ctx.strokeStyle = "#ccc"; ctx.lineWidth = 10; ctx.strokeRect(w.x, wall.h - w.y - dh, dw, dh);
    });
    return cvs;
  };

  const drawLineCanvas = () => {
    const cvs = document.createElement("canvas"); cvs.width = wall.w; cvs.height = wall.h; const ctx = cvs.getContext("2d");
    ctx.fillStyle = "white"; ctx.fillRect(0,0, wall.w, wall.h);
    ctx.strokeStyle = "#ccc"; ctx.lineWidth = 5; gaps.forEach(g => { ctx.strokeRect(g.x, wall.h - g.y - g.h, g.w, g.h); });
    windows.filter(w=>w.visible).forEach(w => {
        let dw = w.rotated ? w.h : w.w; let dh = w.rotated ? w.w : w.h;
        ctx.strokeStyle = "#333"; ctx.lineWidth = 15; ctx.strokeRect(w.x, wall.h - w.y - dh, dw, dh);
    });
    return cvs;
  };

  const downloadCanvas = (canvasFunc, filename) => {
    const link = document.createElement("a"); link.download = filename; link.href = canvasFunc().toDataURL("image/png"); link.click();
  };

  const exportCSV = () => {
    const csv = getCsvString();
    const link = document.createElement("a");
    link.href = encodeURI(csv); link.download = "stueckliste.csv";
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const exportDXF = () => {
    const dxf = getDxfString();
    const link = document.createElement("a");
    link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(dxf); link.download = "facade_export.dxf";
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const getCanvasBlob = (canvas) => new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

  const exportZIP = async () => {
    const zip = new JSZip();
    zip.file("stueckliste.csv", getCsvString().replace("data:text/csv;charset=utf-8,", ""));
    zip.file("facade_export.dxf", getDxfString());
    zip.file("01_collage.png", await getCanvasBlob(drawMainCanvas()));
    zip.file("02_verschnitt_bw.png", await getCanvasBlob(drawBWCanvas()));
    zip.file("03_cad_linien.png", await getCanvasBlob(drawLineCanvas()));
    const content = await zip.generateAsync({type: "blob"});
    const link = document.createElement("a"); link.href = URL.createObjectURL(content); link.download = "facade_project.zip"; link.click();
  };

  // --- DRAG & HIGHLIGHT LOGIK ---
  const handleWindowPointerDown = (e, w) => {
    e.stopPropagation(); // Verhindert Klick ins Leere
    setSelectedId(w.id);
    scrollToRow(w.id);
    if(w.pinned || e.target.tagName === 'BUTTON') return;
    const rect = e.target.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDraggingId(w.id);
  };

  const onDrag = (e) => {
    if(!draggingId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    let px_x = (e.clientX - rect.left) - dragOffset.x;
    let px_y = (e.clientY - rect.top) - dragOffset.y;
    let target_w = windows.find(w=>w.id===draggingId);
    let eff_h = target_w.rotated ? target_w.w : target_w.h;
    let eff_w = target_w.rotated ? target_w.h : target_w.w;
    let mmX = Math.round(px_x / mainScale); mmX = Math.max(0, Math.min(mmX, wall.w - eff_w));
    let mmY = Math.round((canvasH - px_y - (eff_h*mainScale)) / mainScale); mmY = Math.max(0, Math.min(mmY, wall.h - eff_h));
    setWindows(windows.map(w => w.id === draggingId ? {...w, x: mmX, y: mmY} : w));
  };

  const stopDrag = () => {
    if(draggingId) {
      const updated = windows.map(w => w.id === draggingId ? {...w, pinned: true} : w);
      setDraggingId(null); runAI(updated, wall, params, seed);
    }
  };

  const handleWallChange = (key, val) => {
    const newWall = {...wall, [key]: val || 0};
    setWall(newWall); runAI(windows, newWall, params, seed);
  };

  const totalPrice = windows.filter(w=>w.visible).reduce((s,w)=>s+w.price, 0);
  const winArea = windows.filter(w=>w.visible).reduce((s,w)=>s+(w.w*w.h), 0) / 1000000;
  const wallArea = (wall.w*wall.h) / 1000000;
  const fillRate = wallArea ? (winArea/wallArea)*100 : 0;

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if(!chatInput.trim() || chatLoading) return;
    const userText = chatInput;
    const newMsgs = [...chatMessages, { role: 'user', text: userText }];
    setChatMessages(newMsgs); setChatInput(""); setChatLoading(true);

    const systemContext = `Du bist ein Architektur-KI-Assistent für das "Facade AI Pro" Tool. 
    Hier sind die Live-Daten des Nutzers:
    - Wandgröße: ${wall.w}mm x ${wall.h}mm (${wallArea.toFixed(2)} m²)
    - Aktive Fenster: ${windows.filter(w=>w.visible).length} Stück
    - Verschnitt (Rote Gaps): ${(wallArea - winArea).toFixed(2)} m²
    - Füllgrad der Wand: ${fillRate.toFixed(1)}%
    - Gesamtpreis der Fenster: ${totalPrice.toFixed(2)} €
    
    Regeln: Antworte extrem kurz, professionell, auf Deutsch, und beziehe dich auf die obigen Daten.`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs, context: systemContext })
      });
      const data = await res.json();
      setChatMessages([...newMsgs, { role: 'bot', text: data.reply }]);
    } catch(err) {
      setChatMessages([...newMsgs, { role: 'bot', text: "Fehler: OpenAI API nicht erreichbar." }]);
    }
    setChatLoading(false);
  };

  const archSVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 600'><path d='M98,5 C84,5 72,17 72,31 C72,45 84,57 98,57 C112,57 124,45 124,31 C124,17 112,5 98,5 Z M78,65 C55,65 42,75 42,95 L42,280 C42,295 55,300 65,280 L75,190 L85,190 L85,580 C85,595 105,595 105,580 L105,350 L115,350 L115,580 C115,595 135,595 135,580 L135,190 L145,190 L155,280 C165,300 178,295 178,280 L178,95 C178,75 165,65 142,65 L78,65 Z' fill='%23222'/></svg>`;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "sans-serif", backgroundColor: "#f0f2f6", color:"#222" }}>
      
      {/* =======================
          LINKE SIDEBAR (STEUERUNG)
      ======================= */}
      <div style={{ width: leftOpen ? "350px" : "0px", background: "#fff", borderRight: leftOpen ? "1px solid #ddd" : "none", overflowY: "auto", overflowX: "hidden", transition: "0.3s", flexShrink: 0, position: "relative" }}>
        <div style={{ width: "350px", padding: "20px" }}> {/* Inner Wrapper um Umbruch zu verhindern */}
          <div style={{display:"flex", gap:"5px", flexWrap:"wrap", marginBottom:"15px"}}>
            {Object.keys(LANGS).map(l => (
              <button key={l} onClick={()=>setLang(l)} style={{background: lang===l ? "#222":"#eee", color: lang===l ? "#fff":"#333", border:"none", padding:"4px 8px", borderRadius:"4px", cursor:"pointer", fontSize:"11px", fontWeight:"bold"}}>{l.split(" ")[0]}</button>
            ))}
          </div>
          <h2 style={{fontSize:"18px", marginTop:0, color:"#111"}}>{T.title}</h2>

          <div style={{background:"#f8f9fa", padding:"15px", borderRadius:"6px", marginBottom:"15px", border:"1px solid #e9ecef"}}>
            <h4 style={{margin:"0 0 10px 0"}}>{T.search_h}</h4>
            <select value={searchParams.land} onChange={e=>setSearch({...searchParams, land:e.target.value})} style={{width:"100%", padding:"8px", marginBottom:"5px", border:"1px solid #ccc", borderRadius:"4px"}}>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
            <input placeholder={T.c_zip} value={searchParams.zip} onChange={e=>setSearch({...searchParams, zip:e.target.value})} style={{width:"100%", padding:"8px", marginBottom:"10px", border:"1px solid #ccc", borderRadius:"4px"}}/>
            <label style={{fontSize:"11px", display:"block", color:"#555"}}>{T.c_rad}: {searchParams.radius} km</label>
            <input type="range" min="10" max="500" step="10" value={searchParams.radius} onChange={e=>setSearch({...searchParams, radius:parseInt(e.target.value)})} style={{width:"100%", marginBottom:"10px"}}/>
            <div style={{display:"flex", gap:"10px", fontSize:"12px", margin:"10px 0"}}>
              <label><input type="checkbox" checked={searchParams.reuse} onChange={e=>setSearch({...searchParams, reuse:e.target.checked})}/> {T.reuse}</label>
              <label><input type="checkbox" checked={searchParams.new} onChange={e=>setSearch({...searchParams, new:e.target.checked})}/> {T.new}</label>
            </div>
            <button onClick={performSearch} style={{width:"100%", padding:"10px", background:"#FF4B4B", color:"white", border:"none", borderRadius:"4px", cursor:"pointer", fontWeight:"bold"}}>{T.btn_search}</button>
          </div>

          <div style={{background:"#f8f9fa", padding:"15px", borderRadius:"6px", marginBottom:"15px", border:"1px solid #e9ecef"}}>
            <h4 style={{margin:"0 0 10px 0"}}>{T.cust_h}</h4>
            <div style={{display:"flex", gap:"10px", marginBottom:"10px"}}>
              <div><label style={{fontSize:"11px", fontWeight:"bold"}}>{T.w_lbl}</label><input type="number" value={customWin.w} onChange={e=>setCustomWin({...customWin, w:parseInt(e.target.value)})} style={{width:"100%", padding:"6px", border:"1px solid #ccc", borderRadius:"4px"}}/></div>
              <div><label style={{fontSize:"11px", fontWeight:"bold"}}>{T.h_lbl}</label><input type="number" value={customWin.h} onChange={e=>setCustomWin({...customWin, h:parseInt(e.target.value)})} style={{width:"100%", padding:"6px", border:"1px solid #ccc", borderRadius:"4px"}}/></div>
            </div>
            <button onClick={addCustom} style={{width:"100%", padding:"8px", background:"white", border:"1px solid #ccc", borderRadius:"4px", cursor:"pointer", fontWeight:"bold"}}>{T.btn_add}</button>
          </div>

          <div style={{background:"#f8f9fa", padding:"15px", borderRadius:"6px", border:"1px solid #e9ecef"}}>
            <h4 style={{margin:"0 0 10px 0"}}>{T.wall_h}</h4>
            <div style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"5px"}}>
              <input type="range" min="1000" max="30000" step="100" value={wall.w} onChange={e=>handleWallChange('w', parseInt(e.target.value))} style={{flex:1}}/>
              <input type="number" value={wall.w} onChange={e=>handleWallChange('w', parseInt(e.target.value))} style={{width:"70px", padding:"4px", border:"1px solid #ccc", borderRadius:"4px"}}/>
            </div>
            <div style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"15px"}}>
              <input type="range" min="1000" max="30000" step="100" value={wall.h} onChange={e=>handleWallChange('h', parseInt(e.target.value))} style={{flex:1}}/>
              <input type="number" value={wall.h} onChange={e=>handleWallChange('h', parseInt(e.target.value))} style={{width:"70px", padding:"4px", border:"1px solid #ccc", borderRadius:"4px"}}/>
            </div>

            <button onClick={optimizeWall} style={{width:"100%", padding:"10px", background:"#e3f2fd", color:"#0056b3", border:"1px solid #b6d4fe", borderRadius:"4px", cursor:"pointer", fontWeight:"bold", marginBottom:"15px"}}>{T.btn_suggest}</button>

            <div style={{background:"white", padding:"10px", borderRadius:"4px", border:"1px solid #ddd", marginBottom:"15px"}}>
              <h5 style={{margin:"0 0 8px 0", fontSize:"12px", color:"#333"}}>Layout-Modus:</h5>
              <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"4px"}}><input type="checkbox" checked={params.layoutMode==='cluster'} onChange={()=>{setParams({...params, layoutMode:'cluster'}); runAI(windows, wall, {...params, layoutMode:'cluster'}, seed);}}/> {T.mode_cluster}</label>
              <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"4px"}}><input type="checkbox" checked={params.layoutMode==='rect'} onChange={()=>{setParams({...params, layoutMode:'rect'}); runAI(windows, wall, {...params, layoutMode:'rect'}, seed);}}/> {T.mode_rect}</label>
              <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"10px"}}><input type="checkbox" checked={params.layoutMode==='scatter'} onChange={()=>{setParams({...params, layoutMode:'scatter'}); runAI(windows, wall, {...params, layoutMode:'scatter'}, seed);}}/> {T.mode_scatter}</label>
              <hr style={{border:"none", borderTop:"1px solid #eee"}}/>

              <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"5px"}}><input type="checkbox" checked={params.autoRot} onChange={e=>{let p={...params, autoRot:e.target.checked}; setParams(p); runAI(windows, wall, p, seed);}}/> {T.auto_rot}</label>
              <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"5px"}}>{T.clust_num}: <input type="number" min="1" max="10" value={params.clusterCount} onChange={e=>{let p={...params, clusterCount:parseInt(e.target.value)||1}; setParams(p); runAI(windows, wall, p, seed);}} style={{width:"50px", padding:"2px", marginLeft:"auto"}}/></label>
              <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"5px"}}><input type="checkbox" checked={params.clusterPinned} onChange={e=>{let p={...params, clusterPinned:e.target.checked}; setParams(p); runAI(windows, wall, p, seed);}}/> {T.clust_pin}</label>
              <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"5px"}}><input type="checkbox" checked={params.lock} onChange={e=>{let p={...params, lock:e.target.checked}; setParams(p); runAI(windows, wall, p, seed);}}/> {T.lock}</label>
              <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"10px"}}><input type="checkbox" checked={params.symmetry} onChange={e=>{let p={...params, symmetry:e.target.checked}; setParams(p); runAI(windows, wall, p, seed);}}/> {T.sym}</label>
              
              <label style={{fontSize:"11px", display:"block", color:"#555"}}>{T.seed}: {seed}</label>
              <input type="range" min="1" max="1000" value={seed} onChange={e=>{const val=parseInt(e.target.value); setSeed(val); runAI(windows, wall, params, val);}} style={{width:"100%", marginBottom:"5px"}}/>
              <label style={{fontSize:"11px", display:"block", color:"#555", marginTop:"5px"}}>{T.chaos}: {params.chaos}%</label>
              <input type="range" min="0" max="100" value={params.chaos} onChange={e=>{const val=parseInt(e.target.value); setParams({...params, chaos:val}); runAI(windows, wall, {...params, chaos:val}, seed);}} style={{width:"100%", marginBottom:"5px"}}/>
            </div>

            <button onClick={()=>{let newSeed = Math.floor(Math.random()*1000); setSeed(newSeed); runAI(windows, wall, params, newSeed);}} style={{width:"100%", padding:"10px", background:"#222", color:"white", border:"none", borderRadius:"4px", cursor:"pointer", fontWeight:"bold", marginBottom:"5px"}}>{T.btn_shuf}</button>
            <button onClick={()=>{let p={...params, gapToggle:!params.gapToggle}; setParams(p); runAI(windows, wall, p, seed);}} style={{width:"100%", padding:"10px", background:"white", color:"#333", border:"1px solid #ccc", borderRadius:"4px", cursor:"pointer", fontWeight:"bold"}}>{T.btn_gaps}</button>
          </div>
        </div>
      </div>

      {/* =======================
          HAUPT BEREICH (MITTE)
      ======================= */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#eef1f5", position: "relative" }}>
        
        {/* Toggle Buttons Floating in Main Area */}
        <button onClick={()=>setLeftOpen(!leftOpen)} style={{position:"absolute", left:10, top:10, zIndex:100, background:"#222", color:"white", border:"none", borderRadius:"4px", width:"30px", height:"30px", cursor:"pointer", boxShadow:"0 2px 5px rgba(0,0,0,0.2)"}}>
          {leftOpen ? "◀" : "▶"}
        </button>
        <button onClick={()=>setRightOpen(!rightOpen)} style={{position:"absolute", right:10, top:10, zIndex:100, background:"#222", color:"white", border:"none", borderRadius:"4px", width:"30px", height:"30px", cursor:"pointer", boxShadow:"0 2px 5px rgba(0,0,0,0.2)"}}>
          {rightOpen ? "▶" : "◀"}
        </button>

        {/* === OBERE HÄLFTE: ZEICHNUNGEN === */}
        <div style={{ height: `${topPaneHeight}%`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          
          <div style={{ display: "flex", gap: "15px", padding: "10px 50px", background: "white", borderBottom: "1px solid #ddd", flexShrink: 0, alignItems:"center" }}>
            <div style={{flex:1, borderRight:"1px solid #eee"}}><div style={{fontSize:"11px", color:"#777", fontWeight:"bold"}}>{T.wall_a}</div><div style={{fontSize:"16px", fontWeight:"bold", color:"#222"}}>{wallArea.toFixed(2)} m²</div></div>
            <div style={{flex:1, borderRight:"1px solid #eee"}}><div style={{fontSize:"11px", color:"#777", fontWeight:"bold"}}>{T.win_a}</div><div style={{fontSize:"16px", fontWeight:"bold", color:"#222"}}>{winArea.toFixed(2)} m²</div></div>
            <div style={{flex:1, borderRight:"1px solid #eee"}}><div style={{fontSize:"11px", color:"#777", fontWeight:"bold"}}>{T.fill}</div><div style={{fontSize:"16px", fontWeight:"bold", color:"#222"}}>{fillRate.toFixed(1)} %</div></div>
            <div style={{flex:1}}><div style={{fontSize:"11px", color:"#FF4B4B", fontWeight:"bold"}}>{T.price}</div><div style={{fontSize:"16px", fontWeight:"bold", color:"#FF4B4B"}}>{totalPrice.toFixed(2)} €</div></div>
            
            <div style={{display:"flex", gap:"5px", alignItems:"center"}}>
               <button onClick={toggleFullscreen} style={{padding:"6px 10px", background:"#333", color:"white", border:"none", borderRadius:"4px", cursor:"pointer", fontSize:"11px", fontWeight:"bold"}}>{T.fullscreen}</button>
               <button onClick={()=>downloadCanvas(drawMainCanvas, "facade_collage.png")} style={{padding:"6px 10px", background:"#fff", border:"1px solid #ccc", borderRadius:"4px", cursor:"pointer", fontSize:"11px"}}>{T.exp_img}</button>
               <button onClick={()=>downloadCanvas(drawBWCanvas, "facade_sw.png")} style={{padding:"6px 10px", background:"#fff", border:"1px solid #ccc", borderRadius:"4px", cursor:"pointer", fontSize:"11px"}}>{T.exp_bw}</button>
               <button onClick={()=>downloadCanvas(drawLineCanvas, "facade_cad.png")} style={{padding:"6px 10px", background:"#fff", border:"1px solid #ccc", borderRadius:"4px", cursor:"pointer", fontSize:"11px"}}>{T.exp_line}</button>
               <button onClick={exportDXF} style={{padding:"6px 10px", background:"#e3f2fd", border:"1px solid #0056b3", color:"#0056b3", borderRadius:"4px", cursor:"pointer", fontWeight:"bold", fontSize:"11px"}}>{T.exp_cad}</button>
               <button onClick={exportZIP} style={{padding:"6px 10px", background:"#28a745", border:"none", color:"white", borderRadius:"4px", cursor:"pointer", fontWeight:"bold", fontSize:"11px"}}>{T.exp_zip}</button>
            </div>
          </div>

          <div ref={topPaneRef} onClick={() => setSelectedId(null)} style={{ flex: 1, padding: "15px", display: "flex", gap: "25px", alignItems: "center", justifyContent:"flex-start", overflow:"hidden", background:"#eef1f5" }}>
            
            <div style={{display: "flex", alignItems: "flex-end"}}>
              <div style={{ width: Math.max(15, 300 * mainScale), height: 1780 * mainScale, marginRight: "10px", background: `url("${archSVG}") no-repeat bottom center/contain`, opacity: 0.7 }} />
              <div>
                <div style={{textAlign:"center", fontWeight:"bold", marginBottom:"8px", fontSize:"11px", color:"#555"}}>Collage (Drag & Drop)</div>
                <div ref={canvasRef} onMouseMove={onDrag} onMouseUp={stopDrag} onMouseLeave={stopDrag}
                  style={{ width: canvasW, height: canvasH, border: "3px solid #333", position: "relative", background: "repeating-linear-gradient(45deg, #fce4e4, #fce4e4 10px, #ffffff 10px, #ffffff 20px)", boxShadow: "0 5px 15px rgba(0,0,0,0.1)", borderRadius:"2px" }}>
                  
                  {gaps.map(g => (
                    <div key={g.id} style={{ position: "absolute", left: g.x * mainScale, bottom: g.y * mainScale, width: g.w * mainScale, height: g.h * mainScale, background: "rgba(255, 75, 75, 0.4)", border: "1px dashed #FF4B4B", pointerEvents: "none", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "9px", color: "white", textShadow: "0px 1px 2px rgba(0,0,0,0.8)", fontWeight: "bold" }}>
                      {(g.w * g.h / 1000000) >= 0.4 ? `${(g.w * g.h / 1000000).toFixed(2)}` : ""}
                    </div>
                  ))}

                  {windows.filter(w=>w.visible).map(w => {
                    let dispW = w.rotated ? w.h : w.w; let dispH = w.rotated ? w.w : w.h;
                    let isDragging = draggingId === w.id;
                    let isSelected = selectedId === w.id;
                    return (
                      <div key={w.id} onMouseDown={(e) => handleWindowPointerDown(e, w)}
                        style={{ position: "absolute", left: w.x * mainScale, bottom: w.y * mainScale, width: dispW * mainScale, height: dispH * mainScale, background: w.color, 
                        border: isSelected ? "3px solid #00a8ff" : (w.pinned ? "2px solid #111" : "1px solid #555"), 
                        boxShadow: isSelected ? "0 0 15px 5px rgba(0,168,255,0.7)" : (w.pinned ? "none" : "0 4px 8px rgba(0,0,0,0.3)"),
                        cursor: w.pinned ? "not-allowed" : (isDragging ? "grabbing" : "grab"), display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize: "10px", color:"#222", zIndex: isSelected || isDragging ? 100 : (w.pinned ? 5 : 10), opacity: w.pinned ? 0.95 : 1, transition: isDragging ? "none" : "all 0.1s" }}
                      >
                        <div style={{position: "absolute", top: 1, right: 1, display: "flex", gap: "2px"}}>
                          <button onClick={(e)=>{e.stopPropagation(); toggleRotate(w.id);}} style={{background:"rgba(255,255,255,0.8)", border:"1px solid #777", borderRadius:"2px", fontSize:"8px", cursor:"pointer", padding:"1px 3px"}}>🔄</button>
                          <button onClick={(e)=>{e.stopPropagation(); toggleWinProp(w.id, 'pinned');}} style={{background:"rgba(255,255,255,0.8)", border:"1px solid #777", borderRadius:"2px", fontSize:"8px", cursor:"pointer", padding:"1px 3px"}}>{w.pinned ? "❌" : "📌"}</button>
                        </div>
                        <span style={{pointerEvents: "none", marginTop: "10px", textAlign: "center"}}>{w.pinned && "📌 "}{w.pos}<br/><span style={{fontSize: "8px", fontWeight:"normal"}}>{dispW}x{dispH}</span></span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{display: "flex", gap: "20px", alignItems:"flex-end", opacity: topPaneHeight < 30 ? 0 : 1, transition: "0.2s"}}>
              <div>
                <div style={{textAlign:"center", fontWeight:"bold", marginBottom:"8px", fontSize:"11px", color:"#555"}}>S/W Analyse</div>
                <div style={{ width: wall.w * subScale, height: wall.h * subScale, border: "2px solid #000", position: "relative", background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                  {gaps.map(g => (
                    <div key={"bw_"+g.id} style={{ position: "absolute", left: g.x * subScale, bottom: g.y * subScale, width: g.w * subScale, height: g.h * subScale, background: "black" }} />
                  ))}
                  {windows.filter(w=>w.visible).map(w => {
                    let dispW = w.rotated ? w.h : w.w; let dispH = w.rotated ? w.w : w.h;
                    return <div key={"bw_"+w.id} style={{ position: "absolute", left: w.x * subScale, bottom: w.y * subScale, width: dispW * subScale, height: dispH * subScale, background: "white", border: "1px solid #ccc" }} />
                  })}
                </div>
              </div>

              <div>
                <div style={{textAlign:"center", fontWeight:"bold", marginBottom:"8px", fontSize:"11px", color:"#555"}}>CAD Drahtmodell</div>
                <div style={{ width: wall.w * subScale, height: wall.h * subScale, border: "1px solid #000", position: "relative", background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                  {gaps.map(g => (
                    <div key={"line_"+g.id} style={{ position: "absolute", left: g.x * subScale, bottom: g.y * subScale, width: g.w * subScale, height: g.h * subScale, background: "transparent", border: "0.5px solid #ccc" }} />
                  ))}
                  {windows.filter(w=>w.visible).map(w => {
                    let dispW = w.rotated ? w.h : w.w; let dispH = w.rotated ? w.w : w.h;
                    return <div key={"line_"+w.id} style={{ position: "absolute", left: w.x * subScale, bottom: w.y * subScale, width: dispW * subScale, height: dispH * subScale, background: "transparent", border: "1px solid #333" }} />
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === DRAGGABLE DIVIDER (MIT BUTTONS) === */}
        <div 
          onMouseDown={handleDividerDragStart}
          style={{ height: "16px", background: "#ddd", cursor: "row-resize", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 50, gap:"20px" }}
        >
          <button onClick={()=>setTopPaneHeight(100)} style={{background:"none", border:"none", cursor:"pointer", fontSize:"10px"}}>🔽 Zeichnung Max</button>
          <div style={{width:"40px", height:"4px", background:"#fff", borderRadius:"2px"}}></div>
          <button onClick={()=>setTopPaneHeight(0)} style={{background:"none", border:"none", cursor:"pointer", fontSize:"10px"}}>🔼 Listen Max</button>
        </div>

        {/* === UNTERE HÄLFTE: 2 SPALTEN MATRIX === */}
        <div style={{ height: `${100 - topPaneHeight}%`, display: "flex", background: "#fff", overflow: "hidden" }}>
          
          {/* Spalte 1: ALLE FENSTER */}
          <div style={{ flex: 1, overflowY: "auto", padding: "15px", borderRight: "2px solid #ddd" }}>
            <h3 style={{margin:"0 0 10px 0", color:"#111", fontSize:"14px"}}>{T.all_windows} ({windows.length})</h3>
            <div style={{border:"1px solid #eee", borderRadius:"6px", overflowX:"auto"}}>
              <table style={{width: "100%", borderCollapse: "collapse", fontSize: "11px", textAlign: "left"}}>
                <thead><tr style={{background:"#f8f9fa", borderBottom:"1px solid #eee"}}>
                  <th title="Alle umschalten" onClick={()=>toggleAll('visible')} style={{padding:"6px", cursor:"pointer"}}>{T.col.v}🖱️</th>
                  <th style={{padding:"6px"}}>{T.col.id}</th><th style={{padding:"6px"}}>{T.col.dim}</th><th style={{padding:"6px"}}>{T.col.pr}</th><th style={{padding:"6px"}}>{T.col.dist}</th><th style={{padding:"6px"}}>{T.col.src}</th>
                </tr></thead>
                <tbody>
                  {windows.sort((a,b)=>a.dist-b.dist).map(w => {
                    let isSelected = selectedId === w.id;
                    return (
                      <tr id={`row-all-${w.id}`} key={`all-${w.id}`} onClick={()=>setSelectedId(w.id)} style={{background: isSelected ? "#e3f2fd" : (w.pinned ? "#fff3cd" : "transparent"), opacity: w.visible ? 1 : 0.4, borderBottom:"1px solid #eee", cursor:"pointer"}}>
                        <td style={{padding:"6px"}}><input type="checkbox" checked={w.visible} onChange={(e)=>{e.stopPropagation(); toggleWinProp(w.id, 'visible');}}/></td>
                        <td style={{padding:"6px", fontWeight:"bold"}}>{w.pos}</td>
                        <td style={{padding:"6px"}}>{w.w}x{w.h}</td>
                        <td style={{padding:"6px", color:"#FF4B4B"}}>{w.price.toFixed(0)}€</td>
                        <td style={{padding:"6px", color:"#0066cc"}}>{w.dist}km</td>
                        <td style={{padding:"6px", maxWidth:"100px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{w.source}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Spalte 2: VERWENDETE FENSTER (Sichtbar) */}
          <div style={{ flex: 1, overflowY: "auto", padding: "15px" }}>
            <h3 style={{margin:"0 0 10px 0", color:"#111", fontSize:"14px"}}>{T.used_windows} ({windows.filter(w=>w.visible).length})</h3>
            <div style={{border:"1px solid #eee", borderRadius:"6px", overflowX:"auto"}}>
              <table style={{width: "100%", borderCollapse: "collapse", fontSize: "11px", textAlign: "left"}}>
                <thead><tr style={{background:"#f8f9fa", borderBottom:"1px solid #eee"}}>
                  <th title="Alle umschalten" onClick={()=>toggleAll('pinned')} style={{padding:"6px", cursor:"pointer"}}>{T.col.p}🖱️</th>
                  <th title="Alle umschalten" onClick={()=>toggleAll('rotated')} style={{padding:"6px", cursor:"pointer"}}>{T.col.r}🖱️</th>
                  <th style={{padding:"6px"}}>{T.col.id}</th><th style={{padding:"6px"}}>{T.col.x}</th><th style={{padding:"6px"}}>{T.col.y}</th><th style={{padding:"6px"}}>{T.col.dim}</th>
                </tr></thead>
                <tbody>
                  {windows.filter(w=>w.visible).map(w => {
                    let isSelected = selectedId === w.id;
                    let dispW = w.rotated ? w.h : w.w; let dispH = w.rotated ? w.w : w.h;
                    return (
                      <tr id={`row-used-${w.id}`} key={`used-${w.id}`} onClick={()=>setSelectedId(w.id)} style={{background: isSelected ? "#e3f2fd" : (w.pinned ? "#fff3cd" : "transparent"), borderBottom:"1px solid #eee", cursor:"pointer"}}>
                        <td style={{padding:"6px"}}><input type="checkbox" checked={w.pinned} onChange={(e)=>{e.stopPropagation(); toggleWinProp(w.id, 'pinned');}}/></td>
                        <td style={{padding:"6px"}}><input type="checkbox" checked={w.rotated} onChange={(e)=>{e.stopPropagation(); toggleRotate(w.id);}}/></td>
                        <td style={{padding:"6px", fontWeight:"bold"}}>{w.pos}</td>
                        <td style={{padding:"6px"}}><input type="number" value={w.x} onChange={e=>{let arr=windows.map(x=>x.id===w.id?{...x, x:parseInt(e.target.value)||0, pinned:true}:x); setWindows(arr); runAI(arr, wall, params, seed);}} onClick={e=>e.stopPropagation()} style={{width:"50px", padding:"2px"}}/></td>
                        <td style={{padding:"6px"}}><input type="number" value={w.y} onChange={e=>{let arr=windows.map(x=>x.id===w.id?{...x, y:parseInt(e.target.value)||0, pinned:true}:x); setWindows(arr); runAI(arr, wall, params, seed);}} onClick={e=>e.stopPropagation()} style={{width:"50px", padding:"2px"}}/></td>
                        <td style={{padding:"6px"}}>{dispW}x{dispH}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* =======================
          RECHTE SIDEBAR (CHATBOT)
      ======================= */}
      <div style={{ width: rightOpen ? "350px" : "0px", background: "#f8f9fa", borderLeft: rightOpen ? "2px solid #ddd" : "none", display: "flex", flexDirection: "column", transition: "0.3s", flexShrink: 0, overflow: "hidden" }}>
        <div style={{ width: "350px", display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ padding: "15px", background: "#222", color: "white", fontWeight: "bold", fontSize: "14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span>🤖 KI Assistent</span>
          </div>
          
          <div style={{ flex: 1, overflowY: "auto", padding: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {chatMessages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? '#0066cc' : '#e9ecef', color: m.role === 'user' ? 'white' : '#222', padding: "10px 14px", borderRadius: "8px", maxWidth: "85%", fontSize: "13px", lineHeight: "1.4", whiteSpace: "pre-wrap" }}>
                {m.text}
              </div>
            ))}
            {chatLoading && <div style={{ alignSelf: 'flex-start', background: '#e9ecef', padding: "10px 14px", borderRadius: "8px", fontSize: "13px" }}>KI denkt nach...</div>}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleChatSubmit} style={{ display: "flex", padding: "15px", borderTop: "1px solid #ddd", background: "white" }}>
            <input type="text" value={chatInput} onChange={e=>setChatInput(e.target.value)} disabled={chatLoading} placeholder="Frage zur Fassade..." style={{ flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "4px 0 0 4px", outline: "none", fontSize: "13px" }} />
            <button type="submit" disabled={chatLoading} style={{ padding: "10px 15px", background: chatLoading ? "#ccc" : "#FF4B4B", color: "white", border: "none", borderRadius: "0 4px 4px 0", cursor: chatLoading ? "not-allowed" : "pointer", fontWeight: "bold" }}>Senden</button>
          </form>
        </div>
      </div>

    </div>
  );
}
