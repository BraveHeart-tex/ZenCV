import { getLanguagesSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import type { ResumeSnapshotSection } from '@/lib/builderDocument/resumeDocumentSnapshot';
import { ResumeLanguagesSection } from '../shared/ResumeLanguagesSection';
import {
  MANHATTAN_FONT_SIZE,
  manhattanTemplateStyles,
} from './manhattan.styles';

export const ManhattanLanguagesSection = ({
  section,
}: {
  section: ResumeSnapshotSection;
}) => {
  const sectionEntries = getLanguagesSectionEntries(section);
  if (!sectionEntries.length) {
    return null;
  }

  return (
    <ResumeLanguagesSection
      fontSize={MANHATTAN_FONT_SIZE}
      section={section}
      styles={manhattanTemplateStyles}
    />
  );
};
