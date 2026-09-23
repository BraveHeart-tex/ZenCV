import { makeAutoObservable, observable, runInAction } from 'mobx';
import { computedFn } from 'mobx-utils';
import type { OtherSectionOption } from '@/components/documentBuilder/AddSectionWidget';
import type { SectionId } from '@/lib/builderDocument/builderDocument';
import type {
  ParsedSectionMetadata,
  SectionType,
  SectionWithParsedMetadata,
  StoreResult,
} from '@/lib/types/documentBuilder.types';
import { groupBy, safeParse } from '@/lib/utils/objectUtils';
import type { BuilderRootStore } from './builderRootStore';
import { FIXED_SECTIONS } from './documentBuilder.constants';

export const parseMetadataToObservable = (raw: unknown) =>
  safeParse<ParsedSectionMetadata[]>(raw, []).map((m) => observable(m));

interface AddSectionResult {
  itemId: number | undefined;
  sectionId: number;
}

export class BuilderSectionStore {
  root: BuilderRootStore;
  sections: SectionWithParsedMetadata[] = [];
  private readonly isSectionFixedForSection = computedFn(
    (sectionId: number) => {
      const section = this.getSectionById(sectionId);
      return FIXED_SECTIONS.includes(
        (section?.type ?? '') as (typeof FIXED_SECTIONS)[number]
      );
    }
  );

  constructor(root: BuilderRootStore) {
    this.root = root;
    makeAutoObservable<this, 'isSectionFixedForSection'>(
      this,
      {
        isSectionFixedForSection: false,
      },
      { autoBind: true }
    );
  }

  get sectionsByType() {
    return groupBy(this.sections, 'type');
  }

  get sectionsById() {
    return new Map(this.sections.map((section) => [section.id, section]));
  }

  get sectionsWithItems() {
    return this.sections.map((section) => {
      return {
        ...section,
        items: this.root.itemStore.getItemsBySectionId(section.id),
      };
    });
  }

  get orderedSectionIds() {
    return this.sections
      .slice()
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((s) => s.id);
  }

  getSectionById(sectionId: number) {
    return this.sectionsById.get(sectionId);
  }

  isSectionFixed(sectionId: number) {
    const modelSection = this.root.documentModel?.sectionsById.get(
      sectionId as SectionId
    );
    if (modelSection) {
      return modelSection.definition.sectionCardinality === 'required-one';
    }
    return this.isSectionFixedForSection(sectionId);
  }

  getSectionMetadataOptions(sectionId: number): ParsedSectionMetadata[] {
    const section = this.getSectionById(sectionId);
    if (!section || !section?.metadata) {
      return [];
    }
    return section?.metadata || [];
  }

  getSectionNameByType(sectionType: SectionType): string {
    return (
      this.sections.find((section) => section.type === sectionType)?.title || ''
    );
  }

  getSectionItemsBySectionType(type: SectionType) {
    const section = this.sectionsByType[type]?.[0];
    return section ? this.root.itemStore.getItemsBySectionId(section.id) : [];
  }

  setSections(sections: SectionWithParsedMetadata[]) {
    this.sections = sections.map((s) => ({
      ...s,
      metadata: parseMetadataToObservable(s.metadata),
    }));
  }

  async reOrderSections(sectionIds: number[]): Promise<StoreResult> {
    const model = this.root.documentModel;
    if (!model) {
      return { success: false, error: 'Builder document is not ready' };
    }
    return model.reorderSections(sectionIds as SectionId[]);
  }

  async addNewSection(
    option: Omit<OtherSectionOption, 'icon'>
  ): Promise<AddSectionResult | undefined> {
    const model = this.root.documentModel;
    if (!model) {
      return undefined;
    }
    const result = await model.addSection(option);
    if (!result.success) {
      return undefined;
    }
    const data = result.data;
    if (!data) {
      return undefined;
    }
    runInAction(() => this.root.UIStore.toggleItem(data.itemId));
    return data;
  }

  async removeSection(sectionId: number): Promise<boolean> {
    const model = this.root.documentModel;
    if (!model) {
      return false;
    }
    const removed = await model.removeSection(sectionId as SectionId);
    if (removed) {
      this.root.disposeProjectedSection(sectionId);
    }
    return removed;
  }

  async renameSection(sectionId: number, value: string): Promise<StoreResult> {
    const model = this.root.documentModel;
    if (!model) {
      return { success: false, error: 'Builder document is not ready' };
    }
    return model.renameSection(sectionId as SectionId, value);
  }

  async updateSectionMetadata(
    sectionId: number,
    data: {
      key: string;
      value: string;
    }
  ): Promise<StoreResult> {
    const model = this.root.documentModel;
    if (!model) {
      return { success: false, error: 'Builder document is not ready' };
    }
    return model.updateSectionMetadata(
      sectionId as SectionId,
      data.key,
      data.value
    );
  }
}
