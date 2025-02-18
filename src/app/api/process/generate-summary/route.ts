import { generateResumeSummaryPrompt } from '@/lib/helpers/promptHelpers';
import { generateSummarySchema } from '@/lib/validation/generateSummary.schema';
import { NextResponse } from 'next/server';
import { streamText } from 'ai';
import { defaultAiModel } from '../ai.constants';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validationResult = generateSummarySchema.safeParse(body);
    if (validationResult?.error) {
      return NextResponse.json(
        {
          success: false,
          fieldErrors: validationResult?.error?.flatten(),
          timestamp: Date.now(),
          message: 'Please provide valid data.',
        },
        { status: 400 },
      );
    }

    const prompt = generateResumeSummaryPrompt(
      validationResult.data.workExperiences,
      validationResult.data?.jobPosting,
    );

    const result = streamText({
      model: defaultAiModel,
      prompt,
    });

    return result.toDataStreamResponse({
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
      },
    );
  }
}
