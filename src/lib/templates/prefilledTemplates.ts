import { CONTAINER_TYPES, DEX_Document } from '../client-db/clientDbSchema';
import { INTERNAL_SECTION_TYPES } from '../stores/documentBuilder/documentBuilder.constants';
import { ValueOf } from '../types/utils.types';

export const PREFILL_RESUME_STYLES = {
  STANDARD: 'standard',
  CREATIVE: 'creative',
  TECH_FOCUSED: 'tech-focused',
} as const;

export const sampleDataOptions: {
  label: string;
  value: PrefilledResumeStyle;
}[] = [
  {
    label: 'Standard',
    value: PREFILL_RESUME_STYLES.STANDARD,
  },
  {
    label: 'Tech-Focused',
    value: PREFILL_RESUME_STYLES.TECH_FOCUSED,
  },
  {
    label: 'Creative',
    value: PREFILL_RESUME_STYLES.CREATIVE,
  },
] as const;

export type PrefilledResumeStyle = ValueOf<typeof PREFILL_RESUME_STYLES>;

import { SectionWithFields } from '../client-db/clientDbSchema';
import { getInsertTemplatesWithValues } from '../misc/fieldTemplates';

const getStandardTemplate = (
  documentId: DEX_Document['id'],
): SectionWithFields[] => [
  {
    title: 'Personal Details',
    defaultTitle: 'Personal Details',
    displayOrder: 1,
    documentId,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
    items: [
      {
        containerType: CONTAINER_TYPES.STATIC,
        displayOrder: 1,
        fields: getInsertTemplatesWithValues('PERSONAL_DETAILS', {
          WANTED_JOB_TITLE: 'Business Professional',
          FIRST_NAME: 'John',
          LAST_NAME: 'Smith',
          EMAIL: 'john.smith@email.com',
          PHONE: '+1 (555) 123-4567',
          CITY: 'New York, NY',
          COUNTRY: '',
          ADDRESS: '',
        }),
      },
    ],
  },
  {
    title: 'Summary',
    defaultTitle: 'Summary',
    displayOrder: 2,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.SUMMARY,
    documentId,
    items: [
      {
        containerType: CONTAINER_TYPES.STATIC,
        displayOrder: 1,
        fields: getInsertTemplatesWithValues('SUMMARY', {
          SUMMARY:
            '<p>Results-driven professional with 5+ years of experience in business development and project management. Proven track record of leading successful initiatives and driving organizational growth.</p>',
        }),
      },
    ],
  },
  {
    title: 'Work Experience',
    defaultTitle: 'Work Experience',
    displayOrder: 3,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.WORK_EXPERIENCE,
    documentId,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        displayOrder: 1,
        fields: getInsertTemplatesWithValues('WORK_EXPERIENCE', {
          JOB_TITLE: 'Senior Business Analyst',
          EMPLOYER: 'Global Solutions Corp.',
          START_DATE: 'Jan 2020',
          END_DATE: 'Present',
          CITY: 'New York, NY',
          DESCRIPTION:
            '<ul><li>Led cross-functional teams in implementing strategic initiatives</li><li>Improved operational efficiency by 25% through process optimization</li><li>Managed client relationships resulting in 40% revenue growth</li></ul>',
        }),
      },
    ],
  },
  {
    title: 'Education',
    defaultTitle: 'Education',
    displayOrder: 4,
    documentId,
    metadata: '',
    type: 'education',
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        displayOrder: 1,
        fields: getInsertTemplatesWithValues('EDUCATION', {
          SCHOOL: 'University of Pennsylvania',
          DEGREE: 'Bachelor of Science in Business Administration',
          START_DATE: 'Sep 2014',
          END_DATE: 'May 2018',
          CITY: 'Philadelphia, PA',
          DESCRIPTION:
            '<p><strong>Core Skills:</strong> Project Management, Strategic Planning, Business Analysis</p><p><strong>Tools:</strong> MS Office Suite, Tableau, Salesforce</p><p><strong>Soft Skills:</strong> Leadership, Communication, Problem Solving</p>',
        }),
      },
    ],
  },
  {
    title: 'Skills',
    defaultTitle: 'Skills',
    displayOrder: 5,
    documentId,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.SKILLS,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        displayOrder: 1,
        fields: getInsertTemplatesWithValues('SKILLS', {
          SKILL: '',
          EXPERIENCE_LEVEL: '',
        }),
      },
    ],
  },
  {
    title: 'Other',
    defaultTitle: 'Custom Section',
    displayOrder: 6,
    documentId,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.CUSTOM,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        displayOrder: 1,
        fields: getInsertTemplatesWithValues('CUSTOM', {
          ACTIVITY_NAME: '',
          CITY: '',
          DESCRIPTION:
            '<p><strong>Business Analysis Tools:</strong> Microsoft Excel, Tableau, Power BI, SQL, JIRA.<br><strong>Requirements Gathering:</strong> Stakeholder Interviews, Surveys, Workshops, Use Cases, User Stories.<br><strong>Process Improvement:</strong> Lean Six Sigma, Process Mapping, Root Cause Analysis, Workflow Optimization.<br><strong>Project Management:</strong> Agile, Scrum, Waterfall, Risk Management, Change Management.</p>',
          END_DATE: '',
          START_DATE: '',
        }),
      },
    ],
  },
];

