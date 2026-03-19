import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1m'),
});

import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { z } from 'zod';
import { generateImproveSummaryPrompt } from '@/lib/helpers/promptHelpers';
import { improveSummarySchema } from '@/lib/validation/improveSummary.schema';

const defaultAiModel = groq('openai/gpt-oss-20b');

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, message: 'Method not allowed' }),
      { status: 405 }
    );
  }
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
    const { success: rateLimitSuccess } = await ratelimit.limit(ip);
    if (!rateLimitSuccess) {
      return new Response(
        JSON.stringify({
          success: false,
          timestamp: Date.now(),
          message:
            'Too many requests. Please wait a few minutes and try again.',
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const body = await req.json();
    const validationResult = improveSummarySchema.safeParse(body);
    if (validationResult?.error) {
      return new Response(
        JSON.stringify({
          success: false,
          fieldErrors: z.treeifyError(validationResult?.error),
          timestamp: Date.now(),
          message: 'Please provide valid data.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const prompt = generateImproveSummaryPrompt(validationResult.data);
    const result = streamText({ model: defaultAiModel, prompt });
    return result.toUIMessageStreamResponse({ status: 200 });
  } catch (error) {
    console.error('improve-summary error', error);
    return new Response(
      JSON.stringify({
        success: false,
        timestamp: Date.now(),
        message: 'An internal error occurred while processing the request.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
