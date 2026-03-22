import { Text, View } from '@react-pdf/renderer';
import { getWorkExperienceSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { SydneySectionEntry } from './SydneySectionEntry';
import type { SydneySectionProps } from './sydney.types';

export const SydneyWorkExperienceSection = ({
  section,
  styles,
}: SydneySectionProps) => {
  const sectionEntries = getWorkExperienceSectionEntries(section);
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
