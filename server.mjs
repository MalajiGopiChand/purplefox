import decorPreview from './api/decor-preview.mjs';
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), 'dist');

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json'
};

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, 'http://localhost');
    let pathname = decodeURIComponent(url.pathname);
    if(pathname.replace(/\/$/,'')==='/api/decor-preview') return decorPreview(req,res);
    let target = path.resolve(root, '.' + pathname);

    if (!target.startsWith(root + path.sep) && target !== root) {
      res.writeHead(403);
      res.end();
      return;
    }

    let fileInfo = await stat(target).catch(() => null);
    if (fileInfo && fileInfo.isDirectory()) {
      target = path.join(target, 'index.html');
      fileInfo = await stat(target).catch(() => null);
    }

    if (!fileInfo) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      const notFoundHtml = await readFile(path.join(root, '404.html'), 'utf8').catch(() => '<h1>404 Not Found</h1>');
      res.end(notFoundHtml);
      return;
    }

    const data = await readFile(target);
    const ext = path.extname(target).toLowerCase();
    res.writeHead(200, {
      'Content-Type': types[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
    });
    res.end(data);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('500 Internal Server Error');
  }
}

// When executed directly with node server.mjs
const isDirectRun = process.argv[1] && (
  process.argv[1] === __filename ||
  process.argv[1].endsWith('server.mjs')
);

if (isDirectRun || !process.env.VERCEL) {
  const PORT = process.env.PORT || 4173;
  http.createServer(handler).listen(PORT, '0.0.0.0', () => {
    console.log(`Purple Fox server running at:`);
    console.log(` - Local:   http://localhost:${PORT}`);
    console.log(` - Network: http://127.0.0.1:${PORT}`);
  });
}
