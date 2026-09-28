import type { CustomSectionSnapshot } from '@/lib/builderDocument/resumeDocumentSnapshot';
import type { createSydneyStyles } from './sydney.styles';

export type SydneyStyles = ReturnType<typeof createSydneyStyles>;

export interface SydneySectionProps {
  section: CustomSectionSnapshot;
  styles: SydneyStyles;
}
