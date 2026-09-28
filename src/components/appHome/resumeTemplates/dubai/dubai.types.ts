import type { CustomSectionSnapshot } from '@/lib/builderDocument/resumeDocumentSnapshot';
import type { createDubaiStyles } from './dubai.styles';

export type DubaiStyles = ReturnType<typeof createDubaiStyles>;

export interface DubaiSectionProps {
  section: CustomSectionSnapshot;
  styles: DubaiStyles;
}
