import { Text, View } from '@react-pdf/renderer';
import { LONDON_FONT_SIZE } from './london.styles';
import { WithEntryId } from '@/lib/types/documentBuilder.types';
import Html from 'react-pdf-html';
import { pdfHtmlRenderers } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';

type LondonSectionEntryProps<T extends Record<string, string>> = {
  entry: WithEntryId<T>;
  titleKey: keyof T;
  subtitleKey: keyof T;
};

const LondonSectionEntry = <T extends Record<string, string>>({
  entry,
  titleKey,
  subtitleKey,
}: LondonSectionEntryProps<T>) => {
  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 4,
          gap: 16,
          width: '100%',
        }}
      >
        <View style={{ minWidth: '15%', maxWidth: '25%', marginRight: 16 }}>
          {(entry.startDate || entry.endDate) && (
            <Text
              style={{
                fontSize: LONDON_FONT_SIZE,
                paddingLeft: 0,
                marginLeft: 0,
              }}
            >
              {entry.startDate}
              {entry.startDate ? ' - ' : ''}
              {entry.endDate}
            </Text>
          )}
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            flex: 1,
          }}
        >
          <Text style={{ fontSize: LONDON_FONT_SIZE, fontWeight: 'bold' }}>
            {entry[titleKey]}
          </Text>
          {entry[subtitleKey] && (
            <Text style={{ fontSize: LONDON_FONT_SIZE, fontStyle: 'italic' }}>
              {entry[subtitleKey]}
            </Text>
          )}
          {entry.description && (
            <View>
              <Html
                style={{ fontSize: LONDON_FONT_SIZE }}
                renderers={pdfHtmlRenderers}
              >
                {entry.description}
              </Html>
            </View>
          )}
        </View>
        <View style={{ minWidth: '15%', alignItems: 'flex-end' }}>
          {entry.city && (
            <Text style={{ fontSize: LONDON_FONT_SIZE }}>{entry.city}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default LondonSectionEntry;
