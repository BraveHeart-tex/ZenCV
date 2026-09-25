import { Text, View } from '@react-pdf/renderer';
import type { WorkExperienceSectionSnapshot } from '@/lib/types/documentBuilder.types';
import { DubaiSectionEntry } from './DubaiSectionEntry';
import type { DubaiStyles } from './dubai.types';

export const DubaiWorkExperienceSection = ({
  workExperienceSection,
  styles,
}: {
  workExperienceSection: WorkExperienceSectionSnapshot;
  styles: DubaiStyles;
}) => {
  const { entries: sectionEntries } = workExperienceSection;
  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={styles.mainSection}>
      <Text style={styles.mainSectionLabel}>{workExperienceSection.title}</Text>
      {sectionEntries.map((entry) => (
        <DubaiSectionEntry
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
