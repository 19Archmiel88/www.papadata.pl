# Deploy (statyczny)

## Build
Vite generuje `dist/`.

## Hosting
- dowolny static hosting/CDN
- SPA rewrite: wszystkie ścieżki → `index.html`

## Cache
- assety z hashami: long cache
- index.html: krótszy cache

## Security headers
- CSP (dostosować do realnych źródeł)
- standardowe secure headers
