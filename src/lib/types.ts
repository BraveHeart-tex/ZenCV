import { DEX_Field } from '@/lib/schema';
import {
  FIELD_NAMES,
  INTERNAL_SECTION_TYPES,
  NOT_TEMPLATED_SECTION_TYPES,
  SELECT_TYPES,
} from '@/lib/constants';

type Values<T> = T[keyof T];

export type NestedValues<T> = T extends object
  ? Values<{ [K in keyof T]: NestedValues<T[K]> }>
  : T;

export type FieldInsertTemplate = Omit<DEX_Field, 'id' | 'itemId'>;

export type SectionType =
  (typeof INTERNAL_SECTION_TYPES)[keyof typeof INTERNAL_SECTION_TYPES];

export type TemplatedSectionType = Exclude<
  SectionType,
  (typeof NOT_TEMPLATED_SECTION_TYPES)[number]
>;

export type SelectType = (typeof SELECT_TYPES)[keyof typeof SELECT_TYPES];

export type FieldName = NestedValues<typeof FIELD_NAMES>;
