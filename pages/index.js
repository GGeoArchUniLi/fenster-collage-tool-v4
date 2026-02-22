import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';

// --- VOLLSTÄNDIGES WÖRTERBUCH ---
const LANGS = {
  "🇩🇪 DE": { title: "🧱 Facade AI Pro v6.3", search_h: "1. Globale Suche", c_land: "Land", c_zip: "PLZ / Ort", c_rad: "Umkreis (km)", reuse: "Gebraucht", new: "Neu", btn_search: "Echte Daten abrufen", cust_h: "2. Eigenbestand", w_lbl: "Breite", h_lbl: "Höhe", btn_add: "Hinzufügen", wall_h: "Wandöffnung (mm)", btn_suggest: "💡 Wand optimieren", btn_shuf: "🎲 Zufälliger Seed", btn_gaps: "✂️ Zuschnitt drehen", lock: "🔒 Gepinnte behalten", sym: "📐 Symmetrie", chaos: "Chaos", seed: "Seed-Regler", auto_rot: "🔄 Auto-Rotation erlauben", multi_clust: "🏝️ Mehrere Cluster", wall_a: "Wandfläche", win_a: "Fensterfläche", fill: "Füllgrad", price: "Gesamtpreis", mat_h: "📋 Fenster Matrix", exp_csv: "📥 CSV", exp_cad: "📥 DXF", exp_img: "🖼️ Collage", exp_bw: "🖼️ S/W", exp_line: "🖼️ Linien", exp_zip: "📦 ZIP Komplett", gaps_h: "🟥 Zuschnitt-Liste", no_gaps: "Wand perfekt gefüllt!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Maße", a:"m²", src:"Herkunft", dist: "Distanz", pr:"Preis", l:"Link"} },
  "🇪🇸 ES": { title: "🧱 Generador Fachadas v6.3", search_h: "1. Búsqueda Global", c_land: "País", c_zip: "C.P. / Ciudad", c_rad: "Radio (km)", reuse: "Usado", new: "Nuevo", btn_search: "Obtener datos reales", cust_h: "2. Inventario Propio", w_lbl: "Ancho", h_lbl: "Alto", btn_add: "Añadir", wall_h: "Muro (mm)", btn_suggest: "💡 Optimizar Muro", btn_shuf: "🎲 Reagrupar (IA)", btn_gaps: "✂️ Rotar cortes", lock: "🔒 Bloquear Pines", sym: "📐 Simetría", chaos: "Caos", seed: "Semilla (Seed)", auto_rot: "🔄 Auto-rotación", multi_clust: "🏝️ Múltiples Clústeres", wall_a: "Área Muro", win_a: "Área Vent.", fill: "Relleno", price: "Precio Total", mat_h: "📋 Matriz de ventanas", exp_csv: "📥 CSV", exp_cad: "📥 DXF", exp_img: "🖼️ Collage", exp_bw: "🖼️ B/N", exp_line: "🖼️ Líneas", exp_zip: "📦 ZIP Completo", gaps_h: "🟥 Paneles de Relleno", no_gaps: "¡Muro perfecto!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dim", a:"m²", src:"Origen", dist: "Distancia", pr:"Precio", l:"Link"} },
  "🇬🇧 EN": { title: "🧱 Facade AI Pro v6.3", search_h: "1. Global Search", c_land: "Country", c_zip: "ZIP / City", c_rad: "Radius (km)", reuse: "Used", new: "New", btn_search: "Fetch Real Data", cust_h: "2. Custom Inventory", w_lbl: "Width", h_lbl: "Height", btn_add: "Add", wall_h: "Wall Opening (mm)", btn_suggest: "💡 Optimize Wall", btn_shuf: "🎲 Random Seed", btn_gaps: "✂️ Toggle Gaps", lock: "🔒 Keep Pinned", sym: "📐 Symmetry", chaos: "Chaos", seed: "Seed Slider", auto_rot: "🔄 Allow Auto-Rotation", multi_clust: "🏝️ Multiple Clusters", wall_a: "Wall Area", win_a: "Window Area", fill: "Fill Rate", price: "Total Price", mat_h: "📋 Window Matrix", exp_csv: "📥 CSV", exp_cad: "📥 DXF", exp_img: "🖼️ Collage", exp_bw: "🖼️ B/W", exp_line: "🖼️ Lines", exp_zip: "📦 Full ZIP", gaps_h: "🟥 Gap Panels", no_gaps: "Perfectly filled!", col: {v:"👁️", p:"📌", r:"🔄", f:"⭐", id:"ID", x:"X", y:"Y", dim:"Dims", a:"m²", src:"Source", dist: "Distance", pr:"Price", l:"Link"} }
};

