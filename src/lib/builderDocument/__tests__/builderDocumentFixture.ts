import type {
  DEX_Document,
  DEX_Field,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import { sectionDefinitions } from '@/lib/sectionDefinitions/sectionDefinitions';
import type { PersistedDocumentRecords } from '../builderDocument';

export const builderDocumentFixture = (): PersistedDocumentRecords => {
  const document = {
    id: 1,
    title: 'Resume',
    templateType: 'tokyo',
    templateSettings: '{}',
    createdAt: '',
    updatedAt: '',
    jobPostingId: null,
  } as DEX_Document;
  const keys = ['personalDetails', 'summary', 'workExperience'] as const;
  const sections: DEX_Section[] = [];
  const items: DEX_Item[] = [];
  const fields: DEX_Field[] = [];
  keys.forEach((key, index) => {
    const definition = sectionDefinitions[key];
    const sectionId = index + 10;
    const itemId = index + 20;
    sections.push({
      id: sectionId,
      documentId: 1,
      title: definition.label,
      defaultTitle: definition.label,
      type: definition.persistedType,
      displayOrder: index + 1,
      metadata: '',
    } as DEX_Section);
    items.push({
      id: itemId,
      sectionId,
      containerType: definition.expectedContainerType,
      displayOrder: 1,
    });
    Object.values(definition.fields).forEach((field, fieldIndex) => {
      fields.push({
        id: index * 100 + fieldIndex + 1,
        itemId,
        name: field.persistedName,
        type: field.expectedPersistedType,
        value: `value-${field.key}`,
        ...(field.control === 'select'
          ? { selectType: 'basic', options: [...field.options] }
          : {}),
      } as DEX_Field);
    });
  });
  return { document, sections, items, fields };
};
