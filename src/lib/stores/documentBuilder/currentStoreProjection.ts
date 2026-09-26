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
import type { BuilderSession } from './builderSession';

class CurrentSectionView {
  constructor(private readonly section: BuilderSectionModel) {}

  toSnapshot(): SectionWithParsedMetadata {
    return {
      id: this.section.id,
      documentId: this.section.documentId,
      type: this.section.persistedType,
      title: this.section.title,
      defaultTitle: this.section.defaultTitle,
      displayOrder: this.section.displayOrder,
      metadata: this.section.metadata.map((entry) => ({
        ...entry,
      })) as SectionWithParsedMetadata['metadata'],
    };
  }
}

class CurrentItemView {
  constructor(private readonly item: BuilderItemModel) {}

  toSnapshot(): DEX_Item {
    return {
      id: this.item.id,
      sectionId: this.item.sectionId,
      containerType: this.item.containerType,
      displayOrder: this.item.displayOrder,
    };
  }
}

/**
 * Internal migration boundary for legacy record-shaped consumers.
 *
 * It is read-only and always projects the authoritative Builder Document.
 * Phase 3 removes Work Experience consumers, Phase 4 generic renderer
 * consumers, and Phase 6 the remaining consumers and this module.
 */
export class CurrentStoreProjection {
  private document: BuilderDocumentModel | null = null;
  private projectedSections = new Map<number, CurrentSectionView>();
  private projectedItems = new Map<number, CurrentItemView>();

  constructor(private readonly session: BuilderSession) {}

  publish(document: BuilderDocumentModel): void {
    this.clear();
    this.document = document;
  }

  clear(): void {
    this.document = null;
    this.projectedSections.clear();
    this.projectedItems.clear();
  }

  get sections(): SectionWithParsedMetadata[] {
    return (this.document?.sections ?? []).map((section) =>
      this.getProjectedSection(section).toSnapshot()
    );
  }

  get accentColor(): string {
    return this.document?.accentColor ?? '';
  }

  get templateType() {
    return this.document?.templateType;
  }

  getItemsBySectionId(sectionId: number): DEX_Item[] {
    const section = this.document?.sectionsById.get(sectionId as never);
    return (section?.items ?? []).map((item) =>
      this.getProjectedItem(item).toSnapshot()
    );
  }

  getFieldsByItemId(itemId: number): DEX_Field[] {
    const item = this.document?.itemsById.get(itemId as never);
    if (!item) {
      return [];
    }
    const section = this.document?.sectionsById.get(item.sectionId);
    return section
      ? item.editableFields.map((field) =>
          section.toPersistedFieldSnapshot(field)
        )
      : [];
  }

  getFieldValueByName(fieldName: FieldName): string {
    for (const section of this.document?.sections ?? []) {
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
    this.session.UIStore.itemRefs.delete(sectionId.toString());
    this.projectedSections.delete(sectionId);
    for (const [itemId, item] of this.projectedItems) {
      if (item.toSnapshot().sectionId === sectionId) {
        this.disposeProjectedItem(itemId);
      }
    }
  }

  disposeProjectedItem(itemId: number): void {
    this.projectedItems.delete(itemId);
    this.session.UIStore.itemRefs.delete(itemId.toString());
    if (this.session.UIStore.collapsedItemId === itemId) {
      this.session.UIStore.collapsedItemId = null;
    }
  }

  private getProjectedSection(
    section: BuilderSectionModel
  ): CurrentSectionView {
    let view = this.projectedSections.get(section.id);
    if (!view) {
      view = new CurrentSectionView(section);
      this.projectedSections.set(section.id, view);
    }
    return view;
  }

  private getProjectedItem(item: BuilderItemModel): CurrentItemView {
    let view = this.projectedItems.get(item.id);
    if (!view) {
      view = new CurrentItemView(item);
      this.projectedItems.set(item.id, view);
    }
    return view;
  }
}

export const CURRENT_STORE_PROJECTION_IMPORT_ALLOWLIST = [
  'src/lib/stores/documentBuilder/builderSession.ts',
  'src/lib/stores/documentBuilder/builderTemplateStore.ts',
] as const;

export const CURRENT_STORE_DTO_IMPORT_ALLOWLIST = [
  'src/lib/builderDocument/builderDocument.ts',
  'src/lib/stores/documentBuilder/currentStoreProjection.ts',
  'src/lib/stores/documentBuilder/documentBuilder.constants.ts',
] as const;
