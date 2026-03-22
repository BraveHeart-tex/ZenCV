import { Text, View } from '@react-pdf/renderer';
import { Html } from 'react-pdf-html';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { pdfHtmlRenderers } from '../resumeTemplates.pdf';
import { type createTokyoStyles, TOKYO_FONT_SIZE } from './tokyo.styles';

export const TokyoSummarySection = ({
  summarySection,
  styles,
}: {
  summarySection: PdfTemplateData['summarySection'];
  styles: ReturnType<typeof createTokyoStyles>;
}) => {
  if (!summarySection?.summary) {
    return null;
  }

  return (
    <View style={styles.mainSection}>
      <Text style={styles.mainSectionLabel}>{summarySection.sectionName}</Text>
      <View style={{ marginTop: 6 }}>
        <Html
          style={{ fontSize: TOKYO_FONT_SIZE }}
          renderers={pdfHtmlRenderers}
        >
          {summarySection.summary}
        </Html>
      </View>
    </View>
  );
};
