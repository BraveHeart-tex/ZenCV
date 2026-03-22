import { Text, View } from '@react-pdf/renderer';
import { getInternshipsSectionEntries } from '../resumeTemplates.helpers';
import { TokyoSectionEntry } from './TokyoSectionEntry';
import type { TokyoSectionProps } from './tokyo.types';

export const TokyoInternshipsSection = ({
  section,
  styles,
}: TokyoSectionProps) => {
  const sectionEntries = getInternshipsSectionEntries(section);
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
            titleKey='employer'
            subtitleKey='jobTitle'
            styles={styles}
          />
        ))}
      </View>
    </View>
  );
};
