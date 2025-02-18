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
      Target Role:
      - **Company:** ${jobPosting.companyName}
      - **Position:** ${jobPosting.jobTitle}
      
      **Job Description:**  
      ${jobPosting.roleDescription}
      `
    : '';

  return `### Role:
      You are a **resume-writing expert** specializing in creating compelling professional summaries that highlight achievements, skills, and impact.
    
      ### Task:
      Generate a **3-5 sentence** professional summary that:
      - Showcases **key achievements, skills, and measurable impacts**.
      - Maintains a **confident, professional tone**.
      - Incorporates **industry-relevant keywords**.
      - ${jobPosting ? 'Aligns with the **target role’s qualifications and job description**.' : 'Emphasizes the candidate’s unique value propositions.'}
      - Highlights **leadership, technical expertise, and problem-solving skills** when applicable.
      - Is **concise, direct, and impactful**.
    
      ### Input:
      **Candidate's Work Experience:**
      ${experiencesText}${jobPostingSection}
    
      ### Output Format:
      - Respond **only** with the generated summary as a **single string**.
      - **Do not** include introductions, explanations, or extra formatting.
      - The response must be **immediately usable** as the candidate’s professional summary.
      `;
};

export const generateImproveSummaryPrompt = (data: ImproveSummaryData) => {
  const { summary, workExperiences, jobPosting } = data;
  const experiencesText = generateExperienceText(workExperiences);

  const jobPostingSection = jobPosting
    ? `
  **Target Position:**
  - **Company:** ${jobPosting.companyName}
  - **Position:** ${jobPosting.jobTitle}
  
  **Job Description:**  
  ${jobPosting.roleDescription}
  `
    : '';

  return `### Role:
  You are a **resume-writing expert** specializing in **improving** professional summaries to make them more impactful and aligned with career goals.

  ### Task:
  **Enhance** the given professional summary while ensuring it:
  - **Strengthens** achievements with specific results and measurable impacts.
  - **Incorporates** industry-relevant keywords and technical expertise.
  - **Emphasizes** leadership, problem-solving, and career progression.
  - **Highlights** unique value propositions that differentiate the candidate.
  ${jobPosting ? '- **Aligns** with the target job’s qualifications and expectations.' : ''}

  ### Input:
  **Current Summary:**  
  ${summary}
  
  **Candidate's Work Experience:**  
  ${experiencesText}${jobPostingSection}

  ### Output Format:
  - Respond **only** with the improved summary as a **single string**.
  - **Do not** include introductions, explanations, or extra formatting.
  - The response must be **immediately usable** as the candidate’s professional summary.
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
