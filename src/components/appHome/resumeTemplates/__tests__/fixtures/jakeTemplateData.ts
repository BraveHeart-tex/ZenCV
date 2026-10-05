import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';

// Fictional content shared by PDF export checks and the gallery preview.
export const jakeTemplateData: PdfTemplateData = {
  templateType: 'jake',
  accentColor: '#000000',
  personalDetails: {
    firstName: 'Alex',
    lastName: 'Morgan',
    jobTitle: '',
    address: '123 Oak Street',
    city: 'Boston, MA 02115',
    phone: '617-555-0142',
    email: 'alex@example.com',
    links: [
      {
        entryId: '1',
        label: 'linkedin.com/in/alexmorgan',
        link: 'https://linkedin.com/in/alexmorgan',
      },
      {
        entryId: '2',
        label: 'github.com/alexmorgan',
        link: 'https://github.com/alexmorgan',
      },
    ],
  },
  summarySection: { sectionName: 'Profile', summary: '' },
  educationSection: {
    id: 10,
    sectionKey: 'education',
    title: 'Education',
    displayOrder: 1,
    items: [
      {
        id: 11,
        displayOrder: 1,
        values: {
          school: 'Northeastern University',
          degree: 'Bachelor of Science in Computer Science',
          city: 'Boston, MA',
          startDate: 'Sep. 2019',
          endDate: 'May 2023',
        },
      },
    ],
  },
  coursesSection: {
    id: 20,
    sectionKey: 'courses',
    title: 'Relevant Coursework',
    displayOrder: 2,
    items: [
      'Data Structures',
      'Algorithms',
      'Database Systems',
      'Operating Systems',
      'Software Engineering',
      'Computer Networks',
      'Artificial Intelligence',
      'Discrete Mathematics',
    ].map((course, index) => ({
      id: 21 + index,
      displayOrder: index,
      values: { course },
    })),
  },
  workExperienceSection: {
    id: 30,
    title: 'Experience',
    displayOrder: 3,
    entries: [
      {
        entryId: '31',
        employer: 'Northstar Technologies',
        role: 'Software Engineer',
        city: 'Boston, MA',
        startDate: 'June 2023',
        endDate: 'Present',
        description:
          '<ul><li>Built a customer analytics dashboard using TypeScript and React, giving support teams a clear view of account activity.</li><li>Reduced API response times by 35% through query optimization and a targeted caching strategy.</li><li>Collaborated with designers to ship accessible interfaces and improve keyboard navigation across core workflows.</li><li>Introduced integration tests for critical billing flows and documented the release process for the engineering team.</li></ul>',
      },
      {
        entryId: '32',
        employer: 'Harbor Labs',
        role: 'Software Engineering Intern',
        city: 'Cambridge, MA',
        startDate: 'May 2022',
        endDate: 'Aug. 2022',
        description:
          '<ul><li>Developed Python scripts to validate daily data imports and surface actionable errors to operations staff.</li><li>Implemented reusable frontend components for an internal project management tool.</li><li>Worked with engineers to investigate production issues and deliver fixes through code review.</li></ul>',
      },
    ],
  },
  internshipsSection: null,
  skillsSection: {
    id: 50,
    sectionKey: 'skills',
    title: 'Technical Skills',
    displayOrder: 5,
    showExperienceLevel: false,
    isCommaSeparated: true,
    items: [
      'TypeScript',
      'JavaScript',
      'Python',
      'SQL',
      'React',
      'Node.js',
      'PostgreSQL',
      'Git',
      'Docker',
      'Linux',
    ].map((skill, index) => ({
      id: 51 + index,
      displayOrder: index,
      values: { skill },
    })),
  },
  sections: [
    {
      id: 40,
      sectionKey: 'custom',
      title: 'Projects',
      displayOrder: 4,
      items: [
        {
          id: 41,
          displayOrder: 1,
          values: {
            activityName: 'Open Source Issue Tracker',
            endDate: 'March 2023',
            description:
              '<p><em>TypeScript, React, PostgreSQL</em></p><ul><li>Created an issue tracker with searchable projects, status filters, and collaborative discussion threads.</li><li>Designed a normalized database schema and implemented reliable pagination for large project histories.</li><li>Added automated checks for authorization and tested end-to-end workflows before each release.</li></ul>',
          },
        },
        {
          id: 42,
          displayOrder: 2,
          values: {
            activityName: 'Campus Study Planner',
            endDate: 'Nov. 2022',
            description:
              '<p><em>Python, Flask, SQLite</em></p><ul><li>Built a scheduling tool that helps students organize assignments and plan focused study sessions.</li><li>Developed a calendar export feature and deployed a prototype for feedback from classmates.</li></ul>',
          },
        },
      ],
    },
    {
      id: 60,
      sectionKey: 'custom',
      title: 'Leadership / Extracurricular',
      displayOrder: 6,
      items: [
        {
          id: 61,
          displayOrder: 1,
          values: {
            activityName: 'Computer Science Society',
            city: 'Northeastern University',
            startDate: 'Sep. 2021',
            endDate: 'May 2023',
            description:
              '<p><em>Workshop Coordinator</em></p><ul><li>Organized weekly programming workshops for students learning web development and version control.</li><li>Coordinated a team of six volunteers to run a campus hackathon and mentor first-time participants.</li></ul>',
          },
        },
      ],
    },
  ],
};
