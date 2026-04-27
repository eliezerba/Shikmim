#!/usr/bin/env node
/**
 * updateFromSheets.js (v10)
 * Fetches dashboard data from a Google Sheet (published or edit/share URL) and builds data.json.
 * Fallback: local CSV files in project root (trees.csv, avenues.csv, polygons.csv, distribution.csv).
 */

const fs = require('fs');
const https = require('https');
const http = require('http');

const DEFAULT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1Ipq2qcn_kyLTh-F50ViV4vS5OPYNfYhN/edit?usp=sharing&ouid=105725307919045323977&rtpof=true&sd=true';

const SHEET_NAME_CANDIDATES = {
  trees: ['עצים', 'trees', 'tree'],
  avenues: ['שדרות', 'avenues', 'avenue', 'lines'],
  polygons: ['פוליגונים', 'polygons', 'polygon'],
  distribution: ['התפלגות', 'distribution', 'histogram'],
};

/* ---------- EPSG:3857 Web Mercator -> WGS84 [lat, lon] ---------- */
function merc2wgs84(x, y) {
  const lon = (x / 6378137) * (180 / Math.PI);
  const lat = (2 * Math.atan(Math.exp(y / 6378137)) - Math.PI / 2) * (180 / Math.PI);
  return [lat, lon];
}

