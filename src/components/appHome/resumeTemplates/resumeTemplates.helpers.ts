import type {
  CustomSectionSnapshot,
  HobbiesSectionSnapshot,
  InternshipSectionSnapshot,
  ReferencesSectionSnapshot,
  ResumeSnapshotSection,
  SkillsSectionSnapshot,
} from '@/lib/builderDocument/resumeDocumentSnapshot';
import type {
  InternshipPdfEntry,
  PdfTemplateData,
  WithEntryId,
  WorkExperienceSectionSnapshot,
} from '@/lib/types/documentBuilder.types';

export type PdfTemplateSection =
  | ResumeSnapshotSection
  | WorkExperienceSectionSnapshot;

interface SemanticPdfSectionRenderers<Result> {
  readonly hobbies: (section: HobbiesSectionSnapshot) => Result;
  readonly workExperience: (section: WorkExperienceSectionSnapshot) => Result;
  readonly education: (section: ResumeSnapshotSection) => Result;
  readonly courses: (section: ResumeSnapshotSection) => Result;
  readonly internships: (section: InternshipSectionSnapshot) => Result;
  readonly skills: (section: SkillsSectionSnapshot) => Result;
  readonly languages: (section: ResumeSnapshotSection) => Result;
  readonly references: (section: ReferencesSectionSnapshot) => Result;
}

export const sortByDisplayOrder = (
  a: { displayOrder: number },
  b: { displayOrder: number }
) => {
  return a.displayOrder - b.displayOrder;
};

const getRenderableEntries = <T extends Record<string, unknown>>(
  entries: WithEntryId<T>[]
) => {
  return entries.filter((entry) => {
    const keys = Object.keys(entry) as Array<keyof typeof entry>;
    return (
      keys.filter((key) => key !== 'entryId' && entry[key] !== '').length > 0
    );
  });
};

export const mergePdfSections = (
  templateData: Pick<
    PdfTemplateData,
    | 'sections'
    | 'workExperienceSection'
    | 'educationSection'
    | 'coursesSection'
    | 'internshipsSection'
    | 'skillsSection'
    | 'languagesSection'
  >
) => {
  return [
    ...templateData.sections,
    ...(templateData.educationSection ? [templateData.educationSection] : []),
    ...(templateData.coursesSection ? [templateData.coursesSection] : []),
    ...(templateData.workExperienceSection
      ? [templateData.workExperienceSection]
      : []),
    ...(templateData.internshipsSection
      ? [templateData.internshipsSection]
      : []),
    ...(templateData.skillsSection ? [templateData.skillsSection] : []),
    ...(templateData.languagesSection ? [templateData.languagesSection] : []),
  ].toSorted((a, b) => a.displayOrder - b.displayOrder);
};

export const isWorkExperienceSection = (
  section: PdfTemplateSection
): section is WorkExperienceSectionSnapshot => {
  return 'entries' in section;
};

export const isEducationSection = (
  section: PdfTemplateSection
): section is ResumeSnapshotSection =>
  'sectionKey' in section && section.sectionKey === 'education';

export const isInternshipSection = (
  section: PdfTemplateSection
): section is InternshipSectionSnapshot =>
  'sectionKey' in section && section.sectionKey === 'internships';

export const isCoursesSection = (
  section: PdfTemplateSection
): section is ResumeSnapshotSection =>
  'sectionKey' in section && section.sectionKey === 'courses';

export const isSkillsSection = (
  section: PdfTemplateSection
): section is SkillsSectionSnapshot =>
  'sectionKey' in section && section.sectionKey === 'skills';

export const isLanguagesSection = (
  section: PdfTemplateSection
): section is ResumeSnapshotSection =>
  'sectionKey' in section && section.sectionKey === 'languages';

export const isReferencesSection = (
  section: PdfTemplateSection
): section is ReferencesSectionSnapshot =>
  'sectionKey' in section && section.sectionKey === 'references';

export const isHobbiesSection = (
  section: PdfTemplateSection
): section is HobbiesSectionSnapshot =>
  'sectionKey' in section && section.sectionKey === 'hobbies';

export const isSemanticPdfSection = (
  section: PdfTemplateSection
): section is
  | WorkExperienceSectionSnapshot
  | HobbiesSectionSnapshot
  | ResumeSnapshotSection
  | InternshipSectionSnapshot =>
  isWorkExperienceSection(section) ||
  isHobbiesSection(section) ||
  isEducationSection(section) ||
  isCoursesSection(section) ||
  isSkillsSection(section) ||
  isLanguagesSection(section) ||
  isReferencesSection(section) ||
  isInternshipSection(section);

