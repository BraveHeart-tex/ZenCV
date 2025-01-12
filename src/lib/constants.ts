export const INTERNAL_SECTION_TYPES = {
  PERSONAL_DETAILS: 'personal-details',
  PROFESSIONAL_SUMMARY: 'professional-summary',
  EMPLOYMENT_HISTORY: 'employment-history',
  EDUCATION: 'education',
  WEBSITES_SOCIAL_LINKS: 'websites-social-links',
  SKILLS: 'skills',
  CUSTOM: 'custom',
  INTERNSHIPS: 'internships',
  EXTRA_CURRICULAR_ACTIVITIES: 'extra-curricular-activities',
  HOBBIES: 'hobbies',
  REFERENCES: 'references',
  COURSES: 'courses',
  LANGUAGES: 'languages',
} as const;

export type SectionType = keyof typeof INTERNAL_SECTION_TYPES;

export const DELETABLE_INTERNAL_SECTION_TYPES = [
  INTERNAL_SECTION_TYPES.CUSTOM,
  INTERNAL_SECTION_TYPES.EXTRA_CURRICULAR_ACTIVITIES,
  INTERNAL_SECTION_TYPES.HOBBIES,
  INTERNAL_SECTION_TYPES.REFERENCES,
  INTERNAL_SECTION_TYPES.COURSES,
  INTERNAL_SECTION_TYPES.LANGUAGES,
  INTERNAL_SECTION_TYPES.INTERNSHIPS,
];

export const SECTION_DESCRIPTIONS_BY_TYPE = {
  [INTERNAL_SECTION_TYPES.PROFESSIONAL_SUMMARY]:
    "Grab the reader's attention with 2-4 snappy lines showcasing your role, top wins, best traits, and key skills.",
  [INTERNAL_SECTION_TYPES.EMPLOYMENT_HISTORY]:
    "List your key accomplishments from the past decade. Use bullet points and include specific metrics where possible (e.g., 'Increased X by Y% through Z initiative').",
  [INTERNAL_SECTION_TYPES.EDUCATION]:
    "Your diverse educational background highlights the unique value and skills you'll bring to the role.",
  [INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS]:
    "Feel free to include links to websites you'd like hiring managers to visit, such as your portfolio, LinkedIn profile, or personal website.",
  [INTERNAL_SECTION_TYPES.SKILLS]:
    'Select five key skills that demonstrate your suitability for the position. Ensure they align with the essential skills listed in the job description. (Particularly when applying through an online system.)',
} as const;

export const FIELDS_DND_INDEX_PREFIXES = {
  EMPLOYMENT: 'employment',
  EDUCATION: 'education',
  WEBSITES_AND_LINKS: 'websitesAndLinks',
  SKILLS: 'skills',
  CUSTOM: 'custom',
  INTERNSHIPS: 'internships',
  EXTRA_CURRICULAR_ACTIVITIES: 'extraCurricularActivities',
  REFERENCES: 'references',
  COURSES: 'courses',
  LANGUAGES: 'languages',
} as const;

export type FieldDndIndexPrefix = keyof typeof FIELDS_DND_INDEX_PREFIXES;

export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;
