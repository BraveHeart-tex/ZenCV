import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { FIELD_NAMES, INTERNAL_SECTION_TYPES } from '@/lib/constants';
import { FieldName, PdfTemplateData, SectionType } from '@/lib/types';

const getFieldValueByName = (fieldName: FieldName): string => {
  return (
    documentBuilderStore.fields.find((field) => field.name === fieldName)
      ?.value || ''
  );
};

const getSectionNameByType = (sectionType: SectionType): string => {
  return (
    documentBuilderStore.sections.find(
      (section) => section.type === sectionType,
    )?.title || ''
  );
};

export const getFormattedTemplateData = (): PdfTemplateData => {
  return {
    personalDetails: {
      firstName: getFieldValueByName(FIELD_NAMES.PERSONAL_DETAILS.FIRST_NAME),
      lastName: getFieldValueByName(FIELD_NAMES.PERSONAL_DETAILS.LAST_NAME),
      jobTitle: getFieldValueByName(
        FIELD_NAMES.PERSONAL_DETAILS.WANTED_JOB_TITLE,
      ),
      address: getFieldValueByName(FIELD_NAMES.PERSONAL_DETAILS.ADDRESS),
      city: getFieldValueByName(FIELD_NAMES.PERSONAL_DETAILS.CITY),
      postalCode: getFieldValueByName(FIELD_NAMES.PERSONAL_DETAILS.POSTAL_CODE),
      placeOfBirth: getFieldValueByName(
        FIELD_NAMES.PERSONAL_DETAILS.PLACE_OF_BIRTH,
      ),
      phone: getFieldValueByName(FIELD_NAMES.PERSONAL_DETAILS.PHONE),
      email: getFieldValueByName(FIELD_NAMES.PERSONAL_DETAILS.EMAIL),
      dateOfBirth: getFieldValueByName(
        FIELD_NAMES.PERSONAL_DETAILS.DATE_OF_BIRTH,
      ),
      driversLicense: getFieldValueByName(
        FIELD_NAMES.PERSONAL_DETAILS.DRIVING_LICENSE,
      ),
    },
    summarySection: {
      sectionName: getSectionNameByType(INTERNAL_SECTION_TYPES.SUMMARY),
      summary: getFieldValueByName(FIELD_NAMES.SUMMARY.SUMMARY),
    },
  };
};
