import { z } from 'zod';

export const JOB_POSTING_DESCRIPTION_LIMIT = 7000;

export const jobPostingSchema = z.object({
  companyName: z
    .string()
    .min(1, 'Company name is required')
    .max(100, 'Company name cannot be longer than 100 characters'),
  jobTitle: z
    .string()
    .min(1, 'Job title is required')
    .max(200, 'Job title cannot be longer than 200 characters'),
  roleDescription: z
    .string()
    .min(1, 'Role is required')
    .min(
      200,
      'For best results, role description must be at least 200 characters long'
    )
    .max(
      JOB_POSTING_DESCRIPTION_LIMIT,
      `Role description cannot be longer than ${JOB_POSTING_DESCRIPTION_LIMIT} characters`
    ),
});

export type JobPostingSchema = z.infer<typeof jobPostingSchema>;
