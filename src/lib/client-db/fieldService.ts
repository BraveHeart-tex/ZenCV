import { clientDb } from './clientDb';
import { DEX_Field } from './clientDbSchema';

class FieldService {
  static async updateField(fieldId: DEX_Field['id'], value: string) {
    return clientDb.fields.update(fieldId, {
      value,
    });
  }
}

export default FieldService;
