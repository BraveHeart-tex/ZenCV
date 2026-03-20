import { Text, View } from '@react-pdf/renderer';
import { getEducationSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { TokyoSectionEntry } from './TokyoSectionEntry';
import { tokyoTemplateStyles } from './tokyo.styles';

export const TokyoEducationSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getEducationSectionEntries(section);
  if (!sectionEntries.length) return null;

  return (
    <View style={tokyoTemplateStyles.mainSection}>
      <Text style={tokyoTemplateStyles.mainSectionLabel}>{section.title}</Text>
      <View style={{ marginTop: 6 }}>
        {sectionEntries.map((entry) => (
          <TokyoSectionEntry
            entry={entry}
            key={entry.entryId}
            titleKey='school'
            subtitleKey='degree'
          />
        ))}
      </View>
    </View>
  );
};
