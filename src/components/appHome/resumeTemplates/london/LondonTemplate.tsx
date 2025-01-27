import { Document, Page } from '@react-pdf/renderer';
import { PdfTemplateData } from '@/lib/types';
import LondonPersonalDetailsSection from '@/components/appHome/resumeTemplates/london/LondonPersonalDetailsSection';
import LondonSummarySection from '@/components/appHome/resumeTemplates/london/London.SummarySection';
import { londonTemplateStyles } from '@/components/appHome/resumeTemplates/london/london.styles';
import { INTERNAL_SECTION_TYPES } from '@/lib/constants';
import LondonWorkExperienceSection from '@/components/appHome/resumeTemplates/london/LondonWorkExperienceSection';

const LondonTemplate = ({
  templateData,
}: {
  templateData: PdfTemplateData;
}) => {
  const { personalDetails, summarySection } = templateData;

  const renderSections = () => {
    return templateData.sections.map((section) => {
      if (section.type === INTERNAL_SECTION_TYPES.WORK_EXPERIENCE) {
        return (
          <LondonWorkExperienceSection section={section} key={section.id} />
        );
      }

      return null;
    });
  };

  return (
    <Document>
      <Page size="A4" style={londonTemplateStyles.page}>
        <LondonPersonalDetailsSection personalDetails={personalDetails} />
        <LondonSummarySection summarySection={summarySection} />
        {renderSections()}
      </Page>
    </Document>
  );
};

export default LondonTemplate;
