import { PdfTemplateData } from '@/lib/types';
import { removeHTMLTags } from '@/lib/utils/stringUtils';
import { Text, View } from '@react-pdf/renderer';
import { londonTemplateStyles } from '@/components/appHome/resumeTemplates/london/london.styles';
import Html from 'react-pdf-html';
import {
  PDF_BODY_FONT_SIZE,
  pdfHtmlRenderers,
} from '@/components/appHome/resumeTemplates/resumeTemplates.constants';

const LondonSummarySection = ({
  summarySection,
}: {
  summarySection: PdfTemplateData['summarySection'];
}) => {
  const { summary } = summarySection;

  return removeHTMLTags(summary)?.length ? (
    <View style={londonTemplateStyles.section}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Text
          style={{
            ...londonTemplateStyles.sectionLabel,
            height: '100%',
          }}
        >
          {summarySection?.sectionName}
        </Text>
        <View
          style={{
            width: '75%',
          }}
        >
          <Html
            style={{
              fontSize: PDF_BODY_FONT_SIZE,
            }}
            renderers={pdfHtmlRenderers}
          >
            {summary}
          </Html>
        </View>
      </View>
    </View>
  ) : null;
};

export default LondonSummarySection;
