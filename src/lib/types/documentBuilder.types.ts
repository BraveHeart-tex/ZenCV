import type { SemanticSectionKey } from '@/lib/builderDocument/builderDocument';
import type {
  InternshipSectionSnapshot,
  ResumeSnapshotSection,
  SkillsSectionSnapshot,
} from '@/lib/builderDocument/resumeDocumentSnapshot';
import type {
  CHECKED_METADATA_VALUE,
  UNCHECKED_METADATA_VALUE,
} from '@/lib/constants';
import type {
  FIXED_SECTIONS,
  INTERNAL_SECTION_TYPES,
  INTERNAL_TEMPLATE_TYPES,
  NOT_TEMPLATED_SECTION_TYPES,
  SECTION_METADATA_KEYS,
  SELECT_TYPES,
  SUGGESTION_ACTION_TYPES,
  SUGGESTION_TYPES,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import type { NestedValueOf, ValueOf } from '@/lib/types/utils.types';

export type SectionType = ValueOf<typeof INTERNAL_SECTION_TYPES>;

export type TemplatedSectionType = Exclude<
  SectionType,
  (typeof NOT_TEMPLATED_SECTION_TYPES)[number]
>;

export type SelectType = ValueOf<typeof SELECT_TYPES>;

export type FixedSection = (typeof FIXED_SECTIONS)[number];

export type CollapsibleSectionType = Exclude<SectionType, FixedSection>;

export type SectionMetadataKey = NestedValueOf<typeof SECTION_METADATA_KEYS>;

export interface ParsedSectionMetadata {
  label: string;
  value: MetadataValue;
  key: SectionMetadataKey;
}

export interface PdfTemplateData {
  personalDetails: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    links: {
      entryId: string;
      label: string;
      link: string;
    }[];
  };
  summarySection: {
    sectionName: string;
    summary: string;
  };
  readonly workExperienceSection: WorkExperienceSectionSnapshot | null;
  readonly educationSection: ResumeSnapshotSection | null;
  readonly coursesSection: ResumeSnapshotSection | null;
  readonly internshipsSection: InternshipSectionSnapshot | null;
  readonly skillsSection?: SkillsSectionSnapshot | null;
  readonly languagesSection?: ResumeSnapshotSection | null;
  sections: readonly ResumeSnapshotSection[];
  accentColor: string;
  templateType: ResumeTemplate;
}

/** Read-only PDF projection of the semantic Work Experience section. */
export interface WorkExperienceSectionSnapshot {
  readonly id: number;
  readonly title: string;
  readonly displayOrder: number;
  readonly entries: readonly WorkExperiencePdfEntry[];
}

export interface InternshipPdfEntry extends Readonly<Record<string, string>> {
  readonly entryId: string;
  readonly jobTitle: string;
  readonly employer: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly city: string;
  readonly description: string;
}

export interface WorkExperiencePdfEntry
  extends Readonly<Record<string, string>> {
  readonly entryId: string;
  readonly role: string;
  readonly employer: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly city: string;
  readonly description: string;
}

export type WithEntryId<T extends Record<string, unknown>> = T & {
  entryId: string;
};

export type MetadataValue =
  | typeof UNCHECKED_METADATA_VALUE
  | typeof CHECKED_METADATA_VALUE;

export interface ResumeSuggestion {
  label: string;
  type: SuggestionType;
  sectionKey: SemanticSectionKey;
  scoreValue: number;
  actionType: SuggestionActionType;
  fieldKey?: string;
}

type SuggestionActionType = ValueOf<typeof SUGGESTION_ACTION_TYPES>;

export interface ResumeStats {
  score: number;
  suggestions: (ResumeSuggestion & { key: string })[];
}

export interface ATSCheck {
  id: string;
  label: string;
  pass: boolean;
}

export interface ATSCompatibilityReport {
  checks: ATSCheck[];
  passedCount: number;
  totalCount: number;
}

type SuggestionType = ValueOf<typeof SUGGESTION_TYPES>;

export type ResumeTemplate = ValueOf<typeof INTERNAL_TEMPLATE_TYPES>;

export interface TemplateOption {
  name: string;
  image: string;
  description: string;
  tags: string[];
  value: ResumeTemplate;
}

export type StoreResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };
