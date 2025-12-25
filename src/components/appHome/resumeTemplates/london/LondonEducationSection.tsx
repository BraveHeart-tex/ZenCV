import { Text, View } from '@react-pdf/renderer';
import { getEducationSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { LondonSectionEntry } from './LondonSectionEntry';
import { londonTemplateStyles } from './london.styles';

export const LondonEducationSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getEducationSectionEntries(section);
  if (!sectionEntries.length) return null;

  return (
    <View style={londonTemplateStyles.section}>
      <Text style={londonTemplateStyles.sectionLabel}>{section.title}</Text>
      {sectionEntries.map((entry) => (
        <LondonSectionEntry
          entry={entry}
          key={entry.entryId}
          titleKey='school'
          subtitleKey='degree'
        />
      ))}
    </View>
  );
};
