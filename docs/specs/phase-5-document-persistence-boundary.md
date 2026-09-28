# Phase 5: Document persistence boundary

## Problem Statement

As a resume editor, I need my Document Builder changes to remain consistent and durable while I edit, reorder, add, and remove content. Today the active Builder Document calls Dexie services directly, and section creation contains its own multi-table transaction. Persistence rules and stored formats are split across the model and database helpers. A failed multi-record update can leave durable state different from the optimistic state the editor restores. This makes reliable changes to the editor harder without changing the experience that already works.

## Solution

Route every active Document Builder load and write through one document-oriented persistence interface. Keep immediate edits, debounced Semantic Field saves, optimistic updates, and rollback in the authoritative Builder Document. Put ownership checks, durable limits, record assembly, atomic commands, cascades, and stored string encoding in a Dexie adapter. Keep existing IDs, schema, legacy hydration, and visible editor behavior.

## User Stories

1. As a resume editor, I want an existing document to load with the same content and order, so that I can continue editing without a migration step.
2. As a resume editor with legacy data, I want invalid records to keep failing strict hydration with diagnostics, so that the editor does not guess at my content.
3. As a resume editor, I want a Semantic Field edit to appear immediately, so that typing stays responsive.
4. As a resume editor, I want field values to retain their current debounced and commit-on-blur saves, so that editing behavior stays familiar.
5. As a resume editor, I want a failed field save to restore the latest durable value, so that the editor does not display a change that was not saved.
6. As a resume editor, I want a newer draft protected when an older save fails, so that an out-of-order response cannot erase current typing.
7. As a resume editor, I want document title edits to remain optimistic and reversible on failure, so that I can see the intended title immediately.
8. As a resume editor, I want template and accent changes to retain the same appearance and persisted settings, so that my resume does not change during the migration.
9. As a resume editor, I want section titles and metadata edits to retain their current behavior, so that my section options remain reliable.
10. As a resume editor, I want a newly added section to include its initial item and fields together, so that no partial section appears after a failed save.
11. As a resume editor, I want optional single-instance sections to reject duplicates even if another tab added one, so that the document keeps its section rules.
12. As a resume editor, I want multiple Custom sections to remain possible, so that existing flexible content stays available.
13. As a resume editor, I want a newly added item to include all of its defined fields, so that it is ready to edit as soon as it appears.
14. As a resume editor, I want new sections, items, and fields to keep Dexie-allocated IDs, so that existing references and UI state remain stable.
15. As a resume editor, I want item limits checked against persisted content, so that two tabs cannot exceed a section's allowed count.
16. As a resume editor, I want a section deletion to remove its items and fields atomically, so that no orphaned content remains.
17. As a resume editor, I want an item deletion to remove its fields atomically, so that deleted content does not reappear.
18. As a resume editor, I want a failed deletion to restore the same in-memory item or section, so that open controls and current edits remain intact.
19. As a resume editor, I want required sections and minimum item counts protected when I delete content, so that a stale tab cannot violate document rules.
20. As a resume editor, I want section and item reorders to save as one operation, so that a partial failure cannot leave a different durable order.
21. As a resume editor, I want a reorder rejected when another tab changed its sibling list, so that the editor can restore my prior order rather than persist gaps or duplicates.
22. As a resume editor, I want ordinary concurrent value, title, and settings edits to retain last-write-wins behavior, so that Phase 5 does not introduce a new merge workflow.
23. As a resume editor, I want a field save racing with deletion to settle without recreating deleted content, so that removed items stay removed.
24. As a resume editor, I want navigation to wait for pending structural commands and field saves, so that I do not leave before required writes complete.
25. As a resume editor, I want a failed close or flush to remain retryable, so that I can recover without reopening the document.
26. As a resume editor, I want the session to reload durable state if an unexpected post-create model failure occurs, so that the editor and saved document agree.
27. As a Document Builder maintainer, I want one injectable persistence contract, so that command behavior can be tested without mocking individual database tables.
28. As a Document Builder maintainer, I want each command to state its document scope and expected failure reason, so that stale IDs and durable rule failures are handled consistently.

## Implementation Decisions

