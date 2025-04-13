import { UpdateSpec } from 'dexie';
import { clientDb } from './clientDb';
import {
  DEX_AiSuggestions,
  DEX_Document,
  DEX_Field,
  DEX_InsertDocumentModel,
  DEX_InsertFieldModel,
  DEX_InsertItemModel,
  DEX_Item,
  DEX_JobPosting,
  DEX_Section,
  SelectField,
} from './clientDbSchema';
import {
  getInitialDocumentInsertBoilerplate,
  isSelectField,
  prepareSectionsInsertData,
} from '@/lib/helpers/documentBuilderHelpers';
import { ResumeTemplate } from '../types/documentBuilder.types';
import {
  getTemplateByStyle,
  PrefilledResumeStyle,
} from '../templates/prefilledTemplates';
import JobPostingService from '@/lib/client-db/jobPostingService';
import SectionService from '@/lib/client-db/sectionService';
import ItemService from '@/lib/client-db/itemService';
import FieldService from '@/lib/client-db/fieldService';
import AiSuggestionsService from '@/lib/client-db/aiSuggestionsService';
import { excludeObjectKeys } from '../utils/objectUtils';

type GetFullDocumentStructureResponse =
  | { success: false; error: string }
  | {
      success: true;
      document: DEX_Document;
      jobPosting: DEX_JobPosting | null;
      sections: DEX_Section[];
      items: DEX_Item[];
      fields: DEX_Field[];
      aiSuggestions: DEX_AiSuggestions | null;
    };

class DocumentService {
  static async createDocument(
    data: Omit<DEX_InsertDocumentModel, 'jobPostingId'> & {
      selectedPrefillStyle: PrefilledResumeStyle | null;
    },
  ) {
    return clientDb.transaction(
      'rw',
      [clientDb.documents, clientDb.sections, clientDb.items, clientDb.fields],
      async () => {
        const documentId = await clientDb.documents.add({
          templateType: data.templateType,
          title: data.title,
        } as DEX_Document);

        const sectionTemplates = data.selectedPrefillStyle
          ? getTemplateByStyle(data.selectedPrefillStyle, documentId)
          : getInitialDocumentInsertBoilerplate(documentId);

        const sectionInsertIds = await SectionService.bulkAddSections(
          prepareSectionsInsertData(sectionTemplates, documentId),
        );

        const itemInsertDtos: DEX_InsertItemModel[] = [];
        const fieldInsertDtos: DEX_InsertFieldModel[] = [];

        sectionTemplates.forEach((sectionTemplate, sectionIndex) => {
          const sectionId = sectionInsertIds[sectionIndex];
          if (!sectionTemplate) return;

          sectionTemplate.items.forEach((item) => {
            const itemInsertIndex = itemInsertDtos.length;
            itemInsertDtos.push({
              containerType: item.containerType || 'static',
              displayOrder: item.displayOrder,
              sectionId,
            });

            item.fields.forEach((field) => {
              if (isSelectField(field)) {
                (fieldInsertDtos as Omit<SelectField, 'id'>[]).push({
                  itemId: itemInsertIndex,
                  name: field.name,
                  type: field.type,
                  selectType: field?.selectType || 'basic',
                  options: field?.options || null,
                  value: field.value,
                });
              } else {
                fieldInsertDtos.push({
                  itemId: itemInsertIndex,
                  name: field.name,
                  type: field.type,
                  value: field.value,
                  placeholder: field?.placeholder || '',
                });
              }
            });
          });
        });

        const itemInsertIds = await ItemService.bulkAddItems(itemInsertDtos);

        const resolvedFieldDtos = fieldInsertDtos.map((field) => ({
          ...field,
          itemId: itemInsertIds[field.itemId],
        }));

        await FieldService.bulkAddFields(resolvedFieldDtos);

        return documentId;
      },
    );
  }

  static async getFullDocumentStructure(
    documentId: DEX_Document['id'],
  ): Promise<GetFullDocumentStructureResponse> {
    return clientDb.transaction(
      'r',
      [
        clientDb.documents,
        clientDb.sections,
        clientDb.items,
        clientDb.fields,
        clientDb.jobPostings,
        clientDb.aiSuggestions,
      ],
      async () => {
        const document = await this.getDocumentById(documentId);
        if (!document) {
          return {
            success: false,
            error: 'Document not found.',
          };
        }

        const jobPosting = document.jobPostingId
          ? (await JobPostingService.getJobPosting(document.jobPostingId)) ||
            null
          : null;

        const sections = await SectionService.getSectionsByDocumentId(
          document.id,
        );
        const sectionIds = sections.map((section) => section.id);

        const items = await ItemService.getItemsWithSectionIds(sectionIds);
        const itemIds = items.map((item) => item.id);

        const fields = await FieldService.getFieldsWithItemIds(itemIds);

        const aiSuggestions =
          await AiSuggestionsService.getAiSuggestionsByDocumentId(document.id);

        return {
          success: true,
          document,
          jobPosting,
          sections,
          items,
          fields,
          aiSuggestions,
        };
      },
    );
  }

