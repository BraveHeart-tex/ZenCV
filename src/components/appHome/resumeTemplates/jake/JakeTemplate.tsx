import { Document, Page } from '@react-pdf/renderer';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import {
  isCustomSection,
  mergePdfSections,
  renderSemanticPdfSection,
} from '../resumeTemplates.helpers';
import { JakePersonalDetailsSection } from './JakePersonalDetailsSection';
import { JakeRichText } from './JakeRichText';
import {
  JakeCoursesSection,
  JakeCustomSection,
  JakeEducationSection,
  JakeHobbiesSection,
  JakeInternshipsSection,
  JakeLanguagesSection,
  JakeReferencesSection,
  JakeSection,
  JakeSkillsSection,
  JakeWorkExperienceSection,
} from './JakeSections';
import { jakeStyles } from './jake.styles';

export const JakeTemplate = ({
  templateData,
}: {
  templateData: PdfTemplateData;
}) => (
  <Document>
    <Page size='A4' style={jakeStyles.page}>
      <JakePersonalDetailsSection
        personalDetails={templateData.personalDetails}
      />
      {templateData.summarySection.summary && (
        <JakeSection title={templateData.summarySection.sectionName}>
          <JakeRichText html={templateData.summarySection.summary} />
        </JakeSection>
      )}
      {mergePdfSections(templateData).map((section) => {
        const semantic = renderSemanticPdfSection(section, {
          education: (section) => (
            <JakeEducationSection key={section.id} section={section} />
          ),
          workExperience: (section) => (
            <JakeWorkExperienceSection
              key={section.id}
              workExperienceSection={section}
            />
          ),
          courses: (section) => (
            <JakeCoursesSection key={section.id} section={section} />
          ),
          internships: (section) => (
            <JakeInternshipsSection key={section.id} section={section} />
          ),
          skills: (section) => (
            <JakeSkillsSection key={section.id} section={section} />
          ),
          languages: (section) => (
            <JakeLanguagesSection key={section.id} section={section} />
          ),
          references: (section) => (
            <JakeReferencesSection key={section.id} section={section} />
          ),
          hobbies: (section) => (
            <JakeHobbiesSection key={section.id} section={section} />
          ),
        });
        if (semantic) {
          return semantic;
        }
        if (isCustomSection(section)) {
          return <JakeCustomSection key={section.id} section={section} />;
        }
        return null;
      })}
    </Page>
  </Document>
);
