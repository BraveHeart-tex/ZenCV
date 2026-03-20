import { Text, View } from '@react-pdf/renderer';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { getLanguagesSectionEntries } from '../resumeTemplates.helpers';
import { dubaiTemplateStyles } from './dubai.styles';

export const DubaiLanguagesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getLanguagesSectionEntries(section);
  if (!sectionEntries.length) return null;

  return (
    <View style={dubaiTemplateStyles.sidebarSection}>
      <Text style={dubaiTemplateStyles.sidebarSectionLabel}>
        {section.title}
      </Text>
      <View style={{ flexDirection: 'column', gap: 4 }}>
        {sectionEntries.map((entry) => (
          <View
            key={entry.entryId}
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={dubaiTemplateStyles.skillName}>{entry.language}</Text>
            {entry.level ? (
              <Text style={dubaiTemplateStyles.skillLevel}>{entry.level}</Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
};
