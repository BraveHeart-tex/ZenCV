import type { ResumeSnapshotSection } from '@/lib/builderDocument/resumeDocumentSnapshot';
import { ResumeLanguagesSection } from '../shared/ResumeLanguagesSection';
import { LONDON_FONT_SIZE, londonTemplateStyles } from './london.styles';

export const LondonLanguagesSection = ({
  section,
}: {
  section: ResumeSnapshotSection;
}) => {
  return (
    <ResumeLanguagesSection
      fontSize={LONDON_FONT_SIZE}
      section={section}
      styles={londonTemplateStyles}
    />
  );
};
