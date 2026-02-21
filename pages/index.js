import React, { useState, useRef, useEffect } from 'react';

// --- WÖRTERBUCH (9 Sprachen) ---
const LANGS = {
  "🇩🇪 DE": { title: "🧱 Facade Generator Pro", search_h: "1. Suche", c_land: "Land", c_zip: "PLZ", c_rad: "Radius", reuse: "Gebraucht", new: "Neu", btn_search: "Suchen", cust_h: "2. Eigenbestand", w_lbl: "Breite", h_lbl: "Höhe", btn_add: "Hinzufügen", wall_h: "Wandöffnung (mm)", btn_shuf: "🎲 Neu Clustern (KI)", btn_gaps: "✂️ Zuschnitte drehen", lock: "🔒 Pin behalten", sym: "📐 Symmetrie", chaos: "Chaos (%)", wall_a: "Wandfläche", win_a: "Fensterfläche", fill: "Füllgrad", price: "Gesamtpreis", mat_h: "📋 Fenster Matrix", exp_btn: "📥 CSV Export", gaps_h: "🟥 Benötigte Zuschnitte", no_gaps: "Wand perfekt gefüllt!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Maße", a:"m²", src:"Herkunft", pr:"Preis", l:"Link"} },
  "🇪🇸 ES": { title: "🧱 Generador de Fachadas", search_h: "1. Búsqueda", c_land: "País", c_zip: "C.P.", c_rad: "Radio", reuse: "Usado", new: "Nuevo", btn_search: "Buscar", cust_h: "2. Inventario Propio", w_lbl: "Ancho", h_lbl: "Alto", btn_add: "Añadir", wall_h: "Muro (mm)", btn_shuf: "🎲 Reagrupar", btn_gaps: "✂️ Rotar cortes", lock: "🔒 Bloquear Pines", sym: "📐 Simetría", chaos: "Caos", wall_a: "Área Muro", win_a: "Área Vent.", fill: "Relleno", price: "Precio Total", mat_h: "📋 Matriz", exp_btn: "📥 Exportar CSV", gaps_h: "🟥 Paneles de Relleno", no_gaps: "Sin huecos!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dim", a:"m²", src:"Origen", pr:"Precio", l:"Link"} },
  "🇬🇧 EN": { title: "🧱 Facade Generator Pro", search_h: "1. Search", c_land: "Country", c_zip: "ZIP", c_rad: "Radius", reuse: "Used", new: "New", btn_search: "Search", cust_h: "2. Custom Inventory", w_lbl: "Width", h_lbl: "Height", btn_add: "Add", wall_h: "Wall Opening (mm)", btn_shuf: "🎲 Shuffle", btn_gaps: "✂️ Toggle Gaps", lock: "🔒 Keep Pinned", sym: "📐 Symmetry", chaos: "Chaos", wall_a: "Wall Area", win_a: "Window Area", fill: "Fill Rate", price: "Total Price", mat_h: "📋 Matrix", exp_btn: "📥 CSV Export", gaps_h: "🟥 Gap Panels", no_gaps: "No gaps needed!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dims", a:"m²", src:"Source", pr:"Price", l:"Link"} },
  "🇫🇷 FR": { title: "🧱 Générateur de Façade", search_h: "1. Recherche", c_land: "Pays", c_zip: "CP", c_rad: "Rayon", reuse: "Usagé", new: "Neuf", btn_search: "Chercher", cust_h: "2. Inventaire", w_lbl: "Largeur", h_lbl: "Hauteur", btn_add: "Ajouter", wall_h: "Mur (mm)", btn_shuf: "🎲 Mélanger", btn_gaps: "✂️ Alterner", lock: "🔒 Garder Pins", sym: "📐 Symétrie", chaos: "Chaos", wall_a: "Surface Mur", win_a: "Surface Fen.", fill: "Remplissage", price: "Prix", mat_h: "📋 Matrice", exp_btn: "📥 CSV", gaps_h: "🟥 Panneaux", no_gaps: "Parfait!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dim", a:"m²", src:"Source", pr:"Prix", l:"Lien"} },
  "🇮🇹 IT": { title: "🧱 Generatore Facciate", search_h: "1. Ricerca", c_land: "Paese", c_zip: "CAP", c_rad: "Raggio", reuse: "Usato", new: "Nuovo", btn_search: "Cerca", cust_h: "2. Inventario", w_lbl: "Largh.", h_lbl: "Altezza", btn_add: "Aggiungi", wall_h: "Muro (mm)", btn_shuf: "🎲 Rimescola", btn_gaps: "✂️ Tagli", lock: "🔒 Mantieni Pin", sym: "📐 Simmetria", chaos: "Caos", wall_a: "Area Muro", win_a: "Area Fin.", fill: "Riempimento", price: "Prezzo", mat_h: "📋 Matrice", exp_btn: "📥 Export CSV", gaps_h: "🟥 Pannelli", no_gaps: "Perfetto!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dim", a:"m²", src:"Fonte", pr:"Prezzo", l:"Link"} },
  "🇨🇭 RM": { title: "🧱 Generatur Façadas", search_h: "Tschertga", c_land: "Pajais", c_zip: "PLZ", c_rad: "Radius", reuse: "Duvrà", new: "Nov", btn_search: "Tschertgar", cust_h: "Inventari", w_lbl: "Ladezza", h_lbl: "Autezza", btn_add: "Agiuntar", wall_h: "Paraid (mm)", btn_shuf: "Maschadar", btn_gaps: "Panels", lock: "Fixar", sym: "Simetria", chaos: "Caos", wall_a: "Paraid", win_a: "Fanestra", fill: "Emplenida", price: "Pretsch", mat_h: "Matrix", exp_btn: "CSV", gaps_h: "Panels", no_gaps: "Perfegt!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dim", a:"m²", src:"Funt.", pr:"Pretsch", l:"Link"} },
  "🇧🇬 BG": { title: "🧱 Генератор на фасади", search_h: "Търсене", c_land: "Държава", c_zip: "ПК", c_rad: "Радиус", reuse: "Стари", new: "Нови", btn_search: "Търси", cust_h: "Инвентар", w_lbl: "Ширина", h_lbl: "Височина", btn_add: "Добави", wall_h: "Стена (мм)", btn_shuf: "Разбъркай", btn_gaps: "Панели", lock: "Заключи", sym: "Симетрия", chaos: "Хаос", wall_a: "Площ Стена", win_a: "Площ Проз.", fill: "Запълване", price: "Цена", mat_h: "Матрица", exp_btn: "CSV", gaps_h: "Панели", no_gaps: "Идеално!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Разм", a:"m²", src:"Източник", pr:"Цена", l:"Линк"} },
  "🇮🇱 HE": { title: "🧱 מחולל חזיתות", search_h: "חיפוש", c_land: "מדינה", c_zip: "מיקוד", c_rad: "רדיוס", reuse: "ישן", new: "חדש", btn_search: "חפש", cust_h: "מלאי", w_lbl: "רוחב", h_lbl: "גובה", btn_add: "הוסף", wall_h: "קיר (מ״מ)", btn_shuf: "ערבב", btn_gaps: "פאנלים", lock: "נעל", sym: "סימטריה", chaos: "כאוס", wall_a: "שטח קיר", win_a: "שטח חלונות", fill: "מילוי", price: "מחיר", mat_h: "טבלה", exp_btn: "CSV", gaps_h: "פאנלים", no_gaps: "מושלם!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"מידות", a:"m²", src:"מקור", pr:"מחיר", l:"לינק"} },
  "🇯🇵 JA": { title: "🧱 ファサードジェネレーター", search_h: "検索", c_land: "国", c_zip: "郵便番号", c_rad: "半径", reuse: "中古", new: "新品", btn_search: "検索", cust_h: "在庫", w_lbl: "幅", h_lbl: "高さ", btn_add: "追加", wall_h: "壁 (mm)", btn_shuf: "シャッフル", btn_gaps: "パネル切替", lock: "ピン固定", sym: "対称", chaos: "カオス", wall_a: "壁面積", win_a: "窓面積", fill: "充填率", price: "価格", mat_h: "マトリックス", exp_btn: "CSV出力", gaps_h: "パネル", no_gaps: "完璧！", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"寸法", a:"m²", src:"ソース", pr:"価格", l:"リンク"} }
};

