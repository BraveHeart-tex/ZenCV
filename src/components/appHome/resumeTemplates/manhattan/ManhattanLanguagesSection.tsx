import {
  MANHATTAN_FONT_SIZE,
  manhattanTemplateStyles,
} from './manhattan.styles';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { getLanguagesSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import ResumeLanguagesSection from '../shared/ResumeLanguagesSection';

const ManhattanLanguagesSection = ({
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

export default ManhattanLanguagesSection;
