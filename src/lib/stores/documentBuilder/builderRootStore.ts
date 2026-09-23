import { type IReactionDisposer, reaction, runInAction } from 'mobx';
import {
  type BuilderDocumentModel,
  type FieldId,
  hydrateBuilderDocument,
  type ItemId,
  type SectionId,
} from '@/lib/builderDocument/builderDocument';
import type { DEX_Field, DEX_Item } from '@/lib/client-db/clientDbSchema';
import {
  type GetFullDocumentStructureResponse,
  getFullDocumentStructure,
} from '@/lib/client-db/documentService';
import type { SectionWithParsedMetadata } from '@/lib/types/documentBuilder.types';
import { safeParse } from '@/lib/utils/objectUtils';
import { BuilderDocumentStore } from './builderDocumentStore';
import { BuilderFieldStore, FieldModel } from './builderFieldStore';
import { BuilderItemStore } from './builderItemStore';
import { BuilderSectionStore } from './builderSectionStore';
import { BuilderTemplateStore } from './builderTemplateStore';
import { BuilderUIStore } from './builderUIStore';

export class BuilderRootStore {
  documentStore: BuilderDocumentStore;
  sectionStore: BuilderSectionStore;
  itemStore: BuilderItemStore;
  fieldStore: BuilderFieldStore;

  UIStore: BuilderUIStore;
  templateStore: BuilderTemplateStore;
  documentModel: BuilderDocumentModel | null = null;
  private stopItemProjection: IReactionDisposer | null = null;
  private stopSectionProjection: IReactionDisposer | null = null;
  private projectedSections = new Map<number, SectionWithParsedMetadata>();
  private projectedItems = new Map<number, DEX_Item>();
  private projectedFields = new Map<number, FieldModel>();

  constructor() {
    this.documentStore = new BuilderDocumentStore(this);
    this.sectionStore = new BuilderSectionStore(this);
    this.itemStore = new BuilderItemStore(this);
    this.fieldStore = new BuilderFieldStore(this);
    this.UIStore = new BuilderUIStore(this);
    this.templateStore = new BuilderTemplateStore(this);
  }

  resetState() {
    this.dispose();
    runInAction(() => {
      this.documentModel = null;
      this.projectedItems.clear();
      this.projectedFields.clear();
      this.projectedSections.clear();
      this.documentStore.document = null;
      this.sectionStore.sections = [];
      this.itemStore.items = [];
      this.fieldStore.clear();
      this.UIStore.resetState();
      this.templateStore.resetState();
    });
  }

  startSession() {
    this.templateStore.start();
  }

  dispose() {
    this.templateStore.stop();
    this.stopItemProjection?.();
    this.stopItemProjection = null;
    this.stopSectionProjection?.();
    this.stopSectionProjection = null;
  }

