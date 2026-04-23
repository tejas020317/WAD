const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 1800;
const baseDir = __dirname;

// Basic MIME type map for common file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain'
};

// Map extensions to short labels for icons
const iconLabels = {
  '.html': 'HTML',
  '.css': 'CSS',
  '.js': 'JS',
  '.json': 'JSON',
  '.png': 'PNG',
  '.jpg': 'JPG',
  '.jpeg': 'JPG',
  '.svg': 'SVG',
  '.pdf': 'PDF',
  '.txt': 'TXT'
};

function sendResponse(res, statusCode, content, contentType = 'text/plain') {
  res.writeHead(statusCode, { 'Content-Type': contentType });
  res.end(content);
}

function send404(res) {
  sendResponse(res, 404, 'File not found');
}

function send500(res) {
  sendResponse(res, 500, 'Internal server error');
}

// Ensure the requested path stays inside the base directory
function resolveSafePath(requestPath) {
  const decodedPath = decodeURIComponent(requestPath);
  // Strip any leading ../ patterns after normalization to block traversal
  const normalizedPath = path
    .normalize(decodedPath)
    .replace(/^(\.{2}[\\/])+/, '');
  const fullPath = path.join(baseDir, normalizedPath);
  if (!fullPath.startsWith(baseDir)) {
    return null;
  }
  return fullPath;
}

function listFiles(res) {
  fs.readdir(baseDir, { withFileTypes: true }, (err, entries) => {
    if (err) {
      return send500(res);
    }

    const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
    const items = files
      .map((name) => {
        const ext = path.extname(name).toLowerCase();
        const label = iconLabels[ext] || 'FILE';
        return `
        <li class="file-item">
          <a href="/files/${encodeURIComponent(name)}" class="file-link">
            <span class="file-icon" data-ext="${label}">${label}</span>
            <span class="file-name">${name}</span>
            <span class="open-indicator">↗</span>
          </a>
        </li>`;
      })
      .join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Static Web Server</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <div class="bg-gradient"></div>
  <main class="glass">
    <header>
      <div class="title">📂 Static Web Server</div>
      <p class="subtitle">Click any file to preview it in your browser.</p>
    </header>
    <ul class="file-list">${items}</ul>
  </main>
</body>
</html>`;

    sendResponse(res, 200, html, 'text/html');
  });
}

function serveFile(res, safePath) {
  fs.stat(safePath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return send404(res);
      }
      return send500(res);
    }

    if (!stats.isFile()) {
      return send404(res);
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(safePath, (readErr, data) => {
      if (readErr) {
        return send500(res);
      }
      sendResponse(res, 200, data, contentType);
    });
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname || '/';

  if (pathname === '/') {
    return listFiles(res);
  }

  if (pathname.startsWith('/files/')) {
    const requestedName = pathname.replace('/files/', '');
    const safePath = resolveSafePath(requestedName);
    if (!safePath) {
      return send404(res);
    }
    return serveFile(res, safePath);
  }

  // Serve other static assets like style.css or index.html when directly requested
  const directPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  const safePath = resolveSafePath(directPath);
  if (!safePath) {
    return send404(res);
  }
  return serveFile(res, safePath);
});

server.listen(PORT, () => {
  console.log(`Static web server running at http://localhost:${PORT}/`);
});
