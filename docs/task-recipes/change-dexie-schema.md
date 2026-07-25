# Change Dexie Schema

1. Add a new `clientDb.version(n)` block in `src/lib/client-db/clientDb.ts`; do not edit prior version definitions.
2. Update interfaces in `src/lib/client-db/clientDbSchema.ts`.
3. Write `.upgrade()` migration logic for existing records.
4. Preserve explicit `createdAt` and `updatedAt` values during document creation/cloning.
5. Keep Dexie-returned records immutable from the store perspective; wrap section metadata with `parseMetadataToObservable(raw)` before storing.
6. Metadata parsers must handle raw JSON strings and already-parsed arrays/objects.
7. MobX mutations need `runInAction`; parameterized getters should use `computedFn`.
8. Async writes need optimistic updates with explicit rollback.
9. Local builder writes are silent; do not add "Saving..." or "Saved" UI for IndexedDB edits.
10. Run relevant store/database tests with `pnpm test`.
