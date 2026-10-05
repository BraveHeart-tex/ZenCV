import { isValidElement, type ReactElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { CustomSectionSnapshot } from '@/lib/builderDocument/resumeDocumentSnapshot';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { DubaiCustomSection } from '../dubai/DubaiCustomSection';
import { DubaiTemplate } from '../dubai/DubaiTemplate';
import { JakeCustomSection } from '../jake/JakeSections';
import { JakeTemplate } from '../jake/JakeTemplate';
import { LondonCustomSection } from '../london/LondonCustomSection';
import { LondonTemplate } from '../london/LondonTemplate';
import { ManhattanCustomSection } from '../manhattan/ManhattanCustomSection';
import { ManhattanTemplate } from '../manhattan/ManhattanTemplate';
import { SydneyCustomSection } from '../sydney/SydneyCustomSection';
import { SydneyTemplate } from '../sydney/SydneyTemplate';
import { TokyoCustomSection } from '../tokyo/TokyoCustomSection';
import { TokyoTemplate } from '../tokyo/TokyoTemplate';

const volunteeringSection: CustomSectionSnapshot = {
  id: 10,
  sectionKey: 'custom',
  title: 'Volunteering',
  displayOrder: 2,
  items: [
    {
      id: 102,
      displayOrder: 2,
      values: {
        activityName: 'Tutor',
        city: 'Ankara',
        startDate: '2023-01',
        endDate: '2024-01',
        description: '<p>Guided students</p>',
      },
    },
    {
      id: 101,
      displayOrder: 1,
      values: { activityName: 'Mentor', city: 'Istanbul' },
    },
    {
      id: 103,
      displayOrder: 3,
      values: {
        activityName: '',
        city: '',
        startDate: '',
        endDate: '',
        description: '',
      },
    },
  ],
};

const projectsSection: CustomSectionSnapshot = {
  id: 11,
  sectionKey: 'custom',
  title: 'Projects',
  displayOrder: 3,
  items: [{ id: 104, displayOrder: 1, values: { activityName: 'Portfolio' } }],
};

const emptySection: CustomSectionSnapshot = {
  id: 12,
  sectionKey: 'custom',
  title: 'Empty Custom',
  displayOrder: 1,
  items: [{ id: 105, displayOrder: 1, values: {} }],
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
  coursesSection: null,
  internshipsSection: null,
  sections: [projectsSection, emptySection, volunteeringSection],
  accentColor: '#000000',
  templateType: 'manhattan',
};

const findElements = (
  node: ReactNode,
  component: unknown
): ReactElement<{ section: CustomSectionSnapshot }>[] => {
  if (Array.isArray(node)) {
    return node.flatMap((child) => findElements(child, component));
  }
  if (!isValidElement<{ children?: ReactNode }>(node)) {
    return [];
  }
  return [
    ...(node.type === component
      ? [node as ReactElement<{ section: CustomSectionSnapshot }>]
      : []),
    ...findElements(node.props.children, component),
  ];
};

describe.each([
  [DubaiTemplate, DubaiCustomSection],
  [LondonTemplate, LondonCustomSection],
  [ManhattanTemplate, ManhattanCustomSection],
  [JakeTemplate, JakeCustomSection],
  [SydneyTemplate, SydneyCustomSection],
  [TokyoTemplate, TokyoCustomSection],
])('Custom PDF template', (Template, CustomSection) => {
  it('renders multiple Custom sections and filled entries in display order', () => {
    const document = Template({ templateData });
    const elements = findElements(document, CustomSection);
    expect(elements.map((element) => element.props.section.id)).toEqual([
      12, 10, 11,
    ]);

    const volunteeringElement = elements[1];
    const projectsElement = elements[2];
    const renderSection = volunteeringElement.type as (props: {
      section: CustomSectionSnapshot;
      styles?: unknown;
    }) => ReactNode;
    const volunteeringMarkup = renderToStaticMarkup(
      renderSection(volunteeringElement.props)
    );
    const projectsMarkup = renderToStaticMarkup(
      renderSection(projectsElement.props)
    );

    expect(volunteeringMarkup).toContain('Volunteering');
    expect(volunteeringMarkup).toContain('Mentor');
    expect(volunteeringMarkup).toContain('Tutor');
    expect(volunteeringMarkup).toContain('Istanbul');
    expect(volunteeringMarkup).toContain('Ankara');
    expect(volunteeringMarkup).toContain('2023-01');
    expect(volunteeringMarkup).toContain('2024-01');
    expect(volunteeringMarkup).toContain('Guided students');
    expect(volunteeringMarkup.indexOf('Mentor')).toBeLessThan(
      volunteeringMarkup.indexOf('Tutor')
    );
    expect(projectsMarkup).toContain('Projects');
    expect(projectsMarkup).toContain('Portfolio');
  });

  it('omits a Custom section with no filled entries', () => {
    const document = Template({ templateData });
    const emptyElement = findElements(document, CustomSection)[0];
    const renderSection = emptyElement.type as (props: {
      section: CustomSectionSnapshot;
      styles?: unknown;
    }) => ReactNode;

    expect(renderSection(emptyElement.props)).toBeNull();
  });
});
