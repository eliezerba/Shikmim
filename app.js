/* ===== Shikmim Research Dashboard v10 - app.js ===== */
"use strict";

/* ---------- ArcGIS API endpoint for polygons ---------- */
const POLYGONS_API_URL = 'https://services5.arcgis.com/eJYUV73IZAY87Jwy/ArcGIS/rest/services/Ficus___Polygons/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=true&f=geojson';

/* Space metadata is loaded dynamically from data.json (polygons sheet) — no hardcoded map. */

/* ---------- Language & Translations ---------- */
let LANG = 'en';
const TRANSLATIONS = {
  he: {
    // UI Headers & Basic
    loading_data: 'טוען נתונים...',
    error_loading: 'שגיאה בטעינה: ',
    data_error: 'לא ניתן לטעון את data.json',
    
    // Metrics & Data
    trees: 'עצים',
    polygons: 'פוליגונים',
    avenues: 'שדרות',
    avg_girth: 'ממוצע היקף',
    avg_height: 'ממוצע גובה',
    total_area: 'שטח כולל (acres)',
    median_girth: 'חציון היקף',
    super_areas: 'אזורי-על',
    avg_density: 'צפיפות ממוצעת',
    std_girth: 'סטיית תקן היקף',
    std_height: 'סטיית תקן גובה',
    min_girth: 'מינימום היקף',
    max_girth: 'מקסימום היקף',
    min_height: 'מינימום גובה',
    max_height: 'מקסימום גובה',
    area_acres: 'שטח (acres)',
    space_type: 'סוג שטח',
    super_area_code: 'אזור-על',
    line_length: 'אורך שדרות',
    
    // Float Panel
    layers_maps: 'שכבות ומפה',
    modern_osm: 'OSM מודרני',
    satellite: 'לוויין (Esri)',
    pom_maps: 'Palestine Open Maps',
    combinations: 'שילובים',
    search_polygon: 'חפש פוליגון / שם...',
    show_all: 'הצג הכל',
    zoom_fit: 'זום לנתונים',
    clear_selection: 'נקה בחירה',
    export_csv: 'ייצוא CSV',
    update_data: 'עדכון נתונים',
    start_draw_polygon: 'התחל ציור פוליגון',
    finish_draw_polygon: 'סיום ציור',
    cancel_draw_polygon: 'ביטול ציור',
    draw_polygon_help: 'לחצו על המפה כדי להוסיף נקודות. לסיום: "סיום ציור".',
    draw_polygon_need_points: 'נדרשות לפחות 3 נקודות ליצירת פוליגון.',
    coordinates: 'קואורדינטות EPSG:3857 → WGS84',
    
    // Tabs
    overview: 'סקירה',
    polygons_tab: 'פוליגונים',
    super_areas_tab: 'אזורי-על',
    analytics: 'הדמיות',
    advanced: 'ניתוח מתקדם',
    groups: 'קבוצות',
    compare: 'השוואה',
    avenues_tab: 'שדרות',
    space_type_compare_tab: 'השוואת מרחבים',
    
    // Descriptions
    click_polygon: 'לחצו על פוליגון לצפייה מפורטת ולמיקוד על המפה',
    no_data: 'לחצו על פוליגון במפה או ברשימה כדי לראות נתונים מפורטים',
    super_area_advanced: 'אזורי-על (מקובצים לפי space_code / טור E). לחצו לפירוט.',
    choose_units: 'בחרו שתי יחידות להשוואה: פוליגון, קבוצה או אזור-על. ניתן גם לסנן לפי מאפיינים.',
    avenue_def: 'הגדרת מרווח שתילה → אומדן עצים בשדרות → עדכון נתוני הפוליגון/קבוצה/אזור-על.',
    
    // Groups & Comparison
    group_name: 'שם קבוצה',
    save_group: 'שמור קבוצה',
    side_a: 'צד א׳',
    side_b: 'צד ב׳',
    polygon: 'פוליגון',
    group: 'קבוצה',
    super_area: 'אזור-על',
    all: 'הכל',
    filter_space_type: 'סינון לפי סוג שטח:',
    filter_sa: 'סינון לפי אזור-על:',
    compare_btn: 'השווה',
    
    // Detail Cards
    tree_data: 'נתוני עצים',
    mapped_trees: 'עצים במיפוי',
    avenue_trees: 'עצי שדרה (אומדן)',
    total_trees: 'סה"כ עצים',
    girth_stats: 'היקף (Girth)',
    height_stats: 'גובה (Height)',
    area_info: 'שטח',
    space_info: 'שטח ומרחב',
    
    // Stats Detailed
    stdev: 'סטיית תקן',
    range: 'טווח',
    
    // Chart Titles
    trees_per_polygon: 'עצים לפי פוליגון (כולל אומדן שדרות)',
    space_types_dist: 'סוגי שטחים',
    girth_vs_height: 'היקף מול גובה',
    super_area_comparison: 'השוואת אזורי-על',
    girth_profile: 'פרופיל היקף לפי אזור-על',
    super_area_radar: 'פרופיל אזורי-על (Radar)',
    girth_distribution: 'התפלגות היקף',
    height_distribution: 'התפלגות גובה',
    
    // Updates
    hosted_locally: 'עדכון ישיר זמין רק בהרצה מקומית עם server.js וקבצי CSV.',
    github_pages_note: 'בגרסת האתר מ-GitHub מעדכנים נתונים על ידי יצירת data.json חדש מקומית והעלאתו ל-Git.',
    updating: 'טוען עדכון...',
    server_unavailable: 'שרת העדכון לא זמין',
    success_update: 'עודכן בהצלחה!',
    language: 'English',
    user_polygon_name: 'פוליגון משתמש',
    user_polygon_type: 'פוליגון ידני',
    user_polygon_badge: 'ידני',
    
    // Legends
    mapped: 'במיפוי',
    estimated: 'אומדן',
    
  },
  en: {
    // UI Headers & Basic
    loading_data: 'Loading data...',
    error_loading: 'Loading error: ',
    data_error: 'Unable to load data.json',
    
    // Metrics & Data
    trees: 'Trees',
    polygons: 'Polygons',
    avenues: 'Avenues',
    avg_girth: 'Avg Girth',
    avg_height: 'Avg Height',
    total_area: 'Total Area (acres)',
    median_girth: 'Median Girth',
    super_areas: 'Super-areas',
    avg_density: 'Avg Density',
    std_girth: 'Std Girth',
    std_height: 'Std Height',
    min_girth: 'Min Girth',
    max_girth: 'Max Girth',
    min_height: 'Min Height',
    max_height: 'Max Height',
    area_acres: 'Area (acres)',
    space_type: 'Space Type',
    super_area_code: 'Super-area',
    line_length: 'Avenue Length',
    
    // Float Panel
    layers_maps: 'Layers & Map',
    modern_osm: 'Modern OSM',
    satellite: 'Satellite (Esri)',
    pom_maps: 'Palestine Open Maps',
    combinations: 'Combinations',
    search_polygon: 'Search polygon / name...',
    show_all: 'Show All',
    zoom_fit: 'Zoom to Fit',
    clear_selection: 'Clear Selection',
    export_csv: 'Export CSV',
    update_data: 'Update Data',
    start_draw_polygon: 'Start Polygon Draw',
    finish_draw_polygon: 'Finish Draw',
    cancel_draw_polygon: 'Cancel Draw',
    draw_polygon_help: 'Click on the map to add vertices, then click "Finish Draw".',
    draw_polygon_need_points: 'At least 3 points are required to create a polygon.',
    coordinates: 'Coordinates EPSG:3857 → WGS84',
    
    // Tabs
    overview: 'Overview',
    polygons_tab: 'Polygons',
    super_areas_tab: 'Super-areas',
    analytics: 'Analytics',
    advanced: 'Advanced Analysis',
    groups: 'Groups',
    compare: 'Compare',
    avenues_tab: 'Avenues',
    space_type_compare_tab: 'Space Comparison',
    
    // Descriptions
    click_polygon: 'Click on a polygon for details and zoom',
    no_data: 'Click on a polygon on the map or list to see details',
    super_area_advanced: 'Super-areas (grouped by space_code). Click for details.',
    choose_units: 'Choose two units to compare: polygon, group, or super-area. Filter by attributes too.',
    avenue_def: 'Set planting spacing → Estimate avenue trees → Update polygon/group/super-area data.',
    
    // Groups & Comparison
    group_name: 'Group Name',
    save_group: 'Save Group',
    side_a: 'Side A',
    side_b: 'Side B',
    polygon: 'Polygon',
    group: 'Group',
    super_area: 'Super-area',
    all: 'All',
    filter_space_type: 'Filter by space type:',
    filter_sa: 'Filter by super-area:',
    compare_btn: 'Compare',
    
    // Detail Cards
    tree_data: 'Tree Data',
    mapped_trees: 'Mapped Trees',
    avenue_trees: 'Avenue Trees (Est)',
    total_trees: 'Total Trees',
    girth_stats: 'Girth Statistics',
    height_stats: 'Height Statistics',
    area_info: 'Area',
    space_info: 'Area & Space',
    
    // Stats Detailed
    stdev: 'Std Dev',
    range: 'Range',
    
    // Chart Titles
    trees_per_polygon: 'Trees per Polygon (incl. avenue estimates)',
    space_types_dist: 'Space Type Distribution',
    girth_vs_height: 'Girth vs Height',
    super_area_comparison: 'Super-area Comparison',
    girth_profile: 'Girth Profile by Super-area',
    super_area_radar: 'Super-area Profile (Radar)',
    girth_distribution: 'Girth Distribution',
    height_distribution: 'Height Distribution',
    
    // Updates
    hosted_locally: 'Direct update available only when running locally with server.js and CSV files.',
    github_pages_note: 'On GitHub Pages, update by creating new data.json locally and uploading to Git.',
    updating: 'Loading update...',
    server_unavailable: 'Update server unavailable',
    success_update: 'Updated successfully!',
    language: 'English',
    user_polygon_name: 'User Polygon',
    user_polygon_type: 'Manual Polygon',
    user_polygon_badge: 'manual',
    chart_explanation: 'Chart explanation',
    unassigned: 'Unassigned',
    tree: 'Tree',
    avenue: 'Avenue',
    area: 'Area',
    type: 'Type',
    length: 'Length',
    loading_sheet: 'Loading from sheet...',
    loading_polygons: 'Loading polygons...',
    sheet_load_error: 'Sheet loading error: ',
    loading_saved_data: 'loading saved data...',
    loaded_from_sheet: 'loaded from sheet',
    loaded_from_saved: 'loaded from saved data',
    show_space_ellipses: 'Show space ellipses',
    hide_space_ellipses: 'Hide space ellipses',
    estimated_space_ellipse: 'Estimated space ellipse',
    full_equality: 'Perfect equality',
    cumulative_tree_population_share: 'Cumulative share of tree population',
    cumulative_girth_share: 'Cumulative share of total girth',
    longitude: 'Longitude',
    latitude: 'Latitude',
    outside_polygons_suffix: 'outside polygons',
    remove_outside_trees: 'Remove outside-polygon trees',
    add_outside_trees: 'Add outside-polygon trees',
    loaded_from: 'loaded from',
    all_areas: 'All areas',
    all_polygons: 'All polygons',
    no_data_dash: 'N/A',
    
    // Legends
    mapped: 'Mapped',
    estimated: 'Estimated',
  }
};

function t(key) {
  return TRANSLATIONS[LANG][key] || key;
}

const HEBREW_RE = /[\u0590-\u05FF]/;
const HEBREW_ROMAN_MAP = {
  'א': 'a', 'ב': 'b', 'ג': 'g', 'ד': 'd', 'ה': 'h', 'ו': 'v', 'ז': 'z', 'ח': 'kh', 'ט': 't',
  'י': 'y', 'כ': 'k', 'ך': 'k', 'ל': 'l', 'מ': 'm', 'ם': 'm', 'נ': 'n', 'ן': 'n', 'ס': 's',
  'ע': 'a', 'פ': 'p', 'ף': 'p', 'צ': 'ts', 'ץ': 'ts', 'ק': 'k', 'ר': 'r', 'ש': 'sh', 'ת': 't'
};
const SPACE_TYPE_EN_MAP = {
  'חלקות': 'Plots',
  'דרכים': 'Roads',
  'אחר': 'Other',
  'גבול חולות': 'Sand Dune Edge',
  'חלקות | גבול חולות': 'Plots | Sand Dune Edge'
};

function containsHebrew(value) {
  return HEBREW_RE.test(String(value || ''));
}

function romanizeHebrew(text) {
  return String(text || '')
    .split('')
    .map(ch => HEBREW_ROMAN_MAP[ch] || ch)
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

function englishizeValue(value, fallback = '') {
  const raw = String(value || '').trim();
  if (!raw) return fallback;
  if (!containsHebrew(raw)) return raw;

  if (SPACE_TYPE_EN_MAP[raw]) return SPACE_TYPE_EN_MAP[raw];
  if (raw.includes('|')) {
    return raw
      .split('|')
      .map(part => englishizeValue(part.trim(), part.trim()))
      .filter(Boolean)
      .join(' | ');
  }

  const romanized = romanizeHebrew(raw);
  return romanized || fallback;
}

function normalizeDataForEnglishUI() {
  if (!DATA) return;

  (DATA.polygons || []).forEach(p => {
    p.space_name = englishizeValue(p.space_name, englishizeValue(p.space_name_he, p.polygon || ''));
    p.space_code = englishizeValue(p.space_code, p.space_code || '');
    p.space_type = englishizeValue(p.space_type, 'Other');
  });

  (DATA.lines || []).forEach(l => {
    l.type = englishizeValue(l.type, l.type || '');
  });
}

/* ---------- globals ---------- */
let DATA = null;
let GROUPS = [];
let selectedPolygon = null;
let selectedSA = null;
let avenueSpacing = {};
let currentBase = null;
let currentOverlay = null;
let _polyStatsCache = {};
let _saStatsCache = {};
let isDrawingPolygon = false;
let drawingPoints = [];
let showSpaceEllipses = false;

const USER_POLYGON_STORAGE_KEY = 'shikmim_user_polygons_v1';

const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const hasStaticDataFile = !window.location.protocol.startsWith('file');

const map = L.map('map', { zoomControl: true }).setView([31.67, 34.77], 11);
const layers = {
  polys: L.layerGroup().addTo(map),
  spaceEllipses: L.layerGroup().addTo(map),
  trees: L.layerGroup().addTo(map),
  lines: L.layerGroup().addTo(map),
  labels: L.layerGroup().addTo(map),
  draw: L.layerGroup().addTo(map),
};

/* ---------- tile definitions (all POM layers) ---------- */
const baseDefs = {
  osm:       () => L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }),
  sat:       () => L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Esri' }),
  'pal20k':     () => L.tileLayer('https://palopenmaps.org/tiles/pal20k-1940s/{z}/{x}/{y}.jpg', { minZoom: 2, maxZoom: 16, attribution: '&copy; Palestine Open Maps — 1:20k 1940s' }),
  'pal-1940s':  () => L.tileLayer('https://palopenmaps.org/tiles/pal-1940s/{z}/{x}/{y}.jpg', { minZoom: 2, maxZoom: 16, attribution: '&copy; Palestine Open Maps — Combined 1940s' }),
  'pal100k':    () => L.tileLayer('https://palopenmaps.org/tiles/pal100k-1950s/{z}/{x}/{y}.jpg', { minZoom: 2, maxZoom: 16, attribution: '&copy; Palestine Open Maps — 1:100k 1950s' }),
  'pal250k':    () => L.tileLayer('https://palopenmaps.org/tiles/pal250k-1946/{z}/{x}/{y}.jpg', { minZoom: 2, maxZoom: 16, attribution: '&copy; Palestine Open Maps — 1:250k 1946' }),
  'pal63k':     () => L.tileLayer('https://palopenmaps.org/tiles/pal63k-1880/{z}/{x}/{y}@2x.jpg', { minZoom: 2, maxZoom: 16, attribution: '&copy; Palestine Open Maps — PEF 1:63k 1880s' }),
  'isr250k':    () => L.tileLayer('https://palopenmaps.org/tiles/isr250k-1951/{z}/{x}/{y}@2x.jpg', { minZoom: 2, maxZoom: 16, attribution: '&copy; Palestine Open Maps — Israel 1:250k 1951' }),
};

/* ---------- utilities ---------- */
function mean(arr) { const a = arr.filter(v => v != null && !isNaN(v) && v !== 0); return a.length ? a.reduce((s, v) => s + v, 0) / a.length : null; }
function median(arr) { const a = arr.filter(v => v != null && !isNaN(v) && v !== 0).sort((x, y) => x - y); if (!a.length) return null; const m = Math.floor(a.length / 2); return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; }
function stddev(arr) { const m = mean(arr); if (m == null) return null; const a = arr.filter(v => v != null && !isNaN(v) && v !== 0); return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / a.length); }
function arrMin(arr) { const a = arr.filter(v => v != null && !isNaN(v) && v !== 0); return a.length ? Math.min(...a) : null; }
function arrMax(arr) { const a = arr.filter(v => v != null && !isNaN(v) && v !== 0); return a.length ? Math.max(...a) : null; }
function fmt(v, d = 1) { return v != null ? Number(v).toFixed(d) : '-'; }
function fmtInt(v) { return v != null ? Math.round(v).toLocaleString('en-US') : '-'; }
const pltCfg = { responsive: true, displayModeBar: false };
const pltLay = (title, extra) => Object.assign({ title, font: { family: 'Segoe UI, Arial', size: 12 }, margin: { t: 40, b: 40, l: 50, r: 20 } }, extra || {});

function isUserPolygonObj(p) {
  return !!(p && p._isUser);
}

function getPolygonByCode(code) {
  return DATA.polygons.find(p => p.polygon === code) || null;
}

function polygonDisplayName(p, lang = LANG) {
  const he = String(p?.space_name_he || '').trim();
  const en = String(p?.space_name || '').trim();
  const spaceCode = String(p?.space_code || '').trim();
  const polyCode = String(p?.polygon || '').trim();
  if (lang === 'he') return englishizeValue(he || en || spaceCode || polyCode, en || spaceCode || polyCode);
  return englishizeValue(en || he || spaceCode || polyCode, spaceCode || polyCode);
}

function superAreaDisplayName(sa, lang = LANG) {
  const he = String(sa?.name_he || '').trim();
  const en = String(sa?.name_en || '').trim();
  const code = String(sa?.code || '').trim();
  if (lang === 'he') return englishizeValue(he || en || code, en || code);
  return englishizeValue(en || he || code, code);
}

function sanitizeLatLons(latlons) {
  return (latlons || [])
    .filter(ll => Array.isArray(ll) && Number.isFinite(ll[0]) && Number.isFinite(ll[1]))
    .map(ll => [Number(ll[0]), Number(ll[1])]);
}

function polygonAreaAcres(latlons) {
  const ring = sanitizeLatLons(latlons);
  if (ring.length < 3) return 0;
  const R = 6378137;
  const meanLatRad = (ring.reduce((s, p) => s + p[0], 0) / ring.length) * Math.PI / 180;
  const projected = ring.map(([lat, lon]) => {
    const x = R * lon * Math.PI / 180 * Math.cos(meanLatRad);
    const y = R * lat * Math.PI / 180;
    return [x, y];
  });
  let twiceArea = 0;
  for (let i = 0; i < projected.length; i++) {
    const [x1, y1] = projected[i];
    const [x2, y2] = projected[(i + 1) % projected.length];
    twiceArea += (x1 * y2) - (x2 * y1);
  }
  const m2 = Math.abs(twiceArea) / 2;
  return m2 / 4046.8564224;
}

