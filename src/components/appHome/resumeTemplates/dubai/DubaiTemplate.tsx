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
import { DubaiCoursesSection } from './DubaiCoursesSection';
import { DubaiCustomSection } from './DubaiCustomSection';
import { DubaiEducationSection } from './DubaiEducationSection';
import { DubaiHobbiesSection } from './DubaiHobbiesSection';
import { DubaiInternshipsSection } from './DubaiInternshipsSection';
import { DubaiLanguagesSection } from './DubaiLanguagesSection';
import { DubaiPersonalDetailsSection } from './DubaiPersonalDetailsSection';
import { DubaiReferencesSection } from './DubaiReferencesSection';
import { DubaiSkillsSection } from './DubaiSkillsSection';
import { DubaiSummarySection } from './DubaiSummarySection';
import { DubaiWorkExperienceSection } from './DubaiWorkExperienceSection';
import { createDubaiStyles } from './dubai.styles';

export const DubaiTemplate = ({
  templateData,
}: {
  templateData: PdfTemplateData;
}) => {
  const styles = createDubaiStyles(templateData.accentColor);
  const { personalDetails, summarySection } = templateData;
  const sections = mergePdfSections(templateData);

  const sidebarSections = sections.filter(isSidebarPdfSection);
  const mainSections = sections.filter(
    (section) => !isSidebarPdfSection(section)
  );

  const renderSidebarSection = (section: (typeof sidebarSections)[number]) => {
    if (isHobbiesSection(section)) {
      return (
        <DubaiHobbiesSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    if (isSkillsSection(section)) {
      return (
        <DubaiSkillsSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }

    if (isLanguagesSection(section)) {
      return (
        <DubaiLanguagesSection
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
        <DubaiWorkExperienceSection
          workExperienceSection={semanticSection}
          key={semanticSection.id}
          styles={styles}
        />
      ),
      education: (semanticSection) => (
        <DubaiEducationSection
          section={semanticSection}
          key={semanticSection.id}
          styles={styles}
        />
      ),
      courses: (semanticSection) => (
        <DubaiCoursesSection
          section={semanticSection}
          styles={styles}
          key={semanticSection.id}
        />
      ),
      internships: (semanticSection) => (
        <DubaiInternshipsSection
          section={semanticSection}
          key={semanticSection.id}
          styles={styles}
        />
      ),
      skills: (semanticSection) => (
        <DubaiSkillsSection
          section={semanticSection}
          key={semanticSection.id}
          styles={styles}
        />
      ),
      languages: (semanticSection) => (
        <DubaiLanguagesSection
          section={semanticSection}
          key={semanticSection.id}
          styles={styles}
        />
      ),
      references: (semanticSection) => (
        <DubaiReferencesSection
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
        <DubaiCustomSection
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
        {/* Light sidebar */}
        <View style={styles.sidebar}>
          <DubaiPersonalDetailsSection
            personalDetails={personalDetails}
            styles={styles}
          />
          {sidebarSections.map(renderSidebarSection)}
        </View>

        {/* Main column */}
        <View style={styles.main}>
          <DubaiSummarySection
            summarySection={summarySection}
            styles={styles}
          />
          {mainSections.map(renderMainSection)}
        </View>
      </Page>
    </Document>
  );
};
