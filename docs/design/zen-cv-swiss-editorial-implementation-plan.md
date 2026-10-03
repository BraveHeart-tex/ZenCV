# ZenCV Swiss Editorial UI Migration Plan

## Goal

Migrate ZenCV's application UI toward an 85% Swiss Editorial, 10% Japanese minimalism, and 5% quiet utilitarianism visual direction. Keep the experience calm, whitespace-led, typography-driven, and restrained in its use of borders, red accents, and motion.

## Source of truth

- The current application remains authoritative for behavior, routing, accessibility, component architecture, persistence, document-builder behavior, responsive functionality, and domain models.
- The prototype informs visual hierarchy, typography, spacing, color, density, borders, layout, icon treatment, responsive composition, and motion character. Treat it as a reference, not production code.
- `docs/design/zen-cv-swiss-editorial-reference.html` is the canonical visual and interaction reference. Use it with the user's written direction; do not copy its prototype code directly.
- Root `DESIGN.md` does not exist yet. Create it during Phase 1 to document the adopted production design rules, then keep it aligned with the migration.

## Guardrails

- Reuse existing shadcn/ui primitives. Restyle with semantic tokens, variants, Tailwind classes, and composition.
- Do not create a parallel design system or turn every region into a Card.
- Reuse Lucide and the existing Motion/LazyMotion infrastructure. Respect reduced-motion preferences.
- Keep mobile behavior, accessibility, current lazy-loading boundaries, and the builder's document-focused preview.
- Keep changes presentational. Do not alter persistence, document models, stores, routing behavior, or business logic unless presentation requires a narrowly scoped adjustment.
- Do not restyle the resume template output as part of the application UI migration.

## Phases

### Phase 1 - Establish theme and visual tokens

**Files:** `DESIGN.md` (new), `src/app/globals.css`, `src/components/ui/theme-provider.tsx`, `docs/design/zen-cv-swiss-editorial-reference.html` (read-only reference)

- Define coordinated light and dark semantic tokens for warm paper, ink, muted text, surfaces, fine borders, focus rings, and a restrained red accent.
- Set shared typography roles and a consistent spacing, radius, border, shadow, and transition vocabulary.
- Derive production rules from the reference and the user's constraints; record the resulting typography, layout, control, color, and motion guidance in `DESIGN.md`.
- Keep Tailwind and shadcn semantic token names so existing components inherit the foundation.
- Retain the existing font unless available project assets support a suitable editorial alternative.

**Completion criteria:** `DESIGN.md` captures the adopted design rules; both themes use the same visual logic; focus remains visible; defaults feel calm and restrained without page-specific overrides.

### Phase 2 - Restyle shared shadcn/ui primitives

**Files:** `src/components/ui/button.tsx`, `card.tsx`, `input.tsx`, `sidebar.tsx`, and other touched primitives such as `select.tsx`, `dialog.tsx`, `sheet.tsx`, `dropdown-menu.tsx`, `toggle.tsx`, `switch.tsx`, and `separator.tsx`

- Tune button variants, input surfaces, control sizing, focus states, and transitions to the shared tokens.
- Reduce default rounding, shadows, and boxed surfaces where they are not useful.
- Keep Card available for content that benefits from a container; prefer open rows and separators for editorial layouts.
- Preserve shadcn/Radix semantics and existing accessible interaction behavior.

**Completion criteria:** Common controls have consistent visual states and do not require repeated page-level restyling.

### Phase 3 - Update app shell and navigation

**Files:** `src/components/appHome/ApplicationLayoutWithSidebar.tsx`, `src/components/appHome/app-sidebar.tsx`, `src/components/appHome/AppColorModeToggle.tsx`, `src/components/ui/sidebar.tsx`

- Restyle the sidebar brand, navigation hierarchy, active state, spacing, separators, and color-mode control.
- Use Lucide icons consistently; avoid decorative numbering and dots.
- Preserve the shadcn sidebar's collapsed state, saved preference, keyboard shortcut, mobile sheet, and route links.

**Completion criteria:** Desktop and mobile shells feel related; navigation remains keyboard- and touch-friendly.

### Phase 4 - Migrate Documents

**Files:** `src/components/appHome/documents/DocumentsPage.tsx`, `DocumentsPageClient.tsx`, `DocumentCard.tsx`, `CreateDocumentDialog.tsx`, `CreateDocumentForm.tsx`, `RenameDocumentDialog.tsx`

