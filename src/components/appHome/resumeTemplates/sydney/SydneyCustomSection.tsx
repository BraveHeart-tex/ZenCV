import { Text, View } from '@react-pdf/renderer';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { getCustomSectionEntries } from '../resumeTemplates.helpers';
import { SydneySectionEntry } from './SydneySectionEntry';
import { sydneyTemplateStyles } from './sydney.styles';

export const SydneyCustomSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getCustomSectionEntries(section);
  if (!sectionEntries.length) return null;

  return (
    <View style={sydneyTemplateStyles.section}>
      <Text style={sydneyTemplateStyles.sectionLabel}>{section.title}</Text>
      {sectionEntries.map((entry) => (
        <SydneySectionEntry
          entry={entry}
          key={entry.entryId}
          titleKey='name'
          subtitleKey='city'
        />
      ))}
    </View>
  );
};
