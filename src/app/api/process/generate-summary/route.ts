import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateResumeSummaryPrompt } from '@/lib/helpers/promptHelpers';
import { generateSummarySchema } from '@/lib/validation/generateSummary.schema';
import { defaultAiModel } from '../ai.constants';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validationResult = generateSummarySchema.safeParse(body);
    if (validationResult?.error) {
      return NextResponse.json(
        {
          success: false,
          fieldErrors: z.treeifyError(validationResult.error),
          timestamp: Date.now(),
          message: 'Please provide valid data.',
        },
        { status: 400 }
      );
    }

    const prompt = generateResumeSummaryPrompt({
      workExperiences: validationResult.data?.workExperiences,
      jobPosting: validationResult.data?.jobPosting,
      customPrompt: validationResult.data?.customPrompt,
    });

    const result = streamText({
      model: defaultAiModel,
      prompt,
    });

    return result.toUIMessageStreamResponse({
      status: 200,
    });
  } catch (error) {
    console.error('generate-summary error', error);
    return NextResponse.json(
      {
        success: false,
        fieldErrors: {},
        timestamp: Date.now(),
        message: 'An internal error occurred while processing the request.',
      },
      {
        status: 500,
      }
    );
  }
}
