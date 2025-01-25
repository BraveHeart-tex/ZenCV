import { FieldInsertTemplate } from '@/lib/types';
import { FIELD_NAMES, SELECT_TYPES } from '@/lib/constants';
import { DEX_Field, FIELD_TYPES } from '@/lib/client-db/clientDbSchema';

export const personalDetailsSectionFields: FieldInsertTemplate[] = [
  {
    name: FIELD_NAMES.PERSONAL_DETAILS.WANTED_JOB_TITLE,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.PERSONAL_DETAILS.FIRST_NAME,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.PERSONAL_DETAILS.LAST_NAME,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.PERSONAL_DETAILS.EMAIL,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.PERSONAL_DETAILS.PHONE,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.PERSONAL_DETAILS.COUNTRY,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.PERSONAL_DETAILS.CITY,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.PERSONAL_DETAILS.ADDRESS,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.PERSONAL_DETAILS.POSTAL_CODE,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.PERSONAL_DETAILS.DRIVING_LICENSE,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.PERSONAL_DETAILS.PLACE_OF_BIRTH,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.PERSONAL_DETAILS.DATE_OF_BIRTH,
    type: FIELD_TYPES.STRING,
  },
].map((field) => ({ ...field, value: '' }));

export const employmentHistoryFields: FieldInsertTemplate[] = [
  {
    name: FIELD_NAMES.WORK_EXPERIENCE.JOB_TITLE,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.WORK_EXPERIENCE.EMPLOYER,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.WORK_EXPERIENCE.START_DATE,
    type: FIELD_TYPES.DATE_MONTH,
  },
  {
    name: FIELD_NAMES.WORK_EXPERIENCE.END_DATE,
    type: FIELD_TYPES.DATE_MONTH,
  },
  {
    name: FIELD_NAMES.WORK_EXPERIENCE.CITY,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.WORK_EXPERIENCE.DESCRIPTION,
    type: FIELD_TYPES.RICH_TEXT,
  },
].map((field) => ({ ...field, value: '' }));

export const educationFields: FieldInsertTemplate[] = [
  {
    name: FIELD_NAMES.EDUCATION.SCHOOL,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.EDUCATION.DEGREE,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.EDUCATION.START_DATE,
    type: FIELD_TYPES.DATE_MONTH,
  },
  {
    name: FIELD_NAMES.EDUCATION.END_DATE,
    type: FIELD_TYPES.DATE_MONTH,
  },
  {
    name: FIELD_NAMES.EDUCATION.CITY,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.EDUCATION.DESCRIPTION,
    type: FIELD_TYPES.RICH_TEXT,
  },
].map((field) => ({
  ...field,
  value: '',
}));

export const websitesAndLinkFields: FieldInsertTemplate[] = [
  {
    name: FIELD_NAMES.WEBSITES_SOCIAL_LINKS.LABEL,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.WEBSITES_SOCIAL_LINKS.LINK,
    type: FIELD_TYPES.STRING,
  },
].map((field) => ({
  ...field,
  value: '',
}));

export const skillsSectionFields: FieldInsertTemplate[] = [
  {
    name: FIELD_NAMES.SKILLS.SKILL,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.SKILLS.EXPERIENCE_LEVEL,
    type: FIELD_TYPES.SELECT,
    selectType: SELECT_TYPES.BASIC,
    options: ['Beginner', 'Competent', 'Proficient', 'Expert'],
  } as DEX_Field,
].map((field) => ({
  ...field,
  value: '',
}));

export const coursesSectionFields: FieldInsertTemplate[] = [
  {
    name: FIELD_NAMES.COURSES.COURSE,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.COURSES.INSTITUTION,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.COURSES.START_DATE,
    type: FIELD_TYPES.DATE_MONTH,
  },
  {
    name: FIELD_NAMES.COURSES.END_DATE,
    type: FIELD_TYPES.DATE_MONTH,
  },
].map((field) => ({
  ...field,
  value: '',
}));

export const customSectionFields: FieldInsertTemplate[] = [
  {
    name: FIELD_NAMES.CUSTOM.ACTIVITY_NAME,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.CUSTOM.CITY,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.CUSTOM.START_DATE,
    type: FIELD_TYPES.DATE_MONTH,
  },
  {
    name: FIELD_NAMES.CUSTOM.END_DATE,
    type: FIELD_TYPES.DATE_MONTH,
  },
  {
    name: FIELD_NAMES.CUSTOM.DESCRIPTION,
    type: FIELD_TYPES.RICH_TEXT,
  },
].map((field) => ({
  ...field,
  value: '',
}));

export const referencesSectionFields: FieldInsertTemplate[] = [
  {
    name: FIELD_NAMES.REFERENCES.REFERENT_FULL_NAME,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.REFERENCES.COMPANY,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.REFERENCES.PHONE,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.REFERENCES.REFERENT_EMAIL,
    type: FIELD_TYPES.STRING,
  },
].map((field) => ({
  ...field,
  value: '',
}));

export const languagesSectionFields: FieldInsertTemplate[] = [
  {
    name: FIELD_NAMES.LANGUAGES.LANGUAGE,
    type: FIELD_TYPES.STRING,
  },
  {
    name: FIELD_NAMES.LANGUAGES.LEVEL,
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
  } as DEX_Field,
].map((field) => ({
  ...field,
  value: '',
}));
