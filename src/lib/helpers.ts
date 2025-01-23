import { FIELD_NAMES, INTERNAL_SECTION_TYPES } from '@/lib/constants';
import {
  CONTAINER_TYPES,
  DEX_Field,
  FIELD_TYPES,
  DEX_Item,
  DEX_Section,
  SelectField,
} from '@/lib/schema';
import { documentBuilderStore } from './documentBuilderStore';
import {
  FieldInsertTemplate,
  SectionType,
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
  itemId: number,
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

  const sectionType = documentBuilderStore.getSectionById(item.sectionId)?.type;
  if (!sectionType) {
    return {
      description: '',
      title: '',
    };
  }

  // @ts-expect-error TODO: implement the remaining section types
  const sectionTypeToTitle: Record<
    SectionType,
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

const getEmploymentHistoryTitle = (itemId: number) => {
  const itemFields = documentBuilderStore.getFieldsByItemId(itemId);

  const jobTitleField = itemFields.find((field) => field.name === 'Job Title');
  const startDateField = itemFields.find(
    (field) => field.name === 'Start Date',
  );
  const endDateField = itemFields.find((field) => field.name === 'End Date');
  const employerField = itemFields.find((field) => field.name === 'Employer');

  const jobTitle = jobTitleField?.value || '';
  const startDate = startDateField?.value || '';
  const endDate = endDateField?.value || '';
  const employer = employerField?.value || '';

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

const getEducationSectionTitle = (itemId: number) => {
  const itemFields = documentBuilderStore.getFieldsByItemId(itemId);

  const schoolField = itemFields.find((field) => field.name === 'School');
  const degreeField = itemFields.find((field) => field.name === 'Degree');
  const startDateField = itemFields.find(
    (field) => field.name === 'Start Date',
  );
  const endDateField = itemFields.find((field) => field.name === 'End Date');

  const schoolTitle = schoolField?.value || '';
  const startDate = startDateField?.value || '';
  const endDate = endDateField?.value || '';
  const degree = degreeField?.value || '';

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

const getWebsitesSocialLinksTitle = (itemId: number) => {
  const itemFields = documentBuilderStore.getFieldsByItemId(itemId);

  const labelField = itemFields.find((field) => field.name === 'Label');
  const linkField = itemFields.find((field) => field.name === 'Link');

  const labelValue = labelField?.value || '';
  const linkValue = linkField?.value || '';

  const triggerTitle = labelValue || '(Untitled)';
  const description = linkValue || '';

  return {
    title: triggerTitle,
    description,
  };
};

const getSkillsSectionTitle = (itemId: number) => {
  const itemFields = documentBuilderStore.getFieldsByItemId(itemId);
  const skillField = itemFields.find((field) => field.name === 'Skill');
  const levelField = itemFields.find(
    (field) => field.name === 'Experience Level',
  );

  const skillValue = skillField?.value;
  const levelValue = levelField?.value;

  const triggerTitle = skillValue || '(Untitled)';
  const description = levelValue || '';

  return {
    title: triggerTitle,
    description,
  };
};

const getLanguagesSectionTitle = (itemId: number) => {
  const itemFields = documentBuilderStore.getFieldsByItemId(itemId);

  const languageField = itemFields.find((field) => field.name === 'Language');
  const levelField = itemFields.find((field) => field.name === 'Level');

  const language = languageField?.value;
  const level = levelField?.value;

  return {
    title: language || '(Untitled)',
    description: level || '',
  };
};

const getCoursesSectionTitle = (itemId: number) => {
  const itemFields = documentBuilderStore.getFieldsByItemId(itemId);
  const courseField = itemFields.find((field) => field.name === 'Course');
  const institutionField = itemFields.find(
    (field) => field.name === 'Institution',
  );
  const startDateField = itemFields.find(
    (field) => field.name === 'Start Date',
  );
  const endDateField = itemFields.find((field) => field.name === 'End Date');

  const course = courseField?.value;
  const institution = institutionField?.value;
  const startDate = startDateField?.value;
  const endDate = endDateField?.value;

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

const getCustomSectionTitle = (itemId: number) => {
  const itemFields = documentBuilderStore.getFieldsByItemId(itemId);

  const nameField = itemFields.find(
    (field) => field.name === 'Activity name, job, book title etc.',
  );
  const cityField = itemFields.find((field) => field.name === 'City');
  const startDateField = itemFields.find(
    (field) => field.name === 'Start Date',
  );
  const endDateField = itemFields.find((field) => field.name === 'End Date');

  const name = nameField?.value;
  const city = cityField?.value;
  const startDate = startDateField?.value;
  const endDate = endDateField?.value;

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

const getReferencesSectionTitle = (itemId: number) => {
  const itemFields = documentBuilderStore.getFieldsByItemId(itemId);

  const referentFullNameField = itemFields.find(
    (field) => field.name === "Referent's Full Name",
  );
  const companyField = itemFields.find((field) => field.name === 'Company');

  const referentFullName = referentFullNameField?.value || '(Not Specified)';
  const company = companyField?.value;

  return {
    title: referentFullName,
    description: company || '',
  };
};
