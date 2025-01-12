import Dexie, { EntityTable } from 'dexie';
import { Document, Field, Item, Section } from './schema';

export const db = new Dexie('cv-builder-db') as Dexie & {
  documents: EntityTable<Document, 'id'>;
  sections: EntityTable<Section, 'id'>;
  items: EntityTable<Item, 'id'>;
  fields: EntityTable<Field, 'id'>;
};

db.version(1).stores({
  documents: '++id, title, createdAt, updatedAt',
  sections:
    '++id, documentId, title, defaultTitle, type, displayOrder, metadata',
  items: '++id, sectionId, containerType, displayOrder',
  fields: '++id, itemId, name, type, value, selectType, options',
});

db.documents.hook('updating', (_mods, _primKey, obj) => {
  obj.updatedAt = new Date().toISOString();
  return obj;
});

db.documents.hook('creating', (_, obj) => {
  obj.createdAt = new Date().toISOString();
  obj.updatedAt = new Date().toISOString();
});
