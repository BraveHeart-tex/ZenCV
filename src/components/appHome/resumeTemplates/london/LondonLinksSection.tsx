import { LONDON_FONT_SIZE, londonTemplateStyles } from './london.styles';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import ResumeLinksSection from '../shared/ResumeLinksSection';

const LondonLinksSection = ({ section }: { section: TemplateDataSection }) => {
  return (
    <ResumeLinksSection
      section={section}
      fontSize={LONDON_FONT_SIZE}
      styles={londonTemplateStyles}
      separator=" • "
    />
  );
};

export default LondonLinksSection;
