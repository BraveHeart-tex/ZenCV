import { type IReactionDisposer, reaction, runInAction } from 'mobx';
import type {
  BuilderDocumentModel,
  BuilderItemModel,
  BuilderSectionModel,
} from '@/lib/builderDocument/builderDocument';
import type { DEX_Field, DEX_Item } from '@/lib/client-db/clientDbSchema';
import type {
  FieldName,
  SectionType,
  SectionWithParsedMetadata,
} from '@/lib/types/documentBuilder.types';
import { FieldModel } from './builderFieldStore';
import type { BuilderRootStore } from './builderRootStore';

class CurrentSectionView {
  constructor(private readonly section: BuilderSectionModel) {}

  get id() {
    return this.section.id;
  }

  get documentId() {
    return this.section.documentId;
  }

  get type() {
    return this.section.definition.persistedType;
  }

  get title() {
    return this.section.title;
  }

  get defaultTitle() {
    return this.section.defaultTitle;
  }

  get displayOrder() {
    return this.section.displayOrder;
  }

  get metadata() {
    return this.section.metadata.map((entry) => ({ ...entry }));
  }
}

class CurrentItemView {
  constructor(private readonly item: BuilderItemModel) {}

  get id() {
    return this.item.id;
  }

  get sectionId() {
    return this.item.sectionId;
  }

  get containerType() {
    return this.item.containerType;
  }

  get displayOrder() {
    return this.item.displayOrder;
  }
}

/**
 * Temporary migration boundary for record-shaped Builder Store consumers.
 *
 * This projection is deleted incrementally: Work Experience in Phase 3,
 * generic renderer consumers in Phase 4, and remaining consumers in Phase 6.
 */
export class CurrentStoreProjection {
  private readonly root: BuilderRootStore;
  private stopItemProjection: IReactionDisposer | null = null;
  private projectedSections = new Map<number, CurrentSectionView>();
  private projectedItems = new Map<number, CurrentItemView>();
  private projectedFields = new Map<number, FieldModel>();

  constructor(root: BuilderRootStore) {
    this.root = root;
  }

  publish(document: BuilderDocumentModel): void {
    this.disposeReactions();
    this.clearViews();
    this.stopItemProjection = reaction(
      () =>
        document.sections.flatMap((section) =>
          section.items.map((item) => [
            section.id,
            item.id,
            item.displayOrder,
            ...item.editableFields.map((field) => field.id),
          ])
        ),
      () => this.projectItems(),
      { fireImmediately: true }
    );
  }

  clear(): void {
    this.disposeReactions();
    this.clearViews();
  }

  get sections(): SectionWithParsedMetadata[] {
    const document = this.root.documentModel;
    if (!document) {
      return this.root.sectionStore.sections;
    }
    return document.sections.map((section) => ({
      id: section.id,
      documentId: section.documentId,
      type: section.definition.persistedType,
      title: section.title,
      defaultTitle: section.defaultTitle,
      displayOrder: section.displayOrder,
      metadata: section.metadata.map(
        (entry) =>
          ({ ...entry }) as SectionWithParsedMetadata['metadata'][number]
      ),
    }));
  }

  get accentColor(): string {
    return (
      this.root.activeDocument?.accentColor ??
      this.root.documentStore.accentColor
    );
  }

  get templateType() {
    return (
      this.root.activeDocument?.templateType ??
      this.root.documentStore.document?.templateType
    );
  }

  getItemsBySectionId(sectionId: number): DEX_Item[] {
    const document = this.root.documentModel;
    if (!document) {
      return this.root.itemStore.getItemsBySectionId(sectionId);
    }
    const section = document.sections.find(
      (candidate) => candidate.id === sectionId
    );
    return (section?.items ?? []).map((item) => ({
      id: item.id,
      sectionId: item.sectionId,
      containerType: item.containerType,
      displayOrder: item.displayOrder,
    }));
  }

  getFieldsByItemId(itemId: number): DEX_Field[] {
    const document = this.root.documentModel;
    if (!document) {
      return this.root.fieldStore.getFieldsByItemId(itemId);
    }
    const item = document.sections
      .flatMap((section) => section.items)
      .find((candidate) => candidate.id === itemId);
    if (!item) {
      return [];
    }
    return item.editableFields.flatMap((field) => {
      const projectedField = this.projectedFields.get(field.id);
      return projectedField ? [projectedField.toSnapshot()] : [];
    });
  }

