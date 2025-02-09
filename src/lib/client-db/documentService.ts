import { UpdateSpec } from 'dexie';
import { clientDb } from './clientDb';
import {
  DEX_Document,
  DEX_Field,
  DEX_InsertDocumentModel,
  DEX_InsertFieldModel,
  DEX_InsertItemModel,
  DEX_Item,
  DEX_Section,
  SelectField,
} from './clientDbSchema';
import {
  getInitialDocumentInsertBoilerplate,
  isSelectField,
} from '@/lib/helpers/documentBuilderHelpers';
import { ResumeTemplate } from '../types/documentBuilder.types';
import {
  getTemplateByStyle,
  PrefilledResumeStyle,
} from '../templates/prefilledTemplates';

type GetFullDocumentStructureResponse =
  | { success: false; error: string }
  | {
      success: true;
      document: DEX_Document;
      sections: DEX_Section[];
      items: DEX_Item[];
      fields: DEX_Field[];
    };

class DocumentService {
  static async createDocument(
    data: DEX_InsertDocumentModel & {
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

        const prepareSections = () =>
          sectionTemplates.map((section) => ({
            defaultTitle: section.defaultTitle,
            title: section.title,
            displayOrder: section.displayOrder,
            documentId,
            metadata: section?.metadata || '',
            type: section.type,
          }));

        const sectionInsertIds = await clientDb.sections.bulkAdd(
          prepareSections(),
          {
            allKeys: true,
          },
        );

        const itemInsertDtos: DEX_InsertItemModel[] = [];
        const fieldInsertDtos: DEX_InsertFieldModel[] = [];

        sectionTemplates.forEach((sectionTemplate, sectionIndex) => {
          const sectionId = sectionInsertIds[sectionIndex];
          if (!sectionTemplate) return;

          sectionTemplate.items.forEach((item) => {
            itemInsertDtos.push({
              containerType: item.containerType || 'static',
              displayOrder: item.displayOrder,
              sectionId,
            });

            item.fields.forEach((field) => {
              if (isSelectField(field)) {
                (fieldInsertDtos as Omit<SelectField, 'id'>[]).push({
                  itemId: sectionIndex,
                  name: field.name,
                  type: field.type,
                  selectType: field?.selectType || 'basic',
                  options: field?.options || null,
                  value: field.value,
                });
              } else {
                fieldInsertDtos.push({
                  itemId: sectionIndex,
                  name: field.name,
                  type: field.type,
                  value: field.value,
                  placeholder: field?.placeholder || '',
                });
              }
            });
          });
        });

        const itemInsertIds = await clientDb.items.bulkAdd(itemInsertDtos, {
          allKeys: true,
        });

        const resolvedFieldDtos = fieldInsertDtos.map((field) => ({
          ...field,
          itemId: itemInsertIds[field.itemId],
        }));

        await clientDb.fields.bulkAdd(resolvedFieldDtos);

        return documentId;
      },
    );
  }

  static async getFullDocumentStructure(
    documentId: DEX_Document['id'],
  ): Promise<GetFullDocumentStructureResponse> {
    return clientDb.transaction(
      'r',
      [clientDb.documents, clientDb.sections, clientDb.items, clientDb.fields],
      async () => {
        const document = await clientDb.documents.get(documentId);
        if (!document) {
          return {
            success: false,
            error: 'Document not found.',
          };
        }

        const sections = await clientDb.sections
          .where('documentId')
          .equals(documentId)
          .toArray();
        const sectionIds = sections.map((section) => section.id);

        const items = await clientDb.items
          .where('sectionId')
          .anyOf(sectionIds)
          .toArray();
        const itemIds = items.map((item) => item.id);

        const fields = await clientDb.fields
          .where('itemId')
          .anyOf(itemIds)
          .toArray();

        return {
          success: true,
          document,
          sections,
          items,
          fields,
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
      [clientDb.documents, clientDb.sections, clientDb.items, clientDb.fields],
      async () => {
        await clientDb.documents.delete(documentId);

        const sectionIds = await clientDb.sections
          .where('documentId')
          .equals(documentId)
          .primaryKeys();

        await clientDb.sections.bulkDelete(sectionIds);

        const itemIds = await clientDb.items
          .where('sectionId')
          .anyOf(sectionIds)
          .primaryKeys();
        await clientDb.items.bulkDelete(itemIds);

        const fieldIds = await clientDb.fields
          .where('itemId')
          .anyOf(itemIds)
          .primaryKeys();
        await clientDb.fields.bulkDelete(fieldIds);
      },
    );
  }

  static changeDocumentTemplateType = async (
    documentId: DEX_Document['id'],
    templateType: ResumeTemplate,
  ) => {
    return this.updateDocument(documentId, { templateType });
  };
}

export default DocumentService;
