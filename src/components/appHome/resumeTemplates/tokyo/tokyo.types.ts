import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import type { createTokyoStyles } from './tokyo.styles';

export interface TokyoSectionProps {
  section: TemplateDataSection;
  styles: TokyoStyles;
}

export type TokyoStyles = ReturnType<typeof createTokyoStyles>;
