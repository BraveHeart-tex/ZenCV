import { Text, View } from '@react-pdf/renderer';
import { Html } from 'react-pdf-html';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { pdfHtmlRenderers } from '../resumeTemplates.pdf';
import { SYDNEY_FONT_SIZE } from './sydney.styles';
import type { SydneyStyles } from './sydney.types';

export const SydneySummarySection = ({
  summarySection,
  styles,
}: {
  summarySection: PdfTemplateData['summarySection'];
  styles: SydneyStyles;
}) => {
  if (!summarySection?.summary) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{summarySection.sectionName}</Text>
      <Html style={{ fontSize: SYDNEY_FONT_SIZE }} renderers={pdfHtmlRenderers}>
        {summarySection.summary}
      </Html>
    </View>
  );
};
