import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { FIELD_NAMES } from '@/lib/constants';
import { FieldName, PdfTemplateData } from '@/lib/types';

const getFieldValueByName = (fieldName: FieldName) => {
  return (
    documentBuilderStore.fields.find((field) => field.name === fieldName)
      ?.value || ''
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
  };
};
