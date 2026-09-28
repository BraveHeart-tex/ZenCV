import { Document, Page } from '@react-pdf/renderer';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import {
  isCustomSection,
  mergePdfSections,
  renderSemanticPdfSection,
} from '../resumeTemplates.helpers';
import { LondonCoursesSection } from './LondonCoursesSection';
import { LondonCustomSection } from './LondonCustomSection';
import { LondonEducationSection } from './LondonEducationSection';
import { LondonHobbiesSection } from './LondonHobbiesSection';
import { LondonInternshipsSection } from './LondonInternshipsSection';
import { LondonLanguagesSection } from './LondonLanguagesSection';
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
    return mergePdfSections(templateData).map((section) => {
      const semanticSection = renderSemanticPdfSection(section, {
        hobbies: (semanticSection) => (
          <LondonHobbiesSection
            section={semanticSection}
            key={semanticSection.id}
          />
        ),
        workExperience: (semanticSection) => (
          <LondonWorkExperienceSection
            workExperienceSection={semanticSection}
            key={semanticSection.id}
          />
        ),
        education: (semanticSection) => (
          <LondonEducationSection
            section={semanticSection}
            key={semanticSection.id}
          />
        ),
        courses: (semanticSection) => (
          <LondonCoursesSection
            section={semanticSection}
            key={semanticSection.id}
          />
        ),
        internships: (semanticSection) => (
          <LondonInternshipsSection
            section={semanticSection}
            key={semanticSection.id}
          />
        ),
        skills: (semanticSection) => (
          <LondonSkillsSection
            section={semanticSection}
            key={semanticSection.id}
          />
        ),
        languages: (semanticSection) => (
          <LondonLanguagesSection
            section={semanticSection}
            key={semanticSection.id}
          />
        ),
        references: (semanticSection) => (
          <LondonReferencesSection
            section={semanticSection}
            key={semanticSection.id}
          />
        ),
      });
      if (semanticSection) {
        return semanticSection;
      }
      if (isCustomSection(section)) {
        return <LondonCustomSection section={section} key={section.id} />;
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
