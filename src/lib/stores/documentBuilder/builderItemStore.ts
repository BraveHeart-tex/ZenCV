import { makeAutoObservable, runInAction } from 'mobx';
import type { DEX_Item, DEX_Section } from '@/lib/client-db/clientDbSchema';
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

  getItemById = (itemId: DEX_Item['id']) => {
    return this.items.find((item) => item.id === itemId);
  };

  getItemsBySectionId = (sectionId: DEX_Section['id']) => {
    return this.items
      .filter((item) => item.sectionId === sectionId)
      .slice()
      .sort((a, b) => a.displayOrder - b.displayOrder);
  };

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

    runInAction(() => {
      this.items = this.items.filter((item) => item.id !== itemId);
      this.root.fieldStore.fields = this.root.fieldStore.fields.filter(
        (field) => field.itemId !== itemId
      );
    });

    await deleteItem(itemId);
  };

  reOrderSectionItems = async (items: DEX_Item[]) => {
    if (items.length === 0) return;

    const newDisplayOrders = items.map((item, index) => ({
      id: item.id,
      displayOrder: index + 1,
    }));

    const changedItems = newDisplayOrders.filter((newOrder) => {
      const prevItem = this.items.find((item) => item.id === newOrder.id);
      return prevItem && prevItem.displayOrder !== newOrder.displayOrder;
    });

    if (changedItems.length === 0) return;

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
      }
    }
  };

  setItems = (items: DEX_Item[]) => {
    this.items = items;
  };
}
