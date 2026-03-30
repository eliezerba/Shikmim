#!/usr/bin/env node
/**
 * server.js
 * Lightweight Node.js server for serving dashboard + API endpoints
 * Usage: node server.js [PORT]
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');

const PORT = parseInt(process.argv[2] || '8080');

function serveFile(filePath, res) {
  try {
    const fullPath = path.join(__dirname, filePath);
    const stat = fs.statSync(fullPath);
    if (!stat.isFile()) throw new Error('Not a file');
    
    const content = fs.readFileSync(fullPath);
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
    };
    
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(content);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found: ' + filePath);
  }
}

const server = http.createServer((req, res) => {
  const u = url.parse(req.url, true);
  const pathname = u.pathname;
  
  // CORS headers for API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // API: Update data from Google Sheets CSV
  if (pathname === '/api/update') {
    console.log('📥 Update request received');
    const proc = spawn('node', [path.join(__dirname, 'updateFromSheets.js')]);
    let output = '';
    let error = '';
    
    proc.stdout.on('data', (data) => {
      output += data.toString();
      console.log(data.toString());
    });
    
    proc.stderr.on('data', (data) => {
      error += data.toString();
      console.error(data.toString());
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: output.split('\n').filter(Boolean) }));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: error || output || 'Update failed' }));
      }
    });
    return;
  }
  
  // Serve files
  if (pathname === '/' || pathname === '') {
    serveFile('/index.html', res);
  } else if (pathname.startsWith('/')) {
    serveFile(pathname, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`\n🌿 Shikmim Dashboard Server`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📥 Update API: http://localhost:${PORT}/api/update\n`);
});
