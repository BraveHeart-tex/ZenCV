import { z } from 'zod';
import { workExperienceSchema } from './workExperience.schema';
import { jobPostingSchema } from './jobPosting.schema';

export const generateSummarySchema = z.object({
  workExperiences: z
    .array(workExperienceSchema)
    .min(1, 'At least one work experience entry is required')
    .max(10, 'At most 10 work experience entries are allowed'),
  jobPosting: jobPostingSchema.optional(),
});

export type GenerateSummarySchema = z.infer<typeof generateSummarySchema>;
