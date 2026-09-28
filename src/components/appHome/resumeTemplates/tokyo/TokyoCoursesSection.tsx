import { Text, View } from '@react-pdf/renderer';
import type { ResumeSnapshotSection } from '@/lib/builderDocument/resumeDocumentSnapshot';
import { getCoursesSectionEntries } from '../resumeTemplates.helpers';
import { TokyoSectionEntry } from './TokyoSectionEntry';
import type { TokyoStyles } from './tokyo.types';

export const TokyoCoursesSection = ({
  section,
  styles,
}: {
  section: ResumeSnapshotSection;
  styles: TokyoStyles;
}) => {
  const sectionEntries = getCoursesSectionEntries(section);
  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={styles.mainSection}>
      <Text style={styles.mainSectionLabel}>{section.title}</Text>
      <View style={{ marginTop: 6 }}>
        {sectionEntries.map((entry) => (
          <TokyoSectionEntry
            entry={entry}
            key={entry.entryId}
            titleKey='course'
            subtitleKey='institution'
            styles={styles}
          />
        ))}
      </View>
    </View>
  );
};
