import { Document, Page } from '@react-pdf/renderer';
import { INTERNAL_SECTION_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { LondonCoursesSection } from './LondonCoursesSection';
import { LondonCustomSection } from './LondonCustomSection';
import { LondonEducationSection } from './LondonEducationSection';
import { LondonHobbiesSection } from './LondonHobbiesSection';
import { LondonInternshipsSection } from './LondonInternshipsSection';
import { LondonLanguagesSection } from './LondonLanguagesSection';
import { LondonLinksSection } from './LondonLinksSection';
import { LondonPersonalDetailsSection } from './LondonPersonalDetailsSection';
import { LondonReferencesSection } from './LondonReferencesSection';
import { LondonSkillsSection } from './LondonSkillsSection';
import { LondonSummarySection } from './LondonSummarySection';
import { LondonWorkExperienceSection } from './LondonWorkExperienceSection';
import { londonTemplateStyles } from './london.styles';

export const LondonTemplate = ({
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

      if (section.type === INTERNAL_SECTION_TYPES.EDUCATION) {
        return <LondonEducationSection section={section} key={section.id} />;
      }

      if (section.type === INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS) {
        return <LondonLinksSection section={section} key={section.id} />;
      }

      if (section.type === INTERNAL_SECTION_TYPES.LANGUAGES) {
        return <LondonLanguagesSection section={section} key={section.id} />;
      }

      if (section.type === INTERNAL_SECTION_TYPES.INTERNSHIPS) {
        return <LondonInternshipsSection section={section} key={section.id} />;
      }

      if (section.type === INTERNAL_SECTION_TYPES.COURSES) {
        return <LondonCoursesSection section={section} key={section.id} />;
      }

      if (section.type === INTERNAL_SECTION_TYPES.HOBBIES) {
        return <LondonHobbiesSection section={section} key={section.id} />;
      }

      if (section.type === INTERNAL_SECTION_TYPES.CUSTOM) {
        return <LondonCustomSection section={section} key={section.id} />;
      }

      if (section.type === INTERNAL_SECTION_TYPES.SKILLS) {
        return <LondonSkillsSection section={section} key={section.id} />;
      }

      if (section.type === INTERNAL_SECTION_TYPES.REFERENCES) {
        return <LondonReferencesSection section={section} key={section.id} />;
      }

      return null;
    });
  };

  return (
    <Document>
      <Page size='A4' style={londonTemplateStyles.page}>
        <LondonPersonalDetailsSection personalDetails={personalDetails} />
        <LondonSummarySection summarySection={summarySection} />
        {renderSections()}
      </Page>
    </Document>
  );
};
