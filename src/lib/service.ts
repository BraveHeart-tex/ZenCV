import { UpdateSpec } from 'dexie';
import { dxDb } from './dxDb';
import {
  DEX_Document,
  DEX_Field,
  DEX_InsertDocumentModel,
  DEX_InsertFieldModel,
  DEX_InsertItemModel,
  DEX_Item,
  DEX_Section,
  SelectField,
} from './schema';
import {
  getInitialDocumentInsertBoilerplate,
  isSelectField,
} from '@/lib/helpers';

export const createDocument = async (data: DEX_InsertDocumentModel) => {
  return dxDb.transaction(
    'rw',
    [dxDb.documents, dxDb.sections, dxDb.items, dxDb.fields],
    async () => {
      const documentId = await dxDb.documents.add(data as DEX_Document);

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

      const sectionInsertIds = await dxDb.sections.bulkAdd(prepareSections(), {
        allKeys: true,
      });

      const itemInsertDtos: DEX_InsertItemModel[] = [];
      const fieldInsertDtos: DEX_InsertFieldModel[] = [];

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

      const itemInsertIds = await dxDb.items.bulkAdd(itemInsertDtos, {
        allKeys: true,
      });

      const resolvedFieldDtos = fieldInsertDtos.map((field) => ({
        ...field,
        itemId: itemInsertIds[field.itemId],
      }));

      await dxDb.fields.bulkAdd(resolvedFieldDtos);

      return documentId;
    },
  );
};

export const renameDocument = async (
  documentId: DEX_Document['id'],
  title: string,
) => {
  return dxDb.documents.update(documentId, { title });
};

export const updateSection = async (
  sectionId: DEX_Section['id'],
  data: Partial<Omit<DEX_Section, 'id'>>,
) => {
  return dxDb.sections.update(sectionId, data);
};

export const updateField = async (fieldId: DEX_Field['id'], value: string) => {
  return dxDb.fields.update(fieldId, {
    value,
  });
};

export const deleteDocument = async (documentId: DEX_Document['id']) => {
  return dxDb.transaction(
    'rw',
    [dxDb.documents, dxDb.sections, dxDb.items, dxDb.fields],
    async () => {
      await dxDb.documents.delete(documentId);

      const sectionIds = await dxDb.sections
        .where('documentId')
        .equals(documentId)
        .primaryKeys();

      await dxDb.sections.bulkDelete(sectionIds);

      const itemIds = await dxDb.items
        .where('sectionId')
        .anyOf(sectionIds)
        .primaryKeys();
      await dxDb.items.bulkDelete(itemIds);

      const fieldIds = await dxDb.fields
        .where('itemId')
        .anyOf(itemIds)
        .primaryKeys();
      await dxDb.fields.bulkDelete(fieldIds);
    },
  );
};

export const deleteItem = async (itemId: DEX_Item['id']) => {
  return dxDb.transaction('rw', [dxDb.items, dxDb.fields], async () => {
    await dxDb.items.delete(itemId);
    await dxDb.fields.where('itemId').equals(itemId).delete();
  });
};

export const addItemFromTemplate = async (
  template: DEX_InsertItemModel & {
    fields: Omit<DEX_Field, 'id' | 'itemId'>[];
  },
): Promise<{ item: DEX_Item; fields: DEX_Field[] }> => {
  return dxDb.transaction('rw', [dxDb.items, dxDb.fields], async () => {
    const itemId = await dxDb.items.add({
      sectionId: template.sectionId,
      containerType: template.containerType,
      displayOrder: template.displayOrder,
    });

    const fieldsPayload = template.fields.map((field) => ({
      ...field,
      itemId,
    }));

    const fieldIds = await dxDb.fields.bulkAdd(fieldsPayload, {
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
      })) as DEX_Field[],
    };
  });
};

export const deleteSection = (sectionId: DEX_Section['id']) => {
  return dxDb.transaction(
    'rw',
    [dxDb.sections, dxDb.items, dxDb.fields],
    async () => {
      await dxDb.sections.delete(sectionId);
      const itemIds = await dxDb.items
        .where('sectionId')
        .equals(sectionId)
        .primaryKeys();

      await dxDb.items.bulkDelete(itemIds);
      await dxDb.fields.where('itemId').anyOf(itemIds).delete();
    },
  );
};

export const getFullDocumentStructure = (
  documentId: DEX_Document['id'],
): Promise<
  | { success: false; error: string }
  | {
      success: true;
      document: DEX_Document;
      sections: DEX_Section[];
      items: DEX_Item[];
      fields: DEX_Field[];
    }
> => {
  return dxDb.transaction(
    'r',
    [dxDb.documents, dxDb.sections, dxDb.items, dxDb.fields],
    async () => {
      const document = await dxDb.documents.get(documentId);
      if (!document) {
        return {
          success: false,
          error: 'Document not found.',
        };
      }

      const sections = await dxDb.sections
        .where('documentId')
        .equals(documentId)
        .toArray();
      const sectionIds = sections.map((section) => section.id);

      const items = await dxDb.items
        .where('sectionId')
        .anyOf(sectionIds)
        .toArray();
      const itemIds = items.map((item) => item.id);

      const fields = await dxDb.fields.where('itemId').anyOf(itemIds).toArray();

      return {
        success: true,
        document,
        sections,
        items,
        fields,
      };
    },
  );
};

export const bulkUpdateItems = async (
  keysAndChanges: { key: DEX_Item['id']; changes: UpdateSpec<DEX_Item> }[],
) => {
  await dxDb.items.bulkUpdate(keysAndChanges);
};
