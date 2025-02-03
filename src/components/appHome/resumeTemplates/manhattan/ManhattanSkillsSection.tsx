import { Text, View } from '@react-pdf/renderer';
import { manhattanTemplateStyles } from './manhattan.styles';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { FIELD_NAMES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import {
  findValueInItemFields,
  getRenderableEntries,
} from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';

const ManhattanSkillsSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getRenderableEntries(
    section.items.map((item) => {
      const fields = item.fields;
      return {
        entryId: crypto.randomUUID(),
        skill: findValueInItemFields(fields, FIELD_NAMES.SKILLS.SKILL),
        level: findValueInItemFields(
          fields,
          FIELD_NAMES.SKILLS.EXPERIENCE_LEVEL,
        ),
      };
    }),
  );

  if (!sectionEntries.length) return null;

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
        {sectionEntries.map((entry) => (
          <View
            key={entry.entryId}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: '45%',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                fontSize: 11,
              }}
            >
              {entry.skill}
            </Text>
            {entry.level && (
              <Text
                style={{
                  fontSize: 11,
                  color: '#666666',
                }}
              >
                {entry.level}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default ManhattanSkillsSection;
