import { computed, makeAutoObservable, runInAction } from 'mobx';
import { computedFn } from 'mobx-utils';
import {
  CONTAINER_TYPES,
  type DEX_Item,
  type DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import {
  addItemFromTemplate,
  bulkUpdateItems,
  deleteItem,
} from '@/lib/client-db/itemService';
import { getItemInsertTemplate } from '@/lib/helpers/documentBuilderHelpers';
import type { TemplatedSectionType } from '@/lib/types/documentBuilder.types';
import type { BuilderRootStore } from './builderRootStore';

export class BuilderItemStore {
  root: BuilderRootStore;

  items: DEX_Item[] = [];

  constructor(root: BuilderRootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  @computed
  get itemsById() {
    return new Map(this.items.map((item) => [item.id, item]));
  }

  @computed
  get itemsBySectionId() {
    const map = new Map<DEX_Section['id'], DEX_Item[]>();
    for (const item of this.items) {
      const arr = map.get(item.sectionId) ?? [];
      arr.push(item);
      map.set(item.sectionId, arr);
    }
    return map;
  }

  getItemById = (itemId: DEX_Item['id']): DEX_Item | undefined => {
    return this.itemsById.get(itemId);
  };

  getItemsBySectionId = (sectionId: DEX_Section['id']): DEX_Item[] => {
    return this.itemsBySectionId.get(sectionId) ?? [];
  };

  getOrderedItemIdsBySectionId(sectionId: DEX_Section['id']): DEX_Item['id'][] {
    return computed(() => {
      const items = this.itemsBySectionId.get(sectionId) ?? [];
      return items
        .slice()
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((item) => item.id);
    }).get();
  }

  addNewItemEntry = async (sectionId: DEX_Section['id']) => {
    const section = this.root.sectionStore.getSectionById(sectionId);
    if (!section) return;

    const template = getItemInsertTemplate(
      section.type as TemplatedSectionType
    );
    if (!template) return;

    const result = await addItemFromTemplate({
      ...template,
      sectionId,
      displayOrder: this.items.reduce(
        (displayOrder, currentItem) =>
          currentItem.displayOrder > displayOrder
            ? currentItem.displayOrder
            : displayOrder,
        1
      ),
    });

    const { fields, item } = result;

    runInAction(() => {
      this.items.push(item);
      this.root.fieldStore.fields.push(...fields);
      this.root.UIStore.toggleItem(item.id);
    });

    return result.item.id;
  };

  removeItem = async (itemId: DEX_Item['id']) => {
    const item = this.items.find((item) => item.id === itemId);
    if (!item) return;

    const prevItems = this.items;
    const prevFields = this.root.fieldStore.fields;

    runInAction(() => {
      this.items = this.items.filter((item) => item.id !== itemId);
      this.root.fieldStore.fields = this.root.fieldStore.fields.filter(
        (field) => field.itemId !== itemId
      );
    });

    try {
      await deleteItem(itemId);
    } catch (error) {
      console.error('Error deleting item:', error);
      runInAction(() => {
        this.items = prevItems;
        this.root.fieldStore.fields = prevFields;
      });
    }
  };

  reOrderSectionItems = async (itemIds: DEX_Item['id'][]) => {
    if (itemIds.length === 0) return;

    const newDisplayOrders = itemIds.map((id, index) => ({
      id,
      displayOrder: index + 1,
    }));

    const changedItems = newDisplayOrders.filter((newOrder) => {
      const prevItem = this.items.find((item) => item.id === newOrder.id);
      return prevItem && prevItem.displayOrder !== newOrder.displayOrder;
    });

    if (changedItems.length === 0) return;

    const prevItems = this.items;

    runInAction(() => {
      this.items.forEach((item) => {
        const newOrder = newDisplayOrders.find((o) => o.id === item.id);
        if (newOrder && newOrder?.displayOrder !== item.displayOrder) {
          item.displayOrder = newOrder.displayOrder;
        }
      });
    });

    if (changedItems.length) {
      try {
        await bulkUpdateItems(
          changedItems.map((item) => ({
            key: item.id,
            changes: { displayOrder: item.displayOrder },
          }))
        );
      } catch (error) {
        console.error('bulkUpdateItems error', error);
        runInAction(() => {
          this.items = prevItems;
        });
      }
    }
  };

  areAllItemsCollapsible = computedFn(
    (sectionId: DEX_Section['id']): boolean => {
      return (this.itemsBySectionId.get(sectionId) ?? []).every(
        (item) => item.containerType === CONTAINER_TYPES.COLLAPSIBLE
      );
    }
  );

  setItems = (items: DEX_Item[]) => {
    this.items = items;
  };
}
