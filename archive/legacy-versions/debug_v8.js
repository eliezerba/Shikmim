const fs = require('fs');
const v = fs.readFileSync('shikmim_research_dashboard_v8.html', 'utf8');

// Check load order
const dataInlinePos = v.indexOf('id="_dataInline"');
const appScriptPos = v.lastIndexOf('<script>');
const loadDataCallPos = v.lastIndexOf('loadData()');
const DOMContentPos = v.indexOf('DOMContentLoaded');

console.log('_dataInline pos:', dataInlinePos);
console.log('app <script> pos:', appScriptPos);
console.log('loadData() call pos:', loadDataCallPos);
console.log('DOMContentLoaded pos:', DOMContentPos);
console.log('app script is BEFORE _dataInline (bad):', appScriptPos < dataInlinePos);
console.log('---');
console.log('Context around loadData() call:');
console.log(v.substring(loadDataCallPos - 150, loadDataCallPos + 50));
console.log('---');
console.log('Context around _dataInline insertion:');
console.log(v.substring(dataInlinePos - 10, dataInlinePos + 60));
