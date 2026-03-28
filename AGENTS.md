# ZenCV — Agent Guidelines

## Project Overview

ZenCV is a full-stack CV builder application. Users create, edit, and export resumes as PDFs with multiple templates and AI-assisted content generation.

**Stack:**
- **Frontend:** Vite + React 19, TypeScript, MobX, Dexie (IndexedDB), `@react-pdf/renderer`, Tailwind v4, Hono, Clerk auth
- **Backend:** Cloudflare Workers + Hono, Groq AI (via `@ai-sdk/groq`), Sentry, structured logging
- **Monorepo:** pnpm workspaces — root (`zen-cv`) and `worker/` (`zen-cv-worker`)

---

## Repository Structure

```
ZenCV/
├── src/
│   ├── app/                          # Route lazy-loading entry points
│   ├── components/
│   │   ├── appHome/
│   │   │   ├── documents/            # Documents page, DocumentCard, CreateDocumentForm
│   │   │   ├── resumeTemplates/      # Template components (London, Manhattan, Tokyo, Dubai, Sydney)
│   │   │   └── settings/             # Settings page
│   │   ├── documentBuilder/          # Builder UI, PDF viewer, AI widgets, template gallery
│   │   │   ├── pdfViewer/            # DocumentBuilderPdfViewer, pdfViewer.helpers, hooks
│   │   │   └── templateGallery/      # GalleryPdfViewer, MobileTemplatePickerContent, ResumeTemplateOptions
│   │   ├── landingPage/              # Landing page, template carousel
│   │   └── ui/                       # shadcn/ui components
│   ├── hooks/                        # useMediaQuery etc.
│   ├── lib/
│   │   ├── client-db/                # Dexie schema, clientDb.ts, service files
│   │   ├── constants/                # accentColors.ts, global constants
│   │   ├── helpers/                  # documentBuilderHelpers.ts
│   │   ├── misc/                     # fieldTemplates, sectionMetadataTemplates, createAndNavigateToDocument
│   │   ├── stores/documentBuilder/   # MobX stores (root, document, section, item, field, template, UI, AI)
│   │   ├── templates/                # prefilledTemplates.ts (Standard, Tech-Focused, Creative)
│   │   ├── types/                    # TypeScript types
│   │   ├── utils/                    # stringUtils, objectUtils, colorUtils, debounce
│   │   └── validation/               # Zod schemas
│   └── main.tsx                      # Entry point, Sentry init, GlobalErrorBoundary
├── shared/
│   ├── constants.ts
│   ├── stringUtils.ts
│   ├── prompts/promptHelpers.ts      # AI prompt builders
│   └── schemas/                      # Shared Zod schemas (worker + frontend)
├── worker/
│   ├── src/
│   │   ├── index.ts                  # Hono app, Sentry wrapper
│   │   ├── env.ts                    # Zod-validated Env type
│   │   ├── lib/
│   │   │   ├── logger.ts             # Structured CF Workers logger
│   │   │   └── sentry.ts             # captureError helper
│   │   ├── middleware/
│   │   │   ├── logger.ts             # loggerMiddleware, getLogger
│   │   │   └── ratelimit.ts          # CF Workers Rate Limiting API
│   │   └── routes/
│   │       ├── auth.ts               # DELETE /auth/delete-account
│   │       ├── generate-summary.ts   # POST /process/generate-summary (streaming)
│   │       ├── improve-summary.ts    # POST /process/improve-summary (streaming)
│   │       ├── job-analysis.ts       # POST /process/job-analysis (generateObject)
│   │       └── health-check.ts       # GET /health-check (cron)
│   ├── wrangler.toml
│   └── package.json
├── public/
│   ├── fonts/Roboto/                 # TTF fonts for @react-pdf/renderer
│   └── templates/                    # Template preview images (*.webp, *.avif, 400/700/1000px variants)
├── AGENTS.md                         # This file
├── package.json
├── vite.config.ts
├── tsconfig.app.json
└── pnpm-workspace.yaml
```

---

## Development Commands

```bash
# Frontend dev server
pnpm dev

# Worker dev server (separate terminal)
pnpm worker:dev

# Build frontend
pnpm build

# Deploy worker
pnpm worker:deploy

# Type check worker
pnpm worker:typecheck

# Lint (Biome)
pnpm lint

# Find dead code
pnpm knip
```

