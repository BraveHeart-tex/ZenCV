import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { ResumeLinksSection } from '../shared/ResumeLinksSection';
import {
  MANHATTAN_FONT_SIZE,
  manhattanTemplateStyles,
} from './manhattan.styles';

interface ManhattanLinksSectionProps {
  section: TemplateDataSection;
}

export const ManhattanLinksSection = ({
  section,
}: ManhattanLinksSectionProps) => {
  return (
    <ResumeLinksSection
      section={section}
      fontSize={MANHATTAN_FONT_SIZE}
      styles={manhattanTemplateStyles}
      separator=' | '
    />
  );
};
