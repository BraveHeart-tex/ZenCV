import type { InsertType } from 'dexie';
import {
  CONTAINER_TYPES,
  type DEX_Document,
  type DEX_Item,
  type DEX_Section,
  FIELD_TYPES,
  type FieldInsertTemplate,
  type SectionWithFields,
  type SelectField,
} from '@/lib/client-db/clientDbSchema';
import {
  coursesSectionFields,
  customSectionFields,
  educationFields,
  employmentHistoryFields,
  hobbiesSectionFields,
  languagesSectionFields,
  personalDetailsSectionFields,
  referencesSectionFields,
  skillsSectionFields,
  summarySectionFields,
  websitesAndLinkFields,
} from '@/lib/misc/fieldTemplates';
import { getDefaultSkillsMetadata } from '@/lib/misc/sectionMetadataTemplates';
import { INTERNAL_SECTION_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import type { TemplatedSectionType } from '@/lib/types/documentBuilder.types';

export const getInitialDocumentInsertBoilerplate = (
  documentId: DEX_Document['id']
): SectionWithFields[] => {
  return [
    {
      documentId,
      title: 'Personal Details',
      type: INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
      items: [
        {
          containerType: CONTAINER_TYPES.STATIC,
          displayOrder: 1,
          fields: personalDetailsSectionFields,
        },
      ],
    },
    {
      documentId,
      title: 'Summary',
      type: INTERNAL_SECTION_TYPES.SUMMARY,
      items: [
        {
          containerType: CONTAINER_TYPES.STATIC,
          displayOrder: 1,
          fields: summarySectionFields,
        },
      ],
    },
    {
      documentId,
      title: 'Work Experience',
      type: INTERNAL_SECTION_TYPES.WORK_EXPERIENCE,
      items: [
        {
          containerType: CONTAINER_TYPES.COLLAPSIBLE,
          displayOrder: 1,
          fields: employmentHistoryFields,
        },
      ],
    },
    {
      documentId,
      title: 'Education',
      type: INTERNAL_SECTION_TYPES.EDUCATION,
      items: [
        {
          containerType: CONTAINER_TYPES.COLLAPSIBLE,
          displayOrder: 1,
          fields: educationFields,
        },
      ],
    },
    {
      documentId,
      title: 'Links',
      type: INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS,
      items: [],
    },
    {
      documentId,
      title: 'Skills',
      type: INTERNAL_SECTION_TYPES.SKILLS,
      metadata: getDefaultSkillsMetadata(),
      items: [
        {
          containerType: CONTAINER_TYPES.COLLAPSIBLE,
          displayOrder: 1,
          fields: skillsSectionFields,
        },
      ],
    },
  ].map((item, index) => ({
    ...item,
    defaultTitle: item.title,
    displayOrder: index + 1,
  }));
};

export const isSelectField = (obj: { type: string }): obj is SelectField => {
  return obj?.type === FIELD_TYPES.SELECT;
};

type ItemTemplateType = Omit<DEX_Item, 'id' | 'sectionId'> & {
  fields: FieldInsertTemplate[];
};

export const getItemInsertTemplate = (sectionType: TemplatedSectionType) => {
  const templateMap: Record<TemplatedSectionType, ItemTemplateType> = {
    [INTERNAL_SECTION_TYPES.WORK_EXPERIENCE]: {
      containerType: CONTAINER_TYPES.COLLAPSIBLE,
      displayOrder: 1,
      fields: employmentHistoryFields,
    },
    [INTERNAL_SECTION_TYPES.EDUCATION]: {
      containerType: CONTAINER_TYPES.COLLAPSIBLE,
      displayOrder: 1,
      fields: educationFields,
    },
    [INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS]: {
      containerType: CONTAINER_TYPES.COLLAPSIBLE,
      displayOrder: 1,
      fields: websitesAndLinkFields,
    },
    [INTERNAL_SECTION_TYPES.SKILLS]: {
      containerType: CONTAINER_TYPES.COLLAPSIBLE,
      displayOrder: 1,
      fields: skillsSectionFields,
    },
    [INTERNAL_SECTION_TYPES.LANGUAGES]: {
      containerType: CONTAINER_TYPES.COLLAPSIBLE,
      displayOrder: 1,
      fields: languagesSectionFields,
    },
    [INTERNAL_SECTION_TYPES.HOBBIES]: {
      containerType: CONTAINER_TYPES.STATIC,
      displayOrder: 1,
      fields: hobbiesSectionFields,
    },
    [INTERNAL_SECTION_TYPES.COURSES]: {
      containerType: CONTAINER_TYPES.COLLAPSIBLE,
      displayOrder: 1,
      fields: coursesSectionFields,
    },
    [INTERNAL_SECTION_TYPES.INTERNSHIPS]: {
      containerType: CONTAINER_TYPES.COLLAPSIBLE,
      displayOrder: 1,
      fields: employmentHistoryFields,
    },
    [INTERNAL_SECTION_TYPES.CUSTOM]: {
      containerType: CONTAINER_TYPES.COLLAPSIBLE,
      displayOrder: 1,
      fields: customSectionFields,
    },
    [INTERNAL_SECTION_TYPES.REFERENCES]: {
      containerType: CONTAINER_TYPES.COLLAPSIBLE,
      displayOrder: 1,
      fields: referencesSectionFields,
    },
  };

  return templateMap[sectionType];
};

export const prepareSectionsInsertData = (
  sectionTemplates: SectionWithFields[],
  documentId: DEX_Document['id']
): InsertType<DEX_Section, 'id'>[] =>
  sectionTemplates.map((section) => ({
    defaultTitle: section.defaultTitle,
    title: section.title,
    displayOrder: section.displayOrder,
    documentId,
    metadata: section?.metadata || '',
    type: section.type,
  }));
