import { z } from 'zod';

export const workExperienceSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  employer: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  city: z.string(),
  description: z.string().min(1, 'Description is required'),
});

export type WorkExperience = z.infer<typeof workExperienceSchema>;
