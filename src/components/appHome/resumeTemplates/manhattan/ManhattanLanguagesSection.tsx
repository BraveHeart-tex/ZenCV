import { Text, View } from '@react-pdf/renderer';
import { manhattanTemplateStyles } from './manhattan.styles';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { FIELD_NAMES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import {
  findValueInItemFields,
  getRenderableEntries,
} from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';

const ManhattanLanguagesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getRenderableEntries(
    section.items.map((item) => {
      const fields = item.fields;
      return {
        entryId: crypto.randomUUID(),
        language: findValueInItemFields(fields, FIELD_NAMES.LANGUAGES.LANGUAGE),
        level: findValueInItemFields(fields, FIELD_NAMES.LANGUAGES.LEVEL),
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
              {entry.language}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: '#666666',
              }}
            >
              {entry.level}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ManhattanLanguagesSection;
