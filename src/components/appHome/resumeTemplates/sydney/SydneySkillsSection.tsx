import { Text, View } from '@react-pdf/renderer';
import { CHECKED_METADATA_VALUE } from '@/lib/constants';
import { SECTION_METADATA_KEYS } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import {
  getSectionMetadata,
  getSkillsSectionEntries,
} from '../resumeTemplates.helpers';
import { sydneyTemplateStyles } from './sydney.styles';

export const SydneySkillsSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getSkillsSectionEntries(section);
  if (!sectionEntries.length) {
    return null;
  }

  const showExperienceLevel =
    getSectionMetadata(
      section,
      SECTION_METADATA_KEYS.SKILLS.SHOW_EXPERIENCE_LEVEL
    ) === CHECKED_METADATA_VALUE;

  const isCommaSeparated =
    getSectionMetadata(
      section,
      SECTION_METADATA_KEYS.SKILLS.IS_COMMA_SEPARATED
    ) === CHECKED_METADATA_VALUE;

  return (
    <View style={sydneyTemplateStyles.section}>
      <Text style={sydneyTemplateStyles.sectionLabel}>{section.title}</Text>
      {isCommaSeparated ? (
        <Text style={sydneyTemplateStyles.mainText}>
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
            <View key={entry.entryId} style={sydneyTemplateStyles.skillRow}>
              <Text style={sydneyTemplateStyles.skillName}>{entry.name}</Text>
              {showExperienceLevel && entry.level ? (
                <Text style={sydneyTemplateStyles.skillLevel}>
                  {entry.level}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
