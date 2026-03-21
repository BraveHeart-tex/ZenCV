import { Text, View } from '@react-pdf/renderer';
import { CHECKED_METADATA_VALUE } from '@/lib/constants';
import { SECTION_METADATA_KEYS } from '@/lib/stores/documentBuilder/documentBuilder.constants';

import {
  getSectionMetadata,
  getSkillsSectionEntries,
} from '../resumeTemplates.helpers';
import type { DubaiSectionProps } from './dubai.types';

export const DubaiSkillsSection = ({ section, styles }: DubaiSectionProps) => {
  const sectionEntries = getSkillsSectionEntries(section);
  if (!sectionEntries.length) {
    return null;
  }

  const showExperienceLevel =
    getSectionMetadata(
      section,
      SECTION_METADATA_KEYS.SKILLS.SHOW_EXPERIENCE_LEVEL
    ) === CHECKED_METADATA_VALUE;

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
