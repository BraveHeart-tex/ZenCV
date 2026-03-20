import { Text, View } from '@react-pdf/renderer';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { getLanguagesSectionEntries } from '../resumeTemplates.helpers';
import { tokyoTemplateStyles } from './tokyo.styles';

export const TokyoLanguagesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getLanguagesSectionEntries(section);
  if (!sectionEntries.length) return null;

  return (
    <View style={tokyoTemplateStyles.sidebarSection}>
      <Text style={tokyoTemplateStyles.sidebarSectionLabel}>
        {section.title}
      </Text>
      <View style={{ flexDirection: 'column', gap: 4 }}>
        {sectionEntries.map((entry) => (
          <View
            key={entry.entryId}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={tokyoTemplateStyles.skillName}>{entry.language}</Text>
            {entry.level ? (
              <Text style={tokyoTemplateStyles.skillLevel}>{entry.level}</Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
};
