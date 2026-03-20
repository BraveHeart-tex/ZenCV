import { createGroq } from '@ai-sdk/groq';
import * as Sentry from '@sentry/cloudflare';
import { generateJobAnalysisPrompt } from '@shared/prompts/promptHelpers';
import { jobAnalysisResultSchema } from '@shared/schemas/jobAnalysisResult.schema';
import { jobPostingSchema } from '@shared/schemas/jobPosting.schema';
import { generateObject } from 'ai';
import { Hono } from 'hono';
import type { Env } from '../env';
import { captureError } from '../lib/sentry';
import { rateLimitMiddleware } from '../middleware/ratelimit';

const route = new Hono<{ Bindings: Env }>();

route.post('/', rateLimitMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const validation = jobPostingSchema.safeParse(body);

    if (!validation.success) {
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

    Sentry.addBreadcrumb({
      category: 'ai',
      message: 'Running job analysis',
      level: 'info',
      data: {
        company: validation.data.companyName,
        jobTitle: validation.data.jobTitle,
        descriptionLength: validation.data.roleDescription.length,
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
    captureError(error, c, { handler: 'process/job-analysis' });
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
