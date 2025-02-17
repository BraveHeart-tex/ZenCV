import { generateJobAnalysisPrompt } from '@/lib/helpers/promptHelpers';
import { jobAnalysisResultSchema } from '@/lib/validation/jobAnalysisResult.schema';
import { jobPostingSchema } from '@/lib/validation/jobPosting.schema';
import { generateObject } from 'ai';
import { NextResponse } from 'next/server';
import { defaultAiModel } from '../ai.constants';

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
          data: null,
        },
        {
          status: 400,
        },
      );
    }

    const prompt = generateJobAnalysisPrompt(validationResult.data);

    const result = await generateObject({
      model: defaultAiModel,
      schema: jobAnalysisResultSchema,
      prompt,
    });

    return NextResponse.json(
      {
        success: true,
        fieldErrors: {},
        timestamp: Date.now(),
        data: result.object,
        message: 'Job analysis completed successfully.',
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error('/api/process/job-analysis error', error);
    return NextResponse.json(
      {
        success: false,
        fieldErrors: {},
        data: null,
        timestamp: Date.now(),
        message: 'An internal error occurred while processing the request.',
      },
      {
        status: 500,
      },
    );
  }
}
