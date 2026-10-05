import {
  BookOpenTextIcon,
  BriefcaseBusinessIcon,
  ContactIcon,
  GraduationCapIcon,
  GuitarIcon,
  LanguagesIcon,
  LinkIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
} from 'lucide-react';
import type { OtherSectionOption } from '@/components/documentBuilder/AddSectionWidget';
import type { SemanticSectionKey } from '@/lib/builderDocument/builderDocument';
import {
  getDefaultReferencesMetadata,
  getDefaultSkillsMetadata,
} from '@/lib/misc/sectionMetadataTemplates';
import type { SectionType } from '@/lib/types/documentBuilder.types';

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
  TOKYO: 'tokyo',
  DUBAI: 'dubai',
  SYDNEY: 'sydney',
  JAKE: 'jake',
} as const;

export const MAX_PERSONAL_DETAILS_LINKS = 4;

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
  [INTERNAL_SECTION_TYPES.EDUCATION, true],
  [INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS, true],
  [INTERNAL_SECTION_TYPES.SKILLS, true],
]);

export const SECTION_DESCRIPTIONS_BY_KEY = {
  summary:
    'Write a brief overview of your professional profile and key achievements.',
  workExperience:
    'Highlight your achievements with measurable results. Use action verbs and specific numbers.',
  education:
    'List your relevant education and qualifications that showcase your expertise.',
  websitesSocialLinks:
    'Add links to your portfolio, LinkedIn, or other professional profiles.',
  skills: 'List your most relevant skills that match the job requirements.',
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

export const builderSectionTitleClassNames =
  'scroll-m-20 text-2xl font-semibold tracking-tight';

export const highlightedElementClassName = 'highlighted-element';

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

export const TEMPLATE_DATA_DEBOUNCE_MS = 500 as const;

export const SUGGESTION_TYPES = {
  ITEM: 'ITEM',
  FIELD: 'FIELD',
} as const;

export const SECTION_SUGGESTION_CONFIG = [
  {
    sectionKey: 'workExperience',
    scoreValue: RESUME_SCORE_CONFIG.WORK_EXPERIENCE,
    label: 'Add work experience',
    fieldKey: undefined,
  },
  {
    sectionKey: 'education',
    scoreValue: RESUME_SCORE_CONFIG.EDUCATION,
    label: 'Add education',
    fieldKey: undefined,
  },
  {
    sectionKey: 'internships',
    scoreValue: RESUME_SCORE_CONFIG.INTERNSHIPS,
    label: 'Add internships',
    fieldKey: undefined,
  },
  {
    sectionKey: 'summary',
    scoreValue: RESUME_SCORE_CONFIG.SUMMARY,
    label: 'Add summary',
    fieldKey: 'summary',
  },
  {
    sectionKey: 'personalDetails',
    scoreValue: RESUME_SCORE_CONFIG.EMAIL,
    label: 'Add email',
    fieldKey: 'email',
  },
  {
    sectionKey: 'personalDetails',
    scoreValue: RESUME_SCORE_CONFIG.JOB_TITLE,
    label: 'Add job title',
    fieldKey: 'wantedJobTitle',
  },
] as const;

const sectionOptions: Omit<OtherSectionOption, 'defaultTitle'>[] = [
  {
    icon: GraduationCapIcon,
    sectionKey: 'education',
    title: 'Education',
  },
  {
    icon: LinkIcon,
    sectionKey: 'websitesSocialLinks' as const,
    title: 'Links',
  },
  {
    icon: SparklesIcon,
    sectionKey: 'skills' as const,
    title: 'Skills',
    metadata: getDefaultSkillsMetadata(),
  },
  {
    icon: SlidersHorizontalIcon,
    sectionKey: 'custom' as const,
    title: 'Custom Section',
  },
  {
    icon: GuitarIcon,
    sectionKey: 'hobbies' as const,
    title: 'Hobbies',
  },
  {
    icon: ContactIcon,
    sectionKey: 'references' as const,
    title: 'References',
    metadata: getDefaultReferencesMetadata(),
  },
  {
    icon: BookOpenTextIcon,
    sectionKey: 'courses' as const,
    title: 'Courses',
  },
  {
    icon: BriefcaseBusinessIcon,
    sectionKey: 'internships' as const,
    title: 'Internships',
  },
  {
    icon: LanguagesIcon,
    sectionKey: 'languages' as const,
    title: 'Languages',
  },
];

export const OTHER_SECTION_OPTIONS: OtherSectionOption[] = sectionOptions.map(
  (item) => ({
    ...item,
    defaultTitle: item.title,
  })
);

export const SECTIONS_WITH_RICH_TEXT_CHARACTER_COUNTER =
  new Set<SemanticSectionKey>(['summary', 'workExperience', 'internships']);
