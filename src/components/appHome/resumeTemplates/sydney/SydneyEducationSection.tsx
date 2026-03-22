import { Text, View } from '@react-pdf/renderer';
import { getEducationSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { SydneySectionEntry } from './SydneySectionEntry';
import type { SydneySectionProps } from './sydney.types';

export const SydneyEducationSection = ({
  section,
  styles,
}: SydneySectionProps) => {
  const sectionEntries = getEducationSectionEntries(section);
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
          titleKey='school'
          subtitleKey='degree'
          styles={styles}
        />
      ))}
    </View>
  );
};
