import { Text, View } from '@react-pdf/renderer';
import type { SkillsSectionSnapshot } from '@/lib/builderDocument/resumeDocumentSnapshot';
import { getSkillsSectionEntries } from '../resumeTemplates.helpers';
import type { SydneySectionProps } from './sydney.types';

export const SydneySkillsSection = ({
  section,
  styles,
}: Omit<SydneySectionProps, 'section'> & {
  section: SkillsSectionSnapshot;
}) => {
  const sectionEntries = getSkillsSectionEntries(section);
  if (!sectionEntries.length) {
    return null;
  }

  const { showExperienceLevel, isCommaSeparated } = section;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{section.title}</Text>
      {isCommaSeparated ? (
        <Text style={styles.mainText}>
          {sectionEntries
            .map(
              (e) =>
                `${e.name}${showExperienceLevel && e.level ? ` (${e.level})` : ''}`
            )
            .join(', ')}
        </Text>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            rowGap: 4,
          }}
        >
          {sectionEntries.map((entry) => (
            <View key={entry.entryId} style={styles.skillRow}>
              <Text style={styles.skillName}>{entry.name}</Text>
              {showExperienceLevel && entry.level ? (
                <Text style={styles.skillLevel}>{entry.level}</Text>
              ) : null}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
