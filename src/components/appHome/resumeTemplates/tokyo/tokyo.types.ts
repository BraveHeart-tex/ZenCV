import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import type { createTokyoStyles } from './tokyo.styles';

export interface TokyoSectionProps {
  section: TemplateDataSection;
  styles: ReturnType<typeof createTokyoStyles>;
}
