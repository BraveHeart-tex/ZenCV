import { clientDb } from './clientDb';
import { DEX_Field, DEX_Item } from './clientDbSchema';

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
}

export default FieldService;
