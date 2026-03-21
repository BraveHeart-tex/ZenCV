import { createGroq } from '@ai-sdk/groq';
import * as Sentry from '@sentry/cloudflare';
import { generateJobAnalysisPrompt } from '@shared/prompts/promptHelpers';
import { jobAnalysisResultSchema } from '@shared/schemas/jobAnalysisResult.schema';
import { jobPostingSchema } from '@shared/schemas/jobPosting.schema';
import { generateObject } from 'ai';
import { Hono } from 'hono';
import type { Env } from '../env';
import { captureError } from '../lib/sentry';
import { getLogger } from '../middleware/logger';
import { rateLimitMiddleware } from '../middleware/ratelimit';

const route = new Hono<{ Bindings: Env }>();

route.post('/', rateLimitMiddleware, async (c) => {
  const logger = getLogger(c);

  try {
    const body = await c.req.json();
    const validation = jobPostingSchema.safeParse(body);

    if (!validation.success) {
      logger.warn('job_analysis_validation_failed');
      return c.json(
        {
          success: false,
          fieldErrors: validation.error.flatten().fieldErrors,
          timestamp: Date.now(),
          message: 'Invalid request body.',
          data: null,
        },
        400
      );
    }

    const { companyName, jobTitle, roleDescription } = validation.data;

    logger.info('job_analysis_start', {
      company: companyName,
      jobTitle,
      descriptionLength: roleDescription.length,
    });

    Sentry.addBreadcrumb({
      category: 'ai',
      message: 'Running job analysis',
      level: 'info',
      data: {
        company: companyName,
        jobTitle,
        descriptionLength: roleDescription.length,
      },
    });

    const groqClient = createGroq({ apiKey: c.env.GROQ_API_KEY });
    const model = groqClient('openai/gpt-oss-20b');
    const prompt = generateJobAnalysisPrompt(validation.data);
    const result = await generateObject({
      model,
      schema: jobAnalysisResultSchema,
      prompt,
    });

    logger.info('job_analysis_complete', {
      suggestedJobTitle: result.object.suggestedJobTitle,
      keywordCount: result.object.keywordSuggestions.length,
    });

    Sentry.addBreadcrumb({
      category: 'ai',
      message: 'Job analysis completed',
      level: 'info',
      data: {
        suggestedJobTitle: result.object.suggestedJobTitle,
        keywordCount: result.object.keywordSuggestions.length,
      },
    });

    return c.json(
      {
        success: true,
        timestamp: Date.now(),
        data: result.object,
        message: 'Job analysis completed successfully.',
      },
      200
    );
  } catch (error) {
    logger.error('job_analysis_error', {
      error: error instanceof Error ? error.message : String(error),
    });
    await captureError(error, c, { handler: 'process/job-analysis' });
    return c.json(
      {
        success: false,
        data: null,
        timestamp: Date.now(),
        message: 'An internal error occurred while processing the request.',
      },
      500
    );
  }
});

export default route;
