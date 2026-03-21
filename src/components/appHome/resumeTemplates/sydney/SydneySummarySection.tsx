import { Text, View } from '@react-pdf/renderer';
import { Html } from 'react-pdf-html';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { pdfHtmlRenderers } from '../resumeTemplates.pdf';
import { SYDNEY_FONT_SIZE, sydneyTemplateStyles } from './sydney.styles';

export const SydneySummarySection = ({
  summarySection,
}: {
  summarySection: PdfTemplateData['summarySection'];
}) => {
  if (!summarySection?.summary) return null;

  return (
    <View style={sydneyTemplateStyles.section}>
      <Text style={sydneyTemplateStyles.sectionLabel}>
        {summarySection.sectionName}
      </Text>
      <Html style={{ fontSize: SYDNEY_FONT_SIZE }} renderers={pdfHtmlRenderers}>
        {summarySection.summary}
      </Html>
    </View>
  );
};
