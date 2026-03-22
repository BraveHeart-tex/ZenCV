import { Text, View } from '@react-pdf/renderer';
import Html from 'react-pdf-html';
import { pdfHtmlRenderers } from '@/components/appHome/resumeTemplates/resumeTemplates.pdf';
import type { WithEntryId } from '@/lib/types/documentBuilder.types';
import { SYDNEY_FONT_SIZE } from './sydney.styles';
import type { SydneyStyles } from './sydney.types';

type SydneySectionEntryProps<T extends Record<string, string>> = {
  entry: WithEntryId<T>;
  titleKey: keyof T;
  subtitleKey: keyof T;
  styles: SydneyStyles;
};

export const SydneySectionEntry = <T extends Record<string, string>>({
  entry,
  titleKey,
  subtitleKey,
  styles,
}: SydneySectionEntryProps<T>) => {
  const hasDate = entry.startDate || entry.endDate;
  const dateString = [entry.startDate, entry.endDate]
    .filter(Boolean)
    .join(' – ');

  return (
    <View style={styles.entryWrapper}>
      {/* Left — date + city */}
      <View style={styles.entryLeft}>
        {hasDate ? <Text style={styles.entryDate}>{dateString}</Text> : null}
        {entry.city ? <Text style={styles.entryCity}>{entry.city}</Text> : null}
      </View>

      {/* Right — content */}
      <View style={styles.entryRight}>
        <Text style={styles.entryTitle}>{entry[titleKey]}</Text>
        {entry[subtitleKey] ? (
          <Text style={styles.entrySubtitle}>{entry[subtitleKey]}</Text>
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
