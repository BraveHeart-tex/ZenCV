import {
  BookOpenTextIcon,
  BriefcaseBusinessIcon,
  ContactIcon,
  GuitarIcon,
  LanguagesIcon,
  SlidersHorizontalIcon,
} from 'lucide-react';
import { CONTAINER_TYPES } from '@/lib/client-db/clientDbSchema';
import { UNCHECKED_METADATA_VALUE } from '@/lib/constants';
import { OtherSectionOption } from '@/components/documentBuilder/AddSectionWidget';
import { SectionType } from '@/lib/types/documentBuilder.types';

export const INTERNAL_SECTION_TYPES = {
  PERSONAL_DETAILS: 'personal-details',
  SUMMARY: 'summary',
  WORK_EXPERIENCE: 'work-experience',
  EDUCATION: 'education',
  WEBSITES_SOCIAL_LINKS: 'websites-social-links',
  SKILLS: 'skills',
  CUSTOM: 'custom',
  INTERNSHIPS: 'internships',
  HOBBIES: 'hobbies',
  REFERENCES: 'references',
  COURSES: 'courses',
  LANGUAGES: 'languages',
} as const;

export const INTERNAL_TEMPLATE_TYPES = {
  MANHATTAN: 'manhattan',
  LONDON: 'london',
} as const;

export const NOT_TEMPLATED_SECTION_TYPES = [
  INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
  INTERNAL_SECTION_TYPES.SUMMARY,
] as const;

export const DELETABLE_INTERNAL_SECTION_TYPES = new Map<SectionType, boolean>([
  [INTERNAL_SECTION_TYPES.CUSTOM, true],
  [INTERNAL_SECTION_TYPES.HOBBIES, true],
  [INTERNAL_SECTION_TYPES.REFERENCES, true],
  [INTERNAL_SECTION_TYPES.COURSES, true],
  [INTERNAL_SECTION_TYPES.LANGUAGES, true],
  [INTERNAL_SECTION_TYPES.INTERNSHIPS, true],
]);

export const SECTION_DESCRIPTIONS_BY_TYPE = {
  [INTERNAL_SECTION_TYPES.SUMMARY]:
    'Write a brief overview of your professional profile and key achievements.',
  [INTERNAL_SECTION_TYPES.WORK_EXPERIENCE]:
    'Highlight your achievements with measurable results. Use action verbs and specific numbers.',
  [INTERNAL_SECTION_TYPES.EDUCATION]:
    'List your relevant education and qualifications that showcase your expertise.',
  [INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS]:
    'Add links to your portfolio, LinkedIn, or other professional profiles.',
  [INTERNAL_SECTION_TYPES.SKILLS]:
    'List your most relevant skills that match the job requirements.',
} as const;

export const RICH_TEXT_PLACEHOLDERS_BY_TYPE = {
  [INTERNAL_SECTION_TYPES.SUMMARY]:
    'E.g., "Full-stack developer with 5+ years of experience in building scalable web applications"',
  [INTERNAL_SECTION_TYPES.WORK_EXPERIENCE]:
    'E.g., "Led a team of 5 to deliver a new feature that increased user engagement by 40%"',
  [INTERNAL_SECTION_TYPES.EDUCATION]:
    'E.g., "Computer Science major with Dean\'s List recognition"',
  [INTERNAL_SECTION_TYPES.HOBBIES]:
    'E.g., "Photography, Rock Climbing, Learning Languages"',
} as const;

export const SELECT_TYPES = {
  BASIC: 'basic',
} as const;

export const FIXED_SECTIONS = [
  INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
  INTERNAL_SECTION_TYPES.SUMMARY,
  INTERNAL_SECTION_TYPES.HOBBIES,
] as const;

