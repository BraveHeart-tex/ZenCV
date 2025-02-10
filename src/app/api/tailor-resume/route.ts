import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function GET() {
  try {
    // TODO: Implement the logic to generate a resume summary
    const prompt = `
          You are a skilled resume expert with over 15 years of experience in crafting impactful resume summaries that highlight a candidate's strengths, achievements, and professional journey. You have a keen eye for identifying key aspects of a work history that resonate with potential employers.

      Your task is to generate a compelling resume summary based on my work experience.

      Here are my details:

      Name: Bora Karaca
      Current Job Title: Software Engineer
      Years of Experience: 2
      Key Skills: JavaScript, React, Node.js, SQL, Typescript, Next.js, Java
      Please ensure that the summary encapsulates my professional background effectively while showcasing my unique qualifications and contributions.
        `;
    const result = await generateText({
      model: google('gemini-2.0-flash-lite-preview-02-05'),
      prompt,
    });

    return new Response(JSON.stringify({ result }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred while processing the request',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
