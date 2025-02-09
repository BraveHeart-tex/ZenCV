import { DEX_Document } from '../client-db/clientDbSchema';
import { FIELD_NAMES } from '../stores/documentBuilder/documentBuilder.constants';
import { ValueOf } from '../types/utils.types';

// TODO: REFACTOR THESE WITH CONSTANT AND RE-USABLE ITEMS / FIELDS

export const PREFILL_RESUME_STYLES = {
  STANDARD: 'standard',
  CREATIVE: 'creative',
  TECH_FOCUSED: 'tech-focused',
} as const;

export type PrefilledResumeStyle = ValueOf<typeof PREFILL_RESUME_STYLES>;

import { SectionWithFields } from '../client-db/clientDbSchema';

interface PrefilledTemplate {
  sections: SectionWithFields[];
}

const getStandardTemplate = (
  documentId: DEX_Document['id'],
): PrefilledTemplate => ({
  sections: [
    {
      title: 'Personal Details',
      defaultTitle: 'Personal Details',
      displayOrder: 1,
      documentId,
      metadata: '',
      type: 'personal-details',
      items: [
        {
          containerType: 'static',
          displayOrder: 1,
          fields: [
            {
              name: FIELD_NAMES.PERSONAL_DETAILS.WANTED_JOB_TITLE,
              type: 'string',
              value: 'Business Professional',
            },
            {
              name: FIELD_NAMES.PERSONAL_DETAILS.FIRST_NAME,
              type: 'string',
              value: 'John',
            },
            {
              name: FIELD_NAMES.PERSONAL_DETAILS.LAST_NAME,
              type: 'string',
              value: 'Smith',
            },
            {
              name: FIELD_NAMES.PERSONAL_DETAILS.EMAIL,
              type: 'string',
              value: 'john.smith@email.com',
            },
            {
              name: FIELD_NAMES.PERSONAL_DETAILS.PHONE,
              type: 'string',
              value: '+1 (555) 123-4567',
            },
            {
              name: FIELD_NAMES.PERSONAL_DETAILS.CITY,
              type: 'string',
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
      type: 'summary',
      documentId,
      items: [
        {
          containerType: 'static',
          displayOrder: 1,
          fields: [
            {
              name: FIELD_NAMES.SUMMARY.SUMMARY,
              type: 'rich-text',
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
      type: 'work-experience',
      documentId,
      items: [
        {
          containerType: 'collapsible',
          displayOrder: 1,
          fields: [
            {
              name: FIELD_NAMES.WORK_EXPERIENCE.JOB_TITLE,
              type: 'string',
              value: 'Senior Business Analyst',
            },
            {
              name: FIELD_NAMES.WORK_EXPERIENCE.EMPLOYER,
              type: 'string',
              value: 'Global Solutions Corp.',
            },
            {
              name: FIELD_NAMES.WORK_EXPERIENCE.START_DATE,
              type: 'date-month',
              value: 'Jan 2020',
            },
            {
              name: FIELD_NAMES.WORK_EXPERIENCE.END_DATE,
              type: 'date-month',
              value: 'Present',
            },
            {
              name: FIELD_NAMES.WORK_EXPERIENCE.CITY,
              type: 'string',
              value: 'New York, NY',
            },
            {
              name: FIELD_NAMES.WORK_EXPERIENCE.DESCRIPTION,
              type: 'rich-text',
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
          containerType: 'collapsible',
          displayOrder: 1,
          fields: [
            {
              name: FIELD_NAMES.EDUCATION.SCHOOL,
              type: 'string',
              value: 'University of Pennsylvania',
            },
            {
              name: FIELD_NAMES.EDUCATION.DEGREE,
              type: 'string',
              value: 'Bachelor of Science in Business Administration',
            },
            {
              name: FIELD_NAMES.EDUCATION.START_DATE,
              type: 'date-month',
              value: 'Sep 2014',
            },
            {
              name: FIELD_NAMES.EDUCATION.END_DATE,
              type: 'date-month',
              value: 'May 2018',
            },
            {
              name: FIELD_NAMES.EDUCATION.CITY,
              type: 'string',
              value: 'Philadelphia, PA',
            },
            {
              name: FIELD_NAMES.EDUCATION.DESCRIPTION,
              type: 'rich-text',
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
      type: 'skills',
      items: [
        {
          containerType: 'static',
          displayOrder: 1,
          fields: [],
        },
      ],
    },
  ],
});

const getTechFocusedTemplate = (
  documentId: DEX_Document['id'],
): PrefilledTemplate => ({
  sections: [
    {
      title: 'Personal Details',
      defaultTitle: 'Personal Details',
      displayOrder: 1,
      documentId,
      metadata: '',
      type: 'personal-details',
      items: [
        {
          containerType: 'static',
          displayOrder: 1,
          fields: [
            {
              name: FIELD_NAMES.PERSONAL_DETAILS.WANTED_JOB_TITLE,
              type: 'string',
              value: 'Software Engineer',
            },
            {
              name: FIELD_NAMES.PERSONAL_DETAILS.FIRST_NAME,
              type: 'string',
              value: 'Alex',
            },
            {
              name: FIELD_NAMES.PERSONAL_DETAILS.LAST_NAME,
              type: 'string',
              value: 'Chen',
            },
            {
              name: FIELD_NAMES.PERSONAL_DETAILS.EMAIL,
              type: 'string',
              value: 'alex.chen@email.com',
            },
            {
              name: FIELD_NAMES.PERSONAL_DETAILS.PHONE,
              type: 'string',
              value: '+1 (555) 987-6543',
            },
            {
              name: FIELD_NAMES.PERSONAL_DETAILS.CITY,
              type: 'string',
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
      type: 'summary',
      items: [
        {
          containerType: 'static',
          displayOrder: 1,
          fields: [
            {
              name: FIELD_NAMES.SUMMARY.SUMMARY,
              type: 'rich-text',
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
      type: 'work-experience',
      documentId,
      items: [
        {
          containerType: 'collapsible',
          displayOrder: 1,
          fields: [
            {
              name: FIELD_NAMES.WORK_EXPERIENCE.JOB_TITLE,
              type: 'string',
              value: 'Senior Software Engineer',
            },
            {
              name: FIELD_NAMES.WORK_EXPERIENCE.EMPLOYER,
              type: 'string',
              value: 'Tech Innovations Inc.',
            },
            {
              name: FIELD_NAMES.WORK_EXPERIENCE.START_DATE,
              type: 'date-month',
              value: 'Mar 2019',
            },
            {
              name: FIELD_NAMES.WORK_EXPERIENCE.END_DATE,
              type: 'date-month',
              value: 'Present',
            },
            {
              name: FIELD_NAMES.WORK_EXPERIENCE.CITY,
              type: 'string',
              value: 'San Francisco, CA',
            },
            {
              name: FIELD_NAMES.WORK_EXPERIENCE.DESCRIPTION,
              type: 'rich-text',
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
          containerType: 'collapsible',
          displayOrder: 1,
          fields: [
            {
              name: FIELD_NAMES.EDUCATION.SCHOOL,
              type: 'string',
              value: 'Stanford University',
            },
            {
              name: FIELD_NAMES.EDUCATION.DEGREE,
              type: 'string',
              value: 'Master of Science in Computer Science',
            },
            {
              name: FIELD_NAMES.EDUCATION.START_DATE,
              type: 'date-month',
              value: 'Sep 2016',
            },
            {
              name: FIELD_NAMES.EDUCATION.END_DATE,
              type: 'date-month',
              value: 'Jun 2018',
            },
            {
              name: FIELD_NAMES.EDUCATION.CITY,
              type: 'string',
              value: 'Stanford, CA',
            },
            {
              name: FIELD_NAMES.EDUCATION.DESCRIPTION,
              type: 'rich-text',
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
      type: 'skills',
      items: [
        {
          containerType: 'static',
          displayOrder: 1,
          fields: [],
        },
      ],
    },
  ],
});

const getCreativeTemplate = (
  documentId: DEX_Document['id'],
): PrefilledTemplate => ({
  sections: [
    {
      title: 'Personal Details',
      defaultTitle: 'Personal Details',
      displayOrder: 1,
      metadata: '',
      type: 'personal-details',
      documentId,
      items: [
        {
          containerType: 'static',
          displayOrder: 1,
          fields: [
            {
              name: FIELD_NAMES.PERSONAL_DETAILS.WANTED_JOB_TITLE,
              type: 'string',
              value: 'UI/UX Designer',
            },
            {
              name: FIELD_NAMES.PERSONAL_DETAILS.FIRST_NAME,
              type: 'string',
              value: 'Sarah',
            },
            {
              name: FIELD_NAMES.PERSONAL_DETAILS.LAST_NAME,
              type: 'string',
              value: 'Parker',
            },
            {
              name: FIELD_NAMES.PERSONAL_DETAILS.EMAIL,
              type: 'string',
              value: 'sarah.parker@email.com',
            },
            {
              name: FIELD_NAMES.PERSONAL_DETAILS.PHONE,
              type: 'string',
              value: '+1 (555) 456-7890',
            },
            {
              name: FIELD_NAMES.PERSONAL_DETAILS.CITY,
              type: 'string',
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
      type: 'summary',
      documentId,
      items: [
        {
          containerType: 'static',
          displayOrder: 1,
          fields: [
            {
              name: FIELD_NAMES.SUMMARY.SUMMARY,
              type: 'rich-text',
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
      type: 'work-experience',
      documentId,
      items: [
        {
          containerType: 'collapsible',
          displayOrder: 1,
          fields: [
            {
              name: FIELD_NAMES.WORK_EXPERIENCE.JOB_TITLE,
              type: 'string',
              value: 'Senior UI/UX Designer',
            },
            {
              name: FIELD_NAMES.WORK_EXPERIENCE.EMPLOYER,
              type: 'string',
              value: 'Creative Design Studio',
            },
            {
              name: FIELD_NAMES.WORK_EXPERIENCE.START_DATE,
              type: 'date-month',
              value: 'Jun 2019',
            },
            {
              name: FIELD_NAMES.WORK_EXPERIENCE.END_DATE,
              type: 'date-month',
              value: 'Present',
            },
            {
              name: FIELD_NAMES.WORK_EXPERIENCE.CITY,
              type: 'string',
              value: 'Los Angeles, CA',
            },
            {
              name: FIELD_NAMES.WORK_EXPERIENCE.DESCRIPTION,
              type: 'rich-text',
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
      type: 'education',
      documentId,
      items: [
        {
          containerType: 'collapsible',
          displayOrder: 1,
          fields: [
            {
              name: FIELD_NAMES.EDUCATION.SCHOOL,
              type: 'string',
              value: 'Rhode Island School of Design',
            },
            {
              name: FIELD_NAMES.EDUCATION.DEGREE,
              type: 'string',
              value: 'Bachelor of Fine Arts in Graphic Design',
            },
            {
              name: FIELD_NAMES.EDUCATION.START_DATE,
              type: 'date-month',
              value: 'Sep 2015',
            },
            {
              name: FIELD_NAMES.EDUCATION.END_DATE,
              type: 'date-month',
              value: 'May 2019',
            },
            {
              name: FIELD_NAMES.EDUCATION.CITY,
              type: 'string',
              value: 'Providence, RI',
            },
            {
              name: FIELD_NAMES.EDUCATION.DESCRIPTION,
              type: 'rich-text',
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
      type: 'custom',
      items: [
        {
          containerType: 'static',
          displayOrder: 1,
          fields: [],
        },
      ],
    },
  ],
});

export const getTemplateByStyle = (
  style: PrefilledResumeStyle,
  documentId: DEX_Document['id'],
): PrefilledTemplate => {
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
