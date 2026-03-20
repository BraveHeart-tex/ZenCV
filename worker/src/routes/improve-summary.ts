import { createGroq } from '@ai-sdk/groq';
import { generateImproveSummaryPrompt } from '@shared/prompts/promptHelpers';
import { improveSummarySchema } from '@shared/schemas/improveSummary.schema';
import { streamText } from 'ai';
import { Hono } from 'hono';
import { z } from 'zod';
import type { Env } from '../env';
import { rateLimitMiddleware } from '../middleware/ratelimit';

const route = new Hono<{ Bindings: Env }>();

route.post('/', rateLimitMiddleware, async (c) => {
  const body = await c.req.json();
  const validation = improveSummarySchema.safeParse(body);

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

  const prompt = generateImproveSummaryPrompt(validation.data);
  const result = streamText({ model, prompt });

  return result.toUIMessageStreamResponse({ status: 200 });
});

export default route;
