import { Text, View } from '@react-pdf/renderer';
import Html from 'react-pdf-html';
import { pdfHtmlRenderers } from '@/components/appHome/resumeTemplates/resumeTemplates.pdf';
import type { WithEntryId } from '@/lib/types/documentBuilder.types';
import { TOKYO_FONT_SIZE, tokyoTemplateStyles } from './tokyo.styles';

type TokyoSectionEntryProps<T extends Record<string, string>> = {
  entry: WithEntryId<T>;
  titleKey: keyof T;
  subtitleKey: keyof T;
};

export const TokyoSectionEntry = <T extends Record<string, string>>({
  entry,
  titleKey,
  subtitleKey,
}: TokyoSectionEntryProps<T>) => {
  const hasDate = entry.startDate || entry.endDate;
  const dateString = [entry.startDate, entry.endDate]
    .filter(Boolean)
    .join(' – ');

  return (
    <View style={{ marginBottom: 10 }}>
      {/* Title row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 1,
        }}
      >
        <Text style={tokyoTemplateStyles.entryTitle}>{entry[titleKey]}</Text>
        {entry.city ? (
          <Text style={tokyoTemplateStyles.entryDate}>{entry.city}</Text>
        ) : null}
      </View>

      {/* Subtitle + date row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}
      >
        {entry[subtitleKey] ? (
          <Text style={tokyoTemplateStyles.entrySubtitle}>
            {entry[subtitleKey]}
          </Text>
        ) : null}
        {hasDate ? (
          <Text style={tokyoTemplateStyles.entryDate}>{dateString}</Text>
        ) : null}
      </View>

      {/* Description */}
      {entry.description ? (
        <View>
          <Html
            style={{ fontSize: TOKYO_FONT_SIZE }}
            renderers={pdfHtmlRenderers}
          >
            {entry.description}
          </Html>
        </View>
      ) : null}
    </View>
  );
};
