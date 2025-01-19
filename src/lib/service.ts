import { db } from './db';
import { Document, Field, Item, Section, SelectField } from './schema';
import {
  getInitialDocumentInsertBoilerplate,
  isSelectField,
} from '@/lib/helpers';

export const createDocument = async (
  data: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  return db.transaction(
    'rw',
    [db.documents, db.sections, db.items, db.fields],
    async () => {
      const documentId = await db.documents.add(data as Document);

      const sectionTemplates = getInitialDocumentInsertBoilerplate(documentId);

      const prepareSections = () =>
        sectionTemplates.map((section) => ({
          defaultTitle: section.defaultTitle,
          title: section.title,
          displayOrder: section.displayOrder,
          documentId,
          metadata: section?.metadata || '',
          type: section.type,
        }));

      const sectionInsertIds = await db.sections.bulkAdd(prepareSections(), {
        allKeys: true,
      });

      const itemInsertDtos: Omit<Item, 'id'>[] = [];
      const fieldInsertDtos: Omit<Field, 'id'>[] = [];

      sectionTemplates.forEach((sectionTemplate, sectionIndex) => {
        const sectionId = sectionInsertIds[sectionIndex];
        if (!sectionTemplate) return;

        sectionTemplate.items.forEach((item) => {
          itemInsertDtos.push({
            containerType: item.containerType || 'static',
            displayOrder: item.displayOrder,
            sectionId,
          });

          item.fields.forEach((field) => {
            if (isSelectField(field)) {
              (fieldInsertDtos as Omit<SelectField, 'id'>[]).push({
                itemId: sectionIndex,
                name: field.name,
                type: field.type,
                selectType: field?.selectType || 'basic',
                options: field?.options || null,
                value: field.value,
              });
            } else {
              fieldInsertDtos.push({
                itemId: sectionIndex,
                name: field.name,
                type: field.type,
                value: field.value,
              });
            }
          });
        });
      });

      const itemInsertIds = await db.items.bulkAdd(itemInsertDtos, {
        allKeys: true,
      });

      const resolvedFieldDtos = fieldInsertDtos.map((field) => ({
        ...field,
        itemId: itemInsertIds[field.itemId],
      }));

      await db.fields.bulkAdd(resolvedFieldDtos);

      return documentId;
    },
  );
};

export const renameDocument = async (
  documentId: Document['id'],
  title: string,
) => {
  return db.documents.update(documentId, { title });
};

export const updateSection = async (
  sectionId: number,
  data: Partial<Omit<Section, 'id'>>,
) => {
  return db.sections.update(sectionId, data);
};

export const updateField = async (fieldId: number, value: string) => {
  return db.fields.update(fieldId, {
    value,
  });
};

export const deleteDocument = async (documentId: Document['id']) => {
  return db.transaction(
    'rw',
    [db.documents, db.sections, db.items, db.fields],
    async () => {
      await db.documents.delete(documentId);

      const sectionIds = await db.sections
        .where('documentId')
        .equals(documentId)
        .primaryKeys();

      await db.sections.bulkDelete(sectionIds);

      const itemIds = await db.items
        .where('sectionId')
        .anyOf(sectionIds)
        .primaryKeys();
      await db.items.bulkDelete(itemIds);

      const fieldIds = await db.fields
        .where('itemId')
        .anyOf(itemIds)
        .primaryKeys();
      await db.fields.bulkDelete(fieldIds);
    },
  );
};

export const deleteItem = async (itemId: number) => {
  return db.transaction('rw', [db.items, db.fields], async () => {
    await db.items.delete(itemId);
    await db.fields.where('itemId').equals(itemId).delete();
  });
};

export const addItemFromTemplate = async (
  template: Omit<Item, 'id'> & { fields: Omit<Field, 'id' | 'itemId'>[] },
): Promise<{ item: Item; fields: Field[] }> => {
  return db.transaction('rw', [db.items, db.fields], async () => {
    const itemId = await db.items.add({
      sectionId: template.sectionId,
      containerType: template.containerType,
      displayOrder: template.displayOrder,
    });

    const fieldsPayload = template.fields.map((field) => ({
      ...field,
      itemId,
    }));

    const fieldIds = await db.fields.bulkAdd(fieldsPayload, {
      allKeys: true,
    });

    return {
      item: {
        id: itemId,
        sectionId: template.sectionId,
        containerType: template.containerType,
        displayOrder: template.displayOrder,
      },
      fields: fieldsPayload.map((field, index) => ({
        ...field,
        id: fieldIds[index],
        itemId,
      })) as Field[],
    };
  });
};

export const deleteSection = (sectionId: number) => {
  return db.transaction('rw', [db.sections, db.items, db.fields], async () => {
    await db.sections.delete(sectionId);
    const itemIds = await db.items
      .where('sectionId')
      .equals(sectionId)
      .primaryKeys();

    await db.items.bulkDelete(itemIds);
    await db.fields.where('itemId').anyOf(itemIds).delete();
  });
};