  getFieldValueByName(fieldName: FieldName): string {
    const document = this.root.documentModel;
    if (!document) {
      return this.root.fieldStore.getFieldValueByName(fieldName);
    }
    for (const section of document.sections) {
      for (const item of section.items) {
        const field = this.getFieldsByItemId(item.id).find(
          (candidate) => candidate.name === fieldName
        );
        if (field) {
          return field.value;
        }
      }
    }
    return '';
  }

  getSectionNameByType(sectionType: SectionType): string {
    return (
      this.sections.find((section) => section.type === sectionType)?.title ?? ''
    );
  }

  getSectionItemsBySectionType(sectionType: SectionType): DEX_Item[] {
    const section = this.sections.find(
      (candidate) => candidate.type === sectionType
    );
    return section ? this.getItemsBySectionId(section.id) : [];
  }

  disposeProjectedSection(sectionId: number): void {
    this.root.UIStore.itemRefs.delete(sectionId.toString());
    this.projectedSections.delete(sectionId);
    for (const [itemId, item] of this.projectedItems) {
      if (item.sectionId === sectionId) {
        this.disposeProjectedItem(itemId);
      }
    }
  }

  disposeProjectedItem(itemId: number): void {
    this.projectedItems.delete(itemId);
    this.root.UIStore.itemRefs.delete(itemId.toString());
    if (this.root.UIStore.collapsedItemId === itemId) {
      this.root.UIStore.collapsedItemId = null;
    }
    for (const [fieldId, field] of this.projectedFields) {
      if (field.itemId === itemId) {
        field.dispose();
        this.projectedFields.delete(fieldId);
        this.root.UIStore.fieldRefs.delete(fieldId.toString());
      }
    }
  }

  private disposeReactions(): void {
    this.stopItemProjection?.();
    this.stopItemProjection = null;
  }

  private clearViews(): void {
    this.projectedSections.clear();
    this.projectedItems.clear();
    this.projectedFields.forEach((field) => {
      field.dispose();
    });
    this.projectedFields.clear();
  }

  private projectItems(): void {
    runInAction(() => {
      const sections: SectionWithParsedMetadata[] = [];
      const items: DEX_Item[] = [];
      const fields: FieldModel[] = [];
      for (const section of this.root.documentModel?.sections ?? []) {
        let projectedSection = this.projectedSections.get(section.id);
        if (!projectedSection) {
          projectedSection = new CurrentSectionView(section);
          this.projectedSections.set(section.id, projectedSection);
        }
        sections.push(projectedSection as SectionWithParsedMetadata);
        for (const item of section.items) {
          let projectedItem = this.projectedItems.get(item.id);
          if (!projectedItem) {
            projectedItem = new CurrentItemView(item);
            this.projectedItems.set(item.id, projectedItem);
          }
          items.push(projectedItem as DEX_Item);
          for (const field of item.editableFields) {
            let projectedField = this.projectedFields.get(field.id);
            if (!projectedField) {
              const definition = Object.values(section.definition.fields).find(
                (candidate) => candidate.key === field.fieldKey
              );
              if (!definition) {
                throw new Error('Field definition missing during projection');
              }
              projectedField = new FieldModel(
                {
                  id: field.id,
                  itemId: item.id,
                  name: definition.persistedName,
                  type: definition.expectedPersistedType,
                  value: field.value,
                  ...(definition.expectedPersistedType === 'select'
                    ? {
                        selectType: 'basic',
                        options: definition.options ?? null,
                      }
                    : {}),
                } as DEX_Field,
                field
              );
              this.projectedFields.set(field.id, projectedField);
            }
            fields.push(projectedField);
          }
        }
      }
      this.root.sectionStore.sections = sections;
      this.root.itemStore.items = items;
      this.root.fieldStore.fields = fields;
    });
  }
}

export const CURRENT_STORE_PROJECTION_IMPORT_ALLOWLIST = [
  'src/lib/stores/documentBuilder/builderRootStore.ts',
  'src/lib/stores/documentBuilder/builderTemplateStore.ts',
] as const;

export const CURRENT_STORE_DTO_IMPORT_ALLOWLIST = [
  'src/lib/builderDocument/builderDocument.ts',
  'src/lib/stores/documentBuilder/currentStoreProjection.ts',
  'src/lib/stores/documentBuilder/builderDocumentStore.ts',
  'src/lib/stores/documentBuilder/builderFieldStore.ts',
  'src/lib/stores/documentBuilder/builderItemStore.ts',
  'src/lib/stores/documentBuilder/documentBuilder.constants.ts',
] as const;
