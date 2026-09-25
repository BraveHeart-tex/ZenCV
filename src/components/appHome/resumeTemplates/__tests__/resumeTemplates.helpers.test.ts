import { describe, expect, it } from 'vitest';
import type {
  TemplateDataSection,
  WorkExperienceSectionSnapshot,
} from '@/lib/types/documentBuilder.types';
import { mergePdfSections } from '../resumeTemplates.helpers';

describe('mergePdfSections', () => {
  it('inserts the semantic Work Experience snapshot by display order', () => {
    const deferredSection = {
      id: 30,
      displayOrder: 3,
    } as TemplateDataSection;
    const workExperienceSection: WorkExperienceSectionSnapshot = {
      id: 20,
      title: 'Work Experience',
      displayOrder: 2,
      entries: [],
    };

    expect(mergePdfSections([deferredSection], workExperienceSection)).toEqual([
      workExperienceSection,
      deferredSection,
    ]);
  });
});
