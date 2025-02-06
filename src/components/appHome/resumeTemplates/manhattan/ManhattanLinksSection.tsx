import {
  MANHATTAN_FONT_SIZE,
  manhattanTemplateStyles,
} from './manhattan.styles';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import ResumeLinksSection from '../shared/ResumeLinksSection';

interface ManhattanLinksSectionProps {
  section: TemplateDataSection;
}

const ManhattanLinksSection = ({ section }: ManhattanLinksSectionProps) => {
  return (
    <ResumeLinksSection
      section={section}
      fontSize={MANHATTAN_FONT_SIZE}
      styles={manhattanTemplateStyles}
      separator=" | "
    />
  );
};

export default ManhattanLinksSection;
