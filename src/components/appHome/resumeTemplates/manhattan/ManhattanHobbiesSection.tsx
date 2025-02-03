import { Text, View } from '@react-pdf/renderer';
import { manhattanTemplateStyles } from './manhattan.styles';
import { FIELD_NAMES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import {
  findValueInItemFields,
  getRenderableEntries,
} from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';

const ManhattanHobbiesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getRenderableEntries(
    section.items.map((item) => {
      const fields = item.fields;
      return {
        entryId: crypto.randomUUID(),
        description: findValueInItemFields(
          fields,
          FIELD_NAMES.HOBBIES.WHAT_DO_YOU_LIKE,
        ),
      };
    }),
  );

  if (!sectionEntries.length) return null;

  return (
    <View style={manhattanTemplateStyles.section}>
      <Text style={manhattanTemplateStyles.sectionLabel}>{section.title}</Text>
      <View style={{ gap: 8 }}>
        {sectionEntries.map((entry) => (
          <View key={entry.entryId}>
            <Text
              style={{
                fontSize: 11,
              }}
            >
              {entry.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ManhattanHobbiesSection;
