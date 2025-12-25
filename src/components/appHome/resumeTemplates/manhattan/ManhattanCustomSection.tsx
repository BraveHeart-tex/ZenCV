import { Text, View } from '@react-pdf/renderer';
import Html from 'react-pdf-html';
import { pdfHtmlRenderers } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { getCustomSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import {
  MANHATTAN_FONT_SIZE,
  manhattanTemplateStyles,
} from './manhattan.styles';

export const ManhattanCustomSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getCustomSectionEntries(section);

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
                  {entry.name}
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}
              >
                {(entry.startDate || entry.endDate) && (
                  <Text
                    style={{
                      fontSize: MANHATTAN_FONT_SIZE,
                      fontWeight: 'bold',
                    }}
                  >
                    {entry.startDate}
                    {entry.endDate && entry.startDate
                      ? ` - ${entry.endDate}`
                      : ''}
                  </Text>
                )}
                {entry.city && (
                  <Text
                    style={{
                      fontSize: MANHATTAN_FONT_SIZE,
                    }}
                  >
                    {entry.city}
                  </Text>
                )}
              </View>
            </View>
            {entry.description && (
              <View>
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
