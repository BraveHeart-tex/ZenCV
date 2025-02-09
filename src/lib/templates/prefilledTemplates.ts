import {
  CONTAINER_TYPES,
  DEX_Document,
  FIELD_TYPES,
} from '../client-db/clientDbSchema';
import {
  FIELD_NAMES,
  INTERNAL_SECTION_TYPES,
} from '../stores/documentBuilder/documentBuilder.constants';
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
        fields: [
          {
            name: FIELD_NAMES.PERSONAL_DETAILS.WANTED_JOB_TITLE,
            type: FIELD_TYPES.STRING,
            value: 'Business Professional',
          },
          {
            name: FIELD_NAMES.PERSONAL_DETAILS.FIRST_NAME,
            type: FIELD_TYPES.STRING,
            value: 'John',
          },
          {
            name: FIELD_NAMES.PERSONAL_DETAILS.LAST_NAME,
            type: FIELD_TYPES.STRING,
            value: 'Smith',
          },
          {
            name: FIELD_NAMES.PERSONAL_DETAILS.EMAIL,
            type: FIELD_TYPES.STRING,
            value: 'john.smith@email.com',
          },
          {
            name: FIELD_NAMES.PERSONAL_DETAILS.PHONE,
            type: FIELD_TYPES.STRING,
            value: '+1 (555) 123-4567',
          },
          {
            name: FIELD_NAMES.PERSONAL_DETAILS.CITY,
            type: FIELD_TYPES.STRING,
            value: 'New York, NY',
          },
        ],
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
        fields: [
          {
            name: FIELD_NAMES.SUMMARY.SUMMARY,
            type: FIELD_TYPES.RICH_TEXT,
            value:
              '<p>Results-driven professional with 5+ years of experience in business development and project management. Proven track record of leading successful initiatives and driving organizational growth.</p>',
          },
        ],
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
        fields: [
          {
            name: FIELD_NAMES.WORK_EXPERIENCE.JOB_TITLE,
            type: FIELD_TYPES.STRING,
            value: 'Senior Business Analyst',
          },
          {
            name: FIELD_NAMES.WORK_EXPERIENCE.EMPLOYER,
            type: FIELD_TYPES.STRING,
            value: 'Global Solutions Corp.',
          },
          {
            name: FIELD_NAMES.WORK_EXPERIENCE.START_DATE,
            type: FIELD_TYPES.DATE_MONTH,
            value: 'Jan 2020',
          },
          {
            name: FIELD_NAMES.WORK_EXPERIENCE.END_DATE,
            type: FIELD_TYPES.DATE_MONTH,
            value: 'Present',
          },
          {
            name: FIELD_NAMES.WORK_EXPERIENCE.CITY,
            type: FIELD_TYPES.STRING,
            value: 'New York, NY',
          },
          {
            name: FIELD_NAMES.WORK_EXPERIENCE.DESCRIPTION,
            type: FIELD_TYPES.RICH_TEXT,
            value:
              '<ul><li>Led cross-functional teams in implementing strategic initiatives</li><li>Improved operational efficiency by 25% through process optimization</li><li>Managed client relationships resulting in 40% revenue growth</li></ul>',
          },
        ],
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
        fields: [
          {
            name: FIELD_NAMES.EDUCATION.SCHOOL,
            type: FIELD_TYPES.STRING,
            value: 'University of Pennsylvania',
          },
          {
            name: FIELD_NAMES.EDUCATION.DEGREE,
            type: FIELD_TYPES.STRING,
            value: 'Bachelor of Science in Business Administration',
          },
          {
            name: FIELD_NAMES.EDUCATION.START_DATE,
            type: FIELD_TYPES.DATE_MONTH,
            value: 'Sep 2014',
          },
          {
            name: FIELD_NAMES.EDUCATION.END_DATE,
            type: FIELD_TYPES.DATE_MONTH,
            value: 'May 2018',
          },
          {
            name: FIELD_NAMES.EDUCATION.CITY,
            type: FIELD_TYPES.STRING,
            value: 'Philadelphia, PA',
          },
          {
            name: FIELD_NAMES.EDUCATION.DESCRIPTION,
            type: FIELD_TYPES.RICH_TEXT,
            value:
              '<p><strong>Core Skills:</strong> Project Management, Strategic Planning, Business Analysis</p><p><strong>Tools:</strong> MS Office Suite, Tableau, Salesforce</p><p><strong>Soft Skills:</strong> Leadership, Communication, Problem Solving</p>',
          },
        ],
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
        fields: [
          {
            name: FIELD_NAMES.SKILLS.SKILL,
            type: FIELD_TYPES.STRING,
            value: '',
          },
          {
            name: FIELD_NAMES.SKILLS.EXPERIENCE_LEVEL,
            type: FIELD_TYPES.STRING,
            value: '',
          },
        ],
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
        fields: [
          {
            name: FIELD_NAMES.CUSTOM.ACTIVITY_NAME,
            value: '',
            type: FIELD_TYPES.STRING,
            placeholder: '',
          },
          {
            name: FIELD_NAMES.CUSTOM.CITY,
            value: '',
            type: FIELD_TYPES.STRING,
            placeholder: '',
          },
          {
            name: FIELD_NAMES.CUSTOM.START_DATE,
            value: '',
            type: FIELD_TYPES.DATE_MONTH,
            placeholder: '',
          },
          {
            name: FIELD_NAMES.CUSTOM.END_DATE,
            value: '',
            type: FIELD_TYPES.DATE_MONTH,
            placeholder: '',
          },
          {
            name: FIELD_NAMES.CUSTOM.DESCRIPTION,
            value:
              '<p><strong>Business Analysis Tools:</strong> Microsoft Excel, Tableau, Power BI, SQL, JIRA.<br><strong>Requirements Gathering:</strong> Stakeholder Interviews, Surveys, Workshops, Use Cases, User Stories.<br><strong>Process Improvement:</strong> Lean Six Sigma, Process Mapping, Root Cause Analysis, Workflow Optimization.<br><strong>Project Management:</strong> Agile, Scrum, Waterfall, Risk Management, Change Management.</p>',
            type: FIELD_TYPES.RICH_TEXT,
            placeholder: '',
          },
        ],
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
        fields: [
          {
            name: FIELD_NAMES.PERSONAL_DETAILS.WANTED_JOB_TITLE,
            type: FIELD_TYPES.STRING,
            value: 'Software Engineer',
          },
          {
            name: FIELD_NAMES.PERSONAL_DETAILS.FIRST_NAME,
            type: FIELD_TYPES.STRING,
            value: 'Alex',
          },
          {
            name: FIELD_NAMES.PERSONAL_DETAILS.LAST_NAME,
            type: FIELD_TYPES.STRING,
            value: 'Chen',
          },
          {
            name: FIELD_NAMES.PERSONAL_DETAILS.EMAIL,
            type: FIELD_TYPES.STRING,
            value: 'alex.chen@email.com',
          },
          {
            name: FIELD_NAMES.PERSONAL_DETAILS.PHONE,
            type: FIELD_TYPES.STRING,
            value: '+1 (555) 987-6543',
          },
          {
            name: FIELD_NAMES.PERSONAL_DETAILS.CITY,
            type: FIELD_TYPES.STRING,
            value: 'San Francisco, CA',
          },
        ],
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
        fields: [
          {
            name: FIELD_NAMES.SUMMARY.SUMMARY,
            type: FIELD_TYPES.RICH_TEXT,
            value:
              '<p>Innovative Software Engineer with expertise in full-stack development and cloud architecture. Passionate about building scalable solutions and implementing cutting-edge technologies.</p>',
          },
        ],
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
        fields: [
          {
            name: FIELD_NAMES.WORK_EXPERIENCE.JOB_TITLE,
            type: FIELD_TYPES.STRING,
            value: 'Senior Software Engineer',
          },
          {
            name: FIELD_NAMES.WORK_EXPERIENCE.EMPLOYER,
            type: FIELD_TYPES.STRING,
            value: 'Tech Innovations Inc.',
          },
          {
            name: FIELD_NAMES.WORK_EXPERIENCE.START_DATE,
            type: FIELD_TYPES.DATE_MONTH,
            value: 'Mar 2019',
          },
          {
            name: FIELD_NAMES.WORK_EXPERIENCE.END_DATE,
            type: FIELD_TYPES.DATE_MONTH,
            value: 'Present',
          },
          {
            name: FIELD_NAMES.WORK_EXPERIENCE.CITY,
            type: FIELD_TYPES.STRING,
            value: 'San Francisco, CA',
          },
          {
            name: FIELD_NAMES.WORK_EXPERIENCE.DESCRIPTION,
            type: FIELD_TYPES.RICH_TEXT,
            value:
              '<ul><li>Architected and implemented microservices using Kubernetes and Docker</li><li>Optimized application performance resulting in 50% reduction in load times</li><li>Led migration to cloud infrastructure using AWS and Terraform</li></ul>',
          },
        ],
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
        fields: [
          {
            name: FIELD_NAMES.EDUCATION.SCHOOL,
            type: FIELD_TYPES.STRING,
            value: 'Stanford University',
          },
          {
            name: FIELD_NAMES.EDUCATION.DEGREE,
            type: FIELD_TYPES.STRING,
            value: 'Master of Science in Computer Science',
          },
          {
            name: FIELD_NAMES.EDUCATION.START_DATE,
            type: FIELD_TYPES.DATE_MONTH,
            value: 'Sep 2016',
          },
          {
            name: FIELD_NAMES.EDUCATION.END_DATE,
            type: FIELD_TYPES.DATE_MONTH,
            value: 'Jun 2018',
          },
          {
            name: FIELD_NAMES.EDUCATION.CITY,
            type: FIELD_TYPES.STRING,
            value: 'Stanford, CA',
          },
          {
            name: FIELD_NAMES.EDUCATION.DESCRIPTION,
            type: FIELD_TYPES.RICH_TEXT,
            value:
              '<p><strong>Languages:</strong> Python, JavaScript, Go, Rust</p><p><strong>Technologies:</strong> React, Node.js, GraphQL, Kubernetes</p><p><strong>Cloud & Tools:</strong> AWS, Docker, Terraform, CI/CD</p>',
          },
        ],
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
        fields: [
          {
            name: FIELD_NAMES.SKILLS.SKILL,
            type: FIELD_TYPES.STRING,
            value: '',
          },
          {
            name: FIELD_NAMES.SKILLS.EXPERIENCE_LEVEL,
            type: FIELD_TYPES.STRING,
            value: '',
          },
        ],
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
        fields: [
          {
            name: FIELD_NAMES.CUSTOM.ACTIVITY_NAME,
            value: '',
            type: FIELD_TYPES.STRING,
            placeholder: '',
          },
          {
            name: FIELD_NAMES.CUSTOM.CITY,
            value: '',
            type: FIELD_TYPES.STRING,
            placeholder: '',
          },
          {
            name: FIELD_NAMES.CUSTOM.START_DATE,
            value: '',
            type: FIELD_TYPES.DATE_MONTH,
            placeholder: '',
          },
          {
            name: FIELD_NAMES.CUSTOM.END_DATE,
            value: '',
            type: FIELD_TYPES.DATE_MONTH,
            placeholder: '',
          },
          {
            name: FIELD_NAMES.CUSTOM.DESCRIPTION,
            value:
              '<p><strong>Front-End Development:</strong> HTML, CSS, JavaScript, React, Angular, Vue.js.<br><strong>Back-End Development:</strong> Node.js, Python, Java, Express.js, Django, Spring Boot.<br><strong>Database Management:</strong> SQL (MySQL, PostgreSQL), NoSQL (MongoDB, Firebase).<br><strong>DevOps &amp; Tools:</strong> Git, Docker, Jenkins, AWS, Azure, Heroku.</p>',
            type: FIELD_TYPES.RICH_TEXT,
            placeholder: '',
          },
        ],
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
        fields: [
          {
            name: FIELD_NAMES.PERSONAL_DETAILS.WANTED_JOB_TITLE,
            type: FIELD_TYPES.STRING,
            value: 'UI/UX Designer',
          },
          {
            name: FIELD_NAMES.PERSONAL_DETAILS.FIRST_NAME,
            type: FIELD_TYPES.STRING,
            value: 'Sarah',
          },
          {
            name: FIELD_NAMES.PERSONAL_DETAILS.LAST_NAME,
            type: FIELD_TYPES.STRING,
            value: 'Parker',
          },
          {
            name: FIELD_NAMES.PERSONAL_DETAILS.EMAIL,
            type: FIELD_TYPES.STRING,
            value: 'sarah.parker@email.com',
          },
          {
            name: FIELD_NAMES.PERSONAL_DETAILS.PHONE,
            type: FIELD_TYPES.STRING,
            value: '+1 (555) 456-7890',
          },
          {
            name: FIELD_NAMES.PERSONAL_DETAILS.CITY,
            type: FIELD_TYPES.STRING,
            value: 'Los Angeles, CA',
          },
        ],
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
        fields: [
          {
            name: FIELD_NAMES.SUMMARY.SUMMARY,
            type: FIELD_TYPES.RICH_TEXT,
            value:
              '<p>Creative UI/UX Designer with a passion for crafting intuitive and visually stunning digital experiences. Combining artistic vision with user-centered design principles.</p>',
          },
        ],
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
        fields: [
          {
            name: FIELD_NAMES.WORK_EXPERIENCE.JOB_TITLE,
            type: FIELD_TYPES.STRING,
            value: 'Senior UI/UX Designer',
          },
          {
            name: FIELD_NAMES.WORK_EXPERIENCE.EMPLOYER,
            type: FIELD_TYPES.STRING,
            value: 'Creative Design Studio',
          },
          {
            name: FIELD_NAMES.WORK_EXPERIENCE.START_DATE,
            type: FIELD_TYPES.DATE_MONTH,
            value: 'Jun 2019',
          },
          {
            name: FIELD_NAMES.WORK_EXPERIENCE.END_DATE,
            type: FIELD_TYPES.DATE_MONTH,
            value: 'Present',
          },
          {
            name: FIELD_NAMES.WORK_EXPERIENCE.CITY,
            type: FIELD_TYPES.STRING,
            value: 'Los Angeles, CA',
          },
          {
            name: FIELD_NAMES.WORK_EXPERIENCE.DESCRIPTION,
            type: FIELD_TYPES.RICH_TEXT,
            value:
              '<ul><li>Redesigned flagship product increasing user engagement by 75%</li><li>Created innovative design system used across multiple platforms</li><li>Led user research and testing for major feature launches</li></ul>',
          },
        ],
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
        fields: [
          {
            name: FIELD_NAMES.EDUCATION.SCHOOL,
            type: FIELD_TYPES.STRING,
            value: 'Rhode Island School of Design',
          },
          {
            name: FIELD_NAMES.EDUCATION.DEGREE,
            type: FIELD_TYPES.STRING,
            value: 'Bachelor of Fine Arts in Graphic Design',
          },
          {
            name: FIELD_NAMES.EDUCATION.START_DATE,
            type: FIELD_TYPES.DATE_MONTH,
            value: 'Sep 2015',
          },
          {
            name: FIELD_NAMES.EDUCATION.END_DATE,
            type: FIELD_TYPES.DATE_MONTH,
            value: 'May 2019',
          },
          {
            name: FIELD_NAMES.EDUCATION.CITY,
            type: FIELD_TYPES.STRING,
            value: 'Providence, RI',
          },
          {
            name: FIELD_NAMES.EDUCATION.DESCRIPTION,
            type: FIELD_TYPES.RICH_TEXT,
            value:
              '<p><strong>Design:</strong> UI/UX, Visual Design, Interaction Design</p><p><strong>Tools:</strong> Figma, Adobe Creative Suite, Sketch</p><p><strong>Skills:</strong> Prototyping, User Research, Design Systems</p>',
          },
        ],
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
        fields: [
          {
            name: FIELD_NAMES.SKILLS.SKILL,
            type: FIELD_TYPES.STRING,
            value: '',
          },
          {
            name: FIELD_NAMES.SKILLS.EXPERIENCE_LEVEL,
            type: FIELD_TYPES.STRING,
            value: '',
          },
        ],
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
        fields: [
          {
            name: FIELD_NAMES.CUSTOM.ACTIVITY_NAME,
            value: '',
            type: FIELD_TYPES.STRING,
            placeholder: '',
          },
          {
            name: FIELD_NAMES.CUSTOM.CITY,
            value: '',
            type: FIELD_TYPES.STRING,
            placeholder: '',
          },
          {
            name: FIELD_NAMES.CUSTOM.START_DATE,
            value: '',
            type: FIELD_TYPES.DATE_MONTH,
            placeholder: '',
          },
          {
            name: FIELD_NAMES.CUSTOM.END_DATE,
            value: '',
            type: FIELD_TYPES.DATE_MONTH,
            placeholder: '',
          },
          {
            name: FIELD_NAMES.CUSTOM.DESCRIPTION,
            value:
              '<p><strong>Design Tools:</strong> Adobe XD, Sketch, Figma, InVision, Axure.<br><strong>Prototyping &amp; Wireframing:</strong> Low-Fidelity Wireframes, High-Fidelity Prototypes, User Flows, Storyboards.<br><strong>User Research:</strong> User Interviews, Surveys, Usability Testing, A/B Testing, Personas.<br><strong>Information Architecture:</strong> Site Mapping, Card Sorting, Content Strategy, Navigation Design.</p>',
            type: FIELD_TYPES.RICH_TEXT,
            placeholder: '',
          },
        ],
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
