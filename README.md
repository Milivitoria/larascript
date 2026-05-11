# Larascript

Larascript now includes a **TypeScript 6 + Hono** runtime in parallel with the existing Laravel app.

## Migration scope

- Laravel remains in place during transition (hybrid mode).
- New REST API is served by Hono with versioned routes under `/api/v1`.
- OpenAPI 3.1 and Swagger UI are available by default at `/openapi.json` and `/docs`.
- Vite builds static frontend assets to `dist/client`.
- Biome is the single lint/format tool for the TypeScript stack.

## Development

```bash
npm install
npm run dev
```

This runs:
- API server: `tsx watch src/server.ts`
- Frontend dev server: `vite`

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run validate:openapi
```

## API endpoints

- `GET /api/v1/health`
- `GET /api/v1/echo?message=hello`
- `GET /openapi.json`
- `GET /docs`

## Static serving

In runtime mode, Hono serves built static assets from `dist/client` with SPA fallback to `index.html`.

## CI

The test workflow now runs dual pipelines:
- Existing PHP tests (Laravel)
- Node quality gates (Biome, TypeScript, Vitest, Vite build, OpenAPI validation)
