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
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Text style={{ fontSize: LONDON_FONT_SIZE, fontWeight: 'bold' }}>
            {entry[titleKey]}
          </Text>
          {entry[subtitleKey] && (
            <Text style={{ fontSize: LONDON_FONT_SIZE }}>
              {entry[subtitleKey]}
            </Text>
          )}
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          {(entry.startDate || entry.endDate) && (
            <Text style={{ fontSize: LONDON_FONT_SIZE }}>
              {entry.startDate}
              {entry.endDate ? ` - ${entry.endDate}` : ''}
            </Text>
          )}
          {entry.city && (
            <Text style={{ fontSize: LONDON_FONT_SIZE }}>{entry.city}</Text>
          )}
        </View>
      </View>
      {entry.description && (
        <View style={{ marginTop: 0 }}>
          <Html
            style={{ fontSize: LONDON_FONT_SIZE }}
            renderers={pdfHtmlRenderers}
          >
            {entry.description}
          </Html>
        </View>
      )}
    </View>
  );
};

export default LondonSectionEntry;
