import type { DEX_Field } from '@/lib/client-db/clientDbSchema';
import {
  DocumentRecordWithDisplayOrder,
  FieldName,
  SectionMetadataKey,
  SectionWithParsedMetadata,
  WithEntryId,
} from '@/lib/types/documentBuilder.types';

export const sortByDisplayOrder = (
  a: DocumentRecordWithDisplayOrder,
  b: DocumentRecordWithDisplayOrder,
) => {
  return a.displayOrder - b.displayOrder;
};

export const findValueInItemFields = (
  fields: DEX_Field[],
  fieldName: FieldName,
): string => {
  return fields.find((field) => field.name === fieldName)?.value || '';
};

export const getRenderableEntries = <T extends Record<string, unknown>>(
  entries: WithEntryId<T>[],
) => {
  return entries.filter((entry) => {
    const keys = Object.keys(entry) as Array<keyof typeof entry>;
    return (
      keys.filter((key) => key !== 'entryId' && entry[key] !== '').length > 0
    );
  });
};

export const getSectionMetadata = (
  section: SectionWithParsedMetadata,
  key: SectionMetadataKey,
) => {
  return section.metadata.find((data) => data.key === key)?.value || null;
};
