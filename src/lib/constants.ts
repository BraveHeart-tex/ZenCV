export const INTERNAL_SECTION_TYPES = {
  PERSONAL_DETAILS: 'personal-details',
  PROFESSIONAL_SUMMARY: 'professional-summary',
  EMPLOYMENT_HISTORY: 'employment-history',
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

export const NOT_TEMPLATED_SECTION_TYPES = [
  INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
  INTERNAL_SECTION_TYPES.PROFESSIONAL_SUMMARY,
] as const;

export const DELETABLE_INTERNAL_SECTION_TYPES = [
  INTERNAL_SECTION_TYPES.CUSTOM,
  INTERNAL_SECTION_TYPES.HOBBIES,
  INTERNAL_SECTION_TYPES.REFERENCES,
  INTERNAL_SECTION_TYPES.COURSES,
  INTERNAL_SECTION_TYPES.LANGUAGES,
  INTERNAL_SECTION_TYPES.INTERNSHIPS,
] as const;

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

export const SELECT_TYPES = {
  BASIC: 'basic',
} as const;

export const FIXED_SECTIONS = [
  INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
  INTERNAL_SECTION_TYPES.PROFESSIONAL_SUMMARY,
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
    POSTAL_CODE: 'Postal Code',
    DRIVING_LICENSE: 'Driving License',
    PLACE_OF_BIRTH: 'Place of Birth',
    DATE_OF_BIRTH: 'Date of Birth',
  },
  PROFESSIONAL_SUMMARY: {
    PROFESSIONAL_SUMMARY: 'Professional Summary',
  },
  EMPLOYMENT_HISTORY: {
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
