import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  readFileSync(join(process.cwd(), 'src/lib', path), 'utf8');

describe('active Builder Document persistence boundary', () => {
  it('keeps load and field saves behind document persistence', () => {
    const session = read('stores/documentBuilder/builderSession.ts');
    const document = read('builderDocument/builderDocument.ts');
    expect(session).not.toContain('client-db/documentService');
    expect(session).not.toContain('getFullDocumentStructure');
    expect(document).not.toContain('client-db/fieldService');
    expect(document).not.toContain('client-db/documentService');
    expect(document).not.toContain('updateField(');
  });

  it('keeps the port document-scoped and free of table CRUD', () => {
    const port = read('builderDocument/documentPersistence.ts');
    expect(port).toMatch(/load\(\s*documentId: number\s*\)/);
    expect(port).toContain('saveFieldValue(');
    expect(port).toContain('renameDocument(');
    expect(port).toContain('saveAppearance(');
    expect(port).not.toMatch(
      /\b(transaction|table|updateField|insert|deleteField)\b/
    );
  });
});
