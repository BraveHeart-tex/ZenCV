import { generateJobAnalysisPrompt } from '@/lib/helpers/promptHelpers';
import { jobPostingSchema } from '@/lib/validation/jobPosting.schema';
import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validationResult = jobPostingSchema.safeParse(body);
    if (!validationResult?.success) {
      return NextResponse.json(
        {
          success: false,
          fieldErrors: validationResult.error.flatten().fieldErrors,
          timestamp: Date.now(),
          message: 'Invalid request body.',
        },
        {
          status: 400,
        },
      );
    }

    const prompt = generateJobAnalysisPrompt(validationResult.data);

    const result = streamObject({
      model: google('gemini-2.0-flash-lite-preview-02-05'),
      schema: z.object({
        suggestedJobTitle: z.string(),
        keywordSuggestions: z.array(z.string()),
      }),
      prompt,
    });

    return result.toTextStreamResponse({
      status: 200,
    });
  } catch (error) {
    console.error('/api/process/job-analysis error', error);
    return NextResponse.json(
      {
        success: false,
        fieldErrors: {},
        timestamp: Date.now(),
        message: 'An internal error occurred while processing the request.',
      },
      {
        status: 500,
      },
    );
  }
}
