# ZenCV Document Builder

The Document Builder edits a resume as one authoritative document graph while
retaining persisted records only as a storage boundary.

## Language

**Semantic Field**:
A resume value with a stable section-scoped key, such as a Work Experience
item's `role`, independent of its persisted legacy name and display label.
_Avoid_: field name, label, database field

**Work Experience Item**:
One ordered employment entry in the required Work Experience section, with the
semantic fields role, employer, start date, end date, city, and description.
_Avoid_: generic item, employment-history record

**Work Experience Entry**:
A read-only semantic projection of a Work Experience Item for PDF, ATS, score,
heading, and navigation consumers.
_Avoid_: template data item, field array

**Work Experience Form**:
The Work-specific editor surface that binds typed Work Experience Item fields to
the existing shared controls and explicitly renders the employment date range.
_Avoid_: generic field mapper, record-driven form

**Work Experience Lifecycle**:
The ordered creation, removal, and reordering of Work Experience Items through
typed section commands while preserving their persisted identities.
_Avoid_: item-table mutation, ID-based UI command

**Legacy-name compatibility seam**:
The section-definition mapping that resolves a persisted Work Experience field
name to its stable semantic key without making that name public application API.
_Avoid_: label lookup, field-name scan

**Definition-driven Generic Renderer**:
The non-Work editor path that renders only resolved Semantic Fields from their
public definition metadata, without inspecting persisted records or labels.
_Avoid_: field mapper, record-driven renderer

**Date Range Render Unit**:
One explicit start/end pair identified by a shared date-range key and rendered
as one editor-layout unit, independent of field adjacency.
_Avoid_: adjacent dates, paired next field

**Field Visibility Tier**:
A Semantic Field's declared editor visibility, either primary or additional,
which controls disclosure grouping independently of field count.
_Avoid_: first six fields, extra-field cutoff

**Unknown Legacy Field**:
An extra resume value in a known built-in section that has no current Semantic
Field key. It remains editable through the generic field path.
_Avoid_: invalid field, discarded field

**Resume Document Snapshot**:
A read-only semantic view of the active resume for PDF and other derived
consumers, with built-in section values and generic Custom content.
_Avoid_: template data section, persisted record graph
