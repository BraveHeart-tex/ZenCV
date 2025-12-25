import { Text, View } from '@react-pdf/renderer';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { getInternshipsSectionEntries } from '../resumeTemplates.helpers';
import { LondonSectionEntry } from './LondonSectionEntry';
import { londonTemplateStyles } from './london.styles';

export const LondonInternshipsSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getInternshipsSectionEntries(section);

  if (!sectionEntries.length) return null;

  return (
    <View style={londonTemplateStyles.section}>
      <Text style={londonTemplateStyles.sectionLabel}>{section.title}</Text>
      <View style={{ gap: 15 }}>
        {sectionEntries.map((entry) => (
          <LondonSectionEntry
            entry={entry}
            key={entry.entryId}
            titleKey='employer'
            subtitleKey='jobTitle'
          />
        ))}
      </View>
    </View>
  );
};
