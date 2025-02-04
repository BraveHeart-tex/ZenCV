import { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { LONDON_FONT_SIZE, londonTemplateStyles } from './london.styles';
import { Text, View } from '@react-pdf/renderer';
import { Html } from 'react-pdf-html';
import { pdfHtmlRenderers } from '../resumeTemplates.constants';

const LondonSummarySection = ({
  summarySection,
}: {
  summarySection: PdfTemplateData['summarySection'];
}) => {
  if (!summarySection?.summary) return null;

  return (
    <View style={londonTemplateStyles.section}>
      <Text style={londonTemplateStyles.sectionLabel}>
        {summarySection.sectionName}
      </Text>
      <View
        style={{
          marginTop: 2,
        }}
      >
        <Html
          style={{ fontSize: LONDON_FONT_SIZE }}
          renderers={pdfHtmlRenderers}
        >
          {summarySection.summary}
        </Html>
      </View>
    </View>
  );
};
export default LondonSummarySection;
