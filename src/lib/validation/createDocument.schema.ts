import { z } from 'zod';
import { INTERNAL_TEMPLATE_TYPES } from '../stores/documentBuilder/documentBuilder.constants';
import { PREFILL_RESUME_STYLES } from '../templates/prefilledTemplates';

export const createNewDocumentSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(100, 'Title cannot be more than 100 characters')
      .refine(
        (title) => title.replaceAll(' ', '').length > 0,
        'Please enter a valid title',
      ),
    template: z
      .union([
        z.literal(INTERNAL_TEMPLATE_TYPES.MANHATTAN),
        z.literal(INTERNAL_TEMPLATE_TYPES.LONDON),
      ])
      .default(INTERNAL_TEMPLATE_TYPES.MANHATTAN),
    shouldUseSampleData: z.boolean().default(false),
    selectedPrefillStyle: z
      .union([
        z.literal(PREFILL_RESUME_STYLES.STANDARD),
        z.literal(PREFILL_RESUME_STYLES.TECH_FOCUSED),
        z.literal(PREFILL_RESUME_STYLES.CREATIVE),
      ])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.shouldUseSampleData && !data.selectedPrefillStyle) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['selectedPrefillStyle'],
        message: 'Please select a prefill style',
      });
    }
  });

export type CreateDocumentFormData = z.infer<typeof createNewDocumentSchema>;
