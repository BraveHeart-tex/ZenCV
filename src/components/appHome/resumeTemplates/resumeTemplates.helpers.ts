import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { FIELD_NAMES, INTERNAL_SECTION_TYPES } from '@/lib/constants';
import {
  DocumentRecordWithDisplayOrder,
  FieldName,
  PdfTemplateData,
  SectionMetadataKey,
  SectionType,
  SectionWithParsedMetadata,
  WithEntryId,
} from '@/lib/types';
import type { DEX_Field } from '@/lib/client-db/clientDbSchema';

const sortByDisplayOrder = (
  a: DocumentRecordWithDisplayOrder,
  b: DocumentRecordWithDisplayOrder,
) => {
  return a.displayOrder - b.displayOrder;
};

const getFieldValueByName = (fieldName: FieldName): string => {
  return (
    documentBuilderStore.fields.find((field) => field.name === fieldName)
      ?.value || ''
  );
};

export const findValueInItemFields = (
  fields: DEX_Field[],
  fieldName: FieldName,
): string => {
  return fields.find((field) => field.name === fieldName)?.value || '';
};

const getSectionNameByType = (sectionType: SectionType): string => {
  return (
    documentBuilderStore.sections.find(
      (section) => section.type === sectionType,
    )?.title || ''
  );
};

export const getFormattedTemplateData = (): PdfTemplateData => {
  const mappedSections: PdfTemplateData['sections'] =
    documentBuilderStore.sections
      .slice()
      .sort(sortByDisplayOrder)
      .map((section) => {
        return {
          ...section,
          items: documentBuilderStore.items
            .slice()
            .sort(sortByDisplayOrder)
            .filter((item) => item.sectionId === section.id)
            .map((item) => ({
              ...item,
              fields: documentBuilderStore.fields.filter(
                (field) => field.itemId === item.id,
              ),
            })),
        };
      });

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
    sections: mappedSections,
  };
};

export const getRenderableEntries = <T extends Record<string, unknown>>(
  entries: WithEntryId<T>[],
) => {
  return entries.filter((entry) => {
    const keys = Object.keys(entry) as Array<keyof typeof entry>;
    return (
      keys.filter((key) => key !== 'entryId' && entry[key] !== '').length > 0
    );
  });
};

export const getSectionMetadata = (
  section: SectionWithParsedMetadata,
  key: SectionMetadataKey,
) => {
  return section.metadata.find((data) => data.key === key)?.value || null;
};
