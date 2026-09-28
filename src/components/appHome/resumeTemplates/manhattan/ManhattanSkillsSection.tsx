import { Text, View } from '@react-pdf/renderer';
import { getSkillsSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import type { SkillsSectionSnapshot } from '@/lib/builderDocument/resumeDocumentSnapshot';
import {
  MANHATTAN_FONT_SIZE,
  manhattanTemplateStyles,
} from './manhattan.styles';

export const ManhattanSkillsSection = ({
  section,
}: {
  section: SkillsSectionSnapshot;
}) => {
  const sectionEntries = getSkillsSectionEntries(section);
  if (!sectionEntries.length) {
    return null;
  }

  const { showExperienceLevel, isCommaSeparated } = section;

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
