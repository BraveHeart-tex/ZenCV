import { GenerateSummarySchema } from '../validation/generateSummary.schema';

export const generateResumeSummaryPrompt = (
  workExperiences: GenerateSummarySchema['workExperiences'],
): string => {
  if (!Array.isArray(workExperiences) || workExperiences.length === 0) {
    throw new Error('Invalid work experiences data.');
  }

  const experiencesText = workExperiences
    .map((exp, index) => {
      return `${index + 1}. **${exp.jobTitle}** at **${exp.employer}** (${exp.startDate} - ${exp.endDate}) | ${exp.city}
     - ${exp.description}`;
    })
    .join('\n\n');

  return `You are a skilled resume expert specializing in crafting impactful professional summaries that effectively showcase career achievements and potential. Your expertise lies in creating compelling narratives that immediately capture employers' attention.

  Your task is to create a powerful professional summary (3-5 sentences) that:
  - Incorporates relevant industry keywords and measurable impacts
  - Maintains a confident, professional tone
  - Highlights leadership abilities and technical expertise where applicable
  - Focuses on unique value propositions and notable accomplishments
  - Emphasizes the candidate's ability to drive results and make a meaningful impact
  
  Your summary should be tailored to the candidate's qualifications and experiences, ensuring it effectively communicates their strengths and achievements.

  Based on the following work experience, craft a summary that positions the candidate as a standout professional:

  Work Experience:

  ${experiencesText}

  Note: Focus on creating a concise yet impactful summary that showcases the candidate's most significant contributions and career trajectory. Avoid generic statements and emphasize specific achievements. Respond only with the generated summary.`;
};
