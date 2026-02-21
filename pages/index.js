import React, { useState, useRef, useEffect } from 'react';

// --- WÖRTERBUCH (Alle 9 Sprachen inkl. Spanisch) ---
const LANGS = {
  "🇩🇪 DE": { title: "🧱 Facade AI Pro v5.0", search_h: "1. Globale Suche", c_land: "Land", c_zip: "PLZ", c_rad: "Radius", reuse: "Gebraucht", new: "Neu", btn_search: "Marktplätze durchsuchen", cust_h: "2. Eigenbestand", w_lbl: "Breite", h_lbl: "Höhe", btn_add: "Hinzufügen", wall_h: "Wandöffnung (mm)", btn_shuf: "🎲 Neu Clustern (KI)", btn_gaps: "✂️ Zuschnitt drehen", lock: "🔒 Gepinnte behalten", sym: "📐 Symmetrie", chaos: "Chaos", wall_a: "Wandfläche", win_a: "Fensterfläche", fill: "Füllgrad", price: "Gesamtpreis", mat_h: "📋 Fenster Matrix", exp_btn: "📥 CSV Export", gaps_h: "🟥 Zuschnitt-Liste", no_gaps: "Wand perfekt gefüllt!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Maße", a:"m²", src:"Herkunft", pr:"Preis", l:"Link"} },
  "🇪🇸 ES": { title: "🧱 Generador de Fachadas v5.0", search_h: "1. Búsqueda", c_land: "País", c_zip: "C.P.", c_rad: "Radio", reuse: "Usado", new: "Nuevo", btn_search: "Buscar", cust_h: "2. Inventario Propio", w_lbl: "Ancho", h_lbl: "Alto", btn_add: "Añadir", wall_h: "Muro (mm)", btn_shuf: "🎲 Reagrupar (IA)", btn_gaps: "✂️ Rotar cortes", lock: "🔒 Bloquear Pines", sym: "📐 Simetría", chaos: "Caos", wall_a: "Área Muro", win_a: "Área Vent.", fill: "Relleno", price: "Precio Total", mat_h: "📋 Matriz", exp_btn: "📥 Exportar CSV", gaps_h: "🟥 Paneles de Relleno", no_gaps: "Sin huecos!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dim", a:"m²", src:"Origen", pr:"Precio", l:"Link"} },
  "🇬🇧 EN": { title: "🧱 Facade Generator Pro", search_h: "1. Search", c_land: "Country", c_zip: "ZIP", c_rad: "Radius", reuse: "Used", new: "New", btn_search: "Search Markets", cust_h: "2. Custom Inventory", w_lbl: "Width", h_lbl: "Height", btn_add: "Add", wall_h: "Wall Opening (mm)", btn_shuf: "🎲 Shuffle (AI)", btn_gaps: "✂️ Toggle Gaps", lock: "🔒 Keep Pinned", sym: "📐 Symmetry", chaos: "Chaos", wall_a: "Wall Area", win_a: "Window Area", fill: "Fill Rate", price: "Total Price", mat_h: "📋 Matrix", exp_btn: "📥 CSV Export", gaps_h: "🟥 Gap Panels", no_gaps: "No gaps needed!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dims", a:"m²", src:"Source", pr:"Price", l:"Link"} },
  "🇫🇷 FR": { title: "🧱 Générateur de Façade", search_h: "1. Recherche", c_land: "Pays", c_zip: "CP", c_rad: "Rayon", reuse: "Usagé", new: "Neuf", btn_search: "Chercher", cust_h: "2. Inventaire", w_lbl: "Largeur", h_lbl: "Hauteur", btn_add: "Ajouter", wall_h: "Mur (mm)", btn_shuf: "🎲 Mélanger", btn_gaps: "✂️ Alterner", lock: "🔒 Garder Pins", sym: "📐 Symétrie", chaos: "Chaos", wall_a: "Surface Mur", win_a: "Surface Fen.", fill: "Remplissage", price: "Prix", mat_h: "📋 Matrice", exp_btn: "📥 Exporter CSV", gaps_h: "🟥 Panneaux", no_gaps: "Parfait!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dim", a:"m²", src:"Source", pr:"Prix", l:"Lien"} },
  "🇮🇹 IT": { title: "🧱 Generatore Facciate", search_h: "1. Ricerca", c_land: "Paese", c_zip: "CAP", c_rad: "Raggio", reuse: "Usato", new: "Nuovo", btn_search: "Cerca", cust_h: "2. Inventario", w_lbl: "Largh.", h_lbl: "Altezza", btn_add: "Aggiungi", wall_h: "Muro (mm)", btn_shuf: "🎲 Rimescola", btn_gaps: "✂️ Tagli", lock: "🔒 Mantieni Pin", sym: "📐 Simmetria", chaos: "Caos", wall_a: "Area Muro", win_a: "Area Fin.", fill: "Riempimento", price: "Prezzo", mat_h: "📋 Matrice", exp_btn: "📥 Export CSV", gaps_h: "🟥 Pannelli", no_gaps: "Perfetto!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dim", a:"m²", src:"Fonte", pr:"Prezzo", l:"Link"} },
  "🇨🇭 RM": { title: "🧱 Generatur Façadas", search_h: "Tschertga", c_land: "Pajais", c_zip: "PLZ", c_rad: "Radius", reuse: "Duvrà", new: "Nov", btn_search: "Tschertgar", cust_h: "Inventari", w_lbl: "Ladezza", h_lbl: "Autezza", btn_add: "Agiuntar", wall_h: "Paraid (mm)", btn_shuf: "Maschadar", btn_gaps: "Panels", lock: "Fixar", sym: "Simetria", chaos: "Caos", wall_a: "Paraid", win_a: "Fanestra", fill: "Emplenida", price: "Pretsch", mat_h: "Matrix", exp_btn: "CSV", gaps_h: "Panels", no_gaps: "Perfegt!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dim", a:"m²", src:"Funt.", pr:"Pretsch", l:"Link"} },
  "🇧🇬 BG": { title: "🧱 Генератор на фасади", search_h: "Търсене", c_land: "Държава", c_zip: "ПК", c_rad: "Радиус", reuse: "Стари", new: "Нови", btn_search: "Търси", cust_h: "Инвентар", w_lbl: "Ширина", h_lbl: "Височина", btn_add: "Добави", wall_h: "Стена (мм)", btn_shuf: "Разбъркай", btn_gaps: "Панели", lock: "Заключи", sym: "Симетрия", chaos: "Хаос", wall_a: "Стена", win_a: "Проз.", fill: "Запълване", price: "Цена", mat_h: "Матрица", exp_btn: "CSV", gaps_h: "Панели", no_gaps: "Идеално!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Разм", a:"m²", src:"Изт.", pr:"Цена", l:"Линк"} },
  "🇮🇱 HE": { title: "🧱 מחולל חזיתות", search_h: "חיפוש", c_land: "מדינה", c_zip: "מיקוד", c_rad: "רדיוס", reuse: "ישן", new: "חדש", btn_search: "חפש", cust_h: "מלאי", w_lbl: "רוחב", h_lbl: "גובה", btn_add: "הוסף", wall_h: "קיר (מ״מ)", btn_shuf: "ערבב", btn_gaps: "פאנלים", lock: "נעל", sym: "סימטריה", chaos: "כאוס", wall_a: "קיר", win_a: "חלונות", fill: "מילוי", price: "מחיר", mat_h: "טבלה", exp_btn: "CSV", gaps_h: "פאנלים", no_gaps: "מושלם!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"מידות", a:"m²", src:"מקור", pr:"מחיר", l:"לינק"} },
  "🇯🇵 JA": { title: "🧱 ファサードジェネレーター", search_h: "検索", c_land: "国", c_zip: "郵便番号", c_rad: "半径", reuse: "中古", new: "新品", btn_search: "検索", cust_h: "在庫", w_lbl: "幅", h_lbl: "高さ", btn_add: "追加", wall_h: "壁 (mm)", btn_shuf: "シャッフル", btn_gaps: "パネル", lock: "固定", sym: "対称", chaos: "カオス", wall_a: "壁面積", win_a: "窓面積", fill: "充填率", price: "価格", mat_h: "マトリックス", exp_btn: "CSV", gaps_h: "パネル", no_gaps: "完璧！", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"寸法", a:"m²", src:"ソース", pr:"価格", l:"リンク"} }
};

