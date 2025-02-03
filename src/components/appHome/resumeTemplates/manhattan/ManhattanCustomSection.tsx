import { Text, View } from '@react-pdf/renderer';
import { manhattanTemplateStyles } from './manhattan.styles';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { FIELD_NAMES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import {
  findValueInItemFields,
  getRenderableEntries,
} from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import Html from 'react-pdf-html';
import { pdfHtmlRenderers } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';

const ManhattanCustomSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getRenderableEntries(
    section.items.map((item) => {
      const fields = item.fields;
      return {
        entryId: crypto.randomUUID(),
        name: findValueInItemFields(fields, FIELD_NAMES.CUSTOM.ACTIVITY_NAME),
        city: findValueInItemFields(fields, FIELD_NAMES.CUSTOM.CITY),
        startDate: findValueInItemFields(fields, FIELD_NAMES.CUSTOM.START_DATE),
        endDate: findValueInItemFields(fields, FIELD_NAMES.CUSTOM.END_DATE),
        description: findValueInItemFields(
          fields,
          FIELD_NAMES.CUSTOM.DESCRIPTION,
        ),
      };
    }),
  );

  if (!sectionEntries.length) return null;

  return (
    <View style={manhattanTemplateStyles.section}>
      <Text style={manhattanTemplateStyles.sectionLabel}>{section.title}</Text>
      <View style={{ gap: 15 }}>
        {sectionEntries.map((entry) => (
          <View key={entry.entryId}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}
                >
                  {entry.name}
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  alignItems: 'flex-end',
                }}
              >
                {(entry.startDate || entry.endDate) && (
                  <Text
                    style={{
                      fontSize: 11,
                      color: '#666666',
                    }}
                  >
                    {entry.startDate}
                    {entry.endDate ? ` - ${entry.endDate}` : ''}
                  </Text>
                )}
                {entry.city && (
                  <Text
                    style={{
                      fontSize: 11,
                      color: '#666666',
                    }}
                  >
                    {entry.city}
                  </Text>
                )}
              </View>
            </View>
            {entry.description && (
              <View style={{ marginTop: 4 }}>
                <Html style={{ fontSize: 11 }} renderers={pdfHtmlRenderers}>
                  {entry.description}
                </Html>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default ManhattanCustomSection;
