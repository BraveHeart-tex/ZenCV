# ZenCV Design Rules

ZenCV uses a restrained editorial interface: Swiss typographic clarity, Japanese restraint, and quiet utility. The prototype at `docs/design/zen-cv-swiss-editorial-reference.html` is a visual and interaction reference only. Production UI must use the app's existing React, Tailwind, shadcn/ui, and Lucide conventions; do not copy prototype markup or CSS.

## Color and themes

- Use the warm paper, ink, and neutral-rule palette defined in `src/app/globals.css`. Keep the light and dark themes on the same semantic roles: paper/background, surface/card, raised surface/secondary, ink/foreground, muted text, and fine borders.
- The light theme uses warm off-white paper and a slightly brighter surface. The dark theme uses warm charcoal rather than pure black, with softly lifted surfaces and warm light text.
- Use shadcn tokens (`background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, and `ring`) for shared component styling. Sidebar tokens follow the same palette.
- `accent` is a quiet neutral interaction surface. Use `editorial-accent` for small editorial emphasis such as an active mark, a short rule, or a compact status detail. It is a muted brick red, adjusted brighter in dark mode. Do not use red as a large decorative fill. Reserve `destructive` for destructive actions and errors.
- Keep text contrast strong. Muted text is for supporting information, not essential labels or control names. Borders should separate related areas without becoming a grid across the page.
- Preserve both class-based light and dark modes. Do not hard-code theme-specific colors into shared components when a semantic token is available.

## Typography

- Keep Instrument Sans as the application sans-serif. It is already bundled through Fontsource. Do not add a font dependency for this direction.
- Let hierarchy come from scale, weight, and line length. Use compact uppercase labels sparingly for metadata; use sentence case for instructions and body copy.
- Use tight tracking only for large display type and short labels. Keep body copy near normal tracking and comfortable line height. Avoid all-caps paragraphs and repeated bold emphasis.
- Resume document typography is controlled by the resume templates and is outside these application UI rules.

## Spacing and layout

- Use the existing Tailwind spacing scale, based on 4px increments. Favor consistent gaps and generous section spacing over extra boxes or ornamental dividers.
- Use responsive page gutters: `--page-gutter` is the shared starting point. Keep readable content widths bounded by `--content-max-width` where a surface needs a maximum.
- Build page hierarchy with alignment, whitespace, and open rows. Use the existing responsive breakpoints and preserve useful mobile density, touch targets, and document preview behavior.
- Avoid turning every region into a Card. Add a container only when it clarifies grouping, interaction, or hierarchy.

## Borders, radii, and shadows

- Use semantic border tokens. Prefer fine, low-contrast separators; reserve stronger borders for active, focused, or high-importance boundaries.
- Use the shared radius scale, based on a 6px base radius. Keep corners restrained and consistent; do not default to pills or oversized rounding.
- Shadows are uncommon. Use `shadow-editorial` for subtle depth on a document or preview surface and `shadow-overlay` for overlays when needed. Prefer borders and surface shifts for ordinary controls and content grouping.

## Controls and interaction

- Reuse shadcn/ui and Radix primitives. Use their semantic states and Tailwind classes; do not create parallel control patterns.
- Controls should have clear labels, concise copy, and consistent sizing. Use the primary ink treatment for the main action, quiet outlines for secondary actions, and destructive styling only for destructive actions.
- Keep hover feedback subtle and functional. Disabled, selected, invalid, and loading states must remain distinguishable in both themes.
- Keyboard focus must remain visible. Use the semantic `ring` token or the shared `:focus-visible` outline; do not remove focus indication without replacing it.

## Icons

- Use the existing Lucide icon set. Keep icon size and stroke weight consistent with adjacent text and controls.
- Icons should clarify an action or state. Avoid decorative icon clusters, emoji, and icon-only controls without an accessible name.

## Motion

- Motion is brief and functional: communicate hover, focus, selection, loading, and state changes without distracting from the document or current task.
- Use existing CSS transitions and Motion/LazyMotion infrastructure. Shared timing tokens are `--duration-quick` and `--duration-standard`; use the established quart easing tokens where appropriate.
- Avoid large travel, springy decoration, and motion that delays access to content. Respect `prefers-reduced-motion`; nonessential animation and transitions must be suppressed.

## Scope and source of truth

- Existing application behavior, accessibility, routing, persistence, document models, and responsive functionality remain authoritative.
- The reference guides visual direction only. Do not transfer its prototype code, demo content, or page-specific implementation into production.
- Keep the document preview as the visual focus in the builder, and do not apply application UI styling rules to resume output.
