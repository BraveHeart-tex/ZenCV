# Phase 6: Remaining semantic consumers

## Problem Statement

As a resume editor, I need the details I enter to appear consistently in my resume, score, ATS checks, overview, and navigation. After Phase 5, the Builder Document owns editing and persistence, but remaining consumers reconstruct built-in sections through persisted names and record-shaped views. This makes equivalent resume concepts depend on different lookups and makes the final migration unsafe to split without explicit boundaries.

## Solution

Expose built-in sections through the authoritative Builder Document and one read-only Resume Document Snapshot. Move PDF templates, score, ATS, headings, overview, and navigation to semantic values and keys section by section. Keep Custom and supported Unknown Legacy Fields on a generic path. Remove the temporary persistence-shaped consumer projection after every consumer has moved, while preserving the current editor and rendered behavior.

## User Stories

1. As a resume editor, I want Personal Details to appear consistently in my editor and PDF, so that my name and contact information match.
2. As a resume editor, I want my Summary to appear under its current title in every supported template, so that my introduction remains recognizable.
3. As a resume editor, I want Links to remain within the Personal Details PDF block, so that my contact area keeps its current layout.
4. As a resume editor, I want a Link URL normalized and given the current compact fallback label, so that the exported link remains usable.
5. As a resume editor, I want Education entries to keep their values and order across templates, so that my qualifications are accurate.
6. As a resume editor, I want Internship entries to keep their values and order across templates, so that my experience is accurate.
7. As a resume editor, I want Course entries to keep their values and order across templates, so that my training is accurate.
8. As a resume editor, I want Skills to retain their level display and comma-separated options, so that the PDF reflects my selected presentation.
9. As a resume editor, I want Languages and levels to render consistently, so that my proficiency is clear.
10. As a resume editor, I want References to honor the current hide option, so that private contact details are not exposed contrary to my setting.
11. As a resume editor, I want Hobbies to retain their current PDF output, so that optional content is not lost.
12. As a resume editor, I want Custom sections to retain their generic editor and PDF behavior, so that flexible content still works.
13. As a resume editor, I want a supported Unknown Legacy Field in a known section to stay editable, so that an extra value is not silently discarded.
14. As a resume editor, I want unknown built-in fields excluded from named PDF, score, and ATS values, so that an unrelated value is not misinterpreted.
15. As a resume editor, I want structurally invalid fields and unknown section types to fail with diagnostics, so that the builder does not guess at their meaning.
16. As a resume editor, I want section and item order preserved in the PDF, so that rearranging my resume changes the output predictably.
17. As a resume editor, I want empty entries to be included or omitted as they are today, so that the migration does not alter the visible resume.
18. As a resume editor, I want existing PDF template layouts preserved, so that changing the underlying model does not unexpectedly redesign my resume.
19. As a resume editor, I want score checks to use the section and field I actually edited, so that the score responds to my content.
20. As a resume editor, I want the current score weights and thresholds preserved, so that the meaning of my score does not change during migration.
21. As a resume editor, I want a score suggestion to focus its intended field, so that I can act on it quickly.
22. As a resume editor, I want an add-item suggestion to open or create the correct section item, so that I can follow the suggested action.
23. As a resume editor, I want email, phone, job title, Summary, and Work Experience ATS checks to keep their current results, so that feedback stays consistent.
24. As a resume editor, I want edits to update PDF, score, and ATS results with their current timing, so that feedback remains responsive and stable.
25. As a resume editor, I want each built-in item heading to describe its semantic content, so that collapsed items remain easy to find.
26. As a resume editor, I want the overview to list and navigate to the same sections and items, so that I can move through my document reliably.
27. As a resume editor, I want Custom headings and navigation to keep working, so that generic content remains discoverable.
28. As a resume editor, I want a section that is absent to remain absent from output and suggestions under the current rules, so that the migration does not invent content.
29. As a Document Builder maintainer, I want one semantic snapshot with stable item identities, so that PDF and derived consumers do not reconstruct field records.
30. As a Document Builder maintainer, I want section options expressed by their meaning, so that consumers do not interpret stored metadata strings.
31. As a Document Builder maintainer, I want score suggestions to carry semantic section and field keys, so that navigation does not depend on English persisted names.
32. As a Document Builder maintainer, I want each section migrated end to end in a buildable issue, so that regressions are isolated to one consumer group.
33. As a Document Builder maintainer, I want the temporary read adapter removed after cutover, so that it cannot become another public data source.
34. As a Document Builder maintainer, I want consumer-boundary checks, so that future UI or PDF changes cannot reintroduce persistence-shaped inputs.

## Implementation Decisions

