import { Link } from '@react-pdf/renderer';
import { isValidElement, type ReactElement, type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { DubaiPersonalDetailsSection } from '../dubai/DubaiPersonalDetailsSection';
import { DubaiTemplate } from '../dubai/DubaiTemplate';
import { LondonPersonalDetailsSection } from '../london/LondonPersonalDetailsSection';
import { LondonTemplate } from '../london/LondonTemplate';
import { ManhattanPersonalDetailsSection } from '../manhattan/ManhattanPersonalDetailsSection';
import { ManhattanTemplate } from '../manhattan/ManhattanTemplate';
import { SydneyPersonalDetailsSection } from '../sydney/SydneyPersonalDetailsSection';
import { SydneyTemplate } from '../sydney/SydneyTemplate';
import { TokyoPersonalDetailsSection } from '../tokyo/TokyoPersonalDetailsSection';
import { TokyoTemplate } from '../tokyo/TokyoTemplate';

const templateData: PdfTemplateData = {
  personalDetails: {
    firstName: 'Ada',
    lastName: 'Lovelace',
    jobTitle: 'Engineer',
    address: '',
    city: '',
    phone: '',
    email: '',
    links: [
      { entryId: '30', label: 'Portfolio', link: 'https://example.com/work' },
      { entryId: '31', label: 'example.org', link: 'https://example.org' },
    ],
  },
  summarySection: { sectionName: 'Profile', summary: '' },
  workExperienceSection: null,
  educationSection: null,
  sections: [],
  accentColor: '#000000',
  templateType: 'manhattan',
};

const collectElements = (
  node: ReactNode,
  type: unknown
): ReactElement<{ children?: ReactNode; src?: string }>[] => {
  if (Array.isArray(node)) {
    return node.flatMap((child) => collectElements(child, type));
  }
  if (!isValidElement<{ children?: ReactNode }>(node)) {
    return [];
  }
  return [
    ...(node.type === type ? [node] : []),
    ...collectElements(node.props.children, type),
  ];
};

describe.each([
  [DubaiTemplate, DubaiPersonalDetailsSection],
  [LondonTemplate, LondonPersonalDetailsSection],
  [ManhattanTemplate, ManhattanPersonalDetailsSection],
  [SydneyTemplate, SydneyPersonalDetailsSection],
  [TokyoTemplate, TokyoPersonalDetailsSection],
])('Personal Details PDF template', (Template, PersonalDetailsSection) => {
  it('places ordered links inside Personal Details and updates edited links', () => {
    const document = Template({ templateData });
    const [personalDetails] = collectElements(document, PersonalDetailsSection);
    expect(personalDetails).toBeDefined();

    const rendered = PersonalDetailsSection(personalDetails.props as never);
    expect(
      collectElements(rendered, Link).map((link) => ({
        label: link.props.children,
        url: link.props.src,
      }))
    ).toEqual([
      { label: 'Portfolio', url: 'https://example.com/work' },
      { label: 'example.org', url: 'https://example.org' },
    ]);

    const editedData = {
      ...templateData,
      personalDetails: {
        ...templateData.personalDetails,
        links: [
          { entryId: '31', label: 'Updated', link: 'https://example.org/new' },
          templateData.personalDetails.links[0],
        ],
      },
    };
    const editedDocument = Template({ templateData: editedData });
    const [editedPersonalDetails] = collectElements(
      editedDocument,
      PersonalDetailsSection
    );
    expect(editedPersonalDetails).toBeDefined();
    const editedRendered = PersonalDetailsSection(
      editedPersonalDetails.props as never
    );
    expect(
      collectElements(editedRendered, Link).map((link) => link.props.src)
    ).toEqual(['https://example.org/new', 'https://example.com/work']);
  });

  it('does not render links when the section is empty', () => {
    const emptyData = {
      ...templateData,
      personalDetails: { ...templateData.personalDetails, links: [] },
    };
    const document = Template({ templateData: emptyData });
    const [personalDetails] = collectElements(document, PersonalDetailsSection);
    expect(personalDetails).toBeDefined();
    const rendered = PersonalDetailsSection(personalDetails.props as never);
    expect(collectElements(rendered, Link)).toEqual([]);
  });
});
