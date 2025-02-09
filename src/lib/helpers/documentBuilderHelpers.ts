import { UNCHECKED_METADATA_VALUE } from '@/lib/constants';
import {
  CONTAINER_TYPES,
  DEX_Document,
  type DEX_Field,
  type DEX_Item,
  FIELD_TYPES,
  SectionWithFields,
  type SelectField,
} from '@/lib/client-db/clientDbSchema';
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
} from '@/lib/misc/fieldTemplates';
import {
  FIELD_NAMES,
  highlightedElementClassName,
  INTERNAL_SECTION_TYPES,
  RICH_TEXT_PLACEHOLDERS_BY_TYPE,
  SECTION_METADATA_KEYS,
  TOGGLE_ITEM_WAIT_MS,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import {
  CollapsibleSectionType,
  FieldInsertTemplate,
  FieldValuesForKey,
  ResumeTemplate,
  TemplatedSectionType,
} from '@/lib/types/documentBuilder.types';
import { getLuminance, hexToRgb } from '@/lib/utils/colorUtils';
import { getItemContainerId } from '@/lib/utils/stringUtils';
import { builderRootStore } from '../stores/documentBuilder/builderRootStore';
import { showErrorToast, showSuccessToast } from '@/components/ui/sonner';
import DocumentService from '../client-db/documentService';
import {
  getTemplateByStyle,
  PrefilledResumeStyle,
} from '../templates/prefilledTemplates';

export const getInitialDocumentInsertBoilerplate = (
  documentId: DEX_Document['id'],
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
          fields: [
            {
              name: FIELD_NAMES.SUMMARY.SUMMARY,
              type: FIELD_TYPES.RICH_TEXT,
              value: '',
              placeholder:
                RICH_TEXT_PLACEHOLDERS_BY_TYPE[INTERNAL_SECTION_TYPES.SUMMARY],
            },
          ],
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
      metadata: JSON.stringify([
        {
          label: 'Show experience level',
          key: SECTION_METADATA_KEYS.SKILLS.SHOW_EXPERIENCE_LEVEL,
          value: UNCHECKED_METADATA_VALUE,
        },
        {
          label: 'Separate skills with a comma',
          key: SECTION_METADATA_KEYS.SKILLS.IS_COMMA_SEPARATED,
          value: UNCHECKED_METADATA_VALUE,
        },
      ]),
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
      fields: [
        {
          name: FIELD_NAMES.HOBBIES.WHAT_DO_YOU_LIKE,
          type: FIELD_TYPES.TEXTAREA,
          value: '',
          placeholder:
            RICH_TEXT_PLACEHOLDERS_BY_TYPE[INTERNAL_SECTION_TYPES.HOBBIES],
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
  const item = builderRootStore.itemStore.getItemById(itemId);
  if (!item) {
    return {
      description: '',
      title: '',
    };
  }

  const sectionType = builderRootStore.sectionStore.getSectionById(
    item.sectionId,
  )?.type as CollapsibleSectionType;
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
    [INTERNAL_SECTION_TYPES.WORK_EXPERIENCE]: getEmploymentHistoryTitle(itemId),
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
  const itemFields = builderRootStore.fieldStore.getFieldsByItemId(itemId);

  const getEmploymentHistoryFieldValue = (
    fieldName: FieldValuesForKey<'WORK_EXPERIENCE'>,
  ) => {
    return itemFields.find((field) => field.name === fieldName)?.value || '';
  };

  const jobTitle = getEmploymentHistoryFieldValue(
    FIELD_NAMES.WORK_EXPERIENCE.JOB_TITLE,
  );
  const startDate = getEmploymentHistoryFieldValue(
    FIELD_NAMES.WORK_EXPERIENCE.START_DATE,
  );
  const endDate = getEmploymentHistoryFieldValue(
    FIELD_NAMES.WORK_EXPERIENCE.END_DATE,
  );
  const employer = getEmploymentHistoryFieldValue(
    FIELD_NAMES.WORK_EXPERIENCE.EMPLOYER,
  );

  let triggerTitle = jobTitle
    ? `${employer ? `${jobTitle} at ${employer}` : jobTitle}`
    : employer;
  let description = `${startDate} ${startDate && endDate ? '-' : ''} ${endDate}`;
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
  const itemFields = builderRootStore.fieldStore.getFieldsByItemId(itemId);

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
  let description = `${startDate} ${startDate && endDate ? '-' : ''} ${endDate}`;
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
  const itemFields = builderRootStore.fieldStore.getFieldsByItemId(itemId);

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
  const itemFields = builderRootStore.fieldStore.getFieldsByItemId(itemId);

  const getSkillFieldValue = (fieldName: FieldValuesForKey<'SKILLS'>) => {
    return itemFields.find((field) => field.name === fieldName)?.value || '';
  };

  const skillValue = getSkillFieldValue(FIELD_NAMES.SKILLS.SKILL);
  const levelValue = getSkillFieldValue(FIELD_NAMES.SKILLS.EXPERIENCE_LEVEL);

  const item = builderRootStore.itemStore.getItemById(itemId);
  const metadata = builderRootStore.sectionStore.sections.find(
    (section) => section.id === item?.sectionId,
  )?.metadata;
  const shouldShowSkillLevel =
    metadata?.find(
      (metadata) =>
        metadata.key === SECTION_METADATA_KEYS.SKILLS.SHOW_EXPERIENCE_LEVEL,
    )?.value === '1';

  const triggerTitle = skillValue || '(Untitled)';
  const description = shouldShowSkillLevel ? levelValue : '';

  return {
    title: triggerTitle,
    description,
  };
};

const getLanguagesSectionTitle = (itemId: DEX_Item['id']) => {
  const itemFields = builderRootStore.fieldStore.getFieldsByItemId(itemId);

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
  const itemFields = builderRootStore.fieldStore.getFieldsByItemId(itemId);

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
  const itemFields = builderRootStore.fieldStore.getFieldsByItemId(itemId);

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
  const itemFields = builderRootStore.fieldStore.getFieldsByItemId(itemId);

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

export const getTextColorForBackground = (bgColor: string) => {
  const rgb = hexToRgb(bgColor);
  const luminance = getLuminance(rgb);

  // If the luminance is low (dark background), use light text (white), else use dark text (black)
  return luminance < 0.5 ? '#ffffff' : '#000000';
};

export const getScoreColor = (
  score: number,
): {
  color: string;
  backgroundColor: string;
} => {
  let bgColor: string;

  if (score <= 24)
    bgColor = '#d32f2f'; // Red
  else if (score <= 49)
    bgColor = '#f57c00'; // Orange
  else if (score <= 74)
    bgColor = '#fbc02d'; // Yellow
  else bgColor = '#388e3c'; // Green

  const textColor = getTextColorForBackground(bgColor);
  return { backgroundColor: bgColor, color: textColor };
};

export const scrollItemIntoView = (
  itemId: DEX_Item['id'],
  onItemInView?: () => void,
): void => {
  const element = builderRootStore.UIStore.itemRefs.get(
    getItemContainerId(itemId),
  );
  if (!element) return;

  if (builderRootStore.UIStore.collapsedItemId !== itemId) {
    builderRootStore.UIStore.toggleItem(itemId);
  }

  const scrollAndHighlight = () => {
    element.scrollIntoView({ behavior: 'instant', block: 'center' });

    const checkScrollCompletion = () => {
      const rect = element.getBoundingClientRect();
      const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;

      if (isInView) {
        onItemInView?.();
        element.classList.add(highlightedElementClassName);
        setTimeout(() => {
          element.classList.remove(highlightedElementClassName);
        }, 500);
      } else {
        requestAnimationFrame(checkScrollCompletion);
      }
    };

    requestAnimationFrame(checkScrollCompletion);
  };

  setTimeout(scrollAndHighlight, TOGGLE_ITEM_WAIT_MS);
};

interface CreateAndNavigateToDocumentParams {
  title: string;
  templateType: ResumeTemplate;
  onSuccess?: (documentId: DEX_Document['id']) => void;
  onError?: () => void;
  selectedPrefillStyle?: PrefilledResumeStyle | null;
}

export const createAndNavigateToDocument = async ({
  title,
  templateType,
  onSuccess,
  onError,
  selectedPrefillStyle = null,
}: CreateAndNavigateToDocumentParams) => {
  try {
    const documentId = await DocumentService.createDocument({
      title,
      templateType,
      ...(selectedPrefillStyle ? getTemplateByStyle(selectedPrefillStyle) : {}),
    });

    if (!documentId) {
      showErrorToast(
        'An error occurred while creating the document. Please try again.',
      );
      if (onError) onError();
      return;
    }

    await builderRootStore.documentStore.initializeStore(documentId);
    showSuccessToast('Document created successfully.');

    if (onSuccess) onSuccess(documentId);
  } catch (error) {
    showErrorToast('An error occurred while creating the document.');
    console.error(error);
    if (onError) onError();
  }
};

export const downloadPDF = ({
  file,
  title,
}: {
  file: string;
  title: string;
}) => {
  const fileName = `${title}.pdf`;
  if (!file) {
    showErrorToast("File doesn't exist. Please try again.");
    return;
  }

  const link = document.createElement('a');
  link.href = file;
  link.download = fileName;
  link.click();
};