// --- DETAILLIERTE ARCHITEKTUR-FIGUR (1,78m Mensch im Seitenprofil/Grundriss-Stil) ---
const ARCH_FIGURE_SVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 350'><path d='M45,20 C45,10 55,10 55,20 C55,30 45,30 45,20 Z M40,35 C40,35 60,35 60,35 L65,100 L55,100 L55,150 L60,320 L50,320 L45,180 L40,180 L35,320 L25,320 L30,150 L30,100 L20,100 L25,35 C25,35 40,35 40,35 Z' fill='%23111'/></svg>";

export default function App() {
  const [lang, setLang] = useState("🇩🇪 DE");
  const T = LANGS[lang];

  const [searchParams, setSearch] = useState({ land: "Deutschland", zip: "10115", radius: 50, reuse: true, new: false });
  const [customWin, setCustomWin] = useState({ w: 1000, h: 1200 });

  const [wall, setWall] = useState({ w: 4000, h: 3000 });
  const [windows, setWindows] = useState([]);
  const [gaps, setGaps] = useState([]);
  
  const [draggingId, setDraggingId] = useState(null);
  const [seed, setSeed] = useState(42);
  const [gapToggle, setGapToggle] = useState(false);
  const [lockPinned, setLockPinned] = useState(true);
  const [symmetry, setSymmetry] = useState(false);
  const [chaos, setChaos] = useState(10);
  
  const canvasRef = useRef(null);
  const [posCounter, setPosCounter] = useState(1);

  // Layout Dynamisch skalieren (Wir machen es kleiner, um 3 Ansichten nebeneinander zu zeigen)
  const MAX_VIEW_WIDTH = 450;
  const SCALE = MAX_VIEW_WIDTH / Math.max(wall.w, 1);
  const canvas_h = wall.h * SCALE;

  const performSearch = async () => {
    try {
      const q = new URLSearchParams(searchParams).toString();
      const res = await fetch(`/api/search?${q}`);
      const data = await res.json();
      
      let c = posCounter;
      const initialWins = data.results.map((r) => {
        const item = { ...r, pos_label: `P${c}`, x: 0, y: 0, is_pinned: false, rotated: false, visible: true, force: false };
        c++; return item;
      });
      setPosCounter(c);
      setWindows(initialWins);
      triggerAI(initialWins);
    } catch (e) { console.error(e); }
  };

  const addCustomWindow = () => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      pos_label: `P${posCounter}`,
      w: customWin.w, h: customWin.h, type: "Fenster", color: "#90EE90", price: 0, source: "Lager", link: "",
      x: 0, y: 0, is_pinned: false, rotated: false, visible: true, force: true
    };
    setPosCounter(posCounter + 1);
    const updated = [...windows, newItem];
    setWindows(updated);
    triggerAI(updated);
  };

  const triggerAI = async (winsToProcess, forceSeed = seed, forceGap = gapToggle) => {
    const req = {
      wall_w: wall.w, wall_h: wall.h, windows: winsToProcess,
      symmetry: symmetry, chaos: chaos, seed: forceSeed, lock_pinned: lockPinned, toggle_gaps: forceGap
    };
    try {
      const res = await fetch("/api/cluster", {
        method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(req)
      });
      const data = await res.json();
      
      const newWindows = winsToProcess.map(w => {
        const placed = data.windows.find(p => p.id === w.id);
        if (placed) return { ...w, x: placed.x, y: placed.y, w: placed.w, h: placed.h, rotated: placed.rotated };
        return w;
      });
      setWindows(newWindows);
      setGaps(data.gaps);
    } catch (e) { console.error(e); }
  };

  const handleMouseDown = (e, id, is_pinned) => {
    if (is_pinned || e.target.tagName === 'BUTTON') return;
    setDraggingId(id);
  };
  const handleMouseMove = (e) => {
    if (!draggingId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const px_x = e.clientX - rect.left;
    const px_y = e.clientY - rect.top;
    let mm_x = Math.round(px_x / SCALE);
    let mm_y = Math.round((rect.height - px_y) / SCALE);
    setWindows(windows.map(w => w.id === draggingId ? { ...w, x: mm_x, y: mm_y } : w));
  };
  const handleMouseUp = () => {
    if (draggingId) {
      // Wenn das Fenster losgelassen wird, MUSS die KI es auf einen kollisionsfreien Platz snappen
      const updated = windows.map(w => w.id === draggingId ? { ...w, is_pinned: true } : w);
      setWindows(updated); setDraggingId(null); triggerAI(updated); 
    }
  };

  const updateProp = (id, prop, val) => {
    const updated = windows.map(w => w.id === id ? { ...w, [prop]: val } : w);
    setWindows(updated); triggerAI(updated);
  };
  const handleCoordChange = (id, axis, val) => {
    const updated = windows.map(w => w.id === id ? { ...w, [axis]: val, is_pinned: true } : w);
    setWindows(updated); triggerAI(updated);
  }

  const downloadCSV = () => {
    let rows = [ ["ID", "Typ", "Breite", "Hoehe", "m2", "Preis", "Herkunft"] ];
    windows.filter(w=>w.visible).forEach(w => rows.push([w.pos_label, w.type, w.w, w.h, ((w.w*w.h)/1000000).toFixed(2), w.price, w.source]));
    gaps.forEach((g,i) => rows.push([`Gap-${i+1}`, "Zuschnitt", g.w, g.h, ((g.w*g.h)/1000000).toFixed(2), "0", "-"]));
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a"); link.setAttribute("href", encodedUri); link.setAttribute("download", "stueckliste.csv");
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const totalPrice = windows.filter(w => w.visible).reduce((sum, w) => sum + w.price, 0);
  const winArea = windows.filter(w => w.visible).reduce((sum, w) => sum + (w.w * w.h), 0) / 1000000;
  const wallArea = (wall.w * wall.h) / 1000000;
  const fillRate = wallArea > 0 ? (winArea / wallArea) * 100 : 0;

  // --- DIE 3 RENDER-ANSICHTEN ---
  const renderWindows = (styleMode) => {
    return windows.filter(w => w.visible).map(w => {
      let bg = w.color;
      let border = w.is_pinned ? "3px solid #111" : "2px solid #555";
      let color = "#111";
      if (styleMode === "bw") { bg = "white"; border = "none"; color="transparent"; }
      if (styleMode === "line") { bg = "white"; border = "1px solid #111"; color="#111"; }

      return (
        <div key={w.id} onMouseDown={(e) => styleMode==="color" && handleMouseDown(e, w.id, w.is_pinned)}
          style={{
            position: "absolute", left: w.x * SCALE, bottom: w.y * SCALE,
            width: w.w * SCALE, height: w.h * SCALE,
            background: bg, border: border, color: color,
            cursor: w.is_pinned ? "not-allowed" : (draggingId === w.id ? "grabbing" : "grab"),
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
            fontWeight: "700", fontSize: "11px", zIndex: w.is_pinned ? 5 : 10,
          }}>
          {styleMode === "color" && (
            <>
              <div style={{position: "absolute", top: 2, right: 2, display: "flex", gap: "2px"}}>
                <button className="icon-btn" onClick={(e) => { e.stopPropagation(); updateProp(w.id, 'rotated', !w.rotated); }}>🔄</button>
                <button className="icon-btn" onClick={(e) => { e.stopPropagation(); updateProp(w.id, 'is_pinned', !w.is_pinned); }}>{w.is_pinned ? "❌" : "📌"}</button>
              </div>
              <span style={{pointerEvents: "none", marginTop: "12px", textAlign: "center", lineHeight: "1.1"}}>
                {w.is_pinned && "📌 "}{w.pos_label}<br/><span style={{fontSize: "9px"}}>{w.w}x{w.h}</span>
              </span>
            </>
          )}
        </div>
      );
    });
  };

  const renderGaps = (styleMode) => {
    return gaps.map(g => {
      let bg = "rgba(255, 75, 75, 0.4)";
      let border = "1px dashed #FF4B4B";
      if (styleMode === "bw") { bg = "black"; border = "none"; }
      if (styleMode === "line") { bg = "transparent"; border = "1px solid #ddd"; }
      
      return (
        <div key={g.id} style={{
          position: "absolute", left: g.x * SCALE, bottom: g.y * SCALE, 
          width: g.w * SCALE, height: g.h * SCALE,
          background: bg, border: border, pointerEvents: "none"
        }} />
      );
    });
  };

  return (
    <div style={styles.appContainer}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; background-color: #f0f2f6; margin: 0; color: #31333F; }
          .btn-primary { background: #111; color: white; border: none; padding: 10px 16px; border-radius: 4px; cursor: pointer; font-weight: 600; transition: 0.2s; width: 100%; margin-bottom: 10px; }
          .btn-primary:hover { background: #333; }
          .btn-secondary { background: white; color: #111; border: 1px solid #111; padding: 10px 16px; border-radius: 4px; cursor: pointer; font-weight: 600; transition: 0.2s; width: 100%; }
          .btn-secondary:hover { background: #f0f0f0; }
          .input-field { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: 'Inter'; font-size: 13px; margin-top: 4px; }
          .metric-card { background: white; padding: 15px; border-radius: 6px; border: 1px solid #eee; flex: 1; }
          .metric-title { font-size: 12px; color: #777; font-weight: 600; margin-bottom: 5px; }
          .metric-value { font-size: 22px; font-weight: 700; color: #111; margin: 0; }
          .icon-btn { background: rgba(255,255,255,0.9); border: 1px solid #ccc; border-radius: 2px; font-size: 10px; cursor: pointer; padding: 2px 4px; transition: 0.1s; }
          .icon-btn:hover { background: white; border-color: #111; }
        `}
      </style>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={{display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "15px"}}>
          {Object.keys(LANGS).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{background: lang === l ? "#111" : "#eee", color: lang === l ? "white" : "#333", border:"none", borderRadius:"4px", fontSize:"10px", padding:"4px 8px", cursor:"pointer", fontWeight:"600"}}>{l.split(" ")[0]}</button>
          ))}
        </div>
        <h2 style={{fontSize:"18px", margin:"0 0 20px 0"}}>{T.title}</h2>

        <div style={{background:"#f9f9f9", padding:"15px", borderRadius:"6px", marginBottom:"15px", border:"1px solid #eee"}}>
          <h4 style={{margin:"0 0 10px 0"}}>{T.search_h}</h4>
          <input className="input-field" placeholder={T.c_land} value={searchParams.land} onChange={e=>setSearch({...searchParams, land:e.target.value})} style={{marginBottom:"5px"}}/>
          <input className="input-field" placeholder={T.c_zip} value={searchParams.zip} onChange={e=>setSearch({...searchParams, zip:e.target.value})} style={{marginBottom:"10px"}}/>
          <button className="btn-primary" onClick={performSearch}>{T.btn_search}</button>
        </div>

        <div style={{background:"#f9f9f9", padding:"15px", borderRadius:"6px", marginBottom:"15px", border:"1px solid #eee"}}>
          <h4 style={{margin:"0 0 10px 0"}}>{T.cust_h}</h4>
          <div style={{display:"flex", gap:"10px", marginBottom:"10px"}}>
            <div><label style={{fontSize:"11px", fontWeight:"600"}}>{T.w_lbl}</label><input type="number" className="input-field" value={customWin.w} onChange={e=>setCustomWin({...customWin, w: parseInt(e.target.value)})} /></div>
            <div><label style={{fontSize:"11px", fontWeight:"600"}}>{T.h_lbl}</label><input type="number" className="input-field" value={customWin.h} onChange={e=>setCustomWin({...customWin, h: parseInt(e.target.value)})} /></div>
          </div>
          <button className="btn-secondary" onClick={addCustomWindow}>{T.btn_add}</button>
        </div>

        <div style={{background:"#f9f9f9", padding:"15px", borderRadius:"6px", border:"1px solid #eee"}}>
          <h4 style={{margin:"0 0 10px 0"}}>{T.wall_h}</h4>
          <div style={{display:"flex", gap:"10px", marginBottom:"5px", alignItems:"center"}}>
            <input type="range" min="1000" max="30000" step="100" value={wall.w} onChange={e=>{setWall({...wall, w:parseInt(e.target.value)}); triggerAI(windows);}} style={{flex:1}}/>
            <input type="number" className="input-field" value={wall.w} onChange={e=>{setWall({...wall, w:parseInt(e.target.value)||0}); triggerAI(windows);}} style={{width:"80px", margin:0}}/>
          </div>
          <div style={{display:"flex", gap:"10px", marginBottom:"15px", alignItems:"center"}}>
            <input type="range" min="1000" max="30000" step="100" value={wall.h} onChange={e=>{setWall({...wall, h:parseInt(e.target.value)}); triggerAI(windows);}} style={{flex:1}}/>
            <input type="number" className="input-field" value={wall.h} onChange={e=>{setWall({...wall, h:parseInt(e.target.value)||0}); triggerAI(windows);}} style={{width:"80px", margin:0}}/>
          </div>

          <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"5px"}}><input type="checkbox" checked={lockPinned} onChange={e=>setLockPinned(e.target.checked)}/> {T.lock}</label>
          <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"15px"}}><input type="checkbox" checked={symmetry} onChange={e=>{setSymmetry(e.target.checked); triggerAI(windows);}}/> {T.sym}</label>
          
          <button className="btn-primary" style={{background:"#0066cc"}} onClick={() => { const s = Math.random(); setSeed(s); triggerAI(windows, s); }}>{T.btn_shuf}</button>
          <button className="btn-secondary" onClick={() => { const t = !gapToggle; setGapToggle(t); triggerAI(windows, seed, t); }}>{T.btn_gaps}</button>
        </div>
      </div>

      {/* HAUPTBEREICH */}
      <div style={styles.mainArea}>
        
        {/* DASHBOARD METRICS */}
        <div style={styles.dashboard}>
          <div className="metric-card"><div className="metric-title">{T.wall_a}</div><div className="metric-value">{wallArea.toFixed(2)} m²</div></div>
          <div className="metric-card"><div className="metric-title">{T.win_a}</div><div className="metric-value">{winArea.toFixed(2)} m²</div></div>
          <div className="metric-card"><div className="metric-title">{T.fill}</div><div className="metric-value">{fillRate.toFixed(1)} %</div></div>
          <div className="metric-card" style={{borderLeft: "4px solid #111"}}><div className="metric-title">{T.price}</div><div className="metric-value" style={{color:"#111"}}>{totalPrice.toFixed(2)} €</div></div>
        </div>

        {/* 3 ANSICHTEN BEREICH */}
        <div style={{ display:"flex", gap:"30px", padding:"30px", alignItems:"flex-end", overflowX:"auto" }}>
          
          {/* SCALE FIGURE */}
          <div style={{ width: Math.max(20, 200 * SCALE), height: 1780 * SCALE, background: `url("${ARCH_FIGURE_SVG}") no-repeat bottom center/contain`, opacity: 0.8, flexShrink:0 }} title="Maßstabsfigur (1.78m)" />

          {/* 1. COLLAGE (Interaktiv) */}
          <div>
            <h4 style={{textAlign:"center", margin:"0 0 10px 0", color:"#555"}}>Collage</h4>
            <div ref={canvasRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
              style={{ width: wall.w * SCALE, height: canvas_h, border: "3px solid #111", position: "relative", background: "repeating-linear-gradient(45deg, #fce4e4, #fce4e4 10px, #ffffff 10px, #ffffff 20px)", boxShadow: "0 10px 20px rgba(0,0,0,0.1)", flexShrink:0 }}>
              {renderGaps("color")}
              {renderWindows("color")}
            </div>
          </div>

          {/* 2. SCHWARZ WEISS (Verschnitt) */}
          <div>
            <h4 style={{textAlign:"center", margin:"0 0 10px 0", color:"#555"}}>Verschnitt (S/W)</h4>
            <div style={{ width: wall.w * SCALE, height: canvas_h, border: "3px solid #111", position: "relative", background: "#fff", flexShrink:0 }}>
              {renderGaps("bw")}
              {renderWindows("bw")}
            </div>
          </div>

          {/* 3. LINIENZEICHNUNG */}
          <div>
            <h4 style={{textAlign:"center", margin:"0 0 10px 0", color:"#555"}}>Linienzeichnung</h4>
            <div style={{ width: wall.w * SCALE, height: canvas_h, border: "3px solid #111", position: "relative", background: "#fff", flexShrink:0 }}>
              {renderGaps("line")}
              {renderWindows("line")}
            </div>
          </div>

        </div>

        {/* TABELLEN BEREICH */}
        <div style={{ padding: "30px", background: "white", borderTop: "1px solid #e0e0e0" }}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"15px"}}>
            <h3 style={{margin:0}}>{T.mat_h}</h3>
            <button className="btn-primary" style={{width:"auto", margin:0}} onClick={downloadCSV}>{T.exp_btn}</button>
          </div>
          
          <div style={{background: "white", border: "1px solid #e0e0e0", borderRadius: "6px", overflowX: "auto", marginBottom:"30px"}}>
            <table style={{width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left"}}>
              <thead><tr style={{background: "#f9f9f9", borderBottom: "1px solid #ddd"}}>
                <th style={{padding:"12px"}}>{T.col.v}</th><th style={{padding:"12px"}}>{T.col.p}</th><th style={{padding:"12px"}}>{T.col.r}</th><th style={{padding:"12px"}}>{T.col.f}</th><th style={{padding:"12px"}}>{T.col.id}</th><th style={{padding:"12px"}}>{T.col.x}</th><th style={{padding:"12px"}}>{T.col.y}</th><th style={{padding:"12px"}}>{T.col.dim}</th><th style={{padding:"12px"}}>{T.col.a}</th><th style={{padding:"12px"}}>{T.col.pr}</th><th style={{padding:"12px"}}>{T.col.src}</th>
              </tr></thead>
              <tbody>
                {windows.map(w => (
                  <tr key={w.id} style={{ background: w.is_pinned ? "#fffbe6" : "transparent", opacity: w.visible ? 1 : 0.4, borderBottom: "1px solid #eee" }}>
                    <td style={{padding:"8px 12px"}}><input type="checkbox" checked={w.visible} onChange={(e)=>updateProp(w.id, 'visible', e.target.checked)}/></td>
                    <td style={{padding:"8px 12px"}}><input type="checkbox" checked={w.is_pinned} onChange={()=>togglePin(w.id)}/></td>
                    <td style={{padding:"8px 12px"}}><input type="checkbox" checked={w.rotated} onChange={(e)=>updateProp(w.id, 'rotated', e.target.checked)}/></td>
                    <td style={{padding:"8px 12px"}}><input type="checkbox" checked={w.force} onChange={(e)=>updateProp(w.id, 'force', e.target.checked)}/></td>
                    <td style={{padding:"8px 12px", fontWeight:"600"}}>{w.pos_label}</td>
                    <td style={{padding:"8px 12px"}}><input type="number" className="input-field" style={{margin:0, padding:"6px", width:"70px"}} value={w.x} onChange={(e)=>handleCoordChange(w.id, 'x', parseInt(e.target.value)||0)}/></td>
                    <td style={{padding:"8px 12px"}}><input type="number" className="input-field" style={{margin:0, padding:"6px", width:"70px"}} value={w.y} onChange={(e)=>handleCoordChange(w.id, 'y', parseInt(e.target.value)||0)}/></td>
                    <td style={{padding:"8px 12px"}}>{w.w} x {w.h}</td>
                    <td style={{padding:"8px 12px"}}>{((w.w*w.h)/1000000).toFixed(2)}</td>
                    <td style={{padding:"8px 12px", fontWeight:"600"}}>{w.price.toFixed(2)} €</td>
                    <td style={{padding:"8px 12px", maxWidth:"150px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{w.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 style={{margin:"0 0 15px 0"}}>{T.gaps_h}</h3>
          {gaps.length > 0 ? (
            <div style={{background: "white", border: "1px solid #e0e0e0", borderRadius: "6px", overflowX: "auto"}}>
              <table style={{width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left"}}>
                <thead><tr style={{background: "#f9f9f9", borderBottom: "1px solid #ddd"}}>
                  <th style={{padding:"12px"}}>{T.col.id}</th><th style={{padding:"12px"}}>{T.col.dim}</th><th style={{padding:"12px"}}>{T.col.a}</th><th style={{padding:"12px"}}>{T.col.x}</th><th style={{padding:"12px"}}>{T.col.y}</th>
                </tr></thead>
                <tbody>
                  {gaps.map((g, i) => (
                    <tr key={g.id} style={{borderBottom: "1px solid #eee"}}>
                      <td style={{padding:"8px 12px", fontWeight:"600"}}>Gap-{i+1}</td>
                      <td style={{padding:"8px 12px"}}>{g.w} x {g.h}</td>
                      <td style={{padding:"8px 12px", fontWeight:"600"}}>{((g.w*g.h)/1000000).toFixed(2)}</td>
                      <td style={{padding:"8px 12px"}}>{g.x}</td><td style={{padding:"8px 12px"}}>{g.y}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <div style={{padding:"15px", background:"#f0fdf4", color:"#155724", border:"1px solid #c3e6cb", borderRadius:"6px", fontWeight:"600"}}>{T.no_gaps}</div>}

        </div>
      </div>
    </div>
  );
}

const styles = {
  appContainer: { display: "flex", height: "100vh", overflow: "hidden" },
  sidebar: { width: "320px", background: "#ffffff", borderRight: "1px solid #e0e0e0", padding: "20px", overflowY: "auto", boxShadow: "2px 0 10px rgba(0,0,0,0.03)", zIndex: 100 },
  mainArea: { flex: 1, display: "flex", flexDirection: "column", background: "#F4F6F8", overflowY: "auto" },
  dashboard: { display: "flex", gap: "20px", padding: "25px 30px", background: "white", borderBottom: "1px solid #e0e0e0", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }
};
