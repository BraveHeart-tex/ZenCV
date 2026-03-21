import { Text, View } from '@react-pdf/renderer';
import { getInternshipsSectionEntries } from '../resumeTemplates.helpers';
import { DubaiSectionEntry } from './DubaiSectionEntry';
import type { DubaiSectionProps } from './dubai.types';

export const DubaiInternshipsSection = ({
  section,
  styles,
}: DubaiSectionProps) => {
  const sectionEntries = getInternshipsSectionEntries(section);
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
          titleKey='employer'
          subtitleKey='jobTitle'
          styles={styles}
        />
      ))}
    </View>
  );
};
