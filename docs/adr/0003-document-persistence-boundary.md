# Document-oriented persistence boundary for the Builder

Phase 5 routes active Document Builder commands through one injected document-oriented persistence interface while keeping Dexie records private to hydration. The Builder Document retains optimistic state and rollback; the adapter owns transactions, durable rules, record assembly, and stored formats. This avoids mirroring Dexie table CRUD in a repository layer and preserves existing IDs and schema during the remaining semantic-section migration.

## Considered Options

- Keep direct service imports in models: leaves persistence ownership split across the Builder and Dexie helpers.
- Add one repository per table: reproduces the database API and makes multi-record commands span repositories.
- Rebuild the domain model and schema together with persistence: expands Phase 5 and risks Phase 4 behavior.
