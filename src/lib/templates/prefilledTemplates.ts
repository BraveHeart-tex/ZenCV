import {
  DEX_InsertFieldModel,
  DEX_InsertItemModel,
  DEX_Section,
} from '../client-db/clientDbSchema';
import { FIELD_NAMES } from '../stores/documentBuilder/documentBuilder.constants';
import { ValueOf } from '../types/utils.types';

export const PREFILL_RESUME_STYLES = {
  STANDARD: 'standard',
  CREATIVE: 'creative',
  TECH_FOCUSED: 'tech-focused',
} as const;

export type PrefilledResumeStyle = ValueOf<typeof PREFILL_RESUME_STYLES>;

interface PrefilledTemplate {
  sections: Omit<DEX_Section, 'id' | 'documentId'>[];
  items: Omit<DEX_InsertItemModel, 'sectionId'>[];
  fields: Omit<DEX_InsertFieldModel, 'itemId'>[];
}

const standardTemplate: PrefilledTemplate = {
  sections: [
    {
      defaultTitle: 'Personal Details',
      title: 'Personal Details',
      displayOrder: 1,
      metadata: '',
      type: 'personal-details',
    },
    {
      defaultTitle: 'Summary',
      title: 'Summary',
      displayOrder: 2,
      metadata: '',
      type: 'summary',
    },
    {
      defaultTitle: 'Work Experience',
      title: 'Work Experience',
      displayOrder: 3,
      metadata: '',
      type: 'work-experience',
    },
    {
      defaultTitle: 'Education',
      title: 'Education',
      displayOrder: 4,
      metadata: '',
      type: 'education',
    },
    {
      defaultTitle: 'Skills',
      title: 'Skills',
      displayOrder: 5,
      metadata: '',
      type: 'skills',
    },
  ],
  items: [
    { containerType: 'static', displayOrder: 1 },
    { containerType: 'static', displayOrder: 1 },
    { containerType: 'collapsible', displayOrder: 1 },
    { containerType: 'collapsible', displayOrder: 1 },
    { containerType: 'static', displayOrder: 1 },
  ],
  fields: [
    {
      name: 'Wanted Job Title',
      type: 'string',
      value: 'Business Professional',
    },
    { name: 'First Name', type: 'string', value: 'John' },
    { name: 'Last Name', type: 'string', value: 'Smith' },
    { name: 'Email', type: 'string', value: 'john.smith@email.com' },
    { name: 'Phone', type: 'string', value: '+1 (555) 123-4567' },
    { name: 'City', type: 'string', value: 'New York, NY' },
    {
      name: 'Summary',
      type: 'rich-text',
      value:
        '<p>Results-driven professional with 5+ years of experience in business development and project management. Proven track record of leading successful initiatives and driving organizational growth.</p>',
    },
    { name: 'Job Title', type: 'string', value: 'Senior Business Analyst' },
    { name: 'Employer', type: 'string', value: 'Global Solutions Corp.' },
    { name: 'Start Date', type: 'date-month', value: 'Jan 2020' },
    { name: 'End Date', type: 'date-month', value: 'Present' },
    { name: 'City', type: 'string', value: 'New York, NY' },
    {
      name: 'Description',
      type: 'rich-text',
      value:
        '<ul><li>Led cross-functional teams in implementing strategic initiatives</li><li>Improved operational efficiency by 25% through process optimization</li><li>Managed client relationships resulting in 40% revenue growth</li></ul>',
    },
    { name: 'School', type: 'string', value: 'University of Pennsylvania' },
    {
      name: 'Degree',
      type: 'string',
      value: 'Bachelor of Science in Business Administration',
    },
    { name: 'Start Date', type: 'date-month', value: 'Sep 2014' },
    { name: 'End Date', type: 'date-month', value: 'May 2018' },
    { name: 'City', type: 'string', value: 'Philadelphia, PA' },
    {
      name: FIELD_NAMES.CUSTOM.DESCRIPTION,
      type: 'rich-text',
      value:
        '<p><strong>Core Skills:</strong> Project Management, Strategic Planning, Business Analysis</p><p><strong>Tools:</strong> MS Office Suite, Tableau, Salesforce</p><p><strong>Soft Skills:</strong> Leadership, Communication, Problem Solving</p>',
    },
  ],
};

