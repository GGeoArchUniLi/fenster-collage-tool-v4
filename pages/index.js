import React, { useState, useRef, useEffect } from 'react';

// --- WÖRTERBUCH (Alle Sprachen) ---
const LANGS = {
  "🇩🇪 DE": { title: "🧱 Facade AI Pro v6", search_h: "1. Globale Suche", c_land: "Land", c_zip: "PLZ", c_rad: "Radius", reuse: "Gebraucht", new: "Neu", btn_search: "Suche", cust_h: "2. Eigenbestand", w_lbl: "Breite", h_lbl: "Höhe", btn_add: "Hinzufügen", wall_h: "Wand & KI-Steuerung", btn_shuf: "🎲 Zufällig Clustern", btn_opt: "✨ Vorschläge (Wenig Verschnitt)", btn_gaps: "✂️ Zuschnitt drehen", lock: "🔒 Pin behalten", sym: "📐 Symmetrie", chaos: "Chaos", wall_a: "Wand", win_a: "Fenster", fill: "Füllgrad", price: "Gesamt", mat_h: "📋 Fenster Matrix", exp_btn: "📥 CSV", gaps_h: "🟥 Zuschnitte", no_gaps: "Kein Verschnitt!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Maße", a:"m²", src:"Herkunft", pr:"Preis", l:"Link"} },
  "🇬🇧 EN": { title: "🧱 Facade AI Pro v6", search_h: "1. Global Search", c_land: "Country", c_zip: "ZIP", c_rad: "Radius", reuse: "Used", new: "New", btn_search: "Search", cust_h: "2. Custom", w_lbl: "Width", h_lbl: "Height", btn_add: "Add", wall_h: "Wall & AI Control", btn_shuf: "🎲 Shuffle", btn_opt: "✨ Suggest (Min Gaps)", btn_gaps: "✂️ Toggle Gaps", lock: "🔒 Keep Pinned", sym: "📐 Symmetry", chaos: "Chaos", wall_a: "Wall", win_a: "Windows", fill: "Fill Rate", price: "Total", mat_h: "📋 Matrix", exp_btn: "📥 CSV", gaps_h: "🟥 Gaps", no_gaps: "Perfect fit!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dims", a:"m²", src:"Source", pr:"Price", l:"Link"} },
  "🇪🇸 ES": { title: "🧱 Fachada AI Pro", search_h: "1. Buscar", c_land: "País", c_zip: "C.P.", c_rad: "Radio", reuse: "Usado", new: "Nuevo", btn_search: "Buscar", cust_h: "2. Propio", w_lbl: "Ancho", h_lbl: "Alto", btn_add: "Añadir", wall_h: "Muro e IA", btn_shuf: "🎲 Aleatorio", btn_opt: "✨ Sugerir (Sin recortes)", btn_gaps: "✂️ Rotar Cortes", lock: "🔒 Bloquear Pines", sym: "📐 Simetría", chaos: "Caos", wall_a: "Muro", win_a: "Ventanas", fill: "Relleno", price: "Total", mat_h: "📋 Matriz", exp_btn: "📥 CSV", gaps_h: "🟥 Recortes", no_gaps: "Perfecto!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dim", a:"m²", src:"Origen", pr:"Precio", l:"Link"} }
};