function pointInPolygon(latlon, polygonLatLons) {
  if (!Array.isArray(latlon) || !Array.isArray(polygonLatLons) || polygonLatLons.length < 3) return false;
  const y = latlon[0];
  const x = latlon[1];
  let inside = false;
  for (let i = 0, j = polygonLatLons.length - 1; i < polygonLatLons.length; j = i++) {
    const yi = polygonLatLons[i][0];
    const xi = polygonLatLons[i][1];
    const yj = polygonLatLons[j][0];
    const xj = polygonLatLons[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi) / ((yj - yi) || 1e-12) + xi));
    if (intersect) inside = !inside;
  }
  return inside;
}

function getPointsForPolygonCode(polyCode) {
  const pObj = getPolygonByCode(polyCode);
  if (!pObj) return [];
  const hasGeometry = Array.isArray(pObj.latlons) && pObj.latlons.length >= 3;
  if (hasGeometry) {
    return DATA.points.filter(t => Array.isArray(t.latlon) && pointInPolygon(t.latlon, pObj.latlons));
  }
  return DATA.points.filter(t => t.polygon === polyCode);
}

function getLinesForPolygonCode(polyCode) {
  const pObj = getPolygonByCode(polyCode);
  if (!pObj) return [];
  const hasGeometry = Array.isArray(pObj.latlons) && pObj.latlons.length >= 3;
  if (!hasGeometry) return DATA.lines.filter(l => l.polygon === polyCode);
  return DATA.lines.filter(l => {
    if (!Array.isArray(l.latlon1) || !Array.isArray(l.latlon2)) return false;
    if (pointInPolygon(l.latlon1, pObj.latlons) || pointInPolygon(l.latlon2, pObj.latlons)) return true;
    const mid = [(l.latlon1[0] + l.latlon2[0]) / 2, (l.latlon1[1] + l.latlon2[1]) / 2];
    return pointInPolygon(mid, pObj.latlons);
  });
}

function userPolygons() {
  return DATA.polygons.filter(isUserPolygonObj);
}

function persistUserPolygons() {
  const toStore = userPolygons().map(p => ({
    polygon: p.polygon,
    latlons: sanitizeLatLons(p.latlons),
    space_name_he: p.space_name_he,
    space_name: p.space_name,
    space_type: p.space_type,
    space_code: p.space_code,
    _isUser: true,
  }));
  localStorage.setItem(USER_POLYGON_STORAGE_KEY, JSON.stringify(toStore));
}

function loadUserPolygons() {
  const raw = localStorage.getItem(USER_POLYGON_STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;
    parsed.forEach(p => {
      if (!p || !p.polygon || DATA.polygons.some(x => x.polygon === p.polygon)) return;
      DATA.polygons.push({
        polygon: String(p.polygon),
        coords: [],
        latlons: sanitizeLatLons(p.latlons),
        space_name_he: p.space_name_he || `${t('user_polygon_name')} ${p.polygon}`,
        space_name: p.space_name || `${t('user_polygon_name')} ${p.polygon}`,
        space_code: p.space_code || 'USER',
        space_type: p.space_type || t('user_polygon_type'),
        area_acres: Number(polygonAreaAcres(p.latlons).toFixed(4)),
        _isUser: true,
      });
    });
  } catch (err) {
    console.warn('Failed to load user polygons from localStorage', err);
  }
}

function nextUserPolygonCode() {
  let idx = 1;
  const existing = new Set(DATA.polygons.map(p => String(p.polygon).toUpperCase()));
  while (existing.has(`U${idx}`)) idx += 1;
  return `U${idx}`;
}

function addUserPolygon(latlons) {
  const ring = sanitizeLatLons(latlons);
  if (ring.length < 3) return null;
  const code = nextUserPolygonCode();
  DATA.polygons.push({
    polygon: code,
    coords: [],
    latlons: ring,
    space_name_he: `${t('user_polygon_name')} ${code}`,
    space_name: `${t('user_polygon_name')} ${code}`,
    space_code: 'USER',
    space_type: t('user_polygon_type'),
    area_acres: Number(polygonAreaAcres(ring).toFixed(4)),
    _isUser: true,
  });
  persistUserPolygons();
  buildSuperAreas();
  initGroupsUI();
  populateCmpSelect('cmpTypeA', 'cmpSelA');
  populateCmpSelect('cmpTypeB', 'cmpSelB');
  return code;
}

function refreshDrawPreview() {
  layers.draw.clearLayers();
  if (!drawingPoints.length) return;
  drawingPoints.forEach(ll => L.circleMarker(ll, {
    radius: 4,
    color: '#b91c1c',
    fillColor: '#ef4444',
    fillOpacity: 0.95,
    weight: 1,
  }).addTo(layers.draw));
  if (drawingPoints.length >= 2) {
    L.polyline(drawingPoints, { color: '#dc2626', weight: 2, dashArray: '5,4' }).addTo(layers.draw);
  }
  if (drawingPoints.length >= 3) {
    L.polygon(drawingPoints, { color: '#dc2626', weight: 2, fillColor: '#fca5a5', fillOpacity: 0.2 }).addTo(layers.draw);
  }
}

function updateDrawButtons() {
  const startBtn = document.getElementById('btnStartDrawPoly');
  const finishBtn = document.getElementById('btnFinishDrawPoly');
  const cancelBtn = document.getElementById('btnCancelDrawPoly');
  if (!startBtn || !finishBtn || !cancelBtn) return;
  startBtn.disabled = isDrawingPolygon;
  finishBtn.disabled = !isDrawingPolygon;
  cancelBtn.disabled = !isDrawingPolygon;
}

function startPolygonDraw() {
  isDrawingPolygon = true;
  drawingPoints = [];
  map.getContainer().style.cursor = 'crosshair';
  const status = document.getElementById('updateStatus');
  if (status) {
    status.textContent = t('draw_polygon_help');
    status.style.color = 'var(--warn)';
  }
  refreshDrawPreview();
  updateDrawButtons();
}

function cancelPolygonDraw() {
  isDrawingPolygon = false;
  drawingPoints = [];
  map.getContainer().style.cursor = '';
  layers.draw.clearLayers();
  const status = document.getElementById('updateStatus');
  if (status) status.textContent = '';
  updateDrawButtons();
}

function finishPolygonDraw() {
  if (!isDrawingPolygon) return;
  if (drawingPoints.length < 3) {
    window.alert(t('draw_polygon_need_points'));
    return;
  }
  const code = addUserPolygon(drawingPoints);
  cancelPolygonDraw();
  if (!code) return;
  selectedPolygon = code;
  selectedSA = null;
  fitToPolygon(code);
  updateAll();
}

const CHART_INFO_LABELS = {
  he: {
    fields: 'שדות נתונים',
    formula: 'נוסחה / פונקציה',
    purpose: 'מה הגרף משרת',
    notes: 'הערות קריאה',
  },
  en: {
    fields: 'Data fields',
    formula: 'Formula / Function',
    purpose: 'What this chart serves',
    notes: 'Reading notes',
  },
};

const CHART_INFO = {
  chartScatter: {
    title: { he: 'היקף מול גובה', en: 'Girth vs Height' },
    fields: {
      he: ['DATA.points.girth', 'DATA.points.height', 'DATA.points.polygon'],
      en: ['DATA.points.girth', 'DATA.points.height', 'DATA.points.polygon'],
    },
    formula: {
      he: ['תרשים פיזור (Scatter): כל עץ הוא נקודה אחת בצירים x=girth, y=height.', 'קיבוץ לפי polygon לצבע/סדרה נפרדת.'],
      en: ['Scatter plot: each tree is one point with x=girth and y=height.', 'Grouped by polygon as separate color/trace.'],
    },
    purpose: {
      he: 'מציג קשר אפשרי בין היקף לגובה ומאפשר לזהות אשכולות, חריגים והבדלים בין פוליגונים.',
      en: 'Shows the potential relationship between girth and height and helps detect clusters, outliers, and polygon-level differences.',
    },
    notes: {
      he: ['ריכוז נקודות מעיד על טיפוס עצים דומה.', 'נקודות קצה יכולות להצביע על מדידות חריגות או עצים יוצאי דופן.'],
      en: ['Dense point clouds indicate similar tree profiles.', 'Extreme points may indicate outliers or exceptional trees.'],
    },
  },
  chartBars: {
    title: { he: 'עצים לפי פוליגון', en: 'Trees per Polygon' },
    fields: {
      he: ['DATA.points.polygon (ספירת עצים לפי פוליגון)'],
      en: ['DATA.points.polygon (tree counts by polygon)'],
    },
    formula: {
      he: ['counts[polygon] = מספר הרשומות בטבלת points לכל פוליגון.'],
      en: ['counts[polygon] = number of records in points for each polygon.'],
    },
    purpose: {
      he: 'השוואת היקף העצים בין פוליגונים בצורה מהירה וברורה.',
      en: 'Compares tree volume between polygons in a quick and clear way.',
    },
    notes: {
      he: ['הגרף סופר עצים ממופים בלבד בטאב זה.', 'להשוואה הכוללת אומדני שדרות השתמשו בגרפים המתאימים בסקירה/קבוצות.'],
      en: ['In this tab, the chart counts mapped trees only.', 'For totals including avenue estimates, use the relevant overview/groups charts.'],
    },
  },
  chartHist: {
    title: { he: 'התפלגות היקף', en: 'Girth Distribution' },
    fields: {
      he: ['DATA.points.girth (ערכים מספריים בלבד)'],
      en: ['DATA.points.girth (numeric values only)'],
    },
    formula: {
      he: ['Histogram עם nbinsx=30: חלוקת טווח ההיקפים לדליים וספירת עצים בכל דלי.'],
      en: ['Histogram with nbinsx=30: split girth range into bins and count trees per bin.'],
    },
    purpose: {
      he: 'ממחיש את מבנה האוכלוסייה: שכיחויות, הטיה, וריבוי ערכים קיצוניים.',
      en: 'Shows population structure: frequencies, skewness, and heavy tails/outliers.',
    },
    notes: {
      he: ['שיא יחיד לרוב מצביע על טווח היקף טיפוסי.', 'התפלגות רחבה מצביעה על הטרוגניות גבוהה.'],
      en: ['A single peak often indicates a typical girth range.', 'A wide spread indicates higher heterogeneity.'],
    },
  },
  chartBox: {
    title: { he: 'Box Plot לפי פוליגון', en: 'Box Plot by Polygon' },
    fields: {
      he: ['DATA.points.girth', 'DATA.points.polygon'],
      en: ['DATA.points.girth', 'DATA.points.polygon'],
    },
    formula: {
      he: ['לכל פוליגון מחושבים: חציון, רבעון ראשון/שלישי וטווח התפלגות.', 'boxpoints=false מסתיר נקודות גולמיות לשיפור קריאות.'],
      en: ['Per polygon it computes median, quartiles (Q1/Q3), and spread.', 'boxpoints=false hides raw points for cleaner readability.'],
    },
    purpose: {
      he: 'השוואה סטטיסטית בין פוליגונים תוך דגש על מרכז ופיזור.',
      en: 'Enables statistical comparison across polygons with focus on center and spread.',
    },
    notes: {
      he: ['תיבה גבוהה = שונות גבוהה בהיקפים.', 'חציון גבוה מראה פוליגון עם עצים עבים יותר בממוצע.'],
      en: ['A taller box means larger variance in girth.', 'A higher median indicates thicker trees on average.'],
    },
  },
  chartHeights: {
    title: { he: 'התפלגות גובה', en: 'Height Distribution' },
    fields: {
      he: ['DATA.points.height (ערכים מספריים בלבד)'],
      en: ['DATA.points.height (numeric values only)'],
    },
    formula: {
      he: ['Histogram עם nbinsx=25 עבור גובה עצים.'],
      en: ['Histogram with nbinsx=25 for tree heights.'],
    },
    purpose: {
      he: 'מציג את מבנה התפלגות הגבהים ועוזר לזהות טווחים דומיננטיים.',
      en: 'Displays the height distribution structure and dominant ranges.',
    },
    notes: {
      he: ['מאפשר השוואה אינטואיטיבית לגרף ההיקף.', 'זנב ארוך עשוי להעיד על תתי-אוכלוסיות.'],
      en: ['Allows intuitive comparison against girth distribution.', 'A long tail may indicate sub-populations.'],
    },
  },
  chartDensity: {
    title: { he: 'צפיפות עצים לפי פוליגון', en: 'Tree Density by Polygon' },
    fields: {
      he: ['computePolyStats(code).density', 'DATA.polygons.area_acres', 'DATA.points'],
      en: ['computePolyStats(code).density', 'DATA.polygons.area_acres', 'DATA.points'],
    },
    formula: {
      he: ['density = mappedTrees / area_acres (עצים ל-acre).'],
      en: ['density = mappedTrees / area_acres (trees per acre).'],
    },
    purpose: {
      he: 'מנרמל לפי שטח ומאפשר השוואה הוגנת בין פוליגונים בגדלים שונים.',
      en: 'Normalizes by area so polygons of different sizes can be compared fairly.',
    },
    notes: {
      he: ['צפיפות גבוהה אינה בהכרח כמות עצים מוחלטת גבוהה.', 'יש לפרש יחד עם שטח כולל.'],
      en: ['High density does not necessarily mean high absolute tree count.', 'Interpret together with total area.'],
    },
  },
  chartHeat: {
    title: { he: 'Heatmap היקפים לפי פוליגון', en: 'Girth Heatmap by Polygon' },
    fields: {
      he: ['DATA.distribution.girth_range', 'DATA.distribution[polygon]', 'רשימת הפוליגונים המסוננים'],
      en: ['DATA.distribution.girth_range', 'DATA.distribution[polygon]', 'filtered polygon list'],
    },
    formula: {
      he: ['z[y,x] = שכיחות עצים בטווח היקף y עבור פוליגון x.'],
      en: ['z[y,x] = frequency of trees in girth range y for polygon x.'],
    },
    purpose: {
      he: 'מזהה במהירות דפוסים מטריציוניים של שכיחויות בין טווחי היקף לפוליגונים.',
      en: 'Quickly reveals matrix-like frequency patterns across girth ranges and polygons.',
    },
    notes: {
      he: ['צבע כהה יותר = שכיחות גבוהה יותר.', 'שורות מודגשות מצביעות על טווחי היקף נפוצים.'],
      en: ['Darker color means higher frequency.', 'Dominant rows indicate common girth ranges.'],
    },
  },
  chartViolin: {
    title: { he: 'Violin לפי פוליגון', en: 'Violin by Polygon' },
    fields: {
      he: ['DATA.points.girth', 'DATA.points.polygon'],
      en: ['DATA.points.girth', 'DATA.points.polygon'],
    },
    formula: {
      he: ['אומדן צפיפות (KDE) לכל פוליגון + קופסת רבעונים וממוצע.'],
      en: ['Kernel density estimate (KDE) per polygon with quartile box and meanline.'],
    },
    purpose: {
      he: 'מציג לא רק מרכז ופיזור, אלא גם את צורת ההתפלגות בכל פוליגון.',
      en: 'Shows not just center/spread but the full distribution shape per polygon.',
    },
    notes: {
      he: ['צורה דו-שיאית מצביעה על שתי תתי-קבוצות אפשריות.', 'צרות/רוחב ה"כינור" מייצגים צפיפות יחסית.'],
      en: ['A bimodal shape may indicate two sub-populations.', 'Violin width reflects relative density.'],
    },
  },
  chartTreemap: {
    title: { he: 'Treemap שטח והיררכיה', en: 'Treemap Area Hierarchy' },
    fields: {
      he: ['DATA.superAreas.code', 'DATA.superAreas.polygons', 'DATA.polygons.area_acres', 'computePolyStats(code).totalTrees'],
      en: ['DATA.superAreas.code', 'DATA.superAreas.polygons', 'DATA.polygons.area_acres', 'computePolyStats(code).totalTrees'],
    },
    formula: {
      he: ['ערך כל פוליגון = area_acres; היררכיה: כל השטחים → אזור-על → פוליגון.'],
      en: ['Polygon value = area_acres; hierarchy: all areas -> super-area -> polygon.'],
    },
    purpose: {
      he: 'מציג בו-זמנית מבנה היררכי והשוואת שטחים יחסיים.',
      en: 'Shows hierarchy and relative area comparison at the same time.',
    },
    notes: {
      he: ['טקסט הרחף כולל גם אומדן עצים כולל לכל פוליגון.', 'יעיל לזיהוי יחידות גדולות/קטנות במהירות.'],
      en: ['Hover text also shows total tree estimate per polygon.', 'Useful for quickly spotting large/small units.'],
    },
  },
  chartCDF: {
    title: { he: 'CDF היקפים', en: 'Girth CDF' },
    fields: {
      he: ['DATA.points.girth לאחר סינון ומיון'],
      en: ['DATA.points.girth after filtering and sorting'],
    },
    formula: {
      he: ['CDF(i) = (i+1)/N עבור ערכי היקף ממוינים.'],
      en: ['CDF(i) = (i+1)/N on sorted girth values.'],
    },
    purpose: {
      he: 'מאפשר לקרוא אחוזונים וספי היקף בצורה ישירה.',
      en: 'Lets you read percentiles and girth thresholds directly.',
    },
    notes: {
      he: ['שיפוע חד = ריכוז ערכים בטווח צר.', 'שיפוע מתון = פיזור רחב יותר.'],
      en: ['Steep slope = concentration in a narrow range.', 'Gentle slope = wider spread.'],
    },
  },
  chartSizeClass: {
    title: { he: 'מחלקות גודל לפי פוליגון', en: 'Size Classes by Polygon' },
    fields: {
      he: ['DATA.points.girth', 'DATA.points.polygon', 'מחלקות: 0-100, 100-200, 200-300, 300-500, 500+'],
      en: ['DATA.points.girth', 'DATA.points.polygon', 'classes: 0-100, 100-200, 200-300, 300-500, 500+'],
    },
    formula: {
      he: ['ספירה בדידתית לפי טווחי היקף, עם עמודות מוערמות לכל פוליגון.'],
      en: ['Discrete counts by girth bands using stacked bars per polygon.'],
    },
    purpose: {
      he: 'משווה מבנה גיל/גודל יחסי בין פוליגונים.',
      en: 'Compares relative size/age structure across polygons.',
    },
    notes: {
      he: ['חלק גבוה במחלקות גדולות מצביע על עצים ותיקים יותר.', 'מאפשר לזהות הבדלים גם כשהסך הכול דומה.'],
      en: ['Higher share in large classes suggests older trees.', 'Highlights structural differences even when totals are similar.'],
    },
  },
  chartLorenz: {
    title: { he: 'Lorenz ועקומת ריכוז היקפים', en: 'Lorenz Curve of Girth Concentration' },
    fields: {
      he: ['DATA.points.girth (ממוינים)', 'lorenzX', 'lorenzY'],
      en: ['DATA.points.girth (sorted)', 'lorenzX', 'lorenzY'],
    },
    formula: {
      he: ['Lorenz: צבירה מצטברת של שיעור עצים מול שיעור סך ההיקפים.', 'Gini = 1 - 2 * שטח מתחת לעקומת Lorenz.'],
      en: ['Lorenz: cumulative share of trees vs cumulative share of total girth.', 'Gini = 1 - 2 * area under the Lorenz curve.'],
    },
    purpose: {
      he: 'מודד אי-שוויון בריכוז היקפים בין עצים.',
      en: 'Measures inequality in girth concentration among trees.',
    },
    notes: {
      he: ['ככל שהעקומה רחוקה מקו השוויון, האי-שוויון גבוה יותר.', 'Gini קרוב ל-0 = אחידות יחסית; קרוב ל-1 = ריכוז גבוה.'],
      en: ['The farther from the equality line, the higher the inequality.', 'Gini near 0 = more equal; near 1 = highly concentrated.'],
    },
  },
  chartSpaceType: {
    title: { he: 'עצים לפי סוג שטח', en: 'Trees by Space Type' },
    fields: {
      he: ['DATA.polygons.space_type', 'computePolyStats(polygon).totalTrees'],
      en: ['DATA.polygons.space_type', 'computePolyStats(polygon).totalTrees'],
    },
    formula: {
      he: ['סכימת totalTrees לכל קטגוריית space_type והצגה כתרשים עוגה.'],
      en: ['Aggregate totalTrees by space_type and render as a pie chart.'],
    },
    purpose: {
      he: 'מראה את חלוקת העומס הבוטני בין סוגי השטח.',
      en: 'Shows how tree load is distributed across land-use categories.',
    },
    notes: {
      he: ['יעיל להצגת תרומת קטגוריות יחסית.', 'אינו מייצג צפיפות אלא סכום עצים.'],
      en: ['Useful for communicating relative category contribution.', 'Represents totals, not density.'],
    },
  },
  chartCorrelation: {
    title: { he: 'מתאם ממוצע היקף מול צפיפות', en: 'Correlation: Avg Girth vs Density' },
    fields: {
      he: ['polyStats.avgGirth', 'polyStats.density', 'polyStats.totalTrees', 'polyStats.area'],
      en: ['polyStats.avgGirth', 'polyStats.density', 'polyStats.totalTrees', 'polyStats.area'],
    },
    formula: {
      he: ['x=avgGirth, y=density, גודל בועה ≈ sqrt(totalTrees)*3, צבע=area.'],
      en: ['x=avgGirth, y=density, bubble size ~ sqrt(totalTrees)*3, color=area.'],
    },
    purpose: {
      he: 'בודק קשר בין עובי ממוצע לדחיסות, תוך קידוד ממד גודל נוסף.',
      en: 'Explores relationship between average thickness and crowding with extra size encoding.',
    },
    notes: {
      he: ['בועות גדולות מייצגות פוליגונים עם יותר עצים.', 'צבע מאפשר לזהות האם שטח מסביר חלק מהקשר.'],
      en: ['Larger bubbles represent polygons with more trees.', 'Color helps assess whether area explains part of the relationship.'],
    },
  },
  chartSpatialDensity: {
    title: { he: 'מפת חום מרחבית של עצים', en: 'Spatial Tree Density Heatmap' },
    fields: {
      he: ['DATA.points.latlon[1] (קו אורך)', 'DATA.points.latlon[0] (קו רוחב)'],
      en: ['DATA.points.latlon[1] (longitude)', 'DATA.points.latlon[0] (latitude)'],
    },
    formula: {
      he: ['Histogram2D עם nbinsx=40 ו-nbinsy=40 להצגת צפיפות מיקום.'],
      en: ['2D histogram with nbinsx=40 and nbinsy=40 for spatial density.'],
    },
    purpose: {
      he: 'מזהה מוקדי ריכוז מרחביים ואזורים דלילים.',
      en: 'Identifies spatial hotspots and sparse regions.',
    },
    notes: {
      he: ['מתאים לזיהוי שכנות מרחבית.', 'חשוב לפרש יחד עם גבולות פוליגונים במפה.'],
      en: ['Useful for spotting spatial neighborhood patterns.', 'Best interpreted together with polygon boundaries on the map.'],
    },
  },
  chartGirthVsArea: {
    title: { he: 'שטח מול ממוצע היקף', en: 'Area vs Avg Girth' },
    fields: {
      he: ['polyStats.area', 'polyStats.avgGirth', 'polyStats.totalTrees'],
      en: ['polyStats.area', 'polyStats.avgGirth', 'polyStats.totalTrees'],
    },
    formula: {
      he: ['x=area, y=avgGirth, גודל בועה=פונקציה של totalTrees.'],
      en: ['x=area, y=avgGirth, bubble size as a function of totalTrees.'],
    },
    purpose: {
      he: 'בודק האם יחידות שטח גדולות קשורות לעובי ממוצע אחר.',
      en: 'Checks whether larger land units correlate with different average girth.',
    },
    notes: {
      he: ['מתאים לזיהוי מגמות סקיילינג.', 'חריגים יכולים לסמן מדיניות תחזוקה ייחודית.'],
      en: ['Useful for scaling trend detection.', 'Outliers may indicate unique management conditions.'],
    },
  },
  chartPolygonProfile: {
    title: { he: 'פרופיל פוליגונים סטטיסטי', en: 'Statistical Polygon Profile' },
    fields: {
      he: ['polyStats.avgGirth', 'polyStats.medianGirth', 'polyStats.stdGirth', 'polyStats.avgHeight'],
      en: ['polyStats.avgGirth', 'polyStats.medianGirth', 'polyStats.stdGirth', 'polyStats.avgHeight'],
    },
    formula: {
      he: ['עמודות מקובצות למדדים מרכזיים לכל פוליגון; avgHeight מוצג בסקייל ÷10 לצורך השוואה חזותית.'],
      en: ['Grouped bars for key metrics per polygon; avgHeight is scaled by /10 for visual comparability.'],
    },
    purpose: {
      he: 'מסכם מספר מדדים בתצוגה אחת להשוואה רב-ממדית מהירה.',
      en: 'Summarizes multiple metrics in one view for quick multi-dimensional comparison.',
    },
    notes: {
      he: ['שימושי למצגות והסבר למקבלי החלטות.', 'יש לזכור שהמדד של גובה הוקטן לצורך קנה מידה.'],
      en: ['Useful for presentations and decision-maker briefings.', 'Remember height is scaled down for chart readability.'],
    },
  },
};

