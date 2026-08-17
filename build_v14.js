const fs = require('fs');

const srcHtml = fs.readFileSync('shikmim_research_dashboard_v14.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const dataJson = fs.readFileSync('data.json', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');

let html = srcHtml;

html = html.replace(/Shikmim Research Dashboard v13/g, 'Shikmim Research Dashboard v14');
html = html.replace(/\(v13\)/g, '(v14)');

// Remove language-toggle button for the English-only release.
html = html.replace(/\s*<button id="btnToggleLang"[\s\S]*?<\/button>\s*/g, '\n');

// Force static first paint to English (before JS runs).
const staticReplacements = [
  ['דשבורד מחקרי &mdash; שקמים, פוליגונים ומרחבים', 'Research Dashboard &mdash; Sycamores, Polygons & Super-areas'],
  ['טוען נתונים...', 'Loading data...'],
  ['שכבות ומפה', 'Layers & Map'],
  ['קפל / פתח', 'Collapse / Expand'],
  ['מפות בסיס', 'Base maps'],
  ['OSM מודרני', 'Modern OSM'],
  ['לוויין (Esri)', 'Satellite (Esri)'],
  ['POM משולב (1940s)', 'POM Combined (1940s)'],
  ['ישראל 1:250k (1951)', 'Israel 1:250k (1951)'],
  ['שילובים', 'Combinations'],
  ['OSM + ישראל 1:250k', 'OSM + Israel 1:250k'],
  ['הצג הכל', 'Show All'],
  ['זום לנתונים', 'Zoom to Fit'],
  ['חפש פוליגון / שם...', 'Search polygon / name...'],
  ['נקה בחירה', 'Clear Selection'],
  ['ייצוא CSV', 'Export CSV'],
  ['עדכון נתונים', 'Update Data'],
  ['הוסף עצים מחוץ לפוליגונים', 'Add outside-polygon trees'],
  ['התחל ציור פוליגון', 'Start Polygon Draw'],
  ['סיום ציור', 'Finish Draw'],
  ['ביטול ציור', 'Cancel Draw'],
  ['קואורדינטות EPSG:3857 → WGS84', 'Coordinates EPSG:3857 → WGS84'],
  ['סקירה', 'Overview'],
  ['פוליגונים', 'Polygons'],
  ['מרחבים', 'Super-areas'],
  ['הדמיות', 'Analytics'],
  ['ניתוח מתקדם', 'Advanced Analysis'],
  ['קבוצות', 'Groups'],
  ['השוואה', 'Compare'],
  ['השוואת מרחבים', 'Space Comparison'],
  ['עצים', 'Trees'],
  ['שדרות', 'Avenues'],
  ['ממוצע היקף', 'Avg Girth'],
  ['ממוצע גובה', 'Avg Height'],
  ['שטח כולל (acres)', 'Total Area (acres)'],
  ['חציון היקף', 'Median Girth'],
  ['צפיפות ממוצעת', 'Avg Density'],
  ['לחצו על פוליגון לצפייה מפורטת ולמיקוד על המפה', 'Click on a polygon for details and zoom'],
  ['הצג אליפסות מרחב', 'Show space ellipses'],
  ['מרחבים (מקובצים לפי space_code / טור E). לחצו לפירוט.', 'Super-areas (grouped by space_code). Click for details.'],
  ['ניתוח מתקדם: CDF, Lorenz, מתאמים, שכנות מרחבית ועוד', 'Advanced analytics: CDF, Lorenz, correlations, and spatial patterns.'],
  ['אפשר לאחד פוליגונים לקבוצות עם שם, ולהשוות בין הקבוצות. הנתונים משתנים דינמית עם עצי שדרה.', 'Create named polygon groups and compare them. Values update dynamically with avenue-tree estimates.'],
  ['שם קבוצה', 'Group Name'],
  ['שמור קבוצה', 'Save Group'],
  ['בחרו שתי יחידות להשוואה: פוליגון, קבוצה או מרחב. ניתן גם לסנן לפי מאפיינים.', 'Choose two units to compare: polygon, group, or super-area. Filter by attributes too.'],
  ['צד או', 'Side A'],
  ['צד בו', 'Side B'],
  ['סינון לפי סוג שטח:', 'Filter by space type:'],
  ['סינון לפי מרחב:', 'Filter by super-area:'],
  ['הגדרת מרווח שתילה &rarr; אומדן עצים בשדרות &rarr; עדכון נתוני הפוליגון/קבוצה/מרחב.', 'Set planting spacing &rarr; Estimate avenue trees &rarr; Update polygon/group/super-area data.'],
  ['מרווח ברירת מחדל (מ\')', 'Default spacing (m)'],
  ['החל מרווח', 'Apply spacing'],
  ['לפי סוג שטח', 'By Space Type'],
  ['לפי מרחב', 'By Space'],
  ['כל סוגי השטחים', 'All space types'],
  ['כל המרחבים ▾', 'All spaces ▾'],
  ['כל המרחבים', 'All spaces']
];

for (const [from, to] of staticReplacements) {
  html = html.split(from).join(to);
}

if (/<style>[\s\S]*?<\/style>/.test(html)) {
  html = html.replace(/<style>[\s\S]*?<\/style>/, `<style>\n${css}\n#app{visibility:hidden}\n</style>`);
}

if (/<script id="_dataInline"[\s\S]*?<\/script>\s*<script>[\s\S]*?<\/script>/.test(html)) {
  html = html.replace(
    /<script id="_dataInline"[\s\S]*?<\/script>\s*<script>[\s\S]*?<\/script>/,
    `<script id="_dataInline" type="application/json">\n${dataJson}\n</script>\n<script>\n${appJs}\n</script>`
  );
} else if (/<script[^>]+src=["']app\.js["'][^>]*><\/script>/.test(html)) {
  html = html.replace(
    /<script[^>]+src=["']app\.js["'][^>]*><\/script>/,
    `<script id="_dataInline" type="application/json">\n${dataJson}\n</script>\n<script>\n${appJs}\n</script>`
  );
}

fs.writeFileSync('shikmim_research_dashboard_v14.html', html, 'utf8');
const sizeKB = Math.round(fs.statSync('shikmim_research_dashboard_v14.html').size / 1024);
console.log(`Done. shikmim_research_dashboard_v14.html - ${sizeKB} KB`);
