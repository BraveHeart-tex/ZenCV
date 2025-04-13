import {
  CHECKED_METADATA_VALUE,
  UNCHECKED_METADATA_VALUE,
} from '@/lib/constants';
import {
  FIELD_NAMES,
  FIXED_SECTIONS,
  INTERNAL_SECTION_TYPES,
  INTERNAL_TEMPLATE_TYPES,
  NOT_TEMPLATED_SECTION_TYPES,
  SECTION_METADATA_KEYS,
  SELECT_TYPES,
  SUGGESTION_ACTION_TYPES,
  SUGGESTION_TYPES,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import {
  DEX_Field,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import {
  NestedValueOf,
  ValueOf,
  ValueOfNestedObject,
} from '@/lib/types/utils.types';
import type { UseCompletionHelpers } from '@ai-sdk/react';
import { JobAnalysisResult } from '../validation/jobAnalysisResult.schema';
import { JobPostingSchema } from '../validation/jobPosting.schema';

export type FieldInsertTemplate = Omit<DEX_Field, 'id' | 'itemId'>;

export type TopLevelFieldName = keyof typeof FIELD_NAMES;

export type SectionType = ValueOf<typeof INTERNAL_SECTION_TYPES>;

export type TemplatedSectionType = Exclude<
  SectionType,
  (typeof NOT_TEMPLATED_SECTION_TYPES)[number]
>;

export type SelectType = ValueOf<typeof SELECT_TYPES>;

export type FieldName = NestedValueOf<typeof FIELD_NAMES>;

export type FixedSection = (typeof FIXED_SECTIONS)[number];

export type CollapsibleSectionType = Exclude<SectionType, FixedSection>;

export type FieldValuesForKey<K extends keyof typeof FIELD_NAMES> =
  ValueOfNestedObject<typeof FIELD_NAMES, K>;

export type SectionMetadataKey = NestedValueOf<typeof SECTION_METADATA_KEYS>;

export interface ParsedSectionMetadata {
  label: string;
  value: MetadataValue;
  key: SectionMetadataKey;
}

export interface SectionWithParsedMetadata
  extends Omit<DEX_Section, 'metadata'> {
  metadata: ParsedSectionMetadata[];
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
  };
  summarySection: {
    sectionName: string;
    summary: string;
  };
  sections: TemplateDataSection[];
}

export interface TemplateDataSection extends SectionWithParsedMetadata {
  items: (DEX_Item & { fields: DEX_Field[] })[];
}

export type DocumentRecordWithDisplayOrder =
  | DEX_Section
  | DEX_Item
  | SectionWithParsedMetadata;

export type WithEntryId<T extends Record<string, unknown>> = T & {
  entryId: string;
};

export type MetadataValue =
  | typeof UNCHECKED_METADATA_VALUE
  | typeof CHECKED_METADATA_VALUE;

export interface ResumeSuggestion {
  label: string;
  type: SuggestionType;
  sectionType: SectionType;
  scoreValue: number;
  actionType: SuggestionActionType;
  fieldName?: FieldName;
}

export type SuggestionActionType = ValueOf<typeof SUGGESTION_ACTION_TYPES>;

export interface ResumeStats {
  score: number;
  suggestions: (ResumeSuggestion & { key: string })[];
}

export type SuggestionType = ValueOf<typeof SUGGESTION_TYPES>;

export type ResumeTemplate = ValueOf<typeof INTERNAL_TEMPLATE_TYPES>;

export interface TemplateOption {
  name: string;
  image: string;
  description: string;
  tags: string[];
  value: ResumeTemplate;
}

export interface AISuggestionBase {
  title?: string;
  description?: string;
}

export type AISuggestion =
  | (AISuggestionBase & { type: 'text'; value: string })
  | (AISuggestionBase & { type: 'options'; values: string[] });

export interface AiSuggestionsContext {
  completeSummary: UseCompletionHelpers['complete'];
  isCompletingSummary: UseCompletionHelpers['isLoading'];
  generatedSummary: UseCompletionHelpers['completion'];

  isLoading: boolean;

  improveSummary: UseCompletionHelpers['complete'];
  isImprovingSummary: UseCompletionHelpers['isLoading'];
  improvedSummary: UseCompletionHelpers['completion'];

  analyzeJob: (
    values: JobPostingSchema,
  ) => Promise<JobAnalysisResult | undefined>;
}
