import { describe, expect, it } from 'vitest';
import { builderDocumentFixture } from '@/lib/builderDocument/__tests__/builderDocumentFixture';
import { BuilderSession } from '../builderSession';

describe('BuilderSession', () => {
  it('atomically publishes one hydrated document and its projection', async () => {
    const records = builderDocumentFixture();
    const session = new BuilderSession({
      loadRecords: async () => ({
        success: true,
        document: records.document,
        sections: [...records.sections],
        items: [...records.items],
        fields: [...records.fields],
      }),
    });

    await expect(session.load(records.document.id)).resolves.toMatchObject({
      status: 'ready',
      documentId: records.document.id,
    });
    expect(session.document?.id).toBe(records.document.id);
    expect(session.currentStoreProjection.sections).toHaveLength(
      records.sections.length
    );

    session.discard();
    expect(session.state).toEqual({ status: 'idle' });
    expect(session.currentStoreProjection.sections).toEqual([]);
  });

  it('does not publish a document when hydration fails', async () => {
    const records = builderDocumentFixture();
    const session = new BuilderSession({
      loadRecords: async () => ({
        success: true,
        document: records.document,
        sections: [{ ...records.sections[0], id: records.sections[1]?.id }],
        items: [...records.items],
        fields: [...records.fields],
      }),
    });

    await expect(session.load(records.document.id)).resolves.toMatchObject({
      status: 'failed',
    });
    expect(session.document).toBeNull();
    expect(session.currentStoreProjection.sections).toEqual([]);
  });
});
