import type { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { FIELD_NAMES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import {
  DocumentRecordWithDisplayOrder,
  FieldName,
  SectionMetadataKey,
  SectionWithParsedMetadata,
  TemplateDataSection,
  WithEntryId,
} from '@/lib/types/documentBuilder.types';

export const sortByDisplayOrder = (
  a: DocumentRecordWithDisplayOrder,
  b: DocumentRecordWithDisplayOrder,
) => {
  return a.displayOrder - b.displayOrder;
};

export const findValueInItemFields = (
  fields: DEX_Field[],
  fieldName: FieldName,
): string => {
  return fields.find((field) => field.name === fieldName)?.value || '';
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

export const getWorkExperienceSectionEntries = (
  section: TemplateDataSection,
) => {
  return getRenderableEntries(
    section.items.map((item) => {
      const fields = item.fields;
      return {
        entryId: crypto.randomUUID(),
        jobTitle: findValueInItemFields(
          fields,
          FIELD_NAMES.WORK_EXPERIENCE.JOB_TITLE,
        ),
        employer: findValueInItemFields(
          fields,
          FIELD_NAMES.WORK_EXPERIENCE.EMPLOYER,
        ),
        startDate: findValueInItemFields(
          fields,
          FIELD_NAMES.WORK_EXPERIENCE.START_DATE,
        ),
        endDate: findValueInItemFields(
          fields,
          FIELD_NAMES.WORK_EXPERIENCE.END_DATE,
        ),
        city: findValueInItemFields(fields, FIELD_NAMES.WORK_EXPERIENCE.CITY),
        description: findValueInItemFields(
          fields,
          FIELD_NAMES.WORK_EXPERIENCE.DESCRIPTION,
        ),
      };
    }),
  );
};

export const getEducationSectionEntries = (section: TemplateDataSection) => {
  return getRenderableEntries(
    section.items.map((item) => {
      const fields = item.fields;
      return {
        entryId: crypto.randomUUID(),
        school: findValueInItemFields(fields, FIELD_NAMES.EDUCATION.SCHOOL),
        degree: findValueInItemFields(fields, FIELD_NAMES.EDUCATION.DEGREE),
        startDate: findValueInItemFields(
          fields,
          FIELD_NAMES.EDUCATION.START_DATE,
        ),
        endDate: findValueInItemFields(fields, FIELD_NAMES.EDUCATION.END_DATE),
        city: findValueInItemFields(fields, FIELD_NAMES.EDUCATION.CITY),
        description: findValueInItemFields(
          fields,
          FIELD_NAMES.WORK_EXPERIENCE.DESCRIPTION,
        ),
      };
    }),
  );
};

export const getLinksSectionEntries = (section: TemplateDataSection) => {
  return getRenderableEntries(
    section.items.map((item) => {
      const fields = item.fields;
      return {
        entryId: crypto.randomUUID(),
        label: findValueInItemFields(
          fields,
          FIELD_NAMES.WEBSITES_SOCIAL_LINKS.LABEL,
        ),
        link: findValueInItemFields(
          fields,
          FIELD_NAMES.WEBSITES_SOCIAL_LINKS.LINK,
        ),
      };
    }),
  );
};

export const getSkillsSectionEntries = (section: TemplateDataSection) => {
  return getRenderableEntries(
    section.items.map((item) => {
      const fields = item.fields;
      return {
        entryId: crypto.randomUUID(),
        name: findValueInItemFields(fields, FIELD_NAMES.SKILLS.SKILL),
        level: findValueInItemFields(
          fields,
          FIELD_NAMES.SKILLS.EXPERIENCE_LEVEL,
        ),
      };
    }),
  );
};

export const getInternshipsSectionEntries = (section: TemplateDataSection) => {
  return getRenderableEntries(
    section.items.map((item) => {
      const fields = item.fields;
      return {
        entryId: crypto.randomUUID(),
        jobTitle: findValueInItemFields(
          fields,
          FIELD_NAMES.INTERNSHIPS.JOB_TITLE,
        ),
        employer: findValueInItemFields(
          fields,
          FIELD_NAMES.INTERNSHIPS.EMPLOYER,
        ),
        startDate: findValueInItemFields(
          fields,
          FIELD_NAMES.INTERNSHIPS.START_DATE,
        ),
        endDate: findValueInItemFields(
          fields,
          FIELD_NAMES.INTERNSHIPS.END_DATE,
        ),
        city: findValueInItemFields(fields, FIELD_NAMES.INTERNSHIPS.CITY),
        description: findValueInItemFields(
          fields,
          FIELD_NAMES.INTERNSHIPS.DESCRIPTION,
        ),
      };
    }),
  );
};

export const getLanguagesSectionEntries = (section: TemplateDataSection) => {
  return getRenderableEntries(
    section.items.map((item) => {
      const fields = item.fields;
      return {
        entryId: crypto.randomUUID(),
        language: findValueInItemFields(fields, FIELD_NAMES.LANGUAGES.LANGUAGE),
        level: findValueInItemFields(fields, FIELD_NAMES.LANGUAGES.LEVEL),
      };
    }),
  );
};

export const getCoursesSectionEntries = (section: TemplateDataSection) => {
  return getRenderableEntries(
    section.items.map((item) => {
      const fields = item.fields;
      return {
        entryId: crypto.randomUUID(),
        course: findValueInItemFields(fields, FIELD_NAMES.COURSES.COURSE),
        institution: findValueInItemFields(
          fields,
          FIELD_NAMES.COURSES.INSTITUTION,
        ),
        startDate: findValueInItemFields(
          fields,
          FIELD_NAMES.COURSES.START_DATE,
        ),
        endDate: findValueInItemFields(fields, FIELD_NAMES.COURSES.END_DATE),
      };
    }),
  );
};
