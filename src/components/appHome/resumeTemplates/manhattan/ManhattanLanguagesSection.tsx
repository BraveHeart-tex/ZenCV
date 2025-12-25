import { getLanguagesSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { ResumeLanguagesSection } from '../shared/ResumeLanguagesSection';
import {
  MANHATTAN_FONT_SIZE,
  manhattanTemplateStyles,
} from './manhattan.styles';

export const ManhattanLanguagesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getLanguagesSectionEntries(section);
  if (!sectionEntries.length) return null;

  return (
    <ResumeLanguagesSection
      fontSize={MANHATTAN_FONT_SIZE}
      section={section}
      styles={manhattanTemplateStyles}
    />
  );
};
