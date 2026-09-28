## Problem Statement

As a resume editor, I need the Document Builder to render the same fields and
controls reliably when templates evolve. Today the generic editor derives URL
controls, date pairs, disclosure grouping, field width, and some presentation
from legacy names, control types, adjacency, array position, or section and
field keys. A harmless definition or stored-record reorder can therefore alter
the editor unexpectedly, while a date can disappear when it has no adjacent
partner.

## Solution

Move the non-Work Definition-driven Generic Renderer, including Custom, onto
resolved Semantic Fields and their public definition metadata. It will produce
an explicit field-or-date-range render plan, use declared visibility, width,
capabilities, and section editor layout, and retain existing visual behavior.
Work Experience remains on its completed semantic form. The Legacy-name
compatibility seam remains strict: malformed legacy fields fail hydration rather
than receiving a new inference-based renderer fallback.

## User Stories

1. As a resume editor, I want each generic field to use its declared control, so that changing a display label does not change its input.
2. As a resume editor, I want link fields to remain URL inputs, so that URL validation and normalization remain available regardless of the label text.
3. As a resume editor, I want date ranges to stay visually paired, so that I can enter their start and end dates together.
4. As a resume editor, I want a date pair to remain paired even if another field is inserted between its stored records, so that record ordering cannot break the editor.
5. As a resume editor, I want a visible date field never to disappear when its declared partner is unexpectedly unavailable, so that I never lose access to an editable value.
6. As a resume editor, I want only fields that explicitly allow it to offer Present, so that start dates cannot accidentally be marked as ongoing.
7. As a resume editor, I want Present behavior to be consistent across all generic sections, so that equivalent end-date fields behave the same way.
8. As a resume editor, I want primary details to be immediately visible, so that the information I edit most often stays accessible.
9. As a resume editor, I want additional details behind the existing disclosure control only when they are explicitly additional, so that adding a field does not unexpectedly hide another one.
10. As a resume editor, I want the existing additional-details animation, copy, default state, and remembered preference to remain familiar.
11. As a resume editor, I want full-width fields to span the editor grid because their definition says so, so that rich text and text areas retain their layout without type-based exceptions.
12. As a resume editor, I want Personal Details to retain its responsive single-column mobile and two-column desktop layout, so that the form remains easy to scan on every screen size.
13. As a resume editor, I want the compact Wanted Job Title presentation to remain intact, so that this familiar layout detail does not regress during migration.
14. As a resume editor, I want Custom sections to remain editable through the generic path, so that custom resume content continues to work without a section-specific form.
15. As a resume editor, I want Work Experience editing to remain unchanged, so that the Phase 3 semantic form, employment date fieldset, and workflow remain stable.
16. As a resume editor, I want existing labels, focus behavior, debounced saves, validation, and input styling preserved, so that this architectural migration does not disrupt editing.
17. As a resume editor with legacy resume data, I want invalid records to fail safely with existing diagnostics rather than be guessed at, so that the application does not silently render the wrong control or lose data.

## Implementation Decisions

- Scope the migration to the non-Work generic editor path, including Custom. Keep the Work Experience Form and its routing unchanged.
- Feed the renderer only resolved `editableFields` from the authoritative Builder Document. Their public definitions are the rendering contract; persisted names and expected persisted types remain private to the Legacy-name compatibility seam.
- Use the existing explicit field metadata as canonical: control, definition order, visibility tier, width, placeholder, select options, rich-text metadata, and date-range metadata. Do not add parallel aliases for those concepts.
- Replace the legacy field mapper with one pure render-plan seam. It emits a single-field unit or a Date Range Render Unit and preserves definition order.
- Form date pairs by the shared date-range key and explicit start/end roles, never by field adjacency. A valid pair occupies a full row and renders its two fields side by side. Do not introduce a general layout-group abstraction in this phase.
- Validate that date-range members have the same visibility tier and half width. Retain existing validation that requires exactly one start and end and only lets an end date allow Present.
- If an impossible incomplete date range reaches the render plan, emit a development diagnostic and render the resolved date field independently. Never omit it.
- Use visibility tiers rather than field count to construct primary and additional units. Render the existing disclosure only when additional units exist and retain its current local preference behavior.
- Use field width for grid span. Move Personal Details' responsive grid policy into a narrow explicit section editor-layout definition rather than a section-key branch.
- Preserve the compact Wanted Job Title label row through a narrow presentation-only field definition capability instead of a field-key branch.
- Read Present eligibility directly from date-range metadata for every generic date field. Remove the Work-specific compatibility branch.
- Keep strict hydration for unknown, duplicate, missing, and incompatible legacy fields. Do not infer a fallback control from persisted names or types.
- Do not change the Dexie schema, persistence services, document-persistence boundary, remaining semantic-section consumers, reusable input visuals, or generic-editor save semantics.

## Testing Decisions

- The highest test seam is the pure render-plan helper: assert observable output units and ordering from resolved Semantic Fields, rather than CSS implementation details or component internals.
- Add definition-registry tests for valid and invalid visibility, width, date-range pairing, and Present capabilities. Existing definition mapping and hydration tests are the prior art for this seam.
- Add render-plan tests using shuffled persisted source records to prove definition order, date grouping by explicit key and roles, visibility-tier grouping, width span selection, and safe handling of an incomplete runtime pair.
- Add component integration tests for control selection, URL behavior, metadata-only Present behavior, disclosure behavior, explicit responsive Personal Details layout, and the compact-label capability. Assert user-visible controls and layout classes only where they are the public responsive contract.
- Retain and extend the existing typed Work Experience form route tests to prove it remains outside the generic renderer migration.
- Regression tests should describe external behavior: what fields, controls, pairs, visibility, and capabilities the editor presents. They must not assert persistence traversal, field-array indices, or internal mapper call sequences.

## Out of Scope

- Migrating Work Experience onto the generic renderer.
- Migrating remaining semantic sections and their PDF, score, ATS, heading, or navigation consumers.
- Redesigning the Builder Document domain model.
- Introducing the document-persistence seam or altering persistence transactions.
- Changing the Dexie schema, persisted record identities, or field storage format.
- Creating a general-purpose layout system or arbitrary field-group abstraction.
- Redesigning input components, styles, copy, focus semantics, validation, or save behavior beyond removing legacy inference.

## Further Notes

- The agreed terminology is Semantic Field, Definition-driven Generic Renderer, Date Range Render Unit, Field Visibility Tier, and Legacy-name compatibility seam.
- ADR 0002 records why strict hydration and the Work Experience exception are deliberate.
- The completed Phase 3 semantic vertical remains the compatibility baseline for Work Experience.