---

## Architecture Decisions

### State Management (MobX)

All builder state lives in `BuilderRootStore` which composes:

- **`BuilderDocumentStore`** — document record, `templateType`, `accentColor` getter (derived from `templateSettings`), `updateAccentColor`, `changeDocumentTemplateType`
- **`BuilderSectionStore`** — sections array (`SectionWithParsedMetadata[]`), metadata is stored as observable items via `parseMetadataToObservable()`. Always use `runInAction` for mutations.
- **`BuilderItemStore`** — items array
- **`BuilderFieldStore`** — fields array + `fieldValues: ObservableMap<id, string>` for granular reactivity
- **`BuilderTemplateStore`** — `pdfTemplateData` computed, `debouncedTemplateData`, `mappedSections`, `resumeStats`
- **`BuilderUIStore`** — view state, collapsed items, mobile template selector
- **`BuilderAISuggestionsStore`** — keyword suggestions, field suggestions, job analysis results

**Critical MobX rules:**
- Never mutate plain objects from Dexie directly — they are not observable. Use `runInAction`.
- Section metadata items must be wrapped with `observable()` via `parseMetadataToObservable()` so property mutations (`.value = x`) are tracked.
- `mappedSections` in `BuilderTemplateStore` must explicitly spread metadata items (`section.metadata.map(m => ({ ...m }))`) to register MobX dependencies on each item's properties.
- Always wrap async store mutations with optimistic updates + rollback on error.
- Use `computedFn` from `mobx-utils` for per-argument memoization (e.g. per-section sorting).

### Database (Dexie — IndexedDB)

Current schema version: **7**

```typescript
// DEX_Document
{
  id, title, templateType, templateSettings, // templateSettings: JSON string
  createdAt, updatedAt, jobPostingId
}
```

**`templateSettings`** stores per-template accent color preferences:
```json
{ "tokyo": { "accentColor": "#10b981" }, "dubai": { "accentColor": "#c8a96e" } }
```

Always use `parseTemplateSettings()` / `serializeTemplateSettings()` from `accentColors.ts` — never raw `JSON.parse`.

When adding schema migrations:
- Increment version number
- Never modify previous version definitions
- Always write `.upgrade()` functions for existing records
- Set `createdAt`/`updatedAt` explicitly in `createDocument` and `copyDocument` — don't rely solely on Dexie hooks

### PDF Generation

**Template pattern:**
1. Each template has a `create[Name]Styles(accentColor: string)` factory in `[name].styles.ts`
2. Each template root component calls `const styles = create[Name]Styles(templateData.accentColor)`
3. Styles are passed down as props to all sub-components — never import static styles in sub-components
4. Sub-components accept `styles: ReturnType<typeof create[Name]Styles>` as a prop
5. Types are defined in `[name].types.ts`

**Supported templates:** London, Manhattan, Tokyo, Dubai, Sydney

**Accent color support:** Tokyo, Dubai, Sydney only. London and Manhattan are monochrome by design.

**`PdfTemplateData` shape:**
```typescript
{
  personalDetails: { firstName, lastName, jobTitle, address, city, phone, email },
  summarySection: { sectionName, summary },
  sections: TemplateDataSection[],
  accentColor: string,
  templateType: ResumeTemplate,
}
```

`getPdfTemplateByType(pdfTemplateData)` in `pdfViewer.helpers.tsx` is the single dispatch point — it reads `templateType` from `pdfTemplateData` directly.

**PDF viewer pattern:**
- `DocumentBuilderPdfViewer` — main builder preview, uses `children` prop
- `GalleryPdfViewer` — template gallery viewer, uses MobX reaction on `debouncedTemplateData`
- Both use a `renderVersion` counter + MobX `reaction` to trigger re-renders — never read observables directly in `useAsync` deps
- Transition pattern: previous render stays visible at full opacity while new one generates, then crossfades in via `requestAnimationFrame` + `setIsVisible(true)`

### Cloudflare Worker

**Route structure:**
```
POST /process/generate-summary   → rateLimitMiddleware → handler (streaming)
POST /process/improve-summary    → rateLimitMiddleware → handler (streaming)
POST /process/job-analysis       → rateLimitMiddleware → handler (generateObject)
DELETE /auth/delete-account      → handler
GET /health-check                → cron handler
```

