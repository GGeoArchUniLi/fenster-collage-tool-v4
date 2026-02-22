import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';

// --- VOLLSTÄNDIGES WÖRTERBUCH (UNGEKÜRZT) ---
const LANGS = {
  "🇩🇪 DE": { title: "🧱 Facade AI Pro v10.0", search_h: "1. Globale Suche", c_land: "Land", c_zip: "PLZ / Ort", c_rad: "Umkreis (km)", reuse: "Gebraucht", new: "Neu", search_solar: "☀️ Nur Solarpaneele suchen", btn_search: "Daten abrufen", cust_h: "2. Eigenbestand", w_lbl: "↔️ Breite", h_lbl: "↕️ Höhe", btn_add: "Hinzufügen", wall_h: "Wandöffnung (mm)", btn_suggest: "💡 Wand optimieren", btn_shuf: "🎲 Zufälliger Seed", btn_gaps: "✂️ Zuschnitt drehen", lock: "🔒 Gepinnte behalten", sym: "📐 Symmetrie", chaos: "Chaos", gravity: "🧲 Gravitationsstärke", seed: "Seed", auto_rot: "🔄 Auto-Rotation", clust_num: "🏝️ Anzahl Cluster", clust_pin: "🧲 Um Gepinnte anordnen", rect_clust: "🔲 Rechteckig Clustern", mode_cluster: "🏝️ Organisch", mode_rect: "🧱 Unten anordnen", mode_scatter: "🌌 Verstreuen", gap_subdiv: "📏 Max. Verschnitt-Platte (mm)", solar_auto: "☀️ Auto-Solar in Lücken", solar_fetch: "🌐 Auto-Suche wenn Solar fehlt", wall_a: "Wand", win_a: "Fenster/Solar", fill: "Füllgrad", price: "Preis", mat_h: "📋 Matrix", exp_csv: "CSV", exp_cad: "DXF", exp_img: "Bild", exp_bw: "S/W", exp_line: "CAD", exp_zip: "ZIP", realism: "✨ Realismus", gaps_h: "🟥 Zuschnitt-Liste", no_gaps: "Wand perfekt gefüllt!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Maße", a:"m²", src:"Herkunft", dist: "Dist", pr:"Preis", l:"Link"}, all_windows: "📦 Inventar (Alle Elemente)", used_windows: "🏗️ Verwendete Elemente", fullscreen: "⛶ Vollbild" },
  "🇪🇸 ES": { title: "🧱 Generador Fachadas v10.0", search_h: "1. Búsqueda", c_land: "País", c_zip: "C.P.", c_rad: "Radio (km)", reuse: "Usado", new: "Nuevo", search_solar: "☀️ Buscar Paneles Solares", btn_search: "Obtener datos", cust_h: "2. Inventario", w_lbl: "↔️ Ancho", h_lbl: "↕️ Alto", btn_add: "Añadir", wall_h: "Muro (mm)", btn_suggest: "💡 Optimizar Muro", btn_shuf: "🎲 Semilla Aleatoria", btn_gaps: "✂️ Rotar cortes", lock: "🔒 Bloquear Pines", sym: "📐 Simetría", chaos: "Caos", gravity: "🧲 Gravedad", seed: "Semilla", auto_rot: "🔄 Auto-rotación", clust_num: "🏝️ Clústeres", clust_pin: "🧲 Agrupar a fijos", rect_clust: "🔲 Clúster Rectangular", mode_cluster: "🏝️ Orgánico", mode_rect: "🧱 Abajo", mode_scatter: "🌌 Dispersión", gap_subdiv: "📏 Panel de corte máx (mm)", solar_auto: "☀️ Auto-Solar en huecos", solar_fetch: "🌐 Auto-búsqueda solar", wall_a: "Muro", win_a: "Vent./Solar", fill: "Relleno", price: "Precio", mat_h: "📋 Matriz", exp_csv: "CSV", exp_cad: "DXF", exp_img: "Img", exp_bw: "B/N", exp_line: "Líneas", exp_zip: "ZIP", realism: "✨ Realismo", gaps_h: "🟥 Cortes", no_gaps: "¡Perfecto!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dim", a:"m²", src:"Origen", dist: "Dist", pr:"Precio", l:"Link"}, all_windows: "📦 Inventario Total", used_windows: "🏗️ En uso", fullscreen: "⛶ Pantalla Comp." },
  "🇬🇧 EN": { title: "🧱 Facade AI Pro v10.0", search_h: "1. Search", c_land: "Country", c_zip: "ZIP / City", c_rad: "Radius (km)", reuse: "Used", new: "New", search_solar: "☀️ Search Solar Panels Only", btn_search: "Fetch Data", cust_h: "2. Inventory", w_lbl: "↔️ Width", h_lbl: "↕️ Height", btn_add: "Add", wall_h: "Wall (mm)", btn_suggest: "💡 Optimize Wall", btn_shuf: "🎲 Random Seed", btn_gaps: "✂️ Toggle Gaps", lock: "🔒 Keep Pinned", sym: "📐 Symmetry", chaos: "Chaos", gravity: "🧲 Gravity Strength", seed: "Seed", auto_rot: "🔄 Auto-Rotation", clust_num: "🏝️ Clusters", clust_pin: "🧲 Group around Pinned", rect_clust: "🔲 Rectangular Cluster", mode_cluster: "🏝️ Organic", mode_rect: "🧱 Bottom Pack", mode_scatter: "🌌 Scatter", gap_subdiv: "📏 Max Gap Panel (mm)", solar_auto: "☀️ Auto-Solar in Gaps", solar_fetch: "🌐 Auto-Fetch Solar if missing", wall_a: "Wall Area", win_a: "Win/Solar", fill: "Fill", price: "Price", mat_h: "📋 Matrix", exp_csv: "CSV", exp_cad: "DXF", exp_img: "Img", exp_bw: "B/W", exp_line: "CAD", exp_zip: "ZIP", realism: "✨ Realism", gaps_h: "🟥 Gaps", no_gaps: "Perfect!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dims", a:"m²", src:"Source", dist: "Dist", pr:"Price", l:"Link"}, all_windows: "📦 Inventory (All)", used_windows: "🏗️ Used Elements", fullscreen: "⛶ Fullscreen" },
  "🇫🇷 FR": { title: "🧱 Générateur de Façade v10.0", search_h: "Recherche", c_land: "Pays", c_zip: "CP", c_rad: "Rayon", reuse: "Usagé", new: "Neuf", search_solar: "Solaire", btn_search: "Chercher", cust_h: "Inventaire", w_lbl: "↔️ Largeur", h_lbl: "↕️ Hauteur", btn_add: "Ajouter", wall_h: "Mur (mm)", btn_suggest: "Optimiser", btn_shuf: "Mélanger", btn_gaps: "Alterner", lock: "Verrouiller", sym: "Symétrie", chaos: "Chaos", gravity: "Gravité", seed: "Graine", auto_rot: "Rotation", clust_num: "Clústeres", clust_pin: "Grouper", rect_clust: "Rectangle", mode_cluster: "Organique", mode_rect: "Bas", mode_scatter: "Dispersion", gap_subdiv: "Max Gap", solar_auto: "Auto-Solaire", solar_fetch: "Chercher Solaire", wall_a: "Mur", win_a: "Fen/Sol", fill: "Remplissage", price: "Prix", mat_h: "Matrice", exp_csv: "CSV", exp_cad: "DXF", exp_img: "Img", exp_bw: "N/B", exp_line: "CAD", exp_zip: "ZIP", realism: "Réalisme", gaps_h: "Panneaux", no_gaps: "Parfait!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dim", a:"m²", src:"Source", dist: "Dist", pr:"Prix", l:"Lien"}, all_windows: "Inventaire", used_windows: "Utilisées", fullscreen: "Plein Écran" },
  "🇮🇹 IT": { title: "🧱 Generatore Facciate v10.0", search_h: "Ricerca", c_land: "Paese", c_zip: "CAP", c_rad: "Raggio", reuse: "Usato", new: "Nuovo", search_solar: "Solare", btn_search: "Cerca", cust_h: "Inventario", w_lbl: "↔️ Largh.", h_lbl: "↕️ Altezza", btn_add: "Aggiungi", wall_h: "Muro (mm)", btn_suggest: "Ottimizza", btn_shuf: "Rimescola", btn_gaps: "Tagli", lock: "Blocca", sym: "Simmetria", chaos: "Caos", gravity: "Gravità", seed: "Seme", auto_rot: "Rotazione", clust_num: "Cluster", clust_pin: "Raggruppa", rect_clust: "Rettangolo", mode_cluster: "Organico", mode_rect: "Basso", mode_scatter: "Dispersione", gap_subdiv: "Max Taglio", solar_auto: "Auto-Solare", solar_fetch: "Cerca Solare", wall_a: "Muro", win_a: "Fin/Sol", fill: "Riemp.", price: "Prezzo", mat_h: "Matrice", exp_csv: "CSV", exp_cad: "DXF", exp_img: "Img", exp_bw: "B/N", exp_line: "CAD", exp_zip: "ZIP", realism: "Realismo", gaps_h: "Pannelli", no_gaps: "Perfetto!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dim", a:"m²", src:"Fonte", dist: "Dist", pr:"Prezzo", l:"Link"}, all_windows: "Inventario", used_windows: "Usate", fullscreen: "Schermo Intero" }
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
  const T = LANGS[lang] || LANGS["🇬🇧 EN"]; 

  const [searchParams, setSearch] = useState({ land: "Deutschland", zip: "10115", radius: 50, reuse: true, new: false, solar: false });
  const [customWin, setCustomWin] = useState({ w: 1000, h: 1600 });

  const [wall, setWall] = useState({ w: 4000, h: 3000 });
  const [windows, setWindows] = useState([]);
  const [gaps, setGaps] = useState([]);
  const [counter, setCounter] = useState(1);
  
  const [params, setParams] = useState({ 
    symmetry: false, chaos: 10, gravity: 50, lock: true, gapToggle: false, autoRot: false, 
    clusterCount: 1, clusterPinned: true, rectCluster: false, layoutMode: 'cluster',
    gapMaxDim: 5000, solarAuto: false, solarFetch: false, realism: false
  });
  const [seed, setSeed] = useState(42);
  
  // Drag & Highlight States
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({x: 0, y: 0});
  const [selectedId, setSelectedId] = useState(null);
  const canvasRef = useRef(null); 
  
  // Resizing States (Sidebars & Dividers)
  const [leftWidth, setLeftWidth] = useState(350);
  const [rightWidth, setRightWidth] = useState(350);
  const [matrixSplitLeft, setMatrixSplitLeft] = useState(500);
  
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [topPaneHeight, setTopPaneHeight] = useState(55); 
  
  const topPaneRef = useRef(null);
  const [paneSize, setPaneSize] = useState({ w: 800, h: 400 }); 

  // Chatbot State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: '👋 Hallo! Ich bin deine intelligente Architekten-KI.' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if(!topPaneRef.current) return;
    const obs = new ResizeObserver(entries => {
      setPaneSize({ w: entries[0].contentRect.width, h: entries[0].contentRect.height });
    });
    obs.observe(topPaneRef.current);
    return () => obs.disconnect();
  }, [leftOpen, rightOpen, leftWidth, rightWidth, topPaneHeight]);

  const paddingOffset = 80;
  const mainScale = Math.min((paneSize.w * 0.45) / Math.max(wall.w, 1), Math.max(10, paneSize.h - paddingOffset) / Math.max(wall.h, 1));
  const subScale = Math.min((paneSize.w * 0.22) / Math.max(wall.w, 1), Math.max(10, paneSize.h - paddingOffset) / Math.max(wall.h, 1));
  
  const canvasH = wall.h * mainScale;
  const canvasW = wall.w * mainScale;

  useEffect(() => {
    let initial = [
      { id: "1", pos: "P1", w: 1200, h: 1400, x:0, y:0, price: 85, color: "#4682b4", source: "Lager", dist: 0, type: "Fenster", pinned: false, rotated: false, visible: true },
      { id: "2", pos: "P2", w: 2000, h: 2100, x:0, y:0, price: 350, color: "#add8e6", source: "Lager", dist: 0, type: "Fenster", pinned: false, rotated: false, visible: true },
      { id: "3", pos: "P3", w: 800, h: 600, x:0, y:0, price: 40, color: "#4682b4", source: "Lager", dist: 0, type: "Fenster", pinned: false, rotated: false, visible: true },
      { id: "4", pos: "S1", w: 1000, h: 1600, x:0, y:0, price: 150, color: "#2c3e50", source: "Solar Provider", dist: 0, type: "Solar", pinned: false, rotated: false, visible: true }
    ];
    setCounter(5);
    runAI(initial, wall, params, seed);
  }, []);

  useEffect(() => {
    if(chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const scrollToRow = (id) => {
    setTimeout(() => {
      const elAll = document.getElementById(`row-all-${id}`);
      const elUsed = document.getElementById(`row-used-${id}`);
      if (elAll) elAll.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (elUsed) elUsed.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  // --- RESIZE HANDLER ---
  const handleHDividerDragStart = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleHDividerDrag);
    document.addEventListener('mouseup', handleHDividerDragEnd);
  };
  const handleHDividerDrag = (e) => {
    const newHeight = (e.clientY / window.innerHeight) * 100;
    setTopPaneHeight(Math.max(10, Math.min(newHeight, 90))); 
  };
  const handleHDividerDragEnd = () => {
    document.removeEventListener('mousemove', handleHDividerDrag); document.removeEventListener('mouseup', handleHDividerDragEnd);
  };

  const handleLeftSidebarDragStart = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleLeftSidebarDrag);
    document.addEventListener('mouseup', handleLeftSidebarDragEnd);
  };
  const handleLeftSidebarDrag = (e) => setLeftWidth(Math.max(250, Math.min(e.clientX, 600)));
  const handleLeftSidebarDragEnd = () => {
    document.removeEventListener('mousemove', handleLeftSidebarDrag); document.removeEventListener('mouseup', handleLeftSidebarDragEnd);
  };

  const handleRightSidebarDragStart = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleRightSidebarDrag);
    document.addEventListener('mouseup', handleRightSidebarDragEnd);
  };
  const handleRightSidebarDrag = (e) => setRightWidth(Math.max(250, Math.min(window.innerWidth - e.clientX, 600)));
  const handleRightSidebarDragEnd = () => {
    document.removeEventListener('mousemove', handleRightSidebarDrag); document.removeEventListener('mouseup', handleRightSidebarDragEnd);
  };

  const handleMatrixDividerDragStart = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMatrixDividerDrag);
    document.addEventListener('mouseup', handleMatrixDividerDragEnd);
  };
  const handleMatrixDividerDrag = (e) => {
    const offset = leftOpen ? leftWidth : 0;
    setMatrixSplitLeft(Math.max(200, Math.min(e.clientX - offset, window.innerWidth - (rightOpen ? rightWidth : 0) - 100)));
  };
  const handleMatrixDividerDragEnd = () => {
    document.removeEventListener('mousemove', handleMatrixDividerDrag); document.removeEventListener('mouseup', handleMatrixDividerDragEnd);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
        document.exitFullscreen();
    }
  };

  // --- KI & MATHEMATIK ---
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
          newGaps.push({ id: Math.random().toString(), x: xs[c], y: ys[r], w: xs[c+cw]-xs[c], h: ys[r+ch]-ys[r], type: "Verschnitt", source: "-", dist: "-", price: 0, link: "" });
        }
      }
    }
    return newGaps;
  };

  const runAI = (winList, currentWall, currentParams, currentSeed) => {
    const rng = mulberry32(currentSeed);
    let placed = []; let fixed_x = [], fixed_y = [];
    
    let activeItems = winList.filter(w => w.visible);
    let pinnedItems = activeItems.filter(w => w.pinned);
    
    pinnedItems.forEach(w => {
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
    });

    let centers = [];
    if (currentParams.clusterPinned && fixed_x.length > 0) {
        for (let i = 0; i < fixed_x.length; i++) centers.push({ x: fixed_x[i], y: fixed_y[i] });
    } else {
        const cCount = currentParams.clusterCount || 1;
        for (let i = 0; i < cCount; i++) centers.push({ x: currentWall.w * ((i + 1) / (cCount + 1)), y: currentWall.h * 0.5 });
    }

    let unpinnedWindows = activeItems.filter(w => !w.pinned && w.type === 'Fenster');
    unpinnedWindows = unpinnedWindows.map(w => ({...w, _weight: (w.w*w.h) * (1 + (rng()-0.5)*(currentParams.chaos/50)) })).sort((a,b)=>b._weight - a._weight);
    let step = currentParams.layoutMode === 'rect' ? 50 : 100;
    
    // Bounding Box Logic for Rectangular Clustering
    let bbox = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    const updateBBox = () => {
        if(placed.length > 0) {
            bbox.minX = Math.min(...placed.map(p=>p.x));
            bbox.maxX = Math.max(...placed.map(p=>p.x+p.w));
            bbox.minY = Math.min(...placed.map(p=>p.y));
            bbox.maxY = Math.max(...placed.map(p=>p.y+p.h));
        }
    };
    updateBBox();

    unpinnedWindows.forEach(w => {
      let bestPos = null, minScore = Infinity;
      let orientations = currentParams.autoRot ? [false, true] : [w.rotated];
      
      const gravityFactor = currentParams.gravity / 50; 

      orientations.forEach(rot => {
          let eff_w = rot ? w.h : w.w; let eff_h = rot ? w.w : w.h;
          if (eff_w > currentWall.w || eff_h > currentWall.h) return; 
          
          for(let y=0; y<=currentWall.h - eff_h; y+=step) {
            for(let x=0; x<=currentWall.w - eff_w; x+=step) {
              if(!checkOverlap(x, y, eff_w, eff_h, placed)) {
                let score = 0;
                
                if (currentParams.layoutMode === 'scatter') { 
                    score = rng() * 100000; 
                } else if (currentParams.layoutMode === 'rect') { 
                    score = y * 10000 + x; 
                } else {
                    let distScore = Math.min(...centers.map(c => Math.pow(x+eff_w/2 - c.x, 2) + Math.pow(y+eff_h/2 - c.y, 2)));
                    score = distScore * gravityFactor;
                    if(currentParams.symmetry) score += Math.min(Math.abs(x+eff_w/2 - centers[0].x), Math.abs(y+eff_h/2 - centers[0].y)) * 5000;
                }

                // Extra Strafe, wenn "Rechteckig Clustern" an ist und die Box gesprengt wird
                if (currentParams.rectCluster && placed.length > 0) {
                    let newMaxX = Math.max(bbox.maxX, x + eff_w);
                    let newMinX = Math.min(bbox.minX, x);
                    let newMaxY = Math.max(bbox.maxY, y + eff_h);
                    let newMinY = Math.min(bbox.minY, y);
                    let newArea = (newMaxX - newMinX) * (newMaxY - newMinY);
                    score += newArea * 50;
                }
                
                if(score < minScore) { minScore = score; bestPos = {...w, x:x, y:y, w:eff_w, h:eff_h, rotated: rot}; }
              }
            }
          }
      });
      if(bestPos) {
          placed.push(bestPos);
          updateBBox();
      }
    });

    if(placed.length > 0 && fixed_x.length === 0 && currentParams.layoutMode !== 'scatter' && currentParams.clusterCount === 1) {
      let minX = Math.min(...placed.map(p=>p.x)), maxX = Math.max(...placed.map(p=>p.x+p.w));
      let minY = Math.min(...placed.map(p=>p.y)), maxY = Math.max(...placed.map(p=>p.y+p.h));
      let sx = Math.floor((currentWall.w - (maxX - minX)) / 2) - minX;
      let sy = Math.floor((currentWall.h - (maxY - minY)) / 2) - minY;
      placed = placed.map(p => ({...p, x: p.x+sx, y: p.y+sy}));
    }

    // 2. AUTO-SOLAR LOGIK
    let generatedSolar = [];
    if (currentParams.solarAuto) {
        let tempGaps = calculateGapsExact(currentWall.w, currentWall.h, placed, false);
        tempGaps.sort((a,b) => (b.w*b.h) - (a.w*a.h));
        
        let availableSolar = winList.filter(w => w.type === 'Solar' && w.visible && !w.pinned && !placed.find(p=>p.id===w.id));
        
        tempGaps.forEach(g => {
            if (g.w >= 800 && g.h >= 1000) { 
                let s = availableSolar.pop();
                if (!s && currentParams.solarFetch) {
                    s = { id: Math.random().toString(36).substr(2, 9), pos: `S-Auto`, w: 1000, h: 1600, x:0, y:0, price: 150, color: "#2c3e50", source: "Auto-Suche", dist: 10, type: "Solar", pinned: false, rotated: false, visible: true };
                    generatedSolar.push(s);
                }
                if (s) {
                    let fits = false, rot = false;
                    if (s.w <= g.w && s.h <= g.h) { fits = true; rot = false; }
                    else if (currentParams.autoRot && s.h <= g.w && s.w <= g.h) { fits = true; rot = true; }
                    
                    if (fits) {
                        let eff_w = rot ? s.h : s.w; let eff_h = rot ? s.w : s.h;
                        placed.push({...s, x: g.x, y: g.y, w: eff_w, h: eff_h, rotated: rot});
                    } else {
                        availableSolar.push(s); 
                    }
                }
            }
        });
    }

    let rawGaps = calculateGapsExact(currentWall.w, currentWall.h, placed, currentParams.gapToggle);
    
    // 3. SUBDIVISION LOGIK FÜR GAPS
    let finalGaps = [];
    let maxDim = currentParams.gapMaxDim || 5000;
    rawGaps.forEach(g => {
        if (maxDim < 5000 && (g.w > maxDim || g.h > maxDim)) {
            let cols = Math.ceil(g.w / maxDim);
            let rows = Math.ceil(g.h / maxDim);
            let stepW = Math.round(g.w / cols);
            let stepH = Math.round(g.h / rows);
            for(let r=0; r<rows; r++){
                for(let c=0; c<cols; c++){
                    let w = (c === cols-1) ? g.w - (c*stepW) : stepW;
                    let h = (r === rows-1) ? g.h - (r*stepH) : stepH;
                    finalGaps.push({ id: Math.random().toString(), x: g.x + c*stepW, y: g.y + r*stepH, w: w, h: h, type: "Verschnitt", source: "-", dist: "-", price: 0, link: "" });
                }
            }
        } else {
            finalGaps.push(g);
        }
    });

    setGaps(finalGaps);
    
    let combinedWinList = [...winList, ...generatedSolar];
    setWindows(combinedWinList.map(w => {
      let p = placed.find(pl => pl.id === w.id);
      if(p) return {...w, x: p.x, y: p.y, rotated: p.rotated, visible: true}; 
      return w.pinned ? w : {...w, visible: false}; 
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
    setChatMessages(prev => [...prev, { role: 'bot', text: 'Suchen im Internet... Bitte warten.' }]);
    const isSolar = searchParams.solar;
    const stdSizes = isSolar ? [[1000,1600], [1000,1700], [1100,1700]] : [ [800,1000], [1000,1200], [1200,1400], [2000,2100], [600,800] ];
    let results = []; let c = counter;
    const numToGen = Math.floor(Math.random() * 5) + 3;
    
    for(let i=0; i<numToGen; i++) {
        const size = stdSizes[Math.floor(Math.random() * stdSizes.length)];
        const isReuse = searchParams.reuse && (!searchParams.new || Math.random() > 0.5);
        const distance = Math.floor(Math.random() * searchParams.radius); 
        
        results.push({
            id: Math.random().toString(36).substr(2, 9), 
            pos: isSolar ? `S${c++}` : `P${c++}`,
            w: size[0], h: size[1], x: 0, y: 0,
            price: isSolar ? 150 : (isReuse ? (size[0]*size[1])/25000 + 20 : (size[0]*size[1])/15000 + 100),
            color: isSolar ? "#2c3e50" : (isReuse ? "#4682b4" : "#add8e6"), 
            source: isReuse ? `Marketplace (${searchParams.zip})` : `Supplier`, 
            dist: distance, 
            type: isSolar ? "Solar" : "Fenster",
            pinned: false, rotated: false, visible: true, link: "https://example.com"
        });
    }
    setCounter(c);
    runAI([...windows, ...results], wall, params, seed);
    setChatMessages(prev => [...prev, { role: 'bot', text: `Erfolg! Ich habe ${results.length} Elemente importiert.` }]);
  };

  const addCustom = () => {
    const nw = { id: Math.random().toString(), pos: `C${counter}`, w: customWin.w, h: customWin.h, x:0, y:0, price: 0, color: "#90EE90", source: "Eigen", dist: 0, type: "Fenster", pinned: false, rotated: false, visible: true, link: "" };
    setCounter(counter+1);
    runAI([...windows, nw], wall, params, seed);
  };

  const toggleAll = (prop) => {
      const allTrue = windows.every(w => w[prop]);
      const updated = windows.map(w => ({ ...w, [prop]: !allTrue, pinned: prop === 'rotated' ? true : w.pinned }));
      setWindows(updated); runAI(updated, wall, params, seed);
  };

  const toggleAllUsed = (prop) => {
      const usedWins = windows.filter(w => w.visible);
      const allTrue = usedWins.every(w => w[prop]);
      const updated = windows.map(w => w.visible ? { ...w, [prop]: !allTrue } : w);
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

  // --- EXPORTE FUNKTIONEN ---
  const getCsvString = () => {
    let r = [ ["ID", "Typ", "Breite", "Hoehe", "m2", "Preis", "Distanz(km)", "Herkunft"] ];
    windows.filter(w=>w.visible).forEach(w => r.push([w.pos, w.type, w.w, w.h, ((w.w*w.h)/1000000).toFixed(2), w.price.toFixed(2), w.dist, w.source]));
    gaps.forEach((g,i) => r.push([`Gap-${i+1}`, "Verschnitt", g.w, g.h, ((g.w*g.h)/1000000).toFixed(2), "0", "0", "Holz/Metall"]));
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
    e.stopPropagation(); 
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
    - Aktive Fenster/Solar: ${windows.filter(w=>w.visible).length} Stück
    - Verschnitt (Gaps): ${(wallArea - winArea).toFixed(2)} m²
    - Füllgrad der Wand: ${fillRate.toFixed(1)}%
    - Gesamtpreis: ${totalPrice.toFixed(2)} €
    Regeln: Antworte extrem kurz, professionell, auf Deutsch, beziehe dich auf die Daten.`;

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

  // Sehr realistische, elegante Flat Line Drawing Architektur Silhouette
  const archSVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 300'><text x='50' y='20' font-size='14' font-family='sans-serif' text-anchor='middle' fill='%23555' font-weight='bold'>1.78m</text><path d='M 50 35 C 45 35 42 39 42 44 C 42 49 45 53 50 53 C 55 53 58 49 58 44 C 58 39 55 35 50 35 Z M 42 58 C 35 60 32 65 30 75 L 25 130 L 35 130 L 40 90 L 42 150 L 35 290 L 45 290 L 50 190 L 55 290 L 65 290 L 58 150 L 60 90 L 65 130 L 75 130 L 70 75 C 68 65 65 60 58 58 C 55 57 45 57 42 58 Z' fill='none' stroke='%23333' stroke-width='2'/></svg>`;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "sans-serif", backgroundColor: "#f0f2f6", color:"#222" }}>
      
      {/* =======================
          LINKE SIDEBAR (STEUERUNG)
      ======================= */}
      <div style={{ width: leftOpen ? `${leftWidth}px` : "0px", background: "#fff", borderRight: leftOpen ? "1px solid #ddd" : "none", overflowY: "auto", overflowX: "hidden", transition: "width 0.1s", flexShrink: 0, position: "relative" }}>
        <div style={{ width: `${leftWidth}px`, padding: "20px", boxSizing: "border-box" }}> 
          <div style={{display:"flex", gap:"5px", flexWrap:"wrap", marginBottom:"15px"}}>
            {Object.keys(LANGS).map(l => (
              <button key={l} onClick={()=>setLang(l)} style={{background: lang===l ? "#222":"#eee", color: lang===l ? "#fff":"#333", border:"none", padding:"4px 8px", borderRadius:"4px", cursor:"pointer", fontSize:"11px", fontWeight:"bold"}}>{l.split(" ")[0]}</button>
            ))}
          </div>
          <h2 style={{fontSize:"18px", marginTop:0, color:"#111"}}>{T.title}</h2>

          {/* SUCHE (Inkl. Solar Option) */}
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
            <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"10px", color:"#2c3e50", fontWeight:"bold"}}><input type="checkbox" checked={searchParams.solar} onChange={e=>setSearch({...searchParams, solar:e.target.checked})}/> {T.search_solar}</label>
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
              <span style={{fontSize:"14px"}}>↔️</span>
              <input type="range" min="1000" max="30000" step="100" value={wall.w} onChange={e=>handleWallChange('w', parseInt(e.target.value))} style={{flex:1}}/>
              <input type="number" value={wall.w} onChange={e=>handleWallChange('w', parseInt(e.target.value))} style={{width:"70px", padding:"4px", border:"1px solid #ccc", borderRadius:"4px"}}/>
            </div>
            <div style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"15px"}}>
              <span style={{fontSize:"14px"}}>↕️</span>
              <input type="range" min="1000" max="30000" step="100" value={wall.h} onChange={e=>handleWallChange('h', parseInt(e.target.value))} style={{flex:1}}/>
              <input type="number" value={wall.h} onChange={e=>handleWallChange('h', parseInt(e.target.value))} style={{width:"70px", padding:"4px", border:"1px solid #ccc", borderRadius:"4px"}}/>
            </div>

            <button onClick={optimizeWall} style={{width:"100%", padding:"10px", background:"#e3f2fd", color:"#0056b3", border:"1px solid #b6d4fe", borderRadius:"4px", cursor:"pointer", fontWeight:"bold", marginBottom:"15px"}}>{T.btn_suggest}</button>

            <div style={{background:"white", padding:"10px", borderRadius:"4px", border:"1px solid #ddd", marginBottom:"15px"}}>
              <h5 style={{margin:"0 0 8px 0", fontSize:"12px", color:"#333"}}>Layout-Modus:</h5>
              <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"4px"}}><input type="checkbox" checked={params.layoutMode==='cluster'} onChange={()=>{setParams({...params, layoutMode:'cluster'}); runAI(windows, wall, {...params, layoutMode:'cluster'}, seed);}}/> {T.mode_cluster}</label>
              <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"4px"}}><input type="checkbox" checked={params.layoutMode==='rect'} onChange={()=>{setParams({...params, layoutMode:'rect'}); runAI(windows, wall, {...params, layoutMode:'rect'}, seed);}}/> {T.mode_rect}</label>
              <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"10px"}}><input type="checkbox" checked={params.rectCluster} onChange={(e)=>{let p={...params, rectCluster:e.target.checked}; setParams(p); runAI(windows, wall, p, seed);}}/> {T.rect_clust}</label>
              <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"10px"}}><input type="checkbox" checked={params.layoutMode==='scatter'} onChange={()=>{setParams({...params, layoutMode:'scatter'}); runAI(windows, wall, {...params, layoutMode:'scatter'}, seed);}}/> {T.mode_scatter}</label>
              <hr style={{border:"none", borderTop:"1px solid #eee"}}/>

              <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"5px"}}><input type="checkbox" checked={params.autoRot} onChange={e=>{let p={...params, autoRot:e.target.checked}; setParams(p); runAI(windows, wall, p, seed);}}/> {T.auto_rot}</label>
              <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"5px"}}>{T.clust_num}: <input type="number" min="1" max="10" value={params.clusterCount} onChange={e=>{let p={...params, clusterCount:parseInt(e.target.value)||1}; setParams(p); runAI(windows, wall, p, seed);}} style={{width:"50px", padding:"2px", marginLeft:"auto"}}/></label>
              <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"5px"}}><input type="checkbox" checked={params.clusterPinned} onChange={e=>{let p={...params, clusterPinned:e.target.checked}; setParams(p); runAI(windows, wall, p, seed);}}/> {T.clust_pin}</label>
              <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"5px"}}><input type="checkbox" checked={params.lock} onChange={e=>{let p={...params, lock:e.target.checked}; setParams(p); runAI(windows, wall, p, seed);}}/> {T.lock}</label>
              <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"10px"}}><input type="checkbox" checked={params.symmetry} onChange={e=>{let p={...params, symmetry:e.target.checked}; setParams(p); runAI(windows, wall, p, seed);}}/> {T.sym}</label>
              
              <label style={{fontSize:"11px", display:"block", color:"#555"}}>{T.gravity}: {params.gravity}%</label>
              <input type="range" min="0" max="100" value={params.gravity} onChange={e=>{const val=parseInt(e.target.value); setParams({...params, gravity:val}); runAI(windows, wall, {...params, gravity:val}, seed);}} style={{width:"100%", marginBottom:"5px"}}/>

              <label style={{fontSize:"11px", display:"block", color:"#555"}}>{T.seed}: {seed}</label>
              <input type="range" min="1" max="1000" value={seed} onChange={e=>{const val=parseInt(e.target.value); setSeed(val); runAI(windows, wall, params, val);}} style={{width:"100%", marginBottom:"5px"}}/>
              
              <label style={{fontSize:"11px", display:"block", color:"#555", marginTop:"5px"}}>{T.chaos}: {params.chaos}%</label>
              <input type="range" min="0" max="100" value={params.chaos} onChange={e=>{const val=parseInt(e.target.value); setParams({...params, chaos:val}); runAI(windows, wall, {...params, chaos:val}, seed);}} style={{width:"100%", marginBottom:"5px"}}/>

              <hr style={{border:"none", borderTop:"1px solid #eee"}}/>
              <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"5px", color:"#2c3e50"}}><input type="checkbox" checked={params.solarAuto} onChange={e=>{let p={...params, solarAuto:e.target.checked}; setParams(p); runAI(windows, wall, p, seed);}}/> {T.solar_auto}</label>
              <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"10px", color:"#2c3e50"}}><input type="checkbox" checked={params.solarFetch} onChange={e=>{let p={...params, solarFetch:e.target.checked}; setParams(p); runAI(windows, wall, p, seed);}}/> {T.solar_fetch}</label>

              <label style={{fontSize:"11px", display:"block", color:"#555", marginTop:"5px"}}>{T.gap_subdiv}: {params.gapMaxDim < 5000 ? params.gapMaxDim : "Aus"}</label>
              <input type="range" min="500" max="5000" step="100" value={params.gapMaxDim} onChange={e=>{const val=parseInt(e.target.value); setParams({...params, gapMaxDim:val}); runAI(windows, wall, {...params, gapMaxDim:val}, seed);}} style={{width:"100%", marginBottom:"5px"}}/>

            </div>

            <button onClick={()=>{let newSeed = Math.floor(Math.random()*1000); setSeed(newSeed); runAI(windows, wall, params, newSeed);}} style={{width:"100%", padding:"10px", background:"#222", color:"white", border:"none", borderRadius:"4px", cursor:"pointer", fontWeight:"bold", marginBottom:"5px"}}>{T.btn_shuf}</button>
            <button onClick={()=>{let p={...params, gapToggle:!params.gapToggle}; setParams(p); runAI(windows, wall, p, seed);}} style={{width:"100%", padding:"10px", background:"white", color:"#333", border:"1px solid #ccc", borderRadius:"4px", cursor:"pointer", fontWeight:"bold"}}>{T.btn_gaps}</button>
          </div>
        </div>
      </div>
      
      {/* DRAG BAR LINKS */}
      {leftOpen && <div onMouseDown={handleLeftSidebarDragStart} style={{ width: "6px", background: "#ddd", cursor: "col-resize", zIndex: 50 }}></div>}

      {/* =======================
          HAUPT BEREICH (MITTE)
      ======================= */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#eef1f5", position: "relative" }}>
        
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
               {/* REALISMUS SWITCH */}
               <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginRight:"10px", fontWeight:"bold", color:"#2c3e50"}}><input type="checkbox" checked={params.realism} onChange={e=>setParams({...params, realism:e.target.checked})}/> {T.realism}</label>
               
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
                    
                    // Style für Realismus
                    let realismBorder = params.realism ? 'inset 0 0 0 4px #e0e0e0, inset 0 0 0 8px #555' : 'none';
                    let standardBorder = isSelected ? "3px solid #00a8ff" : (w.pinned ? "2px solid #111" : "1px solid #555");
                    let finalBoxShadow = isSelected ? "0 0 15px 5px rgba(0,168,255,0.7)" : (params.realism ? realismBorder : (w.pinned ? "none" : "0 4px 8px rgba(0,0,0,0.3)"));

                    return (
                      <div key={w.id} onMouseDown={(e) => handleWindowPointerDown(e, w)}
                        style={{ position: "absolute", left: w.x * mainScale, bottom: w.y * mainScale, width: dispW * mainScale, height: dispH * mainScale, 
                        background: w.type === 'Solar' ? "#1a252f" : w.color, 
                        border: params.realism ? 'none' : standardBorder, 
                        boxShadow: finalBoxShadow,
                        boxSizing: 'border-box',
                        cursor: w.pinned ? "not-allowed" : (isDragging ? "grabbing" : "grab"), display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize: "10px", color: w.type === 'Solar' ? "white" : "#222", zIndex: isSelected || isDragging ? 100 : (w.pinned ? 5 : 10), opacity: w.pinned ? 0.95 : 1, transition: isDragging ? "none" : "all 0.1s" }}
                      >
                        {/* Glas Spiegelung für Fenster */}
                        {params.realism && w.type === 'Fenster' && (
                           <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 50.1%, rgba(255,255,255,0) 100%)', pointerEvents: 'none' }} />
                        )}
                        {/* Solar Grid für Solar */}
                        {params.realism && w.type === 'Solar' && (
                           <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)', backgroundSize: '15px 15px', pointerEvents: 'none' }} />
                        )}

                        <div style={{position: "absolute", top: 1, right: 1, display: "flex", gap: "2px", zIndex: 10}}>
                          <button onClick={(e)=>{e.stopPropagation(); toggleRotate(w.id);}} style={{background:"rgba(255,255,255,0.8)", color:"black", border:"1px solid #777", borderRadius:"2px", fontSize:"8px", cursor:"pointer", padding:"1px 3px"}}>🔄</button>
                          <button onClick={(e)=>{e.stopPropagation(); toggleWinProp(w.id, 'pinned');}} style={{background:"rgba(255,255,255,0.8)", color:"black", border:"1px solid #777", borderRadius:"2px", fontSize:"8px", cursor:"pointer", padding:"1px 3px"}}>{w.pinned ? "❌" : "📌"}</button>
                        </div>
                        <span style={{pointerEvents: "none", marginTop: "10px", textAlign: "center", zIndex: 10}}>{w.pinned && "📌 "}{w.pos}<br/><span style={{fontSize: "8px", fontWeight:"normal"}}>{dispW}x{dispH}</span></span>
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

        {/* DRAGGABLE DIVIDER (H) */}
        <div onMouseDown={handleHDividerDragStart} style={{ height: "16px", background: "#ddd", cursor: "row-resize", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 50, gap:"20px" }}>
          <button onClick={()=>setTopPaneHeight(100)} style={{background:"none", border:"none", cursor:"pointer", fontSize:"10px"}}>🔽 Max Zeichnung</button>
          <div style={{width:"40px", height:"4px", background:"#fff", borderRadius:"2px"}}></div>
          <button onClick={()=>setTopPaneHeight(0)} style={{background:"none", border:"none", cursor:"pointer", fontSize:"10px"}}>🔼 Max Listen</button>
        </div>

        {/* === UNTERE HÄLFTE: 2 SPALTEN MATRIX === */}
        <div style={{ height: `${100 - topPaneHeight}%`, display: "flex", background: "#fff", overflow: "hidden" }}>
          
          {/* Spalte 1: ALLE FENSTER */}
          <div style={{ width: `${matrixSplitLeft}px`, overflowY: "auto", padding: "15px", flexShrink: 0 }}>
            <h3 style={{margin:"0 0 10px 0", color:"#111", fontSize:"14px"}}>{T.all_windows} ({windows.length})</h3>
            <div style={{border:"1px solid #eee", borderRadius:"6px", overflowX:"auto"}}>
              <table style={{width: "100%", borderCollapse: "collapse", fontSize: "11px", textAlign: "left"}}>
                <thead><tr style={{background:"#f8f9fa", borderBottom:"1px solid #eee"}}>
                  <th title="Alle umschalten" onClick={()=>toggleAll('visible')} style={{padding:"6px", cursor:"pointer"}}>{T.col.v}🖱️</th>
                  <th style={{padding:"6px"}}>{T.col.id}</th><th style={{padding:"6px"}}>{T.col.dim}</th><th style={{padding:"6px"}}>{T.col.pr}</th><th style={{padding:"6px"}}>{T.col.dist}</th><th style={{padding:"6px"}}>{T.col.src}</th><th style={{padding:"6px"}}>{T.col.l}</th>
                </tr></thead>
                <tbody>
                  {windows.sort((a,b)=>a.dist-b.dist).map(w => {
                    let isSelected = selectedId === w.id;
                    return (
                      <tr id={`row-all-${w.id}`} key={`all-${w.id}`} onClick={()=>setSelectedId(w.id)} style={{background: isSelected ? "#e3f2fd" : (w.pinned ? "#fff3cd" : "transparent"), opacity: w.visible ? 1 : 0.4, borderBottom:"1px solid #eee", cursor:"pointer"}}>
                        <td style={{padding:"6px"}}><input type="checkbox" checked={w.visible} onChange={(e)=>{e.stopPropagation(); toggleWinProp(w.id, 'visible');}}/></td>
                        <td style={{padding:"6px", fontWeight:"bold", color: w.type==='Solar'?"#2c3e50":""}}>{w.pos} {w.type==='Solar'?'☀️':''}</td>
                        <td style={{padding:"6px"}}>{w.w}x{w.h}</td>
                        <td style={{padding:"6px", color:"#FF4B4B"}}>{w.price.toFixed(0)}€</td>
                        <td style={{padding:"6px", color:"#0066cc"}}>{w.dist}km</td>
                        <td style={{padding:"6px", maxWidth:"80px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{w.source}</td>
                        <td style={{padding:"6px"}}>{w.link ? <a href={w.link} target="_blank" onClick={e=>e.stopPropagation()}>🔗</a> : "-"}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div onMouseDown={handleMatrixDividerDragStart} style={{ width: "6px", background: "#ddd", cursor: "col-resize", zIndex: 50 }}></div>

          {/* Spalte 2: VERWENDETE FENSTER (Sichtbar) & GAPS */}
          <div style={{ flex: 1, overflowY: "auto", padding: "15px" }}>
            <h3 style={{margin:"0 0 10px 0", color:"#111", fontSize:"14px"}}>{T.used_windows} ({windows.filter(w=>w.visible).length})</h3>
            <div style={{border:"1px solid #eee", borderRadius:"6px", overflowX:"auto"}}>
              <table style={{width: "100%", borderCollapse: "collapse", fontSize: "11px", textAlign: "left"}}>
                <thead><tr style={{background:"#f8f9fa", borderBottom:"1px solid #eee"}}>
                  <th title="Alle umschalten" onClick={()=>toggleAllUsed('pinned')} style={{padding:"6px", cursor:"pointer"}}>{T.col.p}🖱️</th>
                  <th title="Alle umschalten" onClick={()=>toggleAllUsed('rotated')} style={{padding:"6px", cursor:"pointer"}}>{T.col.r}🖱️</th>
                  <th style={{padding:"6px"}}>{T.col.id}</th><th style={{padding:"6px"}}>{T.col.x}</th><th style={{padding:"6px"}}>{T.col.y}</th><th style={{padding:"6px"}}>{T.col.dim}</th><th style={{padding:"6px"}}>{T.col.a}</th><th style={{padding:"6px"}}>{T.col.pr}</th><th style={{padding:"6px"}}>{T.col.src}</th>
                </tr></thead>
                <tbody>
                  {windows.filter(w=>w.visible).map(w => {
                    let isSelected = selectedId === w.id;
                    let dispW = w.rotated ? w.h : w.w; let dispH = w.rotated ? w.w : w.h;
                    return (
                      <tr id={`row-used-${w.id}`} key={`used-${w.id}`} onClick={()=>setSelectedId(w.id)} style={{background: isSelected ? "#e3f2fd" : (w.pinned ? "#fff3cd" : "transparent"), borderBottom:"1px solid #eee", cursor:"pointer"}}>
                        <td style={{padding:"6px"}}><input type="checkbox" checked={w.pinned} onChange={(e)=>{e.stopPropagation(); toggleWinProp(w.id, 'pinned');}}/></td>
                        <td style={{padding:"6px"}}><input type="checkbox" checked={w.rotated} onChange={(e)=>{e.stopPropagation(); toggleRotate(w.id);}}/></td>
                        <td style={{padding:"6px", fontWeight:"bold", color: w.type==='Solar'?"#2c3e50":""}}>{w.pos} {w.type==='Solar'?'☀️':''}</td>
                        <td style={{padding:"6px"}}><input type="number" value={w.x} onChange={e=>{let arr=windows.map(x=>x.id===w.id?{...x, x:parseInt(e.target.value)||0, pinned:true}:x); setWindows(arr); runAI(arr, wall, params, seed);}} onClick={e=>e.stopPropagation()} style={{width:"50px", padding:"2px"}}/></td>
                        <td style={{padding:"6px"}}><input type="number" value={w.y} onChange={e=>{let arr=windows.map(x=>x.id===w.id?{...x, y:parseInt(e.target.value)||0, pinned:true}:x); setWindows(arr); runAI(arr, wall, params, seed);}} onClick={e=>e.stopPropagation()} style={{width:"50px", padding:"2px"}}/></td>
                        <td style={{padding:"6px"}}>{dispW}x{dispH}</td>
                        <td style={{padding:"6px", fontWeight:"bold"}}>{((dispW*dispH)/1000000).toFixed(2)}</td>
                        <td style={{padding:"6px", color:"#FF4B4B"}}>{w.price.toFixed(0)}€</td>
                        <td style={{padding:"6px", maxWidth:"80px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{w.source}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <h3 style={{margin:"20px 0 10px 0", color:"#111", fontSize:"14px"}}>{T.gaps_h} ({(gaps.length)} Paneele)</h3>
            {gaps.length > 0 ? (
              <div style={{border:"1px solid #eee", borderRadius:"6px", overflowX:"auto"}}>
                <table style={{width: "100%", borderCollapse: "collapse", fontSize: "11px", textAlign: "left"}}>
                  <thead><tr style={{background:"#222", color:"white"}}>
                    <th style={{padding:"6px"}}>ID</th><th style={{padding:"6px"}}>{T.col.dim}</th><th style={{padding:"6px"}}>{T.col.a}</th><th style={{padding:"6px"}}>{T.col.x}</th><th style={{padding:"6px"}}>{T.col.y}</th>
                  </tr></thead>
                  <tbody>
                    {gaps.map((g,i) => (
                      <tr key={g.id} style={{borderBottom:"1px solid #eee"}}>
                        <td style={{padding:"6px", fontWeight:"bold"}}>Gap-{i+1}</td><td style={{padding:"6px"}}>{g.w}x{g.h}</td>
                        <td style={{padding:"6px", fontWeight:"bold"}}>{((g.w*g.h)/1000000).toFixed(2)}</td>
                        <td style={{padding:"6px"}}>{g.x}</td><td style={{padding:"6px"}}>{g.y}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <div style={{background:"#d4edda", color:"#155724", padding:"10px", borderRadius:"6px", fontSize:"12px", fontWeight:"bold"}}>{T.no_gaps}</div>}

          </div>
        </div>
      </div>

      {/* DRAG BAR RECHTS */}
      {rightOpen && <div onMouseDown={handleRightSidebarDragStart} style={{ width: "6px", background: "#ddd", cursor: "col-resize", zIndex: 50 }}></div>}

      {/* =======================
          RECHTE SIDEBAR (CHATBOT)
      ======================= */}
      <div style={{ width: rightOpen ? `${rightWidth}px` : "0px", background: "#f8f9fa", borderLeft: rightOpen ? "1px solid #ddd" : "none", display: "flex", flexDirection: "column", transition: "width 0.1s", flexShrink: 0, overflow: "hidden" }}>
        <div style={{ width: `${rightWidth}px`, display: "flex", flexDirection: "column", height: "100%" }}>
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
