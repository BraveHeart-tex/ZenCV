import { Text, View } from '@react-pdf/renderer';
import type { ResumeSnapshotSection } from '@/lib/builderDocument/resumeDocumentSnapshot';
import { getCoursesSectionEntries } from '../resumeTemplates.helpers';
import { DubaiSectionEntry } from './DubaiSectionEntry';
import type { DubaiStyles } from './dubai.types';

export const DubaiCoursesSection = ({
  section,
  styles,
}: {
  section: ResumeSnapshotSection;
  styles: DubaiStyles;
}) => {
  const sectionEntries = getCoursesSectionEntries(section);
  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={styles.mainSection}>
      <Text style={styles.mainSectionLabel}>{section.title}</Text>
      {sectionEntries.map((entry) => (
        <DubaiSectionEntry
          entry={entry}
          key={entry.entryId}
          titleKey='course'
          subtitleKey='institution'
          styles={styles}
        />
      ))}
    </View>
  );
};
