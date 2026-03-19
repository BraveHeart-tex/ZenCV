import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1m'),
});

import { groq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { jobAnalysisResultSchema } from '../../src/lib/api-helpers/jobAnalysisResult.schema.js';
import { jobPostingSchema } from '../../src/lib/api-helpers/jobPosting.schema.js';
import { generateJobAnalysisPrompt } from '../../src/lib/api-helpers/promptHelpers.js';

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
    const validationResult = jobPostingSchema.safeParse(body);
    if (!validationResult?.success) {
      return new Response(
        JSON.stringify({
          success: false,
          fieldErrors: validationResult.error.flatten().fieldErrors,
          timestamp: Date.now(),
          message: 'Invalid request body.',
          data: null,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const prompt = generateJobAnalysisPrompt(validationResult.data);
    const result = await generateObject({
      model: defaultAiModel,
      schema: jobAnalysisResultSchema,
      prompt,
    });
    return new Response(
      JSON.stringify({
        success: true,
        timestamp: Date.now(),
        data: result.object,
        message: 'Job analysis completed successfully.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('/api/process/job-analysis error', error);
    return new Response(
      JSON.stringify({
        success: false,
        data: null,
        timestamp: Date.now(),
        message: 'An internal error occurred while processing the request.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
