const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const dataJson = fs.readFileSync('data.json', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');

// Build HTML
let html = indexHtml;
// Inject CSS inline
html = html.replace('<link rel="stylesheet" href="style.css">', `<style>\n${css}\n</style>`);
// Replace app.js script tag: inject _dataInline FIRST, then app script
// This ensures getElementById('_dataInline') works when loadData() is called
html = html.replace(
  '<script src="app.js"></script>',
  `<script id="_dataInline" type="application/json">\n${dataJson}\n</script>\n<script>\n${appJs}\n</script>`
);

fs.writeFileSync('shikmim_research_dashboard_v8.html', html, 'utf8');
const sizeKB = Math.round(fs.statSync('shikmim_research_dashboard_v8.html').size / 1024);
console.log(`Done. shikmim_research_dashboard_v8.html — ${sizeKB} KB`);
