import { createGroq } from '@ai-sdk/groq';
import { generateResumeSummaryPrompt } from '@shared/prompts/promptHelpers';
import { generateSummarySchema } from '@shared/schemas/generateSummary.schema';
import { streamText } from 'ai';
import { Hono } from 'hono';
import { z } from 'zod';
import type { Env } from '../env';
import { rateLimitMiddleware } from '../middleware/ratelimit';

const route = new Hono<{ Bindings: Env }>();

route.post('/', rateLimitMiddleware, async (c) => {
  const body = await c.req.json();
  const validation = generateSummarySchema.safeParse(body);

  if (!validation.success) {
    return c.json(
      {
        success: false,
        fieldErrors: z.treeifyError(validation.error),
        timestamp: Date.now(),
        message: 'Please provide valid data.',
      },
      400
    );
  }

  const groqClient = createGroq({ apiKey: c.env.GROQ_API_KEY });
  const model = groqClient('openai/gpt-oss-20b');

  const prompt = generateResumeSummaryPrompt({
    workExperiences: validation.data.workExperiences,
    jobPosting: validation.data.jobPosting,
    customPrompt: validation.data.customPrompt,
  });

  const result = streamText({ model, prompt });

  return result.toUIMessageStreamResponse({ status: 200 });
});

export default route;