function listToHtml(items) {
  return `<ul>${items.map(x => `<li>${x}</li>`).join('')}</ul>`;
}

function normalizePolygonCode(code) {
  return String(code || '').trim().toUpperCase();
}

function parseApiGeometryToLatLons(geometry) {
  if (!geometry || !Array.isArray(geometry.coordinates)) return [];

  const toRing = ring => {
    if (!Array.isArray(ring)) return [];
    return ring
      .filter(c => Array.isArray(c) && Number.isFinite(c[0]) && Number.isFinite(c[1]))
      .map(c => [Number(c[1]), Number(c[0])]);
  };

  if (geometry.type === 'Polygon') {
    return toRing(geometry.coordinates[0]);
  }

  if (geometry.type === 'MultiPolygon') {
    const rings = geometry.coordinates
      .map(poly => Array.isArray(poly) ? toRing(poly[0]) : [])
      .filter(ring => ring.length >= 3);
    if (!rings.length) return [];
    // Downstream code expects a simple ring; pick the largest outer ring.
    return rings.sort((a, b) => b.length - a.length)[0];
  }

  return [];
}

function chartInfoHtml(chartId) {
  const cfg = CHART_INFO[chartId];
  if (!cfg) return '';
  const labels = CHART_INFO_LABELS[LANG] || CHART_INFO_LABELS.en;
  return `
    <div class="chart-info-section">
      <h4>${labels.fields}</h4>
      ${listToHtml(cfg.fields[LANG] || cfg.fields.en)}
    </div>
    <div class="chart-info-section">
      <h4>${labels.formula}</h4>
      ${listToHtml(cfg.formula[LANG] || cfg.formula.en)}
    </div>
    <div class="chart-info-section">
      <h4>${labels.purpose}</h4>
      <p>${cfg.purpose[LANG] || cfg.purpose.en}</p>
    </div>
    <div class="chart-info-section">
      <h4>${labels.notes}</h4>
      ${listToHtml(cfg.notes[LANG] || cfg.notes.en)}
    </div>
  `;
}

function ensureChartInfoModal() {
  if (document.getElementById('chartInfoModal')) return;
  const modal = document.createElement('div');
  modal.id = 'chartInfoModal';
  modal.className = 'chart-info-modal';
  modal.innerHTML = `
    <div class="chart-info-backdrop" data-close-info="1"></div>
    <div class="chart-info-dialog" role="dialog" aria-modal="true" aria-labelledby="chartInfoTitle">
      <button type="button" class="chart-info-close" id="chartInfoClose" aria-label="Close">×</button>
      <h3 id="chartInfoTitle"></h3>
      <div id="chartInfoBody"></div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => {
    if (e.target && e.target.dataset && e.target.dataset.closeInfo === '1') {
      modal.classList.remove('open');
    }
  });
  const closeBtn = document.getElementById('chartInfoClose');
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));
}

function openChartInfo(chartId) {
  const cfg = CHART_INFO[chartId];
  if (!cfg) return;
  ensureChartInfoModal();
  const modal = document.getElementById('chartInfoModal');
  const titleEl = document.getElementById('chartInfoTitle');
  const bodyEl = document.getElementById('chartInfoBody');
  if (!modal || !titleEl || !bodyEl) return;
  titleEl.textContent = cfg.title[LANG] || cfg.title.en;
  bodyEl.innerHTML = chartInfoHtml(chartId);
  modal.classList.add('open');
}

const ALL_CHART_IDS = [
  'chartScatter','chartBars','chartHist','chartBox','chartHeights','chartDensity','chartHeat','chartViolin',
  'chartTreemap','chartCDF','chartSizeClass','chartLorenz','chartSpaceType','chartCorrelation','chartSpatialDensity','chartGirthVsArea','chartPolygonProfile',
];

function initChartHeaders() {
  ALL_CHART_IDS.forEach(chartId => {
    const chartEl = document.getElementById(chartId);
    const cfg = CHART_INFO[chartId];
    if (!chartEl || !cfg) return;
    const row = document.createElement('div');
    row.className = 'chart-title-row';
    row.dataset.chartId = chartId;
    row.innerHTML = `<span class="chart-title-text">${cfg.title[LANG] || cfg.title.en}</span><button type="button" class="chart-info-btn" title="${t('chart_explanation')}">i</button>`;
    chartEl.parentNode.insertBefore(row, chartEl);
    row.querySelector('.chart-info-btn').addEventListener('click', () => openChartInfo(chartId));
  });
}

function refreshChartTitles() {
  document.querySelectorAll('.chart-title-row').forEach(row => {
    const cfg = CHART_INFO[row.dataset.chartId];
    if (!cfg) return;
    const titleEl = row.querySelector('.chart-title-text');
    const btn = row.querySelector('.chart-info-btn');
    if (titleEl) titleEl.textContent = cfg.title[LANG] || cfg.title.en;
    if (btn) btn.title = t('chart_explanation');
  });
}

/* ---------- Transform one ArcGIS GeoJSON feature → polygon object ----------
   Metadata (name, space_code / super-area, etc.) always comes from the sheet
   row already loaded into DATA.polygons.  The API contributes geometry only.
   For polygons not yet in the sheet we still record what the API provides.
-------------------------------------------------------------------------- */
function transformAPIPolygon(feature) {
  const p = feature.properties;
  const code = normalizePolygonCode(p.Name);
  // Prefer sheet-derived metadata that was populated from data.json
  const sheetRow = (DATA.polygons || []).find(x => x.polygon === code) || {};
  const latlons = parseApiGeometryToLatLons(feature.geometry);
  return {
    // API-only fallbacks — used only for polygons absent from the Google Sheet.
    // space_type intentionally left empty; it comes exclusively from the sheet via ...sheetRow below.
    space_type:         '',
    area_acres:         p.Acres || p.Area__Dunam_ || 0,
    tree_count_sheet:   p.Ficus_Number        || 0,
    mapped_ficus:       p.Mapped_Ficus,
    avenue_count_sheet: 0,
    avg_girth_sheet:    p.Av__Circumference   || 0,
    density_sheet:      p.Density             || 0,
    shape_area:         p.Shape__Area,
    shape_length:       p.Shape__Length,
    // Sheet row overrides everything (spread last so sheet wins)
    ...sheetRow,
    // Always use the polygon code and the freshly-parsed geometry
    polygon: code,
    latlons,
    // space_code comes strictly from the sheet's Area column (null = no super-area). Never invent one.
    space_code: Object.prototype.hasOwnProperty.call(sheetRow, 'space_code') ? sheetRow.space_code : null,
  };
}

/* ---------- Fetch polygons from ArcGIS REST API ---------- */
async function loadPolygonsFromAPI() {
  const resp = await fetch(POLYGONS_API_URL);
  if (!resp.ok) throw new Error('API ' + resp.status);
  const geojson = await resp.json();
  const features = (geojson.features || []).filter(f => f.geometry && f.properties && f.properties.Name);
  return features.map(transformAPIPolygon).filter(p => p.latlons.length >= 3);
}

function mergePolygonsFromSheetAndAPI(sheetPolygons, apiPolygons) {
  const merged = new Map();

  (sheetPolygons || []).forEach(p => {
    const code = normalizePolygonCode(p?.polygon);
    if (!code) return;
    merged.set(code, {
      ...p,
      polygon: code,
      latlons: sanitizeLatLons(p.latlons),
      area_acres: Number(p.area_acres) || 0,
      space_code: p.space_code ?? null, // null means no super-area; never fall back to letter
    });
  });

  (apiPolygons || []).forEach(apiP => {
    const code = normalizePolygonCode(apiP.polygon);
    if (!code) return;
    const current = merged.get(code);
    if (!current) {
      merged.set(code, {
        ...apiP,
        polygon: code,
      });
      return;
    }
    merged.set(code, {
      ...current,
      latlons: apiP.latlons?.length ? apiP.latlons : current.latlons,
      area_acres: Number(current.area_acres) || Number(apiP.area_acres) || 0,
      // space_type and space_code come exclusively from the Google Sheet.
      // Sheet value wins unconditionally — even null means "no super-area", not a reason to fall back.
      space_type:    current.space_type  != null ? current.space_type  : apiP.space_type,
      space_name_he: current.space_name_he || apiP.space_name_he,
      space_name:    current.space_name    || apiP.space_name,
      space_code:    current.space_code, // always from sheet; null = no super-area
    });
  });

  return Array.from(merged.values());
}

/* ===== Live Google Sheet fetching =====
   Every page load fetches directly from the published Google Sheet.
   The embedded data.json is used only as a fallback (offline / CORS failure).
   ===================================================================== */
const SHEET_ID = '1Ipq2qcn_kyLTh-F50ViV4vS5OPYNfYhN';
// Tab names are pre-percent-encoded to avoid runtime encoding issues.
// Hebrew encodings: עצים=%D7%A2%D7%A6%D7%99%D7%9D, שדרות=%D7%A9%D7%93%D7%A8%D7%95%D7%AA,
// פוליגונים=%D7%A4%D7%95%D7%9C%D7%99%D7%92%D7%95%D7%A0%D7%99%D7%9D, התפלגות=%D7%94%D7%AA%D7%A4%D7%9C%D7%92%D7%95%D7%AA
const SHEET_TAB_NAMES = {
  trees:        ['%D7%A2%D7%A6%D7%99%D7%9D',                               'trees'],
  avenues:      ['%D7%A9%D7%93%D7%A8%D7%95%D7%AA',                         'avenues'],
  polygons:     ['%D7%A4%D7%95%D7%9C%D7%99%D7%92%D7%95%D7%A0%D7%99%D7%9D', 'polygons'],
  distribution: ['%D7%94%D7%AA%D7%A4%D7%9C%D7%92%D7%95%D7%AA',             'distribution'],
};
// Header hints to validate that we fetched the right tab
const SHEET_TAB_HEADER_HINTS = {
  trees:        ['X', 'Y'],
  avenues:      ['X_Start', 'X1', 'x1'],
  polygons:     ['Polygon', 'פוליגון', 'Space type', 'Coordinates'],
  // Note: 'פוליגון' added so tab validation passes even when sheet headers are in Hebrew
  distribution: ['girth_range', 'Girth Range'],
};

function _parseCSVBrowser(text) {
  const records = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') { field += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      row.push(field); field = '';
    } else if ((c === '\n' || c === '\r') && !inQuotes) {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); records.push(row);
      row = []; field = '';
    } else { field += c; }
  }
  if (field || row.length) { row.push(field); records.push(row); }
  while (records.length && records[0].every(v => !String(v).trim())) records.shift();
  while (records.length && records[records.length - 1].every(v => !String(v).trim())) records.pop();
  if (!records.length) return { headers: [], rows: [] };
  const headers = records[0].map((h, i) => String(h || '').trim() || `_col${i}`);
  const rows = records.slice(1)
    .filter(vals => vals.some(v => String(v || '').trim()))
    .map(vals => {
      const obj = {};
      headers.forEach((h, idx) => {
        const raw = String(vals[idx] ?? '').trim();
        if (!raw) { obj[h] = null; return; }
        const nrm = raw.replace(/,/g, '');
        obj[h] = /^-?\d+(\.\d+)?$/.test(nrm) ? parseFloat(nrm) : raw;
      });
      return obj;
    });
  return { headers, rows };
}

function _sheetGet(obj, ...names) {
  for (const n of names) {
    if (n in obj && obj[n] !== null && obj[n] !== undefined) return obj[n];
  }
  return null;
}

function _merc2wgs84(x, y) {
  const lon = (x / 6378137) * (180 / Math.PI);
  const lat = (2 * Math.atan(Math.exp(y / 6378137)) - Math.PI / 2) * (180 / Math.PI);
  return [lat, lon];
}

function _spaceCode(val) {
  // Returns the Area column value (the super-area key), or null if the polygon
  // has no Area value — meaning it belongs to no super-area.
  const raw = val == null ? '' : String(val).trim();
  return raw ? raw.toUpperCase() : null;
}

function _parseCoordsStr(str) {
  const latlons = [];
  const matches = (str || '').match(/\(([^)]+)\)/g) || [];
  matches.forEach(m => {
    const parts = m.replace(/[()]/g, '').split(',');
    const x = parseFloat(parts[0]);
    const y = parseFloat(parts[1]);
    if (isFinite(x) && isFinite(y)) latlons.push(_merc2wgs84(x, y));
  });
  return latlons;
}

async function _fetchSheetTab(encodedName) {
  // encodedName must already be percent-encoded (do NOT call encodeURIComponent here).
  // Append a timestamp so Google's servers never return a stale cached response.
  const bust = Date.now();
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodedName}&_=${bust}`;
  const resp = await fetch(url, { cache: 'no-store' });
  if (!resp.ok) throw new Error(`Sheet "${encodedName}" HTTP ${resp.status}`);
  return _parseCSVBrowser(await resp.text());
}

async function _fetchFirstTab(nameList, headerHints) {
  for (const name of nameList) {
    try {
      const p = await _fetchSheetTab(name);
      if (p.rows.length > 0 || p.headers.length > 0) {
        // Validate we got the right tab by checking header hints
        if (headerHints && headerHints.length > 0) {
          const ok = headerHints.some(h => p.headers.includes(h));
          if (!ok) continue; // wrong tab returned, try next candidate
        }
        return p;
      }
    } catch (_) { /* try next name */ }
  }
  throw new Error(`Could not fetch any of: ${nameList.join(', ')}`);
}

