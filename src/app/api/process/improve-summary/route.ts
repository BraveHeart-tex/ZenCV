import { NextResponse } from 'next/server';
import { streamText } from 'ai';
import { improveSummarySchema } from '@/lib/validation/improveSummary.schema';
import { generateImproveSummaryPrompt } from '@/lib/helpers/promptHelpers';
import { defaultAiModel } from '../ai.constants';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validationResult = improveSummarySchema.safeParse(body);
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

    const prompt = generateImproveSummaryPrompt(validationResult.data);

    const result = streamText({
      model: defaultAiModel,
      prompt,
    });

    return result.toDataStreamResponse({
      status: 200,
    });
  } catch (error) {
    console.error('improve-summary error', error);
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
