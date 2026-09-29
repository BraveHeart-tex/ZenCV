import type { InsertType } from 'dexie';
import { clientDb } from './clientDb';
import type { DEX_Item, DEX_Section } from './clientDbSchema';

export async function getItemsWithSectionIds(
  sectionIds: DEX_Section['id'][]
): Promise<DEX_Item[]> {
  return clientDb.items.where('sectionId').anyOf(sectionIds).toArray();
}

export async function getItemIdsBySectionIds(
  sectionIds: DEX_Section['id'][]
): Promise<DEX_Item['id'][]> {
  return clientDb.items.where('sectionId').anyOf(sectionIds).primaryKeys();
}

export async function bulkDeleteItems(
  itemIds: DEX_Item['id'][]
): Promise<void> {
  return clientDb.items.bulkDelete(itemIds);
}

export async function bulkAddItems(
  data: InsertType<DEX_Item, 'id'>[]
): Promise<DEX_Item['id'][]> {
  return clientDb.items.bulkAdd(data, {
    allKeys: true,
  });
}