async function buildDataFromSheets() {
  // Fetch trees, avenues, polygons in parallel — all three are required
  const [treesParsed, avesParsed, polysParsed] = await Promise.all([
    _fetchFirstTab(SHEET_TAB_NAMES.trees,    SHEET_TAB_HEADER_HINTS.trees),
    _fetchFirstTab(SHEET_TAB_NAMES.avenues,  SHEET_TAB_HEADER_HINTS.avenues),
    _fetchFirstTab(SHEET_TAB_NAMES.polygons, SHEET_TAB_HEADER_HINTS.polygons),
  ]);
  // Debug: log actual column headers from polygons tab to help diagnose AREA column name issues
  console.log('[Sheet] Polygons tab headers:', polysParsed.headers);

  // Distribution is optional (used only for histograms).
  // Its tab URL sometimes returns the wrong tab; don't let it abort the whole fetch.
  let distParsed = { headers: [], rows: [] };
  try {
    distParsed = await _fetchFirstTab(SHEET_TAB_NAMES.distribution, SHEET_TAB_HEADER_HINTS.distribution);
  } catch (e) {
    console.warn('Distribution tab unavailable from Google Sheet (will use fallback):', e.message);
  }

  const points = treesParsed.rows.map((r, i) => {
    const x = _sheetGet(r, 'X', 'x');
    const y = _sheetGet(r, 'Y', 'y');
    return {
      id: _sheetGet(r, '#', 'ID', 'id') || (i + 1),
      girth: _sheetGet(r, 'היקף עץ', 'היקף', 'Girth', 'girth'),
      height: _sheetGet(r, 'גובה עץ', 'גובה', 'Height', 'height'),
      trunk_diameter: _sheetGet(r, 'קוטר גזע עץ', 'קוטר גזע', 'trunk_diameter'),
      canopy_diameter: _sheetGet(r, 'קוטר נוף', 'canopy_diameter'),
      stems: _sheetGet(r, 'מספר גזעים', 'stems'),
      x, y,
      latlon: (x != null && y != null) ? _merc2wgs84(x, y) : null,
      polygon: normalizePolygonCode(_sheetGet(r, 'פוליגון', 'Polygon', 'polygon')),
    };
  }).filter(p => p.x != null && p.y != null);

  const lines = avesParsed.rows.filter(r => _sheetGet(r, 'X_Start', 'X1', 'x1') != null).map((r, i) => {
    const x1 = _sheetGet(r, 'X_Start', 'X1', 'x1');
    const y1 = _sheetGet(r, 'Y_Start', 'Y1', 'y1');
    const x2 = _sheetGet(r, 'X_End', 'X2', 'x2');
    const y2 = _sheetGet(r, 'Y_End', 'Y2', 'y2');
    return {
      id: _sheetGet(r, 'ID', 'id') || (i + 1),
      tree_width: _sheetGet(r, 'רוחב עץ', 'width'),
      avg_girth: _sheetGet(r, 'היקף ממוצע', 'avg_girth'),
      avg_height: _sheetGet(r, 'גובה ממוצע', 'avg_height'),
      type: _sheetGet(r, 'סוג', 'Type', 'type'),
      length: _sheetGet(r, 'אורך', 'Length', 'length'),
      x1, y1, x2, y2,
      latlon1: (x1 != null && y1 != null) ? _merc2wgs84(x1, y1) : null,
      latlon2: (x2 != null && y2 != null) ? _merc2wgs84(x2, y2) : null,
      polygon: normalizePolygonCode(_sheetGet(r, 'פוליגון', 'Polygon', 'polygon')),
    };
  }).filter(l => l.x1 != null && l.y1 != null && l.x2 != null && l.y2 != null);

  const polygons = polysParsed.rows.filter(r => _sheetGet(r, 'Polygon', 'פוליגון', 'polygon')).map(r => {
    const code = normalizePolygonCode(_sheetGet(r, 'Polygon', 'פוליגון', 'polygon'));
    const spaceCode = _spaceCode(
      _sheetGet(r, 'AREA', 'Area', 'area', 'טור E (מאחד)', 'טור E', '_col4', 'Space Code', 'space_code')
    );
    const rawNameHe = String(_sheetGet(r, 'Space Name [HE]', 'שם בעברית', 'Name HE', 'space_name_he') || '').trim();
    const rawNameEn = String(_sheetGet(r, 'Space Name', 'שם באנגלית', 'Name EN', 'space_name') || '').trim();
    return {
      polygon: code,
      latlons: _parseCoordsStr(_sheetGet(r, 'Coordinates', 'Coords', 'coords')),
      space_name_he: rawNameHe || rawNameEn || spaceCode || code,
      space_name: rawNameEn || rawNameHe || spaceCode || code,
      // AREA column = super-area grouping key (read live from sheet every load)
      space_code: spaceCode,
      space_type: _sheetGet(r, 'Space type', 'סוג', 'Type', 'space_type'),
      area_acres: _sheetGet(r, 'Area (acres)', 'שטח acres', 'area_acres'),
      tree_count_sheet: _sheetGet(r, 'כמות שקמים', 'Tree Count'),
      avenue_count_sheet: _sheetGet(r, 'כמות שדרות', 'Avenue Count'),
      sum_girth_sheet: _sheetGet(r, 'סכום היקף', 'Sum Girth'),
      avg_girth_sheet: _sheetGet(r, 'ממוצע היקף', 'Avg Girth'),
      std_girth_sheet: _sheetGet(r, 'סטיית תקן היקף', 'Std Girth'),
      min_girth_sheet: _sheetGet(r, 'היקף: מינימום', 'Min Girth'),
      max_girth_sheet: _sheetGet(r, 'היקף: מקסימום', 'Max Girth'),
      density_sheet: _sheetGet(r, 'צפיפות שקמים בפוליגון', 'Density'),
    };
  });

  // Add phantom entries for polygon codes in trees/avenues that the polygons sheet is missing
  const polySet = new Set(polygons.map(p => p.polygon));
  [...points, ...lines].map(x => x.polygon).filter(Boolean).forEach(code => {
    if (polySet.has(code)) return;
    polygons.push({
      polygon: code, latlons: [],
      space_name_he: code, space_name: code,
      space_code: null, // phantom polygon — no Area value in sheet, not part of any super-area
      space_type: '', area_acres: 0,
      tree_count_sheet: null, avenue_count_sheet: null,
      sum_girth_sheet: null, avg_girth_sheet: null,
      std_girth_sheet: null, min_girth_sheet: null,
      max_girth_sheet: null, density_sheet: null,
    });
    polySet.add(code);
  });

  const distribution = distParsed.rows
    .map(r => ({ ...r, girth_range: _sheetGet(r, 'girth_range', 'Girth Range', 'טווח') }))
    .filter(r => r.girth_range != null);

  return {
    points, lines, polygons, distribution,
    poly_stats: {},
    sourceSheet: `https://docs.google.com/spreadsheets/d/${SHEET_ID}`,
    lastUpdated: new Date().toISOString(),
  };
}
/* ===== end live sheet fetch ===== */

/* ---------- data loading ---------- */
async function loadData() {
  try {
    // Always try to fetch live from Google Sheet so data stays current on every load
    let loadedLive = false;
    try {
      document.getElementById('statusText').textContent = t('loading_sheet');
      DATA = await buildDataFromSheets();
      loadedLive = true;
      console.log(`Loaded live from Google Sheet: ${DATA.points.length} trees, ${DATA.polygons.length} polygons`);
    } catch (sheetErr) {
      console.warn('Live Google Sheet fetch failed, falling back to embedded data:', sheetErr);
      document.getElementById('statusText').textContent = t('sheet_load_error') + sheetErr.message + ' - ' + t('loading_saved_data');
      const inlineEl = document.getElementById('_dataInline');
      if (inlineEl) {
        DATA = JSON.parse(inlineEl.textContent);
      } else {
        const resp = await fetch('data.json');
        if (!resp.ok) throw new Error(t('data_error'));
        DATA = await resp.json();
      }
    }

    const sheetPolygons = Array.isArray(DATA.polygons) ? DATA.polygons : [];
    DATA.polygons = mergePolygonsFromSheetAndAPI(sheetPolygons, []);

    // Merge in live ArcGIS geometries without dropping sheet-only polygons/metadata.
    try {
      document.getElementById('statusText').textContent = t('loading_polygons');
      const apiPolygons = await loadPolygonsFromAPI();
      DATA.polygons = mergePolygonsFromSheetAndAPI(sheetPolygons, apiPolygons);
    } catch (apiErr) {
      console.warn('Polygon API fetch failed, using sheet polygons:', apiErr);
    }
    normalizeDataForEnglishUI();
    loadUserPolygons();
    buildSuperAreas();
    init();
    const sourceLabel = loadedLive ? ` • ${t('loaded_from_sheet')}` : ` • ${t('loaded_from_saved')}`;
    document.getElementById('statusText').textContent = `${DATA.points.length} ${t('trees')} | ${DATA.polygons.length} ${t('polygons')} | ${DATA.lines.length} ${t('avenues')}${sourceLabel}`;
  } catch (e) {
    document.getElementById('statusText').textContent = t('error_loading') + e.message;
    const appRoot = document.getElementById('app');
    if (appRoot) appRoot.style.visibility = 'visible';
    console.error(e);
  }
}

/* ---------- super-area computation ---------- */
function buildSuperAreas() {
  const saMap = {};
  DATA.polygons.filter(p => !isUserPolygonObj(p)).forEach(p => {
    const code = p.space_code ? String(p.space_code).trim() : null;
    if (!code) return; // no Area value — polygon not part of any space
    // The AREA column value IS the space name — store it as code.
    // name_he / name_en come from the polygon's own space_name_he / space_name columns
    // and are available as supplementary info but are NOT the space identity.
    if (!saMap[code]) saMap[code] = { code, polygons: [], name_he: null, name_en: null };
    const heName = String(p.space_name_he || '').trim();
    const enName = String(p.space_name || '').trim();
    if (!saMap[code].name_he && heName) saMap[code].name_he = heName;
    if (!saMap[code].name_en && enName) saMap[code].name_en = enName;
    saMap[code].polygons.push(p.polygon);
  });
  DATA.superAreas = Object.values(saMap).map(sa => ({
    ...sa,
    name_he: sa.name_he || sa.code,
    name_en: sa.name_en || sa.code,
  }));
}

function computeSAStats(sa) {
  if (_saStatsCache[sa.code]) return _saStatsCache[sa.code];
  const polyCodes = new Set(sa.polygons);
  const pts = DATA.points.filter(t => polyCodes.has(t.polygon));
  const lns = DATA.lines.filter(l => polyCodes.has(l.polygon));
  const polyObjs = DATA.polygons.filter(p => polyCodes.has(p.polygon));
  const girths = pts.map(t => t.girth).filter(v => v != null && !isNaN(v));
  const heights = pts.map(t => t.height).filter(v => v != null && !isNaN(v));
  const defSp = parseFloat(document.getElementById('defaultSpacing').value) || 8;
  const avenueTrees = lns.reduce((s, l) => {
    const sp = avenueSpacing[l.id] || defSp;
    return s + ((l.length && sp > 0) ? Math.round(l.length / sp) : 0);
  }, 0);
  const result = {
    code: sa.code,
    name_he: sa.name_he || sa.code,
    name_en: sa.name_en || sa.code,
    polygons: sa.polygons,
    treeCount: pts.length,
    avenueCount: lns.length,
    avenueTrees,
    totalTrees: pts.length + avenueTrees,
    totalArea: polyObjs.reduce((s, p) => s + (p.area_acres || 0), 0),
    avgGirth: mean(girths),
    medianGirth: median(girths),
    stdGirth: stddev(girths),
    minGirth: arrMin(girths),
    maxGirth: arrMax(girths),
    avgHeight: mean(heights),
    medianHeight: median(heights),
    stdHeight: stddev(heights),
    minHeight: arrMin(heights),
    maxHeight: arrMax(heights),
    density: polyObjs.reduce((s, p) => s + (p.area_acres || 0), 0) > 0
      ? pts.length / polyObjs.reduce((s, p) => s + (p.area_acres || 0), 0) : 0,
    spaceTypes: [...new Set(polyObjs.map(p => p.space_type).filter(Boolean))],
  };
  _saStatsCache[sa.code] = result;
  return result;
}

/* ---------- polygon stats (includes avenue trees) ---------- */
function computePolyStats(polyCode) {
  if (_polyStatsCache[polyCode]) return _polyStatsCache[polyCode];
  const pObj = getPolygonByCode(polyCode);
  const pts = getPointsForPolygonCode(polyCode);
  const lns = getLinesForPolygonCode(polyCode);
  const girths = pts.map(t => t.girth).filter(v => v != null && !isNaN(v));
  const heights = pts.map(t => normalizeHeight(t.height)).filter(v => v != null && !isNaN(v));
  const defSp = parseFloat(document.getElementById('defaultSpacing').value) || 8;
  const avenueTrees = lns.reduce((s, l) => {
    const sp = avenueSpacing[l.id] || defSp;
    return s + ((l.length && sp > 0) ? Math.round(l.length / sp) : 0);
  }, 0);
  const areaAcres = pObj?.area_acres || (isUserPolygonObj(pObj) ? polygonAreaAcres(pObj.latlons) : 0);
  const result = {
    polygon: polyCode,
    name_he: polygonDisplayName(pObj, 'he'),
    name_en: polygonDisplayName(pObj, 'en'),
    space_type: pObj?.space_type || '',
    space_code: pObj?.space_code || '',
    area: areaAcres,
    treeCount: pts.length,
    avenueCount: lns.length,
    avenueTrees,
    totalTrees: pts.length + avenueTrees,
    avgGirth: mean(girths), medianGirth: median(girths), stdGirth: stddev(girths),
    minGirth: arrMin(girths), maxGirth: arrMax(girths),
    avgHeight: mean(heights), medianHeight: median(heights), stdHeight: stddev(heights),
    minHeight: arrMin(heights), maxHeight: arrMax(heights),
    density: (areaAcres > 0) ? pts.length / areaAcres : 0,
    totalLineLength: lns.reduce((s, l) => s + (l.length || 0), 0),
  };
  _polyStatsCache[polyCode] = result;
  return result;
}

/* ---------- v8 additions ---------- */
const EXCLUDED_POLYGON_CODES = new Set([]);
let showOutsideTrees = true;

function normalizeHeight(h) {
  if (h == null || h === '') return null;
  const n = Number(h);
  if (!Number.isFinite(n) || n === 0) return null;
  return (n >= 1 && n <= 99) ? n * 100 : n;
}

function analysisPolygons(polys) {
  return polys.filter(p => !EXCLUDED_POLYGON_CODES.has(String(p.polygon || '').toUpperCase()));
}

function spaceEllipseToggleLabel() {
  return showSpaceEllipses ? t('hide_space_ellipses') : t('show_space_ellipses');
}

function setSpaceEllipseButtonText() {
  const btn = document.getElementById('btnToggleSpaceEllipses');
  if (btn) btn.textContent = spaceEllipseToggleLabel();
}

function computeEllipseFromPointsLatLon(pointsLatLon) {
  if (!Array.isArray(pointsLatLon) || pointsLatLon.length < 3) return null;

  const meanLat = pointsLatLon.reduce((s, p) => s + p[0], 0) / pointsLatLon.length;
  const meanLon = pointsLatLon.reduce((s, p) => s + p[1], 0) / pointsLatLon.length;
  const meanLatRad = meanLat * Math.PI / 180;
  const metersPerLat = 111320;
  const metersPerLon = 111320 * Math.cos(meanLatRad);
  if (!Number.isFinite(metersPerLon) || Math.abs(metersPerLon) < 1e-8) return null;

  const ptsMeters = pointsLatLon.map(([lat, lon]) => [
    (lon - meanLon) * metersPerLon,
    (lat - meanLat) * metersPerLat,
  ]);

  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (const [x, y] of ptsMeters) {
    sxx += x * x;
    syy += y * y;
    sxy += x * y;
  }
  const n = Math.max(ptsMeters.length - 1, 1);
  const covXX = sxx / n;
  const covYY = syy / n;
  const covXY = sxy / n;

  const trace = covXX + covYY;
  const det = covXX * covYY - covXY * covXY;
  const delta = Math.max(0, (trace * trace) / 4 - det);
  const root = Math.sqrt(delta);
  const lambda1 = Math.max(trace / 2 + root, 0);
  const lambda2 = Math.max(trace / 2 - root, 0);

  let vx = 1;
  let vy = 0;
  if (Math.abs(covXY) > 1e-10 || Math.abs(lambda1 - covXX) > 1e-10) {
    vx = covXY;
    vy = lambda1 - covXX;
    const norm = Math.hypot(vx, vy) || 1;
    vx /= norm;
    vy /= norm;
  }
  const angle = Math.atan2(vy, vx);

  const sigmaScale = 2.2;
  const major = Math.max(Math.sqrt(lambda1) * sigmaScale, 20);
  const minor = Math.max(Math.sqrt(lambda2) * sigmaScale, 12);
  if (!Number.isFinite(major) || !Number.isFinite(minor)) return null;

  const steps = 72;
  const ellipse = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const ex = major * Math.cos(t);
    const ey = minor * Math.sin(t);
    const rx = ex * Math.cos(angle) - ey * Math.sin(angle);
    const ry = ex * Math.sin(angle) + ey * Math.cos(angle);
    const lat = meanLat + (ry / metersPerLat);
    const lon = meanLon + (rx / metersPerLon);
    ellipse.push([lat, lon]);
  }

  return {
    center: [meanLat, meanLon],
    major,
    minor,
    ellipse,
  };
}

function drawSpaceEllipses(polysInView) {
  layers.spaceEllipses.clearLayers();
  if (!showSpaceEllipses || !Array.isArray(DATA?.superAreas)) return;

  const activePolyCodes = new Set((polysInView || []).map(p => p.polygon));
  DATA.superAreas.forEach(sa => {
    const saPolys = DATA.polygons.filter(p => sa.polygons.includes(p.polygon));
    const visibleSaPolys = saPolys.filter(p => activePolyCodes.has(p.polygon));
    if (!visibleSaPolys.length) return;

    const ringPoints = [];
    visibleSaPolys.forEach(p => {
      if (Array.isArray(p.latlons) && p.latlons.length >= 3) {
        p.latlons.forEach(ll => ringPoints.push(ll));
      }
    });
    const ellipseData = computeEllipseFromPointsLatLon(ringPoints);
    if (!ellipseData) return;

    const isSelected = selectedSA === sa.code;
    const stroke = isSelected ? '#7c2d12' : '#92400e';
    const fill = isSelected ? '#f97316' : '#fb923c';
    const poly = L.polygon(ellipseData.ellipse, {
      color: stroke,
      weight: isSelected ? 3 : 2,
      fillColor: fill,
      fillOpacity: isSelected ? 0.14 : 0.08,
      dashArray: '7,6',
    }).addTo(layers.spaceEllipses);

    const title = `${sa.code} - ${superAreaDisplayName(sa)}`;
    poly.bindPopup(`<b>${title}</b><br>${t('estimated_space_ellipse')}<br>${t('polygons')}: ${visibleSaPolys.map(p => p.polygon).join(', ')}`);
    poly.on('click', () => {
      selectedSA = sa.code;
      selectedPolygon = null;
      updateAll();
    });
  });
}