const COUNTRIES = ["Deutschland", "Österreich", "Schweiz", "España", "France", "Italia", "United Kingdom"];

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
  const [params, setParams] = useState({ symmetry: false, chaos: 10, lock: true, gapToggle: false, autoRot: false, multi: false });
  const [seed, setSeed] = useState(42);
  
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({x: 0, y: 0});
  const canvasRef = useRef(null);

  const MAX_CANVAS_W = 500; 
  const MAX_CANVAS_H = 320;
  const SCALE = Math.min(MAX_CANVAS_W / Math.max(wall.w, 1), MAX_CANVAS_H / Math.max(wall.h, 1));
  const canvasH = wall.h * SCALE;
  const canvasW = wall.w * SCALE;

  useEffect(() => {
    let initial = [
      { id: "1", pos: "P1", w: 1200, h: 1400, x:0, y:0, price: 85, color: "#4682b4", source: "Lager", dist: 0, type: "Fenster", pinned: false, rotated: false, visible: true },
      { id: "2", pos: "P2", w: 2000, h: 2100, x:0, y:0, price: 350, color: "#add8e6", source: "Lager", dist: 0, type: "Fenster", pinned: false, rotated: false, visible: true },
      { id: "3", pos: "P3", w: 800, h: 600, x:0, y:0, price: 40, color: "#4682b4", source: "Lager", dist: 0, type: "Fenster", pinned: false, rotated: false, visible: true }
    ];
    setCounter(4);
    runAI(initial, wall, params, seed);
  }, []);

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

    let centers = currentParams.multi 
        ? [ { x: currentWall.w * 0.25, y: currentWall.h * 0.5 }, { x: currentWall.w * 0.75, y: currentWall.h * 0.5 } ]
        : [{ x: fixed_x.length ? fixed_x.reduce((a,b)=>a+b)/fixed_x.length : currentWall.w / 2, 
             y: fixed_y.length ? fixed_y.reduce((a,b)=>a+b)/fixed_y.length : currentWall.h / 2 }];

    let unpinned = winList.filter(w => w.visible && !w.pinned);
    unpinned = unpinned.map(w => ({...w, _weight: (w.w*w.h) * (1 + (rng()-0.5)*(currentParams.chaos/50)) })).sort((a,b)=>b._weight - a._weight);
    let step = currentWall.w > 15000 ? 200 : 100;
    
    unpinned.forEach(w => {
      let bestPos = null, minScore = Infinity;
      let orientations = currentParams.autoRot ? [false, true] : [w.rotated];
      
      orientations.forEach(rot => {
          let eff_w = rot ? w.h : w.w; let eff_h = rot ? w.w : w.h;
          if (eff_w > currentWall.w || eff_h > currentWall.h) return; 
          
          for(let y=0; y<=currentWall.h - eff_h; y+=step) {
            for(let x=0; x<=currentWall.w - eff_w; x+=step) {
              if(!checkOverlap(x, y, eff_w, eff_h, placed)) {
                let score = Math.min(...centers.map(c => Math.pow(x+eff_w/2 - c.x, 2) + Math.pow(y+eff_h/2 - c.y, 2)));
                if(currentParams.symmetry) score += Math.min(Math.abs(x+eff_w/2 - centers[0].x), Math.abs(y+eff_h/2 - centers[0].y)) * 5000;
                if(score < minScore) { minScore = score; bestPos = {...w, x:x, y:y, w:eff_w, h:eff_h, rotated: rot}; }
              }
            }
          }
      });
      if(bestPos) placed.push(bestPos);
    });

    if(placed.length > 0 && fixed_x.length === 0 && !currentParams.multi) {
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

  // --- MOCK API FÜR ECHTE DATEN ---
  const performSearch = async () => {
    const stdSizes = [ [800,1000], [1000,1200], [1200,1400], [2000,2100], [600,800] ];
    let results = []; let c = counter;
    const numToGen = Math.floor(Math.random() * 5) + 3;
    
    for(let i=0; i<numToGen; i++) {
        const size = stdSizes[Math.floor(Math.random() * stdSizes.length)];
        const isReuse = searchParams.reuse && (!searchParams.new || Math.random() > 0.5);
        const distance = Math.floor(Math.random() * searchParams.radius); 
        
        results.push({
            id: Math.random().toString(36).substr(2, 9), pos: `P${c++}`,
            w: size[0], h: size[1], x: 0, y: 0,
            price: isReuse ? (size[0]*size[1])/25000 + 20 : (size[0]*size[1])/15000 + 100,
            color: isReuse ? "#4682b4" : "#add8e6", 
            source: isReuse ? `eBay (${searchParams.zip})` : `Fensterbau`, 
            dist: distance, type: "Fenster",
            pinned: false, rotated: false, visible: true
        });
    }
    setCounter(c);
    runAI([...windows, ...results], wall, params, seed);
  };

  const addCustom = () => {
    const nw = { id: Math.random().toString(), pos: `P${counter}`, w: customWin.w, h: customWin.h, x:0, y:0, price: 0, color: "#90EE90", source: "Eigen", dist: 0, type: "Fenster", pinned: false, rotated: false, visible: true, force: true };
    setCounter(counter+1);
    runAI([...windows, nw], wall, params, seed);
  };

  const toggleAll = (prop) => {
      const allTrue = windows.every(w => w[prop]);
      const updated = windows.map(w => ({ ...w, [prop]: !allTrue }));
      setWindows(updated);
      runAI(updated, wall, params, seed);
  };

  // --- EXPORTE ---
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

  const getCanvasBlob = (canvas) => new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

  const exportZIP = async () => {
    const zip = new JSZip();
    zip.file("stueckliste.csv", getCsvString().replace("data:text/csv;charset=utf-8,", ""));
    zip.file("facade_export.dxf", getDxfString());
    zip.file("01_collage.png", await getCanvasBlob(drawMainCanvas()));
    zip.file("02_verschnitt_bw.png", await getCanvasBlob(drawBWCanvas()));
    zip.file("03_cad_linien.png", await getCanvasBlob(drawLineCanvas()));
    
    const content = await zip.generateAsync({type: "blob"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content); link.download = "facade_project.zip"; link.click();
  };

  // --- DRAG ---
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
      const updated = windows.map(w => w.id === draggingId ? {...w, pinned: true} : w);
      setDraggingId(null); runAI(updated, wall, params, seed);
    }
  };

  const toggleWinProp = (id, prop) => {
    const updated = windows.map(w => w.id === id ? {...w, [prop]: !w[prop]} : w);
    runAI(updated, wall, params, seed);
  };
  
  const totalPrice = windows.filter(w=>w.visible).reduce((s,w)=>s+w.price, 0);
  const winArea = windows.filter(w=>w.visible).reduce((s,w)=>s+(w.w*w.h), 0) / 1000000;
  const wallArea = (wall.w*wall.h) / 1000000;
  const fillRate = wallArea ? (winArea/wallArea)*100 : 0;

  const archSVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 600'><path d='M98,5 C84,5 72,17 72,31 C72,45 84,57 98,57 C112,57 124,45 124,31 C124,17 112,5 98,5 Z M78,65 C55,65 42,75 42,95 L42,280 C42,295 55,300 65,280 L75,190 L85,190 L85,580 C85,595 105,595 105,580 L105,350 L115,350 L115,580 C115,595 135,595 135,580 L135,190 L145,190 L155,280 C165,300 178,295 178,280 L178,95 C178,75 165,65 142,65 L78,65 Z' fill='%23222'/></svg>`;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "sans-serif", backgroundColor: "#f0f2f6", color:"#222" }}>
      
      {/* SIDEBAR */}
      <div style={{ width: "350px", background: "#fff", borderRight: "1px solid #ddd", padding: "20px", overflowY: "auto", flexShrink: 0 }}>
        
        <div style={{display:"flex", gap:"5px", flexWrap:"wrap", marginBottom:"15px"}}>
          {Object.keys(LANGS).map(l => (
            <button key={l} onClick={()=>setLang(l)} style={{background: lang===l ? "#222":"#eee", color: lang===l ? "#fff":"#333", border:"none", padding:"4px 8px", borderRadius:"4px", cursor:"pointer", fontSize:"11px", fontWeight:"bold"}}>{l.split(" ")[0]}</button>
          ))}
        </div>
        <h2 style={{fontSize:"18px", marginTop:0, color:"#111"}}>{T.title}</h2>

        <div style={{background:"#f8f9fa", padding:"15px", borderRadius:"6px", marginBottom:"15px", border:"1px solid #e9ecef"}}>
          <h4 style={{margin:"0 0 10px 0"}}>{T.search_h}</h4>
          
          <select value={searchParams.land} onChange={e=>setSearch({...searchParams, land:e.target.value})} style={{width:"100%", padding:"8px", marginBottom:"5px", border:"1px solid #ccc", borderRadius:"4px"}}>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          
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
             <input type="range" min="1000" max="30000" step="100" value={wall.w} onChange={e=>setWall({...wall, w: parseInt(e.target.value)})} onPointerUp={e=>runAI(windows, {...wall, w: parseInt(e.target.value)}, params, seed)} style={{flex:1}}/>
             <input type="number" value={wall.w} onChange={e=>setWall({...wall, w: parseInt(e.target.value)||0})} onBlur={e=>runAI(windows, {...wall, w: parseInt(e.target.value)||0}, params, seed)} onKeyDown={e=>{if(e.key==='Enter') runAI(windows, {...wall, w: parseInt(e.target.value)||0}, params, seed)}} style={{width:"70px", padding:"4px", border:"1px solid #ccc", borderRadius:"4px"}}/>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"15px"}}>
             <input type="range" min="1000" max="30000" step="100" value={wall.h} onChange={e=>setWall({...wall, h: parseInt(e.target.value)})} onPointerUp={e=>runAI(windows, {...wall, h: parseInt(e.target.value)}, params, seed)} style={{flex:1}}/>
             <input type="number" value={wall.h} onChange={e=>setWall({...wall, h: parseInt(e.target.value)||0})} onBlur={e=>runAI(windows, {...wall, h: parseInt(e.target.value)||0}, params, seed)} onKeyDown={e=>{if(e.key==='Enter') runAI(windows, {...wall, h: parseInt(e.target.value)||0}, params, seed)}} style={{width:"70px", padding:"4px", border:"1px solid #ccc", borderRadius:"4px"}}/>
          </div>

          <button onClick={optimizeWall} style={{width:"100%", padding:"10px", background:"#e3f2fd", color:"#0056b3", border:"1px solid #b6d4fe", borderRadius:"4px", cursor:"pointer", fontWeight:"bold", marginBottom:"15px"}}>
            {T.btn_suggest}
          </button>

          <div style={{background:"white", padding:"10px", borderRadius:"4px", border:"1px solid #ddd", marginBottom:"15px"}}>
            <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"5px"}}><input type="checkbox" checked={params.autoRot} onChange={e=>{let p={...params, autoRot:e.target.checked}; setParams(p); runAI(windows, wall, p, seed);}}/> {T.auto_rot}</label>
            <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"5px"}}><input type="checkbox" checked={params.multi} onChange={e=>{let p={...params, multi:e.target.checked}; setParams(p); runAI(windows, wall, p, seed);}}/> {T.multi_clust}</label>
            <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"5px"}}><input type="checkbox" checked={params.lock} onChange={e=>{let p={...params, lock:e.target.checked}; setParams(p); runAI(windows, wall, p, seed);}}/> {T.lock}</label>
            <label style={{fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", marginBottom:"10px"}}><input type="checkbox" checked={params.symmetry} onChange={e=>{let p={...params, symmetry:e.target.checked}; setParams(p); runAI(windows, wall, p, seed);}}/> {T.sym}</label>
            
            <label style={{fontSize:"11px", display:"block", color:"#555"}}>{T.seed}: {seed}</label>
            <input type="range" min="1" max="1000" value={seed} onChange={e=>setSeed(parseInt(e.target.value))} onPointerUp={e=>runAI(windows, wall, params, parseInt(e.target.value))} style={{width:"100%", marginBottom:"5px"}}/>

            <label style={{fontSize:"11px", display:"block", color:"#555", marginTop:"5px"}}>{T.chaos}: {params.chaos}%</label>
            <input type="range" min="0" max="100" value={params.chaos} onChange={e=>setParams({...params, chaos:parseInt(e.target.value)})} onPointerUp={e=>runAI(windows, wall, {...params, chaos:parseInt(e.target.value)}, seed)} style={{width:"100%", marginBottom:"5px"}}/>
          </div>

          <button onClick={()=>{let newSeed = Math.floor(Math.random()*1000); setSeed(newSeed); runAI(windows, wall, params, newSeed);}} style={{width:"100%", padding:"10px", background:"#222", color:"white", border:"none", borderRadius:"4px", cursor:"pointer", fontWeight:"bold", marginBottom:"5px"}}>{T.btn_shuf}</button>
          <button onClick={()=>{let p={...params, gapToggle:!params.gapToggle}; setParams(p); runAI(windows, wall, p, seed);}} style={{width:"100%", padding:"10px", background:"white", color:"#333", border:"1px solid #ccc", borderRadius:"4px", cursor:"pointer", fontWeight:"bold"}}>{T.btn_gaps}</button>
        </div>
      </div>

      {/* RECHTER BEREICH (SPLIT SCREEN) */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#eef1f5" }}>
        
        <div style={{ flexShrink: 0, paddingBottom: "10px" }}>
          <div style={{ display: "flex", gap: "15px", padding: "15px 25px", background: "white", borderBottom: "1px solid #ddd" }}>
            <div style={{flex:1, borderRight:"1px solid #eee"}}><div style={{fontSize:"12px", color:"#777", fontWeight:"bold"}}>{T.wall_a}</div><div style={{fontSize:"20px", fontWeight:"bold", color:"#222"}}>{wallArea.toFixed(2)} m²</div></div>
            <div style={{flex:1, borderRight:"1px solid #eee"}}><div style={{fontSize:"12px", color:"#777", fontWeight:"bold"}}>{T.win_a}</div><div style={{fontSize:"20px", fontWeight:"bold", color:"#222"}}>{winArea.toFixed(2)} m²</div></div>
            <div style={{flex:1, borderRight:"1px solid #eee"}}><div style={{fontSize:"12px", color:"#777", fontWeight:"bold"}}>{T.fill}</div><div style={{fontSize:"20px", fontWeight:"bold", color:"#222"}}>{fillRate.toFixed(1)} %</div></div>
            <div style={{flex:1}}><div style={{fontSize:"12px", color:"#FF4B4B", fontWeight:"bold"}}>{T.price}</div><div style={{fontSize:"20px", fontWeight:"bold", color:"#FF4B4B"}}>{totalPrice.toFixed(2)} €</div></div>
            
            <div style={{display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap", maxWidth:"450px", justifyContent:"flex-end"}}>
               <button onClick={()=>downloadCanvas(drawMainCanvas, "facade_collage.png")} style={{padding:"6px 10px", background:"#fff", border:"1px solid #ccc", borderRadius:"4px", cursor:"pointer", fontSize:"11px"}}>{T.exp_img}</button>
               <button onClick={()=>downloadCanvas(drawBWCanvas, "facade_sw.png")} style={{padding:"6px 10px", background:"#fff", border:"1px solid #ccc", borderRadius:"4px", cursor:"pointer", fontSize:"11px"}}>{T.exp_bw}</button>
               <button onClick={()=>downloadCanvas(drawLineCanvas, "facade_cad.png")} style={{padding:"6px 10px", background:"#fff", border:"1px solid #ccc", borderRadius:"4px", cursor:"pointer", fontSize:"11px"}}>{T.exp_line}</button>
               <button onClick={exportDXF} style={{padding:"6px 10px", background:"#e3f2fd", border:"1px solid #0056b3", color:"#0056b3", borderRadius:"4px", cursor:"pointer", fontWeight:"bold", fontSize:"11px"}}>{T.exp_cad}</button>
               <button onClick={exportZIP} style={{padding:"6px 10px", background:"#28a745", border:"none", color:"white", borderRadius:"4px", cursor:"pointer", fontWeight:"bold", fontSize:"11px"}}>{T.exp_zip}</button>
            </div>
          </div>

          <div style={{ padding: "15px 25px", display: "flex", gap: "25px", alignItems: "flex-end", justifyContent:"flex-start" }}>
            <div style={{display: "flex", alignItems: "flex-end"}}>
              <div style={{ width: Math.max(20, 400 * SCALE), height: 1780 * SCALE, marginRight: "10px", background: `url("${archSVG}") no-repeat bottom center/contain`, opacity: 0.7 }} />
              <div>
                <div style={{textAlign:"center", fontWeight:"bold", marginBottom:"8px", fontSize:"11px", color:"#555"}}>Collage (Drag & Drop)</div>
                <div ref={canvasRef} onMouseMove={onDrag} onMouseUp={stopDrag} onMouseLeave={stopDrag}
                  style={{ width: canvasW, height: canvasH, border: "3px solid #333", position: "relative", background: "repeating-linear-gradient(45deg, #fce4e4, #fce4e4 10px, #ffffff 10px, #ffffff 20px)", boxShadow: "0 5px 15px rgba(0,0,0,0.1)", borderRadius:"2px" }}>
                  
                  {gaps.map(g => (
                    <div key={g.id} style={{ position: "absolute", left: g.x * SCALE, bottom: g.y * SCALE, width: g.w * SCALE, height: g.h * SCALE, background: "rgba(255, 75, 75, 0.4)", border: "1px dashed #FF4B4B", pointerEvents: "none", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "9px", color: "white", textShadow: "0px 1px 2px rgba(0,0,0,0.8)", fontWeight: "bold" }}>
                      {(g.w * g.h / 1000000) >= 0.4 ? `${(g.w * g.h / 1000000).toFixed(2)}` : ""}
                    </div>
                  ))}

                  {windows.filter(w=>w.visible).map(w => {
                    let dispW = w.rotated ? w.h : w.w; let dispH = w.rotated ? w.w : w.h;
                    let isDragging = draggingId === w.id;
                    return (
                      <div key={w.id} onMouseDown={(e) => startDrag(e, w)}
                        style={{ position: "absolute", left: w.x * SCALE, bottom: w.y * SCALE, width: dispW * SCALE, height: dispH * SCALE, background: w.color, border: w.pinned ? "2px solid #111" : "1px solid #555", cursor: w.pinned ? "not-allowed" : (isDragging ? "grabbing" : "grab"), display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize: "10px", color:"#222", zIndex: w.pinned ? 5 : 10, opacity: w.pinned ? 0.95 : 1, transition: isDragging ? "none" : "all 0.1s" }}
                      >
                        <div style={{position: "absolute", top: 1, right: 1, display: "flex", gap: "2px"}}>
                          <button onClick={(e)=>{e.stopPropagation(); toggleWinProp(w.id, 'rotated');}} style={{background:"rgba(255,255,255,0.8)", border:"1px solid #777", borderRadius:"2px", fontSize:"8px", cursor:"pointer", padding:"1px 3px"}}>🔄</button>
                          <button onClick={(e)=>{e.stopPropagation(); toggleWinProp(w.id, 'pinned');}} style={{background:"rgba(255,255,255,0.8)", border:"1px solid #777", borderRadius:"2px", fontSize:"8px", cursor:"pointer", padding:"1px 3px"}}>{w.pinned ? "❌" : "📌"}</button>
                        </div>
                        <span style={{pointerEvents: "none", marginTop: "10px", textAlign: "center"}}>{w.pinned && "📌 "}{w.pos}<br/><span style={{fontSize: "8px", fontWeight:"normal"}}>{dispW}x{dispH}</span></span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{display: "flex", gap: "20px"}}>
              <div>
                <div style={{textAlign:"center", fontWeight:"bold", marginBottom:"8px", fontSize:"11px", color:"#555"}}>Verschnitt (S/W)</div>
                <div style={{ width: canvasW * 0.5, height: canvasH * 0.5, border: "2px solid #000", position: "relative", background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                  {gaps.map(g => (
                    <div key={"bw_"+g.id} style={{ position: "absolute", left: g.x * (SCALE*0.5), bottom: g.y * (SCALE*0.5), width: g.w * (SCALE*0.5), height: g.h * (SCALE*0.5), background: "black" }} />
                  ))}
                  {windows.filter(w=>w.visible).map(w => {
                    let dispW = w.rotated ? w.h : w.w; let dispH = w.rotated ? w.w : w.h;
                    return <div key={"bw_"+w.id} style={{ position: "absolute", left: w.x * (SCALE*0.5), bottom: w.y * (SCALE*0.5), width: dispW * (SCALE*0.5), height: dispH * (SCALE*0.5), background: "white", border: "1px solid #ccc" }} />
                  })}
                </div>
              </div>

              <div>
                <div style={{textAlign:"center", fontWeight:"bold", marginBottom:"8px", fontSize:"11px", color:"#555"}}>CAD Drahtmodell</div>
                <div style={{ width: canvasW * 0.5, height: canvasH * 0.5, border: "1px solid #000", position: "relative", background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                  {gaps.map(g => (
                    <div key={"line_"+g.id} style={{ position: "absolute", left: g.x * (SCALE*0.5), bottom: g.y * (SCALE*0.5), width: g.w * (SCALE*0.5), height: g.h * (SCALE*0.5), background: "transparent", border: "0.5px solid #ccc" }} />
                  ))}
                  {windows.filter(w=>w.visible).map(w => {
                    let dispW = w.rotated ? w.h : w.w; let dispH = w.rotated ? w.w : w.h;
                    return <div key={"line_"+w.id} style={{ position: "absolute", left: w.x * (SCALE*0.5), bottom: w.y * (SCALE*0.5), width: dispW * (SCALE*0.5), height: dispH * (SCALE*0.5), background: "transparent", border: "1px solid #333" }} />
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM HALF: MATRIX */}
        <div style={{ flex: 1, overflowY: "auto", background: "white", borderTop: "2px solid #ddd", padding: "25px" }}>
          
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"15px"}}>
            <h3 style={{margin:0, color:"#111"}}>{T.mat_h}</h3>
          </div>

          <div style={{border:"1px solid #eee", borderRadius:"6px", overflowX:"auto", marginBottom:"30px"}}>
            <table style={{width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left"}}>
              <thead><tr style={{background:"#f8f9fa", borderBottom:"1px solid #eee"}}>
                <th title="Alle umschalten" onClick={()=>toggleAll('visible')} style={{padding:"10px", cursor:"pointer", userSelect:"none", borderRight:"1px solid #ddd"}}>{T.col.v} 🖱️</th>
                <th title="Alle umschalten" onClick={()=>toggleAll('pinned')} style={{padding:"10px", cursor:"pointer", userSelect:"none", borderRight:"1px solid #ddd"}}>{T.col.p} 🖱️</th>
                <th title="Alle umschalten" onClick={()=>toggleAll('rotated')} style={{padding:"10px", cursor:"pointer", userSelect:"none", borderRight:"1px solid #ddd"}}>{T.col.r} 🖱️</th>
                
                <th style={{padding:"10px"}}>{T.col.id}</th><th style={{padding:"10px"}}>{T.col.x}</th><th style={{padding:"10px"}}>{T.col.y}</th><th style={{padding:"10px"}}>{T.col.dim}</th><th style={{padding:"10px"}}>{T.col.a}</th><th style={{padding:"10px", color:"#0066cc"}}>{T.col.dist}</th><th style={{padding:"10px"}}>{T.col.pr}</th><th style={{padding:"10px"}}>{T.col.src}</th>
              </tr></thead>
              <tbody>
                {windows.sort((a,b)=>a.dist-b.dist).map(w => {
                  let dispW = w.rotated ? w.h : w.w; let dispH = w.rotated ? w.w : w.h;
                  return (
                    <tr key={w.id} style={{background: w.pinned ? "#fff3cd" : "transparent", opacity: w.visible ? 1 : 0.4, borderBottom:"1px solid #eee"}}>
                      <td style={{padding:"8px 10px", borderRight:"1px solid #ddd"}}><input type="checkbox" checked={w.visible} onChange={()=>toggleWinProp(w.id, 'visible')} style={{cursor:"pointer"}}/></td>
                      <td style={{padding:"8px 10px", borderRight:"1px solid #ddd"}}><input type="checkbox" checked={w.pinned} onChange={()=>toggleWinProp(w.id, 'pinned')} style={{cursor:"pointer"}}/></td>
                      <td style={{padding:"8px 10px", borderRight:"1px solid #ddd"}}><input type="checkbox" checked={w.rotated} onChange={()=>toggleWinProp(w.id, 'rotated')} style={{cursor:"pointer"}}/></td>
                      <td style={{padding:"8px 10px", fontWeight:"bold"}}>{w.pos}</td>
                      <td style={{padding:"8px 10px"}}><input type="number" value={w.x} onChange={e=>{let arr=windows.map(x=>x.id===w.id?{...x, x:parseInt(e.target.value)||0, pinned:true}:x); setWindows(arr); runAI(arr, wall, params, seed);}} style={{width:"70px", padding:"4px", border:"1px solid #ccc", borderRadius:"4px"}}/></td>
                      <td style={{padding:"8px 10px"}}><input type="number" value={w.y} onChange={e=>{let arr=windows.map(x=>x.id===w.id?{...x, y:parseInt(e.target.value)||0, pinned:true}:x); setWindows(arr); runAI(arr, wall, params, seed);}} style={{width:"70px", padding:"4px", border:"1px solid #ccc", borderRadius:"4px"}}/></td>
                      <td style={{padding:"8px 10px"}}>{dispW} x {dispH}</td>
                      <td style={{padding:"8px 10px", fontWeight:"bold"}}>{((dispW*dispH)/1000000).toFixed(2)}</td>
                      <td style={{padding:"8px 10px", color:"#0066cc", fontWeight:"bold"}}>{w.dist} km</td>
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
