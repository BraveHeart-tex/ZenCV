import { createGroq } from '@ai-sdk/groq';
import * as Sentry from '@sentry/cloudflare';
import { generateResumeSummaryPrompt } from '@shared/prompts/promptHelpers';
import { generateSummarySchema } from '@shared/schemas/generateSummary.schema';
import { streamText } from 'ai';
import { Hono } from 'hono';
import { z } from 'zod';
import type { Env } from '../env';
import { captureError } from '../lib/sentry';
import { rateLimitMiddleware } from '../middleware/ratelimit';

const route = new Hono<{ Bindings: Env }>();

route.post('/', rateLimitMiddleware, async (c) => {
  try {
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

    Sentry.addBreadcrumb({
      category: 'ai',
      message: 'Generating resume summary',
      level: 'info',
      data: {
        hasJobPosting: !!validation.data.jobPosting,
        hasCustomPrompt: !!validation.data.customPrompt,
        workExperienceCount: validation.data.workExperiences.length,
      },
    });

    const groqClient = createGroq({ apiKey: c.env.GROQ_API_KEY });
    const model = groqClient('openai/gpt-oss-20b');

    const prompt = generateResumeSummaryPrompt({
      workExperiences: validation.data.workExperiences,
      jobPosting: validation.data.jobPosting,
      customPrompt: validation.data.customPrompt,
    });

    const result = streamText({ model, prompt });

    return result.toUIMessageStreamResponse({ status: 200 });
  } catch (error) {
    captureError(error, c, { handler: 'process/generate-summary' });
    return c.json(
      {
        success: false,
        timestamp: Date.now(),
        message: 'An internal error occurred while processing the request.',
      },
      500
    );
  }
});

export default route;
