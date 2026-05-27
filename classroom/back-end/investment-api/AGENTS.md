# Investment API — Agent Guidelines

## Architecture

REST API built with **Node.js + TypeScript + Express 5**. SQLite is accessed via the Node.js built-in `node:sqlite` module (no ORM).

Layers (request flow):

```
routes/ → controllers/ → models/ → database/database.ts
```

Resources: `investments`, `categories`, `brokers`. Each resource has a route file, controller, model, and type definition.

## Project Structure

| Path | Purpose |
|------|---------|
| `src/routes/` | Express routers — wire HTTP methods to controller functions |
| `src/controllers/` | Request/response handling — delegate business logic to models |
| `src/models/` | SQL queries via the database wrapper |
| `src/types/` | TypeScript interfaces (`.d.ts`) for each resource |
| `src/errors/HttpError.ts` | Custom error class (`message`, `code`) |
| `src/middlewares/` | `errorHandlers.ts` (global), `requireJsonContentType.ts` |
| `src/database/database.ts` | Promise-based wrapper around `DatabaseSync` |
| `src/database/seeders.json` | Seed data |

## Build and Dev

```bash
npm run dev          # Start dev server with hot reload (tsx watch)
npm run build        # Compile TypeScript
npm run start        # Build then run compiled output

npm run db:load      # Run migration + seeders
npm run db:drop      # Delete db.sqlite
npm run db:reload    # Drop + load (full reset)
```

Dev server listens on **port 3000**. API endpoints are prefixed with `/api`.

## Conventions

- **Path alias**: `@/` maps to `src/`. Always use `@/` for internal imports (never relative `../../`).
- **Import file extensions**: include `.ts` in all import paths (e.g. `import Foo from '@/models/Foo.ts'`).
- **ESM**: project uses `"type": "module"` — use `import`/`export`, not `require`.
- **Error handling**: throw `new HttpError(message, statusCode)` inside controllers; the global `errorHandler` middleware catches it.
- **Types**: declare resource interfaces in `src/types/<Resource>.d.ts` and import with `import type`.
- **Controller pattern**: each controller is a plain object of async functions exported as default; functions receive `(req, res)` and throw `HttpError` on failure.
- **Routes pattern**: create a `Router`, attach middlewares and controllers, export as default.
