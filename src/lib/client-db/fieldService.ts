import { clientDb } from './clientDb';
import { DEX_Field, DEX_Item } from './clientDbSchema';
import { InsertType } from 'dexie';

class FieldService {
  static async updateField(fieldId: DEX_Field['id'], value: string) {
    return clientDb.fields.update(fieldId, {
      value,
    });
  }
  static async getFieldsWithItemIds(
    itemIds: DEX_Item['id'][],
  ): Promise<DEX_Field[]> {
    return clientDb.fields.where('itemId').anyOf(itemIds).toArray();
  }
  static async getFieldIdsByItemIds(
    itemIds: DEX_Item['id'][],
  ): Promise<DEX_Field['id'][]> {
    return clientDb.fields.where('itemId').anyOf(itemIds).primaryKeys();
  }
  static async bulkDeleteFields(fieldIds: DEX_Field['id'][]): Promise<void> {
    return clientDb.fields.bulkDelete(fieldIds);
  }
  static async bulkAddFields(
    data: InsertType<DEX_Field, 'id'>[],
  ): Promise<DEX_Field['id'][]> {
    return clientDb.fields.bulkAdd(data, { allKeys: true });
  }
}

export default FieldService;