- Built-in consumers use section keys, Semantic Fields, and domain IDs. Persisted names, `DEX_*` records, and stored section types stay behind the definition, hydration, and persistence boundary.
- The snapshot carries semantic values, stable item IDs, section order and titles, and typed section options. PDF helpers keep URL display formatting and template layout. All five templates retain their current visible output, ordering, empty-entry behavior, and Links placement.
- Unknown Legacy Fields in known sections remain editable through supported generic controls and produce internal nonfatal diagnostics. Unsupported field types, missing or duplicate required fields, and unknown section types still fail hydration. Unknown built-in fields do not supply PDF, score, or ATS values.
- Score suggestions carry semantic section and field keys. Each section issue moves its own checks and click targets. Current score and ATS rules, debounce timing, headings, navigation, and template options remain behaviorally stable.
- A temporary read-only PDF adapter may coexist with the snapshot while sections move. It is deleted at the final cutover. No migration of historical user data is required.
- Production consumers end with no `TemplateDataSection`, `CurrentStoreProjection`, or raw `DEX_*` imports. Custom still uses the generic editor and PDF path through public generic field values.
- Keep one authoritative editable Builder Document. The snapshot and temporary adapter are derived reads; neither persists, mutates, or synchronizes an independent document copy.
- Keep the existing Dexie schema, IDs, record formats, save timing, and Phase 5 document-oriented persistence contract.

## Testing Decisions

- Prefer the highest existing seam: load and edit through Builder Session and Builder Document, then assert the semantic snapshot, score, ATS, and observable editor results. Tests should describe user-visible values, order, identities, and actions, not private mapper calls or record traversal.
- Extend existing Builder Document hydration, Builder Session, PDF helper, Work Experience template, and Section Item integration tests as prior art. Add focused template tests where distinct layouts or section options require them.
- Exercise filled, empty, reordered, and option-controlled sections across London, Manhattan, Tokyo, Dubai, and Sydney. Compare semantic snapshot data and rendered content, including Links placement and normalization, empty-entry filtering, and stable IDs.
- Verify score weights, ATS pass/fail results, suggestion click targets, item headings, Custom behavior, and overview navigation through existing consumer seams.
- Verify supported Unknown Legacy Fields load and remain editable with internal diagnostics but do not satisfy built-in PDF, score, or ATS checks. Verify unsupported types and structurally invalid content still fail hydration.
- Replace the temporary projection allowlist test with a consumer-boundary test that detects `TemplateDataSection`, `CurrentStoreProjection`, or raw `DEX_*` imports outside approved boundaries. Run relevant tests, build, and lint.

## Out of Scope

- Redesigning the Builder Document, Semantic Field, Definition-driven Generic Renderer, PDF layouts, scoring policy, or ATS policy.
- Changing the Dexie schema, persistence contract, save behavior, or document gallery operations.
- Historical user-data migration or a broad catalog of legacy record variants. The app has no real users yet.
- New product warnings for unknown fields, unrelated cleanup, or fixes for existing output anomalies unless they otherwise drop or misattribute user content.

## Further Notes

The implementation is split into the following dependent issues. Every issue leaves the app buildable and tests its full consumer path.

1. **Foundation** - Add the complete semantic Resume Document Snapshot and supported Unknown Legacy Field fallback; make score suggestion intents semantic; add snapshot, hydration, and boundary tests. Keep a temporary read-only PDF adapter.
2. **Personal Details, Summary, Links** - Move PDF output in all five templates, ATS, score checks and actions, and Links headings/navigation. Preserve Links URL normalization and placement under Personal Details.
3. **Education** - Move PDF output in all templates, score, headings, overview, and navigation.
4. **Internships** - Move PDF output in all templates, score, headings, overview, and navigation.
5. **Courses** - Move PDF output in all templates, headings, overview, and navigation.
6. **Skills** - Move PDF output in all templates, score, headings, overview, navigation, and typed display options.
7. **Languages** - Move PDF output in all templates, score, headings, overview, and navigation.
8. **References** - Move PDF output in all templates, headings, overview, navigation, and the typed hide option.
9. **Hobbies** - Move PDF output in supported templates and its editor/overview reads to the semantic model.
10. **Final removal** - Move remaining shared score, ATS, overview, navigation, and Custom generic reads; delete the temporary adapter, `CurrentStoreProjection`, `TemplateDataSection`, and persisted-name lookup helpers; replace projection allowlist tests with consumer-boundary assertions.

Phase 5's completed persistence cutover is the starting point. Its private persisted-record handoff to hydration remains. The Work Experience semantic path and the three existing ADRs remain authoritative; the extra-field exception is recorded in ADR 0004.
