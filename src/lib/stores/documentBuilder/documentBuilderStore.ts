import {
  computed,
  makeAutoObservable,
  observable,
  ObservableMap,
  reaction,
  runInAction,
} from 'mobx';
import type {
  DEX_Document,
  DEX_Field,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import { clientDb } from '@/lib/client-db/clientDb';
import {
  addItemFromTemplate,
  bulkUpdateItems,
  bulkUpdateSections,
  deleteItem,
  deleteSection,
  getFullDocumentStructure,
  renameDocument,
  updateField,
  updateSection,
} from '@/lib/client-db/clientDbService';
import { getItemInsertTemplate } from '@/lib/helpers/documentBuilderHelpers';
import { OtherSectionOption } from '@/components/documentBuilder/AddSectionWidget';
import {
  FieldName,
  MetadataValue,
  ParsedSectionMetadata,
  PdfTemplateData,
  ResumeSuggestion,
  SectionMetadataKey,
  SectionType,
  SectionWithParsedMetadata,
  TemplatedSectionType,
} from '@/lib/types';
import { sortByDisplayOrder } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import {
  FIELD_NAMES,
  INTERNAL_SECTION_TYPES,
  MAX_VISIBLE_SUGGESTIONS,
  RESUME_SCORE_CONFIG,
  SUGGESTED_SKILLS_COUNT,
  SUGGESTION_ACTION_TYPES,
  TEMPLATE_DATA_DEBOUNCE_MS,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import debounce from '@/lib/utils/debounce';

export class DocumentBuilderStore {
  document: DEX_Document | null = null;
  sections: SectionWithParsedMetadata[] = [];
  items: DEX_Item[] = [];
  fields: DEX_Field[] = [];
  collapsedItemId: DEX_Item['id'] | null = null;
  debouncedTemplateData: PdfTemplateData | null = null;

  refs: ObservableMap<string, Element | null> = observable.map();

  constructor() {
    makeAutoObservable(this, {
      pdfTemplateData: computed,
      resumeStats: computed,
    });

    reaction(
      () => this.pdfTemplateData,
      debounce((data: PdfTemplateData | null) => {
        runInAction(() => {
          this.debouncedTemplateData = data;
        });
      }, TEMPLATE_DATA_DEBOUNCE_MS),
      {
        fireImmediately: true,
      },
    );
  }

  setElementRef = (key: string, value: Element | null) => {
    this.refs.set(key, value);
  };
  initializeStore = async (documentId: DEX_Document['id']) => {
    const result = await getFullDocumentStructure(documentId);
    if (!result?.success) {
      return {
        error: result?.error,
      };
    }

    const { document, sections, items, fields } = result;

    runInAction(() => {
      this.document = document;
      this.sections = sections
        .slice()
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((section) => ({
          ...section,
          metadata: JSON.parse(section?.metadata || '[]'),
        }));
      this.items = items
        .slice()
        .sort((a, b) => a.displayOrder - b.displayOrder);
      this.fields = fields;
    });
  };
  renameDocument = async (newValue: string) => {
    if (!this.document) return;
    await renameDocument(this.document.id, newValue);

    runInAction(() => {
      if (!this.document) return;
      this.document.title = newValue;
    });
  };

  getSectionById = (sectionId: DEX_Section['id']) => {
    return this.sections.find((section) => section.id === sectionId);
  };

  getItemsBySectionId = (sectionId: DEX_Section['id']) => {
    return this.items
      .filter((item) => item.sectionId === sectionId)
      .slice()
      .sort((a, b) => a.displayOrder - b.displayOrder);
  };

  getFieldsByItemId = (itemId: DEX_Item['id']) => {
    return this.fields.filter((field) => field.itemId === itemId);
  };

  getFieldById = (fieldId: DEX_Field['id']) => {
    return this.fields.find((field) => field.id === fieldId);
  };

  getItemById = (itemId: DEX_Item['id']) => {
    return this.items.find((item) => item.id === itemId);
  };

  setFieldValue = async (
    fieldId: DEX_Field['id'],
    value: string,
    shouldSaveToStore = true,
  ) => {
    const field = this.fields.find((field) => field.id === fieldId);
    if (!field) return;

    runInAction(() => {
      field.value = value;
    });

    if (shouldSaveToStore) {
      await updateField(fieldId, value);
    }
  };

  renameSection = async (sectionId: DEX_Section['id'], value: string) => {
    const section = this.sections.find((section) => section.id === sectionId);
    if (!section) return;

    runInAction(() => {
      section.title = value;
    });

    await updateSection(sectionId, {
      title: value,
    });
  };

  toggleItem = (itemId: DEX_Item['id']) => {
    this.collapsedItemId = itemId === this.collapsedItemId ? null : itemId;
  };

  removeItem = async (itemId: DEX_Item['id']) => {
    const item = this.items.find((item) => item.id === itemId);
    if (!item) return;

    runInAction(() => {
      this.items = this.items.filter((item) => item.id !== itemId);
      this.fields = this.fields.filter((field) => field.itemId !== itemId);
    });

    await deleteItem(itemId);
  };

  removeSection = async (sectionId: DEX_Section['id']) => {
    const section = this.sections.find((section) => section.id === sectionId);
    if (!section) return;

    runInAction(() => {
      const itemIdsToKeep = this.items
        .filter((item) => item.sectionId !== sectionId)
        .map((item) => item.id);

      this.sections = this.sections.filter(
        (section) => section.id !== sectionId,
      );
      this.items = this.items.filter((item) => item.sectionId !== sectionId);
      this.fields = this.fields.filter((field) =>
        itemIdsToKeep.includes(field.itemId),
      );
    });

    await deleteSection(sectionId);
  };

  addNewItemEntry = async (sectionId: DEX_Section['id']) => {
    const section = this.getSectionById(sectionId);
    if (!section) return;

    const template = getItemInsertTemplate(
      section.type as TemplatedSectionType,
    );
    if (!template) return;

    const result = await addItemFromTemplate({
      ...template,
      sectionId,
      displayOrder: this.items.reduce(
        (displayOrder, currentItem) =>
          currentItem.displayOrder > displayOrder
            ? currentItem.displayOrder
            : displayOrder,
        1,
      ),
    });

    runInAction(() => {
      const { fields, item } = result;

      this.items.push(item);
      this.fields.push(...fields);
      this.toggleItem(item.id);
    });
  };

  reOrderSectionItems = async (items: DEX_Item[]) => {
    if (items.length === 0) return;
    const newDisplayOrders = items.map((item, index) => ({
      id: item.id,
      displayOrder: index + 1,
    }));

    const changedItems = newDisplayOrders.filter((newOrder) => {
      const prevItem = this.items.find((item) => item.id === newOrder.id);
      return prevItem && prevItem.displayOrder !== newOrder.displayOrder;
    });

    runInAction(() => {
      this.items.forEach((item) => {
        const newOrder = newDisplayOrders.find((o) => o.id === item.id);
        if (newOrder && newOrder?.displayOrder !== item.displayOrder) {
          item.displayOrder = newOrder.displayOrder;
        }
      });
    });

    if (changedItems.length) {
      try {
        await bulkUpdateItems(
          changedItems.map((item) => ({
            key: item.id,
            changes: { displayOrder: item.displayOrder },
          })),
        );
      } catch (error) {
        console.error('bulkUpdateItems error', error);
      }
    }
  };
  reOrderSections = async (sections: SectionWithParsedMetadata[]) => {
    if (sections.length === 0) return;

    const newDisplayOrders = sections.map((section, index) => ({
      id: section.id,
      displayOrder: index + 1,
    }));

    const changedSections = newDisplayOrders.filter((newOrder) => {
      const prevItem = this.sections.find(
        (section) => section.id === newOrder.id,
      );
      return prevItem && prevItem.displayOrder !== newOrder.displayOrder;
    });

    runInAction(() => {
      this.sections.forEach((section) => {
        const newOrder = newDisplayOrders.find((o) => o.id === section.id);
        if (newOrder && newOrder?.displayOrder !== section.displayOrder) {
          section.displayOrder = newOrder.displayOrder;
        }
      });
    });

    if (changedSections.length) {
      try {
        await bulkUpdateSections(
          changedSections.map((section) => ({
            key: section.id,
            changes: {
              displayOrder: section.displayOrder,
            },
          })),
        );
      } catch (error) {
        console.error('bulkUpdateSections error', error);
      }
    }
  };

  addNewSection = async (option: Omit<OtherSectionOption, 'icon'>) => {
    const template = getItemInsertTemplate(option.type);
    if (!template) return;

    if (!documentBuilderStore.document) return;

    await clientDb.transaction(
      'rw',
      [clientDb.sections, clientDb.fields, clientDb.items],
      async () => {
        if (!documentBuilderStore.document) return;

        const sectionDto = {
          displayOrder: documentBuilderStore.sections.reduce(
            (acc, curr) => Math.max(acc, curr.displayOrder),
            1,
          ),
          title: option.title,
          defaultTitle: option.defaultTitle,
          type: option.type,
          metadata: option?.metadata,
          documentId: documentBuilderStore.document.id,
        };

        const sectionId = await clientDb.sections.add(sectionDto);

        runInAction(() => {
          this.sections.push({
            ...sectionDto,
            id: sectionId,
            metadata: option?.metadata ? JSON.parse(option?.metadata) : [],
          });
        });

        await this.addNewItemEntry(sectionId);
      },
    );
  };
  resetState = () => {
    this.document = null;
    this.sections = [];
    this.items = [];
    this.fields = [];
    this.collapsedItemId = null;
    this.refs = observable.map();
  };
  getSectionMetadataOptions = (
    sectionId: DEX_Section['id'],
  ): ParsedSectionMetadata[] => {
    const section = this.getSectionById(sectionId);
    if (!section || !section?.metadata) return [];
    return section?.metadata || [];
  };
  updateSectionMetadata = async (
    sectionId: DEX_Section['id'],
    data: {
      key: SectionMetadataKey;
      value: MetadataValue;
    },
  ) => {
    const section = this.getSectionById(sectionId);
    if (!section) return;

    runInAction(() => {
      const metadata = section.metadata.find(
        (metadata) => metadata.key === data.key,
      );
      if (metadata) {
        metadata.value = data.value;
      }
    });

    await updateSection(sectionId, {
      metadata: JSON.stringify(
        section.metadata.map((metadata) => ({
          ...metadata,
          value: metadata.key === data.key ? data.value : metadata.value,
        })),
      ),
    });
  };

  getFieldValueByName = (fieldName: FieldName): string => {
    return this.fields.find((field) => field.name === fieldName)?.value || '';
  };

  getSectionNameByType = (sectionType: SectionType): string => {
    return (
      this.sections.find((section) => section.type === sectionType)?.title || ''
    );
  };

  get pdfTemplateData() {
    const singleEntrySectionTypes = [
      INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
      INTERNAL_SECTION_TYPES.SUMMARY,
    ];
    const mappedSections: PdfTemplateData['sections'] = this.sections
      .filter(
        (section) =>
          !singleEntrySectionTypes.includes(
            section.type as (typeof singleEntrySectionTypes)[number],
          ),
      )
      .slice()
      .sort(sortByDisplayOrder)
      .map((section) => {
        return {
          ...section,
          items: this.items
            .slice()
            .sort(sortByDisplayOrder)
            .filter((item) => item.sectionId === section.id)
            .map((item) => ({
              ...item,
              fields: this.fields.filter((field) => field.itemId === item.id),
            })),
        };
      });

    return {
      personalDetails: {
        firstName: this.getFieldValueByName(
          FIELD_NAMES.PERSONAL_DETAILS.FIRST_NAME,
        ),
        lastName: this.getFieldValueByName(
          FIELD_NAMES.PERSONAL_DETAILS.LAST_NAME,
        ),
        jobTitle: this.getFieldValueByName(
          FIELD_NAMES.PERSONAL_DETAILS.WANTED_JOB_TITLE,
        ),
        address: this.getFieldValueByName(FIELD_NAMES.PERSONAL_DETAILS.ADDRESS),
        city: this.getFieldValueByName(FIELD_NAMES.PERSONAL_DETAILS.CITY),
        postalCode: this.getFieldValueByName(
          FIELD_NAMES.PERSONAL_DETAILS.POSTAL_CODE,
        ),
        placeOfBirth: this.getFieldValueByName(
          FIELD_NAMES.PERSONAL_DETAILS.PLACE_OF_BIRTH,
        ),
        phone: this.getFieldValueByName(FIELD_NAMES.PERSONAL_DETAILS.PHONE),
        email: this.getFieldValueByName(FIELD_NAMES.PERSONAL_DETAILS.EMAIL),
        dateOfBirth: this.getFieldValueByName(
          FIELD_NAMES.PERSONAL_DETAILS.DATE_OF_BIRTH,
        ),
        driversLicense: this.getFieldValueByName(
          FIELD_NAMES.PERSONAL_DETAILS.DRIVING_LICENSE,
        ),
      },
      summarySection: {
        sectionName: this.getSectionNameByType(INTERNAL_SECTION_TYPES.SUMMARY),
        summary: this.getFieldValueByName(FIELD_NAMES.SUMMARY.SUMMARY),
      },
      sections: mappedSections,
    };
  }

  get sectionsWithItems() {
    return this.sections.map((section) => {
      return {
        ...section,
        items: this.getItemsBySectionId(section.id),
      };
    });
  }

  get resumeStats() {
    let score = 0;
    const suggestions: ResumeSuggestion[] = [];

    const sectionChecks: {
      type: SectionType;
      score: number;
      fieldName?: FieldName;
    }[] = [
      {
        type: INTERNAL_SECTION_TYPES.WORK_EXPERIENCE,
        score: RESUME_SCORE_CONFIG.WORK_EXPERIENCE,
      },
      {
        type: INTERNAL_SECTION_TYPES.EDUCATION,
        score: RESUME_SCORE_CONFIG.EDUCATION,
      },
      {
        type: INTERNAL_SECTION_TYPES.INTERNSHIPS,
        score: RESUME_SCORE_CONFIG.INTERNSHIPS,
      },
      {
        type: INTERNAL_SECTION_TYPES.SUMMARY,
        score: RESUME_SCORE_CONFIG.SUMMARY,
        fieldName: FIELD_NAMES.SUMMARY.SUMMARY,
      },
      {
        type: INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
        score: RESUME_SCORE_CONFIG.EMAIL,
        fieldName: FIELD_NAMES.PERSONAL_DETAILS.EMAIL,
      },
      {
        type: INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
        score: RESUME_SCORE_CONFIG.JOB_TITLE,
        fieldName: FIELD_NAMES.PERSONAL_DETAILS.WANTED_JOB_TITLE,
      },
    ];

    sectionChecks.forEach(({ type, score: sectionScore, fieldName }) => {
      const section = this.sections.find((s) => s.type === type);

      if (section) {
        const hasEntry = this.getItemsBySectionId(section.id).some((item) =>
          this.getFieldsByItemId(item.id).some((field) =>
            fieldName ? field.name === fieldName : field.value,
          ),
        );

        if (hasEntry) {
          score += sectionScore;
        } else {
          suggestions.push({
            scoreValue: sectionScore,
            label: `Add ${type.replace(/_/g, ' ').toLowerCase()}`,
            type: fieldName ? 'field' : 'item',
            sectionType: type,
            actionType: SUGGESTION_ACTION_TYPES.ADD_ITEM,
            fieldName: fieldName,
          });
        }
      } else {
        suggestions.push({
          scoreValue: sectionScore,
          label: `Add ${type.replace(/_/g, ' ').toLowerCase()}`,
          type: 'item',
          sectionType: type,
          actionType: SUGGESTION_ACTION_TYPES.ADD_SECTION,
        });
      }
    });

    const dynamicSections = [
      {
        type: INTERNAL_SECTION_TYPES.LANGUAGES,
        score: RESUME_SCORE_CONFIG.LANGUAGE,
      },
      { type: INTERNAL_SECTION_TYPES.SKILLS, score: RESUME_SCORE_CONFIG.SKILL },
    ];

    dynamicSections.forEach(({ type, score: itemScore }) => {
      const section = this.sections.find((s) => s.type === type);

      if (section) {
        const items = this.getItemsBySectionId(section.id).filter((item) =>
          this.getFieldsByItemId(item.id).some((field) => field.value),
        );

        if (items.length) {
          score += items.length * itemScore;
        }

        if (
          score < 100 &&
          items.length < SUGGESTED_SKILLS_COUNT &&
          section.type === INTERNAL_SECTION_TYPES.SKILLS
        ) {
          suggestions.push({
            scoreValue: itemScore,
            label: `Add ${type.replace(/_/g, ' ').toLowerCase()}`,
            type: 'item',
            sectionType: type,
            actionType: SUGGESTION_ACTION_TYPES.ADD_ITEM,
          });
        }
      } else {
        suggestions.push({
          scoreValue: itemScore,
          label: `Add ${type.replace(/_/g, ' ').toLowerCase()}`,
          type: 'item',
          sectionType: type,
          actionType: SUGGESTION_ACTION_TYPES.ADD_SECTION,
        });
      }
    });

    return {
      score: Math.min(score, 100),
      suggestions:
        score >= 100
          ? []
          : suggestions
              .sort((a, b) => a.scoreValue - b.scoreValue)
              .slice(0, MAX_VISIBLE_SUGGESTIONS)
              .map((item) => ({
                ...item,
                key: crypto.randomUUID(),
              })),
    };
  }
}

export const documentBuilderStore = new DocumentBuilderStore();
