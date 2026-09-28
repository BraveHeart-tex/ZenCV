# Phase 4 - Definition-driven generic renderer

## Decision and scope

Phase 4 migrates the non-Work Document Builder renderer, including Custom, to
the resolved `editableFields` projection and its public definition metadata.
Work Experience remains on `WorkExperienceForm`. It is a Phase 3 semantic form,
not a generic-renderer consumer.

This phase does not migrate remaining semantic sections, redesign the document
model, add a persistence boundary, change Dexie, or change reusable inputs'
visual styling and behavior except where a legacy inference must be removed.

## Renderer input contract

The renderer accepts only `readonly SemanticField[]` from
`BuilderItemModel.editableFields`. The fields are already resolved, share their
identity with the authoritative document graph, and are ordered by definition
`order` during hydration.

Renderers and inputs may use public definition metadata only:

- `control` selects the input.
- `visibility` selects the primary or additional disclosure tier.
- `width` selects the field grid span.
- `dateRange` defines a paired date render unit and its `allowPresent`
  capability.
- `options`, `placeholder`, and `richText` supply the corresponding input
  behavior.
- the section's explicit `editorLayout` supplies its responsive grid policy.
- the field's presentation-only `labelRow: 'compact'` preserves the current
  compact Wanted Job Title label row without a `fieldKey` branch.

The public field definition continues to omit `persistedName` and
`expectedPersistedType`. Generic rendering must not inspect a field name, field
key, persisted type, field-array index, item ID, or section key to choose
controls or layout.

`editorLayout` is intentionally narrow. For Phase 4 it records the Personal
Details grid policy as `{ mobileColumns: 1, desktopColumns: 2,
desktopBreakpoint: 'md' }`; the standard generic grid remains its current
two-column policy. It is not a general layout DSL.

## Render plan

Replace `useFieldMapper` with a pure render-plan helper. It receives resolved
fields from one item and returns ordered render units:

- `field` - one non-date Semantic Field.
- `dateRange` - exactly one declared start and end field that share
  `dateRange.key`.

The planner groups dates by `dateRange.key` and roles, never by adjacency. A
date-range unit spans the full grid row and renders start/end inputs side by
side. It belongs wholly to one visibility tier. This is the only multi-field
layout unit in Phase 4; do not add a generic layout-group abstraction.

Registry validation must reject invalid `visibility` and `width` literals,
date-range members with different visibility tiers, and date-range fields whose
width is not `half`. Existing validation continues to require one start and one
end and permits `allowPresent` only on an end field.

Strict hydration makes an incomplete resolved pair unreachable. The planner
must nevertheless render a resolved month field independently if an incomplete
pair reaches it, with a development diagnostic; it must never silently omit an
editable value.

## Compatibility behavior

| Legacy inference | Phase 4 behavior |
| --- | --- |
| URL input selected from label/name | `control: 'url'` selects the URL input. |
| Adjacent month fields become a pair | Matching `dateRange.key` plus start/end roles become a pair. |
| First six fields are primary | `visibility: 'primary'` is rendered before `additional`. |
| More than six fields creates disclosure | Disclosure appears only when additional units exist. |
| Rich text/textarea force full width | `width: 'full'` spans the grid. |
| Personal Details checks its section key | `editorLayout` declares its responsive grid. |
| Wanted Job Title checks its field key | `labelRow: 'compact'` declares its presentation. |
| Non-Work month fields always allow Present | `dateRange.allowPresent` applies universally. |

The disclosure keeps its existing local-storage key, copy, animation, and
default state. Fields keep their existing order, labels, controls, focus refs,
debounced saves, validation, and input styling.

Known malformed records do not get a renderer fallback. The existing strict
definition mapper and hydration diagnostics remain the legacy-name
compatibility seam: unknown, duplicate, missing, or incompatible fields fail
hydration before the renderer receives data. No control may be inferred from a
persisted field type as a fallback.

## Required implementation changes

1. Extend field and section definition inputs and their public projections with
   the accepted presentation metadata. Keep persistence-only fields private.
2. Strengthen definition validation for the render-plan invariants.
3. Replace `useFieldMapper` and `MAX_VISIBLE_FIELDS` use with the pure render
   planner and visibility-tier container.
4. Make `SectionItem`, `HidableFieldContainer`, and `SectionField` render
   plan units and definition widths/layouts. Remove section-key, field-key,
   field-count, control-width, and array-position branches.
5. Make `DateFieldInput` read `dateRange.allowPresent` directly for every
   resolved date field. Delete the Work-specific compatibility branch.
6. Leave `WorkExperienceForm` and the Work Experience routing branch unchanged.

## Regression gate

Phase 4 is complete only when tests prove:

- shuffled persisted input renders in definition order;
- every generic control, including URL, comes from public definitions without
  persisted-name access;
- `allowPresent` follows metadata in every section;
- date pairing follows range key and roles rather than adjacency, and incomplete
  runtime units remain visible;
- primary/additional disclosure follows visibility rather than count;
- field spans follow width and Personal Details follows its declared responsive
  layout;
- the compact label row follows explicit metadata; and
- Work Experience continues to route to and render its typed form unchanged.