export default function App() {
  const [lang, setLang] = useState("🇩🇪 DE");
  const T = LANGS[lang] || LANGS["🇩🇪 DE"];

  const [searchParams, setSearch] = useState({ land: "Deutschland", zip: "10115", reuse: true, new: false });
  const [customWin, setCustomWin] = useState({ w: 1000, h: 1200 });

  const [wall, setWall] = useState({ w: 4000, h: 3000 });
  const [windows, setWindows] = useState([]);
  const [gaps, setGaps] = useState([]);
  const [counter, setCounter] = useState(1);
  const [params, setParams] = useState({ symmetry: false, chaos: 10, lock: true, gapToggle: false });
  
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({x: 0, y: 0});
  const canvasRef = useRef(null);

  // --- DATENBANK ---
  const performSearch = () => {
    const stdSizes = [ [800,1000], [1000,1200], [1200,1400], [2000,2100], [600,800], [1500,1500] ];
    let results = [];
    let c = counter;
    const numToGen = Math.floor(Math.random() * 5) + 5;
    for(let i=0; i<numToGen; i++) {
        const size = stdSizes[Math.floor(Math.random() * stdSizes.length)];
        const isReuse = searchParams.reuse && (!searchParams.new || Math.random() > 0.5);
        results.push({
            id: Math.random().toString(36).substr(2, 9), pos: `P${c++}`,
            w: size[0], h: size[1], x: 0, y: 0,
            price: isReuse ? (size[0]*size[1])/25000 + 20 : (size[0]*size[1])/15000 + 100,
            color: isReuse ? "#4682b4" : "#add8e6", 
            source: isReuse ? `Re-Use ${searchParams.zip}` : `Shop ${searchParams.land}`,
            type: "Fenster", pinned: false, rotated: false, visible: true, force: false
        });
    }
    setCounter(c);
    const newWins = [...windows, ...results];
    setWindows(newWins);
    runAI(newWins, wall, params);
  };

  useEffect(() => { performSearch(); }, []);

  // --- CORE MATHEMATIK ---
  const checkOverlap = (x, y, w, h, placedList, ignoreId = null) => {
    return placedList.some(p => {
        if(p.id === ignoreId) return false;
        return !(x + w <= p.x || x >= p.x + p.w || y + h <= p.y || y >= p.y + p.h);
    });
  };

  const calculateGapsExact = (wall_w, wall_h, placed, toggle_dir) => {
    let x_set = new Set([0, wall_w]); let y_set = new Set([0, wall_h]);
    placed.forEach(p => { x_set.add(p.x); x_set.add(p.x + p.w); y_set.add(p.y); y_set.add(p.y + p.h); });
    let xs = Array.from(x_set).sort((a,b)=>a-b); let ys = Array.from(y_set).sort((a,b)=>a-b);
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
            let cw = 0, valid = true;
            while(c+cw < xs.length-1 && valid) { for(let ir=r; ir<r+ch; ir++) if(grid[ir][c+cw]) valid = false; if(valid) cw++; }
            for(let ir=r; ir<r+ch; ir++) for(let ic=c; ic<c+cw; ic++) grid[ir][ic] = true;
            newGaps.push({ id: Math.random().toString(), x: xs[c], y: ys[r], w: xs[c+cw]-xs[c], h: ys[r+ch]-ys[r] });
          } else {
            let cw = 0; while(c+cw < xs.length-1 && !grid[r][c+cw]) cw++;
            let ch = 0, valid = true;
            while(r+ch < ys.length-1 && valid) { for(let ic=c; ic<c+cw; ic++) if(grid[r+ch][ic]) valid = false; if(valid) ch++; }
            for(let ir=r; ir<r+ch; ir++) for(let ic=c; ic<c+cw; ic++) grid[ir][ic] = true;
            newGaps.push({ id: Math.random().toString(), x: xs[c], y: ys[r], w: xs[c+cw]-xs[c], h: ys[r+ch]-ys[r] });
          }
        }
      }
    }
    return newGaps;
  };

  const runAI = (winList, currentWall, currentParams) => {
    let placed = []; let fixed_x = [], fixed_y = [];
    
    // 1. Gepinnte (mit Kollisions-Korrektur!)
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
          // HARTE KORREKTUR BEI ÜBERLAPPUNG
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

    if(placed.length > 0 && fixed_x.length === 0) {
      let minX = Math.min(...placed.map(p=>p.x)), maxX = Math.max(...placed.map(p=>p.x+p.w));
      let minY = Math.min(...placed.map(p=>p.y)), maxY = Math.max(...placed.map(p=>p.y+p.h));
      let sx = Math.floor((currentWall.w - (maxX - minX)) / 2) - minX;
      let sy = Math.floor((currentWall.h - (maxY - minY)) / 2) - minY;
      placed = placed.map(p => ({...p, x: p.x+sx, y: p.y+sy}));
    }

    setGaps(calculateGapsExact(currentWall.w, currentWall.h, placed, currentParams.gapToggle));
    setWindows(winList.map(w => {
      let p = placed.find(pl => pl.id === w.id);
      if(p) return {...w, x: p.x, y: p.y}; 
      return w;
    }));
  };

  // --- DAS NEUE "VORSCHLÄGE" FEATURE (Optimiere Verschnitt) ---
  const autoOptimize = () => {
    let tempWins = windows.map(w => ({...w, pinned: false}));
    tempWins.sort((a,b) => (b.w*b.h) - (a.w*a.h)); // Größte zuerst

    let placed = [];
    let cx = wall.w / 2; let cy = wall.h / 2;

    // Harte, enge Packung in die Mitte
    tempWins.forEach(w => {
        if(!w.visible) return;
        let eff_w = w.rotated ? w.h : w.w; let eff_h = w.rotated ? w.w : w.h;
        let bestPos = null, minScore = Infinity;
        for(let y=0; y<=wall.h - eff_h; y+=50) { // Sehr feiner Step
            for(let x=0; x<=wall.w - eff_w; x+=50) {
                if(!checkOverlap(x, y, eff_w, eff_h, placed)) {
                    let score = Math.pow(x+eff_w/2 - cx, 2) + Math.pow(y+eff_h/2 - cy, 2);
                    if(score < minScore) { minScore = score; bestPos = {...w, x:x, y:y, w:eff_w, h:eff_h}; }
                }
            }
        }
        if(bestPos) placed.push(bestPos);
    });

    if(placed.length === 0) return;

    // Messe den exakten Bounding-Box Rand des Clusters
    let minX = Math.min(...placed.map(w => w.x));
    let minY = Math.min(...placed.map(w => w.y));
    let maxX = Math.max(...placed.map(w => w.x + w.w));
    let maxY = Math.max(...placed.map(w => w.y + w.h));

    // Passe die Wand genau an diese Box an!
    let newW = maxX - minX;
    let newH = maxY - minY;

    let finalWins = windows.map(w => {
        let p = placed.find(pl => pl.id === w.id);
        if(p) return { ...w, x: p.x - minX, y: p.y - minY, pinned: true }; // Pinnt sie an den neuen 0,0 Punkt
        return w;
    });

    setWall({ w: newW, h: newH });
    setWindows(finalWins);
    
    let finalPlaced = finalWins.filter(w=>w.visible).map(w=>({...w, w: w.rotated?w.h:w.w, h: w.rotated?w.w:w.h}));
    setGaps(calculateGapsExact(newW, newH, finalPlaced, params.gapToggle));
  };

  // --- DRAG & DROP LOGIK ---
  // Skalierung für das TOP Panel. Wir erzwingen eine max Höhe, damit die Tabellen drunter sichtbar bleiben.
  const MAX_CANVAS_W = 600; const MAX_CANVAS_H = 350;
  const SCALE = Math.min(MAX_CANVAS_W / Math.max(wall.w, 1), MAX_CANVAS_H / Math.max(wall.h, 1));
  const canvasH = wall.h * SCALE;

  const startDrag = (e, w) => {
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
    
    let mmX = Math.round(px_x / SCALE);
    let mmY = Math.round((canvasH - px_y - (eff_h*SCALE)) / SCALE); 
    setWindows(windows.map(w => w.id === draggingId ? {...w, x: mmX, y: mmY} : w));
  };
  const stopDrag = () => {
    if(draggingId) {
      // Wenn losgelassen wird: Pin setzen und KI Korrektur (verhindert Überlappung) ausführen!
      const updated = windows.map(w => w.id === draggingId ? {...w, pinned: true} : w);
      setDraggingId(null);
      runAI(updated, wall, params);
    }
  };

  const toggleWinProp = (id, prop) => {
    const updated = windows.map(w => w.id === id ? {...w, [prop]: !w[prop]} : w);
    runAI(updated, wall, params);
  };
  
  const handleWallChange = (key, val) => {
    const newWall = {...wall, [key]: val || 0};
    setWall(newWall); runAI(windows, newWall, params);
  };

  const addCustom = () => {
    const nw = { id: Math.random().toString(), pos: `P${counter}`, w: customWin.w, h: customWin.h, x:0, y:0, price: 0, color: "#90EE90", source: "Eigenbestand", type: "Fenster", pinned: false, rotated: false, visible: true, force: true };
    setCounter(counter+1); runAI([...windows, nw], wall, params);
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

  // Schöne detaillierte Scale Figure (1,78m)
  const archSVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 280'><circle cx='50' cy='25' r='14' fill='%23111'/><path d='M35,50 Q50,40 65,50 L75,130 L65,130 L60,80 L55,130 L60,260 L45,260 L50,150 L45,150 L40,260 L25,260 L30,130 L25,80 L20,130 Z' fill='%23111'/></svg>`;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'Inter', sans-serif", backgroundColor: "#f0f2f6", color:"#222" }}>
      
      {/* SIDEBAR (LINKS) */}
      <div style={{ width: "320px", background: "#fff", borderRight: "1px solid #ddd", padding: "20px", overflowY: "auto", flexShrink: 0, zIndex: 100, boxShadow: "2px 0 10px rgba(0,0,0,0.05)" }}>
        <h2 style={{fontSize:"18px", marginTop:0, color:"#111", marginBottom: "20px"}}>{T.title}</h2>

        {/* Steuerung & KI (Neu geordnet) */}
        <div style={{background:"#f8f9fa", padding:"15px", borderRadius:"6px", border:"1px solid #e9ecef", marginBottom:"20px"}}>
          <h4 style={{margin:"0 0 10px 0"}}>{T.wall_h}</h4>
          
          <div style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"5px"}}>
             <input type="range" min="1000" max="30000" step="100" value={wall.w} onChange={e=>handleWallChange('w', parseInt(e.target.value))} style={{flex:1}}/>
             <input type="number" value={wall.w} onChange={e=>handleWallChange('w', parseInt(e.target.value))} style={{width:"70px", padding:"4px", border:"1px solid #ccc", borderRadius:"4px"}}/>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"15px"}}>
             <input type="range" min="1000" max="30000" step="100" value={wall.h} onChange={e=>handleWallChange('h', parseInt(e.target.value))} style={{flex:1}}/>
             <input type="number" value={wall.h} onChange={e=>handleWallChange('h', parseInt(e.target.value))} style={{width:"70px", padding:"4px", border:"1px solid #ccc", borderRadius:"4px"}}/>
          </div>

          <button onClick={autoOptimize} style={{width:"100%", padding:"10px", background:"linear-gradient(135deg, #FF4B4B, #FF2222)", color:"white", border:"none", borderRadius:"4px", cursor:"pointer", fontWeight:"bold", marginBottom:"10px", boxShadow:"0 2px 5px rgba(255,0,0,0.2)"}}>
            {T.btn_opt}
          </button>
          
          <button onClick={()=>{let p={...params, seed:Math.random()}; setParams(p); runAI(windows, wall, p);}} style={{width:"100%", padding:"10px", background:"#222", color:"white", border:"none", borderRadius:"4px", cursor:"pointer", fontWeight:"bold", marginBottom:"10px"}}>{T.btn_shuf}</button>
          <button onClick={()=>{let p={...params, gapToggle:!params.gapToggle}; setParams(p); runAI(windows, wall, p);}} style={{width:"100%", padding:"8px", background:"white", color:"#333", border:"1px solid #ccc", borderRadius:"4px", cursor:"pointer", fontWeight:"bold", marginBottom:"10px"}}>{T.btn_gaps}</button>

          <label style={{fontSize:"11px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"5px"}}><input type="checkbox" checked={params.lock} onChange={e=>{let p={...params, lock:e.target.checked}; setParams(p); runAI(windows, wall, p);}}/> {T.lock}</label>
          <label style={{fontSize:"11px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"5px"}}><input type="checkbox" checked={params.symmetry} onChange={e=>{let p={...params, symmetry:e.target.checked}; setParams(p); runAI(windows, wall, p);}}/> {T.sym}</label>
        </div>

        {/* Suche */}
        <div style={{background:"#f8f9fa", padding:"15px", borderRadius:"6px", marginBottom:"20px", border:"1px solid #e9ecef"}}>
          <h4 style={{margin:"0 0 10px 0"}}>{T.search_h}</h4>
          <input placeholder={T.c_land} value={searchParams.land} onChange={e=>setSearch({...searchParams, land:e.target.value})} style={{width:"100%", padding:"8px", marginBottom:"5px", border:"1px solid #ccc", borderRadius:"4px", fontSize:"12px"}}/>
          <input placeholder={T.c_zip} value={searchParams.zip} onChange={e=>setSearch({...searchParams, zip:e.target.value})} style={{width:"100%", padding:"8px", marginBottom:"5px", border:"1px solid #ccc", borderRadius:"4px", fontSize:"12px"}}/>
          <button onClick={performSearch} style={{width:"100%", padding:"8px", background:"#0066cc", color:"white", border:"none", borderRadius:"4px", cursor:"pointer", fontWeight:"bold", marginTop:"5px"}}>{T.btn_search}</button>
        </div>

        {/* Eigenbestand */}
        <div style={{background:"#f8f9fa", padding:"15px", borderRadius:"6px", border:"1px solid #e9ecef"}}>
          <h4 style={{margin:"0 0 10px 0"}}>{T.cust_h}</h4>
          <div style={{display:"flex", gap:"10px", marginBottom:"10px"}}>
            <div><label style={{fontSize:"10px", fontWeight:"bold"}}>{T.w_lbl}</label><input type="number" value={customWin.w} onChange={e=>setCustomWin({...customWin, w:parseInt(e.target.value)})} style={{width:"100%", padding:"6px", border:"1px solid #ccc", borderRadius:"4px"}}/></div>
            <div><label style={{fontSize:"10px", fontWeight:"bold"}}>{T.h_lbl}</label><input type="number" value={customWin.h} onChange={e=>setCustomWin({...customWin, h:parseInt(e.target.value)})} style={{width:"100%", padding:"6px", border:"1px solid #ccc", borderRadius:"4px"}}/></div>
          </div>
          <button onClick={addCustom} style={{width:"100%", padding:"8px", background:"white", border:"1px solid #ccc", borderRadius:"4px", cursor:"pointer", fontWeight:"bold"}}>{T.btn_add}</button>
        </div>
      </div>

      {/* HAUPTBEREICH (GETEILT IN OBEN UND UNTEN) */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh" }}>
        
        {/* === OBERE HÄLFTE: FEST (NICHT SCROLLBAR) === */}
        <div style={{ flex: "0 0 auto", borderBottom: "2px solid #ccc", background: "#F4F6F8", padding: "20px 20px 0 20px" }}>
            
            {/* DASHBOARD METRICS */}
            <div style={{ display: "flex", gap: "15px", background: "white", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: "20px" }}>
                <div style={{flex:1, borderRight:"1px solid #eee"}}><div style={{fontSize:"11px", color:"#777", fontWeight:"600"}}>{T.wall_a}</div><div style={{fontSize:"20px", fontWeight:"bold"}}>{wallArea.toFixed(2)} m²</div></div>
                <div style={{flex:1, borderRight:"1px solid #eee"}}><div style={{fontSize:"11px", color:"#777", fontWeight:"600"}}>{T.win_a}</div><div style={{fontSize:"20px", fontWeight:"bold"}}>{winArea.toFixed(2)} m²</div></div>
                <div style={{flex:1, borderRight:"1px solid #eee"}}><div style={{fontSize:"11px", color:"#777", fontWeight:"600"}}>{T.fill}</div><div style={{fontSize:"20px", fontWeight:"bold"}}>{fillRate.toFixed(1)} %</div></div>
                <div style={{flex:1}}><div style={{fontSize:"11px", color:"#FF4B4B", fontWeight:"bold"}}>{T.price}</div><div style={{fontSize:"20px", fontWeight:"bold", color:"#FF4B4B"}}>{totalPrice.toFixed(2)} €</div></div>
            </div>

            {/* DIE 3 ZEICHNUNGEN (Nebeneinander) */}
            <div style={{ display: "flex", overflowX: "auto", gap: "30px", alignItems: "flex-end", paddingBottom: "20px" }}>
                
                {/* 1. HAUPT-COLLAGE */}
                <div style={{display: "flex", alignItems: "flex-end", flexShrink: 0}}>
                    {/* SCALE FIGURE 1.78m */}
                    <div style={{ width: Math.max(25, 400 * SCALE), height: 1780 * SCALE, marginRight: "10px", background: `url("${archSVG}") no-repeat bottom center/contain`, opacity: 0.8 }} />
                    <div>
                        <div style={{textAlign:"center", fontWeight:"bold", marginBottom:"8px", fontSize:"11px", color:"#555"}}>Collage</div>
                        <div ref={canvasRef} onMouseMove={onDrag} onMouseUp={stopDrag} onMouseLeave={stopDrag}
                            style={{ width: wall.w * SCALE, height: canvasH, border: "4px solid #333", position: "relative", background: "repeating-linear-gradient(45deg, #fce4e4, #fce4e4 10px, #ffffff 10px, #ffffff 20px)", boxShadow: "0 10px 20px rgba(0,0,0,0.1)", borderRadius:"2px" }}>
                            {/* ZUSCHNITTE */}
                            {gaps.map(g => (
                                <div key={g.id} style={{ position: "absolute", left: g.x * SCALE, bottom: g.y * SCALE, width: g.w * SCALE, height: g.h * SCALE, background: "rgba(255, 75, 75, 0.4)", border: "1px dashed #FF4B4B", pointerEvents: "none", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "10px", color: "white", textShadow: "0px 1px 2px rgba(0,0,0,0.8)", fontWeight: "bold" }}>
                                    {(g.w * g.h / 1000000) >= 0.4 ? `${(g.w * g.h / 1000000).toFixed(2)}` : ""}
                                </div>
                            ))}
                            {/* FENSTER */}
                            {windows.filter(w=>w.visible).map(w => {
                                let dispW = w.rotated ? w.h : w.w; let dispH = w.rotated ? w.w : w.h;
                                let isDragging = draggingId === w.id;
                                return (
                                <div key={w.id} onMouseDown={(e) => startDrag(e, w)}
                                    style={{ position: "absolute", left: w.x * SCALE, bottom: w.y * SCALE, width: dispW * SCALE, height: dispH * SCALE, background: w.color, border: w.pinned ? "3px solid #111" : "2px solid #555", cursor: w.pinned ? "not-allowed" : (isDragging ? "grabbing" : "grab"), display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize: "10px", color:"#222", zIndex: w.pinned ? 5 : 10, opacity: w.pinned ? 0.95 : 1, transition: isDragging ? "none" : "all 0.1s" }}>
                                    <div style={{position: "absolute", top: 2, right: 2, display: "flex", gap: "2px"}}>
                                        <button onClick={(e)=>{e.stopPropagation(); toggleWinProp(w.id, 'rotated');}} style={{background:"rgba(255,255,255,0.8)", border:"1px solid #777", borderRadius:"3px", fontSize:"9px", cursor:"pointer", padding:"1px 4px"}}>🔄</button>
                                        <button onClick={(e)=>{e.stopPropagation(); toggleWinProp(w.id, 'pinned');}} style={{background:"rgba(255,255,255,0.8)", border:"1px solid #777", borderRadius:"3px", fontSize:"9px", cursor:"pointer", padding:"1px 4px"}}>{w.pinned ? "❌" : "📌"}</button>
                                    </div>
                                    <span style={{pointerEvents: "none", marginTop: "10px", textAlign: "center"}}>{w.pinned && "📌 "}{w.pos}</span>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 2. SCHWARZ-WEISS (VERSCHNITT) */}
                <div style={{flexShrink: 0}}>
                    <div style={{textAlign:"center", fontWeight:"bold", marginBottom:"8px", fontSize:"11px", color:"#555"}}>Verschnitt (Schwarz)</div>
                    <div style={{ width: wall.w * SCALE, height: canvasH, border: "2px solid #000", position: "relative", background: "white", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
                        {gaps.map(g => (
                            <div key={"bw_"+g.id} style={{ position: "absolute", left: g.x * SCALE, bottom: g.y * SCALE, width: g.w * SCALE, height: g.h * SCALE, background: "#111" }} />
                        ))}
                        {windows.filter(w=>w.visible).map(w => {
                            let dispW = w.rotated ? w.h : w.w; let dispH = w.rotated ? w.w : w.h;
                            return <div key={"bw_"+w.id} style={{ position: "absolute", left: w.x * SCALE, bottom: w.y * SCALE, width: dispW * SCALE, height: dispH * SCALE, background: "white" }} />
                        })}
                    </div>
                </div>

                {/* 3. CAD LINIENZEICHNUNG */}
                <div style={{flexShrink: 0}}>
                    <div style={{textAlign:"center", fontWeight:"bold", marginBottom:"8px", fontSize:"11px", color:"#555"}}>Linienzeichnung (CAD)</div>
                    <div style={{ width: wall.w * SCALE, height: canvasH, border: "2px solid #000", position: "relative", background: "white", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
                        {gaps.map(g => (
                            <div key={"line_"+g.id} style={{ position: "absolute", left: g.x * SCALE, bottom: g.y * SCALE, width: g.w * SCALE, height: g.h * SCALE, background: "transparent", border: "0.5px solid #aaa" }} />
                        ))}
                        {windows.filter(w=>w.visible).map(w => {
                            let dispW = w.rotated ? w.h : w.w; let dispH = w.rotated ? w.w : w.h;
                            return <div key={"line_"+w.id} style={{ position: "absolute", left: w.x * SCALE, bottom: w.y * SCALE, width: dispW * SCALE, height: dispH * SCALE, background: "transparent", border: "1.5px solid #000" }}>
                                <div style={{width:"100%", height:"100%", border:"0.5px solid #555", margin:"1px"}}></div>
                            </div>
                        })}
                    </div>
                </div>

            </div>
        </div>

        {/* === UNTERE HÄLFTE: LISTEN (SCROLLBAR) === */}
        <div style={{ flex: "1 1 auto", overflowY: "auto", padding: "20px", background: "white" }}>
          
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"15px"}}>
            <h3 style={{margin:0, color:"#111", fontSize:"16px"}}>{T.mat_h}</h3>
            <button onClick={exportCSV} style={{padding:"6px 14px", background:"#FF4B4B", color:"white", border:"none", borderRadius:"4px", cursor:"pointer", fontWeight:"bold", fontSize:"12px"}}>{T.exp_btn}</button>
          </div>

          <div style={{border:"1px solid #eee", borderRadius:"6px", overflowX:"auto", marginBottom:"30px"}}>
            <table style={{width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left"}}>
              <thead><tr style={{background:"#f8f9fa", borderBottom:"1px solid #eee"}}>
                <th style={{padding:"8px"}}>{T.col.v}</th><th style={{padding:"8px"}}>{T.col.p}</th><th style={{padding:"8px"}}>{T.col.r}</th><th style={{padding:"8px"}}>{T.col.id}</th><th style={{padding:"8px"}}>{T.col.x}</th><th style={{padding:"8px"}}>{T.col.y}</th><th style={{padding:"8px"}}>{T.col.dim}</th><th style={{padding:"8px"}}>{T.col.a}</th><th style={{padding:"8px"}}>{T.col.pr}</th><th style={{padding:"8px"}}>{T.col.src}</th>
              </tr></thead>
              <tbody>
                {windows.map(w => {
                  let dispW = w.rotated ? w.h : w.w; let dispH = w.rotated ? w.w : w.h;
                  return (
                    <tr key={w.id} style={{background: w.pinned ? "#fff3cd" : "transparent", opacity: w.visible ? 1 : 0.4, borderBottom:"1px solid #eee"}}>
                      <td style={{padding:"6px 8px"}}><input type="checkbox" checked={w.visible} onChange={()=>toggleWinProp(w.id, 'visible')} style={{cursor:"pointer"}}/></td>
                      <td style={{padding:"6px 8px"}}><input type="checkbox" checked={w.pinned} onChange={()=>toggleWinProp(w.id, 'pinned')} style={{cursor:"pointer"}}/></td>
                      <td style={{padding:"6px 8px"}}><input type="checkbox" checked={w.rotated} onChange={()=>toggleWinProp(w.id, 'rotated')} style={{cursor:"pointer"}}/></td>
                      <td style={{padding:"6px 8px", fontWeight:"bold"}}>{w.pos}</td>
                      <td style={{padding:"6px 8px"}}><input type="number" value={w.x} onChange={e=>{let arr=windows.map(x=>x.id===w.id?{...x, x:parseInt(e.target.value)||0, pinned:true}:x); setWindows(arr); runAI(arr, wall, params);}} style={{width:"60px", padding:"4px", border:"1px solid #ccc", borderRadius:"4px"}}/></td>
                      <td style={{padding:"6px 8px"}}><input type="number" value={w.y} onChange={e=>{let arr=windows.map(x=>x.id===w.id?{...x, y:parseInt(e.target.value)||0, pinned:true}:x); setWindows(arr); runAI(arr, wall, params);}} style={{width:"60px", padding:"4px", border:"1px solid #ccc", borderRadius:"4px"}}/></td>
                      <td style={{padding:"6px 8px"}}>{dispW} x {dispH}</td>
                      <td style={{padding:"6px 8px", fontWeight:"bold"}}>{((dispW*dispH)/1000000).toFixed(2)}</td>
                      <td style={{padding:"6px 8px", color:"#FF4B4B", fontWeight:"bold"}}>{w.price.toFixed(2)} €</td>
                      <td style={{padding:"6px 8px", maxWidth:"150px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{w.source}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <h3 style={{margin:"0 0 10px 0", color:"#111", fontSize:"16px"}}>{T.gaps_h}</h3>
          {gaps.length > 0 ? (
            <div style={{border:"1px solid #eee", borderRadius:"6px", overflowX:"auto"}}>
              <table style={{width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left"}}>
                <thead><tr style={{background:"#222", color:"white"}}>
                  <th style={{padding:"8px"}}>{T.col.id}</th><th style={{padding:"8px"}}>{T.col.dim}</th><th style={{padding:"8px"}}>{T.col.a}</th><th style={{padding:"8px"}}>{T.col.x}</th><th style={{padding:"8px"}}>{T.col.y}</th>
                </tr></thead>
                <tbody>
                  {gaps.map((g,i) => (
                    <tr key={g.id} style={{borderBottom:"1px solid #eee"}}>
                      <td style={{padding:"6px 8px", fontWeight:"bold"}}>Gap-{i+1}</td>
                      <td style={{padding:"6px 8px"}}>{g.w} x {g.h}</td>
                      <td style={{padding:"6px 8px", fontWeight:"bold"}}>{((g.w*g.h)/1000000).toFixed(2)}</td>
                      <td style={{padding:"6px 8px"}}>{g.x}</td><td style={{padding:"6px 8px"}}>{g.y}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <div style={{background:"#d4edda", color:"#155724", padding:"12px", borderRadius:"6px", fontWeight:"bold", fontSize:"12px"}}>{T.no_gaps}</div>}

        </div>
      </div>
    </div>
  );
}
