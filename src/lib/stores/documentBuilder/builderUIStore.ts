import { makeAutoObservable } from 'mobx';
import { computedFn } from 'mobx-utils';
import type { ItemId } from '@/lib/builderDocument/builderDocument';
import type { FieldName, SectionType } from '@/lib/types/documentBuilder.types';
import type { Nullable, ValueOf } from '@/lib/types/utils.types';
import type { BuilderSession } from './builderSession';

export const BUILDER_CURRENT_VIEWS = {
  BUILDER: 'builder',
  PREVIEW: 'preview',
  TEMPLATES: 'templates',
} as const;

export class BuilderUIStore {
  root: BuilderSession;

  collapsedItemId: Nullable<ItemId> = null;

  itemRefs: Map<string, Nullable<HTMLElement>> = new Map();
  fieldRefs: Map<string, Nullable<HTMLElement>> = new Map();

  currentView: ValueOf<typeof BUILDER_CURRENT_VIEWS> = 'builder';

  isMobileTemplateSelectorVisible: boolean = false;
  private readonly isItemOpenForItem = computedFn((id: ItemId) => {
    return this.collapsedItemId === id;
  });

  constructor(root: BuilderSession) {
    this.root = root;
    makeAutoObservable<this, 'isItemOpenForItem'>(
      this,
      {
        isItemOpenForItem: false,
      },
      { autoBind: true }
    );
  }

  isItemOpen(id: ItemId) {
    return this.isItemOpenForItem(id);
  }

  getFieldRefByFieldNameAndSection(
    fieldName: FieldName,
    sectionType: SectionType
  ) {
    const section = this.root.document?.sections.find(
      (candidate) => candidate.definition.persistedType === sectionType
    );
    if (!section) {
      return;
    }
    for (const item of section.items) {
      const definition = Object.values(section.definition.fields).find(
        (candidate) => candidate.persistedName === fieldName
      );
      const field = definition
        ? item.editableFields.find(
            (candidate) => candidate.fieldKey === definition.key
          )
        : undefined;
      if (field) {
        return this.fieldRefs.get(field.id.toString());
      }
    }
  }

  focusFirstFieldInItem(itemId: ItemId) {
    const item = this.root.getItem(itemId);

    if (!item) {
      console.warn('No item found to focus first field');
      return;
    }

    const section = this.root.getSection(item.sectionId);
    const firstField = section
      ? item.field(section.definition.initialFocusFieldKey)
      : undefined;
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

  toggleItem(itemId: ItemId) {
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
