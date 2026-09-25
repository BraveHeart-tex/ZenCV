import { makeAutoObservable } from 'mobx';
import { computedFn } from 'mobx-utils';
import type { FieldName, SectionType } from '@/lib/types/documentBuilder.types';
import type { Nullable, ValueOf } from '@/lib/types/utils.types';
import type { BuilderItemId } from './builderItemStore';
import type { BuilderRootStore } from './builderRootStore';

export const BUILDER_CURRENT_VIEWS = {
  BUILDER: 'builder',
  PREVIEW: 'preview',
  TEMPLATES: 'templates',
} as const;

export class BuilderUIStore {
  root: BuilderRootStore;

  collapsedItemId: Nullable<BuilderItemId> = null;

  itemRefs: Map<string, Nullable<HTMLElement>> = new Map();
  fieldRefs: Map<string, Nullable<HTMLElement>> = new Map();

  currentView: ValueOf<typeof BUILDER_CURRENT_VIEWS> = 'builder';

  isMobileTemplateSelectorVisible: boolean = false;
  private readonly isItemOpenForItem = computedFn((id: BuilderItemId) => {
    return this.collapsedItemId === id;
  });

  constructor(root: BuilderRootStore) {
    this.root = root;
    makeAutoObservable<this, 'isItemOpenForItem'>(
      this,
      {
        isItemOpenForItem: false,
      },
      { autoBind: true }
    );
  }

  isItemOpen(id: BuilderItemId) {
    return this.isItemOpenForItem(id);
  }

  getFieldRefByFieldNameAndSection(
    fieldName: FieldName,
    sectionType: SectionType
  ) {
    const section = this.root.sectionStore.sections.find(
      (candidate) => candidate.type === sectionType
    );
    if (!section) {
      return;
    }
    for (const item of this.root.itemStore.getItemsBySectionId(section.id)) {
      const field = this.root.fieldStore
        .getFieldsByItemId(item.id)
        .find((candidate) => candidate.name === fieldName);
      if (field) {
        return this.fieldRefs.get(field.id.toString());
      }
    }
  }

  focusFirstFieldInItem(itemId: BuilderItemId) {
    const item = this.root.getItem(itemId);

    if (!item) {
      const legacyItem = this.root.itemStore.getItemById(itemId);
      const firstLegacyField = legacyItem
        ? this.root.fieldStore.getFieldsByItemId(legacyItem.id)[0]
        : undefined;
      const legacyElement = firstLegacyField
        ? this.fieldRefs.get(firstLegacyField.id.toString())
        : undefined;
      if (legacyElement) {
        requestAnimationFrame(() => {
          legacyElement.focus();
        });
        return;
      }
      if (legacyItem) {
        console.warn(
          firstLegacyField
            ? 'No element found to focus'
            : 'No field found to focus'
        );
        return;
      }
      console.warn('No item found to focus first field');
      return;
    }

    const firstField = item.editableFields[0];
    if (!firstField) {
      console.warn('No field found to focus');
      return;
    }

    const element = this.fieldRefs.get(firstField.id.toString());

    if (!element) {
      console.warn('No element found to focus');
      return;
    }

    requestAnimationFrame(() => {
      element.focus();
    });
  }

  setElementRef(key: string, value: Nullable<HTMLElement>) {
    this.itemRefs.set(key, value);
  }

  toggleTemplateSelectorBottomMenu() {
    this.isMobileTemplateSelectorVisible =
      !this.isMobileTemplateSelectorVisible;
  }

  setFieldRef(key: string, value: Nullable<HTMLElement>) {
    this.fieldRefs.set(key, value);
  }

  toggleItem(itemId: BuilderItemId) {
    this.collapsedItemId = itemId === this.collapsedItemId ? null : itemId;
  }

  resetState() {
    this.collapsedItemId = null;
    this.itemRefs = new Map();
    this.fieldRefs = new Map();
    this.isMobileTemplateSelectorVisible = false;
    this.currentView = 'builder';
  }
}