function outsidePolygonPoints() {
  const polys = analysisPolygons(DATA.polygons || []);
  const geoPolys = polys.filter(p => Array.isArray(p.latlons) && p.latlons.length >= 3);
  const noGeomPolyCodes = new Set(
    polys
      .filter(p => !Array.isArray(p.latlons) || p.latlons.length < 3)
      .map(p => p.polygon)
      .filter(Boolean)
  );
  return DATA.points.filter(t => {
    if (!Array.isArray(t.latlon)) return false;
    if (geoPolys.some(p => pointInPolygon(t.latlon, p.latlons))) return false;
    // If a polygon exists but has no geometry, rely on coded assignment to avoid false "outside".
    return !t.polygon || !noGeomPolyCodes.has(t.polygon);
  });
}

/* ---------- filtering ---------- */
function filteredPolygons() {
  const q = document.getElementById('searchPoly').value.trim().toLowerCase();
  const base = analysisPolygons(DATA.polygons);
  if (!q) return base;
  return base.filter(p => (`${p.polygon} ${p.space_name_he || ''} ${p.space_name || ''} ${p.space_code || ''}`).toLowerCase().includes(q));
}
function filteredPoints(polys) {
  const set = new Set(polys.map(p => p.polygon));
  return DATA.points.filter(t => t.polygon && set.has(t.polygon));
}
function filteredLines(polys) {
  const set = new Set(polys.map(p => p.polygon));
  return DATA.lines.filter(l => !l.polygon || set.has(l.polygon));
}

/* ---------- map ---------- */
function setBase(mode) {
  if (currentBase) map.removeLayer(currentBase);
  if (currentOverlay) map.removeLayer(currentOverlay);
  currentOverlay = null;
  if (mode.includes('+')) {
    const [base, overlay] = mode.split('+');
    currentBase = baseDefs[base]().addTo(map);
    currentOverlay = baseDefs[overlay]();
    currentOverlay.options.opacity = 0.6;
    currentOverlay.addTo(map);
  } else {
    currentBase = baseDefs[mode]().addTo(map);
  }
}

function getPolygonStyle(code) {
  const isUser = isUserPolygonObj(getPolygonByCode(code));
  if (isUser) {
    const sel = selectedPolygon === code;
    return {
      color: '#b91c1c',
      weight: sel ? 4 : 3,
      fillColor: '#ef4444',
      fillOpacity: sel ? 0.34 : 0.16,
    };
  }
  const sel = selectedPolygon === code;
  const saSel = selectedSA && DATA.superAreas.find(s => s.code === selectedSA)?.polygons.includes(code);
  return {
    color: sel ? '#1d4ed8' : (saSel ? '#7c3aed' : '#2563eb'),
    weight: sel ? 4 : (saSel ? 3 : 2),
    fillColor: sel ? '#3b82f6' : (saSel ? '#a78bfa' : '#60a5fa'),
    fillOpacity: sel ? 0.32 : (saSel ? 0.24 : 0.14),
  };
}

/* Sort vertices by angle around their centroid → proper convex polygon */
function orderVertices(latlons) {
  if (latlons.length <= 2) return latlons;
  const cLat = latlons.reduce((s, p) => s + p[0], 0) / latlons.length;
  const cLon = latlons.reduce((s, p) => s + p[1], 0) / latlons.length;
  return latlons.slice().sort((a, b) =>
    Math.atan2(a[0] - cLat, a[1] - cLon) - Math.atan2(b[0] - cLat, b[1] - cLon)
  );
}

function drawMap() {
  Object.values(layers).forEach(g => g.clearLayers());
  const polys = filteredPolygons();
  const pts = filteredPoints(polys);
  const outsidePts = showOutsideTrees ? outsidePolygonPoints() : [];
  const lns = filteredLines(polys);
  const showPolys = document.getElementById('chkPolys').checked;
  const showTrees = document.getElementById('chkTrees').checked;
  const showLines = document.getElementById('chkLines').checked;
  const showLabels = document.getElementById('chkLabels').checked;

  if (showPolys) polys.forEach(p => {
    if (!Array.isArray(p.latlons) || p.latlons.length < 3) return;
    // Polygon coordinates from ArcGIS API (and data.json) are already in correct order — no resorting
    const poly = L.polygon(p.latlons, getPolygonStyle(p.polygon)).addTo(layers.polys);
    const st = computePolyStats(p.polygon);
    const userTag = isUserPolygonObj(p) ? `<span style="color:#b91c1c;font-weight:700">${t('user_polygon_badge')}</span><br>` : '';
    poly.bindPopup(`<b>${p.polygon} - ${polygonDisplayName(p)}</b><br>${userTag}${englishizeValue(p.space_type || '', 'Other')}<br>${t('trees')}: ${st.totalTrees} (${st.avenueTrees} ${t('avenues')})<br>${t('avg_girth')}: ${fmt(st.avgGirth)}<br>${t('area')}: ${fmt(st.area)} acres`);
    poly.on('click', () => { selectedPolygon = p.polygon; selectedSA = null; updateAll(); });
    if (showLabels) {
      const lat = p.latlons.reduce((a, b) => a + b[0], 0) / p.latlons.length;
      const lon = p.latlons.reduce((a, b) => a + b[1], 0) / p.latlons.length;
      L.marker([lat, lon], { interactive: false, opacity: 0 })
        .bindTooltip(p.polygon, { permanent: true, direction: 'center', className: 'polylabel' })
        .addTo(layers.labels);
    }
  });

  drawSpaceEllipses(polys);

  if (showTrees) {
    pts.forEach(pt => {
      const isSel = selectedPolygon && pt.polygon === selectedPolygon;
      const isSASel = selectedSA && DATA.superAreas.find(s => s.code === selectedSA)?.polygons.includes(pt.polygon);
      const clr = isSel ? '#14532d' : (isSASel ? '#7c3aed' : '#16a34a');
      L.circleMarker(pt.latlon, { radius: 3.5, color: clr, fillColor: clr, fillOpacity: 0.9, weight: 1 })
        .bindPopup(`${t('tree')} #${pt.id}<br>${t('polygon')}: ${pt.polygon || t('unassigned')}<br>${t('avg_girth')}: ${pt.girth ?? ''}<br>${t('avg_height')}: ${normalizeHeight(pt.height) ?? ''}`)
        .addTo(layers.trees);
    });
    outsidePts.forEach(pt => {
      L.circleMarker(pt.latlon, { radius: 4, color: '#92400e', fillColor: '#d97706', fillOpacity: 0.9, weight: 1 })
        .bindPopup(`${t('tree')} #${pt.id} (${t('outside_polygons_suffix')})<br>${t('avg_girth')}: ${pt.girth ?? ''}<br>${t('avg_height')}: ${normalizeHeight(pt.height) ?? ''}`)
        .addTo(layers.trees);
    });
  }

  if (showLines) lns.forEach(l => {
    L.polyline([l.latlon1, l.latlon2], { color: '#dc2626', weight: 3, dashArray: '8,5' })
      .bindPopup(`${t('avenue')} #${l.id}<br>${t('polygon')}: ${l.polygon || t('unassigned')}<br>${t('type')}: ${englishizeValue(l.type || '', 'Other')}<br>${t('length')}: ${fmt(l.length)}`)
      .addTo(layers.lines);
  });

  const outsideLabel = showOutsideTrees ? ` (+${outsidePts.length} ${t('outside_polygons_suffix')})` : '';
  document.getElementById('statusText').textContent = `${pts.length} ${t('trees')}${outsideLabel} | ${polys.length} ${t('polygons')} | ${lns.length} ${t('avenues')}`;
}

function fitToData() {
  const polys = filteredPolygons();
  const all = [];
  polys.forEach(p => p.latlons.forEach(ll => all.push(ll)));
  if (all.length) map.fitBounds(all, { padding: [20, 20] });
}

function fitToPolygon(code) {
  const p = DATA.polygons.find(x => x.polygon === code);
  if (p && p.latlons.length) map.fitBounds(p.latlons, { padding: [40, 40], maxZoom: 16 });
}

function fitToSA(saCode) {
  const sa = DATA.superAreas.find(s => s.code === saCode);
  if (!sa) return;
  const all = [];
  sa.polygons.forEach(code => {
    const p = DATA.polygons.find(x => x.polygon === code);
    if (p) p.latlons.forEach(ll => all.push(ll));
  });
  if (all.length) map.fitBounds(all, { padding: [30, 30] });
}

/* ---------- KPIs ---------- */
function updateKPIs() {
  if (selectedPolygon && isUserPolygonObj(getPolygonByCode(selectedPolygon))) {
    const st = computePolyStats(selectedPolygon);
    document.getElementById('kTrees').textContent = fmtInt(st.totalTrees);
    document.getElementById('kPolys').textContent = '1';
    document.getElementById('kLines').textContent = fmtInt(st.avenueCount);
    document.getElementById('kAvgG').textContent = fmt(st.avgGirth);
    document.getElementById('kAvgH').textContent = fmt(st.avgHeight);
    document.getElementById('kArea').textContent = fmt(st.area);
    document.getElementById('kMedG').textContent = fmt(st.medianGirth);
    document.getElementById('kSA').textContent = fmtInt(DATA.superAreas.length);
    document.getElementById('kDens').textContent = fmt(st.density, 2);
    updateSelectionDetail();
    return;
  }
  const polys = filteredPolygons();
  const activePoly = selectedPolygon ? [selectedPolygon] : (selectedSA ? DATA.superAreas.find(s => s.code === selectedSA)?.polygons || [] : []);
  const pts = activePoly.length
    ? DATA.points.filter(t => activePoly.includes(t.polygon))
    : filteredPoints(polys);
  const lns = activePoly.length
    ? DATA.lines.filter(l => activePoly.includes(l.polygon))
    : filteredLines(polys);
  const activePolyObjs = activePoly.length
    ? DATA.polygons.filter(p => activePoly.includes(p.polygon))
    : polys;

  const defSp = parseFloat(document.getElementById('defaultSpacing').value) || 8;
  const avenueTrees = lns.reduce((s, l) => {
    const sp = avenueSpacing[l.id] || defSp;
    return s + ((l.length && sp > 0) ? Math.round(l.length / sp) : 0);
  }, 0);

  document.getElementById('kTrees').textContent = fmtInt(pts.length + avenueTrees);
  document.getElementById('kPolys').textContent = fmtInt(activePolyObjs.length);
  document.getElementById('kLines').textContent = fmtInt(lns.length);
  document.getElementById('kAvgG').textContent = fmt(mean(pts.map(t => t.girth)));
  document.getElementById('kAvgH').textContent = fmt(mean(pts.map(t => normalizeHeight(t.height))));
  document.getElementById('kArea').textContent = fmt(activePolyObjs.reduce((s, p) => s + (p.area_acres || 0), 0));
  document.getElementById('kMedG').textContent = fmt(median(pts.map(t => t.girth)));
  document.getElementById('kSA').textContent = fmtInt(DATA.superAreas.length);
  const totalArea = activePolyObjs.reduce((s, p) => s + (p.area_acres || 0), 0);
  document.getElementById('kDens').textContent = totalArea > 0 ? fmt(pts.length / totalArea, 2) : '-';

  updateSelectionDetail();
}

/* ---------- selection detail card ---------- */
function updateSelectionDetail() {
  const el = document.getElementById('selectionDetail');
  if (selectedPolygon) {
    const st = computePolyStats(selectedPolygon);
    el.innerHTML = `
      <div class="card">
        <div class="detail-header"><span class="poly-code">${st.polygon}</span><span class="poly-name">${englishizeValue(st.name_en || st.name_he || st.polygon, st.polygon)}</span></div>
        <div class="detail-grid">
          <div class="card"><h5>${t('tree_data')}</h5>
            <div class="stat-row"><span class="stat-label">${t('mapped_trees')}</span><span class="stat-value">${st.treeCount}</span></div>
            <div class="stat-row"><span class="stat-label">${t('avenue_trees')}</span><span class="stat-value">${st.avenueTrees}</span></div>
            <div class="stat-row"><span class="stat-label">${t('total_trees')}</span><span class="stat-value">${st.totalTrees}</span></div>
            <div class="stat-row"><span class="stat-label">${t('avenues_tab')}</span><span class="stat-value">${st.avenueCount}</span></div>
          </div>
          <div class="card"><h5>${t('girth_stats')}</h5>
            <div class="stat-row"><span class="stat-label">${t('avg_girth')}</span><span class="stat-value">${fmt(st.avgGirth)}</span></div>
            <div class="stat-row"><span class="stat-label">${t('median_girth')}</span><span class="stat-value">${fmt(st.medianGirth)}</span></div>
            <div class="stat-row"><span class="stat-label">${t('std_girth')}</span><span class="stat-value">${fmt(st.stdGirth)}</span></div>
            <div class="stat-row"><span class="stat-label">${t('min_girth')}</span><span class="stat-value">${fmt(st.minGirth)}</span></div>
            <div class="stat-row"><span class="stat-label">${t('max_girth')}</span><span class="stat-value">${fmt(st.maxGirth)}</span></div>
          </div>
          <div class="card"><h5>${t('height_stats')}</h5>
            <div class="stat-row"><span class="stat-label">${t('avg_height')}</span><span class="stat-value">${fmt(st.avgHeight)}</span></div>
            <div class="stat-row"><span class="stat-label">${t('median_girth')}</span><span class="stat-value">${fmt(st.medianHeight)}</span></div>
            <div class="stat-row"><span class="stat-label">${t('std_height')}</span><span class="stat-value">${fmt(st.stdHeight)}</span></div>
            <div class="stat-row"><span class="stat-label">${t('min_height')}</span><span class="stat-value">${fmt(st.minHeight)}</span></div>
            <div class="stat-row"><span class="stat-label">${t('max_height')}</span><span class="stat-value">${fmt(st.maxHeight)}</span></div>
          </div>
          <div class="card"><h5>${t('space_info')}</h5>
            <div class="stat-row"><span class="stat-label">${t('area_acres')}</span><span class="stat-value">${fmt(st.area)}</span></div>
            <div class="stat-row"><span class="stat-label">${t('space_type')}</span><span class="stat-value">${st.space_type}</span></div>
            <div class="stat-row"><span class="stat-label">${t('super_area_code')}</span><span class="stat-value">${st.space_code}</span></div>
            <div class="stat-row"><span class="stat-label">${t('avg_density')}</span><span class="stat-value">${fmt(st.density, 3)}</span></div>
            <div class="stat-row"><span class="stat-label">${t('line_length')}</span><span class="stat-value">${fmt(st.totalLineLength)}</span></div>
          </div>
        </div>
      </div>`;
  } else if (selectedSA) {
    const sa = DATA.superAreas.find(s => s.code === selectedSA);
    const st = computeSAStats(sa);
    const saName = st.code;

    // Build space-type breakdown table
    const stypeMap = {};
    sa.polygons.forEach(polyCode => {
      const ps = computePolyStats(polyCode);
      const pObj = DATA.polygons.find(x => x.polygon === polyCode);
      const stype = englishizeValue((pObj?.space_type || '').trim(), t('no_data_dash')) || t('no_data_dash');
      if (!stypeMap[stype]) stypeMap[stype] = { polygons: [], trees: 0, avenueTrees: 0, area: 0, girths: [], heights: [] };
      const g = stypeMap[stype];
      g.polygons.push(polyCode);
      g.trees += ps.treeCount;
      g.avenueTrees += ps.avenueTrees;
      g.area += ps.area || 0;
      // collect raw girth/height values for aggregate stats
      getPointsForPolygonCode(polyCode).forEach(pt => {
        if (pt.girth != null && !isNaN(pt.girth)) g.girths.push(pt.girth);
        const h = normalizeHeight(pt.height);
        if (h != null) g.heights.push(h);
      });
    });
    const stypeRows = Object.entries(stypeMap)
      .sort((a, b) => b[1].trees + b[1].avenueTrees - (a[1].trees + a[1].avenueTrees))
      .map(([stype, g]) => {
        const total = g.trees + g.avenueTrees;
        const avgG = g.girths.length ? (g.girths.reduce((a,b)=>a+b,0)/g.girths.length) : null;
        const avgH = g.heights.length ? (g.heights.reduce((a,b)=>a+b,0)/g.heights.length) : null;
        const density = g.area > 0 ? g.trees / g.area : null;
        return `<tr>
          <td>${stype}</td>
          <td style="text-align:center">${g.polygons.join(', ')}</td>
          <td style="text-align:center">${total}</td>
          <td style="text-align:center">${g.trees}</td>
          <td style="text-align:center">${g.avenueTrees}</td>
          <td style="text-align:center">${fmt(g.area)}</td>
          <td style="text-align:center">${avgG != null ? fmt(avgG) : t('no_data_dash')}</td>
          <td style="text-align:center">${avgH != null ? fmt(avgH) : t('no_data_dash')}</td>
          <td style="text-align:center">${density != null ? fmt(density,3) : t('no_data_dash')}</td>
        </tr>`;
      }).join('');
    const spaceTypeTable = `
      <div class="card" style="margin-top:10px">
        <h5>${t('space_types_dist')}</h5>
        <table class="avenue-table">
          <thead><tr>
            <th>${t('space_type')}</th>
            <th>${t('polygons')}</th>
            <th>${t('total_trees')}</th>
            <th>${t('mapped_trees')}</th>
            <th>${t('avenue_trees')}</th>
            <th>${t('area_acres')}</th>
            <th>${t('avg_girth')}</th>
            <th>${t('avg_height')}</th>
            <th>${t('avg_density')}</th>
          </tr></thead>
          <tbody>${stypeRows}</tbody>
        </table>
      </div>`;

    el.innerHTML = `
      <div class="card">
        <div class="detail-header"><span class="poly-code">${st.code}</span><span class="poly-name">${t('super_area_code')}: ${saName}</span></div>
        <div class="small">${t('polygons')}: ${st.polygons.join(', ')}</div>
        <div class="detail-grid">
          <div class="card"><h5>${t('tree_data')}</h5>
            <div class="stat-row"><span class="stat-label">${t('mapped_trees')}</span><span class="stat-value">${st.treeCount}</span></div>
            <div class="stat-row"><span class="stat-label">${t('avenue_trees')}</span><span class="stat-value">${st.avenueTrees}</span></div>
            <div class="stat-row"><span class="stat-label">${t('total_trees')}</span><span class="stat-value">${st.totalTrees}</span></div>
            <div class="stat-row"><span class="stat-label">${t('avenues_tab')}</span><span class="stat-value">${st.avenueCount}</span></div>
          </div>
          <div class="card"><h5>${t('girth_stats')}</h5>
            <div class="stat-row"><span class="stat-label">${t('avg_girth')}</span><span class="stat-value">${fmt(st.avgGirth)}</span></div>
            <div class="stat-row"><span class="stat-label">${t('median_girth')}</span><span class="stat-value">${fmt(st.medianGirth)}</span></div>
            <div class="stat-row"><span class="stat-label">${t('std_girth')}</span><span class="stat-value">${fmt(st.stdGirth)}</span></div>
            <div class="stat-row"><span class="stat-label">${t('min_girth')}/${t('max_girth')}</span><span class="stat-value">${fmt(st.minGirth)} – ${fmt(st.maxGirth)}</span></div>
          </div>
          <div class="card"><h5>${t('height_stats')}</h5>
            <div class="stat-row"><span class="stat-label">${t('avg_height')}</span><span class="stat-value">${fmt(st.avgHeight)}</span></div>
            <div class="stat-row"><span class="stat-label">${t('median_girth')}</span><span class="stat-value">${fmt(st.medianHeight)}</span></div>
            <div class="stat-row"><span class="stat-label">${t('std_height')}</span><span class="stat-value">${fmt(st.stdHeight)}</span></div>
            <div class="stat-row"><span class="stat-label">${t('min_height')}/${t('max_height')}</span><span class="stat-value">${fmt(st.minHeight)} – ${fmt(st.maxHeight)}</span></div>
          </div>
          <div class="card"><h5>${t('space_info')}</h5>
            <div class="stat-row"><span class="stat-label">${t('area_acres')}</span><span class="stat-value">${fmt(st.totalArea)} ac</span></div>
            <div class="stat-row"><span class="stat-label">${t('avg_density')}</span><span class="stat-value">${fmt(st.density, 3)}</span></div>
            <div class="stat-row"><span class="stat-label">${t('space_type')}</span><span class="stat-value">${st.spaceTypes.join(', ')}</span></div>
          </div>
        </div>
        ${spaceTypeTable}
      </div>`;
  } else {
    el.innerHTML = `<div class="card small">${t('no_data')}</div>`;
  }
}

