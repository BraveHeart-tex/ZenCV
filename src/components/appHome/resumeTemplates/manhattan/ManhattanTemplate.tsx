import { Document, Page } from '@react-pdf/renderer';
import { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { INTERNAL_SECTION_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';

import ManhattanWorkExperienceSection from './ManhattanWorkExperienceSection';

import ManhattanCoursesSection from './ManhattanCoursesSection';
import ManhattanEducationSection from './ManhattanEducationSection';
import ManhattanLinksSection from './ManhattanLinksSection';
import ManhattanLanguagesSection from './ManhattanLanguagesSection';
import ManhattanInternshipsSection from './ManhattanInternshipsSection';
import ManhattanHobbiesSection from './ManhattanHobbiesSection';
import ManhattanCustomSection from './ManhattanCustomSection';
import ManhattanSkillsSection from './ManhattanSkillsSection';
import ManhattanReferencesSection from './ManhattanReferencesSection';
import { manhattanTemplateStyles } from './manhattan.styles';
import ManhattanPersonalDetailsSection from './ManhattanPersonalDetailsSection';
import ManhattanSummarySection from './ManhattanSummarySection';

const ManhattanTemplate = ({
  templateData,
}: {
  templateData: PdfTemplateData;
}) => {
  const { personalDetails, summarySection } = templateData;

  const renderSections = () => {
    return templateData.sections.map((section) => {
      if (section.type === INTERNAL_SECTION_TYPES.WORK_EXPERIENCE) {
        return (
          <ManhattanWorkExperienceSection section={section} key={section.id} />
        );
      }

      if (section.type === INTERNAL_SECTION_TYPES.EDUCATION) {
        return <ManhattanEducationSection section={section} key={section.id} />;
      }

      if (section.type === INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS) {
        return <ManhattanLinksSection section={section} key={section.id} />;
      }

      if (section.type === INTERNAL_SECTION_TYPES.LANGUAGES) {
        return <ManhattanLanguagesSection section={section} key={section.id} />;
      }

      if (section.type === INTERNAL_SECTION_TYPES.INTERNSHIPS) {
        return (
          <ManhattanInternshipsSection section={section} key={section.id} />
        );
      }

      if (section.type === INTERNAL_SECTION_TYPES.COURSES) {
        return <ManhattanCoursesSection section={section} key={section.id} />;
      }

      if (section.type === INTERNAL_SECTION_TYPES.HOBBIES) {
        return <ManhattanHobbiesSection section={section} key={section.id} />;
      }

      if (section.type === INTERNAL_SECTION_TYPES.CUSTOM) {
        return <ManhattanCustomSection section={section} key={section.id} />;
      }

      if (section.type === INTERNAL_SECTION_TYPES.SKILLS) {
        return <ManhattanSkillsSection section={section} key={section.id} />;
      }

      if (section.type === INTERNAL_SECTION_TYPES.REFERENCES) {
        return (
          <ManhattanReferencesSection section={section} key={section.id} />
        );
      }

      return null;
    });
  };

  return (
    <Document>
      <Page size="A4" style={manhattanTemplateStyles.page}>
        <ManhattanPersonalDetailsSection personalDetails={personalDetails} />
        <ManhattanSummarySection summarySection={summarySection} />
        {renderSections()}
      </Page>
    </Document>
  );
};

export default ManhattanTemplate;
