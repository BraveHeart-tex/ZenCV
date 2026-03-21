import { Text, View } from '@react-pdf/renderer';
import { Html } from 'react-pdf-html';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { pdfHtmlRenderers } from '../resumeTemplates.pdf';
import { DUBAI_FONT_SIZE } from './dubai.styles';
import type { DubaiStyles } from './dubai.types';

export const DubaiSummarySection = ({
  summarySection,
  styles,
}: {
  summarySection: PdfTemplateData['summarySection'];
  styles: DubaiStyles;
}) => {
  if (!summarySection?.summary) {
    return null;
  }

  return (
    <View style={styles.mainSection}>
      <Text style={styles.mainSectionLabel}>{summarySection.sectionName}</Text>
      <Html style={{ fontSize: DUBAI_FONT_SIZE }} renderers={pdfHtmlRenderers}>
        {summarySection.summary}
      </Html>
    </View>
  );
};
