import { UpdateSpec } from 'dexie';
import { clientDb } from './clientDb';
import { DEX_Document, DEX_Section } from './clientDbSchema';

class SectionService {
  static async updateSection(
    sectionId: DEX_Section['id'],
    data: UpdateSpec<DEX_Section>,
  ) {
    return clientDb.sections.update(sectionId, data);
  }

  static async deleteSection(sectionId: DEX_Section['id']) {
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
  }

  static async bulkUpdateSections(
    keysAndChanges: {
      key: DEX_Section['id'];
      changes: UpdateSpec<DEX_Section>;
    }[],
  ) {
    return clientDb.sections.bulkUpdate(keysAndChanges);
  }

  static async getSectionsByDocumentId(
    documentId: DEX_Document['id'],
  ): Promise<DEX_Section[]> {
    return clientDb.sections.where('documentId').equals(documentId).toArray();
  }

  static async getSectionIdsByDocumentId(
    documentId: DEX_Document['id'],
  ): Promise<number[]> {
    return clientDb.sections
      .where('documentId')
      .equals(documentId)
      .primaryKeys();
  }

  static async bulkDeleteSections(
    sectionIds: DEX_Section['id'][],
  ): Promise<void> {
    return clientDb.sections.bulkDelete(sectionIds);
  }
}

export default SectionService;
