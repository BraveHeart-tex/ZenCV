import { Text, View } from '@react-pdf/renderer';
import { CHECKED_METADATA_VALUE } from '@/lib/constants';
import { SECTION_METADATA_KEYS } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import {
  getSectionMetadata,
  getSkillsSectionEntries,
} from '../resumeTemplates.helpers';
import { tokyoTemplateStyles } from './tokyo.styles';

export const TokyoSkillsSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getSkillsSectionEntries(section);
  if (!sectionEntries.length) return null;

  const showExperienceLevel =
    getSectionMetadata(
      section,
      SECTION_METADATA_KEYS.SKILLS.SHOW_EXPERIENCE_LEVEL
    ) === CHECKED_METADATA_VALUE;

  return (
    <View style={tokyoTemplateStyles.sidebarSection}>
      <Text style={tokyoTemplateStyles.sidebarSectionLabel}>
        {section.title}
      </Text>
      <View style={{ flexDirection: 'column', gap: 4 }}>
        {sectionEntries.map((entry) => (
          <View key={entry.entryId} style={tokyoTemplateStyles.skillRow}>
            <Text style={tokyoTemplateStyles.skillName}>{entry.name}</Text>
            {showExperienceLevel && entry.level ? (
              <Text style={tokyoTemplateStyles.skillLevel}>{entry.level}</Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
};
