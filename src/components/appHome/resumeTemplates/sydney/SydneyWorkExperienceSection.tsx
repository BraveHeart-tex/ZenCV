import { Text, View } from '@react-pdf/renderer';
import { getWorkExperienceSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { SydneySectionEntry } from './SydneySectionEntry';
import { sydneyTemplateStyles } from './sydney.styles';

export const SydneyWorkExperienceSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getWorkExperienceSectionEntries(section);
  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={sydneyTemplateStyles.section}>
      <Text style={sydneyTemplateStyles.sectionLabel}>{section.title}</Text>
      {sectionEntries.map((entry) => (
        <SydneySectionEntry
          entry={entry}
          key={entry.entryId}
          titleKey='employer'
          subtitleKey='jobTitle'
        />
      ))}
    </View>
  );
};
