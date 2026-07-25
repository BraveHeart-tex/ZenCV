# ZenCV Developer Reference

Use this for repository facts: paths, scripts, schema shape, assets, and current integration points. For procedural playbooks, see the recipe index at `docs/task-recipes.md`.

## Repo Map

```text
ZenCV/
├── src/
│   ├── app/                          # Top-level route pages
│   ├── components/
│   │   ├── appHome/                  # App shell, documents, settings, templates
│   │   ├── documentBuilder/          # Builder UI, PDF preview, template gallery
│   │   ├── landingPage/              # Marketing/landing surface
│   │   └── ui/                       # Shared UI primitives
│   ├── hooks/                        # Shared React hooks
│   └── lib/
│       ├── client-db/                # Dexie tables, schema, services
│       ├── constants/                # Accent colors and app constants
│       ├── stores/documentBuilder/   # MobX builder stores
│       ├── types/                    # Shared frontend types
│       └── validation/               # Zod schemas
├── shared/                           # Worker/frontend shared schemas, prompts, utils
├── worker/                           # Cloudflare Worker, Hono routes, middleware
├── public/
│   ├── fonts/                        # PDF-compatible TTF fonts
│   └── templates/                    # Resume template preview images
└── docs/                             # Reference docs and screenshots
```

## Commands

Run from the repository root.

- `pnpm dev` - Vite frontend dev server.
- `pnpm test` - Vitest test suite.
- `pnpm build` - TypeScript app check plus Vite production build.
- `pnpm preview` - Preview built frontend assets.
- `pnpm lint` - Biome check/write over `src/`.
- `pnpm knip` - Unused file/dependency analysis.
- `pnpm worker:dev` - Cloudflare Worker local dev server.
- `pnpm worker:deploy` - Deploy Worker via Wrangler.
- `pnpm worker:typecheck` - Worker `tsc --noEmit`.

## Dexie Schema

Current database name: `cv-builder-db`. Current schema version: `7`.

`DEX_Document` shape:

```ts
{
  id: number;
  title: string;
  templateType: ResumeTemplate;
  templateSettings: string;
  createdAt: string;
  updatedAt: string;
  jobPostingId: number | null;
}
```

Tables:

- `documents`: `++id, title, templateType, jobPostingId, createdAt, updatedAt`
- `sections`: `++id, documentId, title, defaultTitle, type, displayOrder, metadata`
- `items`: `++id, sectionId, containerType, displayOrder`
- `fields`: `++id, itemId, name, type, value, selectType, options`
- `settings`: `key`
- `jobPostings`: `++id, companyName, jobTitle, roleDescription, documentId`
- `aiSuggestions`: `++id, suggestedJobTitle, keywordSuggestions, documentId`

`templateSettings` is stringified JSON. Use `parseTemplateSettings()` and `serializeTemplateSettings()` from `src/lib/constants/accentColors.ts`.

```json
{
  "tokyo": {
    "accentColor": "#10b981"
  },
  "dubai": {
    "accentColor": "#c8a96e"
  }
}
```

## Templates And Assets

Resume template IDs live in `INTERNAL_TEMPLATE_TYPES`:

- `london`
- `manhattan`
- `tokyo`
- `dubai`
- `sydney`

Template option metadata and preview paths live in `src/components/appHome/resumeTemplates/resumeTemplates.constants.tsx`.

Preview assets live in `public/templates/`:

- Card: `[name]-400.webp` and `[name]-400.avif`
- Hover: `[name]-700.webp` and `[name]-700.avif`
- Modal/detail: `[name]-1000.webp` and `[name]-1000.avif`

Use `<TemplateImage>` for template previews and preserve A4 preview geometry: `height = width * Math.SQRT2`.

PDF fonts are TTF files under `public/fonts/`. Current families include `Roboto`, `TimesNewRoman`, and `EBGaramond`.

## Accent Colors

Accent color config lives in `src/lib/constants/accentColors.ts`.

- `ACCENT_COLOR_PRESETS`: selectable color swatches.
- `ACCENT_COLOR_SUPPORTED_TEMPLATES`: currently `tokyo`, `dubai`, `sydney`.
- `TEMPLATE_ACCENT_COLORS`: default accent by template.
- `DEFAULT_ACCENT_COLOR`: fallback when a template has no specific default.

## Worker Routes

Routes mount in `worker/src/index.ts`; client URLs live in `src/lib/endpoints.ts`.

- `DELETE /auth/delete-account`
- `POST /process/generate-bullets`
- `POST /process/generate-summary`
- `POST /process/improve-summary`
- `POST /process/job-analysis`

AI routes use `rateLimitMiddleware`, create Groq clients per request from `c.env.GROQ_API_KEY`, use `getLogger(c)`, and report caught failures with `captureError(error, c, context)`.

## Related Docs

- `AGENTS.md` - mandatory constraints for agents.
- `docs/task-recipes.md` - index of focused, task-specific playbooks.
- `PRODUCT.md` - product facts, positioning, privacy claims, and evidence limits.
- `DESIGN.md` - visual system and interaction principles.