**Middleware order in `index.ts`:**
1. CORS
2. `loggerMiddleware` (attaches logger to context)
3. Env validation
4. Routes

**Logging:** Use `getLogger(c)` inside route handlers. Log event names in `snake_case` (e.g. `generate_summary_start`, `job_analysis_error`). Always log as objects not strings for CF structured logging.

**Rate limiting:** Uses CF Workers Rate Limiting API (not Upstash). Skip in development via `c.env.ENVIRONMENT === 'development'`.

**AI:** Always create `createGroq({ apiKey: c.env.GROQ_API_KEY })` inside handlers, not at module level. Model: `openai/gpt-oss-20b`.

**Sentry:** Use `captureError(error, c, { handler, step? })` helper. Always `await Sentry.flush(2000)` after capturing. Worker wrapped with `@sentry/cloudflare` Sentry wrapper on the fetch export.

**Env vars (secrets via `wrangler secret put`):**
- `CLERK_SECRET_KEY`, `GROQ_API_KEY`, `CRON_TOKEN`, `SENTRY_DSN`
- Local dev: `worker/.dev.vars`

**`wrangler.toml`:**
```toml
[observability]
enabled = true
head_sampling_rate = 1
```

### Accent Color System

Located in `src/lib/constants/accentColors.ts`:

- `ACCENT_COLOR_PRESETS` — 8 preset swatches
- `ACCENT_COLOR_SUPPORTED_TEMPLATES` — `Set<ResumeTemplate>` of Tokyo, Dubai, Sydney
- `TEMPLATE_ACCENT_COLORS` — default accent per template
- `parseTemplateSettings(raw)` / `serializeTemplateSettings(settings)` — type-safe JSON helpers
- `getDefaultAccentColorForTemplate(templateType)` — fallback per template

**`accentColor` getter in `BuilderDocumentStore`:**
```typescript
get accentColor(): string {
  if (!this.document) return DEFAULT_ACCENT_COLOR;
  const settings = parseTemplateSettings(this.document.templateSettings);
  return (
    settings[this.document.templateType]?.accentColor ??
    getDefaultAccentColorForTemplate(this.document.templateType)
  );
}
```

**When switching templates** (`changeDocumentTemplateType`): pre-populate `templateSettings` for the new template in the same `runInAction` to avoid double PDF renders.

### Image System

Template preview images follow this pattern:
```
/public/templates/[name]-400.webp   ← card variant
/public/templates/[name]-700.webp   ← hover variant
/public/templates/[name]-1000.webp  ← modal variant
```

AVIF equivalents exist for all. Use `<TemplateImage>` component which serves `<picture>` with AVIF + WebP sources. Always provide `width` and `height` props using A4 ratio (`height = width * Math.SQRT2`).

### Error Handling

**Frontend:**
- `GlobalErrorBoundary` wraps entire app in `main.tsx` (uses `Sentry.ErrorBoundary`)
- Route-level boundaries in `App.tsx` wrap builder and sidebar layout group separately
- `RouteErrorFallback` is passed as `fallback` prop to `Sentry.ErrorBoundary`
- Unhandled promise rejections captured via `window.addEventListener('unhandledrejection', ...)`

**Worker:**
- All routes wrapped in try/catch
- `captureError(error, c, context)` for Sentry + structured log
- Always return consistent `{ success, message, timestamp }` shape

---

## Code Conventions

### TypeScript
- Strict mode enabled — no `any`, prefer `unknown` with type guards
- Use `Zod` for all external data validation (API responses, form data, env vars)
- Env validation in `vite.config.ts` runs at build time and exits on invalid vars
- All deps pinned to exact versions (no `^`) — enforced via `.npmrc` `save-exact=true`

### Biome (Linting)
- `noDefaultExport` enforced — always use named exports
- `useBlockStatements` enforced — always use `{}` even for single-line if/else
- Run `pnpm lint` before committing

### Commit Conventions
Follows Conventional Commits (`@commitlint/config-conventional`):
```
feat: add accent color support
fix: section metadata not triggering pdf re-render
chore: update hono to 4.12.7
refactor: simplify mappedSections computed
```

### File Naming
- Components: `PascalCase.tsx`
- Utilities/helpers: `camelCase.ts`
- Constants: `camelCase.constants.ts` or `camelCase.ts`
- Types: `camelCase.types.ts`
- Styles (pdf): `[templateName].styles.ts`

