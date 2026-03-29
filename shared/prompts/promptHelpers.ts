import type { GenerateBulletsSchema } from '../schemas/generateBullets.schema';
import type { GenerateSummarySchema } from '../schemas/generateSummary.schema';
import type { ImproveSummaryData } from '../schemas/improveSummary.schema';
import type { JobPostingSchema } from '../schemas/jobPosting.schema';
import type { WorkExperience } from '../schemas/workExperience.schema';
import { removeHTMLTags } from '../stringUtils';

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
  jobKeywords?: GenerateSummarySchema['jobKeywords'];
  customPrompt?: string;
}

const getJobKeywordsSection = (jobKeywords?: string[]) => {
  if (!jobKeywords?.length) {
    return '';
  }

  return `
### Preferred Job Keywords
${jobKeywords.map((keyword) => `- ${keyword}`).join('\n')}
`;
};

export const generateResumeSummaryPrompt = ({
  workExperiences,
  jobPosting,
  jobKeywords,
  customPrompt,
}: GenerateResumeSummaryPromptParams): string => {
  const experiencesText = generateExperienceText(workExperiences);
  const jobKeywordsSection = getJobKeywordsSection(jobKeywords);

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
    ${jobKeywordsSection}

    ### Guidelines:
    - Respond with a **3-5 sentence** resume summary.
    - Focus on **skills, achievements, and measurable impact**.
    - Align with the **tone and focus** requested above.
    - Maintain a **professional, confident tone**.
    - Avoid generic fluff or vague statements.
    - Use **industry-relevant keywords** only when they are clearly supported by the candidate's actual work experience.
    - Prefer the provided job keywords when they genuinely match the candidate's background.
    - If a requested or job-related keyword is not evidenced by the work experience, do not include it.
    - Avoid repeating job titles or basic duties.

    ### Output Format:
    - Respond **only** with the summary text (no headings, labels, or Markdown).
    - Your response must be **directly usable** in a resume to attract employers.
    - Use only standard ASCII punctuation. Do NOT use Unicode dashes (‑ – —), smart quotes (" " ' '), or non-breaking spaces.
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
  ${jobKeywordsSection}

  ### Output Instructions:
  - Respond **only** with the final resume summary.
  - **Do not** include headings, labels, formatting (like Markdown), or any explanations.
  - The summary should be **immediately usable** in a resume and designed to attract recruiters and hiring managers.
  - When job keywords are provided, weave in only the strongest matching ones from the candidate's experience.
  - Never imply the candidate used a tool, skill, or domain they did not actually demonstrate in the source experience.
  - Prefer evidence-backed keywords over broad buzzwords.
  - Use only standard ASCII punctuation. Do NOT use Unicode dashes (‑ – —), smart quotes (" " ' '), or non-breaking spaces.
  `.trim();
};

export const generateImproveSummaryPrompt = (data: ImproveSummaryData) => {
  const {
    summary,
    workExperiences,
    jobPosting,
    jobKeywords,
    refinementPrompt,
  } = data;
  const experiencesText = generateExperienceText(workExperiences);
  const jobKeywordsSection = getJobKeywordsSection(jobKeywords);

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
${jobKeywordsSection}

### Output Instructions:
- Respond with the **text only**, exactly as it should appear in a resume.
- **Do not** include any headings, notes, surrounding quotes, or explanations.
- The output must be **ready to paste directly into a resume**.
- Retain the intent of the current summary while improving relevance and specificity.
- Use provided job keywords only when they are supported by the candidate's work history.
- Do not add tools, domains, seniority, certifications, or achievements that are not evidenced in the source experience.
- Prefer the most relevant 2-4 matching keywords instead of stuffing many keywords into the summary.
- Use only standard ASCII punctuation. Do NOT use Unicode dashes (‑ – —), smart quotes (" " ' '), or non-breaking spaces.
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

### Response Format
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
- Use only standard ASCII punctuation. Do NOT use Unicode dashes (‑ – —), smart quotes (" " ' '), or non-breaking spaces.
  `.trim();
};

interface GenerateBulletSuggestionsPromptParams {
  workExperience: GenerateBulletsSchema['workExperience'];
  jobPosting?: GenerateBulletsSchema['jobPosting'];
  roughNotes?: string;
}

export const generateBulletSuggestionsPrompt = ({
  workExperience,
  jobPosting,
  roughNotes,
}: GenerateBulletSuggestionsPromptParams) => {
  const experienceText = generateExperienceText([workExperience]);

  const jobPostingSection = jobPosting
    ? `
### Target Job Posting
- Company: ${jobPosting.companyName}
- Role: ${jobPosting.jobTitle}

${jobPosting.roleDescription}
`
    : '';

  const roughNotesSection = roughNotes?.trim()
    ? `
### Candidate Rough Notes
${roughNotes.trim()}
`
    : '';

  return `
### Role
You are an expert resume writer creating strong work experience bullet points.

### Objective
Generate 3 to 5 bullet point suggestions for the candidate's work experience entry.

### Source Experience
${experienceText}

${roughNotesSection}
${jobPostingSection}

### Writing Rules
- Each bullet must be a single resume-ready bullet point.
- Start with a strong action verb.
- Focus on achievements, ownership, and measurable outcomes whenever possible.
- Use details from the target job posting when provided, but do not invent facts.
- If exact metrics are not available, write specific and credible impact without making up numbers.
- Keep each bullet concise and practical for a resume.
- Do not repeat the same idea across bullets.

### Output Rules
- Return only bullet point text values suitable for a structured JSON array.
- Do not include markdown bullets, numbering, headings, or explanations.
- Use only standard ASCII punctuation. Do NOT use Unicode dashes (‑ – —), smart quotes (" " ' '), or non-breaking spaces.
`.trim();
};
