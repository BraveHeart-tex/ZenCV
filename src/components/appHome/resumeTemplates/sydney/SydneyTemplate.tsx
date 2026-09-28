import { Document, Page } from '@react-pdf/renderer';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import {
  isCustomSection,
  mergePdfSections,
  renderSemanticPdfSection,
} from '../resumeTemplates.helpers';
import { SydneyCoursesSection } from './SydneyCoursesSection';
import { SydneyCustomSection } from './SydneyCustomSection';
import { SydneyEducationSection } from './SydneyEducationSection';
import { SydneyHobbiesSection } from './SydneyHobbiesSection';
import { SydneyInternshipsSection } from './SydneyInternshipsSection';
import { SydneyLanguagesSection } from './SydneyLanguagesSection';
import { SydneyPersonalDetailsSection } from './SydneyPersonalDetailsSection';
import { SydneyReferencesSection } from './SydneyReferencesSection';
import { SydneySkillsSection } from './SydneySkillsSection';
import { SydneySummarySection } from './SydneySummarySection';
import { SydneyWorkExperienceSection } from './SydneyWorkExperienceSection';
import { createSydneyStyles } from './sydney.styles';

export const SydneyTemplate = ({
  templateData,
}: {
  templateData: PdfTemplateData;
}) => {
  const styles = createSydneyStyles(templateData.accentColor);
  const { personalDetails, summarySection } = templateData;
  const sections = mergePdfSections(templateData);

  const renderSection = (section: (typeof sections)[number]) => {
    const semanticSection = renderSemanticPdfSection(section, {
      hobbies: (semanticSection) => (
        <SydneyHobbiesSection
          section={semanticSection}
          key={semanticSection.id}
          styles={styles}
        />
      ),
      workExperience: (semanticSection) => (
        <SydneyWorkExperienceSection
          workExperienceSection={semanticSection}
          key={semanticSection.id}
          styles={styles}
        />
      ),
      education: (semanticSection) => (
        <SydneyEducationSection
          section={semanticSection}
          key={semanticSection.id}
          styles={styles}
        />
      ),
      courses: (semanticSection) => (
        <SydneyCoursesSection
          section={semanticSection}
          styles={styles}
          key={semanticSection.id}
        />
      ),
      internships: (semanticSection) => (
        <SydneyInternshipsSection
          section={semanticSection}
          key={semanticSection.id}
          styles={styles}
        />
      ),
      skills: (semanticSection) => (
        <SydneySkillsSection
          section={semanticSection}
          key={semanticSection.id}
          styles={styles}
        />
      ),
      languages: (semanticSection) => (
        <SydneyLanguagesSection
          section={semanticSection}
          key={semanticSection.id}
          styles={styles}
        />
      ),
      references: (semanticSection) => (
        <SydneyReferencesSection
          section={semanticSection}
          key={semanticSection.id}
          styles={styles}
        />
      ),
    });
    if (semanticSection) {
      return semanticSection;
    }
    if (isCustomSection(section)) {
      return (
        <SydneyCustomSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    return null;
  };

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <SydneyPersonalDetailsSection
          personalDetails={personalDetails}
          styles={styles}
        />
        <SydneySummarySection summarySection={summarySection} styles={styles} />
        {sections.map(renderSection)}
      </Page>
    </Document>
  );
};