### Imports
- Use `@/` alias for `src/`
- Use `@shared/` alias for `shared/` (worker only)
- Group: external → internal → relative

---

## Section Metadata

Section metadata is stored as a JSON string in `DEX_Section.metadata` and parsed into `ParsedSectionMetadata[]` in the store.

**Always use `parseMetadataToObservable(raw)`** when pushing sections into the store — this ensures mutations to `.value` are tracked by MobX.

**Helper functions** for default metadata live in `src/lib/misc/sectionMetadataTemplates.ts`:
- `getDefaultSkillsMetadata()` — Show experience level + Separate with comma
- `getDefaultReferencesMetadata()` — Hide references toggle

Use these in both `getInitialDocumentInsertBoilerplate` and all prefilled templates (`prefilledTemplates.ts`) to keep metadata in sync.

---

## Prefilled Templates

Located in `src/lib/templates/prefilledTemplates.ts`. Three styles: `STANDARD`, `TECH_FOCUSED`, `CREATIVE`.

**Rules:**
- All sections must include correct `metadata` — use helper functions, never `metadata: ''` for Skills/References
- Education sections must use `INTERNAL_SECTION_TYPES.EDUCATION` not the raw string `'education'`
- `displayOrder` is set by `mapSectionAndItemDisplayOrders` — don't hardcode it
- Skills items can have empty field values but must have proper metadata

---

## Adding a New Template

1. Create `src/components/appHome/resumeTemplates/[name]/` directory
2. Create `[name].styles.ts` with `create[Name]Styles(accentColor: string)` factory
3. Create `[name].types.ts` with `[Name]Styles` and `[Name]SectionProps` types
4. Create section sub-components — all accept `styles: [Name]Styles` prop
5. Create `[Name]Template.tsx` — calls `create[Name]Styles(templateData.accentColor)` at the top
6. Add to `INTERNAL_TEMPLATE_TYPES` constant
7. Add to `getPdfTemplateByType` in `pdfViewer.helpers.tsx`
8. Add to `templateOptionsWithImages` in `resumeTemplates.constants.ts`
9. If accent color supported, add to `ACCENT_COLOR_SUPPORTED_TEMPLATES` and `TEMPLATE_ACCENT_COLORS`
10. Add preview images at `/public/templates/[name]-400.webp`, `-700.webp`, `-1000.webp`

---

## Adding a New Worker Route

1. Create `worker/src/routes/[name].ts`
2. Add `rateLimitMiddleware` if it's a user-facing AI endpoint
3. Use `getLogger(c)` and log `snake_case` event names at key steps
4. Add `Sentry.addBreadcrumb` for AI operations
5. Wrap everything in try/catch with `captureError` and consistent error response shape
6. Register route in `worker/src/index.ts`
7. Add corresponding endpoint constant in `src/lib/endpoints.ts` on the frontend

---

## Known Gotchas

- **MobX + Dexie:** Objects from Dexie are plain — wrap metadata with `observable()` via `parseMetadataToObservable`. Never mutate plain Dexie objects directly.
- **`@react-pdf/renderer`:** `StyleSheet.create()` must be called at render time with dynamic values (not module level) when using accent colors. The `pdf()` function needs synchronous component trees — no lazy imports inside templates.
- **CF Workers:** Don't initialize Groq/AI clients at module level — CF bindings (env vars) are only available per-request. Always create clients inside handlers.
- **Bundle splitting:** `@react-pdf/renderer` and `pdfjs-dist` are heavy (~2.8MB). Keep them isolated in the `pdf` manual chunk. Never import from pdf-related files in components used on the landing page.
- **`modulePreload: false`** in vite config — intentional, prevents eager loading of the pdf chunk on the landing page.
- **Template switching double-render:** Always update both `templateType` and `templateSettings` in the same `runInAction` in `changeDocumentTemplateType` to prevent two PDF renders.
- **`safeParse`:** Accepts `unknown` input — handles both raw JSON strings and already-parsed arrays (metadata can arrive in either form depending on whether the section was just added or hydrated from Dexie).
- **`toSorted` in `mappedSections`:** Use `computedFn` wrappers (`getSortedSections`, `getSortedSectionItems`) to avoid re-sorting on every field value change.
