import { GenerateSummarySchema } from '@/lib/validation/generateSummary.schema';
import { ImproveSummaryData } from '@/lib/validation/improveSummary.schema';
import { JobPostingSchema } from '@/lib/validation/jobPosting.schema';
import { WorkExperience } from '@/lib/validation/workExperience.schema';
import { removeHTMLTags } from '@/lib/utils/stringUtils';

const generateExperienceText = (workExperiences: WorkExperience[]) =>
  workExperiences
    .map((exp, index) => {
      return `${index + 1}. **${exp.jobTitle}** at **${exp.employer}** (${exp.startDate} - ${exp.endDate}) | ${exp.city}
 - ${removeHTMLTags(exp.description)}`;
    })
    .join('\n\n');

interface GenerateResumeSummaryPromptParams {
  workExperiences: GenerateSummarySchema['workExperiences'];
  jobPosting?: GenerateSummarySchema['jobPosting'];
  customPrompt?: string;
}

export const generateResumeSummaryPrompt = ({
  workExperiences,
  jobPosting,
  customPrompt,
}: GenerateResumeSummaryPromptParams): string => {
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

  if (customPrompt?.trim()) {
    return `
    ### Role:
    You are a professional AI assistant helping to craft resume summaries that are impactful, relevant, and aligned with job requirements.
    
    ### Custom Instructions:
    ${customPrompt.trim()}
    
    ### Input:
    **Candidate's Work Experience:**
    ${experiencesText}
    
    ${jobPosting ? `**Target Job Description:**\n${jobPostingSection}` : ''}
    
    ### Guidelines:
    - Respond with a **3-5 sentence** resume summary.
    - Focus on **skills, achievements, and measurable impact**.
    - Align with the **tone and focus** requested above.
    - Maintain a **professional, confident tone**.
    - Avoid generic fluff or vague statements.
    - Use **industry-relevant keywords**.
    - Avoid repeating job titles or basic duties.
    
    ### Output Format:
    - Respond **only** with the summary text (no headings, labels, or Markdown).
    - Your response must be **directly usable** in a resume to attract employers.
    `.trim();
  }

  return `
  ### Role:
  You are a professional **resume-writing expert**. Your task is to craft powerful, concise, and targeted resume summaries that position candidates as top-tier professionals.
  
  ### Objective:
  Write a **3-5 sentence** professional summary that:
  - Highlights **key achievements**, **technical or leadership skills**, and **quantifiable impact**.
  - Uses a **confident, polished, and professional tone**.
  - Includes **industry-relevant keywords** and avoids filler language.
  - ${
    jobPosting
      ? 'Is tailored to the **target role**, aligning with the job description and required qualifications.'
      : 'Emphasizes the candidate’s **unique strengths**, **domain expertise**, and **career highlights**.'
  }
  - Avoids generic descriptions of duties or soft skills.
  - Reads like it belongs at the top of a competitive, modern resume.
  
  ### Input:
  **Candidate's Work Experience:**
  ${experiencesText}
  
  ${jobPosting ? `**Target Job Posting:**\n${jobPostingSection}` : ''}
  
  ### Output Instructions:
  - Respond **only** with the final resume summary.
  - **Do not** include headings, labels, formatting (like Markdown), or any explanations.
  - The summary should be **immediately usable** in a resume and designed to attract recruiters and hiring managers.
  `.trim();
};

export const generateImproveSummaryPrompt = (data: ImproveSummaryData) => {
  const { summary, workExperiences, jobPosting, refinementPrompt } = data;
  const experiencesText = generateExperienceText(workExperiences);

  const jobPostingSection = jobPosting
    ? `
**Target Role:**
- **Company:** ${jobPosting.companyName}
- **Position:** ${jobPosting.jobTitle}

**Job Description:**  
${jobPosting.roleDescription}
`
    : '';

  const refinementSection = refinementPrompt?.trim()
    ? `
### Additional Instructions:
${refinementPrompt.trim()}
`
    : '';

  return `
### Role:
You are an expert **resume writer**. Your task is to **enhance and improve** an existing professional summary to increase its effectiveness and alignment with the candidate's goals.

### Objective:
Improve the summary to ensure it:
- Communicates **impactful achievements** with specific and measurable outcomes.
- Emphasizes **career progression, leadership, and technical depth**.
- Uses **relevant industry keywords** and a **professional, confident tone**.
- Stands out by highlighting the candidate’s **unique strengths**.
${jobPosting ? '- Is clearly tailored to the **target job description** and role expectations.' : ''}
- Is concise, polished, and **resume-ready**.

${refinementSection}

### Input:
**Current Summary:**  
${summary}

**Candidate's Work Experience:**  
${experiencesText}

${jobPostingSection}

### Output Instructions:
- Respond with the **text only**, exactly as it should appear in a resume.
- **Do not** include any headings, notes, surrounding quotes, or explanations.
- The output must be **ready to paste directly into a resume**.
`.trim();
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
