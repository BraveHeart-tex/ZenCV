import { CONTAINER_TYPES, DEX_Document } from '@/lib/client-db/clientDbSchema';
import { INTERNAL_SECTION_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { DeepOmit, ValueOf } from '@/lib/types/utils.types';
import { SectionWithFields } from '@/lib/client-db/clientDbSchema';
import { getInsertTemplatesWithValues } from '@/lib/misc/fieldTemplates';

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

const getStandardTemplate = (
  documentId: DEX_Document['id'],
): DeepOmit<SectionWithFields, 'displayOrder'>[] => [
  {
    title: 'Personal Details',
    defaultTitle: 'Personal Details',
    documentId,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
    items: [
      {
        containerType: CONTAINER_TYPES.STATIC,
        fields: getInsertTemplatesWithValues('PERSONAL_DETAILS', {
          WANTED_JOB_TITLE: 'Senior Business Analyst',
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
    metadata: '',
    type: INTERNAL_SECTION_TYPES.SUMMARY,
    documentId,
    items: [
      {
        containerType: CONTAINER_TYPES.STATIC,
        fields: getInsertTemplatesWithValues('SUMMARY', {
          SUMMARY:
            '<p>Detail-oriented Senior Business Analyst with over 7 years of experience in driving business solutions and enhancing operational efficiency. Proven expertise in stakeholder engagement, data analysis, and project management. Adept at translating complex business requirements into actionable strategies, leading to significant cost savings and improved performance. Committed to fostering collaboration across teams to achieve organizational goals and deliver exceptional results.</p>',
        }),
      },
    ],
  },
  {
    title: 'Work Experience',
    defaultTitle: 'Work Experience',
    metadata: '',
    type: INTERNAL_SECTION_TYPES.WORK_EXPERIENCE,
    documentId,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        fields: getInsertTemplatesWithValues('WORK_EXPERIENCE', {
          JOB_TITLE: 'Senior Business Analyst',
          EMPLOYER: 'Global Solutions Corp.',
          START_DATE: 'Jan 2020',
          END_DATE: 'Present',
          CITY: 'New York, NY',
          DESCRIPTION:
            '<ul><li>Led cross-functional teams in implementing strategic initiatives, resulting in a 30% increase in project delivery speed.</li><li>Conducted comprehensive data analysis to identify trends and insights, driving a 20% improvement in operational efficiency.</li><li>Facilitated workshops with stakeholders to gather requirements and ensure alignment with business objectives.</li></ul>',
        }),
      },
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        fields: getInsertTemplatesWithValues('WORK_EXPERIENCE', {
          JOB_TITLE: 'Business Analyst',
          EMPLOYER: 'Tech Innovations LLC',
          START_DATE: 'Jun 2017',
          END_DATE: 'Dec 2019',
          CITY: 'New York, NY',
          DESCRIPTION:
            '<ul><li>Analyzed business processes and identified areas for improvement, leading to a 15% reduction in operational costs.</li><li>Developed and maintained project documentation, including business requirements and functional specifications.</li><li>Collaborated with IT teams to implement software solutions that enhanced data reporting capabilities.</li></ul>',
        }),
      },
    ],
  },
  {
    title: 'Education',
    defaultTitle: 'Education',
    documentId,
    metadata: '',
    type: 'education',
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
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
    title: 'Links',
    defaultTitle: 'Links',
    documentId,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        fields: getInsertTemplatesWithValues('WEBSITES_SOCIAL_LINKS', {
          LABEL: 'Portfolio',
          LINK: 'https://github.com/BraveHeart-tex',
        }),
      },
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        fields: getInsertTemplatesWithValues('WEBSITES_SOCIAL_LINKS', {
          LABEL: 'LinkedIn',
          LINK: 'https://www.linkedin.com/in/bora-karaca',
        }),
      },
    ],
  },
  {
    title: 'Skills',
    defaultTitle: 'Skills',
    documentId,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.SKILLS,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
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
    documentId,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.CUSTOM,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
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
): DeepOmit<SectionWithFields, 'displayOrder'>[] => [
  {
    title: 'Personal Details',
    defaultTitle: 'Personal Details',
    documentId,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
    items: [
      {
        containerType: CONTAINER_TYPES.STATIC,
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
    metadata: '',
    documentId,
    type: INTERNAL_SECTION_TYPES.SUMMARY,
    items: [
      {
        containerType: CONTAINER_TYPES.STATIC,
        fields: getInsertTemplatesWithValues('SUMMARY', {
          SUMMARY:
            '<p>Innovative Software Engineer with over 5 years of experience in full-stack development and cloud architecture. Proven track record in designing scalable applications and optimizing performance. Skilled in leveraging modern technologies to deliver high-quality software solutions. Passionate about continuous learning and collaboration in agile environments to drive project success and enhance user experience.</p>',
        }),
      },
    ],
  },
  {
    title: 'Work Experience',
    defaultTitle: 'Work Experience',
    metadata: '',
    type: INTERNAL_SECTION_TYPES.WORK_EXPERIENCE,
    documentId,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        fields: getInsertTemplatesWithValues('WORK_EXPERIENCE', {
          JOB_TITLE: 'Senior Software Engineer',
          EMPLOYER: 'Tech Innovations Inc.',
          START_DATE: 'Mar 2019',
          END_DATE: 'Present',
          CITY: 'San Francisco, CA',
          DESCRIPTION:
            '<ul><li>Architected and implemented microservices using Kubernetes and Docker, enhancing system scalability and reliability.</li><li>Optimized application performance, resulting in a 50% reduction in load times and improved user satisfaction.</li><li>Led migration to cloud infrastructure using AWS and Terraform, reducing operational costs by 30%.</li></ul>',
        }),
      },
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        fields: getInsertTemplatesWithValues('WORK_EXPERIENCE', {
          JOB_TITLE: 'Software Engineer',
          EMPLOYER: 'Innovative Tech Solutions',
          START_DATE: 'Jun 2017',
          END_DATE: 'Feb 2019',
          CITY: 'San Francisco, CA',
          DESCRIPTION:
            '<ul><li>Developed and maintained web applications using React and Node.js, improving user engagement by 40%.</li><li>Collaborated with cross-functional teams to define project requirements and deliver high-quality software solutions.</li><li>Implemented CI/CD pipelines, reducing deployment times by 60% and increasing release frequency.</li></ul>',
        }),
      },
    ],
  },
  {
    title: 'Education',
    defaultTitle: 'Education',
    documentId,
    metadata: '',
    type: 'education',
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
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
    title: 'Links',
    defaultTitle: 'Links',
    documentId,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        fields: getInsertTemplatesWithValues('WEBSITES_SOCIAL_LINKS', {
          LABEL: 'Github',
          LINK: 'https://github.com/BraveHeart-tex',
        }),
      },
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        fields: getInsertTemplatesWithValues('WEBSITES_SOCIAL_LINKS', {
          LABEL: 'LinkedIn',
          LINK: 'https://www.linkedin.com/in/bora-karaca',
        }),
      },
    ],
  },
  {
    title: 'Skills',
    defaultTitle: 'Skills',
    documentId,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.SKILLS,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
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
    documentId,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.CUSTOM,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        fields: getInsertTemplatesWithValues('CUSTOM', {
          ACTIVITY_NAME: '',
          CITY: '',
          START_DATE: '',
          END_DATE: '',
          DESCRIPTION:
            '<p><strong>Front-End Development:</strong> HTML, CSS, JavaScript, React, Angular, Vue.js.<br><strong>Back-End Development:</strong> Node.js, Python, Java, Express.js, Django, Spring Boot.<br><strong>Database Management:</strong> SQL (MySQL, PostgreSQL), NoSQL (MongoDB, Firebase).<br><strong>DevOps & Tools:</strong> Git, Docker, Jenkins, AWS, Azure, Heroku.</p>',
        }),
      },
    ],
  },
];

