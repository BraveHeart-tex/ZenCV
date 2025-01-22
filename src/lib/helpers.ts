// TODO: Implement FIELD_NAMES constant for all sections
// hard-coded strings should be removed for preventing typos
import {
  INTERNAL_SECTION_TYPES,
  SectionType,
  SELECT_TYPES,
} from '@/lib/constants';
import {
  CONTAINER_TYPES,
  DEX_Field,
  FIELD_TYPES,
  DEX_Item,
  DEX_Section,
  SelectField,
} from '@/lib/schema';
import { documentBuilderStore } from './documentBuilderStore';

interface ItemWithFields extends Omit<DEX_Item, 'id' | 'sectionId'> {
  fields: Omit<DEX_Field, 'id' | 'itemId'>[];
}

interface SectionWithFields extends Omit<DEX_Section, 'id'> {
  items: ItemWithFields[];
}

const employmentHistoryFields = [
  {
    name: 'Job Title',
    type: FIELD_TYPES.STRING,
  },
  {
    name: 'Employer',
    type: FIELD_TYPES.STRING,
  },
  {
    name: 'Start Date',
    type: FIELD_TYPES.DATE_MONTH,
  },
  {
    name: 'End Date',
    type: FIELD_TYPES.DATE_MONTH,
  },
  {
    name: 'City',
    type: FIELD_TYPES.STRING,
  },
  {
    name: 'Description',
    type: FIELD_TYPES.RICH_TEXT,
  },
].map((item) => ({ ...item, value: '' }));

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
          fields: [
            {
              name: 'Wanted Job Title',
              type: FIELD_TYPES.STRING,
            },
            {
              name: 'First Name',
              type: FIELD_TYPES.STRING,
            },
            {
              name: 'Last Name',
              type: FIELD_TYPES.STRING,
            },
            {
              name: 'Email',
              type: FIELD_TYPES.STRING,
            },
            {
              name: 'Phone',
              type: FIELD_TYPES.STRING,
            },
            {
              name: 'Country',
              type: FIELD_TYPES.STRING,
            },
            {
              name: 'City',
              type: FIELD_TYPES.STRING,
            },
            {
              name: 'Address',
              type: FIELD_TYPES.STRING,
            },
            {
              name: 'Postal Code',
              type: FIELD_TYPES.STRING,
            },
            {
              name: 'Driving License',
              type: FIELD_TYPES.STRING,
            },
            {
              name: 'Place of Birth',
              type: FIELD_TYPES.STRING,
            },
            {
              name: 'Date of Birth',
              type: FIELD_TYPES.STRING,
            },
          ].map((item) => ({ ...item, value: '' })),
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
          fields: [{ name: '', type: FIELD_TYPES.RICH_TEXT, value: '' }],
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
          fields: [
            {
              name: 'Job Title',
              type: FIELD_TYPES.STRING,
            },
            {
              name: 'Employer',
              type: FIELD_TYPES.STRING,
            },
            {
              name: 'Start Date',
              type: FIELD_TYPES.DATE_MONTH,
            },
            {
              name: 'End Date',
              type: FIELD_TYPES.DATE_MONTH,
            },
            {
              name: 'City',
              type: FIELD_TYPES.STRING,
            },
            {
              name: 'Description',
              type: FIELD_TYPES.RICH_TEXT,
            },
          ].map((item) => ({ ...item, value: '' })),
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
          fields: [
            {
              name: 'School',
              type: FIELD_TYPES.STRING,
            },
            {
              name: 'Degree',
              type: FIELD_TYPES.STRING,
            },
            {
              name: 'Start Date',
              type: FIELD_TYPES.DATE_MONTH,
            },
            {
              name: 'End Date',
              type: FIELD_TYPES.DATE_MONTH,
            },
            {
              name: 'City',
              type: FIELD_TYPES.STRING,
            },
            {
              name: 'Description',
              type: FIELD_TYPES.RICH_TEXT,
            },
          ].map((item) => ({
            ...item,
            value: '',
          })),
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
          fields: [
            {
              name: 'Label',
              type: FIELD_TYPES.STRING,
              value: '',
            },
            {
              name: 'Link',
              type: FIELD_TYPES.STRING,
              value: '',
            },
          ],
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
          fields: [
            {
              name: 'Skill',
              type: FIELD_TYPES.STRING,
              value: '',
            },
            {
              name: 'Experience Level',
              type: FIELD_TYPES.SELECT,
              selectType: SELECT_TYPES.BASIC,
              options: ['Beginner', 'Competent', 'Proficient', 'Expert'],
              value: '',
            },
          ],
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
  fields: Omit<DEX_Field, 'id' | 'itemId'>[];
};

