import { Text, View } from '@react-pdf/renderer';
import type { WorkExperienceSectionSnapshot } from '@/lib/types/documentBuilder.types';
import { LondonSectionEntry } from './LondonSectionEntry';
import { londonTemplateStyles } from './london.styles';

export const LondonWorkExperienceSection = ({
  workExperienceSection,
}: {
  workExperienceSection: WorkExperienceSectionSnapshot;
}) => {
  const { entries: sectionEntries } = workExperienceSection;
  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={londonTemplateStyles.section}>
      <Text style={londonTemplateStyles.sectionLabel}>
        {workExperienceSection.title}
      </Text>
      <View style={{ gap: 15 }}>
        {sectionEntries.map((entry) => (
          <LondonSectionEntry
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