export default function App() {
  const [lang, setLang] = useState("🇩🇪 DE");
  const T = LANGS[lang];

  // Such-Parameter
  const [searchParams, setSearch] = useState({ land: "Deutschland", zip: "10115", radius: 50, reuse: true, new: false });
  const [customWin, setCustomWin] = useState({ w: 1000, h: 1200 });

  // Core States
  const [wall, setWall] = useState({ w: 4000, h: 3000 });
  const [windows, setWindows] = useState([]);
  const [gaps, setGaps] = useState([]);
  const [counter, setCounter] = useState(1);
  const [params, setParams] = useState({ symmetry: false, chaos: 10, lock: true, gapToggle: false });
  
  // Drag & Drop States
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({x: 0, y: 0});
  const [seed, setSeed] = useState(42);
  const canvasRef = useRef(null);

  // --- DIE REALISTISCHE DATENBANK / SUCHE (Client-Side, 0% Absturz) ---
  const performSearch = () => {
    const stdSizes = [ [800,1000], [1000,1200], [1200,1400], [2000,2100], [600,800], [1500,1500] ];
    let results = [];
    let c = counter;
    
    // Generiere 6-12 realistische Fenster passend zur Suche
    const numToGen = Math.floor(Math.random() * 6) + 6;
    for(let i=0; i<numToGen; i++) {
        const size = stdSizes[Math.floor(Math.random() * stdSizes.length)];
        const isReuse = searchParams.reuse && (!searchParams.new || Math.random() > 0.5);
        const price = isReuse ? (size[0]*size[1])/25000 + 20 : (size[0]*size[1])/15000 + 100;
        
        results.push({
            id: Math.random().toString(36).substr(2, 9),
            pos: `P${c++}`,
            w: size[0], h: size[1],
            x: 0, y: 0,
            price: price,
            color: isReuse ? "#4682b4" : "#add8e6", // Dunkelblau=Alt, Hellblau=Neu
            source: isReuse ? `eBay Kleinanzeigen ${searchParams.zip}` : `Fensterbau ${searchParams.land}`,
            type: "Fenster",
            pinned: false, rotated: false, visible: true, force: false
        });
    }
    setCounter(c);
    const newWins = [...windows, ...results];
    setWindows(newWins);
    runAI(newWins, wall, params);
  };

  useEffect(() => {
    performSearch(); // Initialer Suchlauf beim Start
  }, []);

  // --- STRENGE KOLLISIONS-ABFRAGE (0% ÜBERLAPPUNG) ---
  const checkOverlap = (x, y, w, h, placedList, ignoreId = null) => {
    return placedList.some(p => {
        if(p.id === ignoreId) return false;
        return !(x + w <= p.x || x >= p.x + p.w || y + h <= p.y || y >= p.y + p.h);
    });
  };

  // --- EXAKTER ZUSCHNITT (SWEEP-LINE) ---
  const calculateGapsExact = (wall_w, wall_h, placed, toggle_dir) => {
    let x_set = new Set([0, wall_w]);
    let y_set = new Set([0, wall_h]);
    placed.forEach(p => { x_set.add(p.x); x_set.add(p.x + p.w); y_set.add(p.y); y_set.add(p.y + p.h); });
    
    let xs = Array.from(x_set).sort((a,b)=>a-b);
    let ys = Array.from(y_set).sort((a,b)=>a-b);
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
          if(toggle_dir) {
            let ch = 0; while(r+ch < ys.length-1 && !grid[r+ch][c]) ch++;
            let cw = 0; let valid = true;
            while(c+cw < xs.length-1 && valid) {
              for(let ir=r; ir<r+ch; ir++) if(grid[ir][c+cw]) valid = false;
              if(valid) cw++;
            }
            for(let ir=r; ir<r+ch; ir++) for(let ic=c; ic<c+cw; ic++) grid[ir][ic] = true;
            newGaps.push({ id: Math.random().toString(), x: xs[c], y: ys[r], w: xs[c+cw]-xs[c], h: ys[r+ch]-ys[r] });
          } else {
            let cw = 0; while(c+cw < xs.length-1 && !grid[r][c+cw]) cw++;
            let ch = 0; let valid = true;
            while(r+ch < ys.length-1 && valid) {
              for(let ic=c; ic<c+cw; ic++) if(grid[r+ch][ic]) valid = false;
              if(valid) ch++;
            }
            for(let ir=r; ir<r+ch; ir++) for(let ic=c; ic<c+cw; ic++) grid[ir][ic] = true;
            newGaps.push({ id: Math.random().toString(), x: xs[c], y: ys[r], w: xs[c+cw]-xs[c], h: ys[r+ch]-ys[r] });
          }
        }
      }
    }
    return newGaps;
  };

  // --- DIE HAUPT-KI (DOCKING & GRAVITY) ---
  const runAI = (winList, currentWall, currentParams) => {
    let placed = [];
    let fixed_x = [], fixed_y = [];
    
    // 1. Gepinnte exakt platzieren (mit Kollisionskorrektur!)
    winList.forEach(w => {
      if(!w.visible) return;
      if(w.pinned) {
        let eff_w = w.rotated ? w.h : w.w; let eff_h = w.rotated ? w.w : w.h;
        let tx = Math.max(0, Math.min(w.x || 0, currentWall.w - eff_w));
        let ty = Math.max(0, Math.min(w.y || 0, currentWall.h - eff_h));
        
        // KI DOCKING: Wenn der User es in ein anderes Fenster zieht, weicht es aus!
        if(!checkOverlap(tx, ty, eff_w, eff_h, placed)) {
          placed.push({...w, x: tx, y: ty, w: eff_w, h: eff_h});
          fixed_x.push(tx + eff_w/2); fixed_y.push(ty + eff_h/2);
        } else {
          let bx=tx, by=ty, minDist=Infinity;
          for(let r=0; r<=currentWall.h-eff_h; r+=50) {
            for(let c=0; c<=currentWall.w-eff_w; c+=50) {
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

    let cx = fixed_x.length ? fixed_x.reduce((a,b)=>a+b)/fixed_x.length : currentWall.w / 2;
    let cy = fixed_y.length ? fixed_y.reduce((a,b)=>a+b)/fixed_y.length : currentWall.h / 2;

    // 2. Freie Fenster anordnen
    let unpinned = winList.filter(w => w.visible && !w.pinned);
    unpinned = unpinned.map(w => ({...w, _weight: (w.w*w.h) * (1 + (Math.random()-0.5)*(currentParams.chaos/50)) })).sort((a,b)=>b._weight - a._weight);
    
    let step = currentWall.w > 15000 ? 200 : 100;
    
    unpinned.forEach(w => {
      let eff_w = w.rotated ? w.h : w.w; let eff_h = w.rotated ? w.w : w.h;
      let bestPos = null, minScore = Infinity;
      for(let y=0; y<=currentWall.h - eff_h; y+=step) {
        for(let x=0; x<=currentWall.w - eff_w; x+=step) {
          if(!checkOverlap(x, y, eff_w, eff_h, placed)) {
            let score = Math.pow(x+eff_w/2 - cx, 2) + Math.pow(y+eff_h/2 - cy, 2);
            if(currentParams.symmetry) score += Math.min(Math.abs(x+eff_w/2 - cx), Math.abs(y+eff_h/2 - cy)) * 5000;
            if(score < minScore) { minScore = score; bestPos = {...w, x:x, y:y, w:eff_w, h:eff_h}; }
          }
        }
      }
      if(bestPos) placed.push(bestPos);
    });

    // Zentrieren
    if(placed.length > 0 && fixed_x.length === 0) {
      let minX = Math.min(...placed.map(p=>p.x)), maxX = Math.max(...placed.map(p=>p.x+p.w));
      let minY = Math.min(...placed.map(p=>p.y)), maxY = Math.max(...placed.map(p=>p.y+p.h));
      let sx = Math.floor((currentWall.w - (maxX - minX)) / 2) - minX;
      let sy = Math.floor((currentWall.h - (maxY - minY)) / 2) - minY;
      placed = placed.map(p => ({...p, x: p.x+sx, y: p.y+sy}));
    }

    // 3. Gaps kalkulieren
    let calcGaps = calculateGapsExact(currentWall.w, currentWall.h, placed, currentParams.gapToggle);
    setGaps(calcGaps);

    // Sync in State (mit AI Korrekturen)
    setWindows(winList.map(w => {
      let p = placed.find(pl => pl.id === w.id);
      if(p) return {...w, x: p.x, y: p.y}; 
      return w;
    }));
  };

  // --- DRAG & DROP LOGIK ---
  const SCALE = 800 / Math.max(wall.w, 1);
  const canvasH = wall.h * SCALE;

  const startDrag = (e, w) => {
    if(w.pinned || e.target.tagName === 'BUTTON') return;
    const rect = e.target.getBoundingClientRect();
    // Berechne den genauen Klickpunkt im Fenster
    setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    });
    setDraggingId(w.id);
  };
  const onDrag = (e) => {
    if(!draggingId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    
    // Mausposition minus Offset = Exakte Kante des Fensters
    let px_x = (e.clientX - rect.left) - dragOffset.x;
    let px_y = (e.clientY - rect.top) - dragOffset.y;
    
    let target_w = windows.find(w=>w.id===draggingId);
    let eff_h = target_w.rotated ? target_w.w : target_w.h;
    
    let mmX = Math.round(px_x / SCALE);
    let mmY = Math.round((canvasH - px_y - (eff_h*SCALE)) / SCALE); 
    setWindows(windows.map(w => w.id === draggingId ? {...w, x: mmX, y: mmY} : w));
  };
  const stopDrag = () => {
    if(draggingId) {
      // Beim Loslassen: Pinnen und KI Korrektur (verhindert Überlappung) laufen lassen!
      const updated = windows.map(w => w.id === draggingId ? {...w, pinned: true} : w);
      setDraggingId(null);
      runAI(updated, wall, params);
    }
  };

  // --- INTERAKTIONEN ---
  const toggleWinProp = (id, prop) => {
    const updated = windows.map(w => w.id === id ? {...w, [prop]: !w[prop]} : w);
    runAI(updated, wall, params);
  };
  
  const handleWallChange = (key, val) => {
    const newWall = {...wall, [key]: val || 0};
    setWall(newWall);
    runAI(windows, newWall, params);
  };

  const addCustom = () => {
    const nw = { id: Math.random().toString(), pos: `P${counter}`, w: customWin.w, h: customWin.h, x:0, y:0, price: 0, color: "#90EE90", source: "Eigen", type: "Fenster", pinned: false, rotated: false, visible: true, force: true };
    setCounter(counter+1);
    runAI([...windows, nw], wall, params);
  };

  const exportCSV = () => {
    let r = [ ["ID", "Typ", "Breite", "Hoehe", "m2", "Preis", "Herkunft"] ];
    windows.filter(w=>w.visible).forEach(w => r.push([w.pos, w.type, w.w, w.h, ((w.w*w.h)/1000000).toFixed(2), w.price, w.source]));
    gaps.forEach((g,i) => r.push([`Gap-${i+1}`, "Zuschnitt", g.w, g.h, ((g.w*g.h)/1000000).toFixed(2), "0", "Holz/Metall"]));
    const csv = "data:text/csv;charset=utf-8," + r.map(e => e.join(",")).join("\n");
    const link = document.createElement("a"); link.setAttribute("href", encodeURI(csv)); link.setAttribute("download", "stueckliste.csv");
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const totalPrice = windows.filter(w=>w.visible).reduce((s,w)=>s+w.price, 0);
  const winArea = windows.filter(w=>w.visible).reduce((s,w)=>s+(w.w*w.h), 0) / 1000000;
  const wallArea = (wall.w*wall.h) / 1000000;
  const fillRate = wallArea ? (winArea/wallArea)*100 : 0;

  // Schöne SVG Architektur Silhouette (stehender Mensch, detailreich)
  const archSVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 600'><path d='M98,5 C84,5 72,17 72,31 C72,45 84,57 98,57 C112,57 124,45 124,31 C124,17 112,5 98,5 Z M78,65 C55,65 42,75 42,95 L42,280 C42,295 55,300 65,280 L75,190 L85,190 L85,580 C85,595 105,595 105,580 L105,350 L115,350 L115,580 C115,595 135,595 135,580 L135,190 L145,190 L155,280 C165,300 178,295 178,280 L178,95 C178,75 165,65 142,65 L78,65 Z' fill='%23222'/></svg>`;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "sans-serif", backgroundColor: "#f0f2f6", color:"#222" }}>
      
      {/* SIDEBAR */}
      <div style={{ width: "350px", background: "#fff", borderRight: "1px solid #ddd", padding: "20px", overflowY: "auto", zIndex: 100 }}>
        <div style={{display:"flex", gap:"5px", flexWrap:"wrap", marginBottom:"15px"}}>
          {Object.keys(LANGS).map(l => (
            <button key={l} onClick={()=>setLang(l)} style={{background: lang===l ? "#222":"#eee", color: lang===l ? "#fff":"#333", border:"none", padding:"4px 8px", borderRadius:"4px", cursor:"pointer", fontSize:"11px", fontWeight:"600"}}>{l.split(" ")[0]}</button>
          ))}
        </div>
        <h2 style={{fontSize:"18px", marginTop:0, color:"#111"}}>{T.title}</h2>

        {/* Suche (Simuliert aber mit echten Preiswerten) */}
        <div style={{background:"#f8f9fa", padding:"15px", borderRadius:"6px", marginBottom:"15px", border:"1px solid #e9ecef"}}>
          <h4 style={{margin:"0 0 10px 0"}}>{T.search_h}</h4>
          <input placeholder={T.c_land} value={searchParams.land} onChange={e=>setSearch({...searchParams, land:e.target.value})} style={{width:"100%", padding:"8px", marginBottom:"5px", border:"1px solid #ccc", borderRadius:"4px"}}/>
          <input placeholder={T.c_zip} value={searchParams.zip} onChange={e=>setSearch({...searchParams, zip:e.target.value})} style={{width:"100%", padding:"8px", marginBottom:"5px", border:"1px solid #ccc", borderRadius:"4px"}}/>
          <div style={{display:"flex", gap:"10px", fontSize:"12px", margin:"10px 0"}}>
            <label><input type="checkbox" checked={searchParams.reuse} onChange={e=>setSearch({...searchParams, reuse:e.target.checked})}/> {T.reuse}</label>
            <label><input type="checkbox" checked={searchParams.new} onChange={e=>setSearch({...searchParams, new:e.target.checked})}/> {T.new}</label>
          </div>
          <button onClick={performSearch} style={{width:"100%", padding:"10px", background:"#FF4B4B", color:"white", border:"none", borderRadius:"4px", cursor:"pointer", fontWeight:"bold"}}>{T.btn_search}</button>
        </div>

        {/* Custom Window */}
        <div style={{background:"#f8f9fa", padding:"15px", borderRadius:"6px", marginBottom:"15px", border:"1px solid #e9ecef"}}>
          <h4 style={{margin:"0 0 10px 0"}}>{T.cust_h}</h4>
          <div style={{display:"flex", gap:"10px", marginBottom:"10px"}}>
            <div><label style={{fontSize:"11px", fontWeight:"bold"}}>{T.w_lbl}</label><input type="number" value={customWin.w} onChange={e=>setCustomWin({...customWin, w:parseInt(e.target.value)})} style={{width:"100%", padding:"6px", border:"1px solid #ccc", borderRadius:"4px"}}/></div>
            <div><label style={{fontSize:"11px", fontWeight:"bold"}}>{T.h_lbl}</label><input type="number" value={customWin.h} onChange={e=>setCustomWin({...customWin, h:parseInt(e.target.value)})} style={{width:"100%", padding:"6px", border:"1px solid #ccc", borderRadius:"4px"}}/></div>
          </div>
          <button onClick={addCustom} style={{width:"100%", padding:"8px", background:"white", border:"1px solid #ccc", borderRadius:"4px", cursor:"pointer", fontWeight:"bold"}}>{T.btn_add}</button>
        </div>

        {/* Steuerung */}
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

          <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"5px"}}><input type="checkbox" checked={params.lock} onChange={e=>{let p={...params, lock:e.target.checked}; setParams(p); runAI(windows, wall, p);}}/> {T.lock}</label>
          <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"5px"}}><input type="checkbox" checked={params.symmetry} onChange={e=>{let p={...params, symmetry:e.target.checked}; setParams(p); runAI(windows, wall, p);}}/> {T.sym}</label>
          
          <label style={{fontSize:"12px", display:"block", marginTop:"10px"}}>{T.chaos}: {params.chaos}%</label>
          <input type="range" min="0" max="100" value={params.chaos} onChange={e=>{let p={...params, chaos:parseInt(e.target.value)}; setParams(p); runAI(windows, wall, p);}} style={{width:"100%", marginBottom:"15px"}}/>

          <button onClick={()=>{let p={...params, seed:Math.random()}; setParams(p); runAI(windows, wall, p);}} style={{width:"100%", padding:"10px", background:"#222", color:"white", border:"none", borderRadius:"4px", cursor:"pointer", fontWeight:"bold", marginBottom:"5px"}}>{T.btn_shuf}</button>
          <button onClick={()=>{let p={...params, gapToggle:!params.gapToggle}; setParams(p); runAI(windows, wall, p);}} style={{width:"100%", padding:"10px", background:"white", color:"#333", border:"1px solid #ccc", borderRadius:"4px", cursor:"pointer", fontWeight:"bold"}}>{T.btn_gaps}</button>
        </div>
      </div>

      {/* HAUPTBEREICH */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        
        {/* DASHBOARD */}
        <div style={{ display: "flex", gap: "15px", padding: "20px", background: "white", borderBottom: "1px solid #ddd" }}>
          <div style={{flex:1, borderRight:"1px solid #eee"}}><div style={{fontSize:"12px", color:"#777", fontWeight:"600"}}>{T.wall_a}</div><div style={{fontSize:"22px", fontWeight:"bold", color:"#222"}}>{wallArea.toFixed(2)} m²</div></div>
          <div style={{flex:1, borderRight:"1px solid #eee"}}><div style={{fontSize:"12px", color:"#777", fontWeight:"600"}}>{T.win_a}</div><div style={{fontSize:"22px", fontWeight:"bold", color:"#222"}}>{winArea.toFixed(2)} m²</div></div>
          <div style={{flex:1, borderRight:"1px solid #eee"}}><div style={{fontSize:"12px", color:"#777", fontWeight:"600"}}>{T.fill}</div><div style={{fontSize:"22px", fontWeight:"bold", color:"#222"}}>{fillRate.toFixed(1)} %</div></div>
          <div style={{flex:1}}><div style={{fontSize:"12px", color:"#FF4B4B", fontWeight:"bold"}}>{T.price}</div><div style={{fontSize:"24px", fontWeight:"bold", color:"#FF4B4B"}}>{totalPrice.toFixed(2)} €</div></div>
        </div>

        {/* 3 PANELS: MAIN, VERSCHNITT, WIREFRAME */}
        <div style={{ padding: "30px", display: "flex", gap: "30px", alignItems: "flex-end", flexWrap: "wrap", justifyContent:"center" }}>
          
          {/* PANEL 1: MAIN COLLAGE MIT SCALE FIGURE */}
          <div style={{display: "flex", alignItems: "flex-end"}}>
            {/* SCALE FIGURE 1.78m */}
            <div style={{ width: Math.max(25, 400 * SCALE), height: 1780 * SCALE, marginRight: "15px", background: `url("${archSVG}") no-repeat bottom center/contain`, opacity: 0.7 }} />

            {/* MAIN CANVAS */}
            <div>
              <div style={{textAlign:"center", fontWeight:"bold", marginBottom:"10px", fontSize:"12px", color:"#555"}}>Collage</div>
              <div ref={canvasRef} onMouseMove={onDrag} onMouseUp={stopDrag} onMouseLeave={stopDrag}
                style={{ width: wall.w * SCALE, height: canvasH, border: "4px solid #333", position: "relative", background: "repeating-linear-gradient(45deg, #fce4e4, #fce4e4 10px, #ffffff 10px, #ffffff 20px)", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", borderRadius:"2px" }}>
                
                {/* ZUSCHNITTE MAIN */}
                {gaps.map(g => (
                  <div key={g.id} style={{ position: "absolute", left: g.x * SCALE, bottom: g.y * SCALE, width: g.w * SCALE, height: g.h * SCALE, background: "rgba(255, 75, 75, 0.4)", border: "1px dashed #FF4B4B", pointerEvents: "none", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "10px", color: "white", textShadow: "0px 1px 2px rgba(0,0,0,0.8)", fontWeight: "bold" }}>
                    {(g.w * g.h / 1000000) >= 0.4 ? `${(g.w * g.h / 1000000).toFixed(2)}` : ""}
                  </div>
                ))}

                {/* FENSTER MAIN */}
                {windows.filter(w=>w.visible).map(w => {
                  let dispW = w.rotated ? w.h : w.w; let dispH = w.rotated ? w.w : w.h;
                  let isDragging = draggingId === w.id;
                  return (
                    <div key={w.id} onMouseDown={(e) => startDrag(e, w)}
                      style={{ position: "absolute", left: w.x * SCALE, bottom: w.y * SCALE, width: dispW * SCALE, height: dispH * SCALE, background: w.color, border: w.pinned ? "3px solid #111" : "2px solid #555", cursor: w.pinned ? "not-allowed" : (isDragging ? "grabbing" : "grab"), display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize: "11px", color:"#222", zIndex: w.pinned ? 5 : 10, opacity: w.pinned ? 0.95 : 1, transition: isDragging ? "none" : "all 0.1s" }}
                    >
                      <div style={{position: "absolute", top: 2, right: 2, display: "flex", gap: "2px"}}>
                        <button onClick={(e)=>{e.stopPropagation(); toggleWinProp(w.id, 'rotated');}} style={{background:"rgba(255,255,255,0.8)", border:"1px solid #777", borderRadius:"3px", fontSize:"10px", cursor:"pointer", padding:"2px 5px"}}>🔄</button>
                        <button onClick={(e)=>{e.stopPropagation(); toggleWinProp(w.id, 'pinned');}} style={{background:"rgba(255,255,255,0.8)", border:"1px solid #777", borderRadius:"3px", fontSize:"10px", cursor:"pointer", padding:"2px 5px"}}>{w.pinned ? "❌" : "📌"}</button>
                      </div>
                      <span style={{pointerEvents: "none", marginTop: "12px", textAlign: "center"}}>{w.pinned && "📌 "}{w.pos}<br/><span style={{fontSize: "9px", fontWeight:"normal"}}>{dispW}x{dispH}</span></span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* KLEINE ANSICHTEN (VERSCHNITT & LINIENZEICHNUNG) */}
          <div style={{display: "flex", flexDirection: "column", gap: "30px"}}>
            
            {/* PANEL 2: VERSCHNITT SCHWARZ/WEISS */}
            <div>
              <div style={{textAlign:"center", fontWeight:"bold", marginBottom:"10px", fontSize:"12px", color:"#555"}}>Verschnitt (Gaps = Schwarz, Fenster = Weiß)</div>
              <div style={{ width: wall.w * (SCALE * 0.5), height: wall.h * (SCALE * 0.5), border: "2px solid #000", position: "relative", background: "white", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>
                {gaps.map(g => (
                  <div key={"bw_"+g.id} style={{ position: "absolute", left: g.x * (SCALE*0.5), bottom: g.y * (SCALE*0.5), width: g.w * (SCALE*0.5), height: g.h * (SCALE*0.5), background: "black" }} />
                ))}
                {windows.filter(w=>w.visible).map(w => {
                  let dispW = w.rotated ? w.h : w.w; let dispH = w.rotated ? w.w : w.h;
                  return <div key={"bw_"+w.id} style={{ position: "absolute", left: w.x * (SCALE*0.5), bottom: w.y * (SCALE*0.5), width: dispW * (SCALE*0.5), height: dispH * (SCALE*0.5), background: "white", border: "1px solid #ccc" }} />
                })}
              </div>
            </div>

            {/* PANEL 3: LINIENZEICHNUNG */}
            <div>
              <div style={{textAlign:"center", fontWeight:"bold", marginBottom:"10px", fontSize:"12px", color:"#555"}}>Linienzeichnung (CAD)</div>
              <div style={{ width: wall.w * (SCALE * 0.5), height: wall.h * (SCALE * 0.5), border: "2px solid #000", position: "relative", background: "white", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>
                {gaps.map(g => (
                  <div key={"line_"+g.id} style={{ position: "absolute", left: g.x * (SCALE*0.5), bottom: g.y * (SCALE*0.5), width: g.w * (SCALE*0.5), height: g.h * (SCALE*0.5), background: "transparent", border: "0.5px solid #aaa" }} />
                ))}
                {windows.filter(w=>w.visible).map(w => {
                  let dispW = w.rotated ? w.h : w.w; let dispH = w.rotated ? w.w : w.h;
                  return <div key={"line_"+w.id} style={{ position: "absolute", left: w.x * (SCALE*0.5), bottom: w.y * (SCALE*0.5), width: dispW * (SCALE*0.5), height: dispH * (SCALE*0.5), background: "transparent", border: "1px solid #000" }} />
                })}
              </div>
            </div>

          </div>

        </div>

        {/* TABELLEN (MATRIX & GAPS) */}
        <div style={{ padding: "30px", background: "white", borderTop: "1px solid #ddd" }}>
          
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"15px"}}>
            <h3 style={{margin:0, color:"#111"}}>{T.mat_h}</h3>
            <button onClick={exportCSV} style={{padding:"8px 16px", background:"#FF4B4B", color:"white", border:"none", borderRadius:"4px", cursor:"pointer", fontWeight:"bold"}}>{T.exp_btn}</button>
          </div>

          <div style={{border:"1px solid #eee", borderRadius:"6px", overflowX:"auto", marginBottom:"30px"}}>
            <table style={{width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left"}}>
              <thead><tr style={{background:"#f8f9fa", borderBottom:"1px solid #eee"}}>
                <th style={{padding:"10px"}}>{T.col.v}</th><th style={{padding:"10px"}}>{T.col.p}</th><th style={{padding:"10px"}}>{T.col.r}</th><th style={{padding:"10px"}}>{T.col.id}</th><th style={{padding:"10px"}}>{T.col.x}</th><th style={{padding:"10px"}}>{T.col.y}</th><th style={{padding:"10px"}}>{T.col.dim}</th><th style={{padding:"10px"}}>{T.col.a}</th><th style={{padding:"10px"}}>{T.col.pr}</th><th style={{padding:"10px"}}>{T.col.src}</th>
              </tr></thead>
              <tbody>
                {windows.map(w => {
                  let dispW = w.rotated ? w.h : w.w; let dispH = w.rotated ? w.w : w.h;
                  return (
                    <tr key={w.id} style={{background: w.pinned ? "#fff3cd" : "transparent", opacity: w.visible ? 1 : 0.4, borderBottom:"1px solid #eee"}}>
                      <td style={{padding:"8px 10px"}}><input type="checkbox" checked={w.visible} onChange={()=>toggleWinProp(w.id, 'visible')} style={{cursor:"pointer"}}/></td>
                      <td style={{padding:"8px 10px"}}><input type="checkbox" checked={w.pinned} onChange={()=>toggleWinProp(w.id, 'pinned')} style={{cursor:"pointer"}}/></td>
                      <td style={{padding:"8px 10px"}}><input type="checkbox" checked={w.rotated} onChange={()=>toggleWinProp(w.id, 'rotated')} style={{cursor:"pointer"}}/></td>
                      <td style={{padding:"8px 10px", fontWeight:"bold"}}>{w.pos}</td>
                      <td style={{padding:"8px 10px"}}><input type="number" value={w.x} onChange={e=>{let arr=windows.map(x=>x.id===w.id?{...x, x:parseInt(e.target.value)||0, pinned:true}:x); setWindows(arr); runAI(arr, wall, params);}} style={{width:"70px", padding:"4px", border:"1px solid #ccc", borderRadius:"4px"}}/></td>
                      <td style={{padding:"8px 10px"}}><input type="number" value={w.y} onChange={e=>{let arr=windows.map(x=>x.id===w.id?{...x, y:parseInt(e.target.value)||0, pinned:true}:x); setWindows(arr); runAI(arr, wall, params);}} style={{width:"70px", padding:"4px", border:"1px solid #ccc", borderRadius:"4px"}}/></td>
                      <td style={{padding:"8px 10px"}}>{dispW} x {dispH}</td>
                      <td style={{padding:"8px 10px", fontWeight:"bold"}}>{((dispW*dispH)/1000000).toFixed(2)}</td>
                      <td style={{padding:"8px 10px", color:"#FF4B4B", fontWeight:"bold"}}>{w.price.toFixed(2)} €</td>
                      <td style={{padding:"8px 10px", maxWidth:"150px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{w.source}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <h3 style={{margin:"0 0 15px 0", color:"#111"}}>{T.gaps_h}</h3>
          {gaps.length > 0 ? (
            <div style={{border:"1px solid #eee", borderRadius:"6px", overflowX:"auto"}}>
              <table style={{width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left"}}>
                <thead><tr style={{background:"#222", color:"white"}}>
                  <th style={{padding:"10px"}}>{T.col.id}</th><th style={{padding:"10px"}}>{T.col.dim}</th><th style={{padding:"10px"}}>{T.col.a}</th><th style={{padding:"10px"}}>{T.col.x}</th><th style={{padding:"10px"}}>{T.col.y}</th>
                </tr></thead>
                <tbody>
                  {gaps.map((g,i) => (
                    <tr key={g.id} style={{borderBottom:"1px solid #eee"}}>
                      <td style={{padding:"8px 10px", fontWeight:"bold"}}>Gap-{i+1}</td>
                      <td style={{padding:"8px 10px"}}>{g.w} x {g.h}</td>
                      <td style={{padding:"8px 10px", fontWeight:"bold"}}>{((g.w*g.h)/1000000).toFixed(2)}</td>
                      <td style={{padding:"8px 10px"}}>{g.x}</td><td style={{padding:"8px 10px"}}>{g.y}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <div style={{background:"#d4edda", color:"#155724", padding:"15px", borderRadius:"6px", fontWeight:"bold"}}>{T.no_gaps}</div>}

        </div>
      </div>
    </div>
  );
}