const getTechFocusedTemplate = (
  documentId: DEX_Document['id'],
): SectionWithFields[] => [
  {
    title: 'Personal Details',
    defaultTitle: 'Personal Details',
    displayOrder: 1,
    documentId,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
    items: [
      {
        containerType: CONTAINER_TYPES.STATIC,
        displayOrder: 1,
        fields: getInsertTemplatesWithValues('PERSONAL_DETAILS', {
          WANTED_JOB_TITLE: 'Software Engineer',
          FIRST_NAME: 'Alex',
          LAST_NAME: 'Chen',
          EMAIL: 'alex.chen@email.com',
          PHONE: '+1 (555) 987-6543',
          CITY: 'San Francisco, CA',
          COUNTRY: '',
          ADDRESS: '',
        }),
      },
    ],
  },
  {
    title: 'Summary',
    defaultTitle: 'Summary',
    displayOrder: 2,
    metadata: '',
    documentId,
    type: INTERNAL_SECTION_TYPES.SUMMARY,
    items: [
      {
        containerType: CONTAINER_TYPES.STATIC,
        displayOrder: 1,
        fields: getInsertTemplatesWithValues('SUMMARY', {
          SUMMARY:
            '<p>Innovative Software Engineer with expertise in full-stack development and cloud architecture. Passionate about building scalable solutions and implementing cutting-edge technologies.</p>',
        }),
      },
    ],
  },
  {
    title: 'Work Experience',
    defaultTitle: 'Work Experience',
    displayOrder: 3,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.WORK_EXPERIENCE,
    documentId,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        displayOrder: 1,
        fields: getInsertTemplatesWithValues('WORK_EXPERIENCE', {
          JOB_TITLE: 'Senior Software Engineer',
          EMPLOYER: 'Tech Innovations Inc.',
          START_DATE: 'Mar 2019',
          END_DATE: 'Present',
          CITY: 'San Francisco, CA',
          DESCRIPTION:
            '<ul><li>Architected and implemented microservices using Kubernetes and Docker</li><li>Optimized application performance resulting in 50% reduction in load times</li><li>Led migration to cloud infrastructure using AWS and Terraform</li></ul>',
        }),
      },
    ],
  },
  {
    title: 'Education',
    defaultTitle: 'Education',
    displayOrder: 4,
    metadata: '',
    type: 'education',
    documentId,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        displayOrder: 1,
        fields: getInsertTemplatesWithValues('EDUCATION', {
          SCHOOL: 'Stanford University',
          DEGREE: 'Master of Science in Computer Science',
          START_DATE: 'Sep 2016',
          END_DATE: 'Jun 2018',
          CITY: 'Stanford, CA',
          DESCRIPTION:
            '<p><strong>Languages:</strong> Python, JavaScript, Go, Rust</p><p><strong>Technologies:</strong> React, Node.js, GraphQL, Kubernetes</p><p><strong>Cloud & Tools:</strong> AWS, Docker, Terraform, CI/CD</p>',
        }),
      },
    ],
  },
  {
    title: 'Skills',
    defaultTitle: 'Skills',
    displayOrder: 5,
    documentId,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.SKILLS,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        displayOrder: 1,
        fields: getInsertTemplatesWithValues('SKILLS', {
          SKILL: '',
          EXPERIENCE_LEVEL: '',
        }),
      },
    ],
  },
  {
    title: 'Other',
    defaultTitle: 'Custom Section',
    displayOrder: 6,
    documentId,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.CUSTOM,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        displayOrder: 1,
        fields: getInsertTemplatesWithValues('CUSTOM', {
          ACTIVITY_NAME: '',
          CITY: '',
          START_DATE: '',
          END_DATE: '',
          DESCRIPTION:
            '<p><strong>Front-End Development:</strong> HTML, CSS, JavaScript, React, Angular, Vue.js.<br><strong>Back-End Development:</strong> Node.js, Python, Java, Express.js, Django, Spring Boot.<br><strong>Database Management:</strong> SQL (MySQL, PostgreSQL), NoSQL (MongoDB, Firebase).<br><strong>DevOps &amp; Tools:</strong> Git, Docker, Jenkins, AWS, Azure, Heroku.</p>',
        }),
      },
    ],
  },
];

