import { Text, View } from '@react-pdf/renderer';
import Html from 'react-pdf-html';
import { pdfHtmlRenderers } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import type { WithEntryId } from '@/lib/types/documentBuilder.types';
import { LONDON_FONT_SIZE } from './london.styles';

type LondonSectionEntryProps<T extends Record<string, string>> = {
  entry: WithEntryId<T>;
  titleKey: keyof T;
  subtitleKey: keyof T;
};

export const LondonSectionEntry = <T extends Record<string, string>>({
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
          width: '100%',
          gap: 16,
        }}
      >
        <View style={{ width: '20%' }}>
          {(entry.startDate || entry.endDate) && (
            <Text
              style={{
                fontSize: LONDON_FONT_SIZE,
              }}
            >
              {entry.startDate}
              {entry.startDate && entry.endDate ? ' - ' : ''}
              {entry.endDate}
            </Text>
          )}
        </View>
        <View style={{ width: '80%' }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 4,
              width: '100%',
              gap: 16,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: LONDON_FONT_SIZE, fontWeight: 'bold' }}>
                {entry[titleKey]}
              </Text>
              {entry[subtitleKey] && (
                <Text
                  style={{
                    fontSize: LONDON_FONT_SIZE,
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                  }}
                >
                  {entry[subtitleKey]}
                </Text>
              )}
            </View>
            {entry.city && (
              <Text style={{ fontSize: LONDON_FONT_SIZE }}>{entry.city}</Text>
            )}
          </View>
          {entry.description && (
            <View style={{ width: '100%' }}>
              <Html
                style={{ fontSize: LONDON_FONT_SIZE }}
                renderers={pdfHtmlRenderers}
              >
                {entry.description}
              </Html>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
