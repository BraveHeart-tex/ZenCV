import { Document, Page, View } from '@react-pdf/renderer';
import { INTERNAL_SECTION_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { DubaiCoursesSection } from './DubaiCoursesSection';
import { DubaiCustomSection } from './DubaiCustomSection';
import { DubaiEducationSection } from './DubaiEducationSection';
import { DubaiHobbiesSection } from './DubaiHobbiesSection';
import { DubaiInternshipsSection } from './DubaiInternshipsSection';
import { DubaiLanguagesSection } from './DubaiLanguagesSection';
import { DubaiLinksSection } from './DubaiLinksSection';
import { DubaiPersonalDetailsSection } from './DubaiPersonalDetailsSection';
import { DubaiReferencesSection } from './DubaiReferencesSection';
import { DubaiSkillsSection } from './DubaiSkillsSection';
import { DubaiSummarySection } from './DubaiSummarySection';
import { DubaiWorkExperienceSection } from './DubaiWorkExperienceSection';
import { dubaiTemplateStyles } from './dubai.styles';

const SIDEBAR_SECTION_TYPES = new Set([
  INTERNAL_SECTION_TYPES.SKILLS,
  INTERNAL_SECTION_TYPES.LANGUAGES,
  INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS,
  INTERNAL_SECTION_TYPES.HOBBIES,
]);

export const DubaiTemplate = ({
  templateData,
}: {
  templateData: PdfTemplateData;
}) => {
  const { personalDetails, summarySection, sections } = templateData;

  const sidebarSections = sections.filter((s) =>
    SIDEBAR_SECTION_TYPES.has(s.type as never)
  );
  const mainSections = sections.filter(
    (s) => !SIDEBAR_SECTION_TYPES.has(s.type as never)
  );

  const renderSidebarSection = (section: (typeof sections)[number]) => {
    if (section.type === INTERNAL_SECTION_TYPES.SKILLS)
      return <DubaiSkillsSection section={section} key={section.id} />;
    if (section.type === INTERNAL_SECTION_TYPES.LANGUAGES)
      return <DubaiLanguagesSection section={section} key={section.id} />;
    if (section.type === INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS)
      return <DubaiLinksSection section={section} key={section.id} />;
    if (section.type === INTERNAL_SECTION_TYPES.HOBBIES)
      return <DubaiHobbiesSection section={section} key={section.id} />;
    return null;
  };

  const renderMainSection = (section: (typeof sections)[number]) => {
    if (section.type === INTERNAL_SECTION_TYPES.WORK_EXPERIENCE)
      return <DubaiWorkExperienceSection section={section} key={section.id} />;
    if (section.type === INTERNAL_SECTION_TYPES.EDUCATION)
      return <DubaiEducationSection section={section} key={section.id} />;
    if (section.type === INTERNAL_SECTION_TYPES.INTERNSHIPS)
      return <DubaiInternshipsSection section={section} key={section.id} />;
    if (section.type === INTERNAL_SECTION_TYPES.COURSES)
      return <DubaiCoursesSection section={section} key={section.id} />;
    if (section.type === INTERNAL_SECTION_TYPES.CUSTOM)
      return <DubaiCustomSection section={section} key={section.id} />;
    if (section.type === INTERNAL_SECTION_TYPES.REFERENCES)
      return <DubaiReferencesSection section={section} key={section.id} />;
    return null;
  };

  return (
    <Document>
      <Page size='A4' style={dubaiTemplateStyles.page}>
        {/* Light sidebar */}
        <View style={dubaiTemplateStyles.sidebar}>
          <DubaiPersonalDetailsSection personalDetails={personalDetails} />
          {sidebarSections.map(renderSidebarSection)}
        </View>

        {/* Main column */}
        <View style={dubaiTemplateStyles.main}>
          <DubaiSummarySection summarySection={summarySection} />
          {mainSections.map(renderMainSection)}
        </View>
      </Page>
    </Document>
  );
};
