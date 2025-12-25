import { Text, View } from '@react-pdf/renderer';
import {
  getSectionMetadata,
  getSkillsSectionEntries,
} from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { CHECKED_METADATA_VALUE } from '@/lib/constants';
import { SECTION_METADATA_KEYS } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import {
  MANHATTAN_FONT_SIZE,
  manhattanTemplateStyles,
} from './manhattan.styles';

export const ManhattanSkillsSection = ({
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

  const isCommaSeparated =
    getSectionMetadata(
      section,
      SECTION_METADATA_KEYS.SKILLS.IS_COMMA_SEPARATED
    ) === CHECKED_METADATA_VALUE;

  const renderSkills = () => {
    if (isCommaSeparated) {
      return (
        <View
          style={{
            fontSize: MANHATTAN_FONT_SIZE,
          }}
        >
          <Text>
            {sectionEntries
              .map(
                (entry) =>
                  `${entry.name} ${showExperienceLevel && entry.level ? `(${entry.level})` : ''}`
              )
              .join(', ')}
          </Text>
        </View>
      );
    }

    return sectionEntries.map((entry) => (
      <View
        key={entry.entryId}
        style={{
          fontSize: MANHATTAN_FONT_SIZE,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '46%',
          gap: 8,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text>{entry.name}</Text>
        </View>
        {showExperienceLevel ? (
          <View>
            <Text>{entry.level}</Text>
          </View>
        ) : null}
      </View>
    ));
  };

  return (
    <View style={manhattanTemplateStyles.section}>
      <Text style={manhattanTemplateStyles.sectionLabel}>{section.title}</Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
          rowGap: 8,
        }}
      >
        {renderSkills()}
      </View>
    </View>
  );
};
