import { computed, makeAutoObservable, observable, runInAction } from 'mobx';
import { computedFn } from 'mobx-utils';
import type { OtherSectionOption } from '@/components/documentBuilder/AddSectionWidget';
import { clientDb } from '@/lib/client-db/clientDb';
import type { DEX_Item, DEX_Section } from '@/lib/client-db/clientDbSchema';
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
} from './documentBuilder.constants';

export const parseMetadataToObservable = (raw: unknown) =>
  safeParse<ParsedSectionMetadata[]>(raw, []).map((m) => observable(m));

export class BuilderSectionStore {
  root: BuilderRootStore;
  sections: SectionWithParsedMetadata[] = [];

  constructor(root: BuilderRootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  @computed
  get sectionsByType() {
    return groupBy(this.sections, 'type');
  }

  @computed
  get sectionsById() {
    return new Map(this.sections.map((section) => [section.id, section]));
  }

  @computed
  get sectionsWithItems() {
    return this.sections.map((section) => {
      return {
        ...section,
        items: this.root.itemStore.getItemsBySectionId(section.id),
      };
    });
  }

  @computed
  get orderedSectionIds() {
    return this.sections
      .slice()
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((s) => s.id);
  }

  getSectionById = (sectionId: DEX_Section['id']) => {
    return this.sectionsById.get(sectionId);
  };

  isSectionFixed = computedFn((sectionId: DEX_Section['id']) => {
    const section = this.getSectionById(sectionId);
    return FIXED_SECTIONS.includes(
      (section?.type ?? '') as (typeof FIXED_SECTIONS)[number]
    );
  });

  getSectionMetadataOptions = (
    sectionId: DEX_Section['id']
  ): ParsedSectionMetadata[] => {
    const section = this.getSectionById(sectionId);
    if (!section || !section?.metadata) {
      return [];
    }
    return section?.metadata || [];
  };

  getSectionNameByType = (sectionType: SectionType): string => {
    return (
      this.sections.find((section) => section.type === sectionType)?.title || ''
    );
  };

  getSectionItemsBySectionType = (type: SectionType) => {
    const section = this.sectionsByType[type]?.[0];
    return section ? this.root.itemStore.getItemsBySectionId(section.id) : [];
  };

  setSections = (sections: SectionWithParsedMetadata[]) => {
    this.sections = sections.map((s) => ({
      ...s,
      metadata: parseMetadataToObservable(s.metadata),
    }));
  };

  reOrderSections = async (
    sectionIds: DEX_Section['id'][]
  ): Promise<StoreResult> => {
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

    const prevSections = this.sections;

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
        this.sections = prevSections;
      });
      return { success: false, error: 'Failed to reorder sections' };
    }
  };

  addNewSection = async (option: Omit<OtherSectionOption, 'icon'>) => {
    const template = getItemInsertTemplate(option.type);
    if (!template) {
      return;
    }

    if (!this.root.documentStore.document) {
      return;
    }

    let createdSectionId: DEX_Section['id'] | undefined;
    let createdItemId: DEX_Item['id'] | undefined;

    try {
      return await clientDb.transaction(
        'rw',
        [clientDb.sections, clientDb.fields, clientDb.items],
        async () => {
          if (!this.root.documentStore.document) {
            return;
          }

          const sectionDto = {
            displayOrder: this.sections.reduce(
              (acc, curr) => Math.max(acc, curr.displayOrder),
              1
            ),
            title: option.title,
            defaultTitle: option.defaultTitle,
            type: option.type,
            metadata: option?.metadata,
            documentId: this.root.documentStore.document.id,
          };

          const sectionId = await clientDb.sections.add(sectionDto);
          createdSectionId = sectionId;

          runInAction(() => {
            this.sections.push({
              ...sectionDto,
              id: sectionId,
              metadata: parseMetadataToObservable(option.metadata),
            });
          });

          const itemId = await this.root.itemStore.addNewItemEntry(sectionId);
          createdItemId = itemId;

          if (
            itemId === undefined &&
            option.type === INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS
          ) {
            await clientDb.sections.delete(sectionId);
            runInAction(() => {
              this.sections = this.sections.filter(
                (section) => section.id !== sectionId
              );
            });
            createdSectionId = undefined;
            return;
          }

          return {
            itemId,
            sectionId,
          };
        }
      );
    } catch (error) {
      runInAction(() => {
        if (createdSectionId !== undefined) {
          this.sections = this.sections.filter(
            (section) => section.id !== createdSectionId
          );
        }
        if (createdItemId !== undefined) {
          this.root.itemStore.items = this.root.itemStore.items.filter(
            (item) => item.id !== createdItemId
          );
          const createdFieldIds = this.root.fieldStore.fields
            .filter((field) => field.itemId === createdItemId)
            .map((field) => field.id);
          this.root.fieldStore.fields = this.root.fieldStore.fields.filter(
            (field) => field.itemId !== createdItemId
          );
          createdFieldIds.forEach((fieldId) => {
            this.root.fieldStore.fieldValues.delete(fieldId);
          });
        }
      });
      throw error;
    }
  };

  removeSection = async (sectionId: DEX_Section['id']) => {
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
  };

  renameSection = async (sectionId: DEX_Section['id'], value: string) => {
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
  };

  updateSectionMetadata = async (
    sectionId: DEX_Section['id'],
    data: {
      key: SectionMetadataKey;
      value: MetadataValue;
    }
  ) => {
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
  };
}