/* ---------- polygon list tab ---------- */
function renderPolyList() {
  const container = document.getElementById('polyList');
  container.innerHTML = DATA.polygons.map(p => {
    const st = computePolyStats(p.polygon);
    const isUser = isUserPolygonObj(p);
    return `<div class="poly-item ${selectedPolygon === p.polygon ? 'selected' : ''} ${isUser ? 'user-poly' : ''}" data-poly="${p.polygon}">
      <span class="code">${p.polygon}</span>
      <span class="info"><span class="name">${polygonDisplayName(p)}${isUser ? ` <b style="color:#b91c1c">(${t('user_polygon_badge')})</b>` : ''}</span><br>${p.space_type || ''} | ${fmt(st.area)} acres | ${t('avg_density')}: ${fmt(st.density, 3)}</span>
      <span class="trees-badge">${st.totalTrees} ${t('trees')}</span>
    </div>`;
  }).join('');
  container.querySelectorAll('.poly-item').forEach(el => {
    el.addEventListener('click', () => {
      selectedPolygon = el.dataset.poly;
      selectedSA = null;
      fitToPolygon(selectedPolygon);
      updateAll();
    });
  });
}

/* ---------- super-area list tab ---------- */
function renderSAList() {
  const container = document.getElementById('saList');
  container.innerHTML = DATA.superAreas.map(sa => {
    const st = computeSAStats(sa);
    return `<div class="sa-card ${selectedSA === sa.code ? 'selected' : ''}" data-sa="${sa.code}">
      <h5>${sa.code} - ${superAreaDisplayName(sa)}</h5>
      <div class="sa-polys">${t('polygons')}: ${sa.polygons.join(', ')}</div>
      <div class="sa-stats">
        <div class="sa-stat"><div class="sv">${st.totalTrees}</div>${t('trees')}</div>
        <div class="sa-stat"><div class="sv">${fmt(st.totalArea)}</div>acres</div>
        <div class="sa-stat"><div class="sv">${fmt(st.avgGirth)}</div>${t('avg_girth')}</div>
        <div class="sa-stat"><div class="sv">${fmt(st.medianGirth)}</div>${t('median_girth')}</div>
        <div class="sa-stat"><div class="sv">${fmt(st.avgHeight)}</div>${t('avg_height')}</div>
        <div class="sa-stat"><div class="sv">${fmt(st.density, 3)}</div>${t('avg_density')}</div>
      </div>
    </div>`;
  }).join('');
  container.querySelectorAll('.sa-card').forEach(el => {
    el.addEventListener('click', () => {
      selectedSA = el.dataset.sa;
      selectedPolygon = null;
      fitToSA(selectedSA);
      updateAll();
    });
  });
}

function renderSADetail() {
  const el = document.getElementById('saDetail');
  if (!selectedSA) { el.innerHTML = ''; return; }
  const sa = DATA.superAreas.find(s => s.code === selectedSA);
  const st = computeSAStats(sa);
  el.innerHTML = `<div class="card">
    <h5>${st.code} — ${t('trees')}</h5>
    <div class="detail-grid">
      <div class="card"><h5>${t('tree_data')}</h5>
        <div class="stat-row"><span class="stat-label">${t('mapped_trees')}</span><span class="stat-value">${st.treeCount}</span></div>
        <div class="stat-row"><span class="stat-label">${t('avenue_trees')}</span><span class="stat-value">${st.avenueTrees}</span></div>
        <div class="stat-row"><span class="stat-label">${t('total_trees')}</span><span class="stat-value">${st.totalTrees}</span></div>
      </div>
      <div class="card"><h5>${t('girth_stats')}</h5>
        <div class="stat-row"><span class="stat-label">${t('avg_girth')}</span><span class="stat-value">${fmt(st.avgGirth)}</span></div>
        <div class="stat-row"><span class="stat-label">${t('median_girth')}</span><span class="stat-value">${fmt(st.medianGirth)}</span></div>
        <div class="stat-row"><span class="stat-label">${t('stdev')}</span><span class="stat-value">${fmt(st.stdGirth)}</span></div>
        <div class="stat-row"><span class="stat-label">${t('range')}</span><span class="stat-value">${fmt(st.minGirth)} – ${fmt(st.maxGirth)}</span></div>
      </div>
      <div class="card"><h5>${t('height_stats')}</h5>
        <div class="stat-row"><span class="stat-label">${t('avg_height')}</span><span class="stat-value">${fmt(st.avgHeight)}</span></div>
        <div class="stat-row"><span class="stat-label">${t('median_girth')}</span><span class="stat-value">${fmt(st.medianHeight)}</span></div>
        <div class="stat-row"><span class="stat-label">${t('stdev')}</span><span class="stat-value">${fmt(st.stdHeight)}</span></div>
        <div class="stat-row"><span class="stat-label">${t('range')}</span><span class="stat-value">${fmt(st.minHeight)} – ${fmt(st.maxHeight)}</span></div>
      </div>
      <div class="card"><h5>${t('space_info')}</h5>
        <div class="stat-row"><span class="stat-label">${t('area_acres')}</span><span class="stat-value">${fmt(st.totalArea)} ac</span></div>
        <div class="stat-row"><span class="stat-label">${t('avg_density')}</span><span class="stat-value">${fmt(st.density, 3)}</span></div>
        <div class="stat-row"><span class="stat-label">${t('space_type')}</span><span class="stat-value">${st.spaceTypes.join(', ')}</span></div>
      </div>
    </div>
  </div>`;
}

function updateSACharts() {
  const stats = DATA.superAreas.map(computeSAStats);
  // Comparison bar chart
  Plotly.newPlot('chartSACompare', [
    { x: stats.map(s => s.code), y: stats.map(s => s.totalTrees), type: 'bar', name: t('trees'), marker: { color: '#16a34a' } },
    { x: stats.map(s => s.code), y: stats.map(s => s.avgGirth), type: 'bar', name: t('avg_girth'), yaxis: 'y2', marker: { color: '#f59e0b' } },
  ], Object.assign(pltLay(t('super_area_comparison')), {
    barmode: 'group',
    yaxis: { title: t('trees') },
    yaxis2: { title: t('avg_girth'), overlaying: 'y', side: 'left', position: 0 },
  }), pltCfg);

  // Radar chart (polar bar)
  const categories = [t('trees') + ' (÷10)', t('area_acres') + ' (÷100)', t('avg_girth'), t('median_girth'), t('avg_height'), t('avg_density') + '×100'];
  const radarTraces = stats.map(s => ({
    type: 'scatterpolar',
    r: [s.totalTrees / 10, s.totalArea / 100, s.avgGirth || 0, s.medianGirth || 0, (s.avgHeight || 0) / 10, s.density * 100],
    theta: categories,
    fill: 'toself',
    name: s.code,
  }));
  Plotly.newPlot('chartSARadar', radarTraces, pltLay(t('super_area_radar')), pltCfg);
}

/* ---------- overview charts ---------- */
function updateOverviewCharts() {
  // Bar chart: trees per polygon with avenue trees stacked
  const codes = DATA.polygons.filter(p => !isUserPolygonObj(p)).map(p => p.polygon);
  const stats = codes.map(computePolyStats);
  Plotly.newPlot('chartOverviewBar', [
    { x: codes, y: stats.map(s => s.treeCount), type: 'bar', name: t('mapped'), marker: { color: '#16a34a' } },
    { x: codes, y: stats.map(s => s.avenueTrees), type: 'bar', name: t('estimated'), marker: { color: '#f59e0b' } },
  ], Object.assign(pltLay(t('trees_per_polygon')), { barmode: 'stack' }), pltCfg);

  // Pie chart: space types
  const typeCounts = {};
  DATA.polygons.filter(p => !isUserPolygonObj(p)).forEach(p => { const st = p.space_type || 'Other'; typeCounts[st] = (typeCounts[st] || 0) + 1; });
  Plotly.newPlot('chartOverviewPie', [{
    labels: Object.keys(typeCounts), values: Object.values(typeCounts),
    type: 'pie', hole: 0.4, textinfo: 'label+percent',
  }], pltLay(t('space_types_dist')), pltCfg);
}

