import { z } from 'zod';

export const jobAnalysisResultSchema = z.object({
  suggestedJobTitle: z.string(),
  keywordSuggestions: z.array(z.string()),
});

export type JobAnalysisResult = z.infer<typeof jobAnalysisResultSchema>;
