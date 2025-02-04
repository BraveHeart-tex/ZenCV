import { Text, View } from '@react-pdf/renderer';
import {
  MANHATTAN_FONT_SIZE,
  manhattanTemplateStyles,
} from './manhattan.styles';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { getCoursesSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';

const ManhattanCoursesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getCoursesSectionEntries(section);
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
                    fontSize: MANHATTAN_FONT_SIZE,
                    fontWeight: 'bold',
                  }}
                >
                  {entry.course}
                </Text>
                {entry.institution && (
                  <Text
                    style={{
                      fontSize: MANHATTAN_FONT_SIZE,
                    }}
                  >
                    {entry.institution}
                  </Text>
                )}
              </View>
              {(entry.startDate || entry.endDate) && (
                <Text
                  style={{
                    fontSize: MANHATTAN_FONT_SIZE,
                    fontWeight: 'bold',
                  }}
                >
                  {entry.startDate}
                  {entry.endDate
                    ? ` ${entry.startDate ? ' - ' : ''} ${entry.endDate}`
                    : ''}
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
