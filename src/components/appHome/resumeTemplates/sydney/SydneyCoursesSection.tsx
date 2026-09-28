import { Text, View } from '@react-pdf/renderer';
import type { ResumeSnapshotSection } from '@/lib/builderDocument/resumeDocumentSnapshot';
import { getCoursesSectionEntries } from '../resumeTemplates.helpers';
import { SydneySectionEntry } from './SydneySectionEntry';
import type { SydneyStyles } from './sydney.types';

export const SydneyCoursesSection = ({
  section,
  styles,
}: {
  section: ResumeSnapshotSection;
  styles: SydneyStyles;
}) => {
  const sectionEntries = getCoursesSectionEntries(section);
  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{section.title}</Text>
      {sectionEntries.map((entry) => (
        <SydneySectionEntry
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
