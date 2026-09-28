import { Document, Page } from '@react-pdf/renderer';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import {
  isCustomSection,
  mergePdfSections,
  renderSemanticPdfSection,
} from '../resumeTemplates.helpers';
import { ManhattanCoursesSection } from './ManhattanCoursesSection';
import { ManhattanCustomSection } from './ManhattanCustomSection';
import { ManhattanEducationSection } from './ManhattanEducationSection';
import { ManhattanHobbiesSection } from './ManhattanHobbiesSection';
import { ManhattanInternshipsSection } from './ManhattanInternshipsSection';
import { ManhattanLanguagesSection } from './ManhattanLanguagesSection';
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
    return mergePdfSections(templateData).map((section) => {
      const semanticSection = renderSemanticPdfSection(section, {
        hobbies: (semanticSection) => (
          <ManhattanHobbiesSection
            section={semanticSection}
            key={semanticSection.id}
          />
        ),
        workExperience: (semanticSection) => (
          <ManhattanWorkExperienceSection
            workExperienceSection={semanticSection}
            key={semanticSection.id}
          />
        ),
        education: (semanticSection) => (
          <ManhattanEducationSection
            section={semanticSection}
            key={semanticSection.id}
          />
        ),
        courses: (semanticSection) => (
          <ManhattanCoursesSection
            section={semanticSection}
            key={semanticSection.id}
          />
        ),
        internships: (semanticSection) => (
          <ManhattanInternshipsSection
            section={semanticSection}
            key={semanticSection.id}
          />
        ),
        skills: (semanticSection) => (
          <ManhattanSkillsSection
            section={semanticSection}
            key={semanticSection.id}
          />
        ),
        languages: (semanticSection) => (
          <ManhattanLanguagesSection
            section={semanticSection}
            key={semanticSection.id}
          />
        ),
        references: (semanticSection) => (
          <ManhattanReferencesSection
            section={semanticSection}
            key={semanticSection.id}
          />
        ),
      });
      if (semanticSection) {
        return semanticSection;
      }
      if (isCustomSection(section)) {
        return <ManhattanCustomSection section={section} key={section.id} />;
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
