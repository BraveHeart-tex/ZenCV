import { describe, expect, it } from 'vitest';
import type { WorkExperienceSectionSnapshot } from '@/lib/types/documentBuilder.types';
import {
  getCoursesSectionEntries,
  getCustomSectionEntries,
  getEducationSectionEntries,
  getSemanticInternshipSectionEntries,
  mergePdfSections,
} from '../resumeTemplates.helpers';

describe('Custom PDF projection', () => {
  it('uses generic values and stable domain IDs, ordered and filtered by content', () => {
    const section = {
      id: 18,
      sectionKey: 'custom',
      title: 'Volunteering',
      displayOrder: 4,
      items: [
        {
          id: 73,
          displayOrder: 2,
          values: {
            activityName: 'Mentor',
            city: 'London',
            startDate: '2022-01',
            endDate: '2023-01',
            description: '<p>Helped students</p>',
          },
        },
        {
          id: 72,
          displayOrder: 1,
          values: {
            activityName: '',
            city: '',
            startDate: '',
            endDate: '',
            description: '',
          },
        },
      ],
    } as const;

    expect(getCustomSectionEntries(section)).toEqual([
      {
        entryId: '73',
        name: 'Mentor',
        city: 'London',
        startDate: '2022-01',
        endDate: '2023-01',
        description: '<p>Helped students</p>',
      },
    ]);
    expect(
      getCustomSectionEntries({ ...section, items: [section.items[1]] })
    ).toEqual([]);
  });
});

describe('mergePdfSections', () => {
  it('inserts the semantic Work Experience snapshot by display order', () => {
    const deferredSection = {
      id: 30,
      sectionKey: 'custom',
      title: 'Volunteering',
      displayOrder: 3,
      items: [],
    } as const;
    const workExperienceSection: WorkExperienceSectionSnapshot = {
      id: 20,
      title: 'Work Experience',
      displayOrder: 2,
      entries: [],
    };

    expect(
      mergePdfSections({
        sections: [deferredSection],
        workExperienceSection,
        educationSection: null,
        coursesSection: null,
        internshipsSection: null,
      })
    ).toEqual([workExperienceSection, deferredSection]);
  });
});

describe('semantic Education PDF projection', () => {
  it('keeps stable item IDs, semantic values, and item order while omitting empty items', () => {
    const section = {
      id: 12,
      sectionKey: 'education',
      title: 'Education',
      displayOrder: 2,
      items: [
        {
          id: 45,
          displayOrder: 2,
          values: { school: 'University B', degree: 'MSc', startDate: '2020' },
        },
        { id: 44, displayOrder: 1, values: { school: '', degree: '' } },
      ],
    } as const;

    expect(getEducationSectionEntries(section)).toEqual([
      {
        entryId: '45',
        school: 'University B',
        degree: 'MSc',
        startDate: '2020',
        endDate: '',
        city: '',
        description: '',
      },
    ]);
  });
});

describe('semantic Courses PDF projection', () => {
  it('keeps stable IDs and display order while omitting empty and legacy values', () => {
    const section = {
      id: 16,
      sectionKey: 'courses',
      title: 'Courses',
      displayOrder: 3,
      items: [
        {
          id: 82,
          displayOrder: 2,
          values: {
            course: 'Advanced TypeScript',
            institution: 'Academy',
            startDate: '2024-01',
            endDate: '2024-03',
          },
        },
        { id: 81, displayOrder: 1, values: { course: '', institution: '' } },
      ],
    } as const;

    expect(getCoursesSectionEntries(section)).toEqual([
      {
        entryId: '82',
        course: 'Advanced TypeScript',
        institution: 'Academy',
        startDate: '2024-01',
        endDate: '2024-03',
      },
    ]);
  });
});

describe('semantic Internship PDF projection', () => {
  it('keeps stable item IDs and order while omitting empty items', () => {
    const section = {
      id: 14,
      sectionKey: 'internships',
      title: 'Internships',
      displayOrder: 3,
      items: [
        {
          id: 52,
          displayOrder: 2,
          values: { role: 'Intern', employer: 'Company B', startDate: '2022' },
        },
        { id: 51, displayOrder: 1, values: { role: '', employer: '' } },
      ],
    } as const;

    expect(getSemanticInternshipSectionEntries(section)).toEqual([
      {
        entryId: '52',
        jobTitle: 'Intern',
        employer: 'Company B',
        startDate: '2022',
        endDate: '',
        city: '',
        description: '',
      },
    ]);
  });
});
