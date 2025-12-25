import Dexie, { type EntityTable } from 'dexie';
import { INTERNAL_TEMPLATE_TYPES } from '../stores/documentBuilder/documentBuilder.constants';
import type {
  DEX_AiSuggestions,
  DEX_Document,
  DEX_Field,
  DEX_Item,
  DEX_JobPosting,
  DEX_Section,
  DEX_Setting,
  EditorPreferences,
} from './clientDbSchema';

export const clientDb = new Dexie('cv-builder-db') as Dexie & {
  documents: EntityTable<DEX_Document, 'id'>;
  sections: EntityTable<DEX_Section, 'id'>;
  items: EntityTable<DEX_Item, 'id'>;
  fields: EntityTable<DEX_Field, 'id'>;
  settings: EntityTable<DEX_Setting<string>, 'key'>;
  jobPostings: EntityTable<DEX_JobPosting, 'id'>;
  aiSuggestions: EntityTable<DEX_AiSuggestions, 'id'>;
};

clientDb.version(1).stores({
  documents: '++id, title, createdAt, updatedAt',
  sections:
    '++id, documentId, title, defaultTitle, type, displayOrder, metadata',
  items: '++id, sectionId, containerType, displayOrder',
  fields: '++id, itemId, name, type, value, selectType, options',
});

clientDb
  .version(2)
  .stores({
    documents: '++id, title, templateType, createdAt, updatedAt',
    sections:
      '++id, documentId, title, defaultTitle, type, displayOrder, metadata',
    items: '++id, sectionId, containerType, displayOrder',
    fields: '++id, itemId, name, type, value, selectType, options',
  })
  .upgrade((transaction) => {
    transaction
      .table('documents')
      .toCollection()
      .modify((document) => {
        document.templateType = INTERNAL_TEMPLATE_TYPES.MANHATTAN;
      });
  });

clientDb
  .version(3)
  .stores({
    documents: '++id, title, templateType, createdAt, updatedAt',
    sections:
      '++id, documentId, title, defaultTitle, type, displayOrder, metadata',
    items: '++id, sectionId, containerType, displayOrder',
    fields: '++id, itemId, name, type, value, selectType, options',
    settings: 'key',
  })
  .upgrade(async (transaction) => {
    const defaultSettings: DEX_Setting[] = [
      { key: 'language', value: 'en-US' },
      {
        key: 'editorPreferences',
        value: {
          askBeforeDeletingItem: true,
          askBeforeDeletingSection: true,
          showAiSuggestions: true,
        } as EditorPreferences,
      },
    ];

    await transaction.table('settings').bulkAdd(defaultSettings);
  });

clientDb
  .version(6)
  .stores({
    documents: '++id, title, templateType, jobPostingId, createdAt, updatedAt',
    sections:
      '++id, documentId, title, defaultTitle, type, displayOrder, metadata',
    items: '++id, sectionId, containerType, displayOrder',
    fields: '++id, itemId, name, type, value, selectType, options',
    settings: 'key',
    jobPostings: '++id, companyName, jobTitle, roleDescription, documentId',
    aiSuggestions: '++id, suggestedJobTitle, keywordSuggestions, documentId',
  })
  .upgrade((transaction) => {
    transaction
      .table('documents')
      .toCollection()
      .modify((doc) => {
        if (!doc.jobPostingId) {
          doc.jobPostingId = null;
        }
      });
  });

clientDb.documents.hook('updating', (modifications, _primKey, object) => {
  return {
    ...object,
    ...modifications,
    updatedAt: new Date().toISOString(),
  };
});

clientDb.documents.hook('creating', (_, obj) => {
  obj.createdAt = new Date().toISOString();
  obj.updatedAt = new Date().toISOString();
});

clientDb.jobPostings.hook('deleting', (primKey) => {
  clientDb.documents
    .where('jobPostingId')
    .equals(primKey)
    .modify((doc) => {
      doc.jobPostingId = null;
    });
});
