import { Document, Page } from '@react-pdf/renderer';
import { INTERNAL_SECTION_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { ManhattanCoursesSection } from './ManhattanCoursesSection';
import { ManhattanCustomSection } from './ManhattanCustomSection';
import { ManhattanEducationSection } from './ManhattanEducationSection';
import { ManhattanHobbiesSection } from './ManhattanHobbiesSection';
import { ManhattanInternshipsSection } from './ManhattanInternshipsSection';
import { ManhattanLanguagesSection } from './ManhattanLanguagesSection';
import { ManhattanLinksSection } from './ManhattanLinksSection';
import { ManhattanPersonalDetailsSection } from './ManhattanPersonalDetailsSection';
import { ManhattanReferencesSection } from './ManhattanReferencesSection';
import { ManhattanSkillsSection } from './ManhattanSkillsSection';
import { ManhattanSummarySection } from './ManhattanSummarySection';
import { ManhattanWorkExperienceSection } from './ManhattanWorkExperienceSection';
import { manhattanTemplateStyles } from './manhattan.styles';

export const ManhattanTemplate = ({
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
      <Page size='A4' style={manhattanTemplateStyles.page}>
        <ManhattanPersonalDetailsSection personalDetails={personalDetails} />
        <ManhattanSummarySection summarySection={summarySection} />
        {renderSections()}
      </Page>
    </Document>
  );
};
