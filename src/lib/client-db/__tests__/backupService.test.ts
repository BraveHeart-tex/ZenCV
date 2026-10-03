import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { builderDocumentFixture } from '@/lib/builderDocument/__tests__/builderDocumentFixture';
import {
  BACKUP_TABLES,
  readBackup,
  restoreBackup,
  validateBackup,
} from '../backupService';
import { clientDb } from '../clientDb';

const clear = async () => {
  for (const name of BACKUP_TABLES) {
    await clientDb.table(name).clear();
  }
};
beforeEach(clear);
afterEach(() => {
  vi.restoreAllMocks();
  return clear();
});
const backup = () => {
  const records = builderDocumentFixture();
  return {
    documents: [
      {
        ...records.document,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-02-01T00:00:00.000Z',
      },
    ],
    sections: records.sections,
    items: records.items,
    fields: records.fields,
    settings: [],
  };
};

describe('backup safety', () => {
  it('rejects malformed and disconnected records before touching current work', async () => {
    const original = backup();
    await restoreBackup(original);
    const before = await readBackup();
    await expect(
      restoreBackup({
        ...original,
        sections: [{ ...original.sections[0], documentId: 999 }],
      })
    ).rejects.toThrow('missing linked');
    await expect(
      restoreBackup({
        ...original,
        documents: [{ ...original.documents[0], templateSettings: 'broken' }],
      })
    ).rejects.toThrow('incomplete');
    await expect(
      restoreBackup({
        ...original,
        items: [...original.items, original.items[0]],
      })
    ).rejects.toThrow('duplicate');
    expect(await readBackup()).toEqual(before);
  });

  it('rolls back cleared tables and partial writes when insertion fails', async () => {
    const original = backup();
    await restoreBackup(original);
    const before = await readBackup();
    const fail = () => {
      throw new Error('disk full');
    };
    clientDb.fields.hook('creating', fail);
    await expect(
      restoreBackup({
        ...original,
        documents: [{ ...original.documents[0], title: 'Replacement' }],
      })
    ).rejects.toThrow('disk full');
    clientDb.fields.hook('creating').unsubscribe(fail);
    expect(await readBackup()).toEqual(before);
  });

  it('reads every table and replaces legacy records along with resumes', async () => {
    const original = backup();
    const complete = {
      ...original,
      documents: [{ ...original.documents[0], jobPostingId: 4 }],
      jobPostings: [
        {
          id: 4,
          companyName: 'Company',
          jobTitle: 'Role',
          roleDescription: 'Description',
        },
      ],
      aiSuggestions: [
        {
          id: 5,
          documentId: original.documents[0].id,
          suggestedJobTitle: 'Role',
          keywordSuggestions: ['skill'],
        },
      ],
    };
    await restoreBackup(complete);
    const exported = await readBackup();
    expect(exported.documents).toEqual(complete.documents);
    expect(exported.jobPostings).toEqual(complete.jobPostings);
    expect(exported.aiSuggestions).toEqual(complete.aiSuggestions);
    await restoreBackup(original);
    expect(await clientDb.jobPostings.count()).toBe(0);
    expect(await clientDb.aiSuggestions.count()).toBe(0);
  });

  it('accepts older five-table exports and clears their omitted legacy references', () => {
    expect(
      validateBackup({
        ...backup(),
        documents: [{ ...backup().documents[0], jobPostingId: 99 }],
      }).documents[0].jobPostingId
    ).toBeNull();
  });
});
