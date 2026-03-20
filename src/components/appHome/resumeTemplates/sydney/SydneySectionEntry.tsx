import { Text, View } from '@react-pdf/renderer';
import Html from 'react-pdf-html';
import { pdfHtmlRenderers } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import type { WithEntryId } from '@/lib/types/documentBuilder.types';
import { SYDNEY_FONT_SIZE, sydneyTemplateStyles } from './sydney.styles';

type SydneySectionEntryProps<T extends Record<string, string>> = {
  entry: WithEntryId<T>;
  titleKey: keyof T;
  subtitleKey: keyof T;
};

export const SydneySectionEntry = <T extends Record<string, string>>({
  entry,
  titleKey,
  subtitleKey,
}: SydneySectionEntryProps<T>) => {
  const hasDate = entry.startDate || entry.endDate;
  const dateString = [entry.startDate, entry.endDate]
    .filter(Boolean)
    .join(' – ');

  return (
    <View style={sydneyTemplateStyles.entryWrapper}>
      {/* Left — date + city */}
      <View style={sydneyTemplateStyles.entryLeft}>
        {hasDate ? (
          <Text style={sydneyTemplateStyles.entryDate}>{dateString}</Text>
        ) : null}
        {entry.city ? (
          <Text style={sydneyTemplateStyles.entryCity}>{entry.city}</Text>
        ) : null}
      </View>

      {/* Right — content */}
      <View style={sydneyTemplateStyles.entryRight}>
        <Text style={sydneyTemplateStyles.entryTitle}>{entry[titleKey]}</Text>
        {entry[subtitleKey] ? (
          <Text style={sydneyTemplateStyles.entrySubtitle}>
            {entry[subtitleKey]}
          </Text>
        ) : null}
        {entry.description ? (
          <Html
            style={{ fontSize: SYDNEY_FONT_SIZE }}
            renderers={pdfHtmlRenderers}
          >
            {entry.description}
          </Html>
        ) : null}
      </View>
    </View>
  );
};
