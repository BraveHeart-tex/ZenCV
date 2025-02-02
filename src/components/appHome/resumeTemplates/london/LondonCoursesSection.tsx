import { Text, View } from '@react-pdf/renderer';
import { londonTemplateStyles } from '@/components/appHome/resumeTemplates/london/london.styles';
import {
  findValueInItemFields,
  getRenderableEntries,
} from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { PDF_BODY_FONT_SIZE } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { FIELD_NAMES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';

const LondonCoursesSection = ({
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
    <View
      style={{
        ...londonTemplateStyles.section,
        display: 'flex',
        flexDirection:
          sectionEntries.length === 1 &&
          sectionEntries.every((item) => !item.startDate && !item.endDate)
            ? 'row'
            : 'column',
        gap: 10,
      }}
    >
      <Text
        style={{
          ...londonTemplateStyles.sectionLabel,
          width: '23%',
        }}
      >
        {section?.title}
      </Text>
      <View
        style={{
          display: 'flex',
          gap: 10,
          width: '98%',
        }}
      >
        {sectionEntries.map((item) => (
          <View key={item.entryId}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                fontSize: PDF_BODY_FONT_SIZE,
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  width:
                    sectionEntries.length === 1 &&
                    sectionEntries.every(
                      (item) => !item.startDate && !item.endDate,
                    )
                      ? '0%'
                      : '33%',
                }}
              >
                {item.startDate}
                {item.endDate ? ` - ${item.endDate}` : ''}
              </Text>
              <View
                style={{
                  width: '96%',
                }}
              >
                <Text
                  style={{
                    fontWeight: 'medium',
                    fontSize: 10.9,
                  }}
                >
                  {item.course}
                  {item.institution
                    ? `${item.course ? ' -' : ''} ${item.institution}`
                    : null}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
export default LondonCoursesSection;
