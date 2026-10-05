import { isValidElement, type ReactElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DubaiHobbiesSection } from '@/components/appHome/resumeTemplates/dubai/DubaiHobbiesSection';
import { DubaiTemplate } from '@/components/appHome/resumeTemplates/dubai/DubaiTemplate';
import { LondonHobbiesSection } from '@/components/appHome/resumeTemplates/london/LondonHobbiesSection';
import { LondonTemplate } from '@/components/appHome/resumeTemplates/london/LondonTemplate';
import { ManhattanHobbiesSection } from '@/components/appHome/resumeTemplates/manhattan/ManhattanHobbiesSection';
import { ManhattanTemplate } from '@/components/appHome/resumeTemplates/manhattan/ManhattanTemplate';
import { SydneyHobbiesSection } from '@/components/appHome/resumeTemplates/sydney/SydneyHobbiesSection';
import { SydneyTemplate } from '@/components/appHome/resumeTemplates/sydney/SydneyTemplate';
import { TokyoHobbiesSection } from '@/components/appHome/resumeTemplates/tokyo/TokyoHobbiesSection';
import { TokyoTemplate } from '@/components/appHome/resumeTemplates/tokyo/TokyoTemplate';
import type { HobbiesSectionSnapshot } from '@/lib/builderDocument/resumeDocumentSnapshot';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { JakeHobbiesSection } from '../jake/JakeSections';
import { JakeTemplate } from '../jake/JakeTemplate';

const hobbiesSection: HobbiesSectionSnapshot = {
  id: 50,
  sectionKey: 'hobbies',
  title: 'Activities',
  displayOrder: 4,
  items: [{ id: 51, displayOrder: 1, values: { whatYouLike: 'Photography' } }],
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
  sections: [hobbiesSection],
  accentColor: '#000000',
  templateType: 'tokyo',
};

const findElementByType = (
  node: ReactNode,
  component: unknown
): ReactElement | null => {
  if (Array.isArray(node)) {
    for (const child of node) {
      const element = findElementByType(child, component);
      if (element !== null) {
        return element;
      }
    }
    return null;
  }
  if (!isValidElement<{ children?: ReactNode }>(node)) {
    return null;
  }
  if (node.type === component) {
    return node;
  }
  return findElementByType(node.props.children, component);
};

describe.each([
  [DubaiTemplate, DubaiHobbiesSection],
  [LondonTemplate, LondonHobbiesSection],
  [ManhattanTemplate, ManhattanHobbiesSection],
  [JakeTemplate, JakeHobbiesSection],
  [SydneyTemplate, SydneyHobbiesSection],
  [TokyoTemplate, TokyoHobbiesSection],
])('Hobbies PDF template', (Template, HobbiesSection) => {
  it('renders edited semantic content with the current section title', () => {
    const editedSection: HobbiesSectionSnapshot = {
      ...hobbiesSection,
      items: [
        {
          ...hobbiesSection.items[0],
          values: { whatYouLike: 'Photography, Hiking' },
        },
      ],
    };
    const document = Template({
      templateData: { ...templateData, sections: [editedSection] },
    });
    const element = findElementByType(document, HobbiesSection);
    const hobbiesElement =
      element ??
      (() => {
        throw new Error('Hobbies section was not rendered');
      })();
    const renderSection = hobbiesElement.type as unknown as (
      props: typeof hobbiesElement.props
    ) => ReactNode;
    const markup = renderToStaticMarkup(renderSection(hobbiesElement.props));
    expect(markup).toContain('Activities');
    expect(markup).toContain('Photography, Hiking');
  });

  it('omits empty semantic content', () => {
    const emptySection: HobbiesSectionSnapshot = {
      ...hobbiesSection,
      items: [{ id: 51, displayOrder: 1, values: { whatYouLike: '' } }],
    };
    const document = Template({
      templateData: { ...templateData, sections: [emptySection] },
    });
    const element = findElementByType(document, HobbiesSection);
    const hobbiesElement =
      element ??
      (() => {
        throw new Error('Hobbies section was not rendered');
      })();
    const renderSection = hobbiesElement.type as unknown as (
      props: typeof hobbiesElement.props
    ) => ReactNode;
    expect(renderSection(hobbiesElement.props)).toBeNull();
  });
});
