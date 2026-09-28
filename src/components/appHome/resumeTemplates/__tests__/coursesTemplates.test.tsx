import { isValidElement, type ReactElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DubaiCoursesSection } from '@/components/appHome/resumeTemplates/dubai/DubaiCoursesSection';
import { DubaiTemplate } from '@/components/appHome/resumeTemplates/dubai/DubaiTemplate';
import { LondonCoursesSection } from '@/components/appHome/resumeTemplates/london/LondonCoursesSection';
import { LondonTemplate } from '@/components/appHome/resumeTemplates/london/LondonTemplate';
import { ManhattanCoursesSection } from '@/components/appHome/resumeTemplates/manhattan/ManhattanCoursesSection';
import { ManhattanTemplate } from '@/components/appHome/resumeTemplates/manhattan/ManhattanTemplate';
import { SydneyCoursesSection } from '@/components/appHome/resumeTemplates/sydney/SydneyCoursesSection';
import { SydneyTemplate } from '@/components/appHome/resumeTemplates/sydney/SydneyTemplate';
import { TokyoCoursesSection } from '@/components/appHome/resumeTemplates/tokyo/TokyoCoursesSection';
import { TokyoTemplate } from '@/components/appHome/resumeTemplates/tokyo/TokyoTemplate';
import type { ResumeSnapshotSection } from '@/lib/builderDocument/resumeDocumentSnapshot';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';

const coursesSection: ResumeSnapshotSection = {
  id: 40,
  sectionKey: 'courses',
  title: 'Courses',
  displayOrder: 2,
  items: [
    {
      id: 42,
      displayOrder: 2,
      values: {
        course: 'Second Course',
        institution: 'Second Academy',
        startDate: '2024-04',
        endDate: '2024-06',
      },
    },
    {
      id: 41,
      displayOrder: 1,
      values: {
        course: 'First Course',
        institution: 'First Academy',
        startDate: '2023-01',
        endDate: '2023-03',
      },
    },
    { id: 43, displayOrder: 3, values: { course: '', institution: '' } },
  ],
};

const templateData: PdfTemplateData = {
  personalDetails: {
    firstName: '',
    lastName: '',
    jobTitle: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    links: [],
  },
  summarySection: { sectionName: '', summary: '' },
  workExperienceSection: null,
  educationSection: null,
  coursesSection,
  internshipsSection: null,
  sections: [],
  accentColor: '#000000',
  templateType: 'manhattan',
};

const findElementByType = (
  node: ReactNode,
  component: unknown
): ReactElement<{ section: ResumeSnapshotSection }> | null => {
  if (Array.isArray(node)) {
    for (const child of node) {
      const element = findElementByType(child, component);
      if (element) {
        return element;
      }
    }
    return null;
  }
  if (!isValidElement<{ children?: ReactNode }>(node)) {
    return null;
  }
  if (node.type === component) {
    return node as ReactElement<{ section: ResumeSnapshotSection }>;
  }
  return findElementByType(node.props.children, component);
};

describe.each([
  [DubaiTemplate, DubaiCoursesSection],
  [LondonTemplate, LondonCoursesSection],
  [ManhattanTemplate, ManhattanCoursesSection],
  [SydneyTemplate, SydneyCoursesSection],
  [TokyoTemplate, TokyoCoursesSection],
])('Courses PDF template', (Template, CoursesSection) => {
  it('renders edited semantic values and dates in display order without empty entries', () => {
    const editedSection: ResumeSnapshotSection = {
      ...coursesSection,
      items: coursesSection.items.map((item) =>
        item.id === 41
          ? {
              ...item,
              values: { ...item.values, course: 'Edited Course' },
            }
          : item
      ),
    };
    const document = Template({
      templateData: { ...templateData, coursesSection: editedSection },
    });
    const element = findElementByType(document, CoursesSection);
    if (!element) {
      throw new Error('Courses section was not rendered');
    }
    expect(element.props.section).toBe(editedSection);

    const renderSection = element.type as (props: {
      section: ResumeSnapshotSection;
    }) => ReactNode;
    const markup = renderToStaticMarkup(renderSection(element.props));
    expect(markup).toContain('Edited Course');
    expect(markup).toContain('First Academy');
    expect(markup).toContain('2023-01');
    expect(markup).toContain('2023-03');
    expect(markup).toContain('Second Course');
    expect(markup).toContain('2024-04');
    expect(markup).toContain('2024-06');
    expect(markup).not.toContain('First Course');
    expect(markup.indexOf('Edited Course')).toBeLessThan(
      markup.indexOf('Second Course')
    );
  });

  it('omits the section when all Course entries are empty', () => {
    const emptySection: ResumeSnapshotSection = {
      ...coursesSection,
      items: [{ id: 43, displayOrder: 1, values: {} }],
    };
    const document = Template({
      templateData: { ...templateData, coursesSection: emptySection },
    });
    const element = findElementByType(document, CoursesSection);
    if (!element) {
      throw new Error('Courses section was not rendered');
    }

    const renderSection = element.type as (props: {
      section: ResumeSnapshotSection;
    }) => ReactNode;
    expect(renderSection(element.props)).toBeNull();
  });
});
