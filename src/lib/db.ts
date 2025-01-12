import Dexie, { EntityTable } from 'dexie';
import { Document, Field, Item, Section } from './schema';

export const db = new Dexie('cv-builder-db') as Dexie & {
  documents: EntityTable<Document, 'id'>;
  sections: EntityTable<Section, 'id'>;
  items: EntityTable<Item, 'id'>;
  fields: EntityTable<Field, 'id'>;
};
