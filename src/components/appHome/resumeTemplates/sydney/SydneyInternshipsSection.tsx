import { Text, View } from '@react-pdf/renderer';
import { getInternshipsSectionEntries } from '../resumeTemplates.helpers';
import { SydneySectionEntry } from './SydneySectionEntry';
import type { SydneySectionProps } from './sydney.types';

export const SydneyInternshipsSection = ({
  section,
  styles,
}: SydneySectionProps) => {
  const sectionEntries = getInternshipsSectionEntries(section);
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
          titleKey='employer'
          subtitleKey='jobTitle'
          styles={styles}
        />
      ))}
    </View>
  );
};
