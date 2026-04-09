#!/usr/bin/env node
/**
 * updateFromSheets.js
 * Fetches data from Google Sheets (CSV export) and generates data.json
 * 
 * הערה: צריך להוריד ידני מהגוגל שיט:
 * 1. עצים sheet → Save as CSV → שמור בשם trees.csv
 * 2. שדרות sheet → Save as CSV → שמור בשם avenues.csv
 * 3. פוליגונים sheet → Save as CSV → שמור בשם polygons.csv
 * 4. התפלגות sheet → Save as CSV → שמור בשם distribution.csv
 * 
 * בחלופה: אם יש גישה API - עדכן את ה-fetch הנוכחי
 * 
 * Usage: node updateFromSheets.js
 */

const fs = require('fs');

/* ---------- EPSG:3857 Web Mercator → WGS84 [lat, lon] ---------- */
function merc2wgs84(x, y) {
  const lon = (x / 6378137) * (180 / Math.PI);
  const lat = (2 * Math.atan(Math.exp(y / 6378137)) - Math.PI / 2) * (180 / Math.PI);
  return [lat, lon];
}

function parseCSV(content) {
  const lines = content.split('\n').map(l => l.trim()).filter(l => l);
  if (!lines.length) return { headers: [], rows: [] };

  const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  // Make empty/duplicate headers unique so we can address any column by name
  const seen = {};
  const headers = rawHeaders.map((h, i) => {
    const key = h || `_col${i}`;
    if (seen[key] !== undefined) { seen[key]++; return `${key}_${seen[key]}`; }
    seen[key] = 0;
    return key;
  });

  const rows = lines.slice(1).map(line => {
    const vals = [];
    let current = '', inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') inQuotes = !inQuotes;
      else if (c === ',' && !inQuotes) { vals.push(current.replace(/^"|"$/g, '').trim()); current = ''; }
      else current += c;
    }
    vals.push(current.replace(/^"|"$/g, '').trim());
    const obj = {};
    headers.forEach((h, i) => {
      const v = vals[i];
      obj[h] = !v || v === '' ? null : (isNaN(v) ? v : parseFloat(v));
    });
    return obj;
  });

  return { headers, rows };
}

function readOrDefault(file) {
  try {
    if (!fs.existsSync(file)) {
      console.warn(`⚠️  ${file} not found — skipping`);
      return { headers: [], rows: [] };
    }
    const content = fs.readFileSync(file, 'utf-8');
    return parseCSV(content);
  } catch (e) {
    console.error(`❌ Error reading ${file}:`, e.message);
    return { headers: [], rows: [] };
  }
}

function smartGetField(obj, ...possibleNames) {
  for (const name of possibleNames) {
    if (name in obj && obj[name] !== null && obj[name] !== undefined) {
      return obj[name];
    }
  }
  return null;
}

