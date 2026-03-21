import { Document, Page, View } from '@react-pdf/renderer';
import { INTERNAL_SECTION_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { TokyoCoursesSection } from './TokyoCoursesSection';
import { TokyoCustomSection } from './TokyoCustomSection';
import { TokyoEducationSection } from './TokyoEducationSection';
import { TokyoHobbiesSection } from './TokyoHobbiesSection';
import { TokyoInternshipsSection } from './TokyoInternshipsSection';
import { TokyoLanguagesSection } from './TokyoLanguagesSection';
import { TokyoLinksSection } from './TokyoLinksSection';
import { TokyoPersonalDetailsSection } from './TokyoPersonalDetailsSection';
import { TokyoReferencesSection } from './TokyoReferencesSection';
import { TokyoSkillsSection } from './TokyoSkillsSection';
import { TokyoSummarySection } from './TokyoSummarySection';
import { TokyoWorkExperienceSection } from './TokyoWorkExperienceSection';
import { createTokyoStyles } from './tokyo.styles';

const SIDEBAR_SECTION_TYPES = new Set([
  INTERNAL_SECTION_TYPES.SKILLS,
  INTERNAL_SECTION_TYPES.LANGUAGES,
  INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS,
  INTERNAL_SECTION_TYPES.HOBBIES,
]);

export const TokyoTemplate = ({
  templateData,
}: {
  templateData: PdfTemplateData;
}) => {
  const styles = createTokyoStyles(templateData.accentColor);
  const { personalDetails, summarySection, sections } = templateData;

  const sidebarSections = sections.filter((s) =>
    SIDEBAR_SECTION_TYPES.has(s.type as never)
  );

  const mainSections = sections.filter(
    (s) => !SIDEBAR_SECTION_TYPES.has(s.type as never)
  );

  const renderSidebarSection = (section: (typeof sections)[number]) => {
    if (section.type === INTERNAL_SECTION_TYPES.SKILLS) {
      return (
        <TokyoSkillsSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    if (section.type === INTERNAL_SECTION_TYPES.LANGUAGES) {
      return (
        <TokyoLanguagesSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    if (section.type === INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS) {
      return (
        <TokyoLinksSection section={section} key={section.id} styles={styles} />
      );
    }
    if (section.type === INTERNAL_SECTION_TYPES.HOBBIES) {
      return (
        <TokyoHobbiesSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    return null;
  };

  const renderMainSection = (section: (typeof sections)[number]) => {
    if (section.type === INTERNAL_SECTION_TYPES.WORK_EXPERIENCE) {
      return (
        <TokyoWorkExperienceSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    if (section.type === INTERNAL_SECTION_TYPES.EDUCATION) {
      return (
        <TokyoEducationSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    if (section.type === INTERNAL_SECTION_TYPES.INTERNSHIPS) {
      return (
        <TokyoInternshipsSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    if (section.type === INTERNAL_SECTION_TYPES.COURSES) {
      return (
        <TokyoCoursesSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    if (section.type === INTERNAL_SECTION_TYPES.CUSTOM) {
      return (
        <TokyoCustomSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    if (section.type === INTERNAL_SECTION_TYPES.REFERENCES) {
      return (
        <TokyoReferencesSection
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
