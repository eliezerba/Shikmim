const fs = require('fs');

const srcHtml = fs.readFileSync('shikmim_research_dashboard_v10.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const dataJson = fs.readFileSync('data.json', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');

let html = srcHtml;

html = html.replace(/Shikmim Research Dashboard v10/g, 'Shikmim Research Dashboard v11');

if (/<link[^>]+href=["']style\.css["'][^>]*>/.test(html)) {
  html = html.replace(/<link[^>]+href=["']style\.css["'][^>]*>/, `<style>\n${css}\n</style>`);
} else if (/<style>[\s\S]*?<\/style>/.test(html)) {
  html = html.replace(/<style>[\s\S]*?<\/style>/, `<style>\n${css}\n</style>`);
}

if (/<script[^>]+src=["']app\.js["'][^>]*><\/script>/.test(html)) {
  html = html.replace(
    /<script[^>]+src=["']app\.js["'][^>]*><\/script>/,
    `<script id="_dataInline" type="application/json">\n${dataJson}\n</script>\n<script>\n${appJs}\n</script>`
  );
} else {
  const dataBlock = `<script id="_dataInline" type="application/json">\n${dataJson}\n</script>\n<script>\n${appJs}\n</script>`;
  if (html.includes('<script id="_dataInline"')) {
    html = html.replace(/<script id="_dataInline"[\s\S]*?<\/script>\s*<script>[\s\S]*?<\/script>/, dataBlock);
  } else {
    html = html.replace(/<\/body>/, `${dataBlock}\n</body>`);
  }
}

fs.writeFileSync('shikmim_research_dashboard_v11.html', html, 'utf8');
const sizeKB = Math.round(fs.statSync('shikmim_research_dashboard_v11.html').size / 1024);
console.log(`Done. shikmim_research_dashboard_v11.html - ${sizeKB} KB`);
