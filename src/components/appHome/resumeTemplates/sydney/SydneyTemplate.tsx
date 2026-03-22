import { Document, Page } from '@react-pdf/renderer';
import { INTERNAL_SECTION_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { SydneyCoursesSection } from './SydneyCoursesSection';
import { SydneyCustomSection } from './SydneyCustomSection';
import { SydneyEducationSection } from './SydneyEducationSection';
import { SydneyHobbiesSection } from './SydneyHobbiesSection';
import { SydneyInternshipsSection } from './SydneyInternshipsSection';
import { SydneyLanguagesSection } from './SydneyLanguagesSection';
import { SydneyLinksSection } from './SydneyLinksSection';
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
  const { personalDetails, summarySection, sections } = templateData;

  const renderSection = (section: (typeof sections)[number]) => {
    if (section.type === INTERNAL_SECTION_TYPES.WORK_EXPERIENCE) {
      return (
        <SydneyWorkExperienceSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    if (section.type === INTERNAL_SECTION_TYPES.EDUCATION) {
      return (
        <SydneyEducationSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    if (section.type === INTERNAL_SECTION_TYPES.INTERNSHIPS) {
      return (
        <SydneyInternshipsSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    if (section.type === INTERNAL_SECTION_TYPES.COURSES) {
      return (
        <SydneyCoursesSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    if (section.type === INTERNAL_SECTION_TYPES.SKILLS) {
      return (
        <SydneySkillsSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    if (section.type === INTERNAL_SECTION_TYPES.LANGUAGES) {
      return (
        <SydneyLanguagesSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    if (section.type === INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS) {
      return (
        <SydneyLinksSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    if (section.type === INTERNAL_SECTION_TYPES.HOBBIES) {
      return (
        <SydneyHobbiesSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    if (section.type === INTERNAL_SECTION_TYPES.CUSTOM) {
      return (
        <SydneyCustomSection
          section={section}
          key={section.id}
          styles={styles}
        />
      );
    }
    if (section.type === INTERNAL_SECTION_TYPES.REFERENCES) {
      return (
        <SydneyReferencesSection
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