export const FIELD_NAMES = {
  PERSONAL_DETAILS: {
    WANTED_JOB_TITLE: 'Wanted Job Title',
    FIRST_NAME: 'First Name',
    LAST_NAME: 'Last Name',
    EMAIL: 'Email',
    PHONE: 'Phone',
    COUNTRY: 'Country',
    CITY: 'City',
    ADDRESS: 'Address',
  },
  SUMMARY: {
    SUMMARY: 'Summary',
  },
  WORK_EXPERIENCE: {
    JOB_TITLE: 'Job Title',
    EMPLOYER: 'Employer',
    START_DATE: 'Start Date',
    END_DATE: 'End Date',
    CITY: 'City',
    DESCRIPTION: 'Description',
  },
  EDUCATION: {
    SCHOOL: 'School',
    DEGREE: 'Degree',
    START_DATE: 'Start Date',
    END_DATE: 'End Date',
    CITY: 'City',
    DESCRIPTION: 'Description',
  },
  WEBSITES_SOCIAL_LINKS: {
    LABEL: 'Label',
    LINK: 'Link',
  },
  SKILLS: {
    SKILL: 'Skill',
    EXPERIENCE_LEVEL: 'Experience Level',
  },
  LANGUAGES: {
    LANGUAGE: 'Language',
    LEVEL: 'Level',
  },
  HOBBIES: {
    WHAT_DO_YOU_LIKE: 'What do you like?',
  },
  COURSES: {
    COURSE: 'Course',
    INSTITUTION: 'Institution',
    START_DATE: 'Start Date',
    END_DATE: 'End Date',
  },
  INTERNSHIPS: {
    JOB_TITLE: 'Job Title',
    EMPLOYER: 'Employer',
    START_DATE: 'Start Date',
    END_DATE: 'End Date',
    CITY: 'City',
    DESCRIPTION: 'Description',
  },
  CUSTOM: {
    ACTIVITY_NAME: 'Activity name, job, book title etc.',
    CITY: 'City',
    START_DATE: 'Start Date',
    END_DATE: 'End Date',
    DESCRIPTION: 'Description',
  },
  REFERENCES: {
    REFERENT_FULL_NAME: "Referent's Full Name",
    COMPANY: 'Company',
    PHONE: 'Phone',
    REFERENT_EMAIL: "Referent's Email",
  },
} as const;

export const SECTION_METADATA_KEYS = {
  SKILLS: {
    SHOW_EXPERIENCE_LEVEL: 'showExperienceLevel',
    IS_COMMA_SEPARATED: 'isCommaSeparated',
  },
  REFERENCES: {
    HIDE_REFERENCES: 'hideReferences',
  },
} as const;

export const MAX_VISIBLE_FIELDS = 6 as const;

export const builderSectionTitleClassNames =
  'scroll-m-20 text-2xl font-semibold tracking-tight';

export const highlightedElementClassName = 'highlighted-element';

export const CLASSNAME_TOGGLE_WAIT_MS = 1000 as const;

export const RESUME_SCORE_CONFIG = {
  WORK_EXPERIENCE: 25,
  EDUCATION: 15,
  INTERNSHIPS: 2,
  EMAIL: 5,
  JOB_TITLE: 10,
  SUMMARY: 15,
  LANGUAGE: 3,
  SKILL: 4,
} as const;

export const SUGGESTED_SKILLS_COUNT = 5;

export const MAX_VISIBLE_SUGGESTIONS = 5;

export const SUGGESTION_ACTION_TYPES = {
  ADD_ITEM: 'ADD_ITEM',
  FOCUS_FIELD: 'FOCUS_FIELD',
} as const;

export const TOGGLE_ITEM_WAIT_MS = 100 as const;

export const TEMPLATE_DATA_DEBOUNCE_MS = 500 as const;

export const SUGGESTION_TYPES = {
  ITEM: 'ITEM',
  FIELD: 'FIELD',
} as const;

