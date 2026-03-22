import { Text, View } from '@react-pdf/renderer';
import { getLanguagesSectionEntries } from '../resumeTemplates.helpers';
import type { SydneySectionProps } from './sydney.types';

export const SydneyLanguagesSection = ({
  section,
  styles,
}: SydneySectionProps) => {
  const sectionEntries = getLanguagesSectionEntries(section);
  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{section.title}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
        {sectionEntries.map((entry) => (
          <View
            key={entry.entryId}
            style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}
          >
            <Text style={styles.skillName}>{entry.language}</Text>
            {entry.level ? (
              <Text style={styles.skillLevel}>· {entry.level}</Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
};
