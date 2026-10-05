import { isValidElement, type ReactElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DubaiReferencesSection } from '@/components/appHome/resumeTemplates/dubai/DubaiReferencesSection';
import { DubaiTemplate } from '@/components/appHome/resumeTemplates/dubai/DubaiTemplate';
import { LondonReferencesSection } from '@/components/appHome/resumeTemplates/london/LondonReferencesSection';
import { LondonTemplate } from '@/components/appHome/resumeTemplates/london/LondonTemplate';
import { ManhattanReferencesSection } from '@/components/appHome/resumeTemplates/manhattan/ManhattanReferencesSection';
import { ManhattanTemplate } from '@/components/appHome/resumeTemplates/manhattan/ManhattanTemplate';
import { SydneyReferencesSection } from '@/components/appHome/resumeTemplates/sydney/SydneyReferencesSection';
import { SydneyTemplate } from '@/components/appHome/resumeTemplates/sydney/SydneyTemplate';
import { TokyoReferencesSection } from '@/components/appHome/resumeTemplates/tokyo/TokyoReferencesSection';
import { TokyoTemplate } from '@/components/appHome/resumeTemplates/tokyo/TokyoTemplate';
import type { ReferencesSectionSnapshot } from '@/lib/builderDocument/resumeDocumentSnapshot';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { JakeReferencesSection } from '../jake/JakeSections';
import { JakeTemplate } from '../jake/JakeTemplate';
import { getReferencesSectionEntries } from '../resumeTemplates.helpers';

const referencesSection: ReferencesSectionSnapshot = {
  id: 50,
  sectionKey: 'references',
  title: 'References',
  displayOrder: 4,
  hideReferences: false,
  items: [
    {
      id: 52,
      displayOrder: 2,
      values: {
        referentFullName: 'Second Referee',
        company: 'Second Company',
        referentEmail: 'second@example.com',
        phone: '222',
      },
    },
    {
      id: 51,
      displayOrder: 1,
      values: {
        referentFullName: 'First Referee',
        company: 'First Company',
        referentEmail: 'first@example.com',
        phone: '111',
      },
    },
    { id: 53, displayOrder: 3, values: {} },
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
  coursesSection: null,
  internshipsSection: null,
  sections: [referencesSection],
  accentColor: '#000000',
  templateType: 'manhattan',
};

const findElementByType = (
  node: ReactNode,
  component: unknown
): ReactElement<{ section: ReferencesSectionSnapshot }> | null => {
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
    return node as ReactElement<{ section: ReferencesSectionSnapshot }>;
  }
  return findElementByType(node.props.children, component);
};

describe('semantic References PDF projection', () => {
  it('keeps stable IDs and display order while omitting empty and legacy values', () => {
    expect(getReferencesSectionEntries(referencesSection)).toEqual([
      {
        entryId: '51',
        referentPhone: '111',
        referentCompany: 'First Company',
        referentEmail: 'first@example.com',
        referentFullName: 'First Referee',
      },
      {
        entryId: '52',
        referentPhone: '222',
        referentCompany: 'Second Company',
        referentEmail: 'second@example.com',
        referentFullName: 'Second Referee',
      },
    ]);
  });
});

describe.each([
  [DubaiTemplate, DubaiReferencesSection],
  [LondonTemplate, LondonReferencesSection],
  [ManhattanTemplate, ManhattanReferencesSection],
  [JakeTemplate, JakeReferencesSection],
  [SydneyTemplate, SydneyReferencesSection],
  [TokyoTemplate, TokyoReferencesSection],
])('References PDF template', (Template, ReferencesSection) => {
  it('renders semantic reference values in display order when visible', () => {
    const document = Template({ templateData });
    const element = findElementByType(document, ReferencesSection);
    if (!element) {
      throw new Error('References section was not rendered');
    }

    const renderSection = element.type as (props: {
      section: ReferencesSectionSnapshot;
      styles?: unknown;
    }) => ReactNode;
    const markup = renderToStaticMarkup(renderSection(element.props));

    expect(markup).toContain('First Referee');
    expect(markup).toContain('Second Referee');
    expect(markup).toContain('first@example.com');
    expect(markup).toContain('second@example.com');
    expect(markup.indexOf('First Referee')).toBeLessThan(
      markup.indexOf('Second Referee')
    );
  });

  it('uses the hidden-reference message instead of exposing contact values', () => {
    const hiddenSection = { ...referencesSection, hideReferences: true };
    const document = Template({
      templateData: { ...templateData, sections: [hiddenSection] },
    });
    const element = findElementByType(document, ReferencesSection);
    if (!element) {
      throw new Error('References section was not rendered');
    }

    const renderSection = element.type as (props: {
      section: ReferencesSectionSnapshot;
      styles?: unknown;
    }) => ReactNode;
    const markup = renderToStaticMarkup(renderSection(element.props));

    expect(markup).toContain('References available upon request');
    expect(markup).not.toContain('First Referee');
    expect(markup).not.toContain('first@example.com');
  });

  it('omits the section when all Reference entries are empty', () => {
    const emptySection: ReferencesSectionSnapshot = {
      ...referencesSection,
      items: [{ id: 53, displayOrder: 1, values: {} }],
    };
    const document = Template({
      templateData: { ...templateData, sections: [emptySection] },
    });
    const element = findElementByType(document, ReferencesSection);
    if (!element) {
      throw new Error('References section was not rendered');
    }

    const renderSection = element.type as (props: {
      section: ReferencesSectionSnapshot;
      styles?: unknown;
    }) => ReactNode;
    expect(renderSection(element.props)).toBeNull();
  });
});
