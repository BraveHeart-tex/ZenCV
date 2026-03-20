import { Text, View } from '@react-pdf/renderer';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { getCoursesSectionEntries } from '../resumeTemplates.helpers';
import { SydneySectionEntry } from './SydneySectionEntry';
import { sydneyTemplateStyles } from './sydney.styles';

export const SydneyCoursesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getCoursesSectionEntries(section);
  if (!sectionEntries.length) return null;

  return (
    <View style={sydneyTemplateStyles.section}>
      <Text style={sydneyTemplateStyles.sectionLabel}>{section.title}</Text>
      {sectionEntries.map((entry) => (
        <SydneySectionEntry
          entry={entry}
          key={entry.entryId}
          titleKey='course'
          subtitleKey='institution'
        />
      ))}
    </View>
  );
};