export const SECTION_SUGGESTION_CONFIG = [
  {
    type: INTERNAL_SECTION_TYPES.WORK_EXPERIENCE,
    scoreValue: RESUME_SCORE_CONFIG.WORK_EXPERIENCE,
    label: 'Add work experience',
  },
  {
    type: INTERNAL_SECTION_TYPES.EDUCATION,
    scoreValue: RESUME_SCORE_CONFIG.EDUCATION,
    label: 'Add education',
  },
  {
    type: INTERNAL_SECTION_TYPES.INTERNSHIPS,
    scoreValue: RESUME_SCORE_CONFIG.INTERNSHIPS,
    label: 'Add internships',
  },
  {
    type: INTERNAL_SECTION_TYPES.SUMMARY,
    scoreValue: RESUME_SCORE_CONFIG.SUMMARY,
    label: 'Add summary',
    fieldName: FIELD_NAMES.SUMMARY.SUMMARY,
  },
  {
    type: INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
    scoreValue: RESUME_SCORE_CONFIG.EMAIL,
    label: 'Add email',
    fieldName: FIELD_NAMES.PERSONAL_DETAILS.EMAIL,
  },
  {
    type: INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
    scoreValue: RESUME_SCORE_CONFIG.JOB_TITLE,
    label: 'Add job title',
    fieldName: FIELD_NAMES.PERSONAL_DETAILS.WANTED_JOB_TITLE,
  },
];

export const OTHER_SECTION_OPTIONS: OtherSectionOption[] = [
  {
    icon: SlidersHorizontalIcon,
    title: 'Custom Section',
    type: INTERNAL_SECTION_TYPES.CUSTOM,
    containerType: CONTAINER_TYPES.COLLAPSIBLE,
  },
  {
    icon: GuitarIcon,
    title: 'Hobbies',
    type: INTERNAL_SECTION_TYPES.HOBBIES,
    containerType: CONTAINER_TYPES.STATIC,
  },
  {
    icon: ContactIcon,
    title: 'References',
    type: INTERNAL_SECTION_TYPES.REFERENCES,
    metadata: JSON.stringify([
      {
        label: 'Hide references and make them available upon request',
        key: SECTION_METADATA_KEYS.REFERENCES.HIDE_REFERENCES,
        value: UNCHECKED_METADATA_VALUE,
      },
    ]),
    containerType: CONTAINER_TYPES.COLLAPSIBLE,
  },
  {
    icon: BookOpenTextIcon,
    title: 'Courses',
    type: INTERNAL_SECTION_TYPES.COURSES,
    containerType: CONTAINER_TYPES.COLLAPSIBLE,
    itemCountPerContainer: 4,
  },
  {
    icon: BriefcaseBusinessIcon,
    title: 'Internships',
    type: INTERNAL_SECTION_TYPES.INTERNSHIPS,
    containerType: CONTAINER_TYPES.COLLAPSIBLE,
  },
  {
    icon: LanguagesIcon,
    title: 'Languages',
    type: INTERNAL_SECTION_TYPES.LANGUAGES,
    containerType: CONTAINER_TYPES.COLLAPSIBLE,
  },
].map((item) => ({
  ...item,
  defaultTitle: item.title,
}));

export const SECTIONS_WITH_RICH_TEXT_AI = new Map<SectionType, boolean>([
  [INTERNAL_SECTION_TYPES.SUMMARY, true],
  [INTERNAL_SECTION_TYPES.WORK_EXPERIENCE, true],
  [INTERNAL_SECTION_TYPES.INTERNSHIPS, true],
]);

export const START_WORK_EXPERIENCE_TOUR_DELAY_MS = 300 as const;

export const aiButtonBaseClassnames =
  'dark:bg-purple-900 hover:bg-purple-800 bg-purple-700 rounded-md';

export const SECTIONS_WITH_KEYWORD_SUGGESTION_WIDGET = new Map<
  SectionType,
  boolean
>([
  [INTERNAL_SECTION_TYPES.SUMMARY, true],
  [INTERNAL_SECTION_TYPES.WORK_EXPERIENCE, true],
  [INTERNAL_SECTION_TYPES.INTERNSHIPS, true],
]);
