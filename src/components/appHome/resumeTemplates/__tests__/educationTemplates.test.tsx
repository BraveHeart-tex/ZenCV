import { isValidElement, type ReactElement, type ReactNode } from 'react';
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
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';

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
  sections: [],
  accentColor: '#000000',
  templateType: 'manhattan',
};

const findElementByType = (
  node: ReactNode,
  component: unknown
): ReactElement<{ section?: typeof educationSection }> | null => {
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
    return node as ReactElement<{ section?: typeof educationSection }>;
  }
  return findElementByType(node.props.children, component);
};

describe.each([
  [DubaiTemplate, DubaiEducationSection],
  [LondonTemplate, LondonEducationSection],
  [ManhattanTemplate, ManhattanEducationSection],
  [SydneyTemplate, SydneyEducationSection],
  [TokyoTemplate, TokyoEducationSection],
])('Education PDF template', (Template, EducationSection) => {
  it('renders the semantic section with stable IDs and display order', () => {
    const document = Template({ templateData });
    const element = findElementByType(document, EducationSection);

    expect(element?.props.section).toBe(educationSection);
  });
});