function parseCSV(content) {
  const records = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const c = content[i];

    if (c === '"') {
      if (inQuotes && content[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (c === ',' && !inQuotes) {
      row.push(field);
      field = '';
      continue;
    }

    if ((c === '\n' || c === '\r') && !inQuotes) {
      if (c === '\r' && content[i + 1] === '\n') i += 1;
      row.push(field);
      records.push(row);
      row = [];
      field = '';
      continue;
    }

    field += c;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    records.push(row);
  }

  while (records.length && records[records.length - 1].every(v => String(v || '').trim() === '')) {
    records.pop();
  }
  while (records.length && records[0].every(v => String(v || '').trim() === '')) {
    records.shift();
  }
  if (!records.length) return { headers: [], rows: [] };

  const rawHeaders = records[0].map(h => String(h || '').trim().replace(/^"|"$/g, ''));
  const seen = {};
  const headers = rawHeaders.map((h, i) => {
    const key = h || `_col${i}`;
    if (seen[key] !== undefined) {
      seen[key] += 1;
      return `${key}_${seen[key]}`;
    }
    seen[key] = 0;
    return key;
  });

  const rows = records.slice(1)
  .filter(vals => vals.some(v => String(v || '').trim() !== ''))
  .map(vals => {

    const obj = {};
    headers.forEach((h, i) => {
      const raw = String(vals[i] ?? '').trim();
      if (!raw) {
        obj[h] = null;
        return;
      }
      const nrm = raw.replace(/,/g, '');
      obj[h] = /^-?\d+(\.\d+)?$/.test(nrm) ? parseFloat(nrm) : raw;
    });
    return obj;
  });

  return { headers, rows };
}

function smartGetField(obj, ...possibleNames) {
  for (const name of possibleNames) {
    if (name in obj && obj[name] !== null && obj[name] !== undefined) {
      return obj[name];
    }
  }
  return null;
}

function normalizeName(s) {
  return String(s || '').trim().toLowerCase().replace(/[\s_\-]+/g, '');
}

function normalizePolygonCode(value) {
  if (value == null) return null;
  const code = String(value).trim().toUpperCase();
  return code || null;
}

function normalizeSpaceCode(value, polygonCode) {
  const raw = value == null ? '' : String(value).trim();
  if (raw) return raw.toUpperCase();
  const poly = normalizePolygonCode(polygonCode);
  if (!poly) return null;
  const root = poly.match(/^[A-Z]+/);
  return root ? root[0] : poly;
}

function extractPublishedKey(pubUrl) {
  const m = String(pubUrl).match(/\/d\/e\/([^/]+)\//);
  return m ? m[1] : null;
}

function extractSheetId(url) {
  const m = String(url).match(/\/spreadsheets\/d\/([^/]+)/);
  return m ? m[1] : null;
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https://') ? https : http;
    client.get(url, res => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        fetchText(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function discoverSheetGids(pubHtmlUrl) {
  const html = await fetchText(pubHtmlUrl);
  const results = [];

  const anchorRegex = /href="[^"]*?[?&]gid=(\d+)[^"]*"[^>]*>([^<]+)</g;
  let m;
  while ((m = anchorRegex.exec(html)) !== null) {
    results.push({ gid: m[1], name: m[2].trim() });
  }

  const jsonRegex = /"sheetId"\s*:\s*"?(\d+)"?\s*,\s*"title"\s*:\s*"([^"]+)"/g;
  while ((m = jsonRegex.exec(html)) !== null) {
    results.push({ gid: m[1], name: m[2].trim() });
  }

  const itemsPushRegex = /items\.push\(\{name:\s*"([^"]+)"[\s\S]*?gid:\s*"(-?\d+)"/g;
  while ((m = itemsPushRegex.exec(html)) !== null) {
    results.push({ gid: m[2], name: m[1].trim() });
  }

  const dedup = new Map();
  results.forEach(r => {
    if (!dedup.has(r.gid)) dedup.set(r.gid, r);
  });
  return Array.from(dedup.values());
}

function pickGid(entries, candidates) {
  const normCandidates = candidates.map(normalizeName);
  for (const e of entries) {
    const n = normalizeName(e.name);
    if (normCandidates.some(c => n.includes(c))) return e.gid;
  }
  return null;
}

function readOrDefault(file) {
  if (!fs.existsSync(file)) {
    console.warn(`WARN: ${file} not found`);
    return { headers: [], rows: [] };
  }
  try {
    return parseCSV(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.warn(`WARN: failed reading ${file}: ${err.message}`);
    return { headers: [], rows: [] };
  }
}

async function fetchSheetCsvOrFallback(sourceInfo, gid, fallbackFile, label) {
  if (!gid) return readOrDefault(fallbackFile);
  let csvUrl = null;
  if (sourceInfo.pubKey) {
    csvUrl = `https://docs.google.com/spreadsheets/d/e/${sourceInfo.pubKey}/pub?gid=${gid}&single=true&output=csv`;
  } else if (sourceInfo.sheetId) {
    csvUrl = `https://docs.google.com/spreadsheets/d/${sourceInfo.sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
  }
  if (!csvUrl) return readOrDefault(fallbackFile);
  try {
    const csv = await fetchText(csvUrl);
    const parsed = parseCSV(csv);
    console.log(`OK: ${label} from published sheet (${parsed.rows.length} rows)`);
    return parsed;
  } catch (err) {
    console.warn(`WARN: ${label} fetch failed (${err.message}), fallback to ${fallbackFile}`);
    return readOrDefault(fallbackFile);
  }
}

async function fetchBySheetNameOrFallback(sourceInfo, sheetNameCandidates, fallbackFile, label) {
  if (!sourceInfo.sheetId || !Array.isArray(sheetNameCandidates) || !sheetNameCandidates.length) {
    return readOrDefault(fallbackFile);
  }

  const expectedHeaderHints = {
    trees: ['x', 'y', 'היקעץ', 'היקףעץ', 'polygon', 'פוליגון'],
    avenues: ['xstart', 'x1', 'אורך', 'length', 'polygon', 'פוליגון'],
    polygons: ['polygon', 'coordinates', 'coords', 'שםבעברית', 'spacename'],
    distribution: ['girthrange', 'girtherange', 'min', 'max', 'count'],
  };

  const hints = expectedHeaderHints[label] || [];
  const hasExpectedHeaders = parsed => {
    if (!hints.length) return true;
    const normHeaders = parsed.headers.map(normalizeName);
    return hints.some(h => normHeaders.some(col => col.includes(h)));
  };

  for (const sheetName of sheetNameCandidates) {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sourceInfo.sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    try {
      const csv = await fetchText(csvUrl);
      const parsed = parseCSV(csv);
      if ((parsed.rows.length > 0 || parsed.headers.length > 0) && hasExpectedHeaders(parsed)) {
        console.log(`OK: ${label} by sheet name "${sheetName}" (${parsed.rows.length} rows)`);
        return parsed;
      }
    } catch (err) {
      // keep trying next candidate name
    }
  }

  console.warn(`WARN: ${label} sheet-name fetch failed, fallback to ${fallbackFile}`);
  return readOrDefault(fallbackFile);
}

function parsePolygonCoords(coordsStr) {
  const latlons = [];
  const coords = [];
  if (!coordsStr || typeof coordsStr !== 'string') return { coords, latlons };

  const matches = coordsStr.match(/\(([^)]+)\)/g) || [];
  matches.forEach(m => {
    const parts = m.replace(/[()]/g, '').split(',');
    const x = parseFloat(parts[0]);
    const y = parseFloat(parts[1]);
    if (!Number.isNaN(x) && !Number.isNaN(y)) {
      coords.push([x, y]);
      latlons.push(merc2wgs84(x, y));
    }
  });
  return { coords, latlons };
}

function normalizeDistributionRows(rows) {
  return rows.map(r => {
    const out = { ...r };
    out.girth_range = smartGetField(r, 'girth_range', 'Girth Range', 'טווח');
    return out;
  }).filter(r => r.girth_range != null);
}

async function buildData() {
  try {
    console.log('Reading source sheets...');

    const sourceUrl = process.argv[2] || process.env.SHEET_URL || DEFAULT_SHEET_URL;
    const sourceInfo = {
      url: sourceUrl,
      pubKey: extractPublishedKey(sourceUrl),
      sheetId: extractSheetId(sourceUrl),
    };
    console.log(`Source sheet: ${sourceUrl}`);

    let gidMap = { trees: null, avenues: null, polygons: null, distribution: null };

    if (sourceInfo.pubKey || sourceInfo.sheetId) {
      try {
        const tabs = await discoverSheetGids(sourceInfo.url);
        gidMap = {
          trees: pickGid(tabs, SHEET_NAME_CANDIDATES.trees),
          avenues: pickGid(tabs, SHEET_NAME_CANDIDATES.avenues),
          polygons: pickGid(tabs, SHEET_NAME_CANDIDATES.polygons),
          distribution: pickGid(tabs, SHEET_NAME_CANDIDATES.distribution),
        };
        console.log(`Discovered gids: ${JSON.stringify(gidMap)}`);
      } catch (err) {
        console.warn(`WARN: could not discover gids (${err.message})`);
      }
    }

    const trees = gidMap.trees
      ? await fetchSheetCsvOrFallback(sourceInfo, gidMap.trees, 'trees.csv', 'trees')
      : await fetchBySheetNameOrFallback(sourceInfo, SHEET_NAME_CANDIDATES.trees, 'trees.csv', 'trees');

    const avenues = gidMap.avenues
      ? await fetchSheetCsvOrFallback(sourceInfo, gidMap.avenues, 'avenues.csv', 'avenues')
      : await fetchBySheetNameOrFallback(sourceInfo, SHEET_NAME_CANDIDATES.avenues, 'avenues.csv', 'avenues');

    const polygons = gidMap.polygons
      ? await fetchSheetCsvOrFallback(sourceInfo, gidMap.polygons, 'polygons.csv', 'polygons')
      : await fetchBySheetNameOrFallback(sourceInfo, SHEET_NAME_CANDIDATES.polygons, 'polygons.csv', 'polygons');

    const distribution = gidMap.distribution
      ? await fetchSheetCsvOrFallback(sourceInfo, gidMap.distribution, 'distribution.csv', 'distribution')
      : await fetchBySheetNameOrFallback(sourceInfo, SHEET_NAME_CANDIDATES.distribution, 'distribution.csv', 'distribution');

    const points = trees.rows.map((r, i) => {
      const x = smartGetField(r, 'X', 'x');
      const y = smartGetField(r, 'Y', 'y');
      const latlon = (x != null && y != null) ? merc2wgs84(x, y) : null;
      return {
        id: smartGetField(r, '#', 'ID', 'id') || (i + 1),
        girth: smartGetField(r, 'היקף עץ', 'היקף', 'Girth', 'girth'),
        height: smartGetField(r, 'גובה עץ', 'גובה', 'Height', 'height'),
        trunk_diameter: smartGetField(r, 'קוטר גזע עץ', 'קוטר גזע', 'Trunk Diameter', 'trunk_diameter'),
        canopy_diameter: smartGetField(r, 'קוטר נוף', 'Canopy Diameter', 'canopy_diameter'),
        stems: smartGetField(r, 'מספר גזעים', 'גבעולים', 'Stems', 'stems'),
        x,
        y,
        latlon,
        polygon: normalizePolygonCode(smartGetField(r, 'פוליגון', 'Polygon', 'polygon')),
      };
    }).filter(p => p.x != null && p.y != null);

    const lines = avenues.rows.filter(r => smartGetField(r, 'X_Start', 'X1', 'x1') != null).map((r, i) => {
      const x1 = smartGetField(r, 'X_Start', 'X1', 'x1');
      const y1 = smartGetField(r, 'Y_Start', 'Y1', 'y1');
      const x2 = smartGetField(r, 'X_End', 'X2', 'x2');
      const y2 = smartGetField(r, 'Y_End', 'Y2', 'y2');
      return {
        id: smartGetField(r, 'ID', 'id') || (i + 1),
        tree_width: smartGetField(r, 'רוחב עץ', 'width', 'Tree Width'),
        avg_girth: smartGetField(r, 'היקף ממוצע', 'avg_girth', 'Avg Girth'),
        avg_height: smartGetField(r, 'גובה ממוצע', 'avg_height', 'Avg Height'),
        type: smartGetField(r, 'סוג', 'Type', 'type'),
        length: smartGetField(r, 'אורך', 'Length', 'length'),
        x1, y1, x2, y2,
        latlon1: (x1 != null && y1 != null) ? merc2wgs84(x1, y1) : null,
        latlon2: (x2 != null && y2 != null) ? merc2wgs84(x2, y2) : null,
        polygon: normalizePolygonCode(smartGetField(r, 'פוליגון', 'Polygon', 'polygon')),
      };
    }).filter(l => l.x1 != null && l.y1 != null && l.x2 != null && l.y2 != null);

    const polys = polygons.rows.filter(r => smartGetField(r, 'Polygon', 'פוליגון', 'polygon')).map(r => {
      const polygonCode = normalizePolygonCode(smartGetField(r, 'Polygon', 'פוליגון', 'polygon'));
      const coordsStr = smartGetField(r, 'Coordinates', 'Coords', 'coords', 'latlons', 'Latlons');
      const parsedCoords = parsePolygonCoords(coordsStr);
      return {
        polygon: polygonCode,
        coords: parsedCoords.coords,
        latlons: parsedCoords.latlons,
        space_name_he: smartGetField(r, 'Space Name [HE]', 'שם בעברית', 'Name HE', 'space_name_he'),
        space_name: smartGetField(r, 'Space Name', 'שם באנגלית', 'Name EN', 'space_name'),
        // AREA is the super-area grouping key in the current sheet.
        space_code: normalizeSpaceCode(
          smartGetField(r, 'AREA', 'Area', 'area', '_col4', 'טור E (מאחד)', 'Space Code', 'טור E', 'space_code'),
          polygonCode
        ),
        space_type: smartGetField(r, 'Space type', 'סוג', 'Type', 'space_type'),
        area_acres: smartGetField(r, 'Area (acres)', 'שטח acres', 'Area Acres', 'area_acres'),
        tree_count_sheet: smartGetField(r, 'כמות שקמים', 'עצים בשיט', 'Tree Count'),
        avenue_count_sheet: smartGetField(r, 'כמות שדרות', 'שדרות בשיט', 'Avenue Count'),
        sum_girth_sheet: smartGetField(r, 'סכום היקף', 'סהכ היקף', 'Sum Girth'),
        avg_girth_sheet: smartGetField(r, 'ממוצע היקף', 'Avg Girth'),
        std_girth_sheet: smartGetField(r, 'סטיית תקן היקף', 'סטיית תקן', 'Std Girth'),
        min_girth_sheet: smartGetField(r, 'היקף: מינימום', 'מינימום', 'Min Girth'),
        max_girth_sheet: smartGetField(r, 'היקף: מקסימום', 'מקסימום', 'Max Girth'),
        density_sheet: smartGetField(r, 'צפיפות שקמים בפוליגון', 'צפיפות', 'Density'),
      };
    });

    // Ensure all polygon codes appearing in trees/avenues are represented,
    // even when the polygons tab misses a row or geometry for a new area.
    const polySet = new Set(polys.map(p => p.polygon));
    const inferredCodes = new Set([
      ...points.map(p => p.polygon).filter(Boolean),
      ...lines.map(l => l.polygon).filter(Boolean),
    ]);
    inferredCodes.forEach(code => {
      if (polySet.has(code)) return;
      polys.push({
        polygon: code,
        coords: [],
        latlons: [],
        space_name_he: '',
        space_name: '',
        space_code: normalizeSpaceCode(null, code),
        space_type: '',
        area_acres: 0,
        tree_count_sheet: null,
        avenue_count_sheet: null,
        sum_girth_sheet: null,
        avg_girth_sheet: null,
        std_girth_sheet: null,
        min_girth_sheet: null,
        max_girth_sheet: null,
        density_sheet: null,
      });
    });

    const poly_stats = {};
    polys.forEach(p => {
      const pts = points.filter(t => t.polygon === p.polygon);
      const girths = pts.map(t => t.girth).filter(v => v != null && !Number.isNaN(v));
      poly_stats[p.polygon] = {
        trees: pts.length,
        avg_girth: girths.length ? girths.reduce((a, b) => a + b, 0) / girths.length : null,
        min_girth: girths.length ? Math.min(...girths) : null,
        max_girth: girths.length ? Math.max(...girths) : null,
      };
    });

    const data = {
      points,
      lines,
      polygons: polys,
      distribution: normalizeDistributionRows(distribution.rows),
      poly_stats,
      sourceSheet: sourceUrl,
      lastUpdated: new Date().toISOString(),
    };

    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    console.log('SUCCESS: data.json updated');
    console.log(`- trees: ${points.length}`);
    console.log(`- avenues: ${lines.length}`);
    console.log(`- polygons: ${polys.length}`);
    console.log(`- distribution rows: ${data.distribution.length}`);
    console.log(`- updated: ${data.lastUpdated}`);
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
}

buildData();