async function buildData() {
  try {
    console.log('📂 Reading CSV files...\n');
    
    const trees = readOrDefault('trees.csv');
    const avenues = readOrDefault('avenues.csv');
    const polygons = readOrDefault('polygons.csv');
    const distribution = readOrDefault('distribution.csv');
    
    // Process trees
    const points = trees.rows.map((r, i) => {
      const x = smartGetField(r, 'X', 'x');
      const y = smartGetField(r, 'Y', 'y');
      const latlon = (x != null && y != null) ? merc2wgs84(x, y) : null;
      return {
        id: smartGetField(r, '#', 'ID', 'id') || (i + 1),
        girth: smartGetField(r, 'היקף עץ', 'היקף', 'Girth'),
        height: smartGetField(r, 'גובה עץ', 'גובה', 'Height'),
        trunk_diameter: smartGetField(r, 'קוטר גזע עץ', 'קוטר גזע', 'Trunk Diameter'),
        canopy_diameter: smartGetField(r, 'קוטר נוף', 'Canopy Diameter'),
        stems: smartGetField(r, 'מספר גזעים', 'גבעולים', 'Stems'),
        x,
        y,
        latlon,
        polygon: smartGetField(r, 'פוליגון', 'Polygon'),
      };
    }).filter(p => p.x != null && p.y != null);
    
    // Process avenues
    const lines = avenues.rows
      .filter(r => smartGetField(r, 'X_Start', 'X1', 'x1') != null)
      .map((r, i) => {
        const x1 = smartGetField(r, 'X_Start', 'X1', 'x1');
        const y1 = smartGetField(r, 'Y_Start', 'Y1', 'y1');
        const x2 = smartGetField(r, 'X_End', 'X2', 'x2');
        const y2 = smartGetField(r, 'Y_End', 'Y2', 'y2');
        const latlon1 = (x1 != null && y1 != null) ? merc2wgs84(x1, y1) : null;
        const latlon2 = (x2 != null && y2 != null) ? merc2wgs84(x2, y2) : null;
        return {
          id: smartGetField(r, 'ID', 'id') || (i + 1),
          tree_width: smartGetField(r, 'רוחב עץ', 'width', 'Tree Width'),
          avg_girth: smartGetField(r, 'היקף ממוצע', 'avg_girth', 'Avg Girth'),
          avg_height: smartGetField(r, 'גובה ממוצע', 'avg_height', 'Avg Height'),
          type: smartGetField(r, 'סוג', 'Type'),
          length: smartGetField(r, 'אורך', 'Length'),
          x1, y1, x2, y2,
          latlon1, latlon2,
          polygon: smartGetField(r, 'פוליגון', 'Polygon'),
        };
      }).filter(p => p.x1 != null && p.y1 != null && p.x2 != null && p.y2 != null);
    
    // Process polygons
    const polys = polygons.rows.filter(r => smartGetField(r, 'Polygon', 'פוליגון')).map(r => {
      // Parse "(x1,y1), (x2,y2), ..." coordinate string and convert to WGS84
      const coordsStr = smartGetField(r, 'Coordinates', 'Coords', 'coords', 'latlons', 'Latlons');
      let latlons = [], coords = [];
      if (coordsStr && typeof coordsStr === 'string') {
        const matches = coordsStr.match(/\(([^)]+)\)/g) || [];
        matches.forEach(m => {
          const parts = m.replace(/[()]/g, '').split(',');
          const x = parseFloat(parts[0]);
          const y = parseFloat(parts[1]);
          if (!isNaN(x) && !isNaN(y)) {
            coords.push([x, y]);
            latlons.push(merc2wgs84(x, y));
          }
        });
      }
      // space_code is the 5th column (index 4) which has an empty header → _col4
      const space_code = smartGetField(r, '_col4', 'טור E (מאחד)', 'Space Code', 'טור E');
      return {
        polygon: smartGetField(r, 'Polygon', 'פוליגון'),
        coords,
        latlons,
        space_name_he: smartGetField(r, 'Space Name [HE]', 'שם בעברית', 'Name HE'),
        space_name: smartGetField(r, 'Space Name', 'שם באנגלית', 'Name EN'),
        space_code,
        space_type: smartGetField(r, 'Space type', 'סוג', 'Type'),
        area_acres: smartGetField(r, 'Area (acres)', 'שטח acres', 'Area Acres'),
        tree_count_sheet: smartGetField(r, 'כמות שקמים', 'עצים בשיט', 'Tree Count'),
        avenue_count_sheet: smartGetField(r, 'כמות שדרות', 'שדרות בשיט', 'Avenue Count'),
        sum_girth_sheet: smartGetField(r, 'סכום היקף', 'סה״כ היקף', 'Sum Girth'),
        avg_girth_sheet: smartGetField(r, 'ממוצע היקף', 'Avg Girth'),
        std_girth_sheet: smartGetField(r, 'סטיית תקן היקף', 'סטיית תקן', 'Std Girth'),
        min_girth_sheet: smartGetField(r, 'היקף: מינימום', 'מינימום', 'Min Girth'),
        max_girth_sheet: smartGetField(r, 'היקף: מקסימום', 'מקסימום', 'Max Girth'),
        density_sheet: smartGetField(r, 'צפיפות שקמים בפוליגון', 'צפיפות', 'Density'),
      };
    });
    
    // Process distribution
    const dist = distribution.rows.filter(r => smartGetField(r, 'Girth Range', 'טווח')).map(r => ({
      range: smartGetField(r, 'Girth Range', 'טווח'),
      min: smartGetField(r, 'Min', 'מינימום'),
      max: smartGetField(r, 'Max', 'מקסימום'),
      count: smartGetField(r, 'Count', 'כמות'),
      percentage: smartGetField(r, '%', 'אחוז'),
    }));
    
    // Compute polygon stats
    const poly_stats = {};
    polys.forEach(p => {
      const pts = points.filter(t => t.polygon === p.polygon);
      const girths = pts.map(t => t.girth).filter(v => v != null && !isNaN(v));
      poly_stats[p.polygon] = {
        trees: pts.length,
        avg_girth: girths.length ? girths.reduce((a, b) => a + b) / girths.length : null,
        min_girth: girths.length ? Math.min(...girths) : null,
        max_girth: girths.length ? Math.max(...girths) : null,
      };
    });
    
    const data = {
      points,
      lines,
      polygons: polys,
      distribution: dist,
      poly_stats,
      lastUpdated: new Date().toISOString(),
    };
    
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    console.log(`✅ SUCCESS!`);
    console.log(`   📍 data.json updated`);
    console.log(`   - ${points.length} trees`);
    console.log(`   - ${lines.length} avenues`);
    console.log(`   - ${polys.length} polygons`);
    console.log(`   - ${dist.length} girth ranges`);
    console.log(`   ⏰ ${data.lastUpdated}\n`);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

buildData();
