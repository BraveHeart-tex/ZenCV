import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  readFileSync(join(process.cwd(), 'src/lib', path), 'utf8');

describe('active Builder Document persistence boundary', () => {
  it('keeps load and field saves behind document persistence', () => {
    const session = read('stores/documentBuilder/builderSession.ts');
    const composition = read(
      'stores/documentBuilder/builderSessionPersistence.ts'
    );
    const document = read('builderDocument/builderDocument.ts');
    expect(session).not.toContain('client-db/documentService');
    expect(session).not.toContain('client-db/');
    expect(session).not.toContain('DexieDocumentPersistence');
    expect(composition).toContain('DexieDocumentPersistence');
    expect(session).not.toContain('getFullDocumentStructure');
    expect(document).not.toContain('client-db/fieldService');
    expect(document).not.toContain('client-db/documentService');
    expect(document).not.toContain('DexieDocumentPersistence');
    const semanticField = document.slice(
      document.indexOf('export class SemanticField'),
      document.indexOf('export class BuilderItemModel')
    );
    expect(semanticField).not.toContain('client-db/');
    expect(document).not.toContain('updateField(');
    expect(document).not.toContain('updateSection(');
    expect(
      document.slice(
        document.indexOf('  addSection('),
        document.indexOf('  removeSection(')
      )
    ).not.toContain('clientDb');
  });

  it('keeps the port document-scoped and free of table CRUD', () => {
    const port = read('builderDocument/documentPersistence.ts');
    expect(port).toMatch(/load\(\s*documentId: number\s*\)/);
    expect(port).toContain('saveFieldValue(');
    expect(port).toContain('renameDocument(');
    expect(port).toContain('saveAppearance(');
    expect(port).toContain('renameSection(');
    expect(port).toContain('saveSectionMetadata(');
    expect(port).toContain('addSection(');
    expect(port).toContain("'minimumRequired'");
    expect(port).toContain("'membershipChanged'");
    expect(port).not.toContain('FieldInsertTemplate');
    expect(port).not.toContain('maxItems');
    expect(port).not.toContain('UpdateSpec');
    expect(port).not.toContain("'conflict'");
    expect(port).not.toMatch(
      /\b(transaction|table|updateField|insert|deleteField)\b/
    );
  });
});