- One injected `DocumentPersistence` instance serves the active `BuilderSession`, its Builder Document, and Semantic Fields. The production implementation uses Dexie; a test-only in-memory adapter implements the same contract.
- The contract is document- and command-oriented. It has `load`, `saveFieldValue`, `renameDocument`, `saveAppearance`, `addSection`, `removeSection`, `renameSection`, `saveSectionMetadata`, `reorderSections`, `addItem`, `removeItem`, and `reorderItems`. Each takes the active document ID and intent-specific values. It exposes no table names, generic update API, transaction callback, Dexie update specification, or insert DTO input.
- `load` returns a private persisted document/section/item/field graph to the existing strict hydrator. Created-section and created-item commands return complete persisted records for the same mapping path. Persisted records remain a private adapter-to-hydrator handoff, not the public command language.
- Every command returns a discriminated success or expected rejection. Rejection reasons are `notFound`, `alreadyExists`, `limitReached`, `minimumRequired`, and `membershipChanged`. Unexpected storage failures throw. The Builder Document maps these to current user-facing results and rollback behavior; callers do not inspect Dexie row counts.
- The Builder Document retains immediate prechecks, optimistic state changes, snapshots, command ordering, per-field debounce/version queues, rollback, and flush behavior. The adapter owns document membership checks, durable cardinality checks, ID allocation, record assembly, transactions, cascades, and serialization.
- Adapter creation uses the existing section definitions and item templates. The model passes section identity and user values, not table records. The adapter computes new display order from persisted siblings and validates complete created records before transaction commit.
- Section and item creation remain persist-first. Dexie allocates the current numeric IDs; no temporary IDs or continuously synchronized DTO tree is added.
- The model passes structured section metadata and template settings. The adapter writes their current string formats, including the existing empty metadata representation on section creation. Strict legacy parsing and diagnostics remain in hydration.
- Each command is independently atomic. Multi-record creates, cascades, and reorders use transactions. A missing target, partial update, violated rule, or changed reorder membership leaves persisted state unchanged. Field saves remain separate commands.
- Every write verifies that its target belongs to the active document. Required-section and minimum-item checks occur inside delete transactions; uniqueness and maximum-item checks occur inside create transactions.
- A reorder receives the complete ordered sibling list. The adapter compares it with persisted membership and writes sequential orders in one transaction. Equal-member concurrent reorders are last-write-wins; changed membership rejects.
- Ordinary field, title, metadata, and appearance writes retain last-write-wins behavior. Phase 5 adds no schema version, version column, temporary ID, or cross-tab merge protocol.
- An in-flight field write may settle during optimistic deletion, but a late write cannot recreate a deleted record. On cascade failure, the model reattaches the same objects. Field disposal timing and version-aware rollback remain unchanged.
- `closeAndFlush` stops new structural commands, awaits the structural queue, then flushes fields. Navigation proceeds only after required writes succeed; a failure leaves the session retryable.
- If a create commits but model construction unexpectedly fails, the model signals reconciliation failure through a session-supplied callback. The session reloads durable state and reports failure; it does not issue a compensating delete.
- Cut over load, field saves, document updates, then section and item commands through the port. Phase 5 finishes only when the active session, Builder Document, and Semantic Field path have no direct Dexie or database-service imports. Keep existing UI commands and remaining section consumers in place.

## Testing Decisions

- Prefer the highest existing seam: exercise Builder Session and Builder Document commands through the injected persistence interface, asserting observable state, saved records, results, identity, and rollback. Do not assert private table calls, transaction helper calls, or internal array traversal.
- Use a test-only in-memory adapter for model and session tests. It must allocate IDs, enforce ownership and cardinality, roll back failed commands, and support controlled failures. Reuse command-contract cases for expected outcomes and unchanged state after rejection.
- Add focused Dexie integration tests in an IndexedDB test environment for real transaction rollback, cascades, complete-list reorders, durable limits, same-schema IDs, and exact metadata/template-settings encoding. Add a test-only IndexedDB setup if the current test environment lacks one.
- Extend existing Builder Document command, Semantic Field, hydration, and Builder Session tests as prior art. Cover immediate state, latest-value rollback, field save/delete races, reattachment of the same objects, strict legacy diagnostics, close/flush failure and retry, and post-commit reconciliation.
- Add an architecture guard that fails if the active session/model/field path imports Dexie or database services directly or if the port grows generic table CRUD.
- Run relevant tests, typecheck/build, and lint. Tests describe editor and durable outcomes, not implementation call sequences.

## Out of Scope

- Migrating remaining semantic sections, PDF, score, ATS, heading, and navigation consumers planned for a later phase.
- Redesigning the Builder Document domain model, Semantic Field, or Definition-driven Generic Renderer.
- Changing the Dexie schema, persisted identities, record formats, or normal save timing.
- Moving document gallery listing, creation, copying, or deletion into this boundary.
- A cross-tab merge protocol, new versioning scheme, temporary IDs, or unrelated cleanup.

## Further Notes

- Phase 4's strict Legacy-name compatibility seam and Work Experience Form remain the compatibility baseline.
- The accepted boundary decision is recorded in ADR 0003. The issue is ready for implementation when the interface, adapter, model cutover, and regression gate are delivered together.
