import { z } from 'zod';
import {
  FIELD_NAMES,
  INTERNAL_SECTION_TYPES,
  INTERNAL_TEMPLATE_TYPES,
  SELECT_TYPES,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { clientDb } from './clientDb';

const id = z.number().int().positive();
const fieldNames = new Set<string>(
  Object.values(FIELD_NAMES).flatMap(Object.values)
);
const jsonObject = z.string().refine((value) => {
  try {
    const parsed: unknown = JSON.parse(value);
    return (
      typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
    );
  } catch {
    return false;
  }
});
const backupSchema = z.object({
  documents: z.array(
    z
      .object({
        id,
        title: z.string(),
        templateType: z.enum(INTERNAL_TEMPLATE_TYPES),
        templateSettings: jsonObject,
        createdAt: z
          .string()
          .refine((value) => Number.isFinite(Date.parse(value))),
        updatedAt: z
          .string()
          .refine((value) => Number.isFinite(Date.parse(value))),
        jobPostingId: id.nullable().optional().default(null),
      })
      .passthrough()
  ),
  sections: z.array(
    z
      .object({
        id,
        documentId: id,
        title: z.string(),
        defaultTitle: z.string(),
        type: z.enum(INTERNAL_SECTION_TYPES),
        displayOrder: z.number().int().nonnegative(),
        metadata: z.string().optional(),
      })
      .passthrough()
  ),
  items: z.array(
    z
      .object({
        id,
        sectionId: id,
        containerType: z.enum(['collapsible', 'static']),
        displayOrder: z.number().int().nonnegative(),
      })
      .passthrough()
  ),
  fields: z.array(
    z
      .object({
        id,
        itemId: id,
        name: z.string().refine((name) => fieldNames.has(name)),
        type: z.enum([
          'string',
          'textarea',
          'rich-text',
          'date-month',
          'select',
        ]),
        value: z.string(),
        placeholder: z.string().optional(),
        selectType: z.enum(SELECT_TYPES).optional(),
        options: z.array(z.string()).optional(),
      })
      .passthrough()
      .refine(
        (field) =>
          field.type !== 'select' ||
          (field.selectType !== undefined && field.options !== undefined)
      )
  ),
  settings: z.array(
    z.discriminatedUnion('key', [
      z.object({ key: z.literal('language'), value: z.string() }),
      z.object({
        key: z.literal('editorPreferences'),
        value: z
          .object({
            askBeforeDeletingItem: z.boolean(),
            askBeforeDeletingSection: z.boolean(),
          })
          .passthrough(),
      }),
    ])
  ),
  jobPostings: z
    .array(
      z
        .object({
          id,
          companyName: z.string(),
          jobTitle: z.string(),
          roleDescription: z.string(),
        })
        .passthrough()
    )
    .optional()
    .default([]),
  aiSuggestions: z
    .array(
      z
        .object({
          id,
          documentId: id,
          suggestedJobTitle: z.string(),
          keywordSuggestions: z.array(z.string()),
        })
        .passthrough()
    )
    .optional()
    .default([]),
});
export const BACKUP_TABLES = [
  'documents',
  'sections',
  'items',
  'fields',
  'settings',
  'jobPostings',
  'aiSuggestions',
] as const;

export function validateBackup(input: unknown) {
  const parsed = backupSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(
      'This backup is incomplete or contains unsupported data. Choose a complete backup downloaded from ZenCV.'
    );
  }
  const backup = parsed.data;
  for (const table of BACKUP_TABLES) {
    const keys = backup[table].map((record) =>
      'id' in record ? record.id : record.key
    );
    if (new Set(keys).size !== keys.length) {
      throw new Error(
        'This backup contains duplicate entries. Choose another backup downloaded from ZenCV.'
      );
    }
  }
  const documentIds = new Set(backup.documents.map((record) => record.id));
  const sectionIds = new Set(backup.sections.map((record) => record.id));
  const itemIds = new Set(backup.items.map((record) => record.id));
  const postingIds = new Set(backup.jobPostings.map((record) => record.id));
  // Older exports omitted the legacy tables. Their obsolete references must be cleared.
  if (
    typeof input === 'object' &&
    input !== null &&
    !('jobPostings' in input)
  ) {
    for (const document of backup.documents) {
      document.jobPostingId = null;
    }
  }
  if (
    backup.sections.some((record) => !documentIds.has(record.documentId)) ||
    backup.items.some((record) => !sectionIds.has(record.sectionId)) ||
    backup.fields.some((record) => !itemIds.has(record.itemId)) ||
    backup.aiSuggestions.some(
      (record) => !documentIds.has(record.documentId)
    ) ||
    backup.documents.some(
      (record) =>
        record.jobPostingId !== null && !postingIds.has(record.jobPostingId)
    )
  ) {
    throw new Error(
      'The backup contains missing linked records. Choose a complete ZenCV backup.'
    );
  }
  return backup;
}

export async function readBackup() {
  return clientDb.transaction(
    'r',
    BACKUP_TABLES.map((name) => clientDb.table(name)),
    async () => {
      const records = await Promise.all(
        BACKUP_TABLES.map(
          async (name) => [name, await clientDb.table(name).toArray()] as const
        )
      );
      return Object.fromEntries(records);
    }
  );
}

export async function restoreBackup(input: unknown) {
  const backup = validateBackup(input);
  await clientDb.transaction(
    'rw',
    BACKUP_TABLES.map((name) => clientDb.table(name)),
    async () => {
      for (const name of BACKUP_TABLES) {
        await clientDb.table(name).clear();
      }
      for (const name of BACKUP_TABLES) {
        await clientDb.table(name).bulkAdd(backup[name]);
      }
    }
  );
}
