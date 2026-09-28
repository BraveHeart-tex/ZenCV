# Work Experience semantic vertical migration

Phase 3 migrates Work Experience alone to typed item and section models, a
semantic PDF snapshot, and semantic form, heading, score, ATS, rich-text,
focus, and lifecycle consumers. Existing Dexie records remain compatible only
through the definition mapper and invalid Work field sets continue to fail
hydration with internal diagnostics. Other sections retain the temporary
record-shaped projection until their planned migrations.
