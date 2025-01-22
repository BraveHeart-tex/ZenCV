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
  };

  return templateMap[sectionType];
};

export const getCookieValue = (cookieName: string) => {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find((row) => row.startsWith(`${cookieName}=`));
  return cookie ? cookie.split('=')[1] : null;
};
