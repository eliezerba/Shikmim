const fs = require('fs');

const srcHtml = fs.readFileSync('shikmim_research_dashboard_v10.html', 'utf8');
const css     = fs.readFileSync('style.css',  'utf8');
const dataJson = fs.readFileSync('data.json', 'utf8');
const appJs   = fs.readFileSync('app.js',     'utf8');

let html = srcHtml;

// --- 1. Inline style.css ---
if (/<link rel="stylesheet" href="style\.css"/.test(html)) {
  html = html.replace(/<link rel="stylesheet" href="style\.css"\s*\/?>/, `<style>\n${css}\n</style>`);
} else {
  // Already inlined — update the <style> block
  html = html.replace(/<style>[\s\S]*?<\/style>/, `<style>\n${css}\n</style>`);
}

// --- 2. Inline data.json + app.js ---
if (html.includes('<script src="app.js"></script>')) {
  // First build: replace external script reference
  html = html.replace(
    '<script src="app.js"></script>',
    `<script id="_dataInline" type="application/json">\n${dataJson}\n</script>\n<script>\n${appJs}\n</script>`
  );
} else {
  // Subsequent build (already built): reconstruct around _dataInline marker
  const preMatch  = html.match(/^([\s\S]*?)<script id="_dataInline"/);
  const postMatch = html.match(/<\/script>\s*<\/body>([\s\S]*)$/);
  if (preMatch && postMatch) {
    html = preMatch[1]
      + `<script id="_dataInline" type="application/json">\n${dataJson}\n</script>\n<script>\n${appJs}\n</script>`
      + `\n</body>${postMatch[1]}`;
  } else {
    console.error('ERROR: לא ניתן למצוא נקודת הזרקה ב-v10 HTML. בדוק את מבנה הקובץ.');
    process.exit(1);
  }
}

fs.writeFileSync('shikmim_research_dashboard_v10.html', html, 'utf8');
const sizeKB = Math.round(fs.statSync('shikmim_research_dashboard_v10.html').size / 1024);
console.log(`Done. shikmim_research_dashboard_v10.html — ${sizeKB} KB`);
