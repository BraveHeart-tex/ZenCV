import { Document, Page } from '@react-pdf/renderer';
import { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import LondonPersonalDetailsSection from './LondonPersonalDetailsSection';
import { londonTemplateStyles } from './london.styles';
import LondonSummarySection from './LondonSummarySection';
import LondonEducationSection from './LondonEducationSection';
import { INTERNAL_SECTION_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';

const LondonTemplate = ({
  templateData,
}: {
  templateData: PdfTemplateData;
}) => {
  const { personalDetails, summarySection } = templateData;

  const renderSections = () => {
    return templateData.sections.map((section) => {
      //   if (section.type === INTERNAL_SECTION_TYPES.WORK_EXPERIENCE) {
      //     return (
      //       <LondonWorkExperienceSection section={section} key={section.id} />
      //     );
      //   }

      if (section.type === INTERNAL_SECTION_TYPES.EDUCATION) {
        return <LondonEducationSection section={section} key={section.id} />;
      }

      //   if (section.type === INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS) {
      //     return <LondonLinksSection section={section} key={section.id} />;
      //   }

      //   if (section.type === INTERNAL_SECTION_TYPES.LANGUAGES) {
      //     return <LondonLanguagesSection section={section} key={section.id} />;
      //   }

      //   if (section.type === INTERNAL_SECTION_TYPES.INTERNSHIPS) {
      //     return <LondonInternshipsSection section={section} key={section.id} />;
      //   }

      //   if (section.type === INTERNAL_SECTION_TYPES.COURSES) {
      //     return <LondonCoursesSection section={section} key={section.id} />;
      //   }

      //   if (section.type === INTERNAL_SECTION_TYPES.HOBBIES) {
      //     return <LondonHobbiesSection section={section} key={section.id} />;
      //   }

      //   if (section.type === INTERNAL_SECTION_TYPES.CUSTOM) {
      //     return <LondonCustomSection section={section} key={section.id} />;
      //   }

      //   if (section.type === INTERNAL_SECTION_TYPES.SKILLS) {
      //     return <LondonSkillsSection section={section} key={section.id} />;
      //   }

      //   if (section.type === INTERNAL_SECTION_TYPES.REFERENCES) {
      //     return <LondonReferencesSection section={section} key={section.id} />;
      //   }

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