  static async updateDocument(
    documentId: DEX_Document['id'],
    data: UpdateSpec<DEX_Document>,
  ) {
    return clientDb.documents.update(documentId, data);
  }

  static async renameDocument(documentId: DEX_Document['id'], title: string) {
    return this.updateDocument(documentId, { title });
  }

  static async deleteDocument(documentId: DEX_Document['id']) {
    return clientDb.transaction(
      'rw',
      [
        clientDb.documents,
        clientDb.sections,
        clientDb.items,
        clientDb.fields,
        clientDb.jobPostings,
        clientDb.aiSuggestions,
      ],
      async () => {
        await clientDb.documents.delete(documentId);

        const sectionIds =
          await SectionService.getSectionIdsByDocumentId(documentId);
        await SectionService.bulkDeleteSections(sectionIds);

        const itemIds = await ItemService.getItemIdsBySectionIds(sectionIds);
        await ItemService.bulkDeleteItems(itemIds);

        const fieldIds = await FieldService.getFieldIdsByItemIds(itemIds);
        await FieldService.bulkDeleteFields(fieldIds);
        await JobPostingService.removeJobPostingByDocumentId(documentId);
      },
    );
  }

  static changeDocumentTemplateType = async (
    documentId: DEX_Document['id'],
    templateType: ResumeTemplate,
  ) => {
    return this.updateDocument(documentId, { templateType });
  };

  static getDocumentById = async (
    documentId: DEX_Document['id'],
  ): Promise<DEX_Document | null> => {
    return (await clientDb.documents.get(documentId)) || null;
  };

  static copyDocument = async (documentId: DEX_Document['id']) => {
    const sourceDocumentStructure =
      await this.getFullDocumentStructure(documentId);

    if (!sourceDocumentStructure?.success) {
      throw new Error(
        'There was a problem copying the document. Please refresh the page and try again.',
      );
    }

    return clientDb.transaction(
      'rw',
      [clientDb.documents, clientDb.sections, clientDb.items, clientDb.fields],
      async () => {
        const newDocumentId = await clientDb.documents.add({
          templateType: sourceDocumentStructure.document.templateType,
          title: `${sourceDocumentStructure.document.title}(copy)`,
        } as DEX_Document);

        const insertPayload = sourceDocumentStructure.sections.map(
          (section) => {
            const items = sourceDocumentStructure.items.filter(
              (item) => item.sectionId === section.id,
            );

            return {
              section: {
                ...excludeObjectKeys(section, ['id', 'documentId']),
                documentId: newDocumentId,
              },
              items: items.map((item) => {
                return {
                  item: excludeObjectKeys(item, ['id', 'sectionId']),
                  fields: sourceDocumentStructure.fields
                    .filter((field) => field.itemId === item.id)
                    .map((field) => excludeObjectKeys(field, ['id', 'itemId'])),
                };
              }),
            };
          },
        );

        const sectionInsertIds = await SectionService.bulkAddSections(
          insertPayload.map((entry) => entry.section),
        );

        const flatItems: Array<{
          item: Omit<DEX_Item, 'id'>;
          fields: Omit<DEX_Field, 'itemId' | 'id'>[];
        }> = [];

        insertPayload.forEach((entry, sectionIndex) => {
          const sectionId = sectionInsertIds[sectionIndex] as number;
          entry.items.forEach((item) => {
            flatItems.push({
              item: {
                ...item.item,
                sectionId,
              },
              fields: item.fields,
            });
          });
        });

        const itemInsertIds = await ItemService.bulkAddItems(
          flatItems.map((entry) => entry.item),
        );

        const flatFields = flatItems.flatMap((entry, index) =>
          entry.fields.map((field) => ({
            ...field,
            itemId: itemInsertIds[index] as number,
          })),
        );

        await FieldService.bulkAddFields(flatFields);

        return newDocumentId;
      },
    );
  };
}

export default DocumentService;
