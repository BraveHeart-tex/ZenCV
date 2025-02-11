import { z } from 'zod';
import { workExperienceSchema } from './workExperience.schema';

export const improveSummarySchema = z.object({
  summary: z
    .string()
    .min(1, 'Summary is required')
    .max(2000, 'Summary cannot be longer than 2000 characters'),
  workExperiences: z
    .array(workExperienceSchema)
    .length(1, 'At least one work experience entry is required')
    .max(10, 'At most 10 work experience entries are allowed'),
});

export type ImproveSummary = z.infer<typeof improveSummarySchema>;
