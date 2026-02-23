function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

export const checkOverlap = (x, y, w, h, placedList, ignoreId = null) => {
    return placedList.some(p => {
        if(p.id === ignoreId) return false;
        return !(x + w <= p.x || x >= p.x + p.w || y + h <= p.y || y >= p.y + p.h);
    });
};

export const calculateGapsExact = (wall_w, wall_h, placed, toggle_dir) => {
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

export const computeLayout = (winList, currentWall, currentParams, currentSeed) => {
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
    
    let bbox = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    const updateBBox = () => {
        if(placed.length > 0) {
            bbox.minX = Math.min(...placed.map(p=>p.x)); bbox.maxX = Math.max(...placed.map(p=>p.x+p.w));
            bbox.minY = Math.min(...placed.map(p=>p.y)); bbox.maxY = Math.max(...placed.map(p=>p.y+p.h));
        }
    };
    updateBBox();

    unpinnedWindows.forEach(w => {
      let bestPos = null, minScore = Infinity;
      let orientations = currentParams.autoRot ? [false, true] : [w.rotated];
      const gravityFactor = Math.pow((currentParams.gravity / 10), 3) || 0.1; 

      orientations.forEach(rot => {
          let eff_w = rot ? w.h : w.w; let eff_h = rot ? w.w : w.h;
          if (eff_w > currentWall.w || eff_h > currentWall.h) return; 
          for(let y=0; y<=currentWall.h - eff_h; y+=step) {
            for(let x=0; x<=currentWall.w - eff_w; x+=step) {
              if(!checkOverlap(x, y, eff_w, eff_h, placed)) {
                let score = 0;
                if (currentParams.layoutMode === 'scatter') { score = rng() * 100000; } 
                else if (currentParams.layoutMode === 'rect') { score = y * 10000 + x; } 
                else {
                    let distScore = Math.min(...centers.map(c => Math.pow(x+eff_w/2 - c.x, 2) + Math.pow(y+eff_h/2 - c.y, 2)));
                    score = distScore * gravityFactor;
                    if(currentParams.symmetry) score += Math.min(Math.abs(x+eff_w/2 - centers[0].x), Math.abs(y+eff_h/2 - centers[0].y)) * 50000;
                }

                if (currentParams.rectCluster && placed.length > 0) {
                    let newArea = (Math.max(bbox.maxX, x + eff_w) - Math.min(bbox.minX, x)) * (Math.max(bbox.maxY, y + eff_h) - Math.min(bbox.minY, y));
                    score += newArea * 100; 
                }
                
                if(score < minScore) { minScore = score; bestPos = {...w, x:x, y:y, w:eff_w, h:eff_h, rotated: rot}; }
              }
            }
          }
      });
      if(bestPos) { placed.push(bestPos); updateBBox(); }
    });

    if(placed.length > 0 && fixed_x.length === 0 && currentParams.layoutMode !== 'scatter' && currentParams.clusterCount === 1) {
      let minX = Math.min(...placed.map(p=>p.x)), maxX = Math.max(...placed.map(p=>p.x+p.w));
      let minY = Math.min(...placed.map(p=>p.y)), maxY = Math.max(...placed.map(p=>p.y+p.h));
      let sx = Math.floor((currentWall.w - (maxX - minX)) / 2) - minX;
      let sy = Math.floor((currentWall.h - (maxY - minY)) / 2) - minY;
      placed = placed.map(p => ({...p, x: p.x+sx, y: p.y+sy}));
    }

    let generatedSolar = [];
    if (currentParams.solarAuto) {
        let tempGaps = calculateGapsExact(currentWall.w, currentWall.h, placed, false);
        tempGaps.sort((a,b) => (b.w*b.h) - (a.w*a.h));
        let availableSolar = winList.filter(w => w.type === 'Solar' && w.visible && !w.pinned && !placed.find(p=>p.id===w.id));
        tempGaps.forEach(g => {
            if (g.w >= 800 && g.h >= 1000) { 
                let s = availableSolar.pop();
                if (!s && currentParams.solarFetch) {
                    s = { id: Math.random().toString(36).substr(2, 9), pos: `S-Auto`, w: 1000, h: 1600, x:0, y:0, price: 150, color: "#2c3e50", source: "Auto-Suche", dist: 10, type: "Solar", pinned: false, rotated: false, visible: true, link: "" };
                    generatedSolar.push(s);
                }
                if (s) {
                    let fits = false, rot = false;
                    if (s.w <= g.w && s.h <= g.h) { fits = true; rot = false; }
                    else if (currentParams.autoRot && s.h <= g.w && s.w <= g.h) { fits = true; rot = true; }
                    if (fits) {
                        let eff_w = rot ? s.h : s.w; let eff_h = rot ? s.w : s.h;
                        placed.push({...s, x: g.x, y: g.y, w: eff_w, h: eff_h, rotated: rot});
                    } else { availableSolar.push(s); }
                }
            }
        });
    }

    let rawGaps = calculateGapsExact(currentWall.w, currentWall.h, placed, currentParams.gapToggle);
    let finalGaps = [];
    let maxDim = currentParams.gapMaxDim || 5000;
    rawGaps.forEach(g => {
        if (maxDim < 5000 && (g.w > maxDim || g.h > maxDim)) {
            let cols = Math.ceil(g.w / maxDim); let rows = Math.ceil(g.h / maxDim);
            let stepW = Math.round(g.w / cols); let stepH = Math.round(g.h / rows);
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

    let combinedWinList = [...winList, ...generatedSolar];
    let newWindows = combinedWinList.map(w => {
      let p = placed.find(pl => pl.id === w.id);
      if(p) return {...w, x: p.x, y: p.y, rotated: p.rotated}; 
      return w; 
    });

    return { newWindows, newGaps: finalGaps };
};
