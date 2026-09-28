import { isValidElement, type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import type { SkillsSectionSnapshot } from '@/lib/builderDocument/resumeDocumentSnapshot';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { DubaiSkillsSection } from '../dubai/DubaiSkillsSection';
import { DubaiTemplate } from '../dubai/DubaiTemplate';
import { LondonSkillsSection } from '../london/LondonSkillsSection';
import { LondonTemplate } from '../london/LondonTemplate';
import { ManhattanSkillsSection } from '../manhattan/ManhattanSkillsSection';
import { ManhattanTemplate } from '../manhattan/ManhattanTemplate';
import { SydneySkillsSection } from '../sydney/SydneySkillsSection';
import { SydneyTemplate } from '../sydney/SydneyTemplate';
import { TokyoSkillsSection } from '../tokyo/TokyoSkillsSection';
import { TokyoTemplate } from '../tokyo/TokyoTemplate';

const skillsSection: SkillsSectionSnapshot = {
  id: 13,
  sectionKey: 'skills',
  title: 'Skills',
  displayOrder: 4,
  showExperienceLevel: false,
  isCommaSeparated: false,
  items: [
    {
      id: 23,
      displayOrder: 2,
      values: { skill: 'Research', experienceLevel: 'Proficient' },
    },
    {
      id: 24,
      displayOrder: 1,
      values: { skill: 'TypeScript', experienceLevel: 'Expert' },
    },
    { id: 25, displayOrder: 3, values: { skill: '', experienceLevel: '' } },
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
  skillsSection,
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
  return visibleText(node.props.children);
};

describe.each([
  [DubaiTemplate, DubaiSkillsSection, false],
  [LondonTemplate, LondonSkillsSection, true],
  [ManhattanTemplate, ManhattanSkillsSection, true],
  [SydneyTemplate, SydneySkillsSection, true],
  [TokyoTemplate, TokyoSkillsSection, false],
] as const)('Skills PDF template', (Template, SkillsSection, supportsCommas) => {
  const render = (section: SkillsSectionSnapshot) => {
    const document = Template({
      templateData: { ...templateData, skillsSection: section },
    });
    const matches = findElements(document, SkillsSection);
    expect(matches).toHaveLength(1);
    const element = matches[0];
    if (!isValidElement(element)) {
      throw new Error('Expected Skills section');
    }
    return SkillsSection(element.props as never);
  };

  it('renders ordered, nonempty skills with default and selected level options', () => {
    const defaultText = visibleText(render(skillsSection));
    expect(defaultText.indexOf('TypeScript')).toBeLessThan(
      defaultText.indexOf('Research')
    );
    expect(defaultText).not.toContain('Expert');
    expect(defaultText).not.toContain('Proficient');

    const withLevels = visibleText(
      render({ ...skillsSection, showExperienceLevel: true })
    );
    expect(withLevels).toContain('TypeScript');
    expect(withLevels).toContain('Expert');
    expect(withLevels).toContain('Research');
    expect(withLevels).toContain('Proficient');
  });

  it('omits the section when every skill is empty', () => {
    expect(render({ ...skillsSection, items: [] })).toBeNull();
  });

  if (supportsCommas) {
    it('renders the comma-separated option in entry order', () => {
      const text = visibleText(
        render({
          ...skillsSection,
          showExperienceLevel: true,
          isCommaSeparated: true,
        })
      );
      expect(text).toMatch(
        /TypeScript\s*\(Expert\), Research\s*\(Proficient\)/
      );
    });
  }
});