const techFocusedTemplate: PrefilledTemplate = {
  sections: [
    {
      defaultTitle: 'Personal Details',
      title: 'Personal Details',
      displayOrder: 1,
      metadata: '',
      type: 'personal-details',
    },
    {
      defaultTitle: 'Summary',
      title: 'Summary',
      displayOrder: 2,
      metadata: '',
      type: 'summary',
    },
    {
      defaultTitle: 'Work Experience',
      title: 'Work Experience',
      displayOrder: 3,
      metadata: '',
      type: 'work-experience',
    },
    {
      defaultTitle: 'Education',
      title: 'Education',
      displayOrder: 4,
      metadata: '',
      type: 'education',
    },
    {
      defaultTitle: 'Skills',
      title: 'Skills',
      displayOrder: 5,
      metadata: '',
      type: 'skills',
    },
  ],
  items: [
    { containerType: 'static', displayOrder: 1 },
    { containerType: 'static', displayOrder: 1 },
    { containerType: 'collapsible', displayOrder: 1 },
    { containerType: 'collapsible', displayOrder: 1 },
    { containerType: 'static', displayOrder: 1 },
  ],
  fields: [
    { name: 'Wanted Job Title', type: 'string', value: 'Software Engineer' },
    { name: 'First Name', type: 'string', value: 'Alex' },
    { name: 'Last Name', type: 'string', value: 'Chen' },
    { name: 'Email', type: 'string', value: 'alex.chen@email.com' },
    { name: 'Phone', type: 'string', value: '+1 (555) 987-6543' },
    { name: 'City', type: 'string', value: 'San Francisco, CA' },
    {
      name: 'Summary',
      type: 'rich-text',
      value:
        '<p>Innovative Software Engineer with expertise in full-stack development and cloud architecture. Passionate about building scalable solutions and implementing cutting-edge technologies.</p>',
    },
    { name: 'Job Title', type: 'string', value: 'Senior Software Engineer' },
    { name: 'Employer', type: 'string', value: 'Tech Innovations Inc.' },
    { name: 'Start Date', type: 'date-month', value: 'Mar 2019' },
    { name: 'End Date', type: 'date-month', value: 'Present' },
    { name: 'City', type: 'string', value: 'San Francisco, CA' },
    {
      name: 'Description',
      type: 'rich-text',
      value:
        '<ul><li>Architected and implemented microservices using Kubernetes and Docker</li><li>Optimized application performance resulting in 50% reduction in load times</li><li>Led migration to cloud infrastructure using AWS and Terraform</li></ul>',
    },
    { name: 'School', type: 'string', value: 'Stanford University' },
    {
      name: 'Degree',
      type: 'string',
      value: 'Master of Science in Computer Science',
    },
    { name: 'Start Date', type: 'date-month', value: 'Sep 2016' },
    { name: 'End Date', type: 'date-month', value: 'Jun 2018' },
    { name: 'City', type: 'string', value: 'Stanford, CA' },
    {
      name: FIELD_NAMES.CUSTOM.DESCRIPTION,
      type: 'rich-text',
      value:
        '<p><strong>Languages:</strong> Python, JavaScript, Go, Rust</p><p><strong>Technologies:</strong> React, Node.js, GraphQL, Kubernetes</p><p><strong>Cloud & Tools:</strong> AWS, Docker, Terraform, CI/CD</p>',
    },
  ],
};

const creativeTemplate: PrefilledTemplate = {
  sections: [
    {
      defaultTitle: 'Personal Details',
      title: 'Personal Details',
      displayOrder: 1,
      metadata: '',
      type: 'personal-details',
    },
    {
      defaultTitle: 'Summary',
      title: 'Summary',
      displayOrder: 2,
      metadata: '',
      type: 'summary',
    },
    {
      defaultTitle: 'Work Experience',
      title: 'Work Experience',
      displayOrder: 3,
      metadata: '',
      type: 'work-experience',
    },
    {
      defaultTitle: 'Education',
      title: 'Education',
      displayOrder: 4,
      metadata: '',
      type: 'education',
    },
    {
      defaultTitle: 'Custom Section',
      title: 'Skills',
      displayOrder: 5,
      metadata: '',
      type: 'custom',
    },
  ],
  items: [
    { containerType: 'static', displayOrder: 1 },
    { containerType: 'static', displayOrder: 1 },
    { containerType: 'collapsible', displayOrder: 1 },
    { containerType: 'collapsible', displayOrder: 1 },
    { containerType: 'static', displayOrder: 1 },
  ],
  fields: [
    { name: 'Wanted Job Title', type: 'string', value: 'UI/UX Designer' },
    { name: 'First Name', type: 'string', value: 'Sarah' },
    { name: 'Last Name', type: 'string', value: 'Parker' },
    { name: 'Email', type: 'string', value: 'sarah.parker@email.com' },
    { name: 'Phone', type: 'string', value: '+1 (555) 456-7890' },
    { name: 'City', type: 'string', value: 'Los Angeles, CA' },
    {
      name: 'Summary',
      type: 'rich-text',
      value:
        '<p>Creative UI/UX Designer with a passion for crafting intuitive and visually stunning digital experiences. Combining artistic vision with user-centered design principles.</p>',
    },
    { name: 'Job Title', type: 'string', value: 'Senior UI/UX Designer' },
    { name: 'Employer', type: 'string', value: 'Creative Design Studio' },
    { name: 'Start Date', type: 'date-month', value: 'Jun 2019' },
    { name: 'End Date', type: 'date-month', value: 'Present' },
    { name: 'City', type: 'string', value: 'Los Angeles, CA' },
    {
      name: 'Description',
      type: 'rich-text',
      value:
        '<ul><li>Redesigned flagship product increasing user engagement by 75%</li><li>Created innovative design system used across multiple platforms</li><li>Led user research and testing for major feature launches</li></ul>',
    },
    { name: 'School', type: 'string', value: 'Rhode Island School of Design' },
    {
      name: 'Degree',
      type: 'string',
      value: 'Bachelor of Fine Arts in Graphic Design',
    },
    { name: 'Start Date', type: 'date-month', value: 'Sep 2015' },
    { name: 'End Date', type: 'date-month', value: 'May 2019' },
    { name: 'City', type: 'string', value: 'Providence, RI' },
    {
      name: FIELD_NAMES.CUSTOM.DESCRIPTION,
      type: 'rich-text',
      value:
        '<p><strong>Design:</strong> UI/UX, Visual Design, Interaction Design</p><p><strong>Tools:</strong> Figma, Adobe Creative Suite, Sketch</p><p><strong>Skills:</strong> Prototyping, User Research, Design Systems</p>',
    },
  ],
};

export const getTemplateByStyle = (
  style: PrefilledResumeStyle,
): PrefilledTemplate => {
  switch (style) {
    case PREFILL_RESUME_STYLES.STANDARD:
      return standardTemplate;
    case PREFILL_RESUME_STYLES.TECH_FOCUSED:
      return techFocusedTemplate;
    case PREFILL_RESUME_STYLES.CREATIVE:
      return creativeTemplate;
    default:
      return standardTemplate;
  }
};
