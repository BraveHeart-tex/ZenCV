import { type IReactionDisposer, reaction, runInAction } from 'mobx';
import type { BuilderDocumentModel } from '@/lib/builderDocument/builderDocument';
import type { DEX_Field, DEX_Item } from '@/lib/client-db/clientDbSchema';
import type { SectionWithParsedMetadata } from '@/lib/types/documentBuilder.types';
import { FieldModel } from './builderFieldStore';
import type { BuilderRootStore } from './builderRootStore';

/**
 * Temporary migration boundary for record-shaped Builder Store consumers.
 *
 * This projection is deleted incrementally: Work Experience in Phase 3,
 * generic renderer consumers in Phase 4, and remaining consumers in Phase 6.
 */
export class CurrentStoreProjection {
  private readonly root: BuilderRootStore;
  private stopItemProjection: IReactionDisposer | null = null;
  private stopSectionProjection: IReactionDisposer | null = null;
  private projectedSections = new Map<number, SectionWithParsedMetadata>();
  private projectedItems = new Map<number, DEX_Item>();
  private projectedFields = new Map<number, FieldModel>();

  constructor(root: BuilderRootStore) {
    this.root = root;
  }

  publish(document: BuilderDocumentModel): void {
    this.disposeReactions();
    this.document = document;
    const model = document;
    this.stopSectionProjection = reaction(
      () =>
        model.sections.map((section) => [
          section.id,
          section.title,
          section.displayOrder,
          ...section.metadata.map((entry) => `${entry.key}:${entry.value}`),
        ]),
      () => this.projectSections(),
      { fireImmediately: true }
    );
    this.stopItemProjection = reaction(
      () =>
        model.sections.flatMap((section) =>
          section.items.map((item) => [
            item.id,
            item.displayOrder,
            ...item.editableFields.map((field) => field.value),
          ])
        ),
      () => this.projectItems(),
      { fireImmediately: true }
    );
  }

  clear(): void {
    this.disposeReactions();
    this.document = null;
    this.projectedItems.clear();
    this.projectedFields.clear();
    this.projectedSections.clear();
  }

  disposeProjectedSection(sectionId: number): void {
    this.projectedSections.delete(sectionId);
    this.root.UIStore.itemRefs.delete(sectionId.toString());
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

  prune(document: BuilderDocumentModel): void {
    for (const itemId of this.projectedItems.keys()) {
      if (!document.itemsById.has(itemId as never)) {
        this.disposeProjectedItem(itemId);
      }
    }
    for (const sectionId of this.projectedSections.keys()) {
      if (!document.sectionsById.has(sectionId as never)) {
        this.projectedSections.delete(sectionId);
      }
    }
  }

  private document: BuilderDocumentModel | null = null;

  private disposeReactions(): void {
    this.stopItemProjection?.();
    this.stopItemProjection = null;
    this.stopSectionProjection?.();
    this.stopSectionProjection = null;
  }

  private projectSections(): void {
    const document = this.document;
    if (!document) {
      return;
    }
    runInAction(() => {
      this.root.sectionStore.sections = document.sections.map((section) => {
        let projected = this.projectedSections.get(section.id);
        if (!projected) {
          projected = {
            id: section.id,
            documentId: section.documentId,
            type: section.definition.persistedType,
            title: section.title,
            defaultTitle: section.defaultTitle,
            displayOrder: section.displayOrder,
            metadata: section.metadata.map((entry) => ({ ...entry })),
          } as SectionWithParsedMetadata;
          this.projectedSections.set(section.id, projected);
        }
        projected.title = section.title;
        projected.displayOrder = section.displayOrder;
        projected.metadata = section.metadata.map(
          (entry) =>
            ({ ...entry }) as SectionWithParsedMetadata['metadata'][number]
        );
        return projected;
      });
      for (const section of this.root.sectionStore.sections) {
        this.projectedSections.set(section.id, section);
      }
    });
  }

  private projectItems(): void {
    const document = this.document;
    if (!document) {
      return;
    }
    runInAction(() => {
      const items: DEX_Item[] = [];
      const fields: FieldModel[] = [];
      for (const section of document.sections) {
        for (const item of section.items) {
          let projectedItem = this.projectedItems.get(item.id);
          if (!projectedItem) {
            projectedItem = {
              id: item.id,
              sectionId: item.sectionId,
              containerType: item.containerType,
              displayOrder: item.displayOrder,
            };
            this.projectedItems.set(item.id, projectedItem);
          }
          projectedItem.displayOrder = item.displayOrder;
          items.push(projectedItem);
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
      this.root.itemStore.items = items;
      this.root.fieldStore.fields = fields;
      for (const item of this.root.itemStore.items) {
        this.projectedItems.set(item.id, item);
      }
      for (const field of this.root.fieldStore.fields) {
        this.projectedFields.set(field.id, field);
      }
    });
  }
}

export const CURRENT_STORE_PROJECTION_IMPORT_ALLOWLIST = [
  'src/lib/stores/documentBuilder/builderRootStore.ts',
] as const;

export const CURRENT_STORE_DTO_IMPORT_ALLOWLIST = [
  'src/lib/builderDocument/builderDocument.ts',
  'src/lib/stores/documentBuilder/currentStoreProjection.ts',
  'src/lib/stores/documentBuilder/builderDocumentStore.ts',
  'src/lib/stores/documentBuilder/builderFieldStore.ts',
  'src/lib/stores/documentBuilder/builderItemStore.ts',
  'src/lib/stores/documentBuilder/builderTemplateStore.ts',
  'src/lib/stores/documentBuilder/builderUIStore.ts',
  'src/lib/stores/documentBuilder/documentBuilder.constants.ts',
] as const;
