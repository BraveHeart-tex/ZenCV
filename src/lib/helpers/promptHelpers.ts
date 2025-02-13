import { GenerateSummarySchema } from '../validation/generateSummary.schema';
import { ImproveSummary } from '../validation/improveSummary.schema';
import { JobPostingSchema } from '../validation/jobPosting.schema';
import { WorkExperience } from '../validation/workExperience.schema';

const generateExperienceText = (workExperiences: WorkExperience[]) =>
  workExperiences
    .map((exp, index) => {
      return `${index + 1}. **${exp.jobTitle}** at **${exp.employer}** (${exp.startDate} - ${exp.endDate}) | ${exp.city}
 - ${exp.description}`;
    })
    .join('\n\n');

export const generateResumeSummaryPrompt = (
  workExperiences: GenerateSummarySchema['workExperiences'],
): string => {
  const experiencesText = generateExperienceText(workExperiences);

  return `You are a skilled resume expert specializing in crafting impactful professional summaries that effectively showcase career achievements and potential. Your expertise lies in creating compelling narratives that immediately capture employers' attention.

  Your task is to create a powerful professional summary (3-5 sentences) that:
  - Incorporates relevant industry keywords and measurable impacts
  - Maintains a confident, professional tone
  - Highlights leadership abilities and technical expertise where applicable
  - Focuses on unique value propositions and notable accomplishments
  - Emphasizes the candidate's ability to drive results and make a meaningful impact
  - Maintains an optimal length of 3-5 sentences, ensuring clarity and conciseness
  
  Your summary should be tailored to the candidate's qualifications and experiences, ensuring it effectively communicates their strengths and achievements.

  Based on the following work experience, craft a summary that positions the candidate as a standout professional:

  Work Experience:

  ${experiencesText}

  Note: Focus on creating a concise yet impactful summary that showcases the candidate's most significant contributions and career trajectory. Avoid generic statements and emphasize specific achievements. Respond only with the generated summary.`;
};

export const generateImproveSummaryPrompt = (data: ImproveSummary) => {
  const { summary, workExperiences } = data;

  const experiencesText = generateExperienceText(workExperiences);

  return `You are a skilled resume expert specializing in improving professional summaries to make them more impactful and effective. Your expertise lies in enhancing existing summaries to better showcase career achievements and potential.

  Your task is to analyze and improve the following professional summary while considering the candidate's work experience. The improved summary should:
  - Be more impactful and engaging while maintaining professionalism
  - Better highlight specific achievements and measurable results
  - Incorporate relevant industry keywords and technical expertise
  - Emphasize leadership abilities and career progression where applicable
  - Focus on unique value propositions that set the candidate apart
  - Maintain an optimal length of 3-5 sentences, ensuring clarity and conciseness.

  Current Summary:
  ${summary}

  Work Experience:
  ${experiencesText}

  Please analyze the current summary and work experience, then provide an improved version that better represents the candidate's qualifications and achievements. Focus on making the summary more compelling while ensuring it aligns with the candidate's experience. Respond only with the improved summary.`;
};

export const generateJobAnalysisPrompt = (data: JobPostingSchema) => {
  const { companyName, jobTitle, roleDescription } = data;

  return `You are an expert job market analyst specializing in dissecting job descriptions to identify key requirements, responsibilities, and qualifications. Your expertise lies in providing clear, actionable insights that help candidates understand the role and align their qualifications effectively.

  Your task is to analyze the following job posting and provide suggestions in a specific JSON format that will help candidates tailor their resume effectively.

  Job Details:
  Company: ${companyName}
  Position: ${jobTitle}

  Job Description:
  ${roleDescription}

  Based on the job description, provide suggestions in the following JSON format:
  {
    "suggestedJobTitle": "A standardized job title that best matches the role description",
    "keywordSuggestions": [
      "Specific keywords that best match the job requirements. Maximum of 15 keywords if applicable.",
      "Example: ['SQL', 'Python', 'React']",
    ]
  }

  Ensure your suggestions are specific, actionable, and directly aligned with the job requirements. Focus on helping candidates position their experience effectively for this role. Respond only in RFC 7159 compliant JSON format.`;
};
