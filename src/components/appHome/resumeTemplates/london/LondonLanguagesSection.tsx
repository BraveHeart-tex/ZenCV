import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { ResumeLanguagesSection } from '../shared/ResumeLanguagesSection';
import { LONDON_FONT_SIZE, londonTemplateStyles } from './london.styles';

export const LondonLanguagesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  return (
    <ResumeLanguagesSection
      fontSize={LONDON_FONT_SIZE}
      section={section}
      styles={londonTemplateStyles}
    />
  );
};
