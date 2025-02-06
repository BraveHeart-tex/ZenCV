import { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import {
  getSectionMetadata,
  getSkillsSectionEntries,
} from '../resumeTemplates.helpers';
import { LONDON_FONT_SIZE, londonTemplateStyles } from './london.styles';
import { SECTION_METADATA_KEYS } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { CHECKED_METADATA_VALUE } from '@/lib/constants';
import { Text, View } from '@react-pdf/renderer';

const LondonSkillsSection = ({ section }: { section: TemplateDataSection }) => {
  const sectionEntries = getSkillsSectionEntries(section);
  if (!sectionEntries.length) return null;

  const showExperienceLevel =
    getSectionMetadata(
      section,
      SECTION_METADATA_KEYS.SKILLS.SHOW_EXPERIENCE_LEVEL,
    ) === CHECKED_METADATA_VALUE;

  const isCommaSeparated =
    getSectionMetadata(
      section,
      SECTION_METADATA_KEYS.SKILLS.IS_COMMA_SEPARATED,
    ) === CHECKED_METADATA_VALUE;

  const renderSkills = () => {
    if (isCommaSeparated) {
      return (
        <View
          style={{
            fontSize: LONDON_FONT_SIZE,
          }}
        >
          <Text>
            {sectionEntries
              .map(
                (entry) =>
                  `${entry.name} ${showExperienceLevel && entry.level ? `(${entry.level})` : ''}`,
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
          fontSize: LONDON_FONT_SIZE,
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
    <View style={londonTemplateStyles.section}>
      <Text style={londonTemplateStyles.sectionLabel}>{section.title}</Text>
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
export default LondonSkillsSection;
