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

  return `
You are a **job market analyst** specializing in dissecting job descriptions to extract **clear, actionable insights** for resume tailoring.

---

### Task
Analyze the following job posting and return:
1. **A standardized job title** that best describes the role.
2. **A clean, line-separated list of unique, relevant skills** (max 15) extracted from the job description — including:
   - Hard skills (tech/tools/languages)
   - Domain knowledge (methodologies, frameworks)
   - Soft skills (only if clearly emphasized)

---

### Job Posting
**Company:** ${companyName}  
**Position:** ${jobTitle}

**Job Description:**  
${roleDescription}

---

### ✍️ Response Format
Respond *exactly* as shown:

**Suggested Job Title:**  
[Single best-fit title]

**Keyword Suggestions:**  
Skill 1  
Skill 2  
Skill 3  
... up to 15 max

---

### Skill Selection Rules
- Only include skills that are **explicitly mentioned** or **strongly implied** in the job description.
- Avoid **duplicates or variants** (e.g., use only “React” not “ReactJS” or “React.js”).
- Use **standard industry spelling and capitalization**, e.g.:
  - JavaScript (not javascript)
  - Node.js (not NodeJS)
  - TypeScript (not typescript)
- Prefer **specific tools or technologies** over vague terms (e.g., “PostgreSQL” over “databases”).
- Include **soft skills only if clearly emphasized** (e.g., “strong communication” or “cross-functional collaboration”).
- Do **not** prefix skills with symbols, numbers, or dashes — just list each skill on a new line.

---

### Output Constraints
- **Do not** include extra explanations, headings, or markdown.
- Return only the content in the specified format: title + skill list.
- Make sure each skill is **distinct**, correctly spelled, and properly capitalized.
  `.trim();
};
