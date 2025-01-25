import { DEX_Field, DEX_Section } from '@/lib/client-db/clientDbSchema';
import {
  FIELD_NAMES,
  FIXED_SECTIONS,
  INTERNAL_SECTION_TYPES,
  NOT_TEMPLATED_SECTION_TYPES,
  SECTION_METADATA_KEYS,
  SELECT_TYPES,
} from '@/lib/constants';
import { DOCUMENT_BUILDER_SEARCH_PARAM_VALUES } from '@/hooks/useDocumentBuilderSearchParams';

type Values<T> = T[keyof T];

export type NestedValues<T> = T extends object
  ? Values<{ [K in keyof T]: NestedValues<T[K]> }>
  : T;

export type ValueOfNestedObject<T, K extends keyof T> = T[K][keyof T[K]];

export type FieldInsertTemplate = Omit<DEX_Field, 'id' | 'itemId'>;

export type SectionType =
  (typeof INTERNAL_SECTION_TYPES)[keyof typeof INTERNAL_SECTION_TYPES];

export type TemplatedSectionType = Exclude<
  SectionType,
  (typeof NOT_TEMPLATED_SECTION_TYPES)[number]
>;

export type SelectType = (typeof SELECT_TYPES)[keyof typeof SELECT_TYPES];

export type FieldName = NestedValues<typeof FIELD_NAMES>;

export type CollapsibleSectionType = Exclude<
  SectionType,
  (typeof FIXED_SECTIONS)[number]
>;

export type FieldValuesForKey<K extends keyof typeof FIELD_NAMES> =
  ValueOfNestedObject<typeof FIELD_NAMES, K>;

export type SectionMetadataKey = NestedValues<typeof SECTION_METADATA_KEYS>;

export interface ParsedSectionMetadata {
  label: string;
  value: string;
  key: SectionMetadataKey;
}

export interface SectionWithParsedMetadata
  extends Omit<DEX_Section, 'metadata'> {
  metadata: ParsedSectionMetadata[];
}

export type BuilderViewSearchParamValue = ValueOfNestedObject<
  typeof DOCUMENT_BUILDER_SEARCH_PARAM_VALUES,
  'VIEW'
>;

export interface PdfTemplateData {
  personalDetails: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    address: string;
    city: string;
    postalCode: string;
    placeOfBirth: string;
    phone: string;
    email: string;
    dateOfBirth: string;
    driversLicense: string;
  };
}
