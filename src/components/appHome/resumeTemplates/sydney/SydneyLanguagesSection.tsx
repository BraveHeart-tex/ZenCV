import { Text, View } from '@react-pdf/renderer';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { getLanguagesSectionEntries } from '../resumeTemplates.helpers';
import { sydneyTemplateStyles } from './sydney.styles';

export const SydneyLanguagesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getLanguagesSectionEntries(section);
  if (!sectionEntries.length) return null;

  return (
    <View style={sydneyTemplateStyles.section}>
      <Text style={sydneyTemplateStyles.sectionLabel}>{section.title}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
        {sectionEntries.map((entry) => (
          <View
            key={entry.entryId}
            style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}
          >
            <Text style={sydneyTemplateStyles.skillName}>{entry.language}</Text>
            {entry.level ? (
              <Text style={sydneyTemplateStyles.skillLevel}>
                · {entry.level}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
};