export const getItemInsertTemplate = (sectionType: SectionType) => {
  // @ts-expect-error Other section types will be implemented as well
  const templateMap: Record<SectionType, ItemTemplateType> = {
    [INTERNAL_SECTION_TYPES.EMPLOYMENT_HISTORY]: {
      containerType: CONTAINER_TYPES.COLLAPSIBLE,
      displayOrder: 1,
      fields: employmentHistoryFields,
    },
    [INTERNAL_SECTION_TYPES.EDUCATION]: {
      containerType: CONTAINER_TYPES.COLLAPSIBLE,
      displayOrder: 1,
      fields: [
        {
          name: 'School',
          type: FIELD_TYPES.STRING,
        },
        {
          name: 'Degree',
          type: FIELD_TYPES.STRING,
        },
        {
          name: 'Start Date',
          type: FIELD_TYPES.DATE_MONTH,
        },
        {
          name: 'End Date',
          type: FIELD_TYPES.DATE_MONTH,
        },
        {
          name: 'City',
          type: FIELD_TYPES.STRING,
        },
        {
          name: 'Description',
          type: FIELD_TYPES.RICH_TEXT,
        },
      ].map((item) => ({
        ...item,
        value: '',
      })),
    },
    [INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS]: {
      containerType: CONTAINER_TYPES.COLLAPSIBLE,
      displayOrder: 1,
      fields: [
        {
          name: 'Label',
          type: FIELD_TYPES.STRING,
          value: '',
        },
        {
          name: 'Link',
          type: FIELD_TYPES.STRING,
          value: '',
        },
      ],
    },
    [INTERNAL_SECTION_TYPES.SKILLS]: {
      containerType: CONTAINER_TYPES.COLLAPSIBLE,
      displayOrder: 1,
      fields: [
        {
          name: 'Skill',
          type: FIELD_TYPES.STRING,
          value: '',
        },
        {
          name: 'Experience Level',
          type: FIELD_TYPES.SELECT,
          selectType: SELECT_TYPES.BASIC,
          options: ['Beginner', 'Competent', 'Proficient', 'Expert'],
          value: '',
        } as DEX_Field,
      ],
    },
    [INTERNAL_SECTION_TYPES.LANGUAGES]: {
      containerType: CONTAINER_TYPES.COLLAPSIBLE,
      displayOrder: 1,
      fields: [
        {
          name: 'Language',
          type: FIELD_TYPES.STRING,
          value: '',
        },
        {
          name: 'Level',
          type: FIELD_TYPES.SELECT,
          selectType: SELECT_TYPES.BASIC,
          options: [
            'Native Speaker',
            'Highly Proficient',
            'Very good command',
            'Good working knowledge',
            'Working knowledge',
            'C2',
            'C1',
            'B2',
            'B1',
            'A2',
            'A1',
          ],
          value: '',
        } as DEX_Field,
      ],
    },
    [INTERNAL_SECTION_TYPES.HOBBIES]: {
      containerType: CONTAINER_TYPES.STATIC,
      displayOrder: 1,
      fields: [
        {
          name: 'What do you like?',
          type: FIELD_TYPES.TEXTAREA,
          value: '',
        },
      ],
    },
    [INTERNAL_SECTION_TYPES.COURSES]: {
      containerType: CONTAINER_TYPES.COLLAPSIBLE,
      displayOrder: 1,
      fields: [
        {
          name: 'Course',
          type: FIELD_TYPES.STRING,
          value: '',
        },
        {
          name: 'Institution',
          type: FIELD_TYPES.STRING,
          value: '',
        },
        {
          name: 'Start Date',
          type: FIELD_TYPES.DATE_MONTH,
          value: '',
        },
        {
          name: 'End Date',
          type: FIELD_TYPES.DATE_MONTH,
          value: '',
        },
      ],
    },
    [INTERNAL_SECTION_TYPES.INTERNSHIPS]: {
      containerType: CONTAINER_TYPES.COLLAPSIBLE,
      displayOrder: 1,
      fields: employmentHistoryFields,
    },
    [INTERNAL_SECTION_TYPES.CUSTOM]: {
      containerType: CONTAINER_TYPES.COLLAPSIBLE,
      displayOrder: 1,
      fields: [
        {
          name: 'Activity name, job, book title etc.',
          type: FIELD_TYPES.STRING,
        },
        {
          name: 'City',
          type: FIELD_TYPES.STRING,
        },
        {
          name: 'Start Date',
          type: FIELD_TYPES.DATE_MONTH,
        },
        {
          name: 'End Date',
          type: FIELD_TYPES.DATE_MONTH,
        },
        {
          name: 'Description',
          type: FIELD_TYPES.RICH_TEXT,
        },
      ].map((field) => ({
        ...field,
        value: '',
      })),
    },
    [INTERNAL_SECTION_TYPES.REFERENCES]: {
      containerType: CONTAINER_TYPES.COLLAPSIBLE,
      displayOrder: 1,
      fields: [
        {
          name: "Referent's Full Name",
          type: FIELD_TYPES.STRING,
        },
        {
          name: 'Company',
          type: FIELD_TYPES.STRING,
        },
        {
          name: 'Phone',
          type: FIELD_TYPES.STRING,
        },
        {
          name: "Referent's Email",
          type: FIELD_TYPES.STRING,
        },
      ].map((field) => ({
        ...field,
        value: '',
      })),
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
