import Dexie, { EntityTable } from 'dexie';
import {
  DEX_Document,
  DEX_Field,
  DEX_Item,
  DEX_Section,
} from './clientDbSchema';

export const clientDb = new Dexie('cv-builder-db') as Dexie & {
  documents: EntityTable<DEX_Document, 'id'>;
  sections: EntityTable<DEX_Section, 'id'>;
  items: EntityTable<DEX_Item, 'id'>;
  fields: EntityTable<DEX_Field, 'id'>;
};

clientDb.version(1).stores({
  documents: '++id, title, createdAt, updatedAt',
  sections:
    '++id, documentId, title, defaultTitle, type, displayOrder, metadata',
  items: '++id, sectionId, containerType, displayOrder',
  fields: '++id, itemId, name, type, value, selectType, options',
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
