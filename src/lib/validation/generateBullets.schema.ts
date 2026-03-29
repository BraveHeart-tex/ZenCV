import { z } from 'zod';
import { CUSTOM_PROMPT_MAX_LENGTH } from '../constants';
import { jobPostingSchema } from './jobPosting.schema';
import { workExperienceSchema } from './workExperience.schema';

export const generateBulletsSchema = z.object({
  workExperience: workExperienceSchema,
  jobPosting: jobPostingSchema.optional(),
  roughNotes: z
    .string()
    .max(
      CUSTOM_PROMPT_MAX_LENGTH,
      `Rough notes cannot be longer than ${CUSTOM_PROMPT_MAX_LENGTH} characters`
    )
    .optional(),
});

export const bulletSuggestionsResultSchema = z.object({
  bulletSuggestions: z
    .array(z.string().min(1, 'Bullet point cannot be empty'))
    .min(3, 'At least 3 bullet suggestions are required')
    .max(5, 'At most 5 bullet suggestions are allowed'),
});

export type GenerateBulletsSchema = z.infer<typeof generateBulletsSchema>;
export type BulletSuggestionsResult = z.infer<
  typeof bulletSuggestionsResultSchema
>;
