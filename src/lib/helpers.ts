import { FIELD_NAMES, INTERNAL_SECTION_TYPES } from '@/lib/constants';
import {
  CONTAINER_TYPES,
  FIELD_TYPES,
  type DEX_Field,
  type DEX_Item,
  type DEX_Section,
  type SelectField,
} from '@/lib/schema';
import { documentBuilderStore } from './documentBuilderStore';
import {
  CollapsibleSectionType,
  FieldInsertTemplate,
  FieldValuesForKey,
  TemplatedSectionType,
} from '@/lib/types';
import {
  coursesSectionFields,
  customSectionFields,
  educationFields,
  employmentHistoryFields,
  languagesSectionFields,
  personalDetailsSectionFields,
  referencesSectionFields,
  skillsSectionFields,
  websitesAndLinkFields,
} from '@/lib/fieldTemplates';

interface ItemWithFields extends Omit<DEX_Item, 'id' | 'sectionId'> {
  fields: FieldInsertTemplate[];
}

interface SectionWithFields extends Omit<DEX_Section, 'id'> {
  items: ItemWithFields[];
}

export const getInitialDocumentInsertBoilerplate = (
  documentId: number,
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
      title: 'Professional Summary',
      type: INTERNAL_SECTION_TYPES.PROFESSIONAL_SUMMARY,
      items: [
        {
          containerType: CONTAINER_TYPES.STATIC,
          displayOrder: 1,
          fields: [
            {
              name: FIELD_NAMES.PROFESSIONAL_SUMMARY.PROFESSIONAL_SUMMARY,
              type: FIELD_TYPES.RICH_TEXT,
              value: '',
            },
          ],
        },
      ],
    },
    {
      documentId,
      title: 'Employment History',
      type: INTERNAL_SECTION_TYPES.EMPLOYMENT_HISTORY,
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
      title: 'Websites & Social Links',
      type: INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS,
      items: [
        {
          containerType: CONTAINER_TYPES.COLLAPSIBLE,
          displayOrder: 1,
          fields: websitesAndLinkFields,
        },
      ],
    },
    {
      documentId,
      title: 'Skills',
      type: INTERNAL_SECTION_TYPES.SKILLS,
      metadata: JSON.stringify({
        showExperienceLevel: true,
      }),
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

export const getFieldHtmlId = (field: DEX_Field) => {
  return `${field.itemId}-${field.name}`;
};

export type ItemTemplateType = Omit<DEX_Item, 'id' | 'sectionId'> & {
  fields: FieldInsertTemplate[];
};

export const getItemInsertTemplate = (sectionType: TemplatedSectionType) => {
  const templateMap: Record<TemplatedSectionType, ItemTemplateType> = {
    [INTERNAL_SECTION_TYPES.EMPLOYMENT_HISTORY]: {
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
      fields: [
        {
          name: FIELD_NAMES.HOBBIES.WHAT_DO_YOU_LIKE,
          type: FIELD_TYPES.TEXTAREA,
          value: '',
        },
      ],
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

export const getCookieValue = (cookieName: string) => {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find((row) => row.startsWith(`${cookieName}=`));
  return cookie ? cookie.split('=')[1] : null;
};

export const getTriggerContent = (
  itemId: DEX_Item['id'],
): {
  title: string;
  description: string;
} => {
  const item = documentBuilderStore.getItemById(itemId);
  if (!item) {
    return {
      description: '',
      title: '',
    };
  }

  const sectionType = documentBuilderStore.getSectionById(item.sectionId)
    ?.type as CollapsibleSectionType;
  if (!sectionType) {
    return {
      description: '',
      title: '',
    };
  }

  const sectionTypeToTitle: Record<
    CollapsibleSectionType,
    { title: string; description: string }
  > = {
    [INTERNAL_SECTION_TYPES.EMPLOYMENT_HISTORY]:
      getEmploymentHistoryTitle(itemId),
    [INTERNAL_SECTION_TYPES.EDUCATION]: getEducationSectionTitle(itemId),
    [INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS]:
      getWebsitesSocialLinksTitle(itemId),
    [INTERNAL_SECTION_TYPES.SKILLS]: getSkillsSectionTitle(itemId),
    [INTERNAL_SECTION_TYPES.COURSES]: getCoursesSectionTitle(itemId),
    [INTERNAL_SECTION_TYPES.LANGUAGES]: getLanguagesSectionTitle(itemId),
    [INTERNAL_SECTION_TYPES.INTERNSHIPS]: getEmploymentHistoryTitle(itemId),
    [INTERNAL_SECTION_TYPES.CUSTOM]: getCustomSectionTitle(itemId),
    [INTERNAL_SECTION_TYPES.REFERENCES]: getReferencesSectionTitle(itemId),
  };

  const result = sectionTypeToTitle[sectionType];

  return (
    result || {
      description: '',
      title: '',
    }
  );
};

const getEmploymentHistoryTitle = (itemId: DEX_Item['id']) => {
  const itemFields = documentBuilderStore.getFieldsByItemId(itemId);

  const getEmploymentHistoryFieldValue = (
    fieldName: FieldValuesForKey<'EMPLOYMENT_HISTORY'>,
  ) => {
    return itemFields.find((field) => field.name === fieldName)?.value || '';
  };

  const jobTitle = getEmploymentHistoryFieldValue(
    FIELD_NAMES.EMPLOYMENT_HISTORY.JOB_TITLE,
  );
  const startDate = getEmploymentHistoryFieldValue(
    FIELD_NAMES.EMPLOYMENT_HISTORY.START_DATE,
  );
  const endDate = getEmploymentHistoryFieldValue(
    FIELD_NAMES.EMPLOYMENT_HISTORY.END_DATE,
  );
  const employer = getEmploymentHistoryFieldValue(
    FIELD_NAMES.EMPLOYMENT_HISTORY.EMPLOYER,
  );

  let triggerTitle = jobTitle
    ? `${employer ? `${jobTitle} at ${employer}` : jobTitle}`
    : employer;
  let description = `${startDate} - ${endDate}`;
  if (!jobTitle && !employer) {
    triggerTitle = '(Untitled)';
    description = '';
  }

  return {
    title: triggerTitle,
    description,
  };
};

const getEducationSectionTitle = (itemId: DEX_Item['id']) => {
  const itemFields = documentBuilderStore.getFieldsByItemId(itemId);

  const getEducationFieldValue = (
    fieldName: FieldValuesForKey<'EDUCATION'>,
  ) => {
    return itemFields.find((field) => field.name === fieldName)?.value || '';
  };

  const schoolTitle = getEducationFieldValue(FIELD_NAMES.EDUCATION.SCHOOL);
  const degree = getEducationFieldValue(FIELD_NAMES.EDUCATION.DEGREE);
  const startDate = getEducationFieldValue(FIELD_NAMES.EDUCATION.START_DATE);
  const endDate = getEducationFieldValue(FIELD_NAMES.EDUCATION.END_DATE);

  let triggerTitle =
    degree && schoolTitle
      ? `${degree} at ${schoolTitle}`
      : degree
        ? degree
        : schoolTitle;
  let description = `${startDate} - ${endDate}`;
  if (!schoolTitle && !degree) {
    triggerTitle = '(Untitled)';
    description = '';
  }

  return {
    title: triggerTitle,
    description,
  };
};

const getWebsitesSocialLinksTitle = (itemId: DEX_Item['id']) => {
  const itemFields = documentBuilderStore.getFieldsByItemId(itemId);

  const getWebsiteFieldValue = (
    fieldName: FieldValuesForKey<'WEBSITES_SOCIAL_LINKS'>,
  ) => {
    return itemFields.find((field) => field.name === fieldName)?.value || '';
  };

  const labelValue = getWebsiteFieldValue(
    FIELD_NAMES.WEBSITES_SOCIAL_LINKS.LABEL,
  );
  const linkValue = getWebsiteFieldValue(
    FIELD_NAMES.WEBSITES_SOCIAL_LINKS.LINK,
  );

  const triggerTitle = labelValue || '(Untitled)';
  const description = linkValue || '';

  return {
    title: triggerTitle,
    description,
  };
};

const getSkillsSectionTitle = (itemId: DEX_Item['id']) => {
  const itemFields = documentBuilderStore.getFieldsByItemId(itemId);

  const getSkillFieldValue = (fieldName: FieldValuesForKey<'SKILLS'>) => {
    return itemFields.find((field) => field.name === fieldName)?.value || '';
  };

  const skillValue = getSkillFieldValue(FIELD_NAMES.SKILLS.SKILL);
  const levelValue = getSkillFieldValue(FIELD_NAMES.SKILLS.EXPERIENCE_LEVEL);

  const triggerTitle = skillValue || '(Untitled)';
  const description = levelValue || '';

  return {
    title: triggerTitle,
    description,
  };
};

const getLanguagesSectionTitle = (itemId: DEX_Item['id']) => {
  const itemFields = documentBuilderStore.getFieldsByItemId(itemId);

  const getLanguageFieldValue = (fieldName: FieldValuesForKey<'LANGUAGES'>) => {
    return itemFields.find((field) => field.name === fieldName)?.value || '';
  };

  const language = getLanguageFieldValue(FIELD_NAMES.LANGUAGES.LANGUAGE);
  const level = getLanguageFieldValue(FIELD_NAMES.LANGUAGES.LEVEL);

  return {
    title: language || '(Untitled)',
    description: level || '',
  };
};

const getCoursesSectionTitle = (itemId: DEX_Item['id']) => {
  const itemFields = documentBuilderStore.getFieldsByItemId(itemId);

  const getCourseFieldValue = (fieldName: FieldValuesForKey<'COURSES'>) => {
    return itemFields.find((field) => field.name === fieldName)?.value || '';
  };

  const course = getCourseFieldValue(FIELD_NAMES.COURSES.COURSE);
  const institution = getCourseFieldValue(FIELD_NAMES.COURSES.INSTITUTION);
  const startDate = getCourseFieldValue(FIELD_NAMES.COURSES.START_DATE);
  const endDate = getCourseFieldValue(FIELD_NAMES.COURSES.END_DATE);

  const triggerTitle = course
    ? institution
      ? `${course} at ${institution}`
      : course
    : institution || '(Not Specified)';
  const triggerDescription = startDate
    ? endDate
      ? `${startDate} - ${endDate}`
      : startDate
    : endDate
      ? endDate
      : '';

  return {
    title: triggerTitle,
    description: triggerDescription,
  };
};

const getCustomSectionTitle = (itemId: DEX_Item['id']) => {
  const itemFields = documentBuilderStore.getFieldsByItemId(itemId);

  const getCustomFieldValue = (fieldName: FieldValuesForKey<'CUSTOM'>) => {
    return itemFields.find((field) => field.name === fieldName)?.value || '';
  };

  const name = getCustomFieldValue(FIELD_NAMES.CUSTOM.ACTIVITY_NAME);
  const city = getCustomFieldValue(FIELD_NAMES.CUSTOM.CITY);
  const startDate = getCustomFieldValue(FIELD_NAMES.CUSTOM.START_DATE);
  const endDate = getCustomFieldValue(FIELD_NAMES.CUSTOM.END_DATE);

  const triggerTitle = name
    ? city
      ? `${name}, ${city}`
      : name
    : '(Not Specified)';
  const triggerDescription = startDate
    ? endDate
      ? `${startDate} - ${endDate}`
      : startDate
    : endDate
      ? endDate
      : '';

  return {
    title: triggerTitle,
    description: triggerDescription,
  };
};

const getReferencesSectionTitle = (itemId: DEX_Item['id']) => {
  const itemFields = documentBuilderStore.getFieldsByItemId(itemId);

  const getReferenceFieldValue = (
    fieldName: FieldValuesForKey<'REFERENCES'>,
  ) => {
    return itemFields.find((field) => field.name === fieldName)?.value || '';
  };

  const referentFullName =
    getReferenceFieldValue(FIELD_NAMES.REFERENCES.REFERENT_FULL_NAME) ||
    '(Not Specified)';
  const company = getReferenceFieldValue(FIELD_NAMES.REFERENCES.COMPANY);

  return {
    title: referentFullName,
    description: company || '',
  };
};
