import { Text, View } from '@react-pdf/renderer';
import { getCustomSectionEntries } from '../resumeTemplates.helpers';
import { SydneySectionEntry } from './SydneySectionEntry';
import type { SydneySectionProps } from './sydney.types';

export const SydneyCustomSection = ({
  section,
  styles,
}: SydneySectionProps) => {
  const sectionEntries = getCustomSectionEntries(section);
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
          titleKey='name'
          subtitleKey='city'
          styles={styles}
        />
      ))}
    </View>
  );
};
