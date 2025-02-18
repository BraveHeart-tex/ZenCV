import { GenerateSummarySchema } from '../validation/generateSummary.schema';
import { ImproveSummaryData } from '../validation/improveSummary.schema';
import { JobPostingSchema } from '../validation/jobPosting.schema';
import { WorkExperience } from '../validation/workExperience.schema';
import { removeHTMLTags } from '@/lib/utils/stringUtils';

const generateExperienceText = (workExperiences: WorkExperience[]) =>
  workExperiences
    .map((exp, index) => {
      return `${index + 1}. **${exp.jobTitle}** at **${exp.employer}** (${exp.startDate} - ${exp.endDate}) | ${exp.city}
 - ${removeHTMLTags(exp.description)}`;
    })
    .join('\n\n');

export const generateResumeSummaryPrompt = (
  workExperiences: GenerateSummarySchema['workExperiences'],
  jobPosting?: GenerateSummarySchema['jobPosting'],
): string => {
  const experiencesText = generateExperienceText(workExperiences);

  const jobPostingSection = jobPosting
    ? `

  Target Position Information:
  Company: ${jobPosting.companyName}
  Position: ${jobPosting.jobTitle}

  Job Description:
  ${jobPosting.roleDescription}
  `
    : '';

  return `You are a skilled resume expert specializing in crafting impactful professional summaries that effectively showcase career achievements and potential. Your expertise lies in creating compelling narratives that immediately capture employers' attention.

  Your task is to create a powerful professional summary (3-5 sentences) that:${
    jobPosting
      ? `
  - Aligns with the target position's requirements and qualifications
  - Emphasizes relevant experience and skills that match the job description`
      : ''
  }
  - Incorporates relevant industry keywords and measurable impacts
  - Maintains a confident, professional tone
  - Highlights leadership abilities and technical expertise where applicable
  - Focuses on unique value propositions and notable accomplishments
  - Emphasizes the candidate's ability to drive results and make a meaningful impact
  - Maintains an optimal length of 3-5 sentences, ensuring clarity and conciseness
  
  Your summary should be tailored to the candidate's qualifications and experiences${jobPosting ? ' and the target position' : ''}, ensuring it effectively communicates their strengths and achievements.

  Based on the following work experience${jobPosting ? ' and job posting' : ''}, craft a summary that positions the candidate as a standout professional:

  Work Experience:

  ${experiencesText}${jobPostingSection}

  ### Response Format:
    - Be concise yet informative.
    - Respond **only** with the generated summary text as a **single string**.
    - **Do not** include any introductions, explanations, or extra formatting.
    - The response should be **directly usable** as the generated summary.
    `;
};

export const generateImproveSummaryPrompt = (data: ImproveSummaryData) => {
  const { summary, workExperiences } = data;

  const jobPosting = data?.jobPosting;

  const experiencesText = generateExperienceText(workExperiences);

  const jobPostingSection = jobPosting
    ? `
  Target Position Information:
  Company: ${jobPosting.companyName}
  Position: ${jobPosting.jobTitle}

  Job Description:
  ${jobPosting.roleDescription}
  `
    : '';

  return `You are a skilled resume expert specializing in improving professional summaries to make them more impactful and effective. Your expertise lies in enhancing existing summaries to better showcase career achievements and potential.

    Your task is to analyze and improve the following professional summary while considering the candidate's work experience${jobPosting ? ' and the target job posting' : ''}. The improved summary should:
    - Better highlight specific achievements and measurable results
    - Incorporate relevant industry keywords and technical expertise
    - Emphasize leadership abilities and career progression where applicable
    - Focus on unique value propositions that set the candidate apart${
      jobPosting
        ? `
    - Align with the requirements and qualifications of the target job posting`
        : ''
    }
    
    Current Summary:
    ${summary}
    
    Work Experience:
    ${experiencesText}${jobPostingSection}
    
    Analyze the current summary and work experience${jobPosting ? ', along with the job posting,' : ''} then provide an improved version that better represents the candidate's qualifications and achievements. Focus on making the summary more compelling while ensuring it aligns with the candidate's experience${jobPosting ? ' and the target job requirements' : ''}.
    
    ### Response Format:
    - Respond **only** with the improved summary text as a **single string**.
    - **Do not** include any introductions, explanations, or extra formatting.
    - The response should be **directly usable** as the improved summary.
`;
};

export const generateJobAnalysisPrompt = (data: JobPostingSchema) => {
  const { companyName, jobTitle, roleDescription } = data;

  return `You are an expert job market analyst specializing in dissecting job descriptions to identify key requirements, responsibilities, and qualifications. Your expertise lies in providing clear, actionable insights that help candidates understand the role and align their qualifications effectively.

  Your task is to analyze the following job posting and provide suggestions in a specific format that will help candidates tailor their resume effectively.

  Job Details:
  Company: ${companyName}
  Position: ${jobTitle}

  Job Description:
  ${roleDescription}

  Based on the job description, provide suggestions in the following format:

  1. Suggested Job Title: A standardized job title that best matches the role description
  2. Keyword Suggestions: A list of only the most relevant and specific skills that directly match the job requirements. Each skill must be explicitly mentioned or strongly implied in the job description. List each skill on a new line with a hyphen (-) prefix. Include a balanced mix of:
      - Technical skills (programming languages, tools, platforms)
      - Domain knowledge (industry-specific expertise, methodologies)
      - Soft skills (only if specifically emphasized in the description)
      Maximum 15 unique skills total.

  Skill Selection Rules:
  1. Each skill MUST be explicitly mentioned or clearly implied in the job description
  2. NO duplicate skills or variations of the same skill
     Examples of duplicates to avoid:
     - "React" vs "ReactJS" vs "React.js" (use only "React")
     - "Node.js" vs "NodeJS" vs "Node" (use only "Node.js")
     - "UI/UX" vs "User Interface Design" (choose the more specific term)
  3. Use standard industry formatting for technical terms:
     - JavaScript (not Javascript or javascript)
     - Node.js (not NodeJS or Node)
     - TypeScript (not Typescript or typescript)
  4. Prioritize specific technical skills over generic terms
  5. Only include soft skills that are explicitly emphasized
  6. Each skill must be unique and distinct in meaning

  Format your response exactly as shown below:
  Suggested Job Title: [Single standardized title]

  Keyword Suggestions:
  - [Skill 1]
  - [Skill 2]
  - [Skill 3]
  (etc...)

  Note: Ensure each skill is truly unique and provides distinct value. Do not list skills that overlap in meaning or represent the same core competency. Respond with a list of unique skills without any duplicates.`;
};
