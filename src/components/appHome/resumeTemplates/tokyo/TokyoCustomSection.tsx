import { Text, View } from '@react-pdf/renderer';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { getCustomSectionEntries } from '../resumeTemplates.helpers';
import { TokyoSectionEntry } from './TokyoSectionEntry';
import { tokyoTemplateStyles } from './tokyo.styles';

export const TokyoCustomSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getCustomSectionEntries(section);
  if (!sectionEntries.length) return null;

  return (
    <View style={tokyoTemplateStyles.mainSection}>
      <Text style={tokyoTemplateStyles.mainSectionLabel}>{section.title}</Text>
      <View style={{ marginTop: 6 }}>
        {sectionEntries.map((entry) => (
          <TokyoSectionEntry
            entry={entry}
            key={entry.entryId}
            titleKey='name'
            subtitleKey='city'
          />
        ))}
      </View>
    </View>
  );
};
