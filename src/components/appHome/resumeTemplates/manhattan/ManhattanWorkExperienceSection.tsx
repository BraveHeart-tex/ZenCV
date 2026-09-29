import { Text, View } from '@react-pdf/renderer';
import type { WorkExperienceSectionSnapshot } from '@/lib/types/documentBuilder.types';
import { ManhattanSectionEntry } from './ManhattanSectionEntry';
import { manhattanTemplateStyles } from './manhattan.styles';

export const ManhattanWorkExperienceSection = ({
  workExperienceSection,
}: {
  workExperienceSection: WorkExperienceSectionSnapshot;
}) => {
  const { entries: sectionEntries } = workExperienceSection;
  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={manhattanTemplateStyles.section}>
      <Text style={manhattanTemplateStyles.sectionLabel}>
        {workExperienceSection.title}
      </Text>
      <View style={{ gap: 15 }}>
        {sectionEntries.map((entry) => (
          <ManhattanSectionEntry
            entry={entry}
            key={entry.entryId}
            titleKey='employer'
            subtitleKey='role'
          />
        ))}
      </View>
    </View>
  );
};
