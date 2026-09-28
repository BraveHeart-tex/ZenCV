# Definition-driven generic renderer

Phase 4 keeps Work Experience on its Phase 3 semantic form and moves only the
non-Work generic editor path to resolved Semantic Fields and public definition
metadata. The renderer never examines persisted names or types, field keys,
adjacency, or array position; explicit controls, visibility tiers, widths, date
ranges, and section editor layout preserve the existing UI instead.

## Considered Options

- Preserve the legacy field mapper and replace its conditions incrementally.
- Add a generic fallback for unknown persisted fields.
- Fold Work Experience back into the generic path.

These options retain or reintroduce the hidden conventions that Phase 4 removes.
Strict hydration remains the compatibility seam, and Work Experience remains the
completed semantic vertical slice.
