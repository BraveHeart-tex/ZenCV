import { Text, View } from '@react-pdf/renderer';
import { manhattanTemplateStyles } from './manhattan.styles';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { FIELD_NAMES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import {
  findValueInItemFields,
  getRenderableEntries,
} from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';

const ManhattanCoursesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getRenderableEntries(
    section.items.map((item) => {
      const fields = item.fields;
      return {
        entryId: crypto.randomUUID(),
        course: findValueInItemFields(fields, FIELD_NAMES.COURSES.COURSE),
        institution: findValueInItemFields(
          fields,
          FIELD_NAMES.COURSES.INSTITUTION,
        ),
        startDate: findValueInItemFields(
          fields,
          FIELD_NAMES.COURSES.START_DATE,
        ),
        endDate: findValueInItemFields(fields, FIELD_NAMES.COURSES.END_DATE),
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
                  {entry.course}
                </Text>
                {entry.institution && (
                  <Text
                    style={{
                      fontSize: 11,
                      color: '#666666',
                    }}
                  >
                    {entry.institution}
                  </Text>
                )}
              </View>
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
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ManhattanCoursesSection;