const getCreativeTemplate = (
  documentId: DEX_Document['id'],
): DeepOmit<SectionWithFields, 'displayOrder'>[] => [
  {
    title: 'Personal Details',
    defaultTitle: 'Personal Details',
    metadata: '',
    type: INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
    documentId,
    items: [
      {
        containerType: CONTAINER_TYPES.STATIC,
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
    metadata: '',
    type: INTERNAL_SECTION_TYPES.SUMMARY,
    documentId,
    items: [
      {
        containerType: CONTAINER_TYPES.STATIC,
        fields: getInsertTemplatesWithValues('SUMMARY', {
          SUMMARY:
            '<p>Creative UI/UX Designer with over 5 years of experience in crafting intuitive and visually stunning digital experiences. Skilled in user-centered design principles, I excel at transforming complex ideas into engaging interfaces. My passion for design is matched by my commitment to user research and testing, ensuring that every project not only meets aesthetic standards but also enhances usability and user satisfaction.</p>',
        }),
      },
    ],
  },
  {
    title: 'Work Experience',
    defaultTitle: 'Work Experience',
    metadata: '',
    type: INTERNAL_SECTION_TYPES.WORK_EXPERIENCE,
    documentId,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        fields: getInsertTemplatesWithValues('WORK_EXPERIENCE', {
          JOB_TITLE: 'Senior UI/UX Designer',
          EMPLOYER: 'Creative Design Studio',
          START_DATE: 'Jun 2019',
          END_DATE: 'Present',
          CITY: 'Los Angeles, CA',
          DESCRIPTION:
            '<ul><li>Redesigned flagship product, increasing user engagement by 75% through enhanced usability and visual appeal.</li><li>Developed a comprehensive design system adopted across multiple platforms, ensuring consistency and efficiency.</li><li>Led user research and testing initiatives for major feature launches, gathering insights that informed design decisions.</li></ul>',
        }),
      },
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        fields: getInsertTemplatesWithValues('WORK_EXPERIENCE', {
          JOB_TITLE: 'UI/UX Designer',
          EMPLOYER: 'Innovative Web Solutions',
          START_DATE: 'Jul 2017',
          END_DATE: 'May 2019',
          CITY: 'Los Angeles, CA',
          DESCRIPTION:
            '<ul><li>Collaborated with product teams to create user personas and journey maps, enhancing the overall user experience.</li><li>Designed and prototyped user interfaces for web and mobile applications, resulting in a 40% increase in user satisfaction ratings.</li><li>Conducted usability testing sessions, iterating on designs based on user feedback to improve functionality.</li></ul>',
        }),
      },
    ],
  },
  {
    title: 'Education',
    defaultTitle: 'Education',
    metadata: '',
    type: INTERNAL_SECTION_TYPES.EDUCATION,
    documentId,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
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
    title: 'Links',
    defaultTitle: 'Links',
    documentId,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        fields: getInsertTemplatesWithValues('WEBSITES_SOCIAL_LINKS', {
          LABEL: 'Portfolio',
          LINK: 'https://github.com/BraveHeart-tex',
        }),
      },
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        fields: getInsertTemplatesWithValues('WEBSITES_SOCIAL_LINKS', {
          LABEL: 'LinkedIn',
          LINK: 'https://www.linkedin.com/in/bora-karaca',
        }),
      },
    ],
  },
  {
    title: 'Skills',
    defaultTitle: 'Skills',
    metadata: '',
    documentId,
    type: INTERNAL_SECTION_TYPES.SKILLS,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
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
    documentId,
    metadata: '',
    type: INTERNAL_SECTION_TYPES.CUSTOM,
    items: [
      {
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
        fields: getInsertTemplatesWithValues('CUSTOM', {
          ACTIVITY_NAME: '',
          CITY: '',
          START_DATE: '',
          END_DATE: '',
          DESCRIPTION:
            '<p><strong>Design Tools:</strong> Adobe XD, Sketch, Figma, InVision, Axure.<br><strong>Prototyping & Wireframing:</strong> Low-Fidelity Wireframes, High-Fidelity Prototypes, User Flows, Storyboards.<br><strong>User Research:</strong> User Interviews, Surveys, Usability Testing, A/B Testing, Personas.<br><strong>Information Architecture:</strong> Site Mapping, Card Sorting, Content Strategy, Navigation Design.</p>',
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
      return getStandardTemplate(documentId).map(
        mapSectionAndItemDisplayOrders,
      );
    case PREFILL_RESUME_STYLES.TECH_FOCUSED:
      return getTechFocusedTemplate(documentId).map(
        mapSectionAndItemDisplayOrders,
      );
    case PREFILL_RESUME_STYLES.CREATIVE:
      return getCreativeTemplate(documentId).map(
        mapSectionAndItemDisplayOrders,
      );
    default:
      return getStandardTemplate(documentId).map(
        mapSectionAndItemDisplayOrders,
      );
  }
};

function mapSectionAndItemDisplayOrders(
  section: DeepOmit<SectionWithFields, 'displayOrder'>,
  index: number,
): SectionWithFields {
  return {
    ...section,
    displayOrder: index + 1,
    items: section.items.map((item, index) => {
      return {
        ...item,
        displayOrder: index + 1,
      };
    }),
  };
}
