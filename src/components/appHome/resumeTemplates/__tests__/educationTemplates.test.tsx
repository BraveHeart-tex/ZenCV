import { isValidElement, type ReactElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DubaiEducationSection } from '@/components/appHome/resumeTemplates/dubai/DubaiEducationSection';
import { DubaiTemplate } from '@/components/appHome/resumeTemplates/dubai/DubaiTemplate';
import { LondonEducationSection } from '@/components/appHome/resumeTemplates/london/LondonEducationSection';
import { LondonTemplate } from '@/components/appHome/resumeTemplates/london/LondonTemplate';
import { ManhattanEducationSection } from '@/components/appHome/resumeTemplates/manhattan/ManhattanEducationSection';
import { ManhattanTemplate } from '@/components/appHome/resumeTemplates/manhattan/ManhattanTemplate';
import { SydneyEducationSection } from '@/components/appHome/resumeTemplates/sydney/SydneyEducationSection';
import { SydneyTemplate } from '@/components/appHome/resumeTemplates/sydney/SydneyTemplate';
import { TokyoEducationSection } from '@/components/appHome/resumeTemplates/tokyo/TokyoEducationSection';
import { TokyoTemplate } from '@/components/appHome/resumeTemplates/tokyo/TokyoTemplate';
import type { ResumeSnapshotSection } from '@/lib/builderDocument/resumeDocumentSnapshot';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { JakeEducationSection } from '../jake/JakeSections';
import { JakeTemplate } from '../jake/JakeTemplate';

const educationSection = {
  id: 20,
  sectionKey: 'education',
  title: 'Education',
  displayOrder: 2,
  items: [
    {
      id: 22,
      displayOrder: 2,
      values: { school: 'Second University', degree: 'MSc' },
    },
    {
      id: 21,
      displayOrder: 1,
      values: { school: 'First University', degree: 'BSc' },
    },
    { id: 23, displayOrder: 3, values: { school: '', degree: '' } },
  ],
} as const;

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
  educationSection,
  coursesSection: null,
  internshipsSection: null,
  sections: [],
  accentColor: '#000000',
  templateType: 'manhattan',
};

const findElementByType = (
  node: ReactNode,
  component: unknown
): ReactElement<{ section?: ResumeSnapshotSection }> | null => {
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
    return node as ReactElement<{ section?: ResumeSnapshotSection }>;
  }
  return findElementByType(node.props.children, component);
};

const collectRenderedEntries = (
  node: ReactNode
): Array<{ entryId: string; school: string; degree: string }> => {
  if (Array.isArray(node)) {
    return node.flatMap(collectRenderedEntries);
  }
  if (
    !isValidElement<{
      children?: ReactNode;
      entry?: { entryId: string; school: string; degree: string };
    }>(node)
  ) {
    return [];
  }
  if (node.props.entry) {
    return [node.props.entry];
  }
  return collectRenderedEntries(node.props.children);
};

describe.each([
  [DubaiTemplate, DubaiEducationSection],
  [LondonTemplate, LondonEducationSection],
  [ManhattanTemplate, ManhattanEducationSection],
  [JakeTemplate, JakeEducationSection],
  [SydneyTemplate, SydneyEducationSection],
  [TokyoTemplate, TokyoEducationSection],
])('Education PDF template', (Template, EducationSection) => {
  it('renders the semantic section with stable IDs and display order', () => {
    const document = Template({ templateData });
    const element = findElementByType(document, EducationSection);

    expect(element?.props.section).toBe(educationSection);
  });

  it('shows filled entries in order, omits empty entries, and reflects edits', () => {
    const editedSection: ResumeSnapshotSection = {
      ...educationSection,
      items: educationSection.items.map((item) =>
        item.id === 21
          ? { ...item, values: { ...item.values, school: 'Edited University' } }
          : item
      ),
    };
    const document = Template({
      templateData: { ...templateData, educationSection: editedSection },
    });
    const element = findElementByType(document, EducationSection);
    if (!element) {
      throw new Error('Education section was not rendered');
    }

    const renderSection = element.type as (props: {
      section?: ResumeSnapshotSection;
    }) => ReactNode;
    const sectionTree = renderSection(element.props);
    const entries = collectRenderedEntries(sectionTree);

    expect(
      entries.map(({ entryId, school, degree }) => ({
        entryId,
        school,
        degree,
      }))
    ).toEqual([
      { entryId: '21', school: 'Edited University', degree: 'BSc' },
      { entryId: '22', school: 'Second University', degree: 'MSc' },
    ]);
    const markup = renderToStaticMarkup(sectionTree);
    expect(markup).toContain('Edited University');
    expect(markup).toContain('Second University');
    expect(markup).not.toContain('First University');
    expect(markup.indexOf('Edited University')).toBeLessThan(
      markup.indexOf('Second University')
    );
  });
});
