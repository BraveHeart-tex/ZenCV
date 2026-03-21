import { Text, View } from '@react-pdf/renderer';
import Html from 'react-pdf-html';
import { pdfHtmlRenderers } from '@/components/appHome/resumeTemplates/resumeTemplates.pdf';
import type { WithEntryId } from '@/lib/types/documentBuilder.types';
import { DUBAI_FONT_SIZE } from './dubai.styles';
import type { DubaiStyles } from './dubai.types';

type DubaiSectionEntryProps<T extends Record<string, string>> = {
  entry: WithEntryId<T>;
  titleKey: keyof T;
  subtitleKey: keyof T;
  styles: DubaiStyles;
};

export const DubaiSectionEntry = <T extends Record<string, string>>({
  entry,
  titleKey,
  subtitleKey,
  styles,
}: DubaiSectionEntryProps<T>) => {
  const hasDate = entry.startDate || entry.endDate;
  const dateString = [entry.startDate, entry.endDate]
    .filter(Boolean)
    .join(' – ');

  return (
    <View style={styles.entryWrapper}>
      <Text style={styles.entryTitle}>{entry[titleKey]}</Text>
      {entry[subtitleKey] ? (
        <Text style={styles.entrySubtitle}>{entry[subtitleKey]}</Text>
      ) : null}
      {hasDate || entry.city ? (
        <View style={styles.entryMeta}>
          {hasDate ? <Text style={styles.entryDate}>{dateString}</Text> : null}
          {entry.city ? (
            <Text style={styles.entryCity}>{entry.city}</Text>
          ) : null}
        </View>
      ) : null}
      {entry.description ? (
        <Html
          style={{ fontSize: DUBAI_FONT_SIZE }}
          renderers={pdfHtmlRenderers}
        >
          {entry.description}
        </Html>
      ) : null}
    </View>
  );
};
