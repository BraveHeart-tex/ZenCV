import { isValidElement, type ReactElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DubaiInternshipsSection } from '@/components/appHome/resumeTemplates/dubai/DubaiInternshipsSection';
import { DubaiTemplate } from '@/components/appHome/resumeTemplates/dubai/DubaiTemplate';
import { LondonInternshipsSection } from '@/components/appHome/resumeTemplates/london/LondonInternshipsSection';
import { LondonTemplate } from '@/components/appHome/resumeTemplates/london/LondonTemplate';
import { ManhattanInternshipsSection } from '@/components/appHome/resumeTemplates/manhattan/ManhattanInternshipsSection';
import { ManhattanTemplate } from '@/components/appHome/resumeTemplates/manhattan/ManhattanTemplate';
import { SydneyInternshipsSection } from '@/components/appHome/resumeTemplates/sydney/SydneyInternshipsSection';
import { SydneyTemplate } from '@/components/appHome/resumeTemplates/sydney/SydneyTemplate';
import { TokyoInternshipsSection } from '@/components/appHome/resumeTemplates/tokyo/TokyoInternshipsSection';
import { TokyoTemplate } from '@/components/appHome/resumeTemplates/tokyo/TokyoTemplate';
import type { InternshipSectionSnapshot } from '@/lib/builderDocument/resumeDocumentSnapshot';
import type {
  InternshipPdfEntry,
  PdfTemplateData,
} from '@/lib/types/documentBuilder.types';

const internshipsSection: InternshipSectionSnapshot = {
  id: 30,
  sectionKey: 'internships',
  title: 'Internships',
  displayOrder: 2,
  items: [
    {
      id: 32,
      displayOrder: 2,
      values: { role: 'Second Intern', employer: 'Company B' },
    },
    {
      id: 31,
      displayOrder: 1,
      values: { role: 'First Intern', employer: 'Company A' },
    },
    { id: 33, displayOrder: 3, values: { role: '', employer: '' } },
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
  internshipsSection,
  sections: [],
  accentColor: '#000000',
  templateType: 'manhattan',
};

const findElementByType = (
  node: ReactNode,
  component: unknown
): ReactElement<{ section: InternshipSectionSnapshot }> | null => {
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
    return node as ReactElement<{ section: InternshipSectionSnapshot }>;
  }
  return findElementByType(node.props.children, component);
};

const collectRenderedEntries = (node: ReactNode): InternshipPdfEntry[] => {
  if (Array.isArray(node)) {
    return node.flatMap(collectRenderedEntries);
  }
  if (
    !isValidElement<{
      children?: ReactNode;
      entry?: InternshipPdfEntry;
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
  [DubaiTemplate, DubaiInternshipsSection],
  [LondonTemplate, LondonInternshipsSection],
  [ManhattanTemplate, ManhattanInternshipsSection],
  [SydneyTemplate, SydneyInternshipsSection],
  [TokyoTemplate, TokyoInternshipsSection],
])('Internship PDF template', (Template, InternshipsSection) => {
  it('renders stable semantic entries in order, omits empty entries, and reflects edits', () => {
    const editedSection: InternshipSectionSnapshot = {
      ...internshipsSection,
      items: internshipsSection.items.map((item) =>
        item.id === 31
          ? { ...item, values: { ...item.values, role: 'Edited Intern' } }
          : item
      ),
    };
    const document = Template({
      templateData: { ...templateData, internshipsSection: editedSection },
    });
    const element = findElementByType(document, InternshipsSection);
    if (!element) {
      throw new Error('Internships section was not rendered');
    }

    const renderSection = element.type as (props: {
      section: InternshipSectionSnapshot;
    }) => ReactNode;
    const sectionTree = renderSection(element.props);
    const entries = collectRenderedEntries(sectionTree);

    expect(
      entries.map(({ entryId, jobTitle, employer }) => ({
        entryId,
        jobTitle,
        employer,
      }))
    ).toEqual([
      { entryId: '31', jobTitle: 'Edited Intern', employer: 'Company A' },
      { entryId: '32', jobTitle: 'Second Intern', employer: 'Company B' },
    ]);
    const markup = renderToStaticMarkup(sectionTree);
    expect(markup).toContain('Edited Intern');
    expect(markup).toContain('Second Intern');
    expect(markup).not.toContain('First Intern');
    expect(markup.indexOf('Edited Intern')).toBeLessThan(
      markup.indexOf('Second Intern')
    );
  });
});
