import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import service from './service.mts';

const root = fileURLToPath(new URL('./public/', import.meta.url));
const types: Record<string, string> = {
  html: 'text/html; charset=utf-8', css: 'text/css; charset=utf-8',
  js: 'application/javascript; charset=utf-8', json: 'application/json',
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp',
  svg: 'image/svg+xml', ico: 'image/x-icon', woff: 'font/woff', woff2: 'font/woff2', ttf: 'font/ttf',
};

Bun.serve({
  hostname: '0.0.0.0',
  port: service.port(),
  async fetch(request) {
    if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405 });
    let pathname: string;
    try { pathname = decodeURIComponent(new URL(request.url).pathname); }
    catch { return new Response('Bad request', { status: 400 }); }
    if (pathname === '/healthz') return new Response('ok');
    if (pathname === '/') pathname = '/index.html';
    const path = resolve(root, '.' + pathname);
    if (!path.startsWith(root.endsWith(sep) ? root : root + sep)) return new Response('Forbidden', { status: 403 });
    const file = Bun.file(path);
    if (!(await file.exists())) return new Response('Not found', { status: 404 });
    const extension = path.split('.').pop() || '';
    return new Response(request.method === 'HEAD' ? null : file, {
      headers: {
        'Content-Type': types[extension] || 'application/octet-stream',
        'Cache-Control': extension === 'html' ? 'no-cache' : 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  },
});