/* ---------- analytics charts ---------- */
function updateCharts() {
  const polys = filteredPolygons();
  const polySet = new Set(polys.map(p => p.polygon));
  const activePoly = selectedPolygon ? [selectedPolygon] : (selectedSA ? DATA.superAreas.find(s => s.code === selectedSA)?.polygons || [] : []);
  const pts = activePoly.length
    ? DATA.points.filter(t => activePoly.includes(t.polygon))
    : filteredPoints(polys);

  // Scatter: girth vs height
  const colors = ['#16a34a', '#2563eb', '#dc2626', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#14b8a6', '#6366f1', '#e11d48', '#a3e635', '#0891b2', '#d946ef'];
  const polyGroups = {};
  pts.forEach(t => {
    const k = t.polygon || t('unassigned');
    if (!polyGroups[k]) polyGroups[k] = { girth: [], height: [] };
    polyGroups[k].girth.push((t.girth != null && t.girth !== 0) ? t.girth : null);
    polyGroups[k].height.push(normalizeHeight(t.height));
  });
  const scatterTraces = Object.entries(polyGroups).map(([k, v], i) => ({
    x: v.girth, y: v.height, mode: 'markers', type: 'scatter', name: k,
    marker: { color: colors[i % colors.length], size: 7, opacity: 0.7 },
    hovertemplate: `${t('polygon')}: ${k}<br>${t('avg_girth')}: %{x}<br>${t('avg_height')}: %{y}<extra></extra>`,
  }));
  Plotly.newPlot('chartScatter', scatterTraces, pltLay('', { xaxis: { title: t('avg_girth') }, yaxis: { title: t('avg_height') } }), pltCfg);

  // Bar: tree count per polygon
  const counts = {};
  pts.forEach(t => { const k = t.polygon || t('unassigned'); counts[k] = (counts[k] || 0) + 1; });
  Plotly.newPlot('chartBars', [{ x: Object.keys(counts), y: Object.values(counts), type: 'bar', marker: { color: '#2563eb' } }], pltLay(''), pltCfg);

  // Histogram: girth
  Plotly.newPlot('chartHist', [{ x: pts.map(t => t.girth).filter(v => v != null && v !== 0), type: 'histogram', marker: { color: '#0ea5e9' }, nbinsx: 30 }], pltLay(''), pltCfg);

  // Box plot by polygon
  const boxTraces = Array.from(polySet).map((code, i) => {
    const arr = DATA.points.filter(t => t.polygon === code).map(t => t.girth).filter(v => v != null && v !== 0);
    return { y: arr, type: 'box', name: code, boxpoints: false, marker: { color: colors[i % colors.length] } };
  });
  Plotly.newPlot('chartBox', boxTraces, pltLay(''), pltCfg);

  // Histogram: heights
  Plotly.newPlot('chartHeights', [{ x: pts.map(t => normalizeHeight(t.height)).filter(v => v != null), type: 'histogram', marker: { color: '#8b5cf6' }, nbinsx: 25 }], pltLay(''), pltCfg);

  // Density by polygon
  const densX = polys.map(p => p.polygon);
  const densY = densX.map(code => {
    const st = computePolyStats(code);
    return st.density;
  });
  Plotly.newPlot('chartDensity', [{ x: densX, y: densY, type: 'bar', marker: { color: '#f59e0b' } }], pltLay(''), pltCfg);

  // Heatmap
  const heatRows = DATA.distribution;
  const xs = polys.map(p => p.polygon);
  const ys = heatRows.map(r => r.girth_range);
  const z = ys.map(y => xs.map(x => heatRows.find(r => r.girth_range === y)?.[x] || 0));
  Plotly.newPlot('chartHeat', [{ x: xs, y: ys, z: z, type: 'heatmap', colorscale: 'YlGnBu' }], pltLay(''), pltCfg);

  // Violin plot
  const violinTraces = Array.from(polySet).map((code, i) => {
    const arr = DATA.points.filter(t => t.polygon === code).map(t => t.girth).filter(v => v != null && v !== 0);
    return { y: arr, type: 'violin', name: code, box: { visible: true }, meanline: { visible: true }, marker: { color: colors[i % colors.length] } };
  });
  Plotly.newPlot('chartViolin', violinTraces, pltLay(''), pltCfg);
}

/* ---------- advanced analytics ---------- */
function updateAdvancedCharts() {
  const polys = filteredPolygons();
  const activePoly = selectedPolygon ? [selectedPolygon] : (selectedSA ? DATA.superAreas.find(s => s.code === selectedSA)?.polygons || [] : []);
  const pts = activePoly.length
    ? DATA.points.filter(t => activePoly.includes(t.polygon))
    : filteredPoints(polys);
  const polyStats = DATA.polygons.filter(p => !isUserPolygonObj(p)).map(p => computePolyStats(p.polygon));

  // Treemap: area proportional — branchvalues:'remainder' is most reliable; parent values=0
  const tmLabels  = [t('all_areas')];
  const tmParents = [''];
  const tmValues  = [0];
  const tmCustom  = [t('all_polygons')];

  DATA.superAreas.forEach(sa => {
    tmLabels.push(sa.code);
    tmParents.push(t('all_areas'));
    tmValues.push(0);
    tmCustom.push(sa.code);
    sa.polygons.forEach(code => {
      const p = DATA.polygons.find(x => x.polygon === code);
      const st = computePolyStats(code);
      tmLabels.push(code);
      tmParents.push(sa.code);
      tmValues.push(parseFloat((p?.area_acres || 1).toFixed(4)));
      tmCustom.push(`${polygonDisplayName(p || {})} | ${st.totalTrees} ${t('trees')}`);
    });
  });

  Plotly.newPlot('chartTreemap', [{
    type: 'treemap',
    labels: tmLabels,
    parents: tmParents,
    values: tmValues,
    customdata: tmCustom,
    textinfo: 'label',
    hovertemplate: '<b>%{label}</b><br>%{customdata}<br>' + t('area_acres') + ': %{value:.2f}<extra></extra>',
    branchvalues: 'remainder',
    tiling: { packing: 'squarify' },
  }], Object.assign(pltLay(''), { margin: { t: 10, b: 10, l: 10, r: 10 } }), pltCfg);

  // CDF of girth
  const girths = pts.map(t => t.girth).filter(v => v != null).sort((a, b) => a - b);
  const cdfY = girths.map((_, i) => (i + 1) / girths.length);
  Plotly.newPlot('chartCDF', [{
    x: girths, y: cdfY, type: 'scatter', mode: 'lines',
    line: { color: '#2563eb', width: 2 }, name: 'CDF',
  }], pltLay('', { xaxis: { title: t('avg_girth') }, yaxis: { title: 'Cumulative' } }), pltCfg);

  // Size class stacked bars
  const sizeClasses = [
    { label: '0-100', min: 0, max: 100 },
    { label: '100-200', min: 100, max: 200 },
    { label: '200-300', min: 200, max: 300 },
    { label: '300-500', min: 300, max: 500 },
    { label: '500+', min: 500, max: Infinity },
  ];
  const codes = polys.map(p => p.polygon);
  const sizeTraces = sizeClasses.map(sc => ({
    x: codes,
    y: codes.map(code => DATA.points.filter(t => t.polygon === code && t.girth != null && t.girth >= sc.min && t.girth < sc.max).length),
    type: 'bar', name: sc.label,
  }));
  Plotly.newPlot('chartSizeClass', sizeTraces, Object.assign(pltLay(''), { barmode: 'stack' }), pltCfg);

  // Lorenz curve (girth concentration)
  if (girths.length > 1) {
    const total = girths.reduce((s, v) => s + v, 0);
    const lorenzX = [0];
    const lorenzY = [0];
    let cumul = 0;
    girths.forEach((v, i) => {
      cumul += v;
      lorenzX.push((i + 1) / girths.length);
      lorenzY.push(cumul / total);
    });
    // Gini coefficient
    const gini = 1 - 2 * lorenzY.reduce((s, v, i) => i === 0 ? s : s + (lorenzX[i] - lorenzX[i - 1]) * (lorenzY[i] + lorenzY[i - 1]) / 2, 0);
    Plotly.newPlot('chartLorenz', [
      { x: lorenzX, y: lorenzY, type: 'scatter', mode: 'lines', name: 'Lorenz', line: { color: '#dc2626', width: 2 } },
      { x: [0, 1], y: [0, 1], type: 'scatter', mode: 'lines', name: t('full_equality'), line: { color: '#94a3b8', dash: 'dash' } },
    ], pltLay('', { xaxis: { title: t('cumulative_tree_population_share') }, yaxis: { title: t('cumulative_girth_share') } }), pltCfg);
  }

  // Space type pie
  const typeTrees = {};
  DATA.polygons.filter(p => !isUserPolygonObj(p)).forEach(p => {
    const stype = englishizeValue(p.space_type || '', 'Other');
    const st = computePolyStats(p.polygon);
    typeTrees[stype] = (typeTrees[stype] || 0) + st.totalTrees;
  });
  Plotly.newPlot('chartSpaceType', [{
    labels: Object.keys(typeTrees), values: Object.values(typeTrees),
    type: 'pie', hole: 0.35, textinfo: 'label+percent+value',
  }], pltLay(''), pltCfg);

  // Correlation scatter: avg girth vs density per polygon
  Plotly.newPlot('chartCorrelation', [{
    x: polyStats.map(s => s.avgGirth), y: polyStats.map(s => s.density),
    text: polyStats.map(s => s.polygon), mode: 'markers+text', type: 'scatter',
    marker: { size: polyStats.map(s => Math.sqrt(s.totalTrees) * 3), color: polyStats.map(s => s.area), colorscale: 'Viridis', showscale: true, colorbar: { title: t('area') } },
    textposition: 'top center',
    hovertemplate: `${t('polygon')}: %{text}<br>${t('avg_girth')}: %{x:.1f}<br>${t('avg_density')}: %{y:.3f}<extra></extra>`,
  }], pltLay('', { xaxis: { title: t('avg_girth') }, yaxis: { title: `${t('avg_density')} (${t('trees')}/acre)` } }), pltCfg);

  // Spatial density heatmap (tree locations)
  Plotly.newPlot('chartSpatialDensity', [{
    x: pts.map(t => t.latlon[1]), y: pts.map(t => t.latlon[0]),
    type: 'histogram2d', colorscale: 'Hot', nbinsx: 40, nbinsy: 40, reversescale: true,
  }], pltLay('', { xaxis: { title: t('longitude') }, yaxis: { title: t('latitude') } }), pltCfg);

  // Girth vs Area bubble
  Plotly.newPlot('chartGirthVsArea', [{
    x: polyStats.map(s => s.area), y: polyStats.map(s => s.avgGirth),
    text: polyStats.map(s => `${s.polygon} (${s.totalTrees})`),
    mode: 'markers+text', type: 'scatter',
    marker: { size: polyStats.map(s => Math.max(s.totalTrees / 5, 8)), color: '#059669', opacity: 0.7 },
    textposition: 'top center',
  }], pltLay('', { xaxis: { title: `${t('area')} (acres)` }, yaxis: { title: t('avg_girth') } }), pltCfg);

  // Polygon profile: grouped bar - multiple metrics side by side
  const profileCodes = polys.map(p => p.polygon);
  Plotly.newPlot('chartPolygonProfile', [
    { x: profileCodes, y: polyStats.map(s => s.avgGirth || 0), type: 'bar', name: t('avg_girth'), marker: { color: '#2563eb' } },
    { x: profileCodes, y: polyStats.map(s => s.medianGirth || 0), type: 'bar', name: t('median_girth'), marker: { color: '#06b6d4' } },
    { x: profileCodes, y: polyStats.map(s => s.stdGirth || 0), type: 'bar', name: `${t('stdev')} Girth`, marker: { color: '#f59e0b' } },
    { x: profileCodes, y: polyStats.map(s => (s.avgHeight || 0) / 10), type: 'bar', name: `${t('avg_height')} /10`, marker: { color: '#8b5cf6' } },
  ], Object.assign(pltLay(''), { barmode: 'group' }), pltCfg);
}

/* ---------- groups ---------- */
function initGroupsUI() {
  const sel = document.getElementById('groupPolys');
  sel.innerHTML = '';
  DATA.polygons.filter(p => !EXCLUDED_POLYGON_CODES.has(String(p.polygon || '').toUpperCase()))
    .forEach(p => sel.add(new Option(`${p.polygon} - ${polygonDisplayName(p)}`, p.polygon)));
}

function saveGroup() {
  const name = document.getElementById('groupName').value.trim();
  const polys = Array.from(document.getElementById('groupPolys').selectedOptions).map(o => o.value);
  if (!name || !polys.length) return;
  GROUPS.push({ name, polys });
  renderGroups();
  updateGroupsChart();
}

function groupSummary(group) {
  const validPolys = group.polys.filter(code => !EXCLUDED_POLYGON_CODES.has(String(code || '').toUpperCase()));
  const pts = DATA.points.filter(t => validPolys.includes(t.polygon));
  const lns = DATA.lines.filter(l => validPolys.includes(l.polygon));
  const defSp = parseFloat(document.getElementById('defaultSpacing').value) || 8;
  const avenueTrees = lns.reduce((s, l) => {
    const sp = avenueSpacing[l.id] || defSp;
    return s + ((l.length && sp > 0) ? Math.round(l.length / sp) : 0);
  }, 0);
  const girths = pts.map(t => t.girth).filter(v => v != null);
  const heights = pts.map(t => normalizeHeight(t.height)).filter(v => v != null);
  return {
    name: group.name, polys: validPolys,
    trees: pts.length, avenueTrees, totalTrees: pts.length + avenueTrees,
    avenues: lns.length,
    avgGirth: mean(girths), medianGirth: median(girths), stdGirth: stddev(girths),
    minGirth: arrMin(girths), maxGirth: arrMax(girths),
    avgHeight: mean(heights), medianHeight: median(heights), stdHeight: stddev(heights),
    minHeight: arrMin(heights), maxHeight: arrMax(heights),
    totalArea: validPolys.reduce((s, code) => s + ((DATA.polygons.find(p => p.polygon === code)?.area_acres) || 0), 0),
    density: (() => {
      const area = validPolys.reduce((s, code) => s + ((DATA.polygons.find(p => p.polygon === code)?.area_acres) || 0), 0);
      return area > 0 ? (pts.length + avenueTrees) / area : 0;
    })(),
  };
}

function renderGroups() {
  const out = document.getElementById('groupsOut');
  out.innerHTML = GROUPS.map(g => {
    const s = groupSummary(g);
    return `<div class="card">
      <h5>${s.name}</h5>
      <div class="stat-row"><span class="stat-label">${t('polygons')}</span><span class="stat-value">${s.polys.join(', ')}</span></div>
      <div class="stat-row"><span class="stat-label">${t('trees')}</span><span class="stat-value">${s.trees} + ${s.avenueTrees} = ${s.totalTrees}</span></div>
      <div class="stat-row"><span class="stat-label">${t('avg_girth')}</span><span class="stat-value">${fmt(s.avgGirth)}</span></div>
      <div class="stat-row"><span class="stat-label">${t('median_girth')}</span><span class="stat-value">${fmt(s.medianGirth)}</span></div>
      <div class="stat-row"><span class="stat-label">${t('std_girth')}</span><span class="stat-value">${fmt(s.stdGirth)}</span></div>
      <div class="stat-row"><span class="stat-label">${t('min_girth')}/${t('max_girth')}</span><span class="stat-value">${fmt(s.minGirth)} – ${fmt(s.maxGirth)}</span></div>
      <div class="stat-row"><span class="stat-label">${t('avg_height')}</span><span class="stat-value">${fmt(s.avgHeight)}</span></div>
      <div class="stat-row"><span class="stat-label">${t('median_girth')}</span><span class="stat-value">${fmt(s.medianHeight)}</span></div>
      <div class="stat-row"><span class="stat-label">${t('std_height')}</span><span class="stat-value">${fmt(s.stdHeight)}</span></div>
      <div class="stat-row"><span class="stat-label">${t('min_height')}/${t('max_height')}</span><span class="stat-value">${fmt(s.minHeight)} – ${fmt(s.maxHeight)}</span></div>
      <div class="stat-row"><span class="stat-label">${t('area_acres')}</span><span class="stat-value">${fmt(s.totalArea)} acres</span></div>
      <div class="stat-row"><span class="stat-label">${t('avg_density')}</span><span class="stat-value">${fmt(s.density, 3)}</span></div>
    </div>`;
  }).join('');
}

function updateGroupsChart() {
  if (!GROUPS.length) { document.getElementById('chartGroups').innerHTML = ''; return; }
  const sums = GROUPS.map(groupSummary);
  Plotly.newPlot('chartGroups', [
    { x: sums.map(s => s.name), y: sums.map(s => s.trees), type: 'bar', name: t('mapped') },
    { x: sums.map(s => s.name), y: sums.map(s => s.avenueTrees), type: 'bar', name: t('estimated') },
  ], Object.assign(pltLay(t('trees_per_polygon')), { barmode: 'stack' }), pltCfg);
}

/* ---------- avenues ---------- */
function renderAvenues() {
  const def = parseFloat(document.getElementById('defaultSpacing').value) || 8;
  const rows = DATA.lines.map(l => {
    const sp = avenueSpacing[l.id] || def;
    const est = (l.length && sp > 0) ? Math.round(l.length / sp) : 0;
    return `<tr>
      <td>${l.id}</td><td>${l.polygon || ''}</td><td>${l.type || ''}</td>
      <td>${fmt(l.length)}</td><td>${fmt(l.avg_girth)}</td><td>${fmt(l.avg_height)}</td>
      <td><input type="number" step="0.5" value="${sp}" data-lineid="${l.id}" class="lineSpacing"></td>
      <td><b>${est}</b></td>
    </tr>`;
  }).join('');
  document.getElementById('avenueTable').innerHTML = `<table class="avenue-table">
    <thead><tr><th>#</th><th>${t('polygon')}</th><th>${t('space_type')}</th><th>${t('line_length')}</th><th>${t('avg_girth')}</th><th>${t('avg_height')}</th><th>${t('space_type')}</th><th>${t('trees')}</th></tr></thead>
    <tbody>${rows}</tbody></table>`;
  document.querySelectorAll('.lineSpacing').forEach(inp => {
    inp.addEventListener('change', e => {
      avenueSpacing[e.target.dataset.lineid] = parseFloat(e.target.value) || def;
      renderAvenues();
      updateAll();
    });
  });
}

/* ---------- CSV export ---------- */
function exportCSV() {
  const rows = [['Polygon', 'Name_HE', 'Name_EN', 'SpaceCode', 'SpaceType', 'Area_acres', 'Trees_Mapped', 'Trees_Avenue', 'Trees_Total', 'Avg_Girth', 'Median_Girth', 'Std_Girth', 'Min_Girth', 'Max_Girth', 'Avg_Height', 'Median_Height', 'Std_Height', 'Min_Height', 'Max_Height', 'Density']];
  DATA.polygons.forEach(p => {
    const s = computePolyStats(p.polygon);
    rows.push([s.polygon, s.name_he, s.name_en, s.space_code, s.space_type, s.area, s.treeCount, s.avenueTrees, s.totalTrees, fmt(s.avgGirth), fmt(s.medianGirth), fmt(s.stdGirth), fmt(s.minGirth), fmt(s.maxGirth), fmt(s.avgHeight), fmt(s.medianHeight), fmt(s.stdHeight), fmt(s.minHeight), fmt(s.maxHeight), fmt(s.density, 4)]);
  });
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'shikmim_data.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------- comparison tab ---------- */
function populateCmpSelect(typeSelId, valSelId) {
  const type = document.getElementById(typeSelId).value;
  const sel = document.getElementById(valSelId);
  sel.innerHTML = '';
  if (type === 'poly') {
    DATA.polygons.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.polygon;
      opt.textContent = `${p.polygon} – ${polygonDisplayName(p)}`;
      sel.appendChild(opt);
    });
  } else if (type === 'group') {
    GROUPS.forEach((g, i) => {
      const opt = document.createElement('option');
      opt.value = String(i);
      opt.textContent = g.name;
      sel.appendChild(opt);
    });
  } else if (type === 'sa') {
    DATA.superAreas.forEach(sa => {
      const opt = document.createElement('option');
      opt.value = sa.code;
      opt.textContent = `${sa.code} – ${superAreaDisplayName(sa)}`;
      sel.appendChild(opt);
    });
  }
}

function applyCmpFilters() {
  const spaceType = document.getElementById('cmpFilterSpaceType').value;
  const saCode = document.getElementById('cmpFilterSA').value;
  ['A', 'B'].forEach(side => {
    const typeSel = document.getElementById('cmpType' + side);
    const valSel = document.getElementById('cmpSel' + side);
    if (typeSel.value !== 'poly') return;
    valSel.innerHTML = '';
    DATA.polygons.forEach(p => {
      if (spaceType && p.space_type !== spaceType) return;
      if (saCode && p.space_code !== saCode) return;
      const opt = document.createElement('option');
      opt.value = p.polygon;
      opt.textContent = `${p.polygon} – ${polygonDisplayName(p)}`;
      valSel.appendChild(opt);
    });
  });
}

function getUnitStats(type, key) {
  if (type === 'poly') {
    const s = computePolyStats(key);
    return {
      label: `${s.polygon} - ${englishizeValue(s.name_en || s.name_he || s.polygon, s.polygon)}`,
      polyCodes: [key],
      treeCount: s.treeCount, avenueTrees: s.avenueTrees, totalTrees: s.totalTrees,
      avgGirth: s.avgGirth, medianGirth: s.medianGirth, stdGirth: s.stdGirth,
      minGirth: s.minGirth, maxGirth: s.maxGirth,
      avgHeight: s.avgHeight, medianHeight: s.medianHeight, stdHeight: s.stdHeight,
      minHeight: s.minHeight, maxHeight: s.maxHeight,
      area: s.area, density: s.density,
      avenueCount: s.avenueCount, totalLineLength: s.totalLineLength,
    };
  } else if (type === 'group') {
    const g = GROUPS[parseInt(key)];
    if (!g) return null;
    const s = groupSummary(g);
    return {
      label: s.name,
      polyCodes: g.polys,
      treeCount: s.trees, avenueTrees: s.avenueTrees, totalTrees: s.totalTrees,
      avgGirth: s.avgGirth, medianGirth: s.medianGirth, stdGirth: s.stdGirth,
      minGirth: s.minGirth, maxGirth: s.maxGirth,
      avgHeight: s.avgHeight, medianHeight: s.medianHeight, stdHeight: s.stdHeight,
      minHeight: s.minHeight, maxHeight: s.maxHeight,
      area: s.totalArea, density: s.density,
      avenueCount: s.avenues, totalLineLength: null,
    };
  } else if (type === 'sa') {
    const sa = DATA.superAreas.find(s => s.code === key);
    if (!sa) return null;
    const s = computeSAStats(sa);
    return {
      label: `${s.code} - ${englishizeValue(s.name_en || s.name_he || s.code, s.code)}`,
      polyCodes: sa.polygons,
      treeCount: s.treeCount, avenueTrees: s.avenueTrees, totalTrees: s.totalTrees,
      avgGirth: s.avgGirth, medianGirth: s.medianGirth, stdGirth: s.stdGirth,
      minGirth: s.minGirth, maxGirth: s.maxGirth,
      avgHeight: s.avgHeight, medianHeight: s.medianHeight, stdHeight: s.stdHeight,
      minHeight: s.minHeight, maxHeight: s.maxHeight,
      area: s.totalArea, density: s.density,
      avenueCount: s.avenueCount, totalLineLength: null,
    };
  }
  return null;
}

function getUnitPoints(polyCodes) {
  const set = new Set(polyCodes);
  const pts = [];
  set.forEach(code => {
    getPointsForPolygonCode(code).forEach(p => pts.push(p));
  });
  return pts;
}

function runComparison() {
  const typeA = document.getElementById('cmpTypeA').value;
  const keyA = document.getElementById('cmpSelA').value;
  const typeB = document.getElementById('cmpTypeB').value;
  const keyB = document.getElementById('cmpSelB').value;
  if (!keyA || !keyB) return;

  const a = getUnitStats(typeA, keyA);
  const b = getUnitStats(typeB, keyB);
  if (!a || !b) return;

  const ptsA = getUnitPoints(a.polyCodes);
  const ptsB = getUnitPoints(b.polyCodes);
  const girthsA = ptsA.map(t => t.girth).filter(v => v != null && !isNaN(v));
  const girthsB = ptsB.map(t => t.girth).filter(v => v != null && !isNaN(v));
  const heightsA = ptsA.map(t => t.height).filter(v => v != null && !isNaN(v));
  const heightsB = ptsB.map(t => t.height).filter(v => v != null && !isNaN(v));

  // Comparison metrics table
  const metrics = [
    { name: t('mapped_trees'), a: a.treeCount, b: b.treeCount, higher: 'better' },
    { name: t('avenue_trees'), a: a.avenueTrees, b: b.avenueTrees, higher: 'better' },
    { name: t('total_trees'), a: a.totalTrees, b: b.totalTrees, higher: 'better' },
    { name: t('area_acres'), a: a.area, b: b.area, fmt: 2 },
    { name: t('avg_density'), a: a.density, b: b.density, fmt: 3 },
    { name: t('avg_girth'), a: a.avgGirth, b: b.avgGirth },
    { name: t('median_girth'), a: a.medianGirth, b: b.medianGirth },
    { name: t('std_girth'), a: a.stdGirth, b: b.stdGirth },
    { name: t('range') + ' ' + t('avg_girth'), a: a.minGirth != null && a.maxGirth != null ? `${fmt(a.minGirth)} – ${fmt(a.maxGirth)}` : '-',
                          b: b.minGirth != null && b.maxGirth != null ? `${fmt(b.minGirth)} – ${fmt(b.maxGirth)}` : '-', noNum: true },
    { name: t('avg_height'), a: a.avgHeight, b: b.avgHeight },
    { name: t('median_girth') + ' ' + t('height_stats'), a: a.medianHeight, b: b.medianHeight },
    { name: t('std_height'), a: a.stdHeight, b: b.stdHeight },
    { name: t('range') + ' ' + t('height_stats'), a: a.minHeight != null && a.maxHeight != null ? `${fmt(a.minHeight)} – ${fmt(a.maxHeight)}` : '-',
                          b: b.minHeight != null && b.maxHeight != null ? `${fmt(b.minHeight)} – ${fmt(b.maxHeight)}` : '-', noNum: true },
    { name: t('avenues_tab'), a: a.avenueCount, b: b.avenueCount },
  ];

  let tableHtml = `<div class="cmp-summary">
    <div class="cmp-summary-card side-a"><h5>${a.label}</h5><div class="big-num">${a.totalTrees}</div><div class="small">${t('total_trees')}</div></div>
    <div class="cmp-summary-card side-b"><h5>${b.label}</h5><div class="big-num">${b.totalTrees}</div><div class="small">${t('total_trees')}</div></div>
  </div>`;
  tableHtml += `<table class="cmp-table"><thead><tr><th>${t('compare')}</th><th class="highlight-a">${a.label}</th><th class="highlight-b">${b.label}</th><th>${t('range')}</th></tr></thead><tbody>`;
  metrics.forEach(m => {
    let vA, vB, delta;
    if (m.noNum) {
      vA = m.a; vB = m.b; delta = '';
    } else {
      const d = m.fmt || 1;
      vA = fmt(m.a, d);
      vB = fmt(m.b, d);
      if (m.a != null && m.b != null) {
        const diff = m.a - m.b;
        const pct = m.b !== 0 ? ((diff / Math.abs(m.b)) * 100) : 0;
        delta = `<span class="cmp-delta">${diff >= 0 ? '+' : ''}${fmt(diff, d)} (${pct >= 0 ? '+' : ''}${fmt(pct, 1)}%)</span>`;
      } else {
        delta = '';
      }
    }
    tableHtml += `<tr><td class="metric-name">${m.name}</td><td>${vA}</td><td>${vB}</td><td>${delta}</td></tr>`;
  });
  tableHtml += `</tbody></table>`;
  document.getElementById('cmpResult').innerHTML = tableHtml;

  // Chart colors
  const colA = '#3b82f6', colB = '#7c3aed';

  // 1. Grouped bar chart — key metrics
  const barMetrics = ['totalTrees', 'avgGirth', 'medianGirth', 'stdGirth', 'avgHeight', 'density'];
  const barNames = [t('total_trees'), t('avg_girth'), t('median_girth'), t('std_girth'), t('avg_height'), t('avg_density')];
  Plotly.newPlot('cmpChartBar', [
    { x: barNames, y: barMetrics.map(k => a[k] || 0), type: 'bar', name: a.label, marker: { color: colA } },
    { x: barNames, y: barMetrics.map(k => b[k] || 0), type: 'bar', name: b.label, marker: { color: colB } },
  ], pltLay(t('compare'), { barmode: 'group' }), pltCfg);

  // 2. Radar chart — normalized comparison
  const radarKeys = ['totalTrees', 'avgGirth', 'medianGirth', 'avgHeight', 'area', 'density'];
  const radarLabels = [t('total_trees'), t('avg_girth'), t('median_girth'), t('avg_height'), t('area_acres'), t('avg_density')];
  const maxVals = radarKeys.map(k => Math.max(Math.abs(a[k] || 0), Math.abs(b[k] || 0)) || 1);
  Plotly.newPlot('cmpChartRadar', [
    { type: 'scatterpolar', r: radarKeys.map((k, i) => ((a[k] || 0) / maxVals[i]) * 100).concat([(a[radarKeys[0]] || 0) / maxVals[0] * 100]),
      theta: radarLabels.concat([radarLabels[0]]), fill: 'toself', name: a.label, line: { color: colA }, opacity: 0.7 },
    { type: 'scatterpolar', r: radarKeys.map((k, i) => ((b[k] || 0) / maxVals[i]) * 100).concat([(b[radarKeys[0]] || 0) / maxVals[0] * 100]),
      theta: radarLabels.concat([radarLabels[0]]), fill: 'toself', name: b.label, line: { color: colB }, opacity: 0.7 },
  ], pltLay(t('compare'), { polar: { radialaxis: { visible: true, range: [0, 105] } } }), pltCfg);

  // 3. Box plots — girth + height side by side
  Plotly.newPlot('cmpChartBox', [
    { y: girthsA, type: 'box', name: t('girth_vs_height') + ' – ' + a.label, marker: { color: colA }, boxmean: 'sd' },
    { y: girthsB, type: 'box', name: t('girth_vs_height') + ' – ' + b.label, marker: { color: colB }, boxmean: 'sd' },
    { y: heightsA, type: 'box', name: t('height_stats') + ' – ' + a.label, marker: { color: colA }, boxmean: 'sd', opacity: 0.6 },
    { y: heightsB, type: 'box', name: t('height_stats') + ' – ' + b.label, marker: { color: colB }, boxmean: 'sd', opacity: 0.6 },
  ], pltLay(t('girth_distribution')), pltCfg);

  // 4. Overlapping histograms — girth distribution
  Plotly.newPlot('cmpChartHist', [
    { x: girthsA, type: 'histogram', name: a.label, marker: { color: colA }, opacity: 0.6, nbinsx: 20 },
    { x: girthsB, type: 'histogram', name: b.label, marker: { color: colB }, opacity: 0.6, nbinsx: 20 },
  ], pltLay(t('girth_distribution') + ' – ' + t('compare'), { barmode: 'overlay', xaxis: { title: t('avg_girth') }, yaxis: { title: t('trees') } }), pltCfg);

  // 5. Scatter plot — girth vs height for both sides
  const pairsA = ptsA.filter(t => t.girth != null && !isNaN(t.girth) && t.height != null && !isNaN(t.height));
  const pairsB = ptsB.filter(t => t.girth != null && !isNaN(t.girth) && t.height != null && !isNaN(t.height));
  Plotly.newPlot('cmpChartScatter', [
    { x: pairsA.map(t => t.girth), y: pairsA.map(t => t.height),
      mode: 'markers', name: a.label, marker: { color: colA, size: 5, opacity: 0.5 }, type: 'scatter' },
    { x: pairsB.map(t => t.girth), y: pairsB.map(t => t.height),
      mode: 'markers', name: b.label, marker: { color: colB, size: 5, opacity: 0.5 }, type: 'scatter' },
  ], pltLay(t('girth_vs_height') + ' – ' + t('compare'), { xaxis: { title: t('avg_girth') }, yaxis: { title: t('avg_height') } }), pltCfg);
}

