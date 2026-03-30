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

function parseCSV(content) {
  const lines = content.split('\n').map(l => l.trim()).filter(l => l);
  if (!lines.length) return { headers: [], rows: [] };
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
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
    const points = trees.rows.filter(r => smartGetField(r, 'פוליגון', 'Polygon')).map(r => ({
      id: smartGetField(r, '#', 'ID', 'id'),
      girth: smartGetField(r, 'היקף', 'Girth'),
      height: smartGetField(r, 'גובה', 'Height'),
      trunk_diameter: smartGetField(r, 'קוטר גזע', 'Trunk Diameter'),
      canopy_diameter: smartGetField(r, 'קוטר כתר', 'Canopy Diameter'),
      stems: smartGetField(r, 'גבעולים', 'Stems'),
      x: smartGetField(r, 'X', 'x'),
      y: smartGetField(r, 'Y', 'y'),
      latlon: (() => {
        const lat = smartGetField(r, 'lat');
        const lon = smartGetField(r, 'lon');
        return lat && lon ? [lat, lon] : null;
      })(),
      polygon: smartGetField(r, 'פוליגון', 'Polygon'),
    })).filter(p => p.x != null && p.y != null);
    
    // Process avenues
    const lines = avenues.rows.filter(r => smartGetField(r, 'ID', 'id')).map(r => ({
      id: smartGetField(r, 'ID', 'id'),
      tree_width: smartGetField(r, 'width', 'Tree Width'),
      avg_girth: smartGetField(r, 'avg_girth', 'Avg Girth'),
      avg_height: smartGetField(r, 'avg_height', 'Avg Height'),
      type: smartGetField(r, 'סוג', 'Type'),
      length: smartGetField(r, 'אורך', 'Length'),
      x1: smartGetField(r, 'X1'),
      y1: smartGetField(r, 'Y1'),
      x2: smartGetField(r, 'X2'),
      y2: smartGetField(r, 'Y2'),
      latlon1: (() => {
        const lat = smartGetField(r, 'lat1');
        const lon = smartGetField(r, 'lon1');
        return lat && lon ? [lat, lon] : null;
      })(),
      latlon2: (() => {
        const lat = smartGetField(r, 'lat2');
        const lon = smartGetField(r, 'lon2');
        return lat && lon ? [lat, lon] : null;
      })(),
      polygon: smartGetField(r, 'פוליגון', 'Polygon'),
    })).filter(p => p.x1 != null && p.y1 != null && p.x2 != null && p.y2 != null);
    
    // Process polygons
    const polys = polygons.rows.filter(r => smartGetField(r, 'Polygon', 'פוליגון')).map(r => ({
      polygon: smartGetField(r, 'Polygon', 'פוליגון'),
      coords: (() => {
        const c = smartGetField(r, 'coords', 'Coords');
        return c ? c.split(';').map(p => { const [x, y] = p.trim().split(','); return [parseFloat(x), parseFloat(y)]; }) : [];
      })(),
      latlons: (() => {
        const c = smartGetField(r, 'latlons', 'Latlons');
        return c ? c.split(';').map(p => { const [lat, lon] = p.trim().split(','); return [parseFloat(lat), parseFloat(lon)]; }) : [];
      })(),
      space_name_he: smartGetField(r, 'שם בעברית', 'Name HE'),
      space_name: smartGetField(r, 'שם באנגלית', 'Name EN'),
      space_code: smartGetField(r, 'טור E (מאחד)', 'Space Code', 'טור E'),
      space_type: smartGetField(r, 'סוג', 'Type'),
      area_acres: smartGetField(r, 'שטח acres', 'Area Acres'),
      tree_count_sheet: smartGetField(r, 'עצים בשיט', 'Tree Count'),
      avenue_count_sheet: smartGetField(r, 'שדרות בשיט', 'Avenue Count'),
      sum_girth_sheet: smartGetField(r, 'סה״כ היקף', 'Sum Girth'),
      avg_girth_sheet: smartGetField(r, 'ממוצע היקף', 'Avg Girth'),
      avg_girth_pos_sheet: smartGetField(r, 'ממוצע חיובי', 'Avg Girth Pos'),
      std_girth_sheet: smartGetField(r, 'סטיית תקן', 'Std Girth'),
      min_girth_sheet: smartGetField(r, 'מינימום', 'Min Girth'),
      max_girth_sheet: smartGetField(r, 'מקסימום', 'Max Girth'),
      density_sheet: smartGetField(r, 'צפיפות', 'Density'),
    }));
    
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
