import { Text, View } from '@react-pdf/renderer';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { getCoursesSectionEntries } from '../resumeTemplates.helpers';
import { TokyoSectionEntry } from './TokyoSectionEntry';
import { tokyoTemplateStyles } from './tokyo.styles';

export const TokyoCoursesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getCoursesSectionEntries(section);
  if (!sectionEntries.length) return null;

  return (
    <View style={tokyoTemplateStyles.mainSection}>
      <Text style={tokyoTemplateStyles.mainSectionLabel}>{section.title}</Text>
      <View style={{ marginTop: 6 }}>
        {sectionEntries.map((entry) => (
          <TokyoSectionEntry
            entry={entry}
            key={entry.entryId}
            titleKey='course'
            subtitleKey='institution'
          />
        ))}
      </View>
    </View>
  );
};
