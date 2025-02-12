import Dexie, { EntityTable } from 'dexie';
import {
  DEX_Document,
  DEX_Field,
  DEX_Item,
  DEX_Section,
  EditorPreferences,
  DEX_JobPosting,
  DEX_Setting,
} from './clientDbSchema';
import { INTERNAL_TEMPLATE_TYPES } from '../stores/documentBuilder/documentBuilder.constants';

export const clientDb = new Dexie('cv-builder-db') as Dexie & {
  documents: EntityTable<DEX_Document, 'id'>;
  sections: EntityTable<DEX_Section, 'id'>;
  items: EntityTable<DEX_Item, 'id'>;
  fields: EntityTable<DEX_Field, 'id'>;
  settings: EntityTable<DEX_Setting<string>, 'key'>;
  jobPostings: EntityTable<DEX_JobPosting, 'id'>;
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
        } as EditorPreferences,
      },
    ];

    await transaction.table('settings').bulkAdd(defaultSettings);
  });

clientDb
  .version(4)
  .stores({
    documents: '++id, title, templateType, jobPostingId, createdAt, updatedAt',
    sections:
      '++id, documentId, title, defaultTitle, type, displayOrder, metadata',
    items: '++id, sectionId, containerType, displayOrder',
    fields: '++id, itemId, name, type, value, selectType, options',
    settings: 'key',
    jobPostings: '++id, companyName, jobTitle, roleDescription',
  })
  .upgrade((transaction) => {
    transaction
      .table('documents')
      .toCollection()
      .modify((doc) => {
        doc.jobPostingId = null;
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
