import { isValidElement, type ReactElement, type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { DubaiTemplate } from '@/components/appHome/resumeTemplates/dubai/DubaiTemplate';
import { DubaiWorkExperienceSection } from '@/components/appHome/resumeTemplates/dubai/DubaiWorkExperienceSection';
import { LondonTemplate } from '@/components/appHome/resumeTemplates/london/LondonTemplate';
import { LondonWorkExperienceSection } from '@/components/appHome/resumeTemplates/london/LondonWorkExperienceSection';
import { ManhattanTemplate } from '@/components/appHome/resumeTemplates/manhattan/ManhattanTemplate';
import { ManhattanWorkExperienceSection } from '@/components/appHome/resumeTemplates/manhattan/ManhattanWorkExperienceSection';
import { SydneyTemplate } from '@/components/appHome/resumeTemplates/sydney/SydneyTemplate';
import { SydneyWorkExperienceSection } from '@/components/appHome/resumeTemplates/sydney/SydneyWorkExperienceSection';
import { TokyoTemplate } from '@/components/appHome/resumeTemplates/tokyo/TokyoTemplate';
import { TokyoWorkExperienceSection } from '@/components/appHome/resumeTemplates/tokyo/TokyoWorkExperienceSection';
import type {
  PdfTemplateData,
  WorkExperienceSectionSnapshot,
} from '@/lib/types/documentBuilder.types';

const workExperienceSection: WorkExperienceSectionSnapshot = {
  id: 10,
  title: 'Work Experience',
  displayOrder: 1,
  entries: [
    {
      entryId: '11',
      role: 'Product Engineer',
      employer: 'ZenCV',
      startDate: 'Jan 2024',
      endDate: 'Present',
      city: 'Istanbul',
      description: '<p>Built semantic PDF projections.</p>',
    },
  ],
};

const templateData: PdfTemplateData = {
  personalDetails: {
    firstName: 'Ada',
    lastName: 'Lovelace',
    jobTitle: 'Product Engineer',
    address: '',
    city: '',
    phone: '',
    email: '',
    links: [],
  },
  summarySection: {
    sectionName: 'Profile',
    summary: '',
  },
  workExperienceSection,
  sections: [],
  accentColor: '#000000',
  templateType: 'manhattan',
};

type TemplateElementProps = {
  children?: ReactNode;
  workExperienceSection?: WorkExperienceSectionSnapshot;
};

const findElementByType = (
  node: ReactNode,
  component: unknown
): ReactElement<TemplateElementProps> | null => {
  if (Array.isArray(node)) {
    for (const child of node) {
      const element = findElementByType(child, component);
      if (element) {
        return element;
      }
    }
    return null;
  }

  if (!isValidElement<TemplateElementProps>(node)) {
    return null;
  }
  if (node.type === component) {
    return node;
  }
  return findElementByType(node.props.children, component);
};

describe.each([
  [DubaiTemplate, DubaiWorkExperienceSection],
  [LondonTemplate, LondonWorkExperienceSection],
  [ManhattanTemplate, ManhattanWorkExperienceSection],
  [SydneyTemplate, SydneyWorkExperienceSection],
  [TokyoTemplate, TokyoWorkExperienceSection],
])('Work Experience PDF template', (Template, WorkExperienceSection) => {
  it('renders the semantic Work Experience snapshot', () => {
    const document = Template({ templateData });
    const workExperienceElement = findElementByType(
      document,
      WorkExperienceSection
    );

    expect(workExperienceElement).not.toBeNull();
    expect(workExperienceElement?.props.workExperienceSection).toBe(
      workExperienceSection
    );
  });
});
