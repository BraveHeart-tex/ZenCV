import { makeAutoObservable } from 'mobx';
import { computedFn } from 'mobx-utils';
import type {
  ItemId,
  SectionId,
  SemanticSectionKey,
} from '@/lib/builderDocument/builderDocument';
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
  activeSectionId: SectionId | null = null;
  editorScrollY = 0;

  setActiveSection(id: SectionId | null) {
    this.activeSectionId = id;
  }

  rememberEditorScroll(scrollY: number) {
    this.editorScrollY = scrollY;
  }

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

  getFieldRefBySemanticKey(sectionKey: SemanticSectionKey, fieldKey: string) {
    const section = this.root.document?.section(sectionKey);
    for (const item of section?.items ?? []) {
      const field = item.editableFields.find(
        (candidate) => candidate.fieldKey === fieldKey
      );
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
      ? item.editableFields.find(
          (field) => field.fieldKey === section.definition.initialFocusFieldKey
        )
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
    this.activeSectionId = null;
    this.editorScrollY = 0;
  }
}
