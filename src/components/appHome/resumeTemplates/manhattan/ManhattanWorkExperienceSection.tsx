import { Text, View } from '@react-pdf/renderer';
import {
  MANHATTAN_FONT_SIZE,
  manhattanTemplateStyles,
} from './manhattan.styles';
import { getWorkExperienceSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import Html from 'react-pdf-html';
import { pdfHtmlRenderers } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';

const ManhattanWorkExperienceSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getWorkExperienceSectionEntries(section);
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
                }}
              >
                <Text
                  style={{
                    fontSize: MANHATTAN_FONT_SIZE,
                    fontWeight: 'bold',
                  }}
                >
                  {entry.employer}
                </Text>
                <Text
                  style={{
                    fontSize: MANHATTAN_FONT_SIZE,
                  }}
                >
                  {entry.jobTitle}
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}
              >
                <Text
                  style={{
                    fontSize: MANHATTAN_FONT_SIZE,
                    fontWeight: 'bold',
                  }}
                >
                  {entry.startDate} - {entry.endDate}
                </Text>
                <Text
                  style={{
                    fontSize: MANHATTAN_FONT_SIZE,
                  }}
                >
                  {entry.city}
                </Text>
              </View>
            </View>
            {entry.description && (
              <View style={{ marginTop: 2 }}>
                <Html
                  style={{ fontSize: MANHATTAN_FONT_SIZE }}
                  renderers={pdfHtmlRenderers}
                >
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

export default ManhattanWorkExperienceSection;
