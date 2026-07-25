import { makeAutoObservable, observable, runInAction } from 'mobx';
import { computedFn } from 'mobx-utils';
import type { OtherSectionOption } from '@/components/documentBuilder/AddSectionWidget';
import { clientDb } from '@/lib/client-db/clientDb';
import type {
  DEX_Field,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import {
  bulkUpdateSections,
  deleteSection,
  updateSection,
} from '@/lib/client-db/sectionService';
import { getItemInsertTemplate } from '@/lib/helpers/documentBuilderHelpers';
import type {
  MetadataValue,
  ParsedSectionMetadata,
  SectionMetadataKey,
  SectionType,
  SectionWithParsedMetadata,
  StoreResult,
} from '@/lib/types/documentBuilder.types';
import { groupBy, safeParse } from '@/lib/utils/objectUtils';
import type { BuilderRootStore } from './builderRootStore';
import {
  FIXED_SECTIONS,
  INTERNAL_SECTION_TYPES,
  MAX_PERSONAL_DETAILS_LINKS,
} from './documentBuilder.constants';

export const parseMetadataToObservable = (raw: unknown) =>
  safeParse<ParsedSectionMetadata[]>(raw, []).map((m) => observable(m));

interface AddSectionResult {
  itemId: DEX_Item['id'] | undefined;
  sectionId: DEX_Section['id'];
}

interface CreatedSectionRecords extends AddSectionResult {
  fields: DEX_Field[];
  item: DEX_Item;
  section: DEX_Section;
}

export class BuilderSectionStore {
  root: BuilderRootStore;
  sections: SectionWithParsedMetadata[] = [];
  private readonly isSectionFixedForSection = computedFn(
    (sectionId: DEX_Section['id']) => {
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

  getSectionById(sectionId: DEX_Section['id']) {
    return this.sectionsById.get(sectionId);
  }

  isSectionFixed(sectionId: DEX_Section['id']) {
    return this.isSectionFixedForSection(sectionId);
  }

  getSectionMetadataOptions(
    sectionId: DEX_Section['id']
  ): ParsedSectionMetadata[] {
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

  async reOrderSections(sectionIds: DEX_Section['id'][]): Promise<StoreResult> {
    if (sectionIds.length === 0) {
      return { success: false, error: 'No sections to reorder' };
    }

    const newDisplayOrders = sectionIds.map((id, index) => ({
      id,
      displayOrder: index + 1,
    }));

    const changedSections = newDisplayOrders.filter((newOrder) => {
      const prevItem = this.sections.find(
        (section) => section.id === newOrder.id
      );
      return prevItem && prevItem.displayOrder !== newOrder.displayOrder;
    });

    if (changedSections.length === 0) {
      return { success: true };
    }

    const previousDisplayOrders = new Map(
      changedSections.map(({ id }) => [
        id,
        this.sectionsById.get(id)?.displayOrder ?? 0,
      ])
    );

    runInAction(() => {
      this.sections.forEach((section) => {
        const newOrder = newDisplayOrders.find((o) => o.id === section.id);
        if (newOrder && newOrder?.displayOrder !== section.displayOrder) {
          section.displayOrder = newOrder.displayOrder;
        }
      });
    });

    try {
      await bulkUpdateSections(
        changedSections.map((section) => ({
          key: section.id,
          changes: {
            displayOrder: section.displayOrder,
          },
        }))
      );

      return { success: true };
    } catch (error) {
      console.error('bulkUpdateSections error', error);
      runInAction(() => {
        this.sections.forEach((section) => {
          const previousDisplayOrder = previousDisplayOrders.get(section.id);
          if (previousDisplayOrder !== undefined) {
            section.displayOrder = previousDisplayOrder;
          }
        });
      });
      return { success: false, error: 'Failed to reorder sections' };
    }
  }

  async addNewSection(
    option: Omit<OtherSectionOption, 'icon'>
  ): Promise<AddSectionResult | undefined> {
    const template = getItemInsertTemplate(option.type);
    if (!template) {
      return;
    }

    if (!this.root.documentStore.document) {
      return;
    }

    const documentId = this.root.documentStore.document.id;

    const createSection = (): Promise<CreatedSectionRecords | undefined> =>
      clientDb.transaction(
        'rw',
        [clientDb.sections, clientDb.fields, clientDb.items],
        async () => {
          const documentSections = await clientDb.sections
            .where('documentId')
            .equals(documentId)
            .toArray();

          if (option.type !== INTERNAL_SECTION_TYPES.CUSTOM) {
            const hasExistingSection = documentSections.some(
              (section) => section.type === option.type
            );
            if (hasExistingSection) {
              return;
            }
          }

          const sectionDisplayOrder =
            documentSections.reduce(
              (acc, curr) => Math.max(acc, curr.displayOrder),
              0
            ) + 1;
          const itemDisplayOrder = template.displayOrder;
          const sectionDto = {
            displayOrder: sectionDisplayOrder,
            title: option.title,
            defaultTitle: option.defaultTitle,
            type: option.type,
            metadata: option?.metadata,
            documentId,
          };

          const sectionId = await clientDb.sections.add(sectionDto);
          const section = {
            ...sectionDto,
            id: sectionId,
          };

          if (option.type === INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS) {
            const matchingSectionIds = (
              await clientDb.sections
                .where('documentId')
                .equals(documentId)
                .filter((candidate) => candidate.type === option.type)
                .toArray()
            ).map((candidate) => candidate.id);
            const itemCount = matchingSectionIds.length
              ? await clientDb.items
                  .where('sectionId')
                  .anyOf(matchingSectionIds)
                  .count()
              : 0;

            if (itemCount >= MAX_PERSONAL_DETAILS_LINKS) {
              await clientDb.sections.delete(sectionId);
              return;
            }
          }

          const itemId = await clientDb.items.add({
            sectionId,
            containerType: template.containerType,
            displayOrder: itemDisplayOrder,
          });

          const fieldsPayload = template.fields.map((field) => ({
            ...field,
            itemId,
          }));

          const fieldIds = await clientDb.fields.bulkAdd(fieldsPayload, {
            allKeys: true,
          });

          const fields = fieldsPayload.map((field, index) => ({
            ...field,
            id: fieldIds[index],
            itemId,
          })) as DEX_Field[];
          const item = {
            id: itemId,
            sectionId,
            containerType: template.containerType,
            displayOrder: itemDisplayOrder,
          };

          return {
            fields,
            item,
            itemId,
            section,
            sectionId,
          };
        }
      );

    const result = await createSection();
    if (!result) {
      return;
    }

    if (this.root.documentStore.document?.id !== documentId) {
      return;
    }

    runInAction(() => {
      this.sections.push({
        ...result.section,
        metadata: parseMetadataToObservable(result.section.metadata),
      });

      this.root.itemStore.items.push(result.item);
      this.root.fieldStore.fields.push(...result.fields);
      result.fields.forEach((field) => {
        this.root.fieldStore.fieldValues.set(field.id, field.value ?? '');
      });
      this.root.UIStore.toggleItem(result.item.id);
    });

    return {
      itemId: result.itemId,
      sectionId: result.sectionId,
    };
  }

  async removeSection(sectionId: DEX_Section['id']) {
    const section = this.sections.find((section) => section.id === sectionId);
    if (!section) {
      return;
    }

    const itemIdsToKeep = this.root.itemStore.items
      .filter((item) => item.sectionId !== sectionId)
      .map((item) => item.id);

    const prevSections = this.sections;
    const prevItems = this.root.itemStore.items;
    const prevFields = this.root.fieldStore.fields;
    const prevFieldValues = new Map(this.root.fieldStore.fieldValues);
    const itemIdsToRemove = this.root.itemStore.items
      .filter((item) => item.sectionId === sectionId)
      .map((item) => item.id);
    const removedFieldIds = this.root.fieldStore.fields
      .filter((field) => itemIdsToRemove.includes(field.itemId))
      .map((field) => field.id);

    runInAction(() => {
      this.sections = this.sections.filter(
        (section) => section.id !== sectionId
      );
      this.root.itemStore.items = this.root.itemStore.items.filter(
        (item) => item.sectionId !== sectionId
      );
      this.root.fieldStore.fields = this.root.fieldStore.fields.filter(
        (field) => itemIdsToKeep.includes(field.itemId)
      );
      removedFieldIds.forEach((fieldId) => {
        this.root.fieldStore.fieldValues.delete(fieldId);
      });
    });

    try {
      await deleteSection(sectionId);
    } catch (error) {
      console.error('Error deleting section:', error);
      runInAction(() => {
        this.sections = prevSections;
        this.root.itemStore.items = prevItems;
        this.root.fieldStore.fields = prevFields;
        this.root.fieldStore.fieldValues.clear();
        prevFieldValues.forEach((value, key) => {
          this.root.fieldStore.fieldValues.set(key, value);
        });
      });
    }
  }

  async renameSection(sectionId: DEX_Section['id'], value: string) {
    const section = this.sections.find((section) => section.id === sectionId);
    if (!section) {
      return;
    }

    const prevTitle = section.title;

    runInAction(() => {
      section.title = value;
    });

    try {
      await updateSection(sectionId, {
        title: value,
      });
    } catch (error) {
      console.error('Error updating section title:', error);
      runInAction(() => {
        section.title = prevTitle;
      });
    }
  }

  async updateSectionMetadata(
    sectionId: DEX_Section['id'],
    data: {
      key: SectionMetadataKey;
      value: MetadataValue;
    }
  ) {
    const section = this.getSectionById(sectionId);
    if (!section) {
      return;
    }

    const metadata = section.metadata.find((m) => m.key === data.key);
    if (!metadata) {
      return;
    }

    const prev = metadata.value;

    runInAction(() => {
      metadata.value = data.value;
    });

    try {
      await updateSection(sectionId, {
        metadata: JSON.stringify(section.metadata),
      });
    } catch (error) {
      runInAction(() => {
        metadata.value = prev;
      });
      console.error('Error updating section metadata:', error);
    }
  }
}
