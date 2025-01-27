import { Document, Page } from '@react-pdf/renderer';
import { observer } from 'mobx-react-lite';
import { PdfTemplateData } from '@/lib/types';
import LondonPersonalDetailsSection from '@/components/appHome/resumeTemplates/london/LondonPersonalDetailsSection';
import LondonSummarySection from '@/components/appHome/resumeTemplates/london/London.SummarySection';
import { londonTemplateStyles } from '@/components/appHome/resumeTemplates/london/london.styles';

const LondonTemplate = observer(
  ({ templateData }: { templateData: PdfTemplateData }) => {
    const { personalDetails, summarySection } = templateData;

    return (
      <Document>
        <Page size="A4" style={londonTemplateStyles.page}>
          <LondonPersonalDetailsSection personalDetails={personalDetails} />
          <LondonSummarySection summarySection={summarySection} />
        </Page>
      </Document>
    );
  },
);

export default LondonTemplate;
