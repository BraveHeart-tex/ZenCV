import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import type { createSydneyStyles } from './sydney.styles';

export type SydneyStyles = ReturnType<typeof createSydneyStyles>;

export interface SydneySectionProps {
  section: TemplateDataSection;
  styles: SydneyStyles;
}