- Introduce a centered editorial page introduction, followed by structured left-aligned search and library content.
- Restyle document cards as restrained library entries. Avoid heavy outlines, shadows, and ornamental labels.
- Restyle loading, empty, and no-results states to match the same hierarchy.
- Preserve search, sort order, create, open, rename, duplicate, delete, confirmation, and backup flows.

**Completion criteria:** The page has a clear editorial entry point and all existing document actions and states remain available.

### Phase 5 - Migrate Resume Templates and Settings

**Files:** `src/app/resume-templates-page.tsx`, `src/components/landingPage/templates/TemplateCard.tsx`, `src/components/documentBuilder/TemplateImage.tsx`, `src/components/appHome/resumeTemplates/resumeTemplates.constants.tsx`; `src/app/settings-page.tsx`, `src/components/appHome/settings/SettingsShared.tsx`, `GeneralSettings.tsx`, `EditorPreferences.tsx`, `DataImportExport.tsx`, `SettingsDangerZone.tsx`

- Reuse the page-introduction pattern on Resume Templates. Keep preview proportions, names, template actions, and responsive gallery behavior.
- Give Settings the same editorial heading structure, open setting rows, and fine separators. Reserve stronger framing for destructive actions.
- Preserve settings anchors, accessible labels, save/error feedback, import/export confirmation, and all control behavior.

**Completion criteria:** Both pages share the system without losing existing interactions, content, or responsive behavior.

### Phase 6 - Migrate Builder chrome and preview surround

**Files:** `src/app/builder-page.tsx`, `src/components/documentBuilder/DocumentBuilderClient.tsx`, `DocumentBuilderHeader.tsx`, `DocumentSectionNavigation.tsx`, `DocumentSections.tsx`, `DocumentSection.tsx`, `SectionItem.tsx`, `DocumentBuilderPreview.tsx`, `DocumentBuilderPreviewHeader.tsx`, `builderViewOptions/DocumentBuilderViewToggle.tsx`, and `templateGallery/*`

- Restyle the editor header, section navigation, forms, save status, template picker, preview controls, and surrounding surfaces.
- Keep the resume page visually dominant in the builder; keep editor chrome quiet and legible.
- Preserve section navigation, drag-and-drop, editing, saving, PDF preview controls, template selection, and desktop/mobile view switching.
- Keep the existing lazy preview mount and heavy-code chunk boundaries.

**Completion criteria:** Existing builder workflows and responsive modes remain intact; document preview remains the primary visual focus.

### Phase 7 - Migrate landing page

**Files:** `src/components/landingPage/LandingPage.tsx`, `Header.tsx`, `Hero.tsx`, `Features.tsx`, `templates/Templates.tsx`, `templates/TemplateCard.tsx`, `Cta.tsx`, `Footer.tsx`

- Center the opening editorial introduction, then use structured left-aligned content below it.
- Let typography and whitespace carry hierarchy. Reduce pill treatments, decorative markers, boxed feature content, and excessive emphasis.
- Restyle template previews and calls to action using the shared controls and restrained accent.
- Preserve navigation, anchor links, template carousel behavior, and responsive layout.

**Completion criteria:** Landing page uses the shared visual system and keeps all existing links and carousel controls functional.

### Phase 8 - Responsive and motion refinement

**Files:** The changed page and primitive files above; `src/components/ui/LazyMotionWrapper.tsx`; existing landing/template transition implementations.

- Review narrow, medium, and wide compositions for comfortable reading, useful whitespace, and stable document previews.
- Keep mobile sidebar, builder view toggle, section selector, template galleries, and accessible touch targets working.
- Use existing Motion/LazyMotion and CSS transitions only. Remove decorative motion that distracts from content; keep useful state feedback subtle.
- Apply reduced-motion behavior to all changed animation and transition paths.

**Completion criteria:** Layouts adapt without horizontal overflow or lost controls; reduced-motion settings suppress nonessential movement.

## Implementation order

1. Tokens and typography in `globals.css`.
2. Shared shadcn/ui primitives.
3. App shell and navigation.
4. Documents as the first page pattern.
5. Resume Templates and Settings using that pattern.
6. Builder chrome and preview surround.
7. Landing page.
8. Cross-surface responsive and motion refinement.

## Out of scope

- Persistence, Dexie schema, document models, builder stores, route semantics, business logic, and PDF template content.
- Adding dependencies or another animation system.
- Copying prototype CSS directly into production.