  installDocumentModel(
    records: Extract<GetFullDocumentStructureResponse, { success: true }>,
    hydrateLegacyStores = false
  ): boolean {
    const result = hydrateBuilderDocument(records);
    if (!result.success) {
      return false;
    }
    if (hydrateLegacyStores) {
      this.stopItemProjection?.();
      this.stopSectionProjection?.();
      this.projectedItems.clear();
      this.projectedFields.clear();
      this.projectedSections.clear();
      this.hydrateFromBackend(records);
    }
    this.stopItemProjection?.();
    this.documentModel = result.document;
    for (const item of this.itemStore.items) {
      this.projectedItems.set(item.id, item);
    }
    for (const field of this.fieldStore.fields) {
      this.projectedFields.set(field.id, field);
    }
    for (const section of this.sectionStore.sections) {
      this.projectedSections.set(section.id, section);
    }
    const model = result.document;
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
            ...item.fieldIds,
          ])
        ),
      () => this.projectItems(),
      { fireImmediately: true }
    );
    return true;
  }

  private projectSections(): void {
    const model = this.documentModel;
    if (!model) {
      return;
    }
    runInAction(() => {
      this.sectionStore.sections = model.sections.map((section) => {
        let projected = this.projectedSections.get(section.id);
        if (!projected) {
          projected = {
            id: section.id,
            documentId: section.documentId,
            type: section.definition.persistedType,
            title: section.title,
            defaultTitle: section.defaultTitle,
            displayOrder: section.displayOrder,
            metadata: section.metadata.map((entry) => ({
              ...entry,
            })) as SectionWithParsedMetadata['metadata'],
          };
          this.projectedSections.set(section.id, projected);
        }
        projected.title = section.title;
        projected.displayOrder = section.displayOrder;
        for (const entry of section.metadata) {
          const matching = projected.metadata.find(
            (item) => item.key === entry.key
          );
          if (matching) {
            matching.value = entry.value as typeof matching.value;
          }
        }
        return projected;
      });
      for (const section of this.sectionStore.sections) {
        this.projectedSections.set(section.id, section);
      }
    });
  }

  disposeProjectedSection(sectionId: number): void {
    this.projectedSections.delete(sectionId);
    for (const [itemId, item] of this.projectedItems) {
      if (item.sectionId === sectionId) {
        this.projectedItems.delete(itemId);
        for (const [fieldId, field] of this.projectedFields) {
          if (field.itemId === itemId) {
            field.dispose();
            this.projectedFields.delete(fieldId);
          }
        }
      }
    }
  }

  private projectItems(): void {
    const model = this.documentModel;
    if (!model) {
      return;
    }
    runInAction(() => {
      const items: DEX_Item[] = [];
      const fields: FieldModel[] = [];
      for (const section of model.sections) {
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
              projectedField = new FieldModel({
                id: field.id,
                itemId: item.id,
                name: definition.persistedName,
                type: definition.expectedPersistedType,
                value: field.value,
                ...(definition.expectedPersistedType === 'select'
                  ? { selectType: 'basic', options: definition.options ?? null }
                  : {}),
              } as DEX_Field);
              this.projectedFields.set(field.id, projectedField);
            }
            fields.push(projectedField);
          }
        }
      }
      this.itemStore.items = items;
      this.fieldStore.fields = fields;
      for (const item of this.itemStore.items) {
        this.projectedItems.set(item.id, item);
      }
      for (const field of this.fieldStore.fields) {
        this.projectedFields.set(field.id, field);
      }
    });
  }

  async addItem(sectionId: number): Promise<number | undefined> {
    const itemId = await this.documentModel?.addItem(sectionId as SectionId);
    if (itemId) {
      runInAction(() => this.UIStore.toggleItem(itemId));
    }
    return itemId;
  }

  async removeItem(itemId: number): Promise<boolean> {
    const removed = await this.documentModel?.removeItem(itemId as ItemId);
    if (removed) {
      this.projectedItems.delete(itemId);
      for (const [fieldId, field] of this.projectedFields) {
        if (field.itemId === itemId) {
          field.dispose();
          this.projectedFields.delete(fieldId);
        }
      }
    }
    return removed ?? false;
  }

  async reorderItems(itemIds: readonly number[]): Promise<boolean> {
    if (itemIds.length === 0) {
      return false;
    }
    const sectionId = this.documentModel?.itemsById.get(
      itemIds[0] as ItemId
    )?.sectionId;
    if (!sectionId) {
      return false;
    }
    return (
      (await this.documentModel?.reorderItems(
        sectionId,
        itemIds as ItemId[]
      )) ?? false
    );
  }

  async refreshDocumentModel(): Promise<void> {
    const documentId = this.documentStore.document?.id;
    if (!this.documentModel || !documentId) {
      return;
    }
    const records = await getFullDocumentStructure(documentId);
    if (!records.success || !this.installDocumentModel(records)) {
      throw new Error('Failed to refresh Builder Document');
    }
    const model = this.documentModel;
    if (!model) {
      return;
    }
    for (const itemId of this.projectedItems.keys()) {
      if (!model.itemsById.has(itemId as ItemId)) {
        this.projectedItems.delete(itemId);
      }
    }
    for (const [fieldId, field] of this.projectedFields) {
      if (!model.fieldsById.has(fieldId as FieldId)) {
        field.dispose();
        this.projectedFields.delete(fieldId);
      }
    }
  }

  hydrateFromBackend(
    result: Extract<GetFullDocumentStructureResponse, { success: true }>
  ) {
    const { document, sections, items, fields } = result;

    this.documentStore.setDocument(document);

    this.sectionStore.setSections(
      sections
        .slice()
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((section) => ({
          ...section,
          metadata: safeParse(section.metadata, []),
        }))
    );

    this.itemStore.setItems(
      items.slice().sort((a, b) => a.displayOrder - b.displayOrder)
    );

    this.fieldStore.setFields(fields);
  }
}

export const builderRootStore = new BuilderRootStore();
