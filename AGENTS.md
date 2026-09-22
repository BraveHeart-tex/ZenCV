# ZenCV Agent Notes

Read only what the task needs:

- `docs/developer-reference.md` - repo map, scripts, Dexie schema, templates, assets, Worker routes.
- `docs/task-recipes.md` - recipe index; read only the matching task recipe.
- `PRODUCT.md` - product/privacy claims; do not invent evidence.
- `DESIGN.md` - UI tone, layout, colors, motion.
- Follow the commit and pull-request conventions in CONTRIBUTING.md.

## Task Routing

- Template/PDF work: read `docs/task-recipes/add-resume-template.md`.
- Worker/API work: read `docs/task-recipes/add-worker-route.md`.
- Dexie/schema work: read `docs/task-recipes/change-dexie-schema.md`.
- Product/marketing copy: read `PRODUCT.md`.
- UI/design changes: read `DESIGN.md`.

## Code Style

- TypeScript: avoid `any`; prefer `unknown` with guards.
- Named exports only.
- Always use block statements for conditionals.
- Production dependencies must be exact-pinned; ask before adding one.
- File names: components `PascalCase.tsx`; helpers `camelCase.ts`; constants `camelCase.constants.ts`; types `camelCase.types.ts`; PDF styles `[template].styles.ts`.

## Gotchas

- `vite.config.ts` owns manual chunking; preserve lazy boundaries for heavy editor/PDF/AI code.

## Agent skills

### Issue tracker

Issues and specs are tracked in GitHub Issues. See `docs/agents/issue-tracker.md`.

### Domain docs

This repo uses a single-context domain-doc layout. See `docs/agents/domain.md`.
