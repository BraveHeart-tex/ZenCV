import { Text, View } from '@react-pdf/renderer';
import type { WorkExperienceSectionSnapshot } from '@/lib/types/documentBuilder.types';
import { SydneySectionEntry } from './SydneySectionEntry';
import type { SydneyStyles } from './sydney.types';

export const SydneyWorkExperienceSection = ({
  workExperienceSection,
  styles,
}: {
  workExperienceSection: WorkExperienceSectionSnapshot;
  styles: SydneyStyles;
}) => {
  const { entries: sectionEntries } = workExperienceSection;
  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{workExperienceSection.title}</Text>
      {sectionEntries.map((entry) => (
        <SydneySectionEntry
          entry={entry}
          key={entry.entryId}
          titleKey='employer'
          subtitleKey='role'
          styles={styles}
        />
      ))}
    </View>
  );
};
