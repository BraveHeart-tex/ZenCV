import { Text, View } from '@react-pdf/renderer';
import Html from 'react-pdf-html';
import { pdfHtmlRenderers } from '@/components/appHome/resumeTemplates/resumeTemplates.pdf';
import type { WithEntryId } from '@/lib/types/documentBuilder.types';
import { DUBAI_FONT_SIZE, dubaiTemplateStyles } from './dubai.styles';

type DubaiSectionEntryProps<T extends Record<string, string>> = {
  entry: WithEntryId<T>;
  titleKey: keyof T;
  subtitleKey: keyof T;
};

export const DubaiSectionEntry = <T extends Record<string, string>>({
  entry,
  titleKey,
  subtitleKey,
}: DubaiSectionEntryProps<T>) => {
  const hasDate = entry.startDate || entry.endDate;
  const dateString = [entry.startDate, entry.endDate]
    .filter(Boolean)
    .join(' – ');

  return (
    <View style={dubaiTemplateStyles.entryWrapper}>
      <Text style={dubaiTemplateStyles.entryTitle}>{entry[titleKey]}</Text>
      {entry[subtitleKey] ? (
        <Text style={dubaiTemplateStyles.entrySubtitle}>
          {entry[subtitleKey]}
        </Text>
      ) : null}
      {hasDate || entry.city ? (
        <View style={dubaiTemplateStyles.entryMeta}>
          {hasDate ? (
            <Text style={dubaiTemplateStyles.entryDate}>{dateString}</Text>
          ) : null}
          {entry.city ? (
            <Text style={dubaiTemplateStyles.entryCity}>{entry.city}</Text>
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
