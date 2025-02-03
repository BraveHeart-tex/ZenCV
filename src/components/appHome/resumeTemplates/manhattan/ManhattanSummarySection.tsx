import { manhattanTemplateStyles } from './manhattan.styles';
import { Text, View } from '@react-pdf/renderer';
import { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import Html from 'react-pdf-html';
import { pdfHtmlRenderers } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';

const ManhattanSummarySection = ({
  summarySection,
}: {
  summarySection: PdfTemplateData['summarySection'];
}) => {
  if (!summarySection?.summary) return null;

  return (
    <View style={manhattanTemplateStyles.section}>
      <Text style={manhattanTemplateStyles.sectionLabel}>
        {summarySection.sectionName}
      </Text>
      <View
        style={{
          marginTop: 5,
        }}
      >
        <Html style={{ fontSize: 11 }} renderers={pdfHtmlRenderers}>
          {summarySection.summary}
        </Html>
      </View>
    </View>
  );
};

export default ManhattanSummarySection;