function initCompareUI() {
  populateCmpSelect('cmpTypeA', 'cmpSelA');
  populateCmpSelect('cmpTypeB', 'cmpSelB');

  // populate filter dropdowns
  const stSel = document.getElementById('cmpFilterSpaceType');
  const types = [...new Set(DATA.polygons.map(p => p.space_type).filter(Boolean))];
  types.forEach(t => { const o = document.createElement('option'); o.value = t; o.textContent = t; stSel.appendChild(o); });

  const saSel = document.getElementById('cmpFilterSA');
  DATA.superAreas.forEach(sa => { const o = document.createElement('option'); o.value = sa.code; o.textContent = sa.code; saSel.appendChild(o); });

  document.getElementById('cmpTypeA').addEventListener('change', () => populateCmpSelect('cmpTypeA', 'cmpSelA'));
  document.getElementById('cmpTypeB').addEventListener('change', () => populateCmpSelect('cmpTypeB', 'cmpSelB'));
  document.getElementById('cmpFilterSpaceType').addEventListener('change', applyCmpFilters);
  document.getElementById('cmpFilterSA').addEventListener('change', applyCmpFilters);
  document.getElementById('btnCompare').addEventListener('click', runComparison);
}

/* ---------- master update ---------- */
function updateAll() {
  _polyStatsCache = {};
  _saStatsCache = {};
  drawMap();
  updateKPIs();
  renderPolyList();
  renderSAList();
  renderSADetail();
  updateOverviewCharts();
  updateCharts();
  updateAdvancedCharts();
  updateSACharts();
  updateGroupsChart();
  if (typeof renderSpaceTypeCompare === 'function') renderSpaceTypeCompare();
}

function configureUpdateUI() {
  const btn = document.getElementById('btnUpdateSheets');
  const note = document.getElementById('hostingModeNote');
  if (!btn || !note) return;

  if (isLocalHost) {
    note.textContent = t('hosted_locally');
    return;
  }

  btn.disabled = true;
  btn.title = 'GitHub Pages';
  note.textContent = t('github_pages_note');
}

/* ---------- update from sheets ---------- */
async function updateFromSheets() {
  const btn = document.getElementById('btnUpdateSheets');
  const status = document.getElementById('updateStatus');

  if (!isLocalHost) {
    status.textContent = t('github_pages_note');
    status.style.color = 'var(--warn)';
    return;
  }

  btn.disabled = true;
  status.textContent = t('updating');
  status.style.color = 'var(--warn)';
  
  try {
    const resp = await fetch('/api/update');
    if (!resp.ok) throw new Error(t('server_unavailable'));
    const result = await resp.json();
    
    if (result.success) {
      // Reload data.json
      const resp2 = await fetch('data.json?t=' + Date.now());
      DATA = await resp2.json();
      normalizeDataForEnglishUI();
      buildSuperAreas();
      _polyStatsCache = {};
      _saStatsCache = {};
      // Reset space filter so it regenerates with updated space list
      const stcList = document.getElementById('stcSpaceCheckList');
      if (stcList) stcList.innerHTML = '';
      updateAll();
      
      status.textContent = '✓ ' + t('success_update') + ' ' + (DATA.lastUpdated ? new Date(DATA.lastUpdated).toLocaleString('en-US') : '');
      status.style.color = 'var(--accent)';
    } else {
      throw new Error(result.error || 'Update failed');
    }
  } catch (err) {
    status.textContent = '✗ ' + t('error_loading') + err.message;
    status.style.color = 'var(--danger)';
    console.error(err);
  } finally {
    btn.disabled = false;
    setTimeout(() => { status.textContent = ''; }, 5000);
  }
}

/* ---------- init ---------- */
function init() {
  setBase('osm');
  initGroupsUI();
  initCompareUI();
  configureUpdateUI();
  initChartHeaders();
  retranslateUI();
  const appRoot = document.getElementById('app');
  if (appRoot) appRoot.style.visibility = 'visible';
  renderAvenues();
  updateAll();
  fitToData();

  // Float panel collapse toggle
  document.getElementById('btnFloatToggle').onclick = function() {
    const body = document.getElementById('floatBody');
    const isCollapsed = body.classList.toggle('collapsed');
    this.textContent = isCollapsed ? '▼' : '▲';
    this.setAttribute('aria-expanded', String(!isCollapsed));
  };

  // Tab switching
  Array.from(document.querySelectorAll('.tabbtn')).forEach(btn => btn.onclick = () => {
    document.querySelectorAll('.tabbtn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
    // Re-render charts when tab becomes visible (Plotly needs visible containers)
    const tabId = btn.dataset.tab;
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      if (tabId === 'advanced') updateAdvancedCharts();
      if (tabId === 'analytics') updateCharts();
      if (tabId === 'superareas') updateSACharts();
    }, 60);
  });

  // Map controls
  document.getElementById('basemapSel').addEventListener('change', e => setBase(e.target.value));
  ['chkPolys', 'chkTrees', 'chkLines', 'chkLabels'].forEach(id => document.getElementById(id).addEventListener('change', drawMap));
  document.getElementById('btnShowAll').onclick = () => {
    ['chkPolys', 'chkTrees', 'chkLines', 'chkLabels'].forEach(id => document.getElementById(id).checked = true);
    drawMap();
  };
  document.getElementById('btnFit').onclick = fitToData;
  document.getElementById('btnClearSel').onclick = () => { selectedPolygon = null; selectedSA = null; updateAll(); };
  document.getElementById('searchPoly').addEventListener('input', () => { selectedPolygon = null; selectedSA = null; updateAll(); });
  document.getElementById('btnSaveGroup').onclick = saveGroup;
  document.getElementById('btnApplySpacing').onclick = () => { renderAvenues(); updateAll(); };
  document.getElementById('btnExportCSV').onclick = exportCSV;
  const updateBtn = document.getElementById('btnUpdateSheets');
  if (updateBtn) updateBtn.onclick = updateFromSheets;
  const startDrawBtn = document.getElementById('btnStartDrawPoly');
  const finishDrawBtn = document.getElementById('btnFinishDrawPoly');
  const cancelDrawBtn = document.getElementById('btnCancelDrawPoly');
  if (startDrawBtn) startDrawBtn.onclick = startPolygonDraw;
  if (finishDrawBtn) finishDrawBtn.onclick = finishPolygonDraw;
  if (cancelDrawBtn) cancelDrawBtn.onclick = cancelPolygonDraw;
  map.on('click', e => {
    if (!isDrawingPolygon) return;
    drawingPoints.push([e.latlng.lat, e.latlng.lng]);
    refreshDrawPreview();
  });
  updateDrawButtons();

  // Outside trees toggle
  document.getElementById('btnToggleOutsideTrees').textContent =
    showOutsideTrees ? t('remove_outside_trees') : t('add_outside_trees');
  document.getElementById('btnToggleOutsideTrees').onclick = () => {
    showOutsideTrees = !showOutsideTrees;
    document.getElementById('btnToggleOutsideTrees').textContent =
      showOutsideTrees ? t('remove_outside_trees') : t('add_outside_trees');
    drawMap();
  };

  const toggleEllipsesBtn = document.getElementById('btnToggleSpaceEllipses');
  if (toggleEllipsesBtn) {
    setSpaceEllipseButtonText();
    toggleEllipsesBtn.onclick = () => {
      showSpaceEllipses = !showSpaceEllipses;
      setSpaceEllipseButtonText();
      drawMap();
    };
  }
}

function retranslateUI() {
  const doc = document.documentElement;
  doc.lang = 'en';
  doc.dir = 'ltr';

  const langBtn = document.getElementById('btnToggleLang');
  if (langBtn) langBtn.remove();

  // Update header
  document.querySelector('header span:first-child').textContent = 'Research Dashboard - Sycamores, Polygons & Super-areas';
  // Float panel heading
  document.getElementById('floatTitle').textContent = t('layers_maps');
  const floatToggle = document.getElementById('btnFloatToggle');
  if (floatToggle) floatToggle.title = 'Collapse / Expand';

  const basemapSel = document.getElementById('basemapSel');
  if (basemapSel) {
    const groups = basemapSel.querySelectorAll('optgroup');
    if (groups[0]) groups[0].label = 'Base maps';
    if (groups[1]) groups[1].label = 'Palestine Open Maps';
    if (groups[2]) groups[2].label = 'Combinations';
    const optionMap = {
      osm: 'Modern OSM',
      sat: 'Satellite (Esri)',
      pal20k: 'POM 1:20k (1940s)',
      'pal-1940s': 'POM Combined (1940s)',
      pal100k: 'POM 1:100k (1950s)',
      pal250k: 'POM 1:250k (1946)',
      pal63k: 'POM 1:63k PEF (1880)',
      isr250k: 'Israel 1:250k (1951)',
      'osm+pal20k': 'OSM + POM 1:20k',
      'osm+pal-1940s': 'OSM + POM 1940s',
      'osm+pal100k': 'OSM + POM 1:100k',
      'osm+pal250k': 'OSM + POM 1:250k',
      'osm+pal63k': 'OSM + POM 1:63k PEF',
      'osm+isr250k': 'OSM + Israel 1:250k',
    };
    Array.from(basemapSel.options).forEach(opt => {
      if (optionMap[opt.value]) opt.textContent = optionMap[opt.value];
    });
  }

  const chkPolysSpan = document.getElementById('chkPolysSpan');
  const chkTreesSpan = document.getElementById('chkTreesSpan');
  const chkLinesSpan = document.getElementById('chkLinesSpan');
  const chkLabelsSpan = document.getElementById('chkLabelsSpan');
  if (chkPolysSpan) chkPolysSpan.textContent = t('polygons');
  if (chkTreesSpan) chkTreesSpan.textContent = t('trees');
  if (chkLinesSpan) chkLinesSpan.textContent = t('avenues');
  if (chkLabelsSpan) chkLabelsSpan.textContent = 'Labels';

  // Buttons and inputs
  document.getElementById('btnShowAll').textContent = t('show_all');
  document.getElementById('btnFit').textContent = t('zoom_fit');
  document.getElementById('searchPoly').placeholder = t('search_polygon');
  document.getElementById('btnClearSel').textContent = t('clear_selection');
  document.getElementById('btnExportCSV').textContent = t('export_csv');
  document.getElementById('btnUpdateSheets').textContent = t('update_data');
  const startDrawBtn = document.getElementById('btnStartDrawPoly');
  const finishDrawBtn = document.getElementById('btnFinishDrawPoly');
  const cancelDrawBtn = document.getElementById('btnCancelDrawPoly');
  if (startDrawBtn) startDrawBtn.textContent = t('start_draw_polygon');
  if (finishDrawBtn) finishDrawBtn.textContent = t('finish_draw_polygon');
  if (cancelDrawBtn) cancelDrawBtn.textContent = t('cancel_draw_polygon');
  const btnToggleOutsideTrees = document.getElementById('btnToggleOutsideTrees');
  if (btnToggleOutsideTrees) btnToggleOutsideTrees.textContent = showOutsideTrees ? t('remove_outside_trees') : t('add_outside_trees');
  setSpaceEllipseButtonText();
  document.querySelectorAll('.float .small.mt8').forEach(el => {
    if (String(el.textContent || '').includes('EPSG')) el.textContent = t('coordinates');
  });
  // Tabs
  const tabKeyMap = ['overview', 'polygons_tab', 'super_areas_tab', 'analytics', 'advanced', 'groups', 'compare', 'avenues_tab', 'space_type_compare_tab'];
  document.querySelectorAll('.tabbtn').forEach((btn, i) => btn.textContent = t(tabKeyMap[i]));
  // KPI labels
  const kpiKeyMap = ['trees', 'polygons', 'avenues', 'avg_girth', 'avg_height', 'total_area', 'median_girth', 'super_areas', 'avg_density'];
  document.querySelectorAll('.kpi .label').forEach((el, i) => el.textContent = t(kpiKeyMap[i]));

  const cmpTypeA = document.getElementById('cmpTypeA');
  const cmpTypeB = document.getElementById('cmpTypeB');
  [cmpTypeA, cmpTypeB].forEach(sel => {
    if (!sel) return;
    Array.from(sel.options).forEach(opt => {
      if (opt.value === 'poly') opt.textContent = t('polygon');
      if (opt.value === 'group') opt.textContent = t('group');
      if (opt.value === 'sa') opt.textContent = t('super_area');
    });
  });

  const labelSideA = document.getElementById('labelSideA');
  const labelSideB = document.getElementById('labelSideB');
  const filterSpaceTypeLabel = document.getElementById('filterSpaceTypeLabel');
  const filterSALabel = document.getElementById('filterSALabel');
  const defaultSpacingLabel = document.getElementById('defaultSpacingLabel');
  const avenuesDesc = document.getElementById('avenuesDesc');
  const compareDesc = document.getElementById('compareDesc');
  const groupsDesc = document.getElementById('groupsDesc');
  const advancedDesc = document.getElementById('advancedDesc');
  const btnApplySpacing = document.getElementById('btnApplySpacing');
  if (labelSideA) labelSideA.textContent = t('side_a');
  if (labelSideB) labelSideB.textContent = t('side_b');
  if (filterSpaceTypeLabel) filterSpaceTypeLabel.textContent = t('filter_space_type');
  if (filterSALabel) filterSALabel.textContent = t('filter_sa');
  if (defaultSpacingLabel) defaultSpacingLabel.textContent = 'Default spacing (m)';
  if (avenuesDesc) avenuesDesc.textContent = t('avenue_def');
  if (compareDesc) compareDesc.textContent = t('choose_units');
  if (groupsDesc) groupsDesc.textContent = 'Create named polygon groups and compare them. Values update dynamically with avenue-tree estimates.';
  if (advancedDesc) advancedDesc.textContent = 'Advanced analytics: CDF, Lorenz, correlations, and spatial patterns.';
  if (btnApplySpacing) btnApplySpacing.textContent = 'Apply spacing';

  const stcTitle = document.getElementById('stcTitle');
  const stcModeByType = document.getElementById('stcModeByType');
  const stcModeBySpace = document.getElementById('stcModeBySpace');
  const stcTypeFilter = document.getElementById('stcTypeFilter');
  const stcSpaceMultiBtn = document.getElementById('stcSpaceMultiBtn');
  const stcSpaceCheckAllLabel = document.querySelector('label[for="stcSpaceCheckAll"], .stc-multisel-item strong');
  if (stcTitle) stcTitle.textContent = 'Space Comparison';
  if (stcModeByType) stcModeByType.textContent = 'By Space Type';
  if (stcModeBySpace) stcModeBySpace.textContent = 'By Space';
  if (stcTypeFilter && stcTypeFilter.options.length) stcTypeFilter.options[0].textContent = 'All space types';
  if (stcSpaceMultiBtn) stcSpaceMultiBtn.textContent = 'All spaces ▾';
  if (stcSpaceCheckAllLabel) stcSpaceCheckAllLabel.textContent = 'All spaces';

  const cmpFilterSpaceType = document.getElementById('cmpFilterSpaceType');
  const cmpFilterSA = document.getElementById('cmpFilterSA');
  if (cmpFilterSpaceType && cmpFilterSpaceType.options.length) cmpFilterSpaceType.options[0].textContent = t('all');
  if (cmpFilterSA && cmpFilterSA.options.length) cmpFilterSA.options[0].textContent = t('all');

  const groupName = document.getElementById('groupName');
  const btnSaveGroup = document.getElementById('btnSaveGroup');
  const btnCompare = document.getElementById('btnCompare');
  if (groupName) groupName.placeholder = t('group_name');
  if (btnSaveGroup) btnSaveGroup.textContent = t('save_group');
  if (btnCompare) btnCompare.textContent = t('compare_btn');
  // Basemap selector label
  const basemapLabel = document.querySelector('label[for="basemapSel"]');
  if (basemapLabel) basemapLabel.textContent = t('layers_maps');
  // Other labels and descriptive text
  const descOverview = document.querySelector('.tab[id="overview"] .card p');
  if (descOverview) descOverview.textContent = t('no_data');
  const polygonsDesc = document.querySelector('#polygons .small.mb8');
  if (polygonsDesc) polygonsDesc.textContent = t('click_polygon');
  const superAreasDesc = document.querySelector('#superareas .small.mb8');
  if (superAreasDesc) superAreasDesc.textContent = t('super_area_advanced');
  // Chart titles and info buttons
  refreshChartTitles();
}

/* ---------- launch ---------- */
loadData();
