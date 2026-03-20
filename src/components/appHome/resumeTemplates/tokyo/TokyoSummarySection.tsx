import { Text, View } from '@react-pdf/renderer';
import { Html } from 'react-pdf-html';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { pdfHtmlRenderers } from '../resumeTemplates.constants';
import { TOKYO_FONT_SIZE, tokyoTemplateStyles } from './tokyo.styles';

export const TokyoSummarySection = ({
  summarySection,
}: {
  summarySection: PdfTemplateData['summarySection'];
}) => {
  if (!summarySection?.summary) return null;

  return (
    <View style={tokyoTemplateStyles.mainSection}>
      <Text style={tokyoTemplateStyles.mainSectionLabel}>
        {summarySection.sectionName}
      </Text>
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
