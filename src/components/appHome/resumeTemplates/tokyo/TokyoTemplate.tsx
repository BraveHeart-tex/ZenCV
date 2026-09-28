import { Document, Page, View } from '@react-pdf/renderer';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import {
  isCustomSection,
  isHobbiesSection,
  isLanguagesSection,
  isSidebarPdfSection,
  isSkillsSection,
  mergePdfSections,
  renderSemanticPdfSection,
} from '../resumeTemplates.helpers';
import { TokyoCoursesSection } from './TokyoCoursesSection';
import { TokyoCustomSection } from './TokyoCustomSection';
import { TokyoEducationSection } from './TokyoEducationSection';
import { TokyoHobbiesSection } from './TokyoHobbiesSection';
import { TokyoInternshipsSection } from './TokyoInternshipsSection';
import { TokyoLanguagesSection } from './TokyoLanguagesSection';
import { TokyoPersonalDetailsSection } from './TokyoPersonalDetailsSection';
import { TokyoReferencesSection } from './TokyoReferencesSection';
import { TokyoSkillsSection } from './TokyoSkillsSection';
import { TokyoSummarySection } from './TokyoSummarySection';
import { TokyoWorkExperienceSection } from './TokyoWorkExperienceSection';
import { createTokyoStyles } from './tokyo.styles';

export const TokyoTemplate = ({
  templateData,
}: {
  templateData: PdfTemplateData;
}) => {
  const styles = createTokyoStyles(templateData.accentColor);
  const { personalDetails, summarySection } = templateData;
  const sections = mergePdfSections(templateData);

  const sidebarSections = sections.filter(isSidebarPdfSection);
  const mainSections = sections.filter(
    (section) => !isSidebarPdfSection(section)
  );

  const renderSidebarSection = (section: (typeof sidebarSections)[number]) => {
    if (isHobbiesSection(section)) {
      return (
        <TokyoHobbiesSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    if (isSkillsSection(section)) {
      return (
        <TokyoSkillsSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    if (isLanguagesSection(section)) {
      return (
        <TokyoLanguagesSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    return null;
  };

  const renderMainSection = (section: (typeof sections)[number]) => {
    const semanticSection = renderSemanticPdfSection(section, {
      hobbies: () => null,
      workExperience: (semanticSection) => (
        <TokyoWorkExperienceSection
          workExperienceSection={semanticSection}
          key={semanticSection.id}
          styles={styles}
        />
      ),
      education: (semanticSection) => (
        <TokyoEducationSection
          section={semanticSection}
          key={semanticSection.id}
          styles={styles}
        />
      ),
      courses: (semanticSection) => (
        <TokyoCoursesSection
          section={semanticSection}
          styles={styles}
          key={semanticSection.id}
        />
      ),
      internships: (semanticSection) => (
        <TokyoInternshipsSection
          section={semanticSection}
          key={semanticSection.id}
          styles={styles}
        />
      ),
      skills: (semanticSection) => (
        <TokyoSkillsSection
          section={semanticSection}
          key={semanticSection.id}
          styles={styles}
        />
      ),
      languages: (semanticSection) => (
        <TokyoLanguagesSection
          section={semanticSection}
          key={semanticSection.id}
          styles={styles}
        />
      ),
      references: (semanticSection) => (
        <TokyoReferencesSection
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
        <TokyoCustomSection
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
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <TokyoPersonalDetailsSection
            personalDetails={personalDetails}
            styles={styles}
          />
          {sidebarSections.map(renderSidebarSection)}
        </View>

        {/* Main content */}
        <View style={styles.main}>
          <TokyoSummarySection
            summarySection={summarySection}
            styles={styles}
          />
          {mainSections.map(renderMainSection)}
        </View>
      </Page>
    </Document>
  );
};