const getCreativeTemplate = (
  documentId: DEX_Document['id'],
): SectionWithFields[] => [
  {
    title: 'Personal Details',
    defaultTitle: 'Personal Details',
    displayOrder: 1,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
    documentId,
    items: [
      {
        containerType: CONTAINER_TYPES.STATIC,
        displayOrder: 1,
        fields: getInsertTemplatesWithValues('PERSONAL_DETAILS', {
          WANTED_JOB_TITLE: 'UI/UX Designer',
          FIRST_NAME: 'Sarah',
          LAST_NAME: 'Parker',
          EMAIL: 'sarah.parker@email.com',
          PHONE: '+1 (555) 456-7890',
          CITY: 'Los Angeles, CA',
          COUNTRY: '',
          ADDRESS: '',
        }),
      },
    ],
  },
  {
    title: 'Summary',
    defaultTitle: 'Summary',
    displayOrder: 2,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.SUMMARY,
    documentId,
    items: [
      {
        containerType: CONTAINER_TYPES.STATIC,
        displayOrder: 1,
        fields: getInsertTemplatesWithValues('SUMMARY', {
          SUMMARY:
            '<p>Creative UI/UX Designer with a passion for crafting intuitive and visually stunning digital experiences. Combining artistic vision with user-centered design principles.</p>',
        }),
      },
    ],
  },
  {
    title: 'Work Experience',
    defaultTitle: 'Work Experience',
    displayOrder: 3,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.WORK_EXPERIENCE,
    documentId,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        displayOrder: 1,
        fields: getInsertTemplatesWithValues('WORK_EXPERIENCE', {
          JOB_TITLE: 'Senior UI/UX Designer',
          EMPLOYER: 'Creative Design Studio',
          START_DATE: 'Jun 2019',
          END_DATE: 'Present',
          CITY: 'Los Angeles, CA',
          DESCRIPTION:
            '<ul><li>Redesigned flagship product increasing user engagement by 75%</li><li>Created innovative design system used across multiple platforms</li><li>Led user research and testing for major feature launches</li></ul>',
        }),
      },
    ],
  },
  {
    title: 'Education',
    defaultTitle: 'Education',
    displayOrder: 4,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.EDUCATION,
    documentId,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        displayOrder: 1,
        fields: getInsertTemplatesWithValues('EDUCATION', {
          SCHOOL: 'Rhode Island School of Design',
          DEGREE: 'Bachelor of Fine Arts in Graphic Design',
          START_DATE: 'Sep 2015',
          END_DATE: 'May 2019',
          CITY: 'Providence, RI',
          DESCRIPTION:
            '<p><strong>Design:</strong> UI/UX, Visual Design, Interaction Design</p><p><strong>Tools:</strong> Figma, Adobe Creative Suite, Sketch</p><p><strong>Skills:</strong> Prototyping, User Research, Design Systems</p>',
        }),
      },
    ],
  },
  {
    title: 'Skills',
    defaultTitle: 'Skills',
    displayOrder: 5,
    metadata: '',
    documentId,
    type: INTERNAL_SECTION_TYPES.SKILLS,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        displayOrder: 1,
        fields: getInsertTemplatesWithValues('SKILLS', {
          SKILL: '',
          EXPERIENCE_LEVEL: '',
        }),
      },
    ],
  },
  {
    title: 'Other',
    defaultTitle: 'Custom Section',
    displayOrder: 6,
    documentId,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.CUSTOM,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        displayOrder: 1,
        fields: getInsertTemplatesWithValues('CUSTOM', {
          ACTIVITY_NAME: '',
          CITY: '',
          START_DATE: '',
          END_DATE: '',
          DESCRIPTION:
            '<p><strong>Design Tools:</strong> Adobe XD, Sketch, Figma, InVision, Axure.<br><strong>Prototyping &amp; Wireframing:</strong> Low-Fidelity Wireframes, High-Fidelity Prototypes, User Flows, Storyboards.<br><strong>User Research:</strong> User Interviews, Surveys, Usability Testing, A/B Testing, Personas.<br><strong>Information Architecture:</strong> Site Mapping, Card Sorting, Content Strategy, Navigation Design.</p>',
        }),
      },
    ],
  },
];

export const getTemplateByStyle = (
  style: PrefilledResumeStyle,
  documentId: DEX_Document['id'],
): SectionWithFields[] => {
  switch (style) {
    case PREFILL_RESUME_STYLES.STANDARD:
      return getStandardTemplate(documentId);
    case PREFILL_RESUME_STYLES.TECH_FOCUSED:
      return getTechFocusedTemplate(documentId);
    case PREFILL_RESUME_STYLES.CREATIVE:
      return getCreativeTemplate(documentId);
    default:
      return getStandardTemplate(documentId);
  }
};
