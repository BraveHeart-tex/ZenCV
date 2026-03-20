import { createGroq } from '@ai-sdk/groq';
import { generateJobAnalysisPrompt } from '@shared/prompts/promptHelpers';
import { jobAnalysisResultSchema } from '@shared/schemas/jobAnalysisResult.schema';
import { jobPostingSchema } from '@shared/schemas/jobPosting.schema';
import { generateObject } from 'ai';
import { Hono } from 'hono';
import type { Env } from '../env';
import { rateLimitMiddleware } from '../middleware/ratelimit';

const route = new Hono<{ Bindings: Env }>();

route.post('/', rateLimitMiddleware, async (c) => {
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
  const groqClient = createGroq({ apiKey: c.env.GROQ_API_KEY });
  const model = groqClient('openai/gpt-oss-20b');

  const prompt = generateJobAnalysisPrompt(validation.data);

  const result = await generateObject({
    model,
    schema: jobAnalysisResultSchema,
    prompt,
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
});

export default route;
