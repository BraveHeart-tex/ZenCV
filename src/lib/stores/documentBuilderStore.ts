import {
  runInAction,
  makeAutoObservable,
  observable,
  ObservableMap,
  computed,
  reaction,
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
  SectionMetadataKey,
  SectionType,
  SectionWithParsedMetadata,
  TemplatedSectionType,
} from '@/lib/types';
import { FIELD_NAMES, INTERNAL_SECTION_TYPES } from '../constants';
import { sortByDisplayOrder } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import debounce from '../utils/debounce';

export const TOGGLE_ITEM_WAIT_MS = 100 as const;

export const TEMPLATE_DATA_DEBOUNCE_MS = 500 as const;

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
      resumeScore: computed,
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

  get resumeScore() {
    let score = 0;
    const employmentHistorySection = this.sections.find(
      (section) => section.type === INTERNAL_SECTION_TYPES.WORK_EXPERIENCE,
    );

    // employment history => 25 pts
    if (employmentHistorySection) {
      const hasAddedWorkExperience = this.getItemsBySectionId(
        employmentHistorySection.id,
      ).some((item) => {
        const fields = this.getFieldsByItemId(item.id);
        return fields.some((field) => field.value);
      });

      if (hasAddedWorkExperience) {
        score += 25;
      }
    }

    // education => 15 pts
    const educationSection = this.sections.find(
      (section) => section.type === INTERNAL_SECTION_TYPES.EDUCATION,
    );

    if (educationSection) {
      const hasAddedEducation = this.getItemsBySectionId(
        educationSection.id,
      ).some((item) => {
        const fields = this.getFieldsByItemId(item.id);
        return fields.some((field) => field.value);
      });

      if (hasAddedEducation) {
        score += 15;
      }
    }

    // email => 5 pts
    const personalDetailsSection = this.sections.find(
      (section) => section.type === INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
    );

    if (personalDetailsSection) {
      const hasAddedEmail = this.getItemsBySectionId(
        personalDetailsSection.id,
      ).some((item) => {
        const fields = this.getFieldsByItemId(item.id);
        return fields.some(
          (field) =>
            field.name === FIELD_NAMES.PERSONAL_DETAILS.EMAIL && field.value,
        );
      });
      // wanted job title 10 pts
      const hasAddedJobTitle = this.getItemsBySectionId(
        personalDetailsSection.id,
      ).some((item) => {
        const fields = this.getFieldsByItemId(item.id);
        return fields.some(
          (field) =>
            field.name === FIELD_NAMES.PERSONAL_DETAILS.WANTED_JOB_TITLE &&
            field.value,
        );
      });

      if (hasAddedEmail) {
        score += 5;
      }

      if (hasAddedJobTitle) {
        score += 10;
      }
    }

    // profile summary => 15pts
    const professionalSummarySection = this.sections.find(
      (section) => section.type === INTERNAL_SECTION_TYPES.SUMMARY,
    );

    if (professionalSummarySection) {
      const hasAddedSummary = this.getItemsBySectionId(
        professionalSummarySection.id,
      ).some((item) => {
        const fields = this.getFieldsByItemId(item.id);
        return fields.some(
          (field) => field.name === FIELD_NAMES.SUMMARY.SUMMARY && field.value,
        );
      });
      if (hasAddedSummary) {
        score += 15;
      }
    }

    // languages => 3pts (each)
    const languagesSection = this.sections.find(
      (section) => section.type === INTERNAL_SECTION_TYPES.LANGUAGES,
    );

    if (languagesSection) {
      const addedLanguages = this.getItemsBySectionId(
        languagesSection.id,
      ).filter((item) => {
        const fields = this.getFieldsByItemId(item.id);
        return fields.some(
          (field) =>
            field.name === FIELD_NAMES.LANGUAGES.LANGUAGE && field.value,
        );
      });

      if (addedLanguages.length) {
        score += addedLanguages.length * 3;
      }
    }

    // skill => 4 pts (each)
    const skillsSection = this.sections.find(
      (section) => section.type === INTERNAL_SECTION_TYPES.SKILLS,
    );

    if (skillsSection) {
      const addedSkills = this.getItemsBySectionId(skillsSection.id).filter(
        (item) => {
          const fields = this.getFieldsByItemId(item.id);
          return fields.some(
            (field) => field.name === FIELD_NAMES.SKILLS.SKILL && field.value,
          );
        },
      );

      if (addedSkills.length) {
        score += addedSkills.length * 4;
      }
    }

    return Math.min(score, 100);
  }
}

export const documentBuilderStore = new DocumentBuilderStore();
