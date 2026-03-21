import { createGroq } from '@ai-sdk/groq';
import * as Sentry from '@sentry/cloudflare';
import { generateResumeSummaryPrompt } from '@shared/prompts/promptHelpers';
import { generateSummarySchema } from '@shared/schemas/generateSummary.schema';
import { streamText } from 'ai';
import { Hono } from 'hono';
import { z } from 'zod';
import type { Env } from '../env';
import { captureError } from '../lib/sentry';
import { getLogger } from '../middleware/logger';
import { rateLimitMiddleware } from '../middleware/ratelimit';

const route = new Hono<{ Bindings: Env }>();

route.post('/', rateLimitMiddleware, async (c) => {
  const logger = getLogger(c);

  try {
    const body = await c.req.json();
    const validation = generateSummarySchema.safeParse(body);

    if (!validation.success) {
      logger.warn('generate_summary_validation_failed');
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

    const { jobPosting, customPrompt, workExperiences } = validation.data;

    logger.info('generate_summary_start', {
      hasJobPosting: !!jobPosting,
      hasCustomPrompt: !!customPrompt,
      workExperienceCount: workExperiences.length,
    });

    Sentry.addBreadcrumb({
      category: 'ai',
      message: 'Generating resume summary',
      level: 'info',
      data: {
        hasJobPosting: !!jobPosting,
        hasCustomPrompt: !!customPrompt,
        workExperienceCount: workExperiences.length,
      },
    });

    const groqClient = createGroq({ apiKey: c.env.GROQ_API_KEY });
    const model = groqClient('openai/gpt-oss-20b');
    const prompt = generateResumeSummaryPrompt({
      workExperiences,
      jobPosting,
      customPrompt,
    });
    const result = streamText({ model, prompt });

    logger.info('generate_summary_streaming');
    return result.toUIMessageStreamResponse({ status: 200 });
  } catch (error) {
    logger.error('generate_summary_error', {
      error: error instanceof Error ? error.message : String(error),
    });
    await captureError(error, c, { handler: 'process/generate-summary' });
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
