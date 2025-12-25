import type { InsertType } from 'dexie';
import { clientDb } from './clientDb';
import type { DEX_Field, DEX_Item } from './clientDbSchema';

export async function updateField(fieldId: DEX_Field['id'], value: string) {
  return clientDb.fields.update(fieldId, {
    value,
  });
}

export async function getFieldsWithItemIds(
  itemIds: DEX_Item['id'][]
): Promise<DEX_Field[]> {
  return clientDb.fields.where('itemId').anyOf(itemIds).toArray();
}

export async function getFieldIdsByItemIds(
  itemIds: DEX_Item['id'][]
): Promise<DEX_Field['id'][]> {
  return clientDb.fields.where('itemId').anyOf(itemIds).primaryKeys();
}

export async function bulkDeleteFields(
  fieldIds: DEX_Field['id'][]
): Promise<void> {
  return clientDb.fields.bulkDelete(fieldIds);
}

export async function bulkAddFields(
  data: InsertType<DEX_Field, 'id'>[]
): Promise<DEX_Field['id'][]> {
  return clientDb.fields.bulkAdd(data, { allKeys: true });
}
