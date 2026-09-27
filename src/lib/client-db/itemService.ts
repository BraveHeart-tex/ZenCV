import type { InsertType, UpdateSpec } from 'dexie';
import { clientDb } from './clientDb';
import type { DEX_Item, DEX_Section } from './clientDbSchema';

export async function deleteItem(itemId: DEX_Item['id']) {
  return clientDb.transaction(
    'rw',
    [clientDb.items, clientDb.fields],
    async () => {
      await clientDb.items.delete(itemId);
      await clientDb.fields.where('itemId').equals(itemId).delete();
    }
  );
}

export async function bulkUpdateItems(
  keysAndChanges: { key: DEX_Item['id']; changes: UpdateSpec<DEX_Item> }[]
) {
  return clientDb.transaction('rw', clientDb.items, async () => {
    const updated = await clientDb.items.bulkUpdate(keysAndChanges);
    if (updated !== keysAndChanges.length) {
      throw new Error('Some items no longer exist');
    }
    return updated;
  });
}

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
