import type { CustomSectionSnapshot } from '@/lib/builderDocument/resumeDocumentSnapshot';
import type { createTokyoStyles } from './tokyo.styles';

export interface TokyoSectionProps {
  section: CustomSectionSnapshot;
  styles: TokyoStyles;
}

export type TokyoStyles = ReturnType<typeof createTokyoStyles>;
