import { Text, View } from '@react-pdf/renderer';
import { Html } from 'react-pdf-html';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { pdfHtmlRenderers } from '../resumeTemplates.pdf';
import { DUBAI_FONT_SIZE, dubaiTemplateStyles } from './dubai.styles';

export const DubaiSummarySection = ({
  summarySection,
}: {
  summarySection: PdfTemplateData['summarySection'];
}) => {
  if (!summarySection?.summary) return null;

  return (
    <View style={dubaiTemplateStyles.mainSection}>
      <Text style={dubaiTemplateStyles.mainSectionLabel}>
        {summarySection.sectionName}
      </Text>
      <Html style={{ fontSize: DUBAI_FONT_SIZE }} renderers={pdfHtmlRenderers}>
        {summarySection.summary}
      </Html>
    </View>
  );
};
