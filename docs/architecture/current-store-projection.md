# Current Store Projection

`CurrentStoreProjection` is the temporary, internal record-shaped read boundary
between the authoritative Builder Document and existing Builder Store consumers.
It does not persist, mutate, or synchronize document values. Its stable record
views only delegate reads to the corresponding Semantic Section, Item, or Field;
view caches are cleared whenever a new authoritative Builder Document is
published.

Only `builderRootStore.ts` may import the projection. The architecture test
enforces that import allowlist and the legacy persistence DTO allowlist.

Deletion plan:

- Phase 3 removes Work Experience consumers.
- Phase 4 removes generic renderer consumers.
- Phase 6 removes the remaining semantic-consumer usage and deletes this module.
