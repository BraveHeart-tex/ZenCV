import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { ResumeLinksSection } from '../shared/ResumeLinksSection';
import { LONDON_FONT_SIZE, londonTemplateStyles } from './london.styles';

export const LondonLinksSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  return (
    <ResumeLinksSection
      section={section}
      fontSize={LONDON_FONT_SIZE}
      styles={londonTemplateStyles}
      separator=' • '
    />
  );
};
