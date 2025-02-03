import { Text, View } from '@react-pdf/renderer';
import { manhattanTemplateStyles } from './manhattan.styles';
import { FIELD_NAMES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import {
  findValueInItemFields,
  getRenderableEntries,
} from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import Html from 'react-pdf-html';
import { pdfHtmlRenderers } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';

const ManhattanInternshipsSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getRenderableEntries(
    section.items.map((item) => {
      const fields = item.fields;
      return {
        entryId: crypto.randomUUID(),
        company: findValueInItemFields(
          fields,
          FIELD_NAMES.INTERNSHIPS.EMPLOYER,
        ),
        startDate: findValueInItemFields(
          fields,
          FIELD_NAMES.INTERNSHIPS.START_DATE,
        ),
        endDate: findValueInItemFields(
          fields,
          FIELD_NAMES.INTERNSHIPS.END_DATE,
        ),
        city: findValueInItemFields(fields, FIELD_NAMES.INTERNSHIPS.CITY),
        description: findValueInItemFields(
          fields,
          FIELD_NAMES.INTERNSHIPS.DESCRIPTION,
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
                    fontSize: 11,
                    color: '#666666',
                  }}
                >
                  {entry.company}
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
                <Text
                  style={{
                    fontSize: 11,
                    color: '#666666',
                  }}
                >
                  {entry.startDate} - {entry.endDate}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: '#666666',
                  }}
                >
                  {entry.city}
                </Text>
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

export default ManhattanInternshipsSection;
