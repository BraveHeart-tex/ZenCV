import { UpdateSpec } from 'dexie';
import { clientDb } from './clientDb';
import {
  DEX_Document,
  DEX_Field,
  DEX_InsertItemModel,
  DEX_Item,
  DEX_Section,
} from './clientDbSchema';

export const updateSection = async (
  sectionId: DEX_Section['id'],
  data: UpdateSpec<DEX_Section>,
) => {
  return clientDb.sections.update(sectionId, data);
};

export const updateField = async (fieldId: DEX_Field['id'], value: string) => {
  return clientDb.fields.update(fieldId, {
    value,
  });
};

export const deleteItem = async (itemId: DEX_Item['id']) => {
  return clientDb.transaction(
    'rw',
    [clientDb.items, clientDb.fields],
    async () => {
      await clientDb.items.delete(itemId);
      await clientDb.fields.where('itemId').equals(itemId).delete();
    },
  );
};

export const addItemFromTemplate = async (
  template: DEX_InsertItemModel & {
    fields: Omit<DEX_Field, 'id' | 'itemId'>[];
  },
): Promise<{ item: DEX_Item; fields: DEX_Field[] }> => {
  return clientDb.transaction(
    'rw',
    [clientDb.items, clientDb.fields],
    async () => {
      const itemId = await clientDb.items.add({
        sectionId: template.sectionId,
        containerType: template.containerType,
        displayOrder: template.displayOrder,
      });

      const fieldsPayload = template.fields.map((field) => ({
        ...field,
        itemId,
      }));

      const fieldIds = await clientDb.fields.bulkAdd(fieldsPayload, {
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
    },
  );
};

export const deleteSection = (sectionId: DEX_Section['id']) => {
  return clientDb.transaction(
    'rw',
    [clientDb.sections, clientDb.items, clientDb.fields],
    async () => {
      await clientDb.sections.delete(sectionId);
      const itemIds = await clientDb.items
        .where('sectionId')
        .equals(sectionId)
        .primaryKeys();

      await clientDb.items.bulkDelete(itemIds);
      await clientDb.fields.where('itemId').anyOf(itemIds).delete();
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
  return clientDb.transaction(
    'r',
    [clientDb.documents, clientDb.sections, clientDb.items, clientDb.fields],
    async () => {
      const document = await clientDb.documents.get(documentId);
      if (!document) {
        return {
          success: false,
          error: 'Document not found.',
        };
      }

      const sections = await clientDb.sections
        .where('documentId')
        .equals(documentId)
        .toArray();
      const sectionIds = sections.map((section) => section.id);

      const items = await clientDb.items
        .where('sectionId')
        .anyOf(sectionIds)
        .toArray();
      const itemIds = items.map((item) => item.id);

      const fields = await clientDb.fields
        .where('itemId')
        .anyOf(itemIds)
        .toArray();

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
  return clientDb.items.bulkUpdate(keysAndChanges);
};

export const bulkUpdateSections = async (
  keysAndChanges: {
    key: DEX_Section['id'];
    changes: UpdateSpec<DEX_Section>;
  }[],
) => {
  return clientDb.sections.bulkUpdate(keysAndChanges);
};
