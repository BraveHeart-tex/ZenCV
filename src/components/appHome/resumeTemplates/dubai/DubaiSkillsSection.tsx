import { Text, View } from '@react-pdf/renderer';
import type { SkillsSectionSnapshot } from '@/lib/builderDocument/resumeDocumentSnapshot';

import { getSkillsSectionEntries } from '../resumeTemplates.helpers';
import type { DubaiSectionProps } from './dubai.types';

export const DubaiSkillsSection = ({
  section,
  styles,
}: Omit<DubaiSectionProps, 'section'> & { section: SkillsSectionSnapshot }) => {
  const sectionEntries = getSkillsSectionEntries(section);
  if (!sectionEntries.length) {
    return null;
  }

  const { showExperienceLevel } = section;

  return (
    <View style={styles.sidebarSection}>
      <Text style={styles.sidebarSectionLabel}>{section.title}</Text>
      <View style={{ flexDirection: 'column', gap: 4 }}>
        {sectionEntries.map((entry) => (
          <View key={entry.entryId} style={styles.skillRow}>
            <Text style={styles.skillName}>{entry.name}</Text>
            {showExperienceLevel && entry.level ? (
              <Text style={styles.skillLevel}>{entry.level}</Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
};