export const isCustomSection = (
  section: PdfTemplateSection
): section is CustomSectionSnapshot =>
  'sectionKey' in section && section.sectionKey === 'custom';

export const isSidebarPdfSection = (
  section: PdfTemplateSection
): section is
  | HobbiesSectionSnapshot
  | SkillsSectionSnapshot
  | ResumeSnapshotSection =>
  isSkillsSection(section) ||
  isLanguagesSection(section) ||
  isHobbiesSection(section);

export const renderSemanticPdfSection = <Result>(
  section: PdfTemplateSection,
  renderers: SemanticPdfSectionRenderers<Result>
): Result | null => {
  if (isHobbiesSection(section)) {
    return renderers.hobbies(section);
  }
  if (isWorkExperienceSection(section)) {
    return renderers.workExperience(section);
  }
  if (isEducationSection(section)) {
    return renderers.education(section);
  }
  if (isCoursesSection(section)) {
    return renderers.courses(section);
  }
  if (isSkillsSection(section)) {
    return renderers.skills(section);
  }
  if (isLanguagesSection(section)) {
    return renderers.languages(section);
  }
  if (isReferencesSection(section)) {
    return renderers.references(section);
  }
  if (isInternshipSection(section)) {
    return renderers.internships(section);
  }
  return null;
};

export const getEducationSectionEntries = (section: ResumeSnapshotSection) => {
  return getRenderableEntries(
    section.items
      .toSorted((a, b) => a.displayOrder - b.displayOrder)
      .map((item) => {
        return {
          entryId: item.id.toString(),
          school: item.values.school ?? '',
          degree: item.values.degree ?? '',
          startDate: item.values.startDate ?? '',
          endDate: item.values.endDate ?? '',
          city: item.values.city ?? '',
          description: item.values.description ?? '',
        };
      })
  );
};

export const getCoursesSectionEntries = (section: ResumeSnapshotSection) =>
  getRenderableEntries(
    section.items
      .toSorted((a, b) => a.displayOrder - b.displayOrder)
      .map((item) => ({
        entryId: item.id.toString(),
        course: item.values.course ?? '',
        institution: item.values.institution ?? '',
        startDate: item.values.startDate ?? '',
        endDate: item.values.endDate ?? '',
      }))
  );

export const getSkillsSectionEntries = (section: SkillsSectionSnapshot) => {
  return getRenderableEntries(
    section.items
      .toSorted((a, b) => a.displayOrder - b.displayOrder)
      .map((item) => ({
        entryId: item.id.toString(),
        name: item.values.skill ?? '',
        level: item.values.experienceLevel ?? '',
      }))
  );
};

export const getSemanticInternshipSectionEntries = (
  section: InternshipSectionSnapshot
): InternshipPdfEntry[] =>
  getRenderableEntries(
    section.items
      .toSorted((a, b) => a.displayOrder - b.displayOrder)
      .map((item) => ({
        entryId: item.id.toString(),
        jobTitle: item.values.role ?? '',
        employer: item.values.employer ?? '',
        startDate: item.values.startDate ?? '',
        endDate: item.values.endDate ?? '',
        city: item.values.city ?? '',
        description: item.values.description ?? '',
      }))
  );

export const getLanguagesSectionEntries = (section: ResumeSnapshotSection) =>
  getRenderableEntries(
    section.items
      .toSorted((a, b) => a.displayOrder - b.displayOrder)
      .map((item) => ({
        entryId: item.id.toString(),
        language: item.values.language ?? '',
        level: item.values.level ?? '',
      }))
  );

export const getCustomSectionEntries = (section: CustomSectionSnapshot) => {
  return getRenderableEntries(
    section.items
      .toSorted((a, b) => a.displayOrder - b.displayOrder)
      .map((item) => ({
        entryId: item.id.toString(),
        name: item.values.activityName ?? '',
        city: item.values.city ?? '',
        startDate: item.values.startDate ?? '',
        endDate: item.values.endDate ?? '',
        description: item.values.description ?? '',
      }))
  );
};

export const getReferencesSectionEntries = (
  section: ReferencesSectionSnapshot
) => {
  return getRenderableEntries(
    section.items
      .toSorted((a, b) => a.displayOrder - b.displayOrder)
      .map((item) => {
        return {
          entryId: item.id.toString(),
          referentPhone: item.values.phone ?? '',
          referentCompany: item.values.company ?? '',
          referentEmail: item.values.referentEmail ?? '',
          referentFullName: item.values.referentFullName ?? '',
        };
      })
  );
};

export const getHobbiesSectionValue = (section: HobbiesSectionSnapshot) =>
  section.items.map((item) => item.values.whatYouLike ?? '').join('');
