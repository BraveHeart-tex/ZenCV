import { londonTemplateStyles } from '@/components/appHome/resumeTemplates/london/london.styles';
import {
  findValueInItemFields,
  getRenderableEntries,
} from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { TemplateDataSection } from '@/lib/types';
import { View, Text } from '@react-pdf/renderer';
import { PDF_BODY_FONT_SIZE } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';

import { FIELD_NAMES } from '@/lib/stores/documentBuilder/documentBuilder.constants';

const LondonLanguagesSection = ({
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

  if (sectionEntries.length === 0) return null;

  return (
    <View
      style={{
        ...londonTemplateStyles.section,
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Text
          style={{
            ...londonTemplateStyles.sectionLabel,
            width: '25%',
          }}
        >
          {section?.title}
        </Text>
        <View
          style={{
            display: 'flex',
            gap: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            columnGap: 5,
            width: '75%',
          }}
        >
          {sectionEntries.map((entry) => (
            <View
              key={entry.entryId}
              style={{
                fontSize: PDF_BODY_FONT_SIZE,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '46%',
              }}
            >
              <Text>{entry.language}</Text>
              <Text>{entry.level}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
export default LondonLanguagesSection;
