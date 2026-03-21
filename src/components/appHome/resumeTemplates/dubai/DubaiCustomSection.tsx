import { Text, View } from '@react-pdf/renderer';
import { getCustomSectionEntries } from '../resumeTemplates.helpers';
import { DubaiSectionEntry } from './DubaiSectionEntry';
import type { DubaiSectionProps } from './dubai.types';

export const DubaiCustomSection = ({ section, styles }: DubaiSectionProps) => {
  const sectionEntries = getCustomSectionEntries(section);
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
          titleKey='name'
          subtitleKey='city'
          styles={styles}
        />
      ))}
    </View>
  );
};
