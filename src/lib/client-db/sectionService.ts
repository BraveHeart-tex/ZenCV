import { UpdateSpec } from 'dexie';
import { clientDb } from './clientDb';
import { DEX_Section } from './clientDbSchema';

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
}

export default SectionService;
