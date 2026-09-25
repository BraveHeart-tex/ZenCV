import { Text, View } from '@react-pdf/renderer';
import type { WorkExperienceSectionSnapshot } from '@/lib/types/documentBuilder.types';
import { TokyoSectionEntry } from './TokyoSectionEntry';
import type { TokyoStyles } from './tokyo.types';

export const TokyoWorkExperienceSection = ({
  workExperienceSection,
  styles,
}: {
  workExperienceSection: WorkExperienceSectionSnapshot;
  styles: TokyoStyles;
}) => {
  const { entries: sectionEntries } = workExperienceSection;
  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={styles.mainSection}>
      <Text style={styles.mainSectionLabel}>{workExperienceSection.title}</Text>
      <View style={{ marginTop: 6 }}>
        {sectionEntries.map((entry) => (
          <TokyoSectionEntry
            entry={entry}
            key={entry.entryId}
            titleKey='employer'
            subtitleKey='role'
            styles={styles}
          />
        ))}
      </View>
    </View>
  );
};
