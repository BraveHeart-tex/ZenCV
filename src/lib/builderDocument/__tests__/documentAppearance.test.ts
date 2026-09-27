import { describe, expect, it } from 'vitest';
import type { ResumeTemplate } from '@/lib/types/documentBuilder.types';
import { hydrateBuilderDocument } from '../builderDocument';
import type { PersistenceResult } from '../documentPersistence';
import { builderDocumentFixture } from './builderDocumentFixture';
import { InMemoryDocumentPersistence } from './inMemoryDocumentPersistence';

const setup = () => {
  const records = builderDocumentFixture();
  records.document.templateSettings = JSON.stringify({
    tokyo: { accentColor: '#123456' },
    sydney: { accentColor: '#abcdef' },
  });
  const persistence = new InMemoryDocumentPersistence(records);
  const hydrated = hydrateBuilderDocument(records, persistence);
  if (!hydrated.success) {
    throw new Error('Expected a document');
  }
  return { document: hydrated.document, persistence };
};

describe('Builder Document title and appearance', () => {
  it('shows title, template, and accent edits immediately and saves structured settings', async () => {
    const { document, persistence } = setup();
    const rename = document.rename('Staff CV');
    expect(document.title).toBe('Staff CV');
    expect(await rename).toEqual({ success: true });
    expect(persistence.records.document.title).toBe('Staff CV');

    const template = document.changeTemplate('dubai');
    expect(document.templateType).toBe('dubai');
    expect(document.accentColor).toBe('#c8a96e');
    const accent = document.changeAccent('#fedcba');
    expect(document.accentColor).toBe('#fedcba');
    expect(await template).toEqual({ success: true });
    expect(await accent).toEqual({ success: true });
    expect(persistence.records.document.templateType).toBe('dubai');
    expect(JSON.parse(persistence.records.document.templateSettings)).toEqual({
      tokyo: { accentColor: '#123456' },
      sydney: { accentColor: '#abcdef' },
      dubai: { accentColor: '#fedcba' },
    });
  });

  it.each([
    'missing',
    'storage',
  ] as const)('restores optimistic title and appearance after %s failure', async (failure) => {
    const { document, persistence } = setup();
    if (failure === 'missing') {
      persistence.renameDocument = async () => ({
        success: false,
        reason: 'notFound',
      });
    } else {
      persistence.saveFailure = new Error('offline');
    }
    const rename = document.rename('Lost');
    expect(document.title).toBe('Lost');
    expect(await rename).toEqual({
      success: false,
      error: 'Failed to rename document',
    });
    expect(document.title).toBe('Resume');

    if (failure === 'missing') {
      persistence.saveAppearance = async () => ({
        success: false,
        reason: 'notFound',
      });
    }
    const template = document.changeTemplate('dubai');
    expect(document.templateType).toBe('dubai');
    expect(await template).toEqual({
      success: false,
      error: 'Failed to update document',
    });
    expect(document.templateType).toBe('tokyo');
    expect(document.accentColor).toBe('#123456');
    const accent = document.changeAccent('#fedcba');
    expect(document.accentColor).toBe('#fedcba');
    expect(await accent).toEqual({
      success: false,
      error: 'Failed to update document',
    });
    expect(document.accentColor).toBe('#123456');
    expect(persistence.records.document.templateSettings).toBe(
      JSON.stringify({
        tokyo: { accentColor: '#123456' },
        sydney: { accentColor: '#abcdef' },
      })
    );
  });

  it('keeps newer optimistic edits visible and saves the final command last', async () => {
    const { document, persistence } = setup();
    let finishFirst: (result: PersistenceResult<void>) => void = () => {};
    const originalSave = persistence.saveAppearance.bind(persistence);
    let calls = 0;
    persistence.saveAppearance = (
      documentId: number,
      templateType: ResumeTemplate,
      settings
    ) => {
      calls += 1;
      if (calls === 1) {
        return new Promise((resolve) => {
          finishFirst = resolve;
        });
      }
      return originalSave(documentId, templateType, settings);
    };

    const first = document.changeAccent('#111111');
    const second = document.changeAccent('#222222');
    expect(document.accentColor).toBe('#222222');
    await Promise.resolve();
    finishFirst({ success: false, reason: 'notFound' });
    expect(await first).toEqual({
      success: false,
      error: 'Failed to update document',
    });
    expect(document.accentColor).toBe('#222222');
    expect(await second).toEqual({ success: true });
    expect(
      JSON.parse(persistence.records.document.templateSettings).tokyo
    ).toEqual({ accentColor: '#222222' });
  });

  it('keeps the latest title when an older rename fails', async () => {
    const { document, persistence } = setup();
    let finishFirst: (result: PersistenceResult<void>) => void = () => {};
    const originalRename = persistence.renameDocument.bind(persistence);
    let calls = 0;
    persistence.renameDocument = (documentId, title) => {
      calls += 1;
      if (calls === 1) {
        return new Promise((resolve) => {
          finishFirst = resolve;
        });
      }
      return originalRename(documentId, title);
    };

    const first = document.rename('Older');
    const second = document.rename('Latest');
    expect(document.title).toBe('Latest');
    await Promise.resolve();
    finishFirst({ success: false, reason: 'notFound' });
    expect(await first).toEqual({
      success: false,
      error: 'Failed to rename document',
    });
    expect(document.title).toBe('Latest');
    expect(await second).toEqual({ success: true });
    expect(persistence.records.document.title).toBe('Latest');
  });
});
