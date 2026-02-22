// Dateiname: pages/api/scrape.js

export default async function handler(req, res) {
    const { land, zip, radius, reuse, isNew } = req.query;
    
    // HIER WÜRDE DER ECHTE SCRAPER STARTEN (z.B. via Puppeteer, Cheerio oder SerpAPI)
    // Da eBay/Kleinanzeigen Scraper blockieren, ist die Struktur hier als API vorbereitet.
    
    const maxRadius = parseInt(radius) || 50;
    const stdSizes = [ [800,1000], [1000,1200], [1200,1400], [2000,2100], [600,800], [1500,1500] ];
    let results = [];
    
    // Wir generieren realistische Treffer aus dem Umkreis
    const numToGen = Math.floor(Math.random() * 6) + 4; 
    
    for(let i = 0; i < numToGen; i++) {
        const size = stdSizes[Math.floor(Math.random() * stdSizes.length)];
        const isReuseHit = reuse === 'true' && (isNew === 'false' || Math.random() > 0.5);
        
        // Entfernung berechnen (zufällig innerhalb des gewählten Radius)
        const dist = Math.floor(Math.random() * maxRadius);
        
        results.push({
            w: size[0], 
            h: size[1], 
            price: isReuseHit ? (size[0]*size[1])/25000 + 20 : (size[0]*size[1])/15000 + 100,
            color: isReuseHit ? "#4682b4" : "#add8e6", 
            source: isReuseHit ? `Gebrauchtmarkt (${land})` : `Fensterhandel (${land})`, 
            type: "Fenster",
            dist: dist, // Die neue Entfernungs-Eigenschaft!
            link: `https://www.google.com/search?q=Fenster+${size[0]}x${size[1]}+${zip}`
        });
    }

    // Kurze Ladezeit simulieren, damit es sich wie eine echte Web-Anfrage anfühlt
    await new Promise(resolve => setTimeout(resolve, 600));

    res.status(200).json({ results });
}
