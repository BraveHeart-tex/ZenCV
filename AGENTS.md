# ZenCV — Agent Guidelines & Critical Constraints

This document outlines the strict architectural constraints and rules that must be followed. For repository maps, setup commands, and step-by-step guides, refer to `docs/developer-reference.md`.

## Tech Stack Overview
- **Frontend:** Vite, React 19, TypeScript, MobX, Dexie (IndexedDB), `@react-pdf/renderer`, Tailwind v4, Hono, Clerk auth
- **Backend:** Cloudflare Workers, Hono, Groq AI (via `@ai-sdk/groq`), Sentry, structured logging
- **Monorepo:** pnpm workspaces (root, `worker/`)

---

## Critical Architecture Rules

### 1. State Management (MobX)
- **Dexie Interop:** Objects returned from Dexie are plain JS objects and are **not** observable. Never mutate them directly. Wrap section metadata using `parseMetadataToObservable(raw)` when storing them.
- **Mutations:** Always wrap state mutations in `runInAction`.
- **Reactivity & Render Dependencies:** 
  - `mappedSections` in `BuilderTemplateStore` must explicitly spread metadata items (`section.metadata.map(m => ({ ...m }))`) to register dependencies.
  - Use `computedFn` from `mobx-utils` for parameterized getters (e.g., sorting sections or items) to prevent redundant evaluations during field changes.
- **Async Operations:** Always implement optimistic updates with explicit rollback logic on failure.

### 2. Database (Dexie IndexedDB)
- **Migrations:** Increment the schema version without modifying previous version definitions. Always write `.upgrade()` functions for existing records.
- **Auditing:** Explicitly set `createdAt` and `updatedAt` during document creation/cloning. Do not rely on automated Dexie hooks.
- **UI Saving State:** Builder edits write silently to IndexedDB. Do not display "Saving..." or "Saved" indicators for local writes. Only show progress indicators for heavy remote operations (AI, export, PDF generation).

### 3. PDF Generation (`@react-pdf/renderer`)
- **Dynamic Styles:** `StyleSheet.create()` must be called dynamically inside the render loop (within style factories) when using dynamic properties like accent colors. Do not call it at the module level.
- **Dynamic Imports:** The `pdf()` function requires synchronous component trees. Do not use lazy loading or dynamic imports inside resume template components.
- **Bundle Splitting:** `@react-pdf/renderer` and `pdfjs-dist` must be isolated in the `pdf` manual chunk. Never import pdf-related files into components rendered on the landing page.

### 4. Cloudflare Worker & AI
- **Context Bindings:** Never initialize AI clients (Groq) or Sentry clients at the module level. Cloudflare bindings (environment variables) are only accessible per-request inside route handlers.
- **Sentry Capture:** Always call `captureError(error, c, context)` inside try/catch blocks and await `Sentry.flush(2000)` before returning the response.
- **Logger:** Use structured logging with `getLogger(c)`. Log events as objects (not raw strings) using `snake_case` keys (e.g., `job_analysis_error`).

---

## Code Conventions

### TypeScript & Linting (Biome)
- **Strict Typing:** Avoid `any`; use `unknown` with type guards.
- **Exports:** Named exports only (`noDefaultExport` is enforced).
- **Control Flow:** Always use block statements `{}` for all conditions, even single-line `if/else` branches.
- **Dependencies:** All dependencies must be pinned to exact versions (no `^` or `~` in `package.json`).

### File Naming
- Components: `PascalCase.tsx`
- Utilities/helpers: `camelCase.ts`
- Constants: `camelCase.constants.ts` or `camelCase.ts`
- Types: `camelCase.types.ts`
- PDF Styles: `[templateName].styles.ts`

---

## High-Frequency Gotchas
- **Double PDF Renders:** When changing templates, update both `templateType` and `templateSettings` in a single `runInAction` block to prevent multiple layout recalculations.
- **`safeParse` Resilience:** Ensure metadata parsers handle both raw JSON strings and pre-parsed arrays/objects, as inputs vary between initial hydration and active mutations.
- **modulePreload:** Must remain `false` in `vite.config.ts` to prevent eager preloading of heavy PDF assets on the landing page.