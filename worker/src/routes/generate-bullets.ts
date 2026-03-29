import { createGroq } from '@ai-sdk/groq';
import * as Sentry from '@sentry/cloudflare';
import { generateBulletSuggestionsPrompt } from '@shared/prompts/promptHelpers';
import {
  bulletSuggestionsResultSchema,
  generateBulletsSchema,
} from '@shared/schemas/generateBullets.schema';
import { generateObject } from 'ai';
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
    const validation = generateBulletsSchema.safeParse(body);

    if (!validation.success) {
      logger.warn('generate_bullets_validation_failed');
      return c.json(
        {
          success: false,
          fieldErrors: z.treeifyError(validation.error),
          timestamp: Date.now(),
          message: 'Please provide valid data.',
          data: null,
        },
        400
      );
    }

    const { jobPosting, roughNotes, workExperience } = validation.data;

    logger.info('generate_bullets_start', {
      hasJobPosting: !!jobPosting,
      hasRoughNotes: !!roughNotes?.trim(),
      jobTitle: workExperience.jobTitle,
      employer: workExperience.employer,
    });

    Sentry.addBreadcrumb({
      category: 'ai',
      message: 'Generating work experience bullets',
      level: 'info',
      data: {
        hasJobPosting: !!jobPosting,
        hasRoughNotes: !!roughNotes?.trim(),
        jobTitle: workExperience.jobTitle,
        employer: workExperience.employer,
      },
    });

    const groqClient = createGroq({ apiKey: c.env.GROQ_API_KEY });
    const model = groqClient('openai/gpt-oss-20b');
    const prompt = generateBulletSuggestionsPrompt(validation.data);
    const result = await generateObject({
      model,
      schema: bulletSuggestionsResultSchema,
      prompt,
    });

    logger.info('generate_bullets_complete', {
      bulletCount: result.object.bulletSuggestions.length,
    });

    return c.json(
      {
        success: true,
        timestamp: Date.now(),
        data: result.object,
        message: 'Bullet suggestions generated successfully.',
      },
      200
    );
  } catch (error) {
    logger.error('generate_bullets_error', {
      error: error instanceof Error ? error.message : String(error),
    });
    await captureError(error, c, { handler: 'process/generate-bullets' });
    return c.json(
      {
        success: false,
        timestamp: Date.now(),
        message: 'An internal error occurred while processing the request.',
        data: null,
      },
      500
    );
  }
});

export default route;
