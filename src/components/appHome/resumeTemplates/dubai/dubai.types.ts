import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import type { createDubaiStyles } from './dubai.styles';

export type DubaiStyles = ReturnType<typeof createDubaiStyles>;

export interface DubaiSectionProps {
  section: TemplateDataSection;
  styles: DubaiStyles;
}
