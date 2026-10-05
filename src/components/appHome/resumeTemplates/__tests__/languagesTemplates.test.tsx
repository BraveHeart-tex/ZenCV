import { isValidElement, type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import type { ResumeSnapshotSection } from '@/lib/builderDocument/resumeDocumentSnapshot';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { DubaiLanguagesSection } from '../dubai/DubaiLanguagesSection';
import { DubaiTemplate } from '../dubai/DubaiTemplate';
import { JakeLanguagesSection, JakeSection } from '../jake/JakeSections';
import { JakeTemplate } from '../jake/JakeTemplate';
import { LondonLanguagesSection } from '../london/LondonLanguagesSection';
import { LondonTemplate } from '../london/LondonTemplate';
import { ManhattanLanguagesSection } from '../manhattan/ManhattanLanguagesSection';
import { ManhattanTemplate } from '../manhattan/ManhattanTemplate';
import { ResumeLanguagesSection } from '../shared/ResumeLanguagesSection';
import { SydneyLanguagesSection } from '../sydney/SydneyLanguagesSection';
import { SydneyTemplate } from '../sydney/SydneyTemplate';
import { TokyoLanguagesSection } from '../tokyo/TokyoLanguagesSection';
import { TokyoTemplate } from '../tokyo/TokyoTemplate';

const languagesSection: ResumeSnapshotSection = {
  id: 14,
  sectionKey: 'languages',
  title: 'Languages',
  displayOrder: 5,
  items: [
    { id: 33, displayOrder: 2, values: { language: 'German', level: 'B2' } },
    {
      id: 34,
      displayOrder: 1,
      values: { language: 'English', level: 'Native Speaker' },
    },
    { id: 35, displayOrder: 3, values: { language: '', level: '' } },
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
  summarySection: { sectionName: 'Profile', summary: '' },
  workExperienceSection: null,
  educationSection: null,
  coursesSection: null,
  internshipsSection: null,
  languagesSection,
  sections: [],
  accentColor: '#000000',
  templateType: 'manhattan',
};

const findElements = (node: ReactNode, type: unknown): ReactNode[] => {
  if (Array.isArray(node)) {
    return node.flatMap((child) => findElements(child, type));
  }
  if (!isValidElement<{ children?: ReactNode }>(node)) {
    return [];
  }
  return [
    ...(node.type === type ? [node] : []),
    ...findElements(node.props.children, type),
  ];
};

const visibleText = (node: ReactNode): string => {
  if (Array.isArray(node)) {
    return node.map(visibleText).join(' ');
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (!isValidElement<{ children?: ReactNode }>(node)) {
    return '';
  }
  if (node.type === ResumeLanguagesSection) {
    return visibleText(
      ResumeLanguagesSection(
        node.props as Parameters<typeof ResumeLanguagesSection>[0]
      )
    );
  }
  if (node.type === JakeSection) {
    return visibleText(
      JakeSection(node.props as Parameters<typeof JakeSection>[0])
    );
  }
  return visibleText(node.props.children);
};

describe.each([
  [DubaiTemplate, DubaiLanguagesSection],
  [LondonTemplate, LondonLanguagesSection],
  [ManhattanTemplate, ManhattanLanguagesSection],
  [JakeTemplate, JakeLanguagesSection],
  [SydneyTemplate, SydneyLanguagesSection],
  [TokyoTemplate, TokyoLanguagesSection],
] as const)('Languages PDF template', (Template, LanguagesSection) => {
  const render = (section: ResumeSnapshotSection) => {
    const document = Template({
      templateData: { ...templateData, languagesSection: section },
    });
    const matches = findElements(document, LanguagesSection);
    expect(matches).toHaveLength(1);
    const element = matches[0];
    if (!isValidElement(element)) {
      throw new Error('Expected Languages section');
    }
    return LanguagesSection(element.props as never);
  };

  it('renders ordered, nonempty languages with their levels', () => {
    const text = visibleText(render(languagesSection));
    expect(text).toContain('Languages');
    expect(text).toContain('Native Speaker');
    expect(text).toContain('B2');
    expect(text.indexOf('English')).toBeLessThan(text.indexOf('German'));
  });

  it('reflects edited and reordered languages', () => {
    const text = visibleText(
      render({
        ...languagesSection,
        items: [
          {
            id: 33,
            displayOrder: 1,
            values: { language: 'French', level: 'C1' },
          },
          {
            id: 34,
            displayOrder: 2,
            values: { language: 'English', level: 'Native Speaker' },
          },
        ],
      })
    );
    expect(text).not.toContain('German');
    expect(text).toContain('C1');
    expect(text.indexOf('French')).toBeLessThan(text.indexOf('English'));
  });

  it('omits the section when every language is empty', () => {
    const text = visibleText(
      render({
        ...languagesSection,
        items: [
          { id: 35, displayOrder: 1, values: { language: '', level: '' } },
        ],
      })
    );
    expect(text.trim()).toBe('');
  });
});
