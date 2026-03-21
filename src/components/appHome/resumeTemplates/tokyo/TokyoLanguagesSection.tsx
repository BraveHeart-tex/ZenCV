import { Text, View } from '@react-pdf/renderer';
import { getLanguagesSectionEntries } from '../resumeTemplates.helpers';
import type { TokyoSectionProps } from './tokyo.types';

export const TokyoLanguagesSection = ({
  section,
  styles,
}: TokyoSectionProps) => {
  const sectionEntries = getLanguagesSectionEntries(section);
  if (!sectionEntries.length) return null;

  return (
    <View style={styles.sidebarSection}>
      <Text style={styles.sidebarSectionLabel}>{section.title}</Text>
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
            <Text style={styles.skillName}>{entry.language}</Text>
            {entry.level ? (
              <Text style={styles.skillLevel}>{entry.level}</Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
};
